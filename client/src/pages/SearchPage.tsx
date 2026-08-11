import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import { ImgWithFallback } from '../components/ImgWithFallback';
import { EmptyState } from '../components/EmptyState';
import { Filter, Star, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [genre, setGenre] = useState('all');
  const [yearFrom, setYearFrom] = useState(1990);
  const [yearTo, setYearTo] = useState(2026);
  const [minRating, setMinRating] = useState(7.0);
  const [sort, setSort] = useState('rating');

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const genresList = ['all', 'Action', 'Drama', 'Sci-Fi', 'Horror', 'Crime', 'War', 'History', 'Adventure'];

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          genre,
          yearFrom: yearFrom.toString(),
          yearTo: yearTo.toString(),
          minRating: minRating.toString(),
          sort
        });
        const res = await fetch(`/api/movies/filter?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setMovies(data.data);
        }
      } catch (err) {
        console.error('Filter error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [genre, yearFrom, yearTo, minRating, sort]);

  const handleResetFilters = () => {
    setGenre('all');
    setYearFrom(1990);
    setYearTo(2026);
    setMinRating(0);
    setSort('rating');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100">{t('search.title')}</h1>
          <p className="text-xs text-slate-400">Kết hợp nhiều điều kiện lọc đồng thời hơn giao diện IMDb</p>
        </div>
      </div>

      {/* Filter Control Box */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Genre Selector */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">{t('search.genre')}</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400"
          >
            {genresList.map((g) => (
              <option key={g} value={g}>
                {g === 'all' ? 'Tất cả thể loại' : g}
              </option>
            ))}
          </select>
        </div>

        {/* Year Range */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">
            Năm phát hành ({yearFrom} - {yearTo})
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="1980"
              max="2026"
              value={yearFrom}
              onChange={(e) => setYearFrom(Math.min(parseInt(e.target.value, 10), yearTo))}
              aria-label="Năm từ"
              className="w-full accent-amber-500"
            />
            <input
              type="range"
              min="1980"
              max="2026"
              value={yearTo}
              onChange={(e) => setYearTo(Math.max(parseInt(e.target.value, 10), yearFrom))}
              aria-label="Năm đến"
              className="w-full accent-cyan-500"
            />
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
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            aria-label="Rating tối thiểu"
            className="w-full accent-amber-500"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">{t('search.sortBy')}</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400"
          >
            <option value="rating">{t('search.sortRating')}</option>
            <option value="date">{t('search.sortDate')}</option>
            <option value="popularity">{t('search.sortPopularity')}</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{t('search.resultsFound', { count: movies.length })}</span>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-2xl skeleton-box" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <EmptyState
          title="Không tìm thấy phim phù hợp"
          description="Thử nới lỏng bộ lọc năm phát hành, thể loại hoặc điểm đánh giá tối thiểu."
          actionLabel="Đặt lại bộ lọc"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="group cursor-pointer glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-400/40 transition duration-300 transform hover:-translate-y-1.5 shadow-lg"
            >
              <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
                <ImgWithFallback src={movie.poster_path} type="poster" alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[11px] font-bold text-amber-400 border border-amber-400/30 flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{movie.vote_average}</span>
                </div>
              </div>

              <div className="p-3">
                <h3 className="text-xs font-bold text-slate-100 truncate group-hover:text-amber-300 transition">{movie.title}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{movie.release_date} • {movie.genres?.[0]?.name || 'Film'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
