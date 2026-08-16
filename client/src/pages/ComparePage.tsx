import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ActorComparison, Actor } from '../types';
import { ImgWithFallback } from '../components/ImgWithFallback';
import { useTranslation } from 'react-i18next';
import { getMovieTitle } from '../utils/langUtils';
import { GitCompare, Star, Film, Search, Sparkles, Trophy, DollarSign, Calendar, Flame, CheckCircle, Award as AwardIcon, ArrowLeftRight } from 'lucide-react';

const POPULAR_MOVIES_SUGGESTIONS = [
  { id: 872585, title: 'Oppenheimer', original_title: 'Oppenheimer', title_vi: 'Oppenheimer', poster_path: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg' },
  { id: 693134, title: 'Dune: Part Two', original_title: 'Dune: Part Two', title_vi: 'Hành Tinh Cát: Phần Hai', poster_path: 'https://image.tmdb.org/t/p/w500/8QdnKQyZDlN6rBSrfU1V5PctfUu.jpg' },
  { id: 157336, title: 'Interstellar', original_title: 'Interstellar', title_vi: 'Hố Đen Vũ Trụ (Interstellar)', poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { id: 27205, title: 'Inception', original_title: 'Inception', title_vi: 'Kẻ Đánh Cắp Giấc Mơ (Inception)', poster_path: 'https://image.tmdb.org/t/p/w500/eBtqGWtR5KUiNl6OXHLR3ri6nVm.jpg' },
  { id: 19995, title: 'Avatar', original_title: 'Avatar', title_vi: 'Avatar', poster_path: 'https://image.tmdb.org/t/p/w500/bxp5IUY05jLGeZ5bW85W2NF6Rgi.jpg' },
  { id: 155, title: 'The Dark Knight', original_title: 'The Dark Knight', title_vi: 'Kỵ Sĩ Bóng Đêm (The Dark Knight)', poster_path: 'https://image.tmdb.org/t/p/w500/7EfSqviKvXwbiGhUjHyUBGVdoiW.jpg' },
  { id: 299534, title: 'Avengers: Endgame', original_title: 'Avengers: Endgame', title_vi: 'Biệt Đội Siêu Anh Hùng: Hồi Kết', poster_path: 'https://image.tmdb.org/t/p/w500/8go3YE9sBMQaCXEx23j6BAfeuxd.jpg' },
  { id: 569094, title: 'Spider-Man', original_title: 'Spider-Man: Across the Spider-Verse', title_vi: 'Spider-Man: Du Hành Vũ Trụ Nhện', poster_path: 'https://image.tmdb.org/t/p/w500/paM6UdMgXuXyAK0jhGfV07o3lRW.jpg' }
];

const formatRevenue = (val?: string | number, isEn: boolean = false): string => {
  if (!val) return isEn ? 'N/A' : 'Chưa có dữ liệu';
  const str = String(val);
  const num = parseMoneyNum(str);
  if (isNaN(num) || num <= 0) return str;

  if (num >= 1000000000) {
    const bill = (num / 1000000000).toFixed(2).replace(/\.00$/, '');
    return `$${bill} ${isEn ? 'Billion' : 'Tỷ USD'}`;
  }
  if (num >= 1000000) {
    const mill = (num / 1000000).toFixed(1).replace(/\.0$/, '');
    return `$${mill} ${isEn ? 'Million' : 'Triệu USD'}`;
  }
  return `$${num.toLocaleString()}`;
};

const parseMoneyNum = (val?: string | number): number => {
  if (!val) return 0;
  const str = String(val);
  if (str.includes('Tỷ USD')) {
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num * 1000000000;
  }
  if (str.includes('Triệu USD')) {
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num * 1000000;
  }
  const clean = parseFloat(str.replace(/[^0-9.]/g, ''));
  return isNaN(clean) ? 0 : clean;
};

const translateGenreName = (g: string, isEn: boolean): string => {
  const viToEnMap: Record<string, string> = {
    'Hành động': 'Action',
    'Phiêu lưu': 'Adventure',
    'Hoạt hình': 'Animation',
    'Hài hước': 'Comedy',
    'Tội phạm': 'Crime',
    'Tài liệu': 'Documentary',
    'Chính kịch': 'Drama',
    'Gia đình': 'Family',
    'Kỳ ảo': 'Fantasy',
    'Lịch sử': 'History',
    'Kinh dị': 'Horror',
    'Âm nhạc': 'Music',
    'Bí ẩn': 'Mystery',
    'Tình cảm': 'Romance',
    'Viễn tưởng': 'Sci-Fi',
    'Phim truyền hình': 'TV Movie',
    'Giật gân': 'Thriller',
    'Chiến tranh': 'War',
    'Miền Tây': 'Western'
  };

  const enToViMap: Record<string, string> = {
    Action: 'Hành động',
    Adventure: 'Phiêu lưu',
    Animation: 'Hoạt hình',
    Comedy: 'Hài hước',
    Crime: 'Tội phạm',
    Documentary: 'Tài liệu',
    Drama: 'Chính kịch',
    Family: 'Gia đình',
    Fantasy: 'Kỳ ảo',
    History: 'Lịch sử',
    Horror: 'Kinh dị',
    Music: 'Âm nhạc',
    Mystery: 'Bí ẩn',
    Romance: 'Tình cảm',
    'Sci-Fi': 'Viễn tưởng',
    'Science Fiction': 'Viễn tưởng',
    'TV Movie': 'Phim truyền hình',
    Thriller: 'Giật gân',
    War: 'Chiến tranh',
    Western: 'Miền Tây'
  };

  if (isEn) {
    return viToEnMap[g] || g;
  }
  return enToViMap[g] || g;
};

const getActorVersatility = (actor: Actor, isEn: boolean): string | null => {
  if (actor.acting_style) return actor.acting_style;
  if (!actor.filmography || actor.filmography.length === 0) return null;

  const genreCounts: Record<string, number> = {};
  actor.filmography.forEach((f) => {
    if (f.genre && f.genre !== 'Cinema' && f.genre !== 'Other') {
      genreCounts[f.genre] = (genreCounts[f.genre] || 0) + 1;
    }
  });

  const sortedGenres = Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a]);
  if (sortedGenres.length === 0) return null;

  const topGenres = sortedGenres.slice(0, 3).map((g) => translateGenreName(g, isEn)).join(', ');
  const totalGenres = sortedGenres.length;

  if (isEn) {
    return `Versatile across ${totalGenres} genres (Mainly: ${topGenres})`;
  }
  return `Đa dạng qua ${totalGenres} thể loại (Chủ yếu: ${topGenres})`;
};

