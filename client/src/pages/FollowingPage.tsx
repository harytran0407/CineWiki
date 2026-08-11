import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Actor, Notification, User as UserType } from '../types';
import { ImgWithFallback } from '../components/ImgWithFallback';
import { calculateDaysToBirthday } from '../utils/dateUtils';
import { Heart, Calendar, Cake, Film, Award, Sparkles, UserX, Trash2, ArrowRight } from 'lucide-react';

interface FollowingPageProps {
  user: UserType | null;
  userFollowIds: number[];
  onToggleFollow: (actorId: number) => void;
  notifications: Notification[];
}

export const FollowingPage: React.FC<FollowingPageProps> = ({
  user,
  userFollowIds,
  onToggleFollow,
  notifications
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [followedActors, setFollowedActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowed = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/user/follows?userId=${user?.id || 'demo-user'}`);
        const data = await res.json();
        if (data.success) {
          setFollowedActors(data.data);
        }
      } catch (err) {
        console.error('Fetch follows error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowed();
  }, [userFollowIds, user]);

  if (!user && userFollowIds.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 my-12 border border-pink-500/20">
        <Heart className="w-12 h-12 text-pink-400 mx-auto fill-pink-400/20" />
        <h2 className="text-xl font-extrabold text-slate-100">{t('idols.loginRequired')}</h2>
        <p className="text-xs text-slate-400">{t('idols.noFollows')}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs"
        >
          Khám phá Diễn viên Ngay
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-pink-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center">
            <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100">{t('idols.title')}</h1>
            <p className="text-xs text-slate-400 mt-1">{t('idols.followedCount', { count: followedActors.length })}</p>
          </div>
        </div>
      </div>

      {/* Followed Idols Grid Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-100">Dàn Idol Đang Theo Dõi</h2>

        {followedActors.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-2xl border border-slate-800 text-xs text-slate-400">
            {t('idols.noFollows')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {followedActors.map((actor) => {
              const daysLeft = calculateDaysToBirthday(actor.birthday);
              return (
                <div
                  key={actor.id}
                  className="glass-panel rounded-3xl p-5 border border-slate-800 hover:border-pink-500/40 transition space-y-4 relative group"
                >
                  <div className="flex items-center space-x-4">
                    <div onClick={() => navigate(`/actor/${actor.id}`)} className="cursor-pointer">
                      <ImgWithFallback
                        src={actor.profile_path}
                        type="profile"
                        alt={actor.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-pink-400/50"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() => navigate(`/actor/${actor.id}`)}
                        className="text-base font-bold text-slate-100 truncate cursor-pointer hover:text-pink-300 transition"
                      >
                        {actor.name}
                      </h3>
                      <p className="text-xs text-slate-400">{actor.known_for_department}</p>
                    </div>
                    <button
                      onClick={() => onToggleFollow(actor.id)}
                      title="Bỏ theo dõi"
                      aria-label="Bỏ theo dõi"
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-full bg-slate-900/80 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Idol Highlights Countdown */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                    <div className="flex items-center space-x-2 text-pink-300">
                      <Cake className="w-3.5 h-3.5 text-pink-400" />
                      <span>
                        Sinh nhật: {actor.birthday || 'N/A'}{' '}
                        {daysLeft !== null ? `(còn ${daysLeft} ngày)` : ''}
                      </span>
                    </div>
                    {actor.upcoming_movies && actor.upcoming_movies[0] && (
                      <div className="flex items-center space-x-2 text-cyan-300">
                        <Film className="w-3.5 h-3.5" />
                        <span className="truncate">Phim sắp chiếu: {actor.upcoming_movies[0].title}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Idol Feed Timeline */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-extrabold text-slate-100">{t('idols.feedTitle')}</h2>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 divide-y divide-slate-800/60">
          {notifications.map((notif) => (
            <div key={notif.id} className="pt-4 first:pt-0 flex items-start space-x-4">
              <ImgWithFallback
                src={notif.actor_profile}
                type="profile"
                alt={notif.actor_name}
                className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-amber-300">{notif.actor_name}</h4>
                  <span className="text-[10px] text-slate-500">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-200 mt-1">
                  {i18n.language === 'vi' ? notif.content_vi : notif.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
