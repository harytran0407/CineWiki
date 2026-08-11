import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationDrawer } from './NotificationDrawer';
import { AuthModal } from './AuthModal';
import { Movie, Actor, Notification, User } from '../types';
import { Film, Search, GitCompare, Filter, Heart, Bell, Globe, User as UserIcon, LogOut, Network } from 'lucide-react';

interface HeaderProps {
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

export const Header: React.FC<HeaderProps> = ({
  notifications,
  onMarkNotificationRead,
  user,
  setUser
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ movies: Movie[]; actors: Actor[] }>({
    movies: [],
    actors: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('cinewiki_lang', nextLang);
  };

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
        const lang = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(searchQuery)}&lang=${lang}`, {
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
  }, [searchQuery, i18n.language]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
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

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0a0d14]/80 border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo Brand */}
        <div onClick={() => navigate('/')} className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
            <Film className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition">
            Cine<span className="text-amber-400">Wiki</span>
          </span>
        </div>

        {/* Search Bar with Autocomplete */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowDropdown(true)}
              placeholder={t('nav.searchPlaceholder')}
              aria-label={t('nav.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-amber-500/50 rounded-2xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none transition shadow-inner"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && (searchResults.movies.length > 0 || searchResults.actors.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 divide-y divide-slate-800 max-h-96 overflow-y-auto">
              {/* Movies Result */}
              {searchResults.movies.length > 0 && (
                <div className="p-2">
                  <span className="text-[10px] font-bold text-amber-400 px-3 py-1 block uppercase tracking-wider">
                    {t('nav.movies')}
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
                        <h4 className="text-xs font-bold text-slate-100">{m.title}</h4>
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
                    {t('nav.actors')}
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
        <nav className="flex items-center space-x-1 sm:space-x-3">
          <button
            onClick={() => navigate('/compare?tab=movie')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
              location.pathname === '/compare' && location.search.includes('tab=movie')
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Film className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">So sánh Phim</span>
          </button>

          <button
            onClick={() => navigate('/compare?tab=actor')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
              location.pathname === '/compare' && !location.search.includes('tab=movie')
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <GitCompare className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">So sánh Diễn viên</span>
          </button>

          <button
            onClick={() => navigate('/search')}
            aria-label={t('nav.search')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
              isActive('/search')
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Filter className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{t('nav.search')}</span>
          </button>

          <button
            onClick={() => navigate('/following')}
            aria-label={t('nav.idols')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
              isActive('/following')
                ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Heart className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline">{t('nav.idols')}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            aria-label="Đổi ngôn ngữ giao diện"
            className="p-2.5 text-slate-400 hover:text-amber-400 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition flex items-center space-x-1"
            title="Đổi ngôn ngữ"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">{i18n.language}</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setShowNotifDrawer(true)}
            aria-label="Thông báo"
            className="relative p-2.5 text-slate-400 hover:text-amber-400 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-lg animate-pulse">
                {unreadCount}
              </span>
            )}
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
              aria-label={t('auth.login')}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs hover:from-amber-400 transition shadow-lg flex items-center space-x-1.5"
            >
              <UserIcon className="w-3.5 h-3.5 fill-slate-950" />
              <span>{t('auth.login')}</span>
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
