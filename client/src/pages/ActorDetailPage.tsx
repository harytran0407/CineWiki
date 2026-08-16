import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { Actor } from '../types';
import { CareerTimeline } from '../components/CareerTimeline';
import { ImgWithFallback } from '../components/ImgWithFallback';
import { calculateDaysToBirthday } from '../utils/dateUtils';
import { Heart, Calendar, MapPin, Award as AwardIcon, Sparkles, ArrowLeft, Cake, Film, DollarSign, Ruler, UserCheck, Flame, GitCompare, Search, X } from 'lucide-react';

import { useTranslation } from 'react-i18next';

interface ActorDetailPageProps {
  userFollowIds: number[];
  onToggleFollow: (actorId: number) => void;
}

const aiInsightCache = new Map<number, any>();

export const ActorDetailPage: React.FC<ActorDetailPageProps> = ({ userFollowIds, onToggleFollow }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

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
      .catch(() => { });
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
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    let cancelled = false;

    const fetchActor = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      setTranslatedBio(null);
      setAiInsight(null);

      try {
        const langParam = i18n.language?.startsWith('en') ? 'en-US' : 'vi-VN';
        const res = await fetch(`/api/actors/${id}?lang=${langParam}`);
        if (!res.ok) throw new Error('Không thể tải chi tiết diễn viên');
        const data = await res.json();

        if (cancelled) return;

        if (data.success) {
          setActor(data.data);
          const actId = data.data.id;
          if (aiInsightCache.has(actId)) {
            setAiInsight(aiInsightCache.get(actId));
          } else {
            fetch('/api/ai/enrich-actor', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ actorId: actId, actorData: data.data })
            })
              .then((r) => r.json())
              .then((aiRes) => {
                if (!cancelled && aiRes.success && aiRes.data) {
                  aiInsightCache.set(actId, aiRes.data);
                  setAiInsight(aiRes.data);
                }
              })
              .catch((err) => console.error('Auto AI insight error', err));
          }
        } else {
          throw new Error(data.message || 'Dữ liệu diễn viên không khả dụng');
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Fetch actor error', err);
          setError((err as Error).message || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchActor();
    return () => {
      cancelled = true;
    };
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
          targetLang: 'vi'
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

  // Check if real awards exist (WON awards ONLY, exclude nominations) & sort by year descending
  const isWonAward = (awd: any) => {
    if (!awd) return false;
    if (awd.status === 'nominated' || awd.won === false || awd.isWinner === false) return false;
    const cat = (awd.category || '').toLowerCase();
    const name = (awd.name || '').toLowerCase();
    if (cat.includes('đề cử') || cat.includes('nomine') || cat.includes('nomination') || cat.includes('candidate')) return false;
    if (name.includes('đề cử') || name.includes('nomine') || name.includes('nomination') || name.includes('candidate')) return false;
    return true;
  };

  const rawAwards = [
    ...(aiInsight?.awards || []),
    ...(actor.awards || [])
  ];
  const realAwards = rawAwards
    .filter(isWonAward)
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
                {actor.nationality ? `${actor.nationality} • ` : ''}{actor.known_for_department}
              </p>
            </div>

            {/* Action Buttons: Compare */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => setShowCompareModal(true)}
                className="py-2.5 px-5 rounded-2xl text-xs font-bold flex items-center space-x-2 bg-gradient-to-r from-amber-500/10 to-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition shadow-lg transform active:scale-95 cursor-pointer"
              >
                <GitCompare className="w-4 h-4 text-amber-400" />
                <span>So sánh diễn viên này</span>
              </button>
            </div>
          </div>

          {/* Quick Stats List - Clean List format without individual item backgrounds */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8 text-xs text-slate-300 pt-3 border-t border-slate-800/80 mt-2">
            {actor.birthday && (
              <div className="flex items-center space-x-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-slate-400 whitespace-nowrap flex-shrink-0">{t('actor.birthYear') || 'Năm sinh'}:</span>
                <span className="font-semibold text-slate-100 truncate">{actor.birthday}</span>
              </div>
            )}

            {actor.deathday && (
              <div className="flex items-center space-x-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                <span className="text-slate-400 whitespace-nowrap flex-shrink-0">{t('actor.deathday') || 'Ngày mất'}:</span>
                <span className="font-semibold text-rose-300 truncate">
                  {actor.deathday} {(() => {
                    const dY = parseInt(actor.deathday.split('-')[0], 10);
                    const bY = actor.birthday ? parseInt(actor.birthday.split('-')[0], 10) : null;
                    return bY ? `(${t('actor.deceasedAge', { age: dY - bY }) || `hưởng thọ ${dY - bY} tuổi`})` : '';
                  })()}
                </span>
              </div>
            )}

            {actor.nationality && (
              <div className="flex items-center space-x-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-slate-400 whitespace-nowrap flex-shrink-0">{t('actor.nationality') || 'Quốc gia'}:</span>
                <span className="font-semibold text-slate-100 truncate">{actor.nationality}</span>
              </div>
            )}

            {actor.height && (
              <div className="flex items-center space-x-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-slate-400 whitespace-nowrap flex-shrink-0">{t('actor.height') || 'Chiều cao'}:</span>
                <span className="font-semibold text-slate-100 truncate">{actor.height}</span>
              </div>
            )}

            {actor.filmography && actor.filmography.length > 0 && (
              <div className="flex items-center space-x-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-slate-400 whitespace-nowrap flex-shrink-0">{t('actor.totalMovies') || 'Số bộ phim'}:</span>
                <span className="font-semibold text-slate-100 truncate">{actor.filmography.length} {t('actor.worksCount') || 'tác phẩm'}</span>
              </div>
            )}

            {actor.debut_year && (
              <div className="flex items-center space-x-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-slate-400 whitespace-nowrap flex-shrink-0">{t('actor.activeYears') || 'Thời gian hoạt động'}:</span>
                <span className="font-semibold text-slate-100 truncate">
                  {(() => {
                    const dY = actor.deathday ? parseInt(actor.deathday.split('-')[0], 10) : null;
                    const endY = dY || new Date().getFullYear();
                    const yearsActive = Math.max(1, endY - actor.debut_year + 1);
                    return dY
                      ? (t('actor.activeSpanDeceased', { from: actor.debut_year, to: dY, years: yearsActive }) || `Từ ${actor.debut_year} đến ${dY} (${yearsActive} năm)`)
                      : (t('actor.activeSpanAlive', { from: actor.debut_year, years: yearsActive }) || `Từ ${actor.debut_year} đến nay (${yearsActive} năm)`);
                  })()}
                </span>
              </div>
            )}

            {actor.total_box_office && (
              <div className="flex items-center space-x-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-slate-400 whitespace-nowrap flex-shrink-0">{t('actor.totalBoxOffice') || 'Doanh thu đạt được'}:</span>
                <span className="font-bold text-amber-300 truncate">{actor.total_box_office}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Biography */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-100">{t('actor.biography') || 'Tiểu sử và cuộc đời'}</h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-normal whitespace-pre-line">
          {translatedBio || actor.biography_vi || actor.biography}
        </p>
      </section>

      {/* CAREER TIMELINE FEATURE */}
      <CareerTimeline filmography={actor.filmography} actorName={actor.name} />

      {/* Landmark Works List with Posters */}
      {actor.landmark_works && actor.landmark_works.length > 0 && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Film className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-extrabold text-slate-100">{t('actor.landmarkWorks') || 'Tác phẩm Nổi bật & Cột mốc Sự nghiệp'}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actor.landmark_works.map((work, idx) => {
              const cleanWorkTitle = work.replace(/\s*\(\d{4}\)\s*/, '').trim().toLowerCase();
              const matchedFilm = actor.filmography?.find((f) => {
                const cleanFilmTitle = (f.title || '').toLowerCase();
                const cleanOrigTitle = (f.original_title || '').toLowerCase();
                return (
                  (cleanFilmTitle && (cleanFilmTitle.includes(cleanWorkTitle) || cleanWorkTitle.includes(cleanFilmTitle))) ||
                  (cleanOrigTitle && (cleanOrigTitle.includes(cleanWorkTitle) || cleanWorkTitle.includes(cleanOrigTitle)))
                );
              }) || actor.filmography?.[idx];

              return (
                <div
                  key={idx}
                  onClick={() => matchedFilm && navigate(`/movie/${matchedFilm.id}`)}
                  className={`p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center space-x-3.5 shadow-md group transition ${matchedFilm ? 'hover:border-amber-400/60 cursor-pointer' : ''
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
                        #{idx + 1}
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

      {/* CineBot AI CTA Banner for Awards */}
      <section className="glass-panel-glow rounded-3xl p-5 border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-amber-950/40 text-center shadow-xl">
        <p className="text-xs sm:text-sm font-extrabold text-amber-300 flex items-center justify-center space-x-2">
          <span>{i18n.language?.startsWith('en') ? 'Want to know more information? Use CineBot AI!' : 'Muốn tìm hiểu thêm về các giải thưởng? Hãy sử dụng CineBot AI!'}</span>
        </p>
      </section>

      {/* Compare Actor Selection Modal (Identical Layout to Movie Compare Modal) */}
      {showCompareModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-slate-950 rounded-3xl border border-amber-500/40 p-6 shadow-2xl space-y-5 overflow-hidden">
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <GitCompare className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-100">{isEn ? `Compare Actor With ${actor.name}` : `So Sánh Diễn Viên Với ${actor.name}`}</h3>
                <p className="text-xs text-slate-400">{isEn ? 'Select an actor to compare career, ratings, and box office' : 'Chọn diễn viên để đối sánh sự nghiệp, đánh giá và doanh thu'}</p>
              </div>
            </div>

            {/* Search Bar Input */}
            <div className="relative">
              <input
                type="text"
                value={compareSearchQuery}
                onChange={(e) => setCompareSearchQuery(e.target.value)}
                placeholder={isEn ? 'Type actor name to compare...' : 'Nhập tên diễn viên bạn muốn so sánh...'}
                className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 focus:border-amber-400 rounded-lg text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none"
              />
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              {isSearchingActors && (
                <span className="absolute right-3.5 top-3 text-[10px] text-amber-400 font-bold animate-pulse">{isEn ? 'Searching...' : 'Đang tìm...'}</span>
              )}
            </div>

            {/* Search Results / Popular List container */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {compareSearchQuery.trim() ? (
                <div>
                  <span className="text-[10px] font-bold text-amber-400 block mb-2 uppercase tracking-wider">{isEn ? 'Actor Search Results' : 'Kết quả tìm kiếm diễn viên'}</span>
                  {compareSearchResults.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">{isEn ? 'No matching actors found' : 'Không tìm thấy diễn viên phù hợp'}</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {compareSearchResults.map((act) => (
                        <div
                          key={act.id}
                          onClick={() => {
                            setShowCompareModal(false);
                            navigate(`/compare?a=${actor.id}&b=${act.id}`);
                          }}
                          className="flex items-center space-x-3 p-2.5 rounded-2xl bg-slate-900/80 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/30 cursor-pointer transition"
                        >
                          <ImgWithFallback src={act.profile_path} type="profile" alt={act.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-100 truncate">{act.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">{act.known_for_department || (isEn ? 'Acting' : 'Diễn viên')}</p>
                          </div>
                          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-xl border border-amber-500/30">{isEn ? 'Compare' : 'So sánh'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <span className="text-[10px] font-bold text-amber-400 block mb-2 uppercase tracking-wider">{isEn ? 'Popular Actor Suggestions' : 'Diễn viên nổi tiếng gợi ý'}</span>
                  <div className="grid grid-cols-1 gap-2">
                    {popularCandidates.slice(0, 6).map((act) => (
                      <div
                        key={act.id}
                        onClick={() => {
                          setShowCompareModal(false);
                          navigate(`/compare?a=${actor.id}&b=${act.id}`);
                        }}
                        className="flex items-center space-x-3 p-2.5 rounded-2xl bg-slate-900/80 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/30 cursor-pointer transition"
                      >
                        <ImgWithFallback src={act.profile_path} type="profile" alt={act.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-100 truncate">{act.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">{act.known_for_department || (isEn ? 'Acting' : 'Diễn viên')}</p>
                        </div>
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-xl border border-amber-500/30">{isEn ? 'Compare' : 'So sánh'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
