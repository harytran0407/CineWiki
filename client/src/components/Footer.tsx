import React from 'react';
import { Film, Heart, Sparkles, GitCompare, Search, Shuffle, Globe, Award, ShieldCheck, Github, Twitter, Facebook, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  return (
    <footer className="w-full bg-[#05070c] border-t border-slate-800/80 pt-16 pb-12 mt-20 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Main Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">

          {/* Col 1: Brand & Intro */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/')}>
              <img src="/logo.png" alt="CineWiki Logo" className="w-12 h-12 object-contain group-hover:scale-105 transition drop-shadow-[0_0_10px_rgba(245,158,11,0.25)]" />
              <div>
                <span className="text-xl font-black text-slate-100 tracking-tight inline-block group-hover:scale-110 transition-transform transform origin-left">
                  Cine<span className="text-amber-400">Wiki</span>
                </span>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Discover World Cinema
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {isEn
                ? 'CineWiki is a modern cinema lookup & actor comparison platform, supporting multi-dimensional box office analytics, TMDB ratings, and career filmographies.'
                : 'CineWiki là nền tảng tra cứu điện ảnh & so sánh diễn viên, hỗ trợ phân tích đa chiều dữ liệu box office, điểm TMDB và sự nghiệp diễn viên.'}
            </p>

            <div className="pt-2 space-y-2">
              <div className="flex items-center space-x-3 text-slate-400">
                <a href="https://github.com/harytran0407" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-amber-400 hover:border-amber-500/40 transition" title="GitHub">
                  <Github className="w-4 h-4" />
                </a>
                <a href="https://www.facebook.com/tran.hung.687701/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-amber-400 hover:border-amber-500/40 transition" title="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="mailto:trandinhquochung158@gmail.com" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-amber-400 hover:border-amber-500/40 transition" title="Email: trandinhquochung158@gmail.com">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
              <a href="mailto:trandinhquochung158@gmail.com" className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-amber-400 transition font-medium">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>trandinhquochung158@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Col 2: Khám Phá */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider border-l-2 border-amber-400 pl-2">
              {isEn ? 'Explore' : 'Khám Phá'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/search')} className="hover:text-amber-300 transition flex items-center space-x-1.5 cursor-pointer">
                  <Search className="w-3.5 h-3.5 text-amber-400/70" />
                  <span>{isEn ? 'Filter & Search Movies' : 'Lọc & Tìm kiếm Phim'}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/actors')} className="hover:text-amber-300 transition flex items-center space-x-1.5 cursor-pointer">
                  <Award className="w-3.5 h-3.5 text-amber-400/70" />
                  <span>{isEn ? 'Celebs List (View All)' : 'Danh sách Celebs (Xem thêm)'}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/compare')} className="hover:text-amber-300 transition flex items-center space-x-1.5 cursor-pointer">
                  <GitCompare className="w-3.5 h-3.5 text-amber-400/70" />
                  <span>{isEn ? 'Side-by-Side Comparison' : 'So sánh Đa chiều'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Thể Loại */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider border-l-2 border-cyan-400 pl-2">
              {isEn ? 'Movie Genres' : 'Thể Loại Phim'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/search?genre=Action')} className="hover:text-cyan-300 transition cursor-pointer">{isEn ? 'Action Movies' : 'Phim Hành Động'}</button>
              </li>
              <li>
                <button onClick={() => navigate('/search?genre=Drama')} className="hover:text-cyan-300 transition cursor-pointer">{isEn ? 'Drama Movies' : 'Phim Chính Kịch'}</button>
              </li>
              <li>
                <button onClick={() => navigate('/search?genre=Sci-Fi')} className="hover:text-cyan-300 transition cursor-pointer">{isEn ? 'Sci-Fi & Fantasy' : 'Khoa Học Viễn Tưởng'}</button>
              </li>
              <li>
                <button onClick={() => navigate('/search?genre=Horror')} className="hover:text-cyan-300 transition cursor-pointer">{isEn ? 'Horror Movies' : 'Phim Kinh Dị'}</button>
              </li>
              <li>
                <button onClick={() => navigate('/search?genre=Comedy')} className="hover:text-cyan-300 transition cursor-pointer">{isEn ? 'Comedy Movies' : 'Phim Hài Hước'}</button>
              </li>
            </ul>
          </div>

          {/* Col 4: Quốc Gia */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider border-l-2 border-purple-400 pl-2">
              {isEn ? 'Countries' : 'Quốc Gia'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/search?country=VN')} className="hover:text-purple-300 transition cursor-pointer">{isEn ? 'Vietnamese Cinema' : 'Phim Việt Nam'}</button>
              </li>
              <li>
                <button onClick={() => navigate('/search?country=US')} className="hover:text-purple-300 transition cursor-pointer">{isEn ? 'Hollywood (USA)' : 'Điện ảnh Mỹ (Hollywood)'}</button>
              </li>
              <li>
                <button onClick={() => navigate('/search?country=KR')} className="hover:text-purple-300 transition cursor-pointer">{isEn ? 'South Korean Cinema' : 'Phim Hàn Quốc'}</button>
              </li>
              <li>
                <button onClick={() => navigate('/search?country=JP')} className="hover:text-purple-300 transition cursor-pointer">{isEn ? 'Japanese Cinema' : 'Phim Nhật Bản'}</button>
              </li>
              <li>
                <button onClick={() => navigate('/search?country=CN')} className="hover:text-purple-300 transition cursor-pointer">{isEn ? 'Chinese Cinema' : 'Phim Trung Quốc'}</button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              {isEn
                ? 'Movie and actor data provided directly by TMDB API. No copyrighted media hosted.'
                : 'Dữ liệu điện ảnh được cung cấp trực tiếp bởi TMDB API. Không lưu trữ nội dung vi phạm bản quyền.'}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <span>Made by Tran Dinh Quoc Hung &copy; 2026 CineWiki</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
