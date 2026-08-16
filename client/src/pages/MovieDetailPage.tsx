import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import { ImgWithFallback } from '../components/ImgWithFallback';
import { useTranslation } from 'react-i18next';
import { getMovieTitle } from '../utils/langUtils';
import { Star, Clock, Calendar, Play, ArrowLeft, X, DollarSign, User, Award, Film, Sliders, Trophy, GitCompare, Search, Globe, Sparkles } from 'lucide-react';

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // Compare Modal State
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [compareSearchQuery, setCompareSearchQuery] = useState('');
  const [compareSearchResults, setCompareSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetch('/api/movies/trending')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setPopularMovies(d.data.filter((m: Movie) => m.id !== Number(id)));
        }
      })
      .catch(() => { });
  }, [id]);

  useEffect(() => {
    if (!compareSearchQuery.trim()) {
      setCompareSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(compareSearchQuery)}`);
        const data = await res.json();
        if (data.success && data.data.movies) {
          setCompareSearchResults(data.data.movies.filter((m: Movie) => m.id !== Number(id)));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [compareSearchQuery, id]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const fetchMovie = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const langParam = i18n.language?.startsWith('en') ? 'en-US' : 'vi-VN';
        const res = await fetch(`/api/movies/${id}?lang=${langParam}`);
        const data = await res.json().catch(() => null);
        if (res.ok && data && data.success && data.data) {
          setMovie(data.data);
        } else {
          throw new Error(data?.message || 'Không thể tải thông tin chi tiết của bộ phim này.');
        }
      } catch (err) {
        console.error('Fetch movie error', err);
        setError((err as Error).message || 'Có lỗi xảy ra, vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, i18n.language]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pt-6">
        <div className="h-80 rounded-3xl skeleton-box" />
        <div className="h-40 rounded-2xl skeleton-box" />
        <div className="h-40 rounded-2xl skeleton-box" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 my-12 border border-slate-800">
        <h2 className="text-lg font-bold text-slate-200">{error || 'Không tìm thấy thông tin phim.'}</h2>
        <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition">
          Trở về Trang chủ
        </button>
      </div>
    );
  }

  // WON awards ONLY (both major & regional awards allowed, nominations excluded, no cap limit)
  const isWonAward = (awd: any) => {
    if (!awd) return false;
    if (awd.status === 'nominated' || awd.won === false || awd.isWinner === false) return false;
    const cat = (awd.category || '').toLowerCase();
    const name = (awd.name || '').toLowerCase();
    if (cat.includes('đề cử') || cat.includes('nomine') || cat.includes('nomination') || cat.includes('candidate')) return false;
    if (name.includes('đề cử') || name.includes('nomine') || name.includes('nomination') || name.includes('candidate')) return false;
    return true;
  };

  const sortedAwards = movie.awards
    ? [...movie.awards]
      .filter(isWonAward)
      .sort((a, b) => (b.year || 0) - (a.year || 0))
    : [];

  return (
    <div className="space-y-8 pb-16">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-amber-300 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Trở về</span>
      </button>

      {/* ① Hero Movie Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <ImgWithFallback src={movie.backdrop_path || movie.poster_path} type="backdrop" alt={movie.title} className="w-full h-full object-cover opacity-20 filter blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-44 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 flex-shrink-0 bg-slate-900">
            <ImgWithFallback src={movie.poster_path} type="poster" alt={movie.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                {movie.genres?.map((g) => (
                  <span key={g.id} className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">{g.name}</span>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-100">{getMovieTitle(movie, i18n.language)}</h1>
              {movie.original_title && movie.original_title !== getMovieTitle(movie, i18n.language) && (
                <p className="text-xs text-slate-400 font-medium italic mt-0.5">{i18n.language?.startsWith('en') ? 'Original Title: ' : 'Tên gốc: '}{movie.original_title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
              <div className="flex items-center space-x-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <User className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Director:' : 'Đạo diễn:'} <strong className="text-white">{movie.director || (isEn ? 'Unknown' : 'Chưa rõ')}</strong></span>
              </div>

              {movie.writer && (
                <div className="flex items-center space-x-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <Film className="w-4 h-4 text-amber-400" />
                  <span>{isEn ? 'Writer:' : 'Biên kịch:'} <strong className="text-white">{movie.writer}</strong></span>
                </div>
              )}

              <div className="flex items-center space-x-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Release Date:' : 'Thời điểm phát hành:'} <strong className="text-white">{movie.release_date || 'N/A'}</strong></span>
              </div>

              <div className="flex items-center space-x-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Runtime:' : 'Thời lượng phim:'} <strong className="text-white">{movie.runtime ? `${movie.runtime} ${isEn ? 'mins' : 'phút'}` : (isEn ? 'N/A' : 'Chưa có dữ liệu')}</strong></span>
              </div>

              <div className="flex items-center space-x-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Country:' : 'Quốc gia:'} <strong className="text-white">
                  {(() => {
                    const code = Array.isArray(movie.origin_country) ? movie.origin_country[0] : movie.origin_country;
                    const lang = movie.original_language;
                    if (code === 'VN' || lang === 'vi') return isEn ? 'Vietnam' : 'Việt Nam';
                    if (code === 'US' || (lang === 'en' && code !== 'GB')) return isEn ? 'United States' : 'Mỹ';
                    if (code === 'GB') return isEn ? 'United Kingdom' : 'Anh';
                    if (code === 'KR' || lang === 'ko') return isEn ? 'South Korea' : 'Hàn Quốc';
                    if (code === 'JP' || lang === 'ja') return isEn ? 'Japan' : 'Nhật Bản';
                    if (code === 'CN' || lang === 'zh') return isEn ? 'China' : 'Trung Quốc';
                    if (code === 'FR' || lang === 'fr') return isEn ? 'France' : 'Pháp';
                    if (code === 'TH' || lang === 'th') return isEn ? 'Thailand' : 'Thái Lan';
                    return isEn ? 'International' : 'Quốc tế';
                  })()}
                </strong></span>
              </div>

              {movie.vote_average > 0 && (
                <div className="flex items-center space-x-2 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-amber-300">{movie.vote_average.toFixed(1)} / 10</span>
                  {movie.vote_count > 0 && <span className="text-slate-400">({(movie.vote_count).toLocaleString()} {isEn ? 'votes' : 'lượt'})</span>}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {movie.trailer_url && (
                <button
                  onClick={() => setShowTrailerModal(true)}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-2xl text-xs shadow-lg transition transform active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{isEn ? 'Watch Trailer' : 'Xem Trailer'}</span>
                </button>
              )}

              <button
                onClick={() => setShowCompareModal(true)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 font-bold rounded-2xl text-xs shadow-lg transition transform active:scale-95 cursor-pointer"
              >
                <GitCompare className="w-4 h-4 text-cyan-400" />
                <span>{isEn ? 'Compare This Movie' : 'So sánh bộ phim này'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ② Đánh giá & Tài chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(movie.vote_average && movie.vote_average > 0) ? (
          <section className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-100">{isEn ? '⭐ Ratings & Score' : '⭐ Đánh giá & Điểm số'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
                <span className="text-xs font-bold text-amber-400 block uppercase">{isEn ? 'TMDB Rating' : 'Đánh giá TMDB'}</span>
                <span className="text-2xl font-black text-amber-300"> {movie.vote_average || 'N/A'} / 10</span>
              </div>
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-1">
                <span className="text-xs font-bold text-cyan-400 block uppercase">{isEn ? 'Vote Count' : 'Lượt đánh giá'}</span>
                <span className="text-2xl font-black text-cyan-300"> {movie.vote_count ? movie.vote_count.toLocaleString() : 'N/A'}</span>
              </div>
            </div>
          </section>
        ) : (
          <section className="glass-panel rounded-3xl p-6 border border-slate-800 flex items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-sm font-bold text-cyan-300">{isEn ? 'Upcoming Release' : 'Phim Sắp Ra Mắt'}</p>
              <p className="text-xs text-slate-400">{isEn ? 'No rating available — check back after release!' : 'Chưa có điểm đánh giá — hãy quay lại sau khi phim khởi chiếu!'}</p>
            </div>
          </section>
        )}

        <section className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-lg font-extrabold text-slate-100">{isEn ? ' Box Office & Financials' : ' Doanh thu phòng vé'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1">
                <span>{isEn ? 'Budget' : 'Ngân sách'}</span>
              </span>
              <span className="text-base font-bold text-slate-100 block">{movie.budget || (isEn ? 'N/A' : 'Chưa có dữ liệu')}</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
              <span className="text-xs font-semibold text-amber-400 flex items-center space-x-1">
                <span>{isEn ? 'Box Office Revenue' : 'Doanh thu phòng vé'}</span>
              </span>
              <span className="text-base font-black text-amber-300 block">{movie.box_office || (isEn ? 'N/A' : 'Chưa có dữ liệu')}</span>
            </div>
          </div>
        </section>
      </div>

      {/* ③ Nội dung chi tiết */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Film className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">{isEn ? 'Synopsis & Movie Overview' : 'Nội dung & Thông tin chi tiết phim'}</h2>
            <p className="text-xs text-slate-400">{isEn ? 'Detailed plot, character dynamics & production insights' : 'Chi tiết cốt truyện, dàn nhân vật & góc nhìn sản xuất'}</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-normal pt-2">
          {(movie.overview_vi || movie.overview || (isEn ? 'No plot overview available.' : 'Chưa có thông tin nội dung.'))
            .split('\n\n')
            .filter(p => p.trim().length > 0)
            .map((paragraph, index) => (
              <div key={index} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 block">
                  {index === 0
                    ? (isEn ? 'Storyline & Premise' : ' Bối cảnh & Cốt truyện chính')
                    : index === 1
                      ? (isEn ? 'Main Cast & Characters' : ' Dàn diễn viên & Vai diễn nổi bật')
                      : (isEn ? 'Production & Artistic Style' : ' Đội ngũ sản xuất & Phong cách nghệ thuật')}
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">{paragraph}</p>
              </div>
            ))}
        </div>
      </section>

      {/* 🎬 Trailer Section */}
      {movie.trailer_url && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Play className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">Official Trailer</h2>
            </div>
          </div>
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-black">
            <iframe
              src={movie.trailer_url.replace('autoplay=1', 'autoplay=0')}
              title={`${movie.title} Trailer`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* ④ Diễn viên chính */}
      {movie.cast && movie.cast.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-100">{isEn ? ' Top Cast' : ' Diễn viên tham gia'}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {movie.cast.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/actor/${c.id}`)}
                className="glass-panel p-3 rounded-2xl border border-slate-800 hover:border-amber-400/40 cursor-pointer flex flex-col items-center text-center space-y-2 group transition"
              >
                <ImgWithFallback src={c.profile_path} type="profile" alt={c.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-700 group-hover:border-amber-400 transition" />
                <div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition">{c.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{c.character}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ⑤ Kỹ thuật & Nghệ thuật */}
      {movie.technical_highlights && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-slate-100">{isEn ? 'Technical & Artistic Highlights' : 'Yếu tố Kỹ thuật & Nghệ thuật Nổi bật'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {movie.technical_highlights.cinematography && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-amber-400 block">{isEn ? '📷 Cinematography' : '📷 Quay phim (Cinematography)'}</span>
                <p className="text-xs text-slate-300">{movie.technical_highlights.cinematography}</p>
              </div>
            )}
            {movie.technical_highlights.music && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-cyan-400 block">{isEn ? '🎵 Original Score' : '🎵 Âm nhạc (Original Score)'}</span>
                <p className="text-xs text-slate-300">{movie.technical_highlights.music}</p>
              </div>
            )}
            {movie.technical_highlights.vfx && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-purple-400 block">{isEn ? '✨ VFX & Special Effects' : '✨ Kỹ xảo (VFX / Special Effects)'}</span>
                <p className="text-xs text-slate-300">{movie.technical_highlights.vfx}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ⑥ CineBot AI CTA Banner for Awards */}
      <section className="glass-panel-glow rounded-3xl p-5 border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-amber-950/40 text-center shadow-xl">
        <p className="text-xs sm:text-sm font-semibold text-amber-300 flex items-center justify-center space-x-2">
          <span>
            {isEn ? (
              <>
                Want to know more information? Use{' '}
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event('open-cinebot-chat'))}
                  className="underline hover:text-amber-100 cursor-pointer font-extrabold text-amber-300 transition"
                >
                  CineBot AI
                </button>
                !
              </>
            ) : (
              <>
                Muốn tìm hiểu thêm về bộ phim này? Hãy sử dụng{' '}
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event('open-cinebot-chat'))}
                  className="underline hover:text-amber-100 cursor-pointer font-extrabold text-amber-300 transition"
                >
                  CineBot AI
                </button>{' '}
                nhé!
              </>
            )}
          </span>
        </p>
      </section>

      {/* Trailer Modal */}
      {showTrailerModal && movie.trailer_url && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden border border-amber-500/30">
            <button onClick={() => setShowTrailerModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 z-10">
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={movie.trailer_url.includes('?') ? `${movie.trailer_url}&autoplay=1` : `${movie.trailer_url}?autoplay=1`}
                title={movie.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Compare Movie Selection Modal */}
      {showCompareModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-slate-950 rounded-3xl border border-cyan-500/40 p-6 shadow-2xl space-y-5 overflow-hidden">
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <GitCompare className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-100">{isEn ? `Compare Movie With ${getMovieTitle(movie, i18n.language)}` : `So Sánh Phim Với ${getMovieTitle(movie, i18n.language)}`}</h3>
                <p className="text-xs text-slate-400">{isEn ? 'Select a movie to compare box office, IMDb rating, and scale' : 'Chọn bộ phim để đối sánh doanh thu, đánh giá IMDb và quy mô tác phẩm'}</p>
              </div>
            </div>

            {/* Search Bar Input */}
            <div className="relative">
              <input
                type="text"
                value={compareSearchQuery}
                onChange={(e) => setCompareSearchQuery(e.target.value)}
                placeholder={isEn ? 'Type movie title to compare...' : 'Nhập tên bộ phim bạn muốn so sánh...'}
                className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 focus:border-amber-400 rounded-lg text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none"
              />
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              {isSearching && (
                <span className="absolute right-3.5 top-3 text-[10px] text-cyan-400 font-bold animate-pulse">{isEn ? 'Searching...' : 'Đang tìm...'}</span>
              )}
            </div>

            {/* Search Results / Popular List container */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {compareSearchQuery.trim() ? (
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 block mb-2 uppercase tracking-wider">{isEn ? 'Movie Search Results' : 'Kết quả tìm kiếm phim'}</span>
                  {compareSearchResults.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">{isEn ? 'No matching movies found' : 'Không tìm thấy phim phù hợp'}</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {compareSearchResults.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => {
                            setShowCompareModal(false);
                            navigate(`/compare?tab=movie&ma=${movie.id}&mb=${m.id}`);
                          }}
                          className="flex items-center space-x-3 p-2.5 rounded-2xl bg-slate-900/80 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/30 cursor-pointer transition"
                        >
                          <ImgWithFallback src={m.poster_path} type="poster" alt={m.title} className="w-10 h-14 rounded-xl object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-100 truncate">{getMovieTitle(m, i18n.language)}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">{m.release_date?.split('-')[0]} &bull; ⭐ IMDb {m.vote_average}</p>
                          </div>
                          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-[10px] font-bold rounded-xl border border-cyan-500/30">{isEn ? 'Select' : 'Chọn'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <span className="text-[10px] font-bold text-amber-400 block mb-2 uppercase tracking-wider">{isEn ? 'Popular Movie Suggestions' : 'Phim nổi tiếng gợi ý'}</span>
                  <div className="grid grid-cols-1 gap-2">
                    {popularMovies.slice(0, 6).map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setShowCompareModal(false);
                          navigate(`/compare?tab=movie&ma=${movie.id}&mb=${m.id}`);
                        }}
                        className="flex items-center space-x-3 p-2.5 rounded-2xl bg-slate-900/80 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/30 cursor-pointer transition"
                      >
                        <ImgWithFallback src={m.poster_path} type="poster" alt={m.title} className="w-10 h-14 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-100 truncate">{getMovieTitle(m, i18n.language)}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">{m.release_date?.split('-')[0]} &bull; ⭐ IMDb {m.vote_average}</p>
                        </div>
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-xl border border-amber-500/30">{isEn ? 'Compare' : 'So sánh'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
