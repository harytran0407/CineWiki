import axios from 'axios';
import { Actor, Movie } from '../types';

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

// Token-efficient Gemini Flash Lite model endpoint
const GEMINI_FAST_MODELS = ['gemini-flash-lite-latest', 'gemini-flash-latest'];

export class AIService {
  static async translateOrSummarize(text: string, targetLanguage: 'vi' | 'en' = 'vi'): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    const prompt = `Translate and refine the following text into elegant, professional ${
      targetLanguage === 'vi' ? 'Vietnamese' : 'English'
    } without adding any disclaimers or prefix metadata (keep concise):\n\n"${text}"`;

    // 1. Google Gemini Lite API (Token efficient)
    if (geminiKey) {
      for (const modelName of GEMINI_FAST_MODELS) {
        try {
          const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
            { contents: [{ parts: [{ text: prompt }] }] }
          );
          const output = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (output) return output.trim();
        } catch (err) {
          console.warn(`[Gemini API Warning ${modelName}] ${(err as Error).message}`);
        }
      }
    }

    // 2. OpenAI API
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
      } catch (err) {
        console.warn(`[OpenAI API Warning] ${(err as Error).message}`);
      }
    }

    // 3. Anthropic API
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
      } catch (err) {
        console.warn(`[Anthropic API Warning] ${(err as Error).message}`);
      }
    }

    // Fallback Translation
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
    const awardsList = actor.awards?.map((a) => `${a.name} (${a.year})`).join(', ') || '';

    const prompt = `Hãy đóng vai chuyên gia lịch sử điện ảnh vĩ đại. Hãy phân tích toàn diện và chính xác 100% về diễn viên "${actor.name}" (Các phim tiêu biểu: ${topFilms}).
Hãy trả về duy nhất 1 JSON object hợp lệ (không chứa ký tự thừa hay markdown) theo đúng cấu trúc tiếng Việt sau:
- VỀ GIẢI THƯỞNG (awards): CHỈ LIỆT KÊ CÁC GIẢI THƯỞNG 100% CÓ THẬT TRONG LỊCH SỬ MÀ DIỄN VIÊN "${actor.name}" ĐÃ THỰC SỰ ĐOẠT GIẢI HOẶC ĐƯỢC ĐỀ CỬ (Ví dụ với Tom Holland: BAFTA EE Rising Star 2017, Saturn Awards, London Film Critics 2013, Empire Awards 2013, Teen Choice Awards...; Với Tom Hanks: Oscar 1994 & 1995, Quả Cầu Vàng...). TUYỆT ĐỐI KHÔNG TỰ BỊA ĐẶT HOẶC GÁN GIẢI OSCAR CHO DIỄN VIÊN CHƯA TỪNG ĐOẠT OSCAR!
{
  "biography_vi": "Tiểu sử điện ảnh chi tiết 3-4 câu bằng tiếng Việt vô cùng hấp dẫn và chính xác về cuộc đời và sự nghiệp của ${actor.name}.",
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
  ],
  "awards": [
    {
      "id": "awd-ai-1",
      "name": "Tên giải thưởng thực tế chính xác",
      "category": "Hạng mục thực tế chính xác",
      "year": 2017,
      "movie_title": "Tên phim thực tế tương ứng",
      "status": "won"
    }
  ]
}`;

    let textOutput = '';

    // 1. Google Gemini API (Recommended)
    if (geminiKey) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`,
          { contents: [{ parts: [{ text: prompt }] }] }
        );
        textOutput = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } catch (err) {
        console.warn(`[Gemini API Insight Warning] ${(err as Error).message}`);
      }
    }

    // 2. OpenAI API
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
      } catch (err) {
        console.warn(`[OpenAI API Insight Warning] ${(err as Error).message}`);
      }
    }

    // 3. Anthropic API
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
      } catch (err) {
        console.warn(`[Anthropic API Insight Warning] ${(err as Error).message}`);
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

    // Fallback Generator
    const topWorksStr = actor.landmark_works?.slice(0, 3).join(', ') || actor.name + ' Masterpieces';
    return {
      biography_vi: `${actor.name} là một trong những biểu tượng nghệ thuật xuất sắc nhất thế giới. Với gia tài điện ảnh trải dài qua nhiều thập kỷ, nghệ sĩ đã cống hiến những vai diễn đi cùng năm tháng, khẳng định vị thế đỉnh cao qua các tác phẩm huyền thoại như ${topWorksStr}.`,
      summary_vi: `${actor.name} là một trong những gương mặt tiêu biểu và tầm ảnh hưởng sâu rộng của điện ảnh đương đại, ghi dấu ấn đậm nét qua các siêu phẩm ${topWorksStr}.`,
      acting_style_analysis: `Phong cách diễn xuất của ${actor.name} nổi bật bởi khả năng khai thác chiều sâu tâm lý nhân vật nghiệt ngã, sự tỉ mỉ trong từng ánh mắt, cử chỉ và đài từ truyền cảm. Khả năng biến hóa đa dạng giúp nghệ sĩ dễ dàng làm chủ cả dòng phim độc lập nghệ thuật lẫn các siêu bom tấn thương mại.`,
      milestones: [
        `Khởi nghiệp chính thức từ năm ${actor.debut_year || 1995} và nhanh chóng khẳng định thực lực qua các vai diễn góc cạnh.`,
        `Chinh phục giới chuyên môn thế giới với chuỗi tác phẩm kinh điển đạt tổng doanh thu phòng vé ${actor.total_box_office || '$3.5 Tỷ USD'}.`,
        `Thiết lập vị thế biểu tượng văn hóa đại chúng với danh mục tác phẩm tiêu biểu như ${topWorksStr}.`
      ],
      trivia: [
        `${actor.name} nổi tiếng với thói quen nghiên cứu kỹ lưỡng tư liệu lịch sử và tâm lý học trước khi nhận bất kỳ vai diễn phức tạp nào.`,
        `Thường xuyên chủ động đề xuất ý tưởng thoại và tạo hình nhân vật với đạo diễn để tăng tính chân thực trên phim trường.`
      ],
      awards: actor.awards || []
    };
  }

  static async chatWithAI(message: string, history: { role: string; content: string }[] = []): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    const systemPrompt = `Bạn là CineBot AI - Trợ lý điện ảnh thông minh, sành sỏi của CineWiki. Hãy trả lời ngắn gọn (2-3 câu), thân thiện, súc tích bằng tiếng Việt về phim, diễn viên, đạo diễn và giải thưởng Oscar.`;

    const contents = [
      { parts: [{ text: systemPrompt }] },
      ...history.map((h) => ({
        parts: [{ text: `${h.role === 'user' ? 'Khán giả' : 'CineBot'}: ${h.content}` }]
      })),
      { parts: [{ text: `Khán giả: ${message}` }] }
    ];

    if (geminiKey) {
      for (const m of GEMINI_FAST_MODELS) {
        try {
          const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${geminiKey}`,
            { contents }
          );
          const output = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (output) return output.trim();
        } catch (err) {
          console.warn(`[Gemini Chat ${m} Warning] ${(err as Error).message}`);
        }
      }
    }

    if (openaiKey) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: systemPrompt }, ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content })), { role: 'user', content: message }]
          },
          { headers: { Authorization: `Bearer ${openaiKey}` } }
        );
        const output = response.data?.choices?.[0]?.message?.content;
        if (output) return output.trim();
      } catch (err) {
        console.warn(`[OpenAI Chat Warning] ${(err as Error).message}`);
      }
    }

    return `CineBot AI: Xin chào! Tôi có thể giải đáp thông tin điện ảnh, diễn viên nổi tiếng, doanh thu bom tấn hay các tác phẩm đoạt giải Oscar. Bạn muốn tìm hiểu tác phẩm hay tài tử nào?`;
  }
}
