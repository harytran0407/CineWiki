import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationDrawer } from './NotificationDrawer';
import { AuthModal } from './AuthModal';
import { Movie, Actor, Notification, User } from '../types';
import { useTranslation } from 'react-i18next';
import { getMovieTitle } from '../utils/langUtils';
import { Film, Search, ChevronDown, Shuffle, Heart, Bell, User as UserIcon, LogOut, Globe } from 'lucide-react';

interface HeaderProps {
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

const getGenresList = (isEn: boolean) => [
  { label: isEn ? 'Action' : 'Hành động', value: 'Action' },
  { label: isEn ? 'Drama' : 'Chính kịch', value: 'Drama' },
  { label: isEn ? 'Romance' : 'Tình cảm', value: 'Romance' },
  { label: isEn ? 'Comedy' : 'Hài hước', value: 'Comedy' },
  { label: isEn ? 'Sci-Fi' : 'Viễn tưởng', value: 'Sci-Fi' },
  { label: isEn ? 'Horror' : 'Kinh dị', value: 'Horror' },
  { label: isEn ? 'Crime' : 'Tội phạm', value: 'Crime' },
  { label: isEn ? 'War' : 'Chiến tranh', value: 'War' },
  { label: isEn ? 'History' : 'Lịch sử', value: 'History' },
  { label: isEn ? 'Adventure' : 'Phiêu lưu', value: 'Adventure' },
  { label: isEn ? 'Animation' : 'Hoạt hình', value: 'Animation' },
  { label: isEn ? 'Fantasy' : 'Kỳ ảo', value: 'Fantasy' },
  { label: isEn ? 'Thriller' : 'Giật gân', value: 'Thriller' }
];

const getCountriesList = (isEn: boolean) => [
  { label: isEn ? 'USA' : 'Mỹ', code: 'US' },
  { label: isEn ? 'South Korea' : 'Hàn Quốc', code: 'KR' },
  { label: isEn ? 'Japan' : 'Nhật Bản', code: 'JP' },
  { label: isEn ? 'China' : 'Trung Quốc', code: 'CN' },
  { label: isEn ? 'Vietnam' : 'Việt Nam', code: 'VN' },
  { label: isEn ? 'UK' : 'Anh', code: 'GB' },
  { label: isEn ? 'France' : 'Pháp', code: 'FR' },
  { label: isEn ? 'Thailand' : 'Thái Lan', code: 'TH' }
];

const YEARS_LIST = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2015];

