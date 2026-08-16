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

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-cinebot-chat', handleOpenChat);
    return () => window.removeEventListener('open-cinebot-chat', handleOpenChat);
  }, []);

  // Detect movie or actor context from URL
  const getContextFromUrl = (): { type: 'movie' | 'actor'; id: string } | null => {
    const movieMatch = location.pathname.match(/^\/movie\/(\d+)/);
    if (movieMatch) return { type: 'movie', id: movieMatch[1] };

    const actorMatch = location.pathname.match(/^\/actor\/(\d+)/);
    if (actorMatch) return { type: 'actor', id: actorMatch[1] };

    return null;
  };

  const [pageCtx, setPageCtx] = useState<{ type: 'movie' | 'actor'; id: string; name?: string } | null>(null);
  const [contextDetails, setContextDetails] = useState<any>(null);

  useEffect(() => {
    const ctx = getContextFromUrl();
    if (!ctx) {
      setPageCtx(null);
      setContextDetails(null);
      return;
    }

    const langParam = i18n.language?.startsWith('en') ? 'en-US' : 'vi-VN';
    if (ctx.type === 'movie') {
      fetch(`/api/movies/${ctx.id}?lang=${langParam}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.data?.title) {
            setPageCtx({ type: 'movie', id: ctx.id, name: data.data.title });
            setContextDetails({
              title: data.data.title,
              overview: data.data.overview,
              rating: data.data.vote_average,
              releaseDate: data.data.release_date,
              cast: data.data.cast?.slice(0, 5).map((c: any) => c.name).join(', ')
            });
          } else {
            setPageCtx(ctx);
          }
        })
        .catch(() => setPageCtx(ctx));
    } else if (ctx.type === 'actor') {
      fetch(`/api/actors/${ctx.id}?lang=${langParam}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.data?.name) {
            setPageCtx({ type: 'actor', id: ctx.id, name: data.data.name });
            setContextDetails({
              name: data.data.name,
              overview: data.data.biography,
              rating: data.data.popularity,
              releaseDate: data.data.birthday,
              cast: data.data.landmark_works?.join(', ')
            });
          } else {
            setPageCtx(ctx);
          }
        })
        .catch(() => setPageCtx(ctx));
    }
  }, [location.pathname, i18n.language]);

  const welcomeText = pageCtx?.name
    ? pageCtx.type === 'movie'
      ? `Xin chào! Tôi là CineBot AI. Tôi thấy bạn đang xem **${pageCtx.name}** — hỏi tôi bất cứ điều gì về bộ phim này nhé!`
      : `Xin chào! Tôi là CineBot AI. Tôi thấy bạn đang xem trang của diễn viên **${pageCtx.name}** — hỏi tôi bất cứ điều gì về sự nghiệp và tác phẩm của diễn viên này nhé!`
    : 'Xin chào! Tôi là CineBot AI. Bạn cần tư vấn về bộ phim, diễn viên, đạo diễn hay gợi ý tác phẩm điện ảnh nào hôm nay?';

  const initialFollowUps = pageCtx?.name
    ? pageCtx.type === 'movie'
      ? [
        `Tóm tắt nội dung phim ${pageCtx.name}?`,
        `Diễn viên nào nổi bật nhất trong ${pageCtx.name}?`,
        `${pageCtx.name} đã giành những giải thưởng nào?`,
        `Đánh giá phim ${pageCtx.name} có hay không?`
      ]
      : [
        `Tiểu sử và sự nghiệp của ${pageCtx.name}?`,
        `Các phim hay nhất của ${pageCtx.name}?`,
        `${pageCtx.name} đã đoạt những giải thưởng lớn nào?`,
        `Cột mốc sự nghiệp nổi bật của ${pageCtx.name}?`
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

  // Reactively update CineBot AI initial message & suggestions when navigating to a new movie or actor detail page
  useEffect(() => {
    if (pageCtx?.name) {
      const followUps = pageCtx.type === 'movie'
        ? [
          `Tóm tắt nội dung phim ${pageCtx.name}?`,
          `Diễn viên nào nổi bật nhất trong ${pageCtx.name}?`,
          `${pageCtx.name} đã giành những giải thưởng nào?`,
          `Đánh giá phim ${pageCtx.name} có hay không?`
        ]
        : [
          `Tiểu sử và sự nghiệp của ${pageCtx.name}?`,
          `Các phim hay nhất của ${pageCtx.name}?`,
          `${pageCtx.name} đã đoạt những giải thưởng lớn nào?`,
          `Cột mốc sự nghiệp nổi bật của ${pageCtx.name}?`
        ];

      const greeting = pageCtx.type === 'movie'
        ? `Xin chào! Tôi là CineBot AI. Tôi thấy bạn đang xem **${pageCtx.name}** — hỏi tôi bất cứ điều gì về bộ phim này nhé!`
        : `Xin chào! Tôi là CineBot AI. Tôi thấy bạn đang xem trang của diễn viên **${pageCtx.name}** — hỏi tôi bất cứ điều gì về sự nghiệp và tác phẩm của diễn viên này nhé!`;

      setMessages([
        {
          id: `welcome-${pageCtx.type}-${pageCtx.id}`,
          sender: 'ai',
          text: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          followUpQuestions: followUps
        }
      ]);
    }
  }, [pageCtx]);

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

      const contextPrefix = pageCtx?.name
        ? pageCtx.type === 'movie'
          ? `[Khán giả đang xem phim "${pageCtx.name}"] `
          : `[Khán giả đang xem diễn viên "${pageCtx.name}"] `
        : '';

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: contextPrefix + textToSend,
          history: historyPayload,
          contextData: contextDetails
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Hệ thống AI hiện đang gặp sự cố. Vui lòng kiểm tra cấu hình API key.');
      }

      const aiReply = data.reply;
      const followUpQuestions: string[] = data.followUpQuestions || [
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
          text: `⚠️ **Lỗi AI**: ${(err as Error).message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          followUpQuestions: [
            'Thử lại với câu hỏi khác',
            'Gợi ý phim Oscar hay nhất'
          ]
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Lock body scroll when chatbot window is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const activeFollowUps = [...messages].reverse().find((m) => m.sender === 'ai' && m.followUpQuestions && m.followUpQuestions.length > 0)?.followUpQuestions || initialFollowUps;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans left-4 sm:left-auto pointer-events-none flex justify-end">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto group px-4 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-black rounded-full shadow-2xl flex items-center space-x-2.5 transition transform hover:scale-105 active:scale-95 cursor-pointer border border-amber-300/40"
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
        <div className="pointer-events-auto glass-panel-glow w-full sm:w-[400px] h-[calc(100dvh-5rem)] max-h-[540px] rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col overflow-hidden animate-fade-in bg-slate-950/95 backdrop-blur-xl">
          {/* Window Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-100 flex items-center space-x-1.5">
                  <span>CineBot AI</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30">Gemini 3.6 Flash</span>
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
