import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bot, Send, X, Sparkles, User as UserIcon, MessageSquare, Minimize2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Lightweight Markdown renderer — supports **bold**, *italic*, `code`, - lists, newlines
const renderMarkdown = (text: string): React.ReactNode[] => {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    const isBullet = /^[-*]\s+/.test(line);
    const content = isBullet ? line.replace(/^[-*]\s+/, '') : line;

    // Parse inline: **bold**, *italic*, `code`
    const parseInline = (raw: string): React.ReactNode[] => {
      const parts: React.ReactNode[] = [];
      const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(raw)) !== null) {
        if (match.index > lastIndex) parts.push(raw.slice(lastIndex, match.index));
        const token = match[0];
        if (token.startsWith('`')) {
          parts.push(<code key={match.index} style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', borderRadius: '4px', padding: '0 4px', fontFamily: 'monospace' }}>{token.slice(1, -1)}</code>);
        } else if (token.startsWith('**')) {
          parts.push(<strong key={match.index} style={{ color: '#fde68a', fontWeight: 700 }}>{token.slice(2, -2)}</strong>);
        } else {
          parts.push(<em key={match.index} style={{ color: '#cbd5e1', fontStyle: 'italic' }}>{token.slice(1, -1)}</em>);
        }
        lastIndex = match.index + token.length;
      }
      if (lastIndex < raw.length) parts.push(raw.slice(lastIndex));
      return parts;
    };

    if (isBullet) {
      result.push(
        <div key={lineIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', margin: '2px 0' }}>
          <span style={{ color: '#f59e0b', marginTop: '1px', flexShrink: 0 }}>•</span>
          <span>{parseInline(content)}</span>
        </div>
      );
    } else if (content.trim() === '') {
      result.push(<br key={lineIdx} />);
    } else {
      result.push(<p key={lineIdx} style={{ margin: '2px 0' }}>{parseInline(content)}</p>);
    }
  });

  return result;
};

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  followUpQuestions?: string[];
}

