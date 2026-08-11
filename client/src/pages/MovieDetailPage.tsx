import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Movie } from '../types';
import { ImgWithFallback } from '../components/ImgWithFallback';
import { Star, Clock, Calendar, Sparkles, Play, ArrowLeft, X, DollarSign, Building, User, Award, Film, Sliders } from 'lucide-react';

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translatedOverview, setTranslatedOverview] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      setTranslatedOverview(null);
      try {
        const lang = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        const res = await fetch(`/api/movies/${id}?lang=${lang}`);
        if (!res.ok) throw new Error('Không thể tải chi tiết phim');
        const data = await res.json();
        if (data.success) {
          setMovie(data.data);
          // Auto-trigger Gemini AI overview refinement on page load
          if (data.data.overview) {
            fetch('/api/ai/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: data.data.overview,
                targetLang: i18n.language === 'vi' ? 'vi' : 'en'
              })
            })
              .then((r) => r.json())
              .then((aiRes) => {
                if (aiRes.success && aiRes.translatedText) {
                  setTranslatedOverview(aiRes.translatedText);
                }
              })
              .catch(() => {});
          }
        } else {
          throw new Error(data.message || 'Dữ liệu phim không khả dụng');
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

  const handleAITranslate = async () => {
    if (!movie?.overview || isTranslating) return;
    setIsTranslating(true);
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: movie.overview,
          targetLang: i18n.language === 'vi' ? 'vi' : 'en'
        })
      });
      const data = await res.json();
      if (data.success) {
        setTranslatedOverview(data.translatedText);
      }
    } catch (err) {
      console.error('Translation error', err);
    } finally {
      setIsTranslating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pt-6">
        <div className="h-80 rounded-3xl skeleton-box" />
        <div className="h-40 rounded-2xl skeleton-box" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 my-12 border border-slate-800">
        <h2 className="text-lg font-bold text-slate-200">{error || 'Không tìm thấy thông tin phim.'}</h2>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition"
        >
          Trở về Trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-amber-300 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Trở về</span>
      </button>

      {/* Hero Movie Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <ImgWithFallback
            src={movie.backdrop_path || movie.poster_path}
            type="backdrop"
            alt={movie.title}
            className="w-full h-full object-cover opacity-20 filter blur-sm"
          />
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
                  <span
                    key={g.id}
                    className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-100">{movie.title}</h1>
              {movie.original_title && (
                <p className="text-xs text-slate-400 font-medium italic mt-0.5">Tên gốc: {movie.original_title}</p>
              )}
            </div>

            {/* General Info Metadata Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
              <div className="flex items-center space-x-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <User className="w-4 h-4 text-amber-400" />
                <span>Đạo diễn: <strong className="text-white">{movie.director || 'Chưa rõ'}</strong></span>
              </div>

              {movie.writer && (
                <div className="flex items-center space-x-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <Film className="w-4 h-4 text-cyan-400" />
                  <span>Biên kịch: <strong className="text-white">{movie.writer}</strong></span>
                </div>
              )}

              <div className="flex items-center space-x-4 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-slate-400 mr-1" />
                  {movie.release_date || 'N/A'}
                </span>
                <span>&bull;</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-slate-400 mr-1" />
                  {movie.runtime} phút
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings & Financial Performance Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Only show ratings section if movie has been rated (not upcoming with no votes) */}
        {(movie.vote_average && movie.vote_average > 0) ? (
          <section className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-100">Đánh giá & Điểm số Chuyên môn</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
                <span className="text-[10px] font-bold text-amber-400 block uppercase">IMDb Score</span>
                <span className="text-xl font-black text-amber-300">⭐ {movie.imdb_score || movie.vote_average || 'N/A'}</span>
                <span className="text-[9px] text-slate-400 block">Thang điểm 10</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-1">
                <span className="text-[10px] font-bold text-rose-400 block uppercase">Rotten Tomatoes</span>
                <span className="text-base sm:text-xl font-black text-rose-300">
                  🍅 {movie.rotten_tomatoes?.tomatometer != null ? `${movie.rotten_tomatoes.tomatometer}%` : 'Chưa có'}
                </span>
                <span className="text-[9px] text-slate-400 block">
                  Audience: {movie.rotten_tomatoes?.audience_score != null ? `${movie.rotten_tomatoes.audience_score}%` : 'N/A'}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 block uppercase">Metacritic</span>
                <span className="text-base sm:text-xl font-black text-emerald-300">
                  🟢 {movie.metacritic_score != null ? movie.metacritic_score : 'Chưa có'}
                </span>
                <span className="text-[9px] text-slate-400 block">Metascore</span>
              </div>
            </div>
          </section>
        ) : (
          <section className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3 flex items-center justify-center">
            <div className="text-center space-y-2">
              <span className="text-3xl">🚀</span>
              <p className="text-sm font-bold text-cyan-300">Phim Sắp Ra Mắt</p>
              <p className="text-xs text-slate-400">Chưa có điểm đánh giá — hãy quay lại sau khi phim khởi chiếu!</p>
            </div>
          </section>
        )}

        <section className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-lg font-extrabold text-slate-100">Chỉ số Tài chính Phòng vé</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                <span>Ngân sách sản xuất (Budget)</span>
              </span>
              <span className="text-base font-bold text-slate-100 block">{movie.budget || 'Chưa có dữ liệu'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
              <span className="text-xs font-semibold text-amber-400 flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>Doanh thu toàn cầu (Box Office)</span>
              </span>
              <span className="text-base font-black text-amber-300 block">{movie.box_office || 'Chưa có dữ liệu'}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Overview & Natural Language Switcher */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-100">{t('movie.overview')}</h2>

          <button
            onClick={handleAITranslate}
            disabled={isTranslating}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTranslating ? t('movie.aiTranslating') : t('movie.aiTranslate')}</span>
          </button>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-normal">
          {translatedOverview || movie.overview_vi || movie.overview}
        </p>
      </section>

      {/* Technical Highlights Section */}
      {movie.technical_highlights && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-slate-100">Yếu tố Kỹ thuật & Nghệ thuật Nổi bật</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {movie.technical_highlights.cinematography && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-amber-400 block">📷 Quay phim (Cinematography)</span>
                <p className="text-xs text-slate-300">{movie.technical_highlights.cinematography}</p>
              </div>
            )}
            {movie.technical_highlights.music && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-cyan-400 block">🎵 Âm nhạc (Original Score)</span>
                <p className="text-xs text-slate-300">{movie.technical_highlights.music}</p>
              </div>
            )}
            {movie.technical_highlights.vfx && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-purple-400 block">✨ Kỹ xảo (VFX / Special Effects)</span>
                <p className="text-xs text-slate-300">{movie.technical_highlights.vfx}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Movie Awards Section */}
      {movie.awards && movie.awards.length > 0 && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-extrabold text-slate-100">Giải thưởng Phim đạt được</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {movie.awards.map((awd, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-yellow-500/30 flex items-center space-x-3">
                <span className="text-xl">🏆</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{awd.name} ({awd.year})</h4>
                  <p className="text-[11px] text-amber-300">{awd.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cast Section */}
      {movie.cast && movie.cast.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-100">{t('movie.cast')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {movie.cast.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/actor/${c.id}`)}
                className="glass-panel p-3 rounded-2xl border border-slate-800 hover:border-amber-400/40 cursor-pointer flex flex-col items-center text-center space-y-2 group transition"
              >
                <ImgWithFallback
                  src={c.profile_path}
                  type="profile"
                  alt={c.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-700 group-hover:border-amber-400 transition"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition">{c.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{c.character}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Embedded Trailer Modal */}
      {showTrailerModal && movie.trailer_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden border border-amber-500/30">
            <button
              onClick={() => setShowTrailerModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={movie.trailer_url}
                title={movie.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
