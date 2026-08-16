import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Actor, formatDepartmentRole } from '../types';
import { ImgWithFallback } from '../components/ImgWithFallback';
import { EmptyState } from '../components/EmptyState';
import { Search, Users, ChevronLeft, ChevronRight, X } from 'lucide-react';

export const ActorListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  const deptParam = searchParams.get('dept');

  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | '1' | '2'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  useEffect(() => {
    if (deptParam) {
      setDepartmentFilter(deptParam);
    }
  }, [deptParam]);

  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state (20 actors per page)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  // Main data fetch handler - 100% Dynamic from TMDB API
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
          // Popular / Country / Gender / Department Filtered Actors directly from TMDB API
          const res = await fetch(
            `/api/actors/popular?lang=${langParam}&page=${page}&country=${encodeURIComponent(countryFilter)}&gender=${genderFilter}&department=${encodeURIComponent(departmentFilter)}`
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
  }, [searchTerm, genderFilter, countryFilter, departmentFilter, page, i18n.language, isEn]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setGenderFilter('all');
    setCountryFilter('all');
    setDepartmentFilter('all');
    setPage(1);
  };

  const displayedActors = [...actors]
    .filter((a) => a.profile_path && a.profile_path.trim() !== '')
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  const hasActiveFilters = searchTerm || genderFilter !== 'all' || countryFilter !== 'all' || departmentFilter !== 'all';


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
              {isEn ? 'List of Celebs' : 'Danh Sách Celebs'}
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

      {/* Combined Search & Filter Bar */}
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

        {/* Role / Gender / Country Select Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Department Select Box */}
          <div className="flex-1 sm:flex-initial min-w-[140px]">
            <select
              value={departmentFilter}
              onChange={(e) => {
                setSearchTerm('');
                setDepartmentFilter(e.target.value);
                setPage(1);
              }}
              className="w-full py-2.5 px-3 bg-slate-950/80 border border-slate-800 focus:border-amber-400/50 rounded-2xl text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer transition shadow-inner"
            >
              <option value="all">{isEn ? 'All Roles' : 'Tất cả vai trò'}</option>
              <option value="Acting">{isEn ? 'Actor' : 'Diễn viên'}</option>
              <option value="Directing">{isEn ? 'Director' : 'Đạo diễn'}</option>
              <option value="Writing">{isEn ? 'Writer' : 'Biên kịch'}</option>
            </select>
          </div>

          {/* Gender Select Box */}
          <div className="flex-1 sm:flex-initial min-w-[140px]">
            <select
              value={genderFilter}
              onChange={(e) => {
                setSearchTerm('');
                setGenderFilter(e.target.value as any);
                setPage(1);
              }}
              className="w-full py-2.5 px-3 bg-slate-950/80 border border-slate-800 focus:border-amber-400/50 rounded-2xl text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer transition shadow-inner"
            >
              <option value="all">{isEn ? 'All Genders' : 'Tất cả giới tính'}</option>
              <option value="1">{isEn ? 'Female' : 'Nữ'}</option>
              <option value="2">{isEn ? 'Male' : 'Nam'}</option>
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
          {isEn ? `Showing ${displayedActors.length} famous personalities` : `Hiển thị ${displayedActors.length} gương mặt điện ảnh nổi tiếng`}
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
              : (isEn ? 'Try selecting a different filter combination.' : 'Thử nới lỏng hoặc thay đổi bộ lọc.')
          }
          actionLabel={isEn ? 'Reset Filters' : 'Đặt lại bộ lọc'}
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3.5 sm:gap-6">
          {displayedActors.map((actor) => {
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

                  {/* Country Badge */}
                  {actor.nationality && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-bold text-amber-300 border border-amber-500/30 shadow-md">
                      {actor.nationality}
                    </div>
                  )}
                </div>

                {/* Card Footer Details */}
                <div className="p-3.5 flex flex-col items-center justify-center text-center bg-slate-900/90 border-t border-slate-800/80">
                  <h3 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition truncate w-full text-center">
                    {actor.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate w-full">
                    {formatDepartmentRole(actor.known_for_department, isEn, actor.gender)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
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
