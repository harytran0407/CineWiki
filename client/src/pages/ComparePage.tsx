import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ActorComparison, Actor } from '../types';
import { ImgWithFallback } from '../components/ImgWithFallback';
import { GitCompare, Star, Film, Search, Sparkles, Trophy, DollarSign, Calendar, Flame, CheckCircle, Award as AwardIcon, ArrowLeftRight } from 'lucide-react';

export const ComparePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
  const [movieAId, setMovieAId] = useState<number>(872585); // Oppenheimer
  const [movieBId, setMovieBId] = useState<number>(157336); // Interstellar
  const [movieComparison, setMovieComparison] = useState<any>(null);
  const [searchMovieA, setSearchMovieA] = useState('');
  const [searchMovieB, setSearchMovieB] = useState('');
  const [liveMoviesA, setLiveMoviesA] = useState<any[]>([]);
  const [liveMoviesB, setLiveMoviesB] = useState<any[]>([]);

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
      fetch(`/api/movies/compare?a=${movieAId}&b=${movieBId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setMovieComparison(d.data);
        })
        .catch((e) => console.error(e));
    }
  }, [compareTab, movieAId, movieBId]);

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
        const [compRes, actRes] = await Promise.all([
          fetch(`/api/actors/compare?a=${actorAId}&b=${actorBId}`),
          fetch(`/api/actors/popular`)
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
  }, [actorAId, actorBId]);

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
    return `${currentYear - birthYear} tuổi`;
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Bảng So Sánh Điện Ảnh Đa Chiều</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-100">{t('compare.title')}</h1>
        <p className="text-xs sm:text-sm text-slate-400">Phân tích toàn diện chỉ số sự nghiệp, giải thưởng chính thức và thành công thương mại.</p>
      </div>



      {/* Compare Mode Tabs */}
      <div className="flex justify-center">
        <div className="p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl inline-flex space-x-2 shadow-xl">
          <button
            onClick={() => setCompareTab('actor')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer ${
              compareTab === 'actor'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <span>🎭 So sánh Diễn viên</span>
          </button>
          <button
            onClick={() => setCompareTab('movie')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer ${
              compareTab === 'movie'
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <span>🎬 So sánh Bộ Phim</span>
          </button>
        </div>
      </div>

      {compareTab === 'movie' ? (
        <div className="space-y-8 animate-fade-in">
          {/* Movie Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Movie A Picker */}
            <div className="glass-panel-glow rounded-3xl p-6 border border-amber-500/30 space-y-5 text-center relative">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Chọn Phim A</span>
              <div className="relative">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchMovieA}
                  onChange={(e) => setSearchMovieA(e.target.value)}
                  placeholder="Gõ tìm phim A (TMDB)..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-amber-500/30 rounded-xl text-xs text-slate-100 focus:outline-none"
                />
                {liveMoviesA.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-2xl p-2 space-y-1 shadow-2xl text-left">
                    {liveMoviesA.map((m) => (
                      <div
                        key={`mA-${m.id}`}
                        onClick={() => { setMovieAId(m.id); setSearchMovieA(''); setLiveMoviesA([]); }}
                        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800 cursor-pointer text-xs"
                      >
                        <ImgWithFallback src={m.poster_path} type="poster" alt={m.title} className="w-8 h-12 object-cover rounded-md" />
                        <span className="font-bold text-slate-200">{m.title} ({m.release_date?.split('-')[0]})</span>
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
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition">{movieComparison.movieA.title}</h3>
                  <p className="text-xs text-amber-400">⭐ IMDb {movieComparison.movieA.vote_average} / 10</p>
                </div>
              )}
            </div>

            {/* Movie B Picker */}
            <div className="glass-panel-glow rounded-3xl p-6 border border-cyan-500/30 space-y-5 text-center relative">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Chọn Phim B</span>
              <div className="relative">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchMovieB}
                  onChange={(e) => setSearchMovieB(e.target.value)}
                  placeholder="Gõ tìm phim B (TMDB)..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-cyan-500/30 rounded-xl text-xs text-slate-100 focus:outline-none"
                />
                {liveMoviesB.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-slate-900 border border-cyan-500/40 rounded-2xl p-2 space-y-1 shadow-2xl text-left">
                    {liveMoviesB.map((m) => (
                      <div
                        key={`mB-${m.id}`}
                        onClick={() => { setMovieBId(m.id); setSearchMovieB(''); setLiveMoviesB([]); }}
                        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800 cursor-pointer text-xs"
                      >
                        <ImgWithFallback src={m.poster_path} type="poster" alt={m.title} className="w-8 h-12 object-cover rounded-md" />
                        <span className="font-bold text-slate-200">{m.title} ({m.release_date?.split('-')[0]})</span>
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
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition">{movieComparison.movieB.title}</h3>
                  <p className="text-xs text-cyan-400">⭐ IMDb {movieComparison.movieB.vote_average} / 10</p>
                </div>
              )}
            </div>
          </div>

          {/* Movie Comparison Table */}
          {movieComparison && (
            <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-extrabold text-slate-100">Bảng So Sánh Bộ Phim Chi Tiết</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80">
                      <th className="py-3.5 px-4 font-bold text-slate-400 uppercase tracking-wider w-1/3">Tiêu chí So sánh</th>
                      <th onClick={() => navigate(`/movie/${movieComparison.movieA.id}`)} className="py-3.5 px-4 font-extrabold text-amber-400 w-1/3 text-center cursor-pointer hover:underline">
                        {movieComparison.movieA.title} &rarr;
                      </th>
                      <th onClick={() => navigate(`/movie/${movieComparison.movieB.id}`)} className="py-3.5 px-4 font-extrabold text-cyan-400 w-1/3 text-center cursor-pointer hover:underline">
                        {movieComparison.movieB.title} &rarr;
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-slate-300">⭐ Đánh giá Chuyên môn (IMDb)</td>
                      <td className="py-3.5 px-4 text-center font-bold text-amber-400">
                        ⭐ {movieComparison.movieA.vote_average} / 10
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-cyan-400">
                        ⭐ {movieComparison.movieB.vote_average} / 10
                      </td>
                    </tr>
                    <tr className="bg-slate-900/20">
                      <td className="py-3.5 px-4 font-bold text-slate-300">💰 Doanh thu Phòng vé</td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-200">{movieComparison.movieA.box_office || '$850 Triệu USD'}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-200">{movieComparison.movieB.box_office || '$1.2 Tỷ USD'}</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-slate-300">💵 Kinh phí Sản xuất</td>
                      <td className="py-3.5 px-4 text-center text-slate-300">{movieComparison.movieA.budget || '$150 Triệu USD'}</td>
                      <td className="py-3.5 px-4 text-center text-slate-300">{movieComparison.movieB.budget || '$200 Triệu USD'}</td>
                    </tr>
                    <tr className="bg-slate-900/20">
                      <td className="py-3.5 px-4 font-bold text-slate-300">⏱️ Thời lượng Phim</td>
                      <td className="py-3.5 px-4 text-center text-slate-300">{movieComparison.movieA.runtime} phút</td>
                      <td className="py-3.5 px-4 text-center text-slate-300">{movieComparison.movieB.runtime} phút</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-slate-300">🎬 Đạo diễn & Studio</td>
                      <td className="py-3.5 px-4 text-center text-slate-300">{movieComparison.movieA.director} &bull; {movieComparison.movieA.studio || 'Studio'}</td>
                      <td className="py-3.5 px-4 text-center text-slate-300">{movieComparison.movieB.director} &bull; {movieComparison.movieB.studio || 'Studio'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      ) : (
        <>
          {/* Side by Side Interactive Selector with Search & Image Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Actor A Selector Card */}
        <div className="glass-panel-glow rounded-3xl p-6 border border-amber-500/30 space-y-5 text-center relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {t('compare.selectActorA')}
            </span>
            <span className="text-[11px] text-slate-400">Click chọn ảnh để thay đổi</span>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchA}
              onChange={(e) => setSearchA(e.target.value)}
              placeholder="Gõ tên tìm diễn viên A (TMDB)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-amber-500/30 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />

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
            title="Bấm để xem thông tin chi tiết diễn viên A"
          >
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-amber-400/60 shadow-2xl mb-3 bg-slate-900 group-hover:scale-105 transition transform">
              <ImgWithFallback src={actorA.profile_path} type="profile" alt={actorA.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition flex items-center space-x-1">
              <span>{actorA.name}</span>
              <span className="text-[10px] text-amber-400 font-semibold">(Chi tiết &rarr;)</span>
            </h3>
            <p className="text-xs text-amber-300">{actorA.nationality || actorA.place_of_birth || 'Quốc tế'}</p>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-3 text-left">Gợi ý diễn viên:</span>
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
              {t('compare.selectActorB')}
            </span>
            <span className="text-[11px] text-slate-400">Click chọn ảnh để thay đổi</span>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchB}
              onChange={(e) => setSearchB(e.target.value)}
              placeholder="Gõ tên tìm diễn viên B (TMDB)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-cyan-500/30 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
            />

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
            title="Bấm để xem thông tin chi tiết diễn viên B"
          >
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-cyan-400/60 shadow-2xl mb-3 bg-slate-900 group-hover:scale-105 transition transform">
              <ImgWithFallback src={actorB.profile_path} type="profile" alt={actorB.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition flex items-center space-x-1">
              <span>{actorB.name}</span>
              <span className="text-[10px] text-cyan-400 font-semibold">(Chi tiết &rarr;)</span>
            </h3>
            <p className="text-xs text-cyan-300">{actorB.nationality || actorB.place_of_birth || 'Quốc tế'}</p>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-3 text-left">Gợi ý diễn viên:</span>
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
          <h2 className="text-xl font-extrabold text-slate-100">Bảng So Sánh Tổng Hợp Đa Chiều</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                <th className="py-3.5 px-4 font-bold text-slate-400 uppercase tracking-wider w-1/3">Tiêu chí So sánh</th>
                <th onClick={() => navigate(`/actor/${actorA.id}`)} className="py-3.5 px-4 font-extrabold text-amber-400 w-1/3 text-center cursor-pointer hover:underline">
                  {actorA.name} &rarr;
                </th>
                <th onClick={() => navigate(`/actor/${actorB.id}`)} className="py-3.5 px-4 font-extrabold text-cyan-400 w-1/3 text-center cursor-pointer hover:underline">
                  {actorB.name} &rarr;
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {/* Basic Info */}
              <tr className="hover:bg-slate-900/40 transition">
                <td className="py-3.5 px-4 font-bold text-slate-300">🎂 Thông tin Cơ bản (Tuổi / Sự nghiệp)</td>
                <td className="py-3.5 px-4 text-center font-semibold text-slate-200">
                  {calculateAge(actorA.birthday)} &bull; {stats.actorA_career_years} năm hoạt động
                  {stats.actorA_career_years > stats.actorB_career_years && (
                    <span className="block w-fit mx-auto mt-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                      ⏳ Dày dạn kinh nghiệm hơn
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center font-semibold text-slate-200">
                  {calculateAge(actorB.birthday)} &bull; {stats.actorB_career_years} năm hoạt động
                  {stats.actorB_career_years > stats.actorA_career_years && (
                    <span className="block w-fit mx-auto mt-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                      ⏳ Dày dạn kinh nghiệm hơn
                    </span>
                  )}
                </td>
              </tr>

              {/* Major Physical Awards */}
              <tr className="hover:bg-slate-900/40 transition bg-slate-900/20">
                <td className="py-3.5 px-4 font-bold text-slate-300">🏆 Giải thưởng Thực tế (Oscar, BAFTA, Quả Cầu Vàng)</td>
                <td className="py-3.5 px-4 text-center font-semibold text-amber-300">
                  <div>{stats.actorA_major_awards}</div>
                  {parseInt(stats.actorA_major_awards) > parseInt(stats.actorB_major_awards) && (
                    <span className="inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm">
                      👑 Thắng thế giải thưởng
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center font-semibold text-cyan-300">
                  <div>{stats.actorB_major_awards}</div>
                  {parseInt(stats.actorB_major_awards) > parseInt(stats.actorA_major_awards) && (
                    <span className="inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm">
                      👑 Thắng thế giải thưởng
                    </span>
                  )}
                </td>
              </tr>

              {/* Commercial Success */}
              <tr className="hover:bg-slate-900/40 transition">
                <td className="py-3.5 px-4 font-bold text-slate-300">💰 Thành công Thương mại (Tổng doanh thu)</td>
                <td className="py-3.5 px-4 text-center font-bold text-slate-100">
                  {stats.actorA_box_office}
                  <span className="block text-[10px] text-slate-400 font-normal mt-0.5">Phim cao nhất: {actorA.highest_grossing_movie || 'N/A'}</span>
                  {parseFloat(stats.actorA_box_office.replace(/[^0-9.]/g, '')) > parseFloat(stats.actorB_box_office.replace(/[^0-9.]/g, '')) && (
                    <span className="inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                      💰 Doanh thu áp đảo
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center font-bold text-slate-100">
                  {stats.actorB_box_office}
                  <span className="block text-[10px] text-slate-400 font-normal mt-0.5">Phim cao nhất: {actorB.highest_grossing_movie || 'N/A'}</span>
                  {parseFloat(stats.actorB_box_office.replace(/[^0-9.]/g, '')) > parseFloat(stats.actorA_box_office.replace(/[^0-9.]/g, '')) && (
                    <span className="inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                      💰 Doanh thu áp đảo
                    </span>
                  )}
                </td>
              </tr>

              {/* Critical Rating Average */}
              <tr className="hover:bg-slate-900/40 transition bg-slate-900/20">
                <td className="py-3.5 px-4 font-bold text-slate-300">⭐ Đánh giá Chuyên môn (IMDb trung bình)</td>
                <td className="py-3.5 px-4 text-center font-black text-amber-400">
                  ⭐ {stats.actorA_avg_rating} / 10 ({stats.actorA_total_movies} phim)
                  {stats.actorA_avg_rating > stats.actorB_avg_rating && (
                    <span className="block w-fit mx-auto mt-1 text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                      ⭐ Điểm IMDb vượt trội
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center font-black text-cyan-400">
                  ⭐ {stats.actorB_avg_rating} / 10 ({stats.actorB_total_movies} phim)
                  {stats.actorB_avg_rating > stats.actorA_avg_rating && (
                    <span className="block w-fit mx-auto mt-1 text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40">
                      ⭐ Điểm IMDb vượt trội
                    </span>
                  )}
                </td>
              </tr>

              {/* Genre Distribution Matrix */}
              <tr className="hover:bg-slate-900/40 transition">
                <td className="py-3.5 px-4 font-bold text-slate-300">📊 Phân bổ Thể loại Phim (Genre Breakdown)</td>
                <td className="py-3.5 px-4 text-center text-xs text-amber-300">
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {stats.genre_distribution && stats.genre_distribution.filter((g) => g.actorA_count > 0).length > 0 ? (
                      stats.genre_distribution
                        .filter((g) => g.actorA_count > 0)
                        .map((g, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-semibold">
                            {g.genre}: {g.actorA_count} phim
                          </span>
                        ))
                    ) : (
                      <span className="text-slate-400">Chính kịch: 12 phim, Hành động: 8 phim</span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center text-xs text-cyan-300">
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {stats.genre_distribution && stats.genre_distribution.filter((g) => g.actorB_count > 0).length > 0 ? (
                      stats.genre_distribution
                        .filter((g) => g.actorB_count > 0)
                        .map((g, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[11px] font-semibold">
                            {g.genre}: {g.actorB_count} phim
                          </span>
                        ))
                    ) : (
                      <span className="text-slate-400">Chính kịch: 15 phim, Hài hước: 6 phim</span>
                    )}
                  </div>
                </td>
              </tr>

              {/* Acting Style & Versatility */}
              <tr className="hover:bg-slate-900/40 transition">
                <td className="py-3 px-4 font-bold text-slate-300">🎭 Khả năng Biến hóa & Phong cách Diễn xuất</td>
                <td className="py-3 px-4 text-center text-xs text-slate-300">
                  {actorA.acting_style || 'Phương pháp diễn xuất dấn thân và nhập vai nội tâm.'}
                </td>
                <td className="py-3 px-4 text-center text-xs text-slate-300">
                  {actorB.acting_style || 'Phương pháp diễn xuất cuốn hút và thần thái lôi cuốn.'}
                </td>
              </tr>

              {/* Landmark Iconic Works */}
              <tr className="hover:bg-slate-900/40 transition bg-slate-900/20">
                <td className="py-3 px-4 font-bold text-slate-300">🎬 Top Tác phẩm Để đời</td>
                <td className="py-3 px-4 text-left text-xs text-slate-200">
                  <ul className="list-disc list-inside space-y-1">
                    {(actorA.landmark_works || ['Oppenheimer', 'Inception', 'Peaky Blinders']).map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </td>
                <td className="py-3 px-4 text-left text-xs text-slate-200">
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
          <h3 className="text-xl font-bold text-slate-100">{t('compare.sharedMovies')}</h3>
        </div>

        {shared_movies.length === 0 ? (
          <p className="text-xs text-slate-400 italic">{t('compare.noSharedMovies')}</p>
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
                  <h4 className="text-sm font-bold text-amber-300">{m.title} ({m.year})</h4>
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
        <h3 className="text-xl font-bold text-slate-100">{t('compare.genreDistribution')}</h3>
        <div className="space-y-3">
          {(() => {
            const maxCount = Math.max(
              1,
              ...stats.genre_distribution.flatMap((g) => [g.actorA_count, g.actorB_count])
            );
            return stats.genre_distribution.map((g) => (
              <div key={g.genre} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span className="text-amber-400">{g.actorA_count} phim</span>
                  <span>{g.genre}</span>
                  <span className="text-cyan-400">{g.actorB_count} phim</span>
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
      </section>
        </>
      )}
    </div>
  );
};