export const Header: React.FC<HeaderProps> = ({
  notifications,
  onMarkNotificationRead,
  user,
  setUser
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ movies: Movie[]; actors: Actor[] }>({
    movies: [],
    actors: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Dropdowns State
  const [showGenreMenu, setShowGenreMenu] = useState(false);
  const [showCountryMenu, setShowCountryMenu] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const genreMenuRef = useRef<HTMLDivElement | null>(null);
  const countryMenuRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Autocomplete Search Handler with AbortController
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ movies: [], actors: [] });
      setShowDropdown(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const langParam = i18n.language?.startsWith('en') ? 'en-US' : 'vi-VN';
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(searchQuery)}&lang=${langParam}`, {
          signal: controller.signal
        });
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.data);
          setShowDropdown(true);
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Header search error', err);
        }
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (genreMenuRef.current && !genreMenuRef.current.contains(e.target as Node)) {
        setShowGenreMenu(false);
      }
      if (countryMenuRef.current && !countryMenuRef.current.contains(e.target as Node)) {
        setShowCountryMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMovie = (id: number) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/movie/${id}`);
  };

  const handleSelectActor = (id: number) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/actor/${id}`);
  };

  const handleRandomMovie = async () => {
    try {
      const res = await fetch('/api/movies/trending');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const todayStr = new Date().toISOString().split('T')[0];
        // Filter ONLY movies that are currently or already released (release_date <= today and vote_average > 0)
        const releasedMovies = data.data.filter((m: Movie) => {
          const isReleasedDate = !m.release_date || m.release_date <= todayStr;
          const hasRating = m.vote_average != null && m.vote_average > 0;
          return isReleasedDate && hasRating;
        });

        const pool = releasedMovies.length > 0 ? releasedMovies : data.data;
        const randomIndex = Math.floor(Math.random() * pool.length);
        const randomMovie = pool[randomIndex];
        navigate(`/movie/${randomMovie.id}`);
      } else {
        const defaultReleasedIds = [872585, 157336, 671, 27205, 19995]; // Oppenheimer, Interstellar, Harry Potter, Inception, Avatar
        const randomId = defaultReleasedIds[Math.floor(Math.random() * defaultReleasedIds.length)];
        navigate(`/movie/${randomId}`);
      }
    } catch {
      navigate('/movie/872585');
    }
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0a0d14]/90 border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo Brand */}
        <div onClick={() => navigate('/')} className="flex items-center space-x-3 cursor-pointer group flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
            <Film className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition">
            Cine<span className="text-amber-400">Wiki</span>
          </span>
        </div>

        {/* Search Bar with Autocomplete */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-sm hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  setShowDropdown(false);
                  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              placeholder={t('nav.searchPlaceholder')}
              aria-label={t('nav.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 focus:border-amber-500/50 rounded-2xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none transition shadow-inner"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && (searchResults.movies.length > 0 || searchResults.actors.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 divide-y divide-slate-800 max-h-96 overflow-y-auto">
              {/* Movies Result */}
              {searchResults.movies.length > 0 && (
                <div className="p-2">
                  <span className="text-[10px] font-bold text-amber-400 px-3 py-1 block uppercase tracking-wider">
                    Phim
                  </span>
                  {searchResults.movies.slice(0, 4).map((m) => (
                    <div
                      key={m.id}
                      tabIndex={0}
                      onClick={() => handleSelectMovie(m.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSelectMovie(m.id)}
                      className="flex items-center space-x-3 p-2 hover:bg-slate-800/60 rounded-xl cursor-pointer transition focus:bg-slate-800/80 focus:outline-none"
                    >
                      <img src={m.poster_path} alt={m.title} className="w-8 h-12 object-cover rounded-md" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{getMovieTitle(m, i18n.language)}</h4>
                        <span className="text-[10px] text-slate-400">{m.release_date ? m.release_date.split('-')[0] : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actors Result */}
              {searchResults.actors.length > 0 && (
                <div className="p-2">
                  <span className="text-[10px] font-bold text-cyan-400 px-3 py-1 block uppercase tracking-wider">
                    Diễn viên
                  </span>
                  {searchResults.actors.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      tabIndex={0}
                      onClick={() => handleSelectActor(a.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSelectActor(a.id)}
                      className="flex items-center space-x-3 p-2 hover:bg-slate-800/60 rounded-xl cursor-pointer transition focus:bg-slate-800/80 focus:outline-none"
                    >
                      <img src={a.profile_path} alt={a.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{a.name}</h4>
                        <span className="text-[10px] text-slate-400">{a.known_for_department}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center space-x-1 sm:space-x-1.5">
          {/* ① Thể loại Dropdown */}
          <div ref={genreMenuRef} className="relative">
            <button
              onClick={() => {
                setShowGenreMenu(!showGenreMenu);
                setShowCountryMenu(false);
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-amber-400 hover:bg-slate-900/80 flex items-center space-x-1 transition cursor-pointer"
            >
              <span>{t('nav.genres')}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition transform ${showGenreMenu ? 'rotate-180 text-amber-400' : ''}`} />
            </button>
            {showGenreMenu && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl z-50 p-2 grid grid-cols-2 gap-1 animate-fade-in">
                {getGenresList(i18n.language?.startsWith('en')).map((g) => (
                  <button
                    key={g.value}
                    onClick={() => {
                      setShowGenreMenu(false);
                      navigate(`/search?genre=${g.value}`);
                    }}
                    className="text-[11px] text-left px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 transition font-medium"
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ② Quốc gia Dropdown (Quốc gia & Năm phát hành) */}
          <div ref={countryMenuRef} className="relative">
            <button
              onClick={() => {
                setShowCountryMenu(!showCountryMenu);
                setShowGenreMenu(false);
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-amber-400 hover:bg-slate-900/80 flex items-center space-x-1 transition cursor-pointer"
            >
              <span>{t('nav.countries')}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition transform ${showCountryMenu ? 'rotate-180 text-amber-400' : ''}`} />
            </button>
            {showCountryMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl z-50 p-3 space-y-3 animate-fade-in">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block mb-1.5">
                    🌍 Quốc gia
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    {getCountriesList(i18n.language?.startsWith('en')).map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setShowCountryMenu(false);
                          navigate(`/search?country=${c.code}`);
                        }}
                        className="text-[11px] text-left px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 transition font-medium"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-2.5">
                  <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider block mb-1.5">
                    📅 Năm phát hành
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    {YEARS_LIST.map((y) => (
                      <button
                        key={y}
                        onClick={() => {
                          setShowCountryMenu(false);
                          navigate(`/search?year=${y}`);
                        }}
                        className="text-[11px] text-center px-2 py-1.5 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition font-medium"
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ③ Diễn viên */}
          <button
            onClick={() => navigate('/actors')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              isActive('/actors')
                ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30 font-bold'
                : 'text-slate-200 hover:text-pink-400 hover:bg-slate-900/80'
            }`}
          >
            <span>{t('nav.actors')}</span>
          </button>

          {/* ④ Ngẫu Nhiên */}
          <button
            onClick={handleRandomMovie}
            className="px-3 py-2 rounded-xl text-xs font-bold text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/30 transition cursor-pointer flex items-center space-x-1"
            title="Đổi gió xem phim ngẫu nhiên"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t('nav.random')}</span>
          </button>

          {/* Idol Link */}
          <button
            onClick={() => navigate('/following')}
            aria-label="Idol của tôi"
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
              isActive('/following')
                ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden lg:inline">{t('nav.idols')}</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setShowNotifDrawer(true)}
            aria-label="Thông báo"
            className="relative p-2 text-slate-400 hover:text-amber-400 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-lg animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Language Switcher Toggle */}
          <button
            onClick={() => {
              const currentLang = i18n.language || 'vi';
              const nextLang = currentLang.startsWith('en') ? 'vi' : 'en';
              i18n.changeLanguage(nextLang);
            }}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-200 hover:text-amber-400 hover:bg-slate-900 border border-slate-800 flex items-center space-x-1.5 transition cursor-pointer"
            title="Chuyển đổi Ngôn ngữ / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase text-[11px] font-black">{i18n.language?.startsWith('en') ? 'EN' : 'VI'}</span>
          </button>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center space-x-2 pl-2">
              <span className="text-xs font-semibold text-slate-200 hidden sm:inline">{user.name}</span>
              <button
                onClick={() => setUser(null)}
                aria-label="Đăng xuất"
                className="p-2 text-slate-400 hover:text-rose-400 rounded-xl transition"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              aria-label="Đăng nhập"
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs hover:from-amber-400 transition shadow-lg flex items-center space-x-1.5"
            >
              <UserIcon className="w-3.5 h-3.5 fill-slate-950" />
              <span>Đăng nhập</span>
            </button>
          )}
        </nav>
      </div>

      {/* Notification Drawer */}
      {showNotifDrawer && (
        <NotificationDrawer
          notifications={notifications}
          onClose={() => setShowNotifDrawer(false)}
          onMarkRead={onMarkNotificationRead}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(userData) => {
            setUser(userData);
            localStorage.setItem('cinewiki_user', JSON.stringify(userData));
          }}
        />
      )}
    </header>
  );
};
