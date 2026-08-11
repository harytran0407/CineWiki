import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Actor } from '../types';
import { CareerTimeline } from '../components/CareerTimeline';
import { ImgWithFallback } from '../components/ImgWithFallback';
import { calculateDaysToBirthday } from '../utils/dateUtils';
import { Heart, Calendar, MapPin, Award as AwardIcon, Sparkles, ArrowLeft, Cake, Film, DollarSign, Ruler, UserCheck, Flame, GitCompare, Search, X } from 'lucide-react';

interface ActorDetailPageProps {
  userFollowIds: number[];
  onToggleFollow: (actorId: number) => void;
}

export const ActorDetailPage: React.FC<ActorDetailPageProps> = ({ userFollowIds, onToggleFollow }) => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [actor, setActor] = useState<Actor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translatedBio, setTranslatedBio] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Compare Modal State
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareSearchQuery, setCompareSearchQuery] = useState('');
  const [compareSearchResults, setCompareSearchResults] = useState<Actor[]>([]);
  const [isSearchingActors, setIsSearchingActors] = useState(false);
  const [selectedB, setSelectedB] = useState<Actor | null>(null);
  const [popularCandidates, setPopularCandidates] = useState<Actor[]>([]);

  // AI Deep Insight State
  const [aiInsight, setAiInsight] = useState<{
    biography_vi?: string;
    summary_vi: string;
    acting_style_analysis: string;
    milestones: string[];
    trivia: string[];
    awards?: any[];
  } | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const numActorId = id ? parseInt(id, 10) : 0;

  const fetchAIInsight = async () => {
    if (!actor) return;
    setLoadingInsight(true);
    try {
      const res = await fetch('/api/ai/enrich-actor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorId: actor.id, actorData: actor })
      });
      const data = await res.json();
      if (data.success) {
        setAiInsight(data.data);
      }
    } catch (err) {
      console.error('Fetch AI insight error', err);
    } finally {
      setLoadingInsight(false);
    }
  };

  useEffect(() => {
    fetch('/api/actors/popular')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPopularCandidates(data.data.filter((a: Actor) => a.id !== numActorId));
        }
      })
      .catch(() => {});
  }, [numActorId]);

  useEffect(() => {
    if (!compareSearchQuery.trim()) {
      setCompareSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingActors(true);
      try {
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(compareSearchQuery)}`);
        const data = await res.json();
        if (data.success && data.data.actors) {
          setCompareSearchResults(data.data.actors.filter((a: Actor) => a.id !== numActorId));
        }
      } catch (err) {
        console.error('Search compare actors error', err);
      } finally {
        setIsSearchingActors(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [compareSearchQuery, numActorId]);

  useEffect(() => {
    const fetchActor = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      setTranslatedBio(null);
      try {
        const lang = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        const res = await fetch(`/api/actors/${id}?lang=${lang}`);
        if (!res.ok) throw new Error('Không thể tải chi tiết diễn viên');
        const data = await res.json();
        if (data.success) {
          setActor(data.data);
          // Auto-trigger Gemini AI Insight generation on page load
          fetch('/api/ai/enrich-actor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ actorId: data.data.id, actorData: data.data })
          })
            .then((r) => r.json())
            .then((aiRes) => {
              if (aiRes.success && aiRes.data) {
                setAiInsight(aiRes.data);
              }
            })
            .catch((err) => console.error('Auto AI insight error', err));
        } else {
          throw new Error(data.message || 'Dữ liệu diễn viên không khả dụng');
        }
      } catch (err) {
        console.error('Fetch actor error', err);
        setError((err as Error).message || 'Có lỗi xảy ra, vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchActor();
  }, [id, i18n.language]);

  const handleAITranslateBio = async () => {
    if (!actor?.biography || isTranslating) return;
    setIsTranslating(true);
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: actor.biography,
          targetLang: i18n.language === 'vi' ? 'vi' : 'en'
        })
      });
      const data = await res.json();
      if (data.success) {
        setTranslatedBio(data.translatedText);
      }
    } catch (err) {
      console.error('Translation error', err);
    } finally {
      setIsTranslating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pt-6">
        <div className="h-64 rounded-3xl skeleton-box" />
        <div className="h-96 rounded-3xl skeleton-box" />
      </div>
    );
  }

  if (error || !actor) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 my-12 border border-slate-800">
        <h2 className="text-lg font-bold text-slate-200">{error || 'Không tìm thấy thông tin diễn viên.'}</h2>
        <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition">
          Trở về Trang chủ
        </button>
      </div>
    );
  }

  const isFollowing = userFollowIds.includes(numActorId);
  const daysToBday = calculateDaysToBirthday(actor.birthday);

  // Check if real awards exist (including Gemini AI generated specific awards) & sort by year descending
  const rawAwards = [
    ...(aiInsight?.awards || []),
    ...(actor.awards || [])
  ];
  const realAwards = rawAwards
    .filter(
      (a, idx, self) =>
        self.findIndex((item) => item.name.toLowerCase() === a.name.toLowerCase() && item.year === a.year) === idx
    )
    .sort((a, b) => b.year - a.year);

  return (
    <div className="space-y-12 pb-16">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-amber-300 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Trở về</span>
      </button>

      {/* Header Profile Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-2xl">
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-amber-500/40 shadow-2xl flex-shrink-0 bg-slate-900">
          <ImgWithFallback src={actor.profile_path} type="profile" alt={actor.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-100">{actor.name}</h1>
              <p className="text-xs text-amber-400 font-semibold mt-1">
                {actor.nationality || 'Quốc tế'} &bull; {actor.known_for_department}
              </p>
            </div>

            {/* Action Buttons: Follow + Compare */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => setShowCompareModal(true)}
                className="py-2.5 px-5 rounded-2xl text-xs font-bold flex items-center space-x-2 bg-gradient-to-r from-amber-500/10 to-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition shadow-lg transform active:scale-95 cursor-pointer"
              >
                <GitCompare className="w-4 h-4 text-amber-400" />
                <span>So sánh diễn viên này</span>
              </button>

              <button
                onClick={() => onToggleFollow(actor.id)}
                className={`py-2.5 px-6 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-lg transition transform active:scale-95 ${
                  isFollowing
                    ? 'bg-slate-800 text-pink-400 border border-pink-500/30'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFollowing ? 'fill-pink-400 text-pink-400' : ''}`} />
                <span>{isFollowing ? t('actor.unfollowBtn') : t('actor.followBtn')}</span>
              </button>
            </div>
          </div>

          {/* Key Quick Stats Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300 pt-1">
            {actor.birthday && (
              <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Sinh ngày: {actor.birthday}</span>
              </div>
            )}

            {daysToBday !== null && (
              <div className="flex items-center space-x-1.5 bg-pink-500/10 text-pink-300 px-3 py-1.5 rounded-xl border border-pink-500/30 font-semibold">
                <Cake className="w-3.5 h-3.5 text-pink-400" />
                <span>🎂 Còn {daysToBday} ngày tới sinh nhật</span>
              </div>
            )}

            {actor.height && (
              <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                <span>Chiều cao: {actor.height}</span>
              </div>
            )}

            {actor.debut_year && (
              <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hoạt động: từ năm {actor.debut_year}</span>
              </div>
            )}

            {actor.total_box_office && (
              <div className="flex items-center space-x-1.5 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 text-amber-300 font-bold">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>Tổng doanh thu: {actor.total_box_office}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Acting Style & Career Overview */}
      {actor.acting_style && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-extrabold text-slate-100">Phong cách Diễn xuất & Thể loại Sở trường</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {actor.acting_style}
          </p>
        </section>
      )}

      {/* Detailed Biography with Natural Language Switcher */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-100">{t('actor.biography')}</h2>

          <button
            onClick={handleAITranslateBio}
            disabled={isTranslating}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTranslating ? t('movie.aiTranslating') : t('movie.aiTranslate')}</span>
          </button>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-normal">
          {aiInsight?.biography_vi || translatedBio || actor.biography_vi || actor.biography}
        </p>
      </section>

      {/* AI DEEP INSIGHT SECTION */}
      <section className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-100 flex items-center space-x-2">
                <span>Trí Tuệ Nhân Tạo (AI) Phân Tích Chuyên Sâu</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30">CineWiki AI Pro</span>
              </h2>
              <p className="text-xs text-slate-400">Tự động tổng hợp di sản nghệ thuật, tâm lý vai diễn & câu chuyện bên lề</p>
            </div>
          </div>

          <button
            onClick={fetchAIInsight}
            disabled={loadingInsight}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center space-x-2 shadow-lg transition transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>{loadingInsight ? 'Đang phân tích AI...' : aiInsight ? 'Cập nhật phân tích AI' : '✨ Tạo phân tích AI chuyên sâu'}</span>
          </button>
        </div>

        {loadingInsight ? (
          <div className="space-y-4 py-6 animate-pulse">
            <div className="h-4 bg-amber-500/20 rounded-full w-3/4" />
            <div className="h-4 bg-slate-800 rounded-full w-full" />
            <div className="h-4 bg-slate-800 rounded-full w-5/6" />
          </div>
        ) : aiInsight ? (
          <div className="space-y-6 text-xs sm:text-sm text-slate-300">
            {/* AI Summary */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/20 space-y-2">
              <h4 className="font-bold text-amber-400 text-xs flex items-center space-x-1.5">
                <span>📝 Tóm tắt Di sản Điện ảnh</span>
              </h4>
              <p className="leading-relaxed font-medium text-slate-200">{aiInsight.summary_vi}</p>
            </div>

            {/* Acting Style */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <h4 className="font-bold text-cyan-400 text-xs flex items-center space-x-1.5">
                <span>🎭 Phân tích Phong cách Diễn xuất & Tâm lý Nhập vai</span>
              </h4>
              <p className="leading-relaxed text-slate-300">{aiInsight.acting_style_analysis}</p>
            </div>

            {/* Milestones & Trivia Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Milestones */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <h4 className="font-bold text-emerald-400 text-xs flex items-center space-x-1.5">
                  <span>🏆 Cột mốc Lịch sử Sự nghiệp</span>
                </h4>
                <ul className="space-y-2">
                  {aiInsight.milestones.map((m, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trivia */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <h4 className="font-bold text-pink-400 text-xs flex items-center space-x-1.5">
                  <span>💡 Chuyện Bên Lề Độc Đáo</span>
                </h4>
                <ul className="space-y-2">
                  {aiInsight.trivia.map((t, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs">
                      <span className="text-pink-400 font-bold">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 space-y-2 bg-slate-900/40 rounded-2xl border border-slate-800/60">
            <p>Nhấn vào nút <strong>"✨ Tạo phân tích AI chuyên sâu"</strong> ở trên để AI tạo ngay bản tổng hợp điện ảnh chi tiết về diễn viên này!</p>
          </div>
        )}
      </section>

      {/* CAREER TIMELINE FEATURE */}
      <CareerTimeline filmography={actor.filmography} actorName={actor.name} />

      {/* Landmark Works List with Posters */}
      {actor.landmark_works && actor.landmark_works.length > 0 && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Film className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-extrabold text-slate-100">Tác phẩm Nổi bật & Cột mốc Sự nghiệp</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actor.landmark_works.map((work, idx) => {
              const cleanWorkTitle = work.replace(/\s*\(\d{4}\)\s*/, '').trim().toLowerCase();
              const matchedFilm = actor.filmography?.find((f) => {
                const cleanFilmTitle = f.title.toLowerCase();
                return cleanFilmTitle.includes(cleanWorkTitle) || cleanWorkTitle.includes(cleanFilmTitle);
              });

              return (
                <div
                  key={idx}
                  onClick={() => matchedFilm && navigate(`/movie/${matchedFilm.id}`)}
                  className={`p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center space-x-3.5 shadow-md group transition ${
                    matchedFilm ? 'hover:border-amber-400/60 cursor-pointer' : ''
                  }`}
                >
                  <div className="w-12 h-16 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0 bg-slate-800">
                    <ImgWithFallback
                      src={matchedFilm?.poster_path || ''}
                      type="poster"
                      alt={work}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      {matchedFilm?.vote_average && (
                        <span className="text-[10px] font-bold text-amber-400">
                          ⭐ {matchedFilm.vote_average}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition line-clamp-2">
                      {work}
                    </h4>
                    {matchedFilm?.character && (
                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                        Vai: {matchedFilm.character}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* PHYSICAL OFFICIAL AWARDS SECTION ONLY */}
      {realAwards.length > 0 && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <AwardIcon className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-extrabold text-slate-100">{t('actor.awards')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {realAwards.map((awd) => (
              <div
                key={awd.id || `${awd.name}-${awd.year}`}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 shadow-md hover:border-slate-700 transition"
              >
                <h4 className="text-xs font-bold text-slate-100 truncate">{awd.name} ({awd.year})</h4>
                <p className="text-[11px] text-amber-300 font-medium truncate">{awd.category}</p>
                <p className="text-[10px] text-slate-400">Tác phẩm: <span className="text-slate-200 font-medium">{awd.movie_title}</span></p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CELLPHONES / FPT SHOP STYLE COMPARE SELECTION MODAL */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-amber-500/30 p-6 sm:p-8 space-y-6 relative shadow-2xl animate-fade-in">
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 text-sm font-bold w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <GitCompare className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-100">So sánh Diễn viên Đa chiều</h3>
                <p className="text-xs text-slate-400">Chọn đối thủ điện ảnh để so sánh toàn diện sự nghiệp, giải thưởng & doanh thu</p>
              </div>
            </div>

            {/* Duel Banner: Actor A vs Selected Actor B */}
            <div className="grid grid-cols-2 gap-4 items-center bg-slate-900/90 p-4 rounded-2xl border border-slate-800 relative">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-md bg-slate-800">
                  <ImgWithFallback src={actor.profile_path} type="profile" alt={actor.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{actor.name}</h4>
                <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30 font-semibold">
                  Diễn viên A (Hiện tại)
                </span>
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center border-2 border-slate-900 shadow-xl">
                VS
              </div>

              <div className="flex flex-col items-center text-center space-y-2">
                {selectedB ? (
                  <>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400/60 shadow-md bg-slate-800">
                      <ImgWithFallback src={selectedB.profile_path} type="profile" alt={selectedB.name} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{selectedB.name}</h4>
                    <button
                      onClick={() => setSelectedB(null)}
                      className="text-[10px] text-pink-400 hover:underline font-semibold"
                    >
                      Đổi đối thủ khác
                    </button>
                  </>
                ) : (
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 text-[11px] p-2 text-center bg-slate-950/50">
                    <span>Chưa chọn</span>
                  </div>
                )}
              </div>
            </div>

            {/* Search Input for Actor B */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 block">Tìm đối thủ bất kỳ (không giới hạn):</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={compareSearchQuery}
                  onChange={(e) => setCompareSearchQuery(e.target.value)}
                  placeholder="Gõ tên tìm diễn viên bất kỳ (Leonardo DiCaprio, Brad Pitt, Zendaya...)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-400/50"
                />
              </div>

              {/* Live Search Results from TMDB */}
              {isSearchingActors && (
                <p className="text-xs text-amber-400 animate-pulse">🔍 Đang tìm kiếm diễn viên trên TMDB...</p>
              )}
              {compareSearchResults.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-1 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-inner">
                  {compareSearchResults.map((act) => (
                    <div
                      key={`srch-${act.id}`}
                      onClick={() => {
                        setSelectedB(act);
                        setCompareSearchQuery('');
                        setCompareSearchResults([]);
                      }}
                      className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800 cursor-pointer text-xs transition"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-800 border border-slate-700">
                        <ImgWithFallback src={act.profile_path} type="profile" alt={act.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-slate-200">{act.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Popular Recommendations */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block">Gợi ý đối thủ nổi bật:</span>
                <div className="flex flex-wrap gap-2">
                  {popularCandidates.slice(0, 6).map((pop) => (
                    <button
                      key={`popB-${pop.id}`}
                      onClick={() => setSelectedB(pop)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                        selectedB?.id === pop.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/40'
                      }`}
                    >
                      {pop.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              disabled={!selectedB}
              onClick={() => {
                if (selectedB) {
                  navigate(`/compare?a=${actor.id}&b=${selectedB.id}`);
                }
              }}
              className={`w-full py-3.5 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                selectedB
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xl cursor-pointer transform active:scale-98'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>Bắt đầu so sánh hai diễn viên ngay</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