export const AIChatbot: React.FC = () => {
  const location = useLocation();
  const { i18n } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Detect movie context from URL
  const getMovieContext = (): { id: string; title?: string } | null => {
    const match = location.pathname.match(/^\/movie\/(\d+)/);
    if (!match) return null;
    return { id: match[1] };
  };

  const [movieCtx, setMovieCtx] = useState<{ id: string; title?: string } | null>(null);

  useEffect(() => {
    const ctx = getMovieContext();
    if (ctx) {
      const langParam = i18n.language?.startsWith('en') ? 'en-US' : 'vi-VN';
      fetch(`/api/movies/${ctx.id}?lang=${langParam}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.data?.title) {
            setMovieCtx({ id: ctx.id, title: data.data.title });
          } else {
            setMovieCtx(ctx);
          }
        })
        .catch(() => setMovieCtx(ctx));
    } else {
      setMovieCtx(null);
    }
  }, [location.pathname, i18n.language]);

  const welcomeText = movieCtx?.title
    ? `Xin chào! Tôi là CineBot AI. Tôi thấy bạn đang xem **${movieCtx.title}** — hỏi tôi bất cứ điều gì về bộ phim này nhé!`
    : 'Xin chào! Tôi là CineBot AI. Bạn cần tư vấn về bộ phim, diễn viên, đạo diễn hay gợi ý tác phẩm điện ảnh nào hôm nay?';

  const initialFollowUps = movieCtx?.title
    ? [
      `Tóm tắt nội dung phim ${movieCtx.title}?`,
      `Diễn viên nào nổi bật nhất trong ${movieCtx.title}?`,
      `${movieCtx.title} đã giành những giải thưởng nào?`,
      `Đánh giá phim ${movieCtx.title} có hay không?`
    ]
    : [
      'Gợi ý phim Oscar hay nhất',
      'Top 5 phim của Christopher Nolan',
      'Tom Holland đã đoạt giải gì?',
      'Phim đoạt nhiều Oscar nhất lịch sử'
    ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: welcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      followUpQuestions: initialFollowUps
    }
  ]);

  // Reactively update CineBot AI initial message & suggestions when navigating to a new movie detail page
  useEffect(() => {
    if (movieCtx?.title) {
      const movieFollowUps = [
        `Tóm tắt nội dung phim ${movieCtx.title}?`,
        `Diễn viên nào nổi bật nhất trong ${movieCtx.title}?`,
        `${movieCtx.title} đã giành những giải thưởng nào?`,
        `Đánh giá phim ${movieCtx.title} có hay không?`
      ];
      setMessages([
        {
          id: `welcome-${movieCtx.id}`,
          sender: 'ai',
          text: `Xin chào! Tôi là CineBot AI. Tôi thấy bạn đang xem **${movieCtx.title}** — hỏi tôi bất cứ điều gì về bộ phim này nhé!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          followUpQuestions: movieFollowUps
        }
      ]);
    }
  }, [movieCtx]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setIsTyping(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      // Inject movie context prefix if on movie page
      const contextPrefix = movieCtx?.title
        ? `[Người dùng đang xem trang phim "${movieCtx.title}" trên CineWiki] `
        : '';

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: contextPrefix + textToSend,
          history: historyPayload
        })
      });

      const data = await res.json();
      const aiReply = data.success && data.reply ? data.reply : 'CineBot AI: Rất tiếc tôi đang bảo trì kết nối, bạn thử lại sau ít phút nhé!';
      const followUpQuestions: string[] = data.success && data.followUpQuestions ? data.followUpQuestions : [
        'Gợi ý thêm tác phẩm điện ảnh xuất sắc?',
        'Chi tiết về các giải thưởng lớn?',
        'Thông tin về dàn diễn viên chính?'
      ];

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUpQuestions
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: 'CineBot AI: Đã xảy ra sự cố kết nối. Vui lòng kiểm tra lại mạng!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          followUpQuestions: [
            'Gợi ý phim Oscar hay nhất',
            'Top 5 phim của Christopher Nolan'
          ]
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const activeFollowUps = [...messages].reverse().find((m) => m.sender === 'ai' && m.followUpQuestions && m.followUpQuestions.length > 0)?.followUpQuestions || initialFollowUps;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group px-4 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-black rounded-full shadow-2xl flex items-center space-x-2.5 transition transform hover:scale-105 active:scale-95 cursor-pointer border border-amber-300/40"
        >
          <div className="relative">
            <Bot className="w-5 h-5 fill-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span className="text-xs tracking-wide">CineBot AI</span>
        </button>
      )}

      {/* Chatbot Window Drawer */}
      {isOpen && (
        <div className="glass-panel-glow w-[360px] sm:w-[400px] h-[540px] rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col overflow-hidden animate-fade-in bg-slate-950/95 backdrop-blur-xl">
          {/* Window Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-100 flex items-center space-x-1.5">
                  <span>CineBot AI</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30">Gemini Lite</span>
                </h3>

              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800 transition"
              title="Đóng Chatbot"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-[10px] ${msg.sender === 'user' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 border border-amber-500/30 text-amber-400'
                    }`}
                >
                  {msg.sender === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div className={`max-w-[82%] space-y-1.5 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`p-3 rounded-2xl leading-relaxed text-slate-200 ${msg.sender === 'user'
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-100 rounded-tr-none'
                      : 'bg-slate-900/90 border border-slate-800 rounded-tl-none'
                      }`}
                  >
                    {msg.sender === 'ai' ? renderMarkdown(msg.text) : msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 px-1 block">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-slate-400 p-2">
                <Bot className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="text-[11px] italic">CineBot đang suy nghĩ...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Persistent Active Follow-up Chips Footer */}
          {activeFollowUps && activeFollowUps.length > 0 && (
            <div className="px-3 py-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 bg-slate-900/60 backdrop-blur-md">
              <span className="w-full text-[9px] font-bold uppercase tracking-wider text-amber-400/80 flex items-center space-x-1 mb-0.5">
                <MessageSquare className="w-3 h-3 text-amber-400" />
                <span>Gợi ý nhanh cho bạn:</span>
              </span>
              {activeFollowUps.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 transition text-left truncate max-w-full font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Hỏi CineBot về phim, diễn viên..."
              className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl text-xs text-slate-100 focus:outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isTyping}
              className="p-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
