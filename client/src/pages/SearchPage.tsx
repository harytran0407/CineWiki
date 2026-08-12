import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Movie } from '../types';
import { ImgWithFallback } from '../components/ImgWithFallback';
import { EmptyState } from '../components/EmptyState';
import { Star, Search as SearchIcon, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { getMovieTitle } from '../utils/langUtils';

const COUNTRY_MAP: Record<string, string> = {
  US: 'Mỹ',
  KR: 'Hàn Quốc',
  JP: 'Nhật Bản',
  CN: 'Trung Quốc',
  VN: 'Việt Nam',
  GB: 'Anh',
  FR: 'Pháp',
  TH: 'Thái Lan'
};

const GENRE_MAP: Record<string, string> = {
  Action: 'Hành động',
  Drama: 'Chính kịch',
  Romance: 'Tình cảm',
  Comedy: 'Hài hước',
  'Sci-Fi': 'Viễn tưởng',
  Horror: 'Kinh dị',
  Crime: 'Tội phạm',
  War: 'Chiến tranh',
  History: 'Lịch sử',
  Adventure: 'Phiêu lưu',
  Animation: 'Hoạt hình',
  Fantasy: 'Kỳ ảo',
  Thriller: 'Giật gân'
};

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);

  const [genre, setGenre] = useState(() => searchParams.get('genre') || 'all');
  const [country, setCountry] = useState(() => searchParams.get('country') || 'all');
  const [year, setYear] = useState(() => searchParams.get('year') || 'all');
  const [type, setType] = useState(() => searchParams.get('type') || 'all');
  const [yearFrom, setYearFrom] = useState(1950);
  const [yearTo, setYearTo] = useState(2026);

  const YEAR_OPTIONS = [1950, 1960, 1970, 1980, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024, 2025, 2026];
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('rating');

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state (20 movies per page)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Live Suggestions state
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const langParam = i18n.language?.startsWith('en') ? 'en-US' : 'vi-VN';
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(searchTerm.trim())}&lang=${langParam}`);
        if (res.ok) {
          const data = await res.json();
          const moviesList = data.data?.movies || data.movies || [];
          if (data.success && moviesList.length > 0) {
            setSuggestions(moviesList.slice(0, 6));
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, i18n.language]);

  const genresList = [
    { label: 'Tất cả thể loại', value: 'all' },
    { label: 'Hành động (Action)', value: 'Action' },
    { label: 'Chính kịch (Drama)', value: 'Drama' },
    { label: 'Tình cảm (Romance)', value: 'Romance' },
    { label: 'Hài hước (Comedy)', value: 'Comedy' },
    { label: 'Viễn tưởng (Sci-Fi)', value: 'Sci-Fi' },
    { label: 'Kinh dị (Horror)', value: 'Horror' },
    { label: 'Tội phạm (Crime)', value: 'Crime' },
    { label: 'Chiến tranh (War)', value: 'War' },
    { label: 'Lịch sử (History)', value: 'History' },
    { label: 'Phiêu lưu (Adventure)', value: 'Adventure' },
    { label: 'Hoạt hình (Animation)', value: 'Animation' },
    { label: 'Kỳ ảo (Fantasy)', value: 'Fantasy' },
    { label: 'Giật gân (Thriller)', value: 'Thriller' }
  ];

  const countriesList = [
    { label: 'Tất cả quốc gia', value: 'all' },
    { label: 'Mỹ (US)', value: 'US' },
    { label: 'Hàn Quốc (KR)', value: 'KR' },
    { label: 'Nhật Bản (JP)', value: 'JP' },
    { label: 'Trung Quốc (CN)', value: 'CN' },
    { label: 'Việt Nam (VN)', value: 'VN' },
    { label: 'Anh (GB)', value: 'GB' },
    { label: 'Pháp (FR)', value: 'FR' },
    { label: 'Thái Lan (TH)', value: 'TH' }
  ];

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
    setGenre(searchParams.get('genre') || 'all');
    setCountry(searchParams.get('country') || 'all');
    setYearFrom(searchParams.get('yearFrom') ? parseInt(searchParams.get('yearFrom')!, 10) : 1950);
    setYearTo(searchParams.get('yearTo') ? parseInt(searchParams.get('yearTo')!, 10) : 2026);
    setMinRating(searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : 0);
    setSort(searchParams.get('sort') || 'rating');
    setPage(searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1);
  }, [searchParams]);

  const updateParam = (key: string, val: string | number) => {
    setSearchParams((prev) => {
      const u = new URLSearchParams(prev);
      const valStr = String(val);
      if (!valStr || valStr === 'all' || (key === 'minRating' && valStr === '0') || (key === 'page' && valStr === '1') || (key === 'yearFrom' && valStr === '1950') || (key === 'yearTo' && valStr === '2026') || (key === 'sort' && valStr === 'rating')) {
        u.delete(key);
      } else {
        u.set(key, valStr);
      }
      return u;
    });
  };

  useEffect(() => {
    const fetchMoviesData = async () => {
      setLoading(true);
      try {
        const currentQ = searchParams.get('q') || searchTerm;
        const urlGenre = searchParams.get('genre') || genre;
        const urlCountry = searchParams.get('country') || country;
        const urlYear = searchParams.get('year') || year;
        const langParam = i18n.language?.startsWith('en') ? 'en-US' : 'vi-VN';

        const queryParams = new URLSearchParams({
          q: currentQ ? currentQ.trim() : '',
          genre: urlGenre,
          country: urlCountry,
          yearFrom: urlYear !== 'all' ? urlYear : yearFrom.toString(),
          yearTo: urlYear !== 'all' ? urlYear : yearTo.toString(),
          minRating: minRating.toString(),
          sort,
          page: page.toString(),
          lang: langParam
        });

        const res = await fetch(`/api/movies/filter?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          const movieList = data.movies || [];
          setMovies(movieList);
          const computedTotal = (currentQ && movieList.length <= 20) ? 1 : Math.min(data.total_pages || 1, 50);
          setTotalPages(computedTotal);
          setTotalResults(data.total_results || movieList.length);
        } else {
          setMovies([]);
          setTotalPages(1);
          setTotalResults(0);
        }
      } catch (err) {
        console.error('Fetch search movies error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesData();
  }, [searchParams, genre, country, year, type, yearFrom, yearTo, minRating, sort, page, i18n.language]);

  const handleExecuteSearch = () => {
    setPage(1);
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSearchParams({});
    setGenre('all');
    setCountry('all');
    setYear('all');
    setType('all');
    setYearFrom(1990);
    setYearTo(2026);
    setMinRating(0);
    setSort('rating');
    setPage(1);
  };

  const activeQ = searchParams.get('q');
  const activeGenre = searchParams.get('genre') || genre;
  const activeCountry = searchParams.get('country') || country;
  const activeYear = searchParams.get('year') || year;

  let pageTitle = 'Khám Phá & Lọc Điện Ảnh';
  let pageSub = 'Kết hợp tìm kiếm từ khóa và nhiều điều kiện lọc đồng thời';

  if (activeQ) {
    pageTitle = `Kết Quả Tìm Kiếm Phim`;
    pageSub = `Danh sách các phim khớp với từ khóa "${activeQ}"`;
  } else if (activeCountry !== 'all') {
    const cName = COUNTRY_MAP[activeCountry] || activeCountry;
    pageTitle = `Phim Điện Ảnh ${cName}`;
    pageSub = `Các tác phẩm điện ảnh nổi tiếng đến từ ${cName}`;
  } else if (activeYear !== 'all') {
    pageTitle = `Phim Phát Hành Năm ${activeYear}`;
    pageSub = `Tuyển tập các tác phẩm điện ảnh ra mắt năm ${activeYear}`;
  } else if (activeGenre !== 'all') {
    const gName = GENRE_MAP[activeGenre] || activeGenre;
    pageTitle = `Phim Thể Loại ${gName}`;
    pageSub = `Tuyển tập bộ phim hấp dẫn thuộc thể loại ${gName}`;
  }

  const hasActiveFilter = activeQ || activeGenre !== 'all' || activeCountry !== 'all' || activeYear !== 'all';

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100">{pageTitle}</h1>
            <p className="text-xs text-slate-400">{pageSub}</p>
          </div>
        </div>

        {hasActiveFilter && (
          <button
            onClick={handleResetFilters}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Xóa bộ lọc</span>
          </button>
        )}
      </div>

      {/* Primary Keyword Search Bar — Full Width (Matching Filter Box) with Live Suggestions */}
      <div ref={searchContainerRef} className="relative w-full">
        <div className="w-full glass-panel rounded-2xl p-2.5 border border-amber-500/40 shadow-xl flex items-center space-x-3 bg-slate-900/90">
          <SearchIcon className="w-4 h-4 text-amber-400 flex-shrink-0 ml-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setShowSuggestions(false);
                handleExecuteSearch();
              }
            }}
            placeholder="Gõ tên phim tìm kiếm (ví dụ: Mai, Oppenheimer, Avatar, Bố Già...)"
            className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-400 focus:outline-none pl-1"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setShowSuggestions(false);
              }}
              className="text-slate-400 hover:text-slate-200 transition p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => {
              setShowSuggestions(false);
              handleExecuteSearch();
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition active:scale-95 cursor-pointer flex-shrink-0"
          >
            Tìm kiếm
          </button>
        </div>

        {/* Live Search Suggestions Dropdown Overlay */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
            <div className="p-2.5 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-semibold px-4 bg-slate-950/40">
              <span>Gợi ý phim tìm kiếm cho "{searchTerm}"</span>
              <span>{suggestions.length} phim</span>
            </div>
            <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
              {suggestions.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setShowSuggestions(false);
                    navigate(`/movie/${m.id}`);
                  }}
                  className="p-3 flex items-center space-x-3 hover:bg-amber-500/10 cursor-pointer transition group"
                >
                  <ImgWithFallback
                    src={m.poster_path}
                    type="poster"
                    alt={getMovieTitle(m, i18n.language)}
                    className="w-9 h-12 rounded-lg object-cover border border-slate-700 flex-shrink-0 group-hover:border-amber-400 transition"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition truncate">
                      {getMovieTitle(m, i18n.language)}
                    </h4>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{m.release_date ? m.release_date.split('-')[0] : 'N/A'}</span>
                      <span>&bull;</span>
                      <span className="flex items-center space-x-0.5 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400 inline" />
                        <span className="font-bold">{(m.imdb_score || m.vote_average || 7.5).toFixed(1)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter Control Box */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Genre Selector */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">Thể loại</label>
          <select
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
              setSearchParams((prev) => {
                const u = new URLSearchParams(prev);
                if (e.target.value === 'all') u.delete('genre');
                else u.set('genre', e.target.value);
                return u;
              });
            }}
            className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400"
          >
            {genresList.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* Country Selector */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">Quốc gia</label>
          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setSearchParams((prev) => {
                const u = new URLSearchParams(prev);
                if (e.target.value === 'all') u.delete('country');
                else u.set('country', e.target.value);
                return u;
              });
            }}
            className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400"
          >
            {countriesList.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year Range Select Dropdowns (Default: 1950 to 2026) */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">Năm phát hành</label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={yearFrom}
              onChange={(e) => {
                const yf = parseInt(e.target.value, 10);
                setYearFrom(yf);
                updateParam('yearFrom', yf);
                setPage(1);
              }}
              className="w-full py-2 px-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={`from-${y}`} value={y}>
                  Từ {y}
                </option>
              ))}
            </select>
            <select
              value={yearTo}
              onChange={(e) => {
                const yt = parseInt(e.target.value, 10);
                setYearTo(yt);
                updateParam('yearTo', yt);
                setPage(1);
              }}
              className="w-full py-2 px-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={`to-${y}`} value={y}>
                  Đến {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Min Rating */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">
            Rating tối thiểu (&ge; {minRating})
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={minRating}
            onChange={(e) => {
              const mr = parseFloat(e.target.value);
              setMinRating(mr);
              updateParam('minRating', mr);
              setPage(1);
            }}
            aria-label="Rating tối thiểu"
            className="w-full accent-amber-500"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">Sắp xếp theo</label>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              updateParam('sort', e.target.value);
              setPage(1);
            }}
            className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400"
          >
            <option value="rating">Điểm IMDb cao nhất</option>
            <option value="date">Năm phát hành mới nhất</option>
            <option value="popularity">Độ phổ biến</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Tìm thấy {movies.length} kết quả phù hợp</span>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-64 rounded-2xl skeleton-box" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <EmptyState
          title="Không tìm thấy phim phù hợp"
          description={activeQ ? `Không tìm thấy bộ phim nào trùng khớp với từ khóa "${activeQ}".` : "Thử nới lỏng bộ lọc năm phát hành, thể loại hoặc điểm đánh giá tối thiểu."}
          actionLabel="Đặt lại tìm kiếm"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="group cursor-pointer glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-400/40 transition duration-300 transform hover:-translate-y-1.5 shadow-lg"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
                  <ImgWithFallback src={movie.poster_path} type="poster" alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  {movie.vote_average > 0 && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[11px] font-bold text-amber-400 border border-amber-400/30 flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{movie.vote_average}</span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="text-xs font-bold text-slate-100 truncate group-hover:text-amber-300 transition">{getMovieTitle(movie, i18n.language)}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{movie.release_date ? movie.release_date.split('-')[0] : ''} &bull; {movie.genres?.[0]?.name || 'Film'}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls — Compact Ellipsis & Real Total Pages */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-800 gap-4">
              <span className="text-xs text-slate-400 font-medium">
                {i18n.language?.startsWith('en')
                  ? `Showing ${(page - 1) * 20 + 1}–${Math.min(page * 20, totalResults)} of ${totalResults} movies`
                  : `Hiển thị ${(page - 1) * 20 + 1}–${Math.min(page * 20, totalResults)} trong số ${totalResults} phim`}
              </span>

              <div className="flex items-center space-x-1.5 flex-wrap justify-center">
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === 1 || loading}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/40 text-slate-200 disabled:opacity-40 transition text-xs font-bold flex items-center space-x-1 cursor-pointer mr-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{i18n.language?.startsWith('en') ? 'Previous' : 'Trang trước'}</span>
                </button>

                {(() => {
                  const maxP = Math.min(totalPages, 50);
                  if (maxP <= 7) {
                    return Array.from({ length: maxP }, (_, i) => i + 1).map((pNum) => (
                      <button
                        key={pNum}
                        onClick={() => { setPage(pNum); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                          pNum === page
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md ring-2 ring-amber-400/40'
                            : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-amber-400/40'
                        }`}
                      >
                        {pNum}
                      </button>
                    ));
                  }

                  const items: (number | string)[] = [];
                  items.push(1);
                  if (page > 3) items.push('...');
                  const start = Math.max(2, page - 1);
                  const end = Math.min(maxP - 1, page + 1);
                  for (let i = start; i <= end; i++) items.push(i);
                  if (page < maxP - 2) items.push('...');
                  items.push(maxP);

                  return items.map((item, idx) => {
                    if (typeof item === 'string') {
                      return (
                        <span key={`dots-${idx}`} className="px-1 text-slate-500 font-bold text-xs select-none">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={item}
                        onClick={() => { setPage(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                          item === page
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md ring-2 ring-amber-400/40'
                            : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-amber-400/40'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  });
                })()}

                <button
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page >= totalPages || loading}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/40 text-slate-200 disabled:opacity-40 transition text-xs font-bold flex items-center space-x-1 cursor-pointer ml-1"
                >
                  <span>{i18n.language?.startsWith('en') ? 'Next' : 'Trang sau'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
