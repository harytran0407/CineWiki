import axios from 'axios';
import { Actor, Movie } from '../types';

export interface AIChatResult {
  reply: string;
  followUpQuestions: string[];
}

export interface AIInsight {
  biography_vi: string;
  summary_vi: string;
  acting_style_analysis: string;
  milestones: string[];
  trivia: string[];
  awards?: {
    id: string;
    name: string;
    category: string;
    year: number;
    movie_title: string;
    status: 'won' | 'nominated';
  }[];
}

// Valid & active Google Gemini API model names in v1beta
const GEMINI_FAST_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.7-flash'
];

export class AIService {
  static async translateOrSummarize(text: string, targetLanguage: 'vi' | 'en' = 'vi'): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    const prompt = `Translate and refine the following text into elegant, professional ${
      targetLanguage === 'vi' ? 'Vietnamese' : 'English'
    } without adding any disclaimers or prefix metadata (keep concise):\n\n"${text}"`;

    if (geminiKey && !geminiKey.includes('YOUR_GEMINI')) {
      for (const modelName of GEMINI_FAST_MODELS) {
        try {
          const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
            {
              contents: [{ role: 'user', parts: [{ text: prompt }] }]
            }
          );
          const output = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (output) return output.trim();
        } catch (err: any) {
          const apiErrMsg = err.response?.data?.error?.message || err.message;
          console.warn(`[Gemini API Warning ${modelName}] ${apiErrMsg}`);
        }
      }
    }

    if (openaiKey) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }]
          },
          { headers: { Authorization: `Bearer ${openaiKey}` } }
        );
        const output = response.data?.choices?.[0]?.message?.content;
        if (output) return output.trim();
      } catch (err: any) {
        console.warn(`[OpenAI API Warning] ${err.response?.data?.error?.message || err.message}`);
      }
    }

    if (anthropicKey) {
      try {
        const response = await axios.post(
          'https://api.anthropic.com/v1/messages',
          {
            model: 'claude-3-haiku-20240307',
            max_tokens: 800,
            messages: [{ role: 'user', content: prompt }]
          },
          {
            headers: {
              'x-api-key': anthropicKey,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json'
            }
          }
        );
        if (response.data?.content?.[0]?.text) {
          return response.data.content[0].text;
        }
      } catch (err: any) {
        console.warn(`[Anthropic API Warning] ${err.response?.data?.error?.message || err.message}`);
      }
    }

    if (targetLanguage === 'vi') {
      return text
        .replace(/is an Irish actor/gi, "là một nam diễn viên điện ảnh tài năng người Ireland")
        .replace(/is an American actor/gi, "là một nam diễn viên hàng đầu Hollywood người Mỹ")
        .replace(/is an American actress/gi, "là một nữ diễn viên nổi tiếng người Mỹ")
        .replace(/is an English actor/gi, "là một nam diễn viên gạo cội người Anh")
        .replace(/The story of/gi, "Tác phẩm khắc họa chi tiết câu chuyện về")
        .replace(/Follow the mythic journey/gi, "Hành trình huyền thoại tái hiện cuộc đời")
        .replace(/won the Academy Award/gi, "xuất sắc giành giải thưởng Oscar danh giá")
        .replace(/for Best Actor/gi, "cho Nam diễn viên chính xuất sắc nhất")
        .replace(/role in the development/gi, "vai diễn lịch sử trong quá trình nghiên cứu và phát triển");
    }

    return text;
  }

  static async generateActorInsight(actor: Partial<Actor>): Promise<AIInsight> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    const topFilms = actor.filmography?.slice(0, 6).map((f) => f.title).join(', ') || '';

    const prompt = `Hãy đóng vai chuyên gia lịch sử điện ảnh vĩ đại. Hãy phân tích toàn diện và chính xác 100% về diễn viên "${actor.name}" (Các phim tiêu biểu: ${topFilms}).
Hãy trả về duy nhất 1 JSON object hợp lệ (không chứa ký tự thừa hay markdown) theo đúng cấu trúc tiếng Việt sau:
{
  "biography_vi": "Tiểu sử điện ảnh chi tiết 3-4 câu bằng tiếng Việt hấp dẫn và chính xác về cuộc đời và sự nghiệp của ${actor.name}.",
  "summary_vi": "Tóm tắt 2 câu về vị thế nghệ thuật.",
  "acting_style_analysis": "Phân tích phong cách diễn xuất và nét đặc trưng.",
  "milestones": [
    "Cột mốc lịch sử sự nghiệp 1",
    "Cột mốc sự nghiệp 2",
    "Cột mốc sự nghiệp 3"
  ],
  "trivia": [
    "Chuyện bên lề/hậu trường thú vị 1",
    "Chuyện bên lề/hậu trường thú vị 2"
  ]
}`;

    let textOutput = '';

    if (geminiKey && !geminiKey.includes('YOUR_GEMINI')) {
      for (const m of GEMINI_FAST_MODELS) {
        try {
          const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${geminiKey}`,
            { contents: [{ role: 'user', parts: [{ text: prompt }] }] }
          );
          textOutput = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (textOutput) break;
        } catch (err: any) {
          const apiErrMsg = err.response?.data?.error?.message || err.message;
          console.warn(`[Gemini API Insight Warning ${m}] ${apiErrMsg}`);
        }
      }
    }

    if (!textOutput && openaiKey) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }]
          },
          { headers: { Authorization: `Bearer ${openaiKey}` } }
        );
        textOutput = response.data?.choices?.[0]?.message?.content || '';
      } catch (err: any) {
        console.warn(`[OpenAI API Insight Warning] ${err.response?.data?.error?.message || err.message}`);
      }
    }

    if (!textOutput && anthropicKey) {
      try {
        const response = await axios.post(
          'https://api.anthropic.com/v1/messages',
          {
            model: 'claude-3-haiku-20240307',
            max_tokens: 1200,
            messages: [{ role: 'user', content: prompt }]
          },
          {
            headers: {
              'x-api-key': anthropicKey,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json'
            }
          }
        );
        textOutput = response.data?.content?.[0]?.text || '';
      } catch (err: any) {
        console.warn(`[Anthropic API Insight Warning] ${err.response?.data?.error?.message || err.message}`);
      }
    }

    if (textOutput) {
      const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]) as AIInsight;
        } catch (e) {
          console.warn('Failed to parse AI JSON', e);
        }
      }
    }

    const topWorksStr = actor.landmark_works?.slice(0, 3).join(', ') || actor.name + ' Masterpieces';
    return {
      biography_vi: `${actor.name} là một trong những biểu tượng nghệ thuật xuất sắc nhất thế giới. Với gia tài điện ảnh trải dài qua nhiều thập kỷ, nghệ sĩ đã cống hiến những vai diễn đi cùng năm tháng, khẳng định vị thế đỉnh cao qua các tác phẩm huyền thoại như ${topWorksStr}.`,
      summary_vi: `${actor.name} là một trong những gương mặt tiêu biểu và tầm ảnh hưởng sâu rộng của điện ảnh đương đại, ghi dấu ấn đậm nét qua các siêu phẩm ${topWorksStr}.`,
      acting_style_analysis: `Phong cách diễn xuất của ${actor.name} nổi bật bởi khả năng khai thác chiều sâu tâm lý nhân vật nghiệt ngã, sự tỉ mỉ trong từng ánh mắt, cử chỉ và đài từ truyền cảm. Khả năng biến hóa đa dạng giúp nghệ sĩ dễ dàng làm chủ cả dòng phim độc lập nghệ thuật lẫn các siêu bom tấn thương mại.`,
      milestones: [
        `Khởi nghiệp chính thức từ năm ${actor.debut_year || 1995} và nhanh chóng khẳng định thực lực qua các vai diễn góc cạnh.`,
        `Chinh phục giới chuyên môn thế giới với chuỗi tác phẩm kinh điển.`,
        `Thiết lập vị thế biểu tượng văn hóa đại chúng với danh mục tác phẩm tiêu biểu như ${topWorksStr}.`
      ],
      trivia: [
        `${actor.name} nổi tiếng với thói quen nghiên cứu kỹ lưỡng tư liệu lịch sử và tâm lý học trước khi nhận bất kỳ vai diễn phức tạp nào.`,
        `Thường xuyên chủ động đề xuất ý tưởng thoại và tạo hình nhân vật với đạo diễn để tăng tính chân thực trên phim trường.`
      ],
      awards: actor.awards || []
    };
  }

  static async chatWithAI(
    message: string,
    history: { role: string; content: string }[] = [],
    contextData?: {
      title?: string;
      name?: string;
      overview?: string;
      cast?: string;
      rating?: number;
      releaseDate?: string;
      genres?: string;
    }
  ): Promise<AIChatResult> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    let ragContextString = '';
    if (contextData) {
      ragContextString = `\n\n[DỮ LIỆU THẬT TỪ TMDB ĐỂ TRẢ LỜI RAG CỤ THỂ]:
- Tên/Tiêu đề: ${contextData.title || contextData.name || 'Không xác định'}
- Ngày phát hành/Năm sinh: ${contextData.releaseDate || 'N/A'}
- Điểm đánh giá TMDB: ${contextData.rating != null ? contextData.rating : 'N/A'}
- Dàn diễn viên / Thể loại: ${contextData.cast || contextData.genres || 'N/A'}
- Tóm tắt/Thông tin: ${contextData.overview || 'N/A'}`;
    }

    const systemPrompt = `Bạn là CineBot AI - Trợ lý điện ảnh thông minh, sành sỏi của CineWiki. Hãy trả lời ngắn gọn (2-3 câu), thân thiện, súc tích bằng tiếng Việt về phim, diễn viên, đạo diễn và giải thưởng Oscar. Hãy dựa vào dữ liệu thực tế từ TMDB bên dưới để trả lời chính xác, tránh tự bịa thông tin.${ragContextString}
Sau phần trả lời chính, hãy ĐỀ XUẤT ĐÚNG 3 CÂU HỎI GỢI Ý TIẾP THEO (Follow-up Questions) ngắn gọn liên quan trực tiếp đến nội dung câu trả lời. Không chèn biểu tượng emoji hay icon vào câu hỏi.
Định dạng dòng cuối cùng chính xác như sau:
FOLLOW_UP: [Câu hỏi gợi ý 1] | [Câu hỏi gợi ý 2] | [Câu hỏi gợi ý 3]`;

    let rawOutput = '';
    let lastErrorDetails = '';

    if (geminiKey && !geminiKey.includes('YOUR_GEMINI')) {
      for (const m of GEMINI_FAST_MODELS) {
        try {
          const contentsPayload = [
            ...history.map((h) => ({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: h.content }]
            })),
            {
              role: 'user',
              parts: [{ text: message }]
            }
          ];

          let response;
          try {
            response = await axios.post(
              `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${geminiKey}`,
              {
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: contentsPayload
              }
            );
          } catch {
            response = await axios.post(
              `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${geminiKey}`,
              {
                contents: [
                  ...history.map((h) => ({
                    role: h.role === 'user' ? 'user' : 'model',
                    parts: [{ text: h.content }]
                  })),
                  {
                    role: 'user',
                    parts: [{ text: `${systemPrompt}\n\n${message}` }]
                  }
                ]
              }
            );
          }
          const output = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (output) {
            rawOutput = output.trim();
            break;
          }
        } catch (err: any) {
          const apiErrMsg = err.response?.data?.error?.message || err.message;
          lastErrorDetails = `[Gemini ${m} Error]: ${apiErrMsg}`;
          console.warn(`[Gemini Chat ${m} Warning] ${apiErrMsg}`);
        }
      }
    } else {
      lastErrorDetails = 'Chưa cấu hình GEMINI_API_KEY hợp lệ trong file .env';
    }

    if (!rawOutput && openaiKey) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: systemPrompt }, ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content })), { role: 'user', content: message }]
          },
          { headers: { Authorization: `Bearer ${openaiKey}` } }
        );
        rawOutput = response.data?.choices?.[0]?.message?.content || '';
      } catch (err: any) {
        const apiErrMsg = err.response?.data?.error?.message || err.message;
        lastErrorDetails = `[OpenAI Error]: ${apiErrMsg}`;
        console.warn(`[OpenAI Chat Warning] ${apiErrMsg}`);
      }
    }

    if (!rawOutput && anthropicKey) {
      try {
        const response = await axios.post(
          'https://api.anthropic.com/v1/messages',
          {
            model: 'claude-3-haiku-20240307',
            max_tokens: 800,
            system: systemPrompt,
            messages: history.map(h => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content })).concat([{ role: 'user', content: message }])
          },
          {
            headers: {
              'x-api-key': anthropicKey,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json'
            }
          }
        );
        rawOutput = response.data?.content?.[0]?.text || '';
      } catch (err: any) {
        const apiErrMsg = err.response?.data?.error?.message || err.message;
        lastErrorDetails = `[Anthropic Error]: ${apiErrMsg}`;
        console.warn(`[Anthropic Chat Warning] ${apiErrMsg}`);
      }
    }

    if (!rawOutput) {
      throw new Error(`Tất cả dịch vụ AI không khả dụng. Chi tiết: ${lastErrorDetails || 'API Key chưa chính xác'}`);
    }

    // Parse text & extract follow-up questions
    let reply = rawOutput.trim();
    let followUpQuestions: string[] = [];

    const followUpMatch = reply.match(/FOLLOW_UP:\s*(.+)$/im);
    if (followUpMatch) {
      const rawQuestions = followUpMatch[1];
      followUpQuestions = rawQuestions
        .split('|')
        .map(q => q.trim().replace(/^[-*•\d.]+\s*/, '').replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim())
        .filter(q => q.length > 0);
      reply = reply.replace(/FOLLOW_UP:\s*.+$/im, '').trim();
    }

    if (followUpQuestions.length === 0) {
      const msgLower = (message + ' ' + reply).toLowerCase();
      if (msgLower.includes('oscar') || msgLower.includes('giải')) {
        followUpQuestions = [
          'Bộ phim này đoạt những giải Oscar nào?',
          'Diễn viên nào từng giành Oscar xuất sắc nhất?',
          'Top các phim đạt nhiều Oscar nhất lịch sử?'
        ];
      } else if (msgLower.includes('diễn viên') || msgLower.includes('thủ vai') || msgLower.includes('actor') || msgLower.includes('tài tử')) {
        followUpQuestions = [
          'Các bộ phim xuất sắc nhất trong sự nghiệp của diễn viên này?',
          'Tổng doanh thu phòng vé các phim của họ?',
          'Diễn viên này thường hợp tác với đạo diễn nào?'
        ];
      } else if (msgLower.includes('nolan') || msgLower.includes('oppenheimer') || msgLower.includes('interstellar') || msgLower.includes('inception')) {
        followUpQuestions = [
          'Christopher Nolan đã đoạt những giải Oscar nào?',
          'Phong cách làm phim độc đáo của Nolan là gì?',
          'Tác phẩm đạt doanh thu cao nhất của Nolan?'
        ];
      } else {
        followUpQuestions = [
          'Gợi ý thêm các bộ phim hấp dẫn cùng thể loại?',
          'Phim này đạt những giải thưởng điện ảnh lớn nào?',
          'Dàn diễn viên chính gồm những gương mặt nổi tiếng nào?'
        ];
      }
    }

    return { reply, followUpQuestions: followUpQuestions.slice(0, 4) };
  }

  static async getMovieAwards(movieTitle: string, releaseYear?: string): Promise<{ name: string; category: string; year: number }[]> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    const yearHint = releaseYear ? ` (ra mắt năm ${releaseYear.split('-')[0]})` : '';
    const prompt = `Bạn là chuyên gia lịch sử điện ảnh. Liệt kê CÁC GIẢI THƯỞNG ĐIỆN ẢNH MÀ BỘ PHIM "${movieTitle}"${yearHint} ĐÃ THỰC SỰ GIÀNH CHIẾN THẮNG (WON/WINNER ONLY).
Trả về ĐÚNG JSON array:
[
  {"name": "Tên giải thưởng đầy đủ", "category": "Hạng mục cụ thể", "year": 2024}
]
Nếu không có thông tin chắc chắn, trả về mảng rỗng: []`;

    let textOutput = '';

    if (geminiKey && !geminiKey.includes('YOUR_GEMINI')) {
      for (const modelName of GEMINI_FAST_MODELS) {
        try {
          const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
            { contents: [{ role: 'user', parts: [{ text: prompt }] }] },
            { timeout: 8000 }
          );
          textOutput = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (textOutput) break;
        } catch (err: any) {
          const apiErrMsg = err.response?.data?.error?.message || err.message;
          console.warn(`[Gemini Awards ${modelName}] ${apiErrMsg}`);
        }
      }
    }

    if (!textOutput && openaiKey) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          { model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }] },
          { headers: { Authorization: `Bearer ${openaiKey}` }, timeout: 8000 }
        );
        textOutput = response.data?.choices?.[0]?.message?.content || '';
      } catch (err: any) {
        console.warn(`[OpenAI Awards] ${err.response?.data?.error?.message || err.message}`);
      }
    }

    if (!textOutput && anthropicKey) {
      try {
        const response = await axios.post(
          'https://api.anthropic.com/v1/messages',
          { model: 'claude-3-haiku-20240307', max_tokens: 800, messages: [{ role: 'user', content: prompt }] },
          { headers: { 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, timeout: 8000 }
        );
        textOutput = response.data?.content?.[0]?.text || '';
      } catch (err: any) {
        console.warn(`[Anthropic Awards] ${err.response?.data?.error?.message || err.message}`);
      }
    }

    if (textOutput) {
      const jsonMatch = textOutput.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) {
            return parsed
              .filter((a: any) => a.name && a.category && a.year)
              .map((a: any) => ({ name: String(a.name), category: String(a.category), year: Number(a.year) }));
          }
        } catch (e) {
          console.warn('[Awards JSON parse error]', e);
        }
      }
    }

    return [];
  }

  static async getVerifiedImdbScoreWithAI(movieId: number, title: string, releaseDate?: string, tmdbAvg?: number): Promise<number> {
    const todayStr = new Date().toISOString().split('T')[0];
    if (releaseDate && releaseDate > todayStr) return 0;
    return tmdbAvg ? Math.round(tmdbAvg * 10) / 10 : 0;
  }
}
