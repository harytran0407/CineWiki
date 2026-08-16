import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie, Actor, formatDepartmentRole } from '../types';
import { ImgWithFallback } from '../components/ImgWithFallback';
import { useTranslation } from 'react-i18next';
import { getMovieTitle } from '../utils/langUtils';
import { Film, Star, Sparkles, GitCompare, Play, Heart, ChevronRight, User, Calendar, ChevronLeft } from 'lucide-react';

interface HomePageProps {
  userFollowIds: number[];
  onToggleFollow: (actorId: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ userFollowIds, onToggleFollow }) => {
  const navigate = useNavigate();

  // Trending Movies State & Pagination (15 movies per page)
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingPage, setTrendingPage] = useState(1);
  const [trendingTotalPages, setTrendingTotalPages] = useState(10);
  const [loadingTrending, setLoadingTrending] = useState(true);

  // Upcoming Movies State & Pagination (15 movies per page)
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [upcomingTotalPages, setUpcomingTotalPages] = useState(10);
  const { t, i18n } = useTranslation();
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);

  // Popular Actors State
  const [popularActors, setPopularActors] = useState<Actor[]>([]);
  const [loadingActors, setLoadingActors] = useState(true);

  const lang = i18n.language?.startsWith('en') ? 'en-US' : 'vi-VN';

  // Fetch Trending Movies
  useEffect(() => {
    const fetchTrending = async () => {
      setLoadingTrending(true);
      try {
        const res = await fetch(`/api/movies/trending?lang=${lang}&page=${trendingPage}`);
        const data = await res.json();
        if (data.success && data.data) {
          setTrendingMovies(data.data);
          if (data.total_pages) setTrendingTotalPages(data.total_pages);
        }
      } catch (err) {
        console.error('Fetch trending error', err);
      } finally {
        setLoadingTrending(false);
      }
    };
    fetchTrending();
  }, [lang, trendingPage]);

  // Fetch Upcoming Movies
  useEffect(() => {
    const fetchUpcoming = async () => {
      setLoadingUpcoming(true);
      try {
        const res = await fetch(`/api/movies/upcoming?lang=${lang}&page=${upcomingPage}`);
        const data = await res.json();
        if (data.success && data.data) {
          setUpcomingMovies(data.data);
          if (data.total_pages) setUpcomingTotalPages(data.total_pages);
        }
      } catch (err) {
        console.error('Fetch upcoming error', err);
      } finally {
        setLoadingUpcoming(false);
      }
    };
    fetchUpcoming();
  }, [lang, upcomingPage]);

  // Fetch Popular Actors
  useEffect(() => {
    const fetchActors = async () => {
      setLoadingActors(true);
      try {
        const res = await fetch(`/api/actors/popular?lang=${lang}`);
        const data = await res.json();
        if (data.success && data.data) {
          setPopularActors(data.data);
        }
      } catch (err) {
        console.error('Fetch actors error', err);
      } finally {
        setLoadingActors(false);
      }
    };
    fetchActors();
  }, [lang]);

  const heroMovie = trendingMovies[0];
  const displayedTrending = trendingMovies.slice(0, 15);
  const displayedUpcoming = upcomingMovies.slice(0, 15);

  const isEn = i18n.language?.startsWith('en');

  useEffect(() => {
    document.title = t('home.title') || (isEn ? 'CineWiki - Discover World Cinema' : 'CineWiki - Khám Phá Điện Ảnh Thế Giới');
  }, [i18n.language, t, isEn]);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative w-full rounded-3xl overflow-hidden glass-panel border border-amber-500/20 shadow-2xl min-h-[460px] flex items-end">
        {heroMovie && (
          <div className="absolute inset-0 z-0">
            <ImgWithFallback
              src={heroMovie.backdrop_path || heroMovie.poster_path}
              type="backdrop"
              alt={heroMovie.title}
              className="w-full h-full object-cover opacity-35 scale-105 transition transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14] via-transparent to-transparent" />
          </div>
        )}

        <div className="relative z-10 p-6 sm:p-12 max-w-3xl space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-100 leading-tight space-y-1">
            <div>
              Cine<span className="text-amber-400">Wiki</span>
            </div>
            <div className="text-2xl sm:text-4xl text-slate-100 font-bold">
              {isEn ? 'Discover World Cinema' : 'Khám Phá Điện Ảnh Thế Giới'}
            </div>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 line-clamp-3">
            {t('home.subtitle') || (isEn ? 'Explore world cinema with comprehensive details on top movies, actors, and directors.' : 'Khám phá kho tàng điện ảnh thế giới với thông tin chi tiết về phim, diễn viên và đạo diễn hàng đầu.')}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            {heroMovie && (
              <button
                onClick={() => navigate(`/movie/${heroMovie.id}`)}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-2xl shadow-xl flex items-center space-x-2 transition transform active:scale-95 text-sm cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{t('home.watchFeatured') || (isEn ? 'Watch Featured Movie' : 'Xem Phim Nổi Bật')}</span>
              </button>
            )}


          </div>
        </div>
      </section>

      {/* SECTION 1: TRENDING MOVIES (PHIM ĐANG THỊNH HÀNH) - EXACTLY 15 ITEMS PER PAGE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Film className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-100 flex items-center space-x-2">
                <span>{t('home.trendingMovies') || (isEn ? 'Trending Movies' : 'Phim Đang Thịnh Hành')}</span>
              </h2>
              <p className="text-xs text-slate-400">{t('home.trendingSub') || (isEn ? 'Top trending and most popular movies worldwide' : 'Các tác phẩm có lượng xem và quan tâm cao nhất thế giới')}</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/search')}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-md hover:scale-105"
          >
            <span>{t('home.viewAll') || (isEn ? 'View All' : 'Xem thêm')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loadingTrending ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3.5 sm:gap-6">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl skeleton-box" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3.5 sm:gap-6">
            {displayedTrending.map((movie) => (
              <div
                key={`trend-${movie.id}`}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="group cursor-pointer glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-400/40 transition duration-300 transform hover:-translate-y-1.5 shadow-lg flex flex-col"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
                  <ImgWithFallback
                    src={movie.poster_path}
                    type="poster"
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {movie.vote_average > 0 && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-amber-400/30 flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{movie.vote_average}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-slate-100 truncate group-hover:text-amber-300 transition">
                    {getMovieTitle(movie, i18n.language)}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {movie.release_date ? movie.release_date.split('-')[0] : ''} • {movie.genres?.[0]?.name || (isEn ? 'Cinema' : 'Điện ảnh')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOTTOM PAGINATION BAR FOR TRENDING */}
        <div className="flex items-center justify-center space-x-3 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setTrendingPage((p) => Math.max(1, p - 1))}
            disabled={trendingPage === 1 || loadingTrending}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 text-slate-300 disabled:opacity-40 transition cursor-pointer text-xs font-bold flex items-center space-x-1.5 shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t('home.prevPage') || (isEn ? 'Previous' : 'Trang trước')}</span>
          </button>

          <span className="text-xs font-bold px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            {t('home.pageOf', { current: trendingPage, total: Math.min(20, trendingTotalPages) }) || (isEn ? `Page ${trendingPage} / ${Math.min(20, trendingTotalPages)}` : `Trang ${trendingPage} / ${Math.min(20, trendingTotalPages)}`)}
          </span>

          <button
            onClick={() => setTrendingPage((p) => Math.min(trendingTotalPages, p + 1))}
            disabled={trendingPage >= trendingTotalPages || loadingTrending}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 text-slate-300 disabled:opacity-40 transition cursor-pointer text-xs font-bold flex items-center space-x-1.5 shadow-md"
          >
            <span>{t('home.nextPage') || (isEn ? 'Next' : 'Trang sau')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SECTION 2: UPCOMING MOVIES (PHIM SẮP KHỞI CHIẾU - STRICTLY FUTURE DATES) - EXACTLY 15 ITEMS PER PAGE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-100 flex items-center space-x-2">
                <span>{t('home.upcomingMovies') || (isEn ? 'Upcoming Releases' : 'Phim Sắp Khởi Chiếu')}</span>
              </h2>
              <p className="text-xs text-slate-400">{t('home.upcomingSub') || (isEn ? 'Upcoming blockbuster movies hitting theaters soon' : 'Các siêu bom tấn sắp khởi chiếu')}</p>
            </div>
          </div>
        </div>

        {loadingUpcoming ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3.5 sm:gap-6">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl skeleton-box" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3.5 sm:gap-6">
            {displayedUpcoming.map((movie) => (
              <div
                key={`up-${movie.id}`}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="group cursor-pointer glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-400/40 transition duration-300 transform hover:-translate-y-1.5 shadow-lg flex flex-col"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
                  <ImgWithFallback
                    src={movie.poster_path}
                    type="poster"
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-slate-100 truncate group-hover:text-cyan-300 transition">
                    {getMovieTitle(movie, i18n.language)}
                  </h3>
                  <p className="text-[10px] text-cyan-400 font-semibold mt-1 truncate">
                    {t('home.releasing', { date: movie.release_date || (isEn ? 'Future' : 'Tương lai') }) || (isEn ? `Releasing: ${movie.release_date || 'Future'}` : `Khởi chiếu: ${movie.release_date || 'Tương lai'}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOTTOM PAGINATION BAR FOR UPCOMING */}
        <div className="flex items-center justify-center space-x-3 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setUpcomingPage((p) => Math.max(1, p - 1))}
            disabled={upcomingPage === 1 || loadingUpcoming}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400/50 text-slate-300 disabled:opacity-40 transition cursor-pointer text-xs font-bold flex items-center space-x-1.5 shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t('home.prevPage') || (isEn ? 'Previous' : 'Trang trước')}</span>
          </button>

          <span className="text-xs font-bold px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            {t('home.pageOf', { current: upcomingPage, total: Math.min(20, upcomingTotalPages) }) || (isEn ? `Page ${upcomingPage} / ${Math.min(20, upcomingTotalPages)}` : `Trang ${upcomingPage} / ${Math.min(20, upcomingTotalPages)}`)}
          </span>

          <button
            onClick={() => setUpcomingPage((p) => Math.min(upcomingTotalPages, p + 1))}
            disabled={upcomingPage >= upcomingTotalPages || loadingUpcoming}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400/50 text-slate-300 disabled:opacity-40 transition cursor-pointer text-xs font-bold flex items-center space-x-1.5 shadow-md"
          >
            <span>{t('home.nextPage') || (isEn ? 'Next' : 'Trang sau')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SECTION 3: FEATURED ACTORS GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <User className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-100">{t('home.featuredActors') || (isEn ? 'Featured Actors' : 'Diễn viên Nổi bật')}</h2>
              <p className="text-xs text-slate-400">{t('home.actorsSub') || (isEn ? 'Top leading actors driving global box office successes' : 'Các diễn viên hàng đầu đang dẫn dắt phòng vé toàn cầu')}</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/actors')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-purple-400 hover:text-purple-300 text-xs font-bold transition cursor-pointer flex items-center space-x-1 shadow-md"
          >
            <span>{t('home.viewAll') || (isEn ? 'View All' : 'Xem thêm')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingActors ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-3xl skeleton-box" />
            ))}
          </div>
        ) : popularActors.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-2xl border border-slate-800 text-xs text-slate-400">
            {isEn ? 'No featured actors list available.' : 'Chưa có danh sách diễn viên nổi bật.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
            {popularActors.map((actor) => {
              const isFollowing = userFollowIds.includes(actor.id);
              return (
                <div
                  key={actor.id}
                  className="glass-panel rounded-3xl p-4 border border-slate-800 hover:border-purple-500/40 transition duration-300 flex flex-col items-center text-center space-y-3 group"
                >
                  <div
                    onClick={() => navigate(`/actor/${actor.id}`)}
                    className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 border-purple-400/40 group-hover:border-purple-400 transition bg-slate-900"
                  >
                    <ImgWithFallback
                      src={actor.profile_path}
                      type="profile"
                      alt={actor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>

                  <div onClick={() => navigate(`/actor/${actor.id}`)} className="cursor-pointer">
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-purple-300 transition">
                      {actor.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{formatDepartmentRole(actor.known_for_department, isEn, actor.gender)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