export const ComparePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  const actorAId = parseInt(searchParams.get('a') || searchParams.get('actor1') || '2038', 10);
  const actorBId = parseInt(searchParams.get('b') || searchParams.get('actor2') || '3223', 10);

  const [comparison, setComparison] = useState<ActorComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actorList, setActorList] = useState<Actor[]>([]);

  // Compare Tab Mode ('actor' | 'movie')
  const [compareTab, setCompareTab] = useState<'actor' | 'movie'>(() => {
    return searchParams.get('tab') === 'movie' ? 'movie' : 'actor';
  });

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'movie') setCompareTab('movie');
    else if (tabParam === 'actor') setCompareTab('actor');
  }, [searchParams]);

  // Movie Comparison State
  const paramMa = searchParams.get('ma') || searchParams.get('movie1');
  const paramMb = searchParams.get('mb') || searchParams.get('movie2');

  const [movieAId, setMovieAId] = useState<number>(() => {
    return paramMa ? parseInt(paramMa, 10) : 872585;
  });
  const [movieBId, setMovieBId] = useState<number>(() => {
    return paramMb ? parseInt(paramMb, 10) : 157336;
  });

  useEffect(() => {
    const ma = searchParams.get('ma') || searchParams.get('movie1');
    const mb = searchParams.get('mb') || searchParams.get('movie2');
    if (ma) {
      const pMa = parseInt(ma, 10);
      if (!isNaN(pMa)) setMovieAId(pMa);
    }
    if (mb) {
      const pMb = parseInt(mb, 10);
      if (!isNaN(pMb)) setMovieBId(pMb);
    }
  }, [searchParams]);

  const [movieComparison, setMovieComparison] = useState<any>(null);
  const [movieLoading, setMovieLoading] = useState(false);
  const [movieError, setMovieError] = useState<string | null>(null);
  const [searchMovieA, setSearchMovieA] = useState('');
  const [searchMovieB, setSearchMovieB] = useState('');
  const [liveMoviesA, setLiveMoviesA] = useState<any[]>([]);
  const [liveMoviesB, setLiveMoviesB] = useState<any[]>([]);

  const handleSelectMovieA = (selected: any) => {
    const id = typeof selected === 'object' ? selected.id : selected;
    if (id === movieBId) return;
    setMovieComparison(null);
    setMovieAId(id);
    setSearchMovieA('');
    setLiveMoviesA([]);
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.set('tab', 'movie');
      updated.set('ma', id.toString());
      return updated;
    });
  };

  const handleSelectMovieB = (selected: any) => {
    const id = typeof selected === 'object' ? selected.id : selected;
    if (id === movieAId) return;
    setMovieComparison(null);
    setMovieBId(id);
    setSearchMovieB('');
    setLiveMoviesB([]);
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.set('tab', 'movie');
      updated.set('mb', id.toString());
      return updated;
    });
  };

  // Search input state for picking Actor A and Actor B
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');

  // Live TMDB API Search Results for A and B
  const [liveResultsA, setLiveResultsA] = useState<Actor[]>([]);
  const [liveResultsB, setLiveResultsB] = useState<Actor[]>([]);
  const [isSearchingA, setIsSearchingA] = useState(false);
  const [isSearchingB, setIsSearchingB] = useState(false);

  // Live search for Movie A
  useEffect(() => {
    if (!searchMovieA.trim()) {
      setLiveMoviesA([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(searchMovieA)}`);
        const data = await res.json();
        if (data.success && data.data.movies) setLiveMoviesA(data.data.movies);
      } catch (e) {
        console.error(e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchMovieA]);

  // Live search for Movie B
  useEffect(() => {
    if (!searchMovieB.trim()) {
      setLiveMoviesB([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(searchMovieB)}`);
        const data = await res.json();
        if (data.success && data.data.movies) setLiveMoviesB(data.data.movies);
      } catch (e) {
        console.error(e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchMovieB]);

  // Fetch Movie Comparison
  useEffect(() => {
    if (compareTab === 'movie') {
      setMovieLoading(true);
      setMovieError(null);
      const langParam = i18n.language?.startsWith('en') ? 'en-US' : 'vi-VN';
      fetch(`/api/movies/compare?a=${movieAId}&b=${movieBId}&lang=${langParam}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
            setMovieComparison(d.data);
          } else {
            setMovieError(d.message || 'Không thể so sánh phim');
          }
        })
        .catch((e) => {
          console.error(e);
          setMovieError('Lỗi kết nối khi so sánh phim');
        })
        .finally(() => {
          setMovieLoading(false);
        });
    }
  }, [compareTab, movieAId, movieBId, i18n.language]);

  // Live search for Actor A
  useEffect(() => {
    if (!searchA.trim()) {
      setLiveResultsA([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingA(true);
      try {
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(searchA)}`);
        const data = await res.json();
        if (data.success && data.data.actors) {
          setLiveResultsA(data.data.actors);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearchingA(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchA]);

  // Live search for Actor B
  useEffect(() => {
    if (!searchB.trim()) {
      setLiveResultsB([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingB(true);
      try {
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(searchB)}`);
        const data = await res.json();
        if (data.success && data.data.actors) {
          setLiveResultsB(data.data.actors);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearchingB(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchB]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const langParam = i18n.language?.startsWith('en') ? 'en-US' : 'vi-VN';
        const [compRes, actRes] = await Promise.all([
          fetch(`/api/actors/compare?a=${actorAId}&b=${actorBId}&lang=${langParam}`),
          fetch(`/api/actors/popular?lang=${langParam}`)
        ]);
        if (!compRes.ok) throw new Error('Không thể tải dữ liệu so sánh');
        const compData = await compRes.json();
        const actData = await actRes.json();

        if (compData.success) {
          setComparison(compData.data);
        } else {
          throw new Error(compData.message || 'Dữ liệu so sánh không khả dụng');
        }

        if (actData.success) setActorList(actData.data);
      } catch (err) {
        console.error('Compare fetch error', err);
        setError((err as Error).message || 'Có lỗi xảy ra, vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [actorAId, actorBId, i18n.language]);

  const handleSelectActorA = (id: number) => {
    if (id === actorBId) return; // Prevent selecting the same actor
    setSearchParams({ a: id.toString(), b: actorBId.toString() });
  };

  const handleSelectActorB = (id: number) => {
    if (id === actorAId) return; // Prevent selecting the same actor
    setSearchParams({ a: actorAId.toString(), b: id.toString() });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pt-6">
        <div className="h-64 rounded-3xl skeleton-box" />
        <div className="h-96 rounded-3xl skeleton-box" />
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 my-12 border border-slate-800">
        <h2 className="text-lg font-bold text-slate-200">{error || 'Không tìm thấy dữ liệu so sánh.'}</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const { actorA, actorB, shared_movies, stats } = comparison;

  const filteredActorsA = actorList.filter((a) => a.name.toLowerCase().includes(searchA.toLowerCase()));
  const filteredActorsB = actorList.filter((a) => a.name.toLowerCase().includes(searchB.toLowerCase()));

  const calculateAge = (birthdayStr?: string) => {
    if (!birthdayStr) return 'N/A';
    const birthYear = new Date(birthdayStr).getFullYear();
    const currentYear = new Date().getFullYear();
    return `${currentYear - birthYear} ${isEn ? 'years old' : 'tuổi'}`;
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-100">{isEn ? 'Movie & Actor Comparison' : 'So Sánh Diễn Viên & Phim'}</h1>
        <p className="text-xs sm:text-sm text-slate-400">{isEn ? 'Comprehensive multi-dimensional career and commercial analysis.' : 'Phân tích toàn diện chỉ số sự nghiệp và thành công thương mại.'}</p>
      </div>

      {/* Compare Mode Sub-Tabs */}
      <div className="flex justify-center">
        <div className="p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl inline-flex space-x-2 shadow-xl">
          <button
            onClick={() => {
              setCompareTab('movie');
              setSearchParams((prev) => {
                const updated = new URLSearchParams(prev);
                updated.set('tab', 'movie');
                return updated;
              });
            }}
            className={`px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition cursor-pointer ${compareTab === 'movie'
              ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 shadow-lg'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
          >
            <span>{isEn ? 'Compare Movies' : 'So sánh Phim'}</span>
          </button>

          <button
            onClick={() => {
              setCompareTab('actor');
              setSearchParams((prev) => {
                const updated = new URLSearchParams(prev);
                updated.set('tab', 'actor');
                return updated;
              });
            }}
            className={`px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition cursor-pointer ${compareTab === 'actor'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
          >
            <span>{isEn ? 'Compare Actors' : 'So sánh Diễn viên'}</span>
          </button>
        </div>
      </div>

      {compareTab === 'movie' ? (
        movieLoading && !movieComparison ? (
          <div className="space-y-6 pt-4 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-72 rounded-3xl skeleton-box" />
              <div className="h-72 rounded-3xl skeleton-box" />
            </div>
            <div className="h-96 rounded-3xl skeleton-box" />
          </div>
        ) : movieError ? (
          <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 my-12 border border-slate-800">
            <h2 className="text-lg font-bold text-slate-200">{movieError}</h2>
            <button
              onClick={() => {
                setMovieAId(872585);
                setMovieBId(157336);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition"
            >
              {isEn ? 'Retry with Default Movies' : 'Thử lại với Phim Mặc định'}
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Movie Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Movie A Picker */}
              <div className="glass-panel-glow rounded-3xl p-6 border border-amber-500/30 space-y-5 text-center relative">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">{isEn ? 'Select Movie A' : 'Chọn Phim A'}</span>
                <div className="relative">
                  <input
                    type="text"
                    value={searchMovieA}
                    onChange={(e) => setSearchMovieA(e.target.value)}
                    placeholder={isEn ? 'Type to search Movie A...' : 'Gõ tìm phim A...'}
                    className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 focus:border-amber-400 rounded-lg text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none"
                  />
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  {liveMoviesA.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-2xl p-2 space-y-1 shadow-2xl text-left">
                      {liveMoviesA.map((m) => (
                        <div
                          key={`mA-${m.id}`}
                          onClick={() => handleSelectMovieA(m)}
                          className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800 cursor-pointer text-xs"
                        >
                          <ImgWithFallback src={m.poster_path} type="poster" alt={m.title} className="w-8 h-12 object-cover rounded-md" />
                          <span className="font-bold text-slate-200">{getMovieTitle(m, i18n.language)} ({m.release_date?.split('-')[0]})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {movieComparison?.movieA && (
                  <div onClick={() => navigate(`/movie/${movieComparison.movieA.id}`)} className="cursor-pointer group flex flex-col items-center">
                    <div className="w-32 h-48 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-xl mb-3 bg-slate-900 group-hover:scale-105 transition transform">
                      <ImgWithFallback src={movieComparison.movieA.poster_path} type="poster" alt={movieComparison.movieA.title} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition">{getMovieTitle(movieComparison.movieA, i18n.language)}</h3>
                    <p className="text-xs text-amber-400">IMDb {movieComparison.movieA.vote_average} / 10</p>
                  </div>
                )}

                {/* Quick Movie Suggestions A */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-3 text-left">{isEn ? 'Quick Movie Suggestions:' : 'Gợi ý phim nhanh:'}</span>
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                    {POPULAR_MOVIES_SUGGESTIONS.map((m) => (
                      <div
                        key={`pickMA-${m.id}`}
                        onClick={() => handleSelectMovieA(m)}
                        className={`p-1.5 rounded-xl cursor-pointer border flex flex-col items-center text-center transition ${m.id === movieAId
                          ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/40'
                          : 'bg-slate-900/60 border-slate-800 hover:border-amber-400/40'
                          }`}
                      >
                        <ImgWithFallback src={m.poster_path} type="poster" alt={m.title} className="w-10 h-14 rounded-lg object-cover mb-1" />
                        <span className="text-[10px] font-semibold text-slate-200 truncate w-full">{getMovieTitle(m, i18n.language)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Movie B Picker */}
              <div className="glass-panel-glow rounded-3xl p-6 border border-cyan-500/30 space-y-5 text-center relative">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">{isEn ? 'Select Movie B' : 'Chọn Phim B'}</span>
                <div className="relative">
                  <input
                    type="text"
                    value={searchMovieB}
                    onChange={(e) => setSearchMovieB(e.target.value)}
                    placeholder={isEn ? 'Type to search Movie B...' : 'Gõ tìm phim B...'}
                    className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 focus:border-amber-400 rounded-lg text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none"
                  />
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  {liveMoviesB.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-slate-900 border border-cyan-500/40 rounded-2xl p-2 space-y-1 shadow-2xl text-left">
                      {liveMoviesB.map((m) => (
                        <div
                          key={`mB-${m.id}`}
                          onClick={() => handleSelectMovieB(m)}
                          className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800 cursor-pointer text-xs"
                        >
                          <ImgWithFallback src={m.poster_path} type="poster" alt={m.title} className="w-8 h-12 object-cover rounded-md" />
                          <span className="font-bold text-slate-200">{getMovieTitle(m, i18n.language)} ({m.release_date?.split('-')[0]})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {movieComparison?.movieB && (
                  <div onClick={() => navigate(`/movie/${movieComparison.movieB.id}`)} className="cursor-pointer group flex flex-col items-center">
                    <div className="w-32 h-48 rounded-2xl overflow-hidden border-2 border-cyan-400/60 shadow-xl mb-3 bg-slate-900 group-hover:scale-105 transition transform">
                      <ImgWithFallback src={movieComparison.movieB.poster_path} type="poster" alt={movieComparison.movieB.title} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition">{getMovieTitle(movieComparison.movieB, i18n.language)}</h3>
                    <p className="text-xs text-cyan-400">IMDb {movieComparison.movieB.vote_average} / 10</p>
                  </div>
                )}

                {/* Quick Movie Suggestions B */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-3 text-left">{isEn ? 'Quick Movie Suggestions:' : 'Gợi ý phim nhanh:'}</span>
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                    {POPULAR_MOVIES_SUGGESTIONS.map((m) => (
                      <div
                        key={`pickMB-${m.id}`}
                        onClick={() => handleSelectMovieB(m)}
                        className={`p-1.5 rounded-xl cursor-pointer border flex flex-col items-center text-center transition ${m.id === movieBId
                          ? 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-400/40'
                          : 'bg-slate-900/60 border-slate-800 hover:border-cyan-400/40'
                          }`}
                      >
                        <ImgWithFallback src={m.poster_path} type="poster" alt={m.title} className="w-10 h-14 rounded-lg object-cover mb-1" />
                        <span className="text-[10px] font-semibold text-slate-200 truncate w-full">{getMovieTitle(m, i18n.language)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Movie Comparison Table */}
            {movieComparison && (
              <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl font-extrabold text-slate-100">{isEn ? 'Detailed Movie Comparison Table' : 'Bảng So Sánh Bộ Phim Chi Tiết'}</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80">
                        <th className="py-3.5 px-4 font-bold text-slate-400 uppercase tracking-wider w-1/5 border-r border-slate-800">{isEn ? 'Criteria' : 'Tiêu chí So sánh'}</th>
                        <th onClick={() => navigate(`/movie/${movieComparison.movieA.id}`)} className="py-3.5 px-4 font-extrabold text-slate-100 w-[40%] text-center cursor-pointer hover:underline transition border-r border-slate-800">
                          {getMovieTitle(movieComparison.movieA, i18n.language)}
                        </th>
                        <th onClick={() => navigate(`/movie/${movieComparison.movieB.id}`)} className="py-3.5 px-4 font-extrabold text-slate-100 w-[40%] text-center cursor-pointer hover:underline transition">
                          {getMovieTitle(movieComparison.movieB, i18n.language)}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {/* 1. IMDb Rating */}
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-300 border-r border-slate-800">{isEn ? 'Critic Rating (IMDb)' : 'Đánh giá Chuyên môn (IMDb)'}</td>
                        <td className={`py-3.5 px-4 text-center font-bold border-r border-slate-800 ${movieComparison.movieA.vote_average > movieComparison.movieB.vote_average ? 'text-amber-400 font-extrabold' : 'text-slate-100'}`}>
                          {movieComparison.movieA.vote_average} / 10 ⭐
                        </td>
                        <td className={`py-3.5 px-4 text-center font-bold ${movieComparison.movieB.vote_average > movieComparison.movieA.vote_average ? 'text-amber-400 font-extrabold' : 'text-slate-100'}`}>
                          {movieComparison.movieB.vote_average} / 10 ⭐
                        </td>
                      </tr>

                      {/* 2. Box Office Revenue */}
                      {(() => {
                        const boxNumA = parseMoneyNum(movieComparison.movieA.box_office);
                        const boxNumB = parseMoneyNum(movieComparison.movieB.box_office);
                        return (
                          <tr className="bg-slate-900/20">
                            <td className="py-3.5 px-4 font-bold text-slate-300 border-r border-slate-800">{isEn ? 'Box Office Revenue' : 'Doanh thu Phòng vé'}</td>
                            <td className={`py-3.5 px-4 text-center font-bold border-r border-slate-800 ${boxNumA > boxNumB ? 'text-amber-400 font-extrabold' : 'text-slate-100'}`}>
                              {movieComparison.movieA.box_office ? formatRevenue(movieComparison.movieA.box_office, isEn) : (isEn ? 'N/A' : 'Chưa có dữ liệu')}
                            </td>
                            <td className={`py-3.5 px-4 text-center font-bold ${boxNumB > boxNumA ? 'text-amber-400 font-extrabold' : 'text-slate-100'}`}>
                              {movieComparison.movieB.box_office ? formatRevenue(movieComparison.movieB.box_office, isEn) : (isEn ? 'N/A' : 'Chưa có dữ liệu')}
                            </td>
                          </tr>
                        );
                      })()}

                      {/* 3. Production Budget */}
                      {(() => {
                        const budNumA = parseMoneyNum(movieComparison.movieA.budget);
                        const budNumB = parseMoneyNum(movieComparison.movieB.budget);
                        return (
                          <tr>
                            <td className="py-3.5 px-4 font-bold text-slate-300 border-r border-slate-800">{isEn ? 'Production Budget' : 'Kinh phí Sản xuất'}</td>
                            <td className={`py-3.5 px-4 text-center font-bold border-r border-slate-800 ${budNumA > budNumB ? 'text-amber-400 font-extrabold' : 'text-slate-100'}`}>
                              {movieComparison.movieA.budget ? formatRevenue(movieComparison.movieA.budget, isEn) : (isEn ? 'N/A' : 'Chưa có dữ liệu')}
                            </td>
                            <td className={`py-3.5 px-4 text-center font-bold ${budNumB > budNumA ? 'text-amber-400 font-extrabold' : 'text-slate-100'}`}>
                              {movieComparison.movieB.budget ? formatRevenue(movieComparison.movieB.budget, isEn) : (isEn ? 'N/A' : 'Chưa có dữ liệu')}
                            </td>
                          </tr>
                        );
                      })()}

                      {/* 4. Release Date */}
                      {(() => {
                        const formatDate = (dStr?: string) => {
                          if (!dStr) return 'N/A';
                          const parts = dStr.split('-');
                          if (parts.length === 3) return isEn ? `${parts[0]}-${parts[1]}-${parts[2]}` : `${parts[2]}/${parts[1]}/${parts[0]}`;
                          return dStr;
                        };
                        return (
                          <tr className="bg-slate-900/20">
                            <td className="py-3.5 px-4 font-bold text-slate-300 border-r border-slate-800">{isEn ? 'Release Date' : 'Ngày phát hành'}</td>
                            <td className="py-3.5 px-4 text-center text-slate-100 border-r border-slate-800">
                              {formatDate(movieComparison.movieA.release_date)}
                            </td>
                            <td className="py-3.5 px-4 text-center text-slate-100">
                              {formatDate(movieComparison.movieB.release_date)}
                            </td>
                          </tr>
                        );
                      })()}

                      {/* 5. Runtime */}
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-300 border-r border-slate-800">{isEn ? 'Runtime' : 'Thời lượng Phim'}</td>
                        <td className="py-3.5 px-4 text-center border-r border-slate-800 text-slate-100">
                          {movieComparison.movieA.runtime || 120} {isEn ? 'mins' : 'phút'}
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-100">
                          {movieComparison.movieB.runtime || 120} {isEn ? 'mins' : 'phút'}
                        </td>
                      </tr>

                      {/* 6. Director */}
                      <tr className="bg-slate-900/20">
                        <td className="py-3.5 px-4 font-bold text-slate-300 border-r border-slate-800">{isEn ? 'Director' : 'Đạo diễn'}</td>
                        <td className="py-3.5 px-4 text-center text-slate-100 border-r border-slate-800">{movieComparison.movieA.director || 'N/A'}</td>
                        <td className="py-3.5 px-4 text-center text-slate-100">{movieComparison.movieB.director || 'N/A'}</td>
                      </tr>

                      {/* 7. Studio */}
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-slate-300 border-r border-slate-800">{isEn ? 'Studio / Distributor' : 'Hãng sản xuất (Studio)'}</td>
                        <td className="py-3.5 px-4 text-center text-slate-100 border-r border-slate-800">{movieComparison.movieA.studio || 'Studio'}</td>
                        <td className="py-3.5 px-4 text-center text-slate-100">{movieComparison.movieB.studio || 'Studio'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        )) : (
        <>
          {/* Side by Side Interactive Selector with Search & Image Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Actor A Selector Card */}
            <div className="glass-panel-glow rounded-3xl p-6 border border-amber-500/30 space-y-5 text-center relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {isEn ? 'Select Actor A' : 'Chọn Diễn viên A'}
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchA}
                  onChange={(e) => setSearchA(e.target.value)}
                  placeholder={isEn ? 'Search actor here...' : 'Tìm diễn viên ở đây nè...'}
                  className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 focus:border-amber-400 rounded-lg text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none"
                />
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />

                {/* Live TMDB Autocomplete Dropdown A */}
                {liveResultsA.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-2xl p-2 space-y-1 shadow-2xl text-left">
                    {liveResultsA.map((act) => (
                      <div
                        key={`liveA-${act.id}`}
                        onClick={() => {
                          handleSelectActorA(act.id);
                          setSearchA('');
                          setLiveResultsA([]);
                        }}
                        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800 cursor-pointer transition text-xs"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-800 border border-slate-700">
                          <ImgWithFallback src={act.profile_path} type="profile" alt={act.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-slate-200">{act.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                onClick={() => navigate(`/actor/${actorA.id}`)}
                className="pt-2 flex flex-col items-center cursor-pointer group hover:opacity-90 transition"
                title={isEn ? 'Click to view Actor A details' : 'Bấm để xem thông tin chi tiết diễn viên A'}
              >
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-amber-400/60 shadow-2xl mb-3 bg-slate-900 group-hover:scale-105 transition transform">
                  <ImgWithFallback src={actorA.profile_path} type="profile" alt={actorA.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition flex items-center space-x-1">
                  <span>{actorA.name}</span>
                </h3>
                <p className="text-xs text-amber-300">{actorA.nationality || actorA.place_of_birth || (isEn ? 'International' : 'Quốc tế')}</p>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-3 text-left">{isEn ? 'Actor Suggestions:' : 'Gợi ý diễn viên:'}</span>
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                  {filteredActorsA.map((a) => (
                    <div
                      key={`pickA-${a.id}`}
                      onClick={() => handleSelectActorA(a.id)}
                      className={`p-1.5 rounded-xl cursor-pointer border flex flex-col items-center text-center transition ${a.id === actorA.id
                        ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/40'
                        : 'bg-slate-900/60 border-slate-800 hover:border-amber-400/40'
                        }`}
                    >
                      <ImgWithFallback src={a.profile_path} type="profile" alt={a.name} className="w-10 h-10 rounded-full object-cover mb-1" />
                      <span className="text-[10px] font-semibold text-slate-200 truncate w-full">{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actor B Selector Card */}
            <div className="glass-panel-glow rounded-3xl p-6 border border-cyan-500/30 space-y-5 text-center relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {isEn ? 'Select Actor B' : 'Chọn Diễn viên B'}
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchB}
                  onChange={(e) => setSearchB(e.target.value)}
                  placeholder={isEn ? 'Search actor here...' : 'Tìm diễn viên ở đây nè...'}
                  className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 focus:border-amber-400 rounded-lg text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none"
                />
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />

                {/* Live TMDB Autocomplete Dropdown B */}
                {liveResultsB.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-slate-900 border border-cyan-500/40 rounded-2xl p-2 space-y-1 shadow-2xl text-left">
                    {liveResultsB.map((act) => (
                      <div
                        key={`liveB-${act.id}`}
                        onClick={() => {
                          handleSelectActorB(act.id);
                          setSearchB('');
                          setLiveResultsB([]);
                        }}
                        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800 cursor-pointer transition text-xs"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-800 border border-slate-700">
                          <ImgWithFallback src={act.profile_path} type="profile" alt={act.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-slate-200">{act.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                onClick={() => navigate(`/actor/${actorB.id}`)}
                className="pt-2 flex flex-col items-center cursor-pointer group hover:opacity-90 transition"
                title={isEn ? 'Click to view Actor B details' : 'Bấm để xem thông tin chi tiết diễn viên B'}
              >
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-cyan-400/60 shadow-2xl mb-3 bg-slate-900 group-hover:scale-105 transition transform">
                  <ImgWithFallback src={actorB.profile_path} type="profile" alt={actorB.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition flex items-center space-x-1">
                  <span>{actorB.name}</span>
                </h3>
                <p className="text-xs text-cyan-300">{actorB.nationality || actorB.place_of_birth || (isEn ? 'International' : 'Quốc tế')}</p>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-3 text-left">{isEn ? 'Actor Suggestions:' : 'Gợi ý diễn viên:'}</span>
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                  {filteredActorsB.map((a) => (
                    <div
                      key={`pickB-${a.id}`}
                      onClick={() => handleSelectActorB(a.id)}
                      className={`p-1.5 rounded-xl cursor-pointer border flex flex-col items-center text-center transition ${a.id === actorB.id
                        ? 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-400/40'
                        : 'bg-slate-900/60 border-slate-800 hover:border-cyan-400/40'
                        }`}
                    >
                      <ImgWithFallback src={a.profile_path} type="profile" alt={a.name} className="w-10 h-10 rounded-full object-cover mb-1" />
                      <span className="text-[10px] font-semibold text-slate-200 truncate w-full">{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MULTI-DIMENSIONAL COMPARISON TABLE */}
          <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-extrabold text-slate-100">{isEn ? 'Multi-Dimensional Actor Comparison Table' : 'Bảng So Sánh Tổng Hợp Đa Chiều'}</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80">
                    <th className="py-3.5 px-4 font-bold text-slate-400 uppercase tracking-wider w-1/5 border-r border-slate-800">{isEn ? 'Criteria' : 'Tiêu chí So sánh'}</th>
                    <th onClick={() => navigate(`/actor/${actorA.id}`)} className="py-3.5 px-4 font-extrabold text-slate-100 w-[40%] text-center cursor-pointer hover:text-amber-400 transition border-r border-slate-800">
                      {actorA.name}
                    </th>
                    <th onClick={() => navigate(`/actor/${actorB.id}`)} className="py-3.5 px-4 font-extrabold text-slate-100 w-[40%] text-center cursor-pointer hover:text-amber-400 transition">
                      {actorB.name}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {/* Basic Info */}
                  <tr className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-300 border-r border-slate-800">{isEn ? 'Age / Active Years' : 'Tuổi / Sự nghiệp'}</td>
                    <td className={`py-3.5 px-4 text-center font-medium border-r border-slate-800 ${stats.actorA_career_years > stats.actorB_career_years ? 'text-amber-400 font-bold' : 'text-slate-100'}`}>
                      {calculateAge(actorA.birthday)} &bull; {stats.actorA_career_years} {isEn ? 'active years' : 'năm hoạt động'}
                    </td>
                    <td className={`py-3.5 px-4 text-center font-medium ${stats.actorB_career_years > stats.actorA_career_years ? 'text-amber-400 font-bold' : 'text-slate-100'}`}>
                      {calculateAge(actorB.birthday)} &bull; {stats.actorB_career_years} {isEn ? 'active years' : 'năm hoạt động'}
                    </td>
                  </tr>

                  {/* Commercial Success */}
                  <tr className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-300 border-r border-slate-800">{isEn ? 'Total Box Office' : 'Tổng doanh thu'}</td>
                    <td className={`py-3.5 px-4 text-center border-r border-slate-800 ${parseMoneyNum(stats.actorA_box_office) > parseMoneyNum(stats.actorB_box_office) ? 'text-amber-400 font-bold' : 'text-slate-100'}`}>
                      <div>{formatRevenue(stats.actorA_box_office, isEn)}</div>
                      <span className="block text-[10px] text-slate-400 font-normal mt-0.5">{isEn ? 'Highest film:' : 'Phim cao nhất:'} {actorA.highest_grossing_movie || 'N/A'}</span>
                    </td>
                    <td className={`py-3.5 px-4 text-center ${parseMoneyNum(stats.actorB_box_office) > parseMoneyNum(stats.actorA_box_office) ? 'text-amber-400 font-bold' : 'text-slate-100'}`}>
                      <div>{formatRevenue(stats.actorB_box_office, isEn)}</div>
                      <span className="block text-[10px] text-slate-400 font-normal mt-0.5">{isEn ? 'Highest film:' : 'Phim cao nhất:'} {actorB.highest_grossing_movie || 'N/A'}</span>
                    </td>
                  </tr>

                  {/* Critical Rating Average */}
                  <tr className="hover:bg-slate-900/40 transition bg-slate-900/20">
                    <td className="py-3.5 px-4 font-bold text-slate-300 border-r border-slate-800">{isEn ? 'Average IMDb ' : 'IMDb trung bình'}</td>
                    <td className={`py-3.5 px-4 text-center border-r border-slate-800 ${stats.actorA_avg_rating > stats.actorB_avg_rating ? 'text-amber-400 font-bold' : 'text-slate-100'}`}>
                      {stats.actorA_avg_rating} / 10 ({stats.actorA_total_movies} {isEn ? 'movies' : 'phim'})
                    </td>
                    <td className={`py-3.5 px-4 text-center ${stats.actorB_avg_rating > stats.actorA_avg_rating ? 'text-amber-400 font-bold' : 'text-slate-100'}`}>
                      {stats.actorB_avg_rating} / 10 ({stats.actorB_total_movies} {isEn ? 'movies' : 'phim'})
                    </td>
                  </tr>

                  {/* Landmark Iconic Works */}
                  <tr className="hover:bg-slate-900/40 transition bg-slate-900/20">
                    <td className="py-3 px-4 font-bold text-slate-300 border-r border-slate-800">{isEn ? 'Landmark Films' : 'Tác phẩm Để đời'}</td>
                    <td className="py-3 px-4 text-left text-xs text-slate-100 border-r border-slate-800">
                      <ul className="list-disc list-inside space-y-1">
                        {(actorA.landmark_works || ['Oppenheimer', 'Inception', 'Peaky Blinders']).map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-3 px-4 text-left text-xs text-slate-100">
                      <ul className="list-disc list-inside space-y-1">
                        {(actorB.landmark_works || ['Iron Man', 'Avengers: Endgame', 'Sherlock Holmes']).map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Shared Movies Section */}
          <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2">
              <Film className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bold text-slate-100">{isEn ? 'Co-Starred Movies' : 'Phim đã cùng đóng'}</h3>
            </div>

            {shared_movies.length === 0 ? (
              <p className="text-xs text-slate-400 italic">{isEn ? 'These actors have not co-starred in any movies together.' : 'Hai diễn viên chưa có phim chung.'}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {shared_movies.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => navigate(`/movie/${m.id}`)}
                    className="glass-panel p-4 rounded-2xl border border-amber-500/30 hover:border-amber-400 cursor-pointer flex items-center space-x-4 transition"
                  >
                    <ImgWithFallback src={m.poster_path} type="poster" alt={m.title} className="w-16 h-24 object-cover rounded-xl shadow-md" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-300">{getMovieTitle(m, i18n.language)} ({m.year})</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        {actorA.name}: <span className="font-semibold text-white">{m.characterA}</span>
                      </p>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {actorB.name}: <span className="font-semibold text-white">{m.characterB}</span>
                      </p>
                      <span className="text-[10px] text-amber-400 font-bold block mt-2">⭐ IMDb {m.vote_average}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Genre Distribution Comparison */}
          <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-slate-100">{isEn ? 'Genre Distribution' : 'Phân bố Thể loại'}</h3>
            <div className="space-y-3">
              {(() => {
                const maxCount = Math.max(
                  1,
                  ...stats.genre_distribution.flatMap((g) => [g.actorA_count, g.actorB_count])
                );
                return stats.genre_distribution.map((g) => (
                  <div key={g.genre} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span className="text-amber-400">{g.actorA_count} {isEn ? 'movies' : 'phim'}</span>
                      <span>{translateGenreName(g.genre, isEn)}</span>
                      <span className="text-cyan-400">{g.actorB_count} {isEn ? 'movies' : 'phim'}</span>
                    </div>
                    <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden flex">
                      <div
                        className="bg-amber-500 h-full"
                        style={{ width: `${Math.min(100, Math.round((g.actorA_count / maxCount) * 100))}%` }}
                      />
                      <div className="flex-1" />
                      <div
                        className="bg-cyan-500 h-full"
                        style={{ width: `${Math.min(100, Math.round((g.actorB_count / maxCount) * 100))}%` }}
                      />
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Genre Distribution Conclusion Box */}
            {(() => {
              const versA = getActorVersatility(actorA, isEn);
              const versB = getActorVersatility(actorB, isEn);
              if (!versA && !versB) return null;

              return (
                <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-amber-500/20">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                      {isEn ? 'Conclusion' : 'Kết luận'}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {versA && (
                      <div className="p-3 bg-slate-900/90 rounded-xl border border-amber-500/30">
                        <span className="font-bold text-amber-300 block mb-1">{actorA.name}:</span>
                        <span className="text-slate-200 font-medium">{versA}</span>
                      </div>
                    )}
                    {versB && (
                      <div className="p-3 bg-slate-900/90 rounded-xl border border-cyan-500/30">
                        <span className="font-bold text-cyan-300 block mb-1">{actorB.name}:</span>
                        <span className="text-slate-200 font-medium">{versB}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </section>
        </>
      )}
    </div>
  );
};
