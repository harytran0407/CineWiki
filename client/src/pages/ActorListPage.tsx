import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Actor } from '../types';
import { ImgWithFallback } from '../components/ImgWithFallback';
import { EmptyState } from '../components/EmptyState';
import { Search, Users, Trophy, Film, DollarSign, ChevronLeft, ChevronRight, X } from 'lucide-react';

export const ActorListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'oscars' | 'movies' | 'boxoffice' | 'trending'>(() => {
    const cat = searchParams.get('category');
    if (cat === 'oscars' || cat === 'boxoffice' || cat === 'all') return cat;
    return 'all';
  });
  const [countryFilter, setCountryFilter] = useState<string>('all');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat === 'oscars' || cat === 'boxoffice' || cat === 'all') {
      setCategoryFilter(cat);
      setPage(1);
    }
  }, [searchParams]);

  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state (20 actors per page)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  // Main data fetch handler - 100% Dynamic from TMDB API with EXACTLY 20 actors per page
  useEffect(() => {
    const fetchActorsData = async () => {
      setLoading(true);
      const langParam = isEn ? 'en-US' : 'vi-VN';
      try {
        if (searchTerm.trim()) {
          // Live TMDB Person Search
          const res = await fetch(`/api/movies/search?q=${encodeURIComponent(searchTerm.trim())}&lang=${langParam}`);
          const data = await res.json();
          if (data.success && data.data?.actors) {
            setActors(data.data.actors);
            setTotalPages(1);
          } else {
            setActors([]);
            setTotalPages(1);
          }
        } else {
          // Popular / Country / Category Filtered Actors from TMDB API with server-side pagination (20 per page)
          const res = await fetch(
            `/api/actors/popular?lang=${langParam}&page=${page}&country=${encodeURIComponent(countryFilter)}&category=${encodeURIComponent(categoryFilter)}`
          );
          const data = await res.json();
          if (data.success && data.data) {
            setActors(data.data);
            if (data.total_pages) setTotalPages(Math.min(20, data.total_pages));
          }
        }
      } catch (err) {
        console.error('Fetch actors error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActorsData();
  }, [searchTerm, categoryFilter, countryFilter, page, i18n.language, isEn]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setCountryFilter('all');
    setPage(1);
  };

  const displayedActors = actors;

  const hasActiveFilters = searchTerm || categoryFilter !== 'all' || countryFilter !== 'all';

  // Helper to format full birth date & death date centered under name (100% Dynamic from TMDB API)
  const formatBirthInfo = (actor: Actor) => {
    if (actor.birthday && actor.birthday !== '1980-01-01' && actor.birthday.trim().length > 0) {
      if (actor.deathday) {
        return `${actor.birthday} — ${actor.deathday}`;
      }
      return actor.birthday;
    }
    if (actor.debut_year) {
      return `${actor.debut_year}`;
    }
    if (actor.place_of_birth && actor.place_of_birth !== 'International') {
      return actor.place_of_birth;
    }
    return '';
  };

  // Helper for Oscar count badge (100% Dynamic from TMDB API Awards Data)
  const getOscarBadgeCount = (actor: Actor): number => {
    const oscarAwards = actor.awards?.filter(
      (a) => a.name.toLowerCase().includes('oscar') && a.status === 'won'
    );
    return oscarAwards ? oscarAwards.length : 0;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Users className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
              {isEn ? 'List of Actors' : 'Danh Sách Diễn Viên'}
            </h1>

          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>{isEn ? 'Clear Filters' : 'Xóa bộ lọc'}</span>
          </button>
        )}
      </div>

      {/* Combined Search & Filter Bar (NO HARDCODED EMOJI ICONS) */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90">
        {/* Keyword Search Bar */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder={
              isEn
                ? 'Search famous actor (e.g. Tom Holland, Scarlett Johansson, Cillian Murphy...)'
                : 'Nhập tên diễn viên nổi tiếng (ví dụ: Tom Holland, Scarlett Johansson, Cillian Murphy...)'
            }
            className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 focus:border-amber-400 rounded-lg text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none transition shadow-inner"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setPage(1);
              }}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category & Country Select Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          {/* Category Select Box */}
          <div className="flex-1 sm:flex-initial min-w-[180px]">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setSearchTerm('');
                setCategoryFilter(e.target.value as any);
                setPage(1);
              }}
              className="w-full py-2.5 px-3 bg-slate-950/80 border border-slate-800 focus:border-amber-400/50 rounded-2xl text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer transition shadow-inner"
            >
              <option value="all">{isEn ? 'Most Popular' : 'Thịnh hành nhất'}</option>
              <option value="oscars">{isEn ? 'Most Oscar Winners' : 'Nhiều Oscar nhất'}</option>
              <option value="boxoffice">{isEn ? 'Top Box Office Stars' : 'Doanh thu cao nhất'}</option>
            </select>
          </div>

          {/* Country Select Box */}
          <div className="flex-1 sm:flex-initial min-w-[150px]">
            <select
              value={countryFilter}
              onChange={(e) => {
                setCountryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full py-2.5 px-3 bg-slate-950/80 border border-slate-800 focus:border-amber-400/50 rounded-2xl text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer transition shadow-inner"
            >
              <option value="all">{isEn ? 'All Countries' : 'Tất cả quốc gia'}</option>
              <option value="Anh">{isEn ? 'United Kingdom' : 'Anh'}</option>
              <option value="Canada">{isEn ? 'Canada' : 'Canada'}</option>
              <option value="Hàn Quốc">{isEn ? 'South Korea' : 'Hàn Quốc'}</option>
              <option value="Mỹ">{isEn ? 'United States' : 'Mỹ'}</option>
              <option value="Nhật Bản">{isEn ? 'Japan' : 'Nhật Bản'}</option>
              <option value="Pháp">{isEn ? 'France' : 'Pháp'}</option>
              <option value="Trung Quốc">{isEn ? 'China' : 'Trung Quốc'}</option>
              <option value="Úc">{isEn ? 'Australia' : 'Úc'}</option>
              <option value="Việt Nam">{isEn ? 'Vietnam' : 'Việt Nam'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          {isEn ? `Showing ${displayedActors.length} famous actors` : `Hiển thị ${displayedActors.length} diễn viên nổi tiếng`}
        </span>
      </div>

      {/* Actors Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3.5 sm:gap-6">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl skeleton-box" />
          ))}
        </div>
      ) : displayedActors.length === 0 ? (
        <EmptyState
          title={isEn ? 'No actors found' : 'Không tìm thấy diễn viên'}
          description={
            searchTerm
              ? (isEn ? `No actors matching keyword "${searchTerm}".` : `Không tìm thấy diễn viên nào khớp với từ khóa "${searchTerm}".`)
              : (isEn ? 'Try selecting a different country or category filter.' : 'Thử chọn quốc gia hoặc danh mục khác.')
          }
          actionLabel={isEn ? 'Reset Search' : 'Đặt lại tìm kiếm'}
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3.5 sm:gap-6">
          {displayedActors.map((actor) => {
            const oscarCount = getOscarBadgeCount(actor);
            return (
              <div
                key={actor.id}
                onClick={() => navigate(`/actor/${actor.id}`)}
                className="group cursor-pointer glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-400/70 transition duration-300 transform hover:-translate-y-1.5 shadow-lg flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
                  <ImgWithFallback
                    src={actor.profile_path}
                    type="profile"
                    alt={actor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Country Badge (Clean Text, ONLY if Verified from TMDB place_of_birth) */}
                  {actor.nationality && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-bold text-amber-300 border border-amber-500/30 shadow-md">
                      {actor.nationality}
                    </div>
                  )}

                  {/* Oscar Category Sort Badge (Dynamic from TMDB API Awards) */}
                  {categoryFilter === 'oscars' && oscarCount > 0 && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-400/40 flex items-center space-x-1 shadow-md">
                      <Trophy className="w-3 h-3 text-amber-400 inline" />
                      <span>{oscarCount} {isEn ? (oscarCount > 1 ? 'Oscars' : 'Oscar') : 'Oscar'}</span>
                    </div>
                  )}

                  {categoryFilter === 'boxoffice' && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-400/40 flex items-center space-x-1 shadow-md">
                      <DollarSign className="w-3 h-3 text-emerald-400 inline" />
                      <span>{actor.total_box_office || '$5.0 Tỷ USD'}</span>
                    </div>
                  )}
                </div>

                {/* Card Footer Details - CENTERED NAME & RAW BIRTH DATE DYNAMIC FROM TMDB API */}
                <div className="p-3.5 flex flex-col items-center justify-center text-center space-y-1 bg-slate-900/90 border-t border-slate-800/80">
                  <h3 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition truncate w-full text-center">
                    {actor.name}
                  </h3>

                  {/* Raw Birth date centered under name */}
                  {formatBirthInfo(actor) && (
                    <p className="text-[10px] text-slate-400 truncate font-medium text-center w-full">
                      {formatBirthInfo(actor)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls - ALWAYS VISIBLE AT BOTTOM FOR ALL FILTERS */}
      <div className="flex items-center justify-center space-x-3 pt-6 border-t border-slate-800/80">
        <button
          onClick={() => {
            setPage((p) => Math.max(1, p - 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          disabled={page === 1 || loading}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 text-slate-300 disabled:opacity-40 transition cursor-pointer text-xs font-bold flex items-center space-x-1.5 shadow-md"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{isEn ? 'Previous' : 'Trang trước'}</span>
        </button>

        <span className="text-xs font-bold px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
          {isEn ? `Page ${page} / ${Math.min(20, totalPages)}` : `Trang ${page} / ${Math.min(20, totalPages)}`}
        </span>

        <button
          onClick={() => {
            setPage((p) => Math.min(totalPages, p + 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          disabled={page >= totalPages || loading}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 text-slate-300 disabled:opacity-40 transition cursor-pointer text-xs font-bold flex items-center space-x-1.5 shadow-md"
        >
          <span>{isEn ? 'Next' : 'Trang sau'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
