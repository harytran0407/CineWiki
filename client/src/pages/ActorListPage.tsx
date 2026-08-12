import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Actor } from '../types';
import { ImgWithFallback } from '../components/ImgWithFallback';
import { EmptyState } from '../components/EmptyState';
import { Search, Users, Trophy, Film, DollarSign, Flame, Sparkles, Filter, X } from 'lucide-react';

// Curated list of famous A-List TMDB IDs sorted by Oscar awards & historical timelines
const OSCAR_LEGEND_IDS = [5064, 514, 11856, 2270, 4173, 31, 6193, 287, 2038, 3223];
const PROLIFIC_IDS = [2231, 2963, 31, 5292, 192, 1245, 6384, 500, 287, 3223];
const BOX_OFFICE_IDS = [1245, 3223, 8691, 500, 73968, 6193, 2038, 1190668, 505710, 6384];

// Cache actor details to avoid repeated network calls
const actorCache = new Map<number, Actor>();

export const ActorListPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'oscars' | 'movies' | 'boxoffice' | 'trending'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');

  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(false);

  // Main data fetch handler
  useEffect(() => {
    const fetchActorsData = async () => {
      setLoading(true);
      const langParam = i18n.language?.startsWith('en') ? 'en-US' : 'vi-VN';
      try {
        if (searchTerm.trim()) {
          // Search TMDB live
          const res = await fetch(`/api/movies/search?q=${encodeURIComponent(searchTerm.trim())}&lang=${langParam}`);
          const data = await res.json();
          if (data.success && data.data?.actors) {
            setActors(data.data.actors);
          } else {
            setActors([]);
          }
        } else if (categoryFilter === 'oscars' || categoryFilter === 'movies' || categoryFilter === 'boxoffice') {
          // Fetch curated high-profile actors
          const targetIds =
            categoryFilter === 'oscars'
              ? OSCAR_LEGEND_IDS
              : categoryFilter === 'movies'
                ? PROLIFIC_IDS
                : BOX_OFFICE_IDS;

          const fetchedActors: Actor[] = await Promise.all(
            targetIds.map(async (id) => {
              if (actorCache.has(id)) return actorCache.get(id)!;
              try {
                const res = await fetch(`/api/actors/${id}?lang=${langParam}`);
                const data = await res.json();
                if (data.success && data.data) {
                  actorCache.set(id, data.data);
                  return data.data;
                }
              } catch (e) {
                console.warn(`Failed to fetch actor ${id}`, e);
              }
              return null;
            })
          ).then((results) => results.filter((a): a is Actor => a !== null));

          setActors(fetchedActors);
        } else {
          // Default / Trending: fetch popular actors
          const res = await fetch(`/api/actors/popular?lang=${langParam}`);
          const data = await res.json();
          if (data.success) {
            setActors(data.data);
          }
        }
      } catch (err) {
        console.error('Fetch actors error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActorsData();
  }, [searchTerm, categoryFilter, i18n.language]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setCountryFilter('all');
  };

  // Filter actors by selected Country
  const displayedActors = actors.filter((actor) => {
    if (countryFilter === 'all') return true;
    const nat = (actor.nationality || '').toLowerCase();
    const pob = (actor.place_of_birth || '').toLowerCase();
    const cLower = countryFilter.toLowerCase();
    return nat.includes(cLower) || pob.includes(cLower);
  });

  const hasActiveFilters = searchTerm || categoryFilter !== 'all' || countryFilter !== 'all';

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center">
            <Users className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100">Danh Sách Diễn Viên Nổi Tiếng</h1>
            <p className="text-xs text-slate-400">Khám phá thế giới tài tử điện ảnh hàng đầu thế giới, các ngôi sao đoạt giải Oscar & kỷ lục phòng vé</p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Xóa bộ lọc</span>
          </button>
        )}
      </div>

      {/* Single Combined Search & Filter Card */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-pink-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90">
        {/* Left Side: Keyword Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-pink-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nhập tên diễn viên nổi tiếng (ví dụ: Cillian Murphy, Robert Downey Jr., Scarlett Johansson, Tom Cruise...)"
            className="w-full pl-10 pr-9 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-pink-500/50 rounded-2xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none transition shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Side: Select Boxes for Category & Country */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          {/* Category Select Box */}
          <div className="flex-1 sm:flex-initial min-w-[170px]">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setSearchTerm('');
                setCategoryFilter(e.target.value as any);
              }}
              className="w-full py-2.5 px-3 bg-slate-950/80 border border-slate-800 focus:border-pink-500/50 rounded-2xl text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer transition shadow-inner"
            >
              <option value="all">⭐ Tất cả diễn viên</option>
              <option value="oscars"> Nhiều Oscar nhất (Theo thời gian)</option>
              <option value="movies">🎬 Nhiều phim nhất (Sự nghiệp đồ sộ)</option>
              <option value="boxoffice"> Doanh thu phòng vé khủng</option>
              <option value="trending">🔥 Thịnh hành nhất</option>
            </select>
          </div>

          {/* Country Select Box */}
          <div className="flex-1 sm:flex-initial min-w-[150px]">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-950/80 border border-slate-800 focus:border-pink-500/50 rounded-2xl text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer transition shadow-inner"
            >
              <option value="all">🌍 Tất cả quốc gia</option>
              <option value="Mỹ">🇺🇸 Mỹ (USA)</option>
              <option value="Anh">🇬🇧 Anh (UK)</option>
              <option value="Hàn Quốc">🇰🇷 Hàn Quốc</option>
              <option value="Nhật Bản">🇯🇵 Nhật Bản</option>
              <option value="Trung Quốc">🇨🇳 Trung Quốc</option>
              <option value="Việt Nam">🇻🇳 Việt Nam</option>
              <option value="Pháp">🇫🇷 Pháp</option>
              <option value="Úc">🇦🇺 Úc</option>
              <option value="Canada">🇨🇦 Canada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Hiển thị {displayedActors.length} diễn viên nổi tiếng</span>
      </div>

      {/* Actors Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-64 rounded-2xl skeleton-box" />
          ))}
        </div>
      ) : displayedActors.length === 0 ? (
        <EmptyState
          title="Không tìm thấy diễn viên"
          description={
            searchTerm
              ? `Không tìm thấy diễn viên nào khớp với từ khóa "${searchTerm}".`
              : "Thử chọn quốc gia hoặc danh mục khác."
          }
          actionLabel="Đặt lại tìm kiếm"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {displayedActors.map((actor) => (
            <div
              key={actor.id}
              onClick={() => navigate(`/actor/${actor.id}`)}
              className="group cursor-pointer glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-pink-500/50 transition duration-300 transform hover:-translate-y-1.5 shadow-lg flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
                <ImgWithFallback
                  src={actor.profile_path}
                  type="profile"
                  alt={actor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-bold text-pink-300 border border-pink-500/30">
                  {actor.nationality || 'Quốc tế 🌐'}
                </div>
              </div>

              <div className="p-3.5 space-y-1 bg-slate-900/90">
                <h3 className="text-xs font-bold text-slate-100 group-hover:text-pink-300 transition truncate">
                  {actor.name}
                </h3>
                <p className="text-[10px] text-slate-400 truncate">
                  {actor.landmark_works && actor.landmark_works.length > 0
                    ? `Nổi tiếng với: ${actor.landmark_works.slice(0, 2).join(', ')}`
                    : actor.known_for && actor.known_for.length > 0
                      ? `Nổi tiếng với: ${actor.known_for.map((k: { title?: string; name?: string }) => k.title || k.name).join(', ')}`
                      : 'Tài tử điện ảnh hàng đầu thế giới'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
