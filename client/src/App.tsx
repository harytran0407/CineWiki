import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { ActorDetailPage } from './pages/ActorDetailPage';
import { ActorListPage } from './pages/ActorListPage';
import { ComparePage } from './pages/ComparePage';
import { SearchPage } from './pages/SearchPage';
import { FollowingPage } from './pages/FollowingPage';
import { AIChatbot } from './components/AIChatbot';
import { Notification, User } from './types';

const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);

  return null;
};


const safeFetchJson = async (url: string, options?: RequestInit) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    return null;
  }
};

import { NetworkPage } from './pages/NetworkPage';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cinewiki_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [userFollowIds, setUserFollowIds] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Sync Notifications safely
  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await safeFetchJson(`/api/user/notifications?userId=${user?.id || 'demo-user'}`);
      if (data && data.success && Array.isArray(data.data)) {
        setNotifications(data.data);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [user]);

  // Sync Follows safely
  useEffect(() => {
    const fetchFollows = async () => {
      const data = await safeFetchJson(`/api/user/follows?userId=${user?.id || 'demo-user'}`);
      if (data && data.success && Array.isArray(data.followIds)) {
        setUserFollowIds(data.followIds);
      }
    };

    fetchFollows();
  }, [user]);

  const handleToggleFollow = async (actorId: number) => {
    const data = await safeFetchJson('/api/user/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actorId, userId: user?.id || 'demo-user' })
    });
    if (data && data.success) {
      if (data.isFollowing) {
        setUserFollowIds((prev) => [...prev, actorId]);
      } else {
        setUserFollowIds((prev) => prev.filter((id) => id !== actorId));
      }
    }
  };

  const handleMarkNotificationRead = async (notificationId: string) => {
    const data = await safeFetchJson('/api/user/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId, userId: user?.id || 'demo-user' })
    });
    if (notificationId === 'all') {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } else {
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)));
    }
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#0a0d14] text-slate-100 selection:bg-amber-500 selection:text-black font-sans">
        <Header
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          user={user}
          setUser={setUser}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          <Routes>
            <Route
              path="/"
              element={<HomePage userFollowIds={userFollowIds} onToggleFollow={handleToggleFollow} />}
            />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route
              path="/actor/:id"
              element={<ActorDetailPage userFollowIds={userFollowIds} onToggleFollow={handleToggleFollow} />}
            />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/actors" element={<ActorListPage />} />
            <Route path="/network/:actorId?" element={<NetworkPage />} />
            <Route
              path="/following"
              element={
                <FollowingPage
                  user={user}
                  userFollowIds={userFollowIds}
                  onToggleFollow={handleToggleFollow}
                  notifications={notifications}
                />
              }
            />
          </Routes>
        </main>

        <Footer />
        <AIChatbot />
      </div>
    </Router>
  );
};
