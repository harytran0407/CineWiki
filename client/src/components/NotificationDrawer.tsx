import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Film, Award, Cake, CheckCheck, X } from 'lucide-react';
import { Notification } from '../types';
import { ImgWithFallback } from './ImgWithFallback';

interface NotificationDrawerProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ notifications, onClose, onMarkRead }) => {
  const navigate = useNavigate();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_movie':
        return <Film className="w-5 h-5 text-amber-400" />;
      case 'award':
        return <Award className="w-5 h-5 text-yellow-300" />;
      case 'birthday':
        return <Cake className="w-5 h-5 text-pink-400" />;
      default:
        return <Bell className="w-5 h-5 text-sky-400" />;
    }
  };

  const handleClickItem = (notif: Notification) => {
    onMarkRead(notif.id);
    if (notif.actor_id) {
      navigate(`/actor/${notif.actor_id}`);
      onClose();
    }
  };

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl z-50 border border-amber-500/20 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-sm text-amber-200">🔔 Thông báo</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMarkRead('all')}
            title="Đánh dấu tất cả đã đọc"
            aria-label="Đánh dấu tất cả đã đọc"
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-amber-400 transition"
          >
            <CheckCheck className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            aria-label="Đóng thông báo"
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/60">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">Không có thông báo nào.</div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleClickItem(notif)}
              className={`p-4 flex items-start space-x-3 cursor-pointer hover:bg-slate-800/50 transition ${
                !notif.is_read ? 'bg-amber-500/5 border-l-2 border-amber-400' : ''
              }`}
            >
              <ImgWithFallback
                src={notif.actor_profile}
                type="profile"
                alt={notif.actor_name}
                className="w-10 h-10 rounded-full object-cover border border-amber-400/30 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-amber-300 truncate">{notif.actor_name}</span>
                  {getIcon(notif.type)}
                </div>
                <p className="text-xs text-slate-200 font-medium line-clamp-2">
                  {notif.content_vi || notif.content}
                </p>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
