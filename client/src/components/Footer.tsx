import React from 'react';
import { Film, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-[#07090e] border-t border-slate-800/80 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Film className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="text-base font-black text-slate-100">Cine<span className="text-amber-400">Wiki</span></span>
            <p className="text-[11px] text-slate-400">Nền tảng tra cứu & Phân tích Điện ảnh Chuyên nghiệp</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
          <button onClick={() => navigate('/compare')} className="hover:text-amber-300 transition">So sánh Diễn viên</button>
          <button onClick={() => navigate('/search')} className="hover:text-amber-300 transition">Lọc Nâng cao</button>
          <button onClick={() => navigate('/following')} className="hover:text-amber-300 transition">Idol của tôi</button>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center space-x-1">
          <span>Powered by TMDB API &bull; Made with</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline mx-0.5" />
          <span>for Cinephiles Worldwide &copy; 2026</span>
        </div>
      </div>
    </footer>
  );
};
