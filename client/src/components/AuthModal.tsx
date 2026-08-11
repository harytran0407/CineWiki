import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Film, Mail, Lock, User, Sparkles } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const { t } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('cinewiki_token', data.token);
        localStorage.setItem('cinewiki_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.message || 'Thông tin đăng nhập không hợp lệ.');
      }
    } catch (err) {
      console.error('Auth error', err);
      setErrorMsg('Không thể kết nối máy chủ, vui lòng kiểm tra mạng và thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoUser: UserType = {
      id: 'demo-user',
      email: 'demo@cinewiki.com',
      name: 'Nguyen Van Cinephile',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    localStorage.setItem('cinewiki_user', JSON.stringify(demoUser));
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
            <Film className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            {isRegister ? t('auth.register') : t('auth.login')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{t('auth.welcomeBack')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3.5 py-2.5 font-medium">
              {errorMsg}
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">{t('auth.fullName')}</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Cinephile Star"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('auth.password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg transition transform active:scale-95 disabled:opacity-50"
          >
            {loading ? '...' : isRegister ? t('auth.register') : t('auth.login')}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col space-y-3">
          <button
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700 text-amber-300 font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 border border-amber-500/20 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t('auth.demoLogin')}</span>
          </button>

          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-slate-400 hover:text-amber-400 text-center transition"
          >
            {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
          </button>
        </div>
      </div>
    </div>
  );
};
