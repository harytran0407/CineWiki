import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilmographyItem } from '../types';
import { ImgWithFallback } from './ImgWithFallback';
import { Star, Sparkles, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface CareerTimelineProps {
  filmography: FilmographyItem[];
  actorName: string;
}

export const CareerTimeline: React.FC<CareerTimelineProps> = ({ filmography, actorName }) => {
  const navigate = useNavigate();
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const [colorMode, setColorMode] = useState<'genre' | 'rating'>('rating');
  const [selectedItem, setSelectedItem] = useState<FilmographyItem | null>(null);
  const [spacingMode, setSpacingMode] = useState<'normal' | 'compact'>('normal');

  useEffect(() => {
    setSelectedItem(null);
  }, [actorName, filmography]);

  if (!filmography || filmography.length === 0) return null;

  const sortedFilms = [...filmography].sort((a, b) => a.year - b.year);
  const minYear = sortedFilms[0]?.year || 2000;
  const maxYear = sortedFilms[sortedFilms.length - 1]?.year || 2024;

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (timelineRef.current) {
      const scrollAmount = direction === 'left' ? -450 : 450;
      timelineRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8.0) return 'from-emerald-500 to-green-400 border-emerald-300 text-emerald-100 glow-cyan';
    if (rating >= 7.0) return 'from-amber-500 to-yellow-400 border-amber-300 text-amber-100 glow-gold';
    return 'from-red-500 to-rose-400 border-rose-300 text-rose-100';
  };

  const getGenreColor = (genre: string) => {
    switch (genre.toLowerCase()) {
      case 'action':
        return 'from-amber-600 to-orange-500 border-amber-400 text-amber-100';
      case 'sci-fi':
        return 'from-cyan-600 to-blue-500 border-cyan-400 text-cyan-100';
      case 'drama':
        return 'from-purple-600 to-indigo-500 border-purple-400 text-purple-100';
      case 'horror':
        return 'from-rose-700 to-red-600 border-rose-400 text-rose-100';
      case 'war':
        return 'from-emerald-600 to-teal-500 border-emerald-400 text-emerald-100';
      default:
        return 'from-slate-600 to-slate-500 border-slate-400 text-slate-100';
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-2xl my-8">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-bold text-slate-100">Dòng Thời Gian Sự Nghiệp</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {minYear} — {maxYear} • Hiển thị trọn vẹn {filmography.length} tác phẩm điện ảnh trong sự nghiệp
          </p>
        </div>

        {/* Action Controls & Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Scroll Navigation Buttons */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1 rounded-full border border-slate-800">
            <button
              onClick={() => scrollTimeline('left')}
              title="Cuộn sang trái"
              className="p-2 hover:bg-slate-800 rounded-full text-slate-300 hover:text-amber-400 transition active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTimeline('right')}
              title="Cuộn sang phải"
              className="p-2 hover:bg-slate-800 rounded-full text-slate-300 hover:text-amber-400 transition active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Spacing density switch */}
          <button
            onClick={() => setSpacingMode(spacingMode === 'normal' ? 'compact' : 'normal')}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 transition flex items-center space-x-1"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>{spacingMode === 'normal' ? 'Mật độ: Thưa' : 'Mật độ: Dày'}</span>
          </button>

          {/* Color Mode Switch */}
          <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-full border border-slate-800">
            <button
              onClick={() => setColorMode('rating')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                colorMode === 'rating'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Theo Rating
            </button>
            <button
              onClick={() => setColorMode('genre')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                colorMode === 'genre'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Theo Thể loại
            </button>
          </div>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-slate-400 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/60">
        <span className="font-semibold text-slate-300">Chú thích màu:</span>
        {colorMode === 'rating' ? (
          <>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>Xuất sắc (&ge; 8.0)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span>Tốt (7.0 - 7.9)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span>Trung bình (&lt; 7.0)</span>
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <span>Drama</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
              <span>Sci-Fi</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span>Action</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>War</span>
            </span>
          </>
        )}
      </div>

      {/* Fully Scrollable Horizontal Timeline Canvas */}
      <div
        ref={timelineRef}
        className="relative overflow-x-auto py-12 min-h-[320px] scrollbar-thin scrollbar-thumb-amber-500/40"
      >
        <div className="relative min-w-max px-12">
          {/* Horizontal Line Axis extending 100% across the full min-w-max scroll width */}
          <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500/30 via-cyan-500/50 to-amber-500/30 -translate-y-1/2 rounded-full z-0 pointer-events-none" />

          <div className={`flex items-center ${spacingMode === 'normal' ? 'space-x-16' : 'space-x-10'} relative z-10`}>
            {sortedFilms.map((film, index) => {
              const isTop = index % 2 === 0;
              const badgeClass =
                colorMode === 'rating' ? getRatingColor(film.vote_average) : getGenreColor(film.genre);

              return (
                <div
                  key={`${film.id}-${index}`}
                  onClick={() => setSelectedItem(film)}
                  className={`relative flex flex-col items-center cursor-pointer group transition transform hover:scale-110 ${
                    isTop ? '-translate-y-12' : 'translate-y-12'
                  }`}
                >
                  {isTop ? (
                    /* Top Node Layout: Title & Year ABOVE, Circle BELOW */
                    <>
                      <div className="mb-2 text-center max-w-[130px] flex flex-col items-center">
                        <h4 className="text-xs font-bold text-slate-100 truncate w-full group-hover:text-amber-300 transition">
                          {film.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 block truncate w-full">Vai: {film.character}</span>
                        {/* Year Badge Always Visible */}
                        <span className="mt-1 inline-block text-[11px] font-extrabold text-amber-300 bg-slate-900/95 px-2.5 py-0.5 rounded-md border border-amber-500/40 shadow-md">
                          {film.year}
                        </span>
                      </div>

                      {/* Circle Bubble */}
                      <div
                        className={`w-14 h-14 rounded-full bg-gradient-to-tr ${badgeClass} border-2 flex items-center justify-center shadow-2xl transition duration-200 group-hover:ring-4 ring-amber-400/50 bg-slate-900 overflow-hidden flex-shrink-0`}
                      >
                        <ImgWithFallback
                          src={film.poster_path}
                          type="poster"
                          alt={film.title}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100"
                        />
                      </div>
                    </>
                  ) : (
                    /* Bottom Node Layout: Circle ABOVE, Year & Title BELOW */
                    <>
                      {/* Circle Bubble */}
                      <div
                        className={`w-14 h-14 rounded-full bg-gradient-to-tr ${badgeClass} border-2 flex items-center justify-center shadow-2xl transition duration-200 group-hover:ring-4 ring-amber-400/50 bg-slate-900 overflow-hidden flex-shrink-0 mb-2`}
                      >
                        <ImgWithFallback
                          src={film.poster_path}
                          type="poster"
                          alt={film.title}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100"
                        />
                      </div>

                      <div className="text-center max-w-[130px] flex flex-col items-center">
                        {/* Year Badge Always Visible */}
                        <span className="mb-1 inline-block text-[11px] font-extrabold text-amber-300 bg-slate-900/95 px-2.5 py-0.5 rounded-md border border-amber-500/40 shadow-md">
                          {film.year}
                        </span>
                        <h4 className="text-xs font-bold text-slate-100 truncate w-full group-hover:text-amber-300 transition">
                          {film.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 block truncate w-full">Vai: {film.character}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Movie Modal Preview */}
      {selectedItem && (
        <div className="mt-6 p-5 rounded-2xl bg-slate-900/95 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center space-x-4">
            <ImgWithFallback
              src={selectedItem.poster_path}
              type="poster"
              alt={selectedItem.title}
              className="w-16 h-24 object-cover rounded-xl border border-slate-700 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-base font-bold text-amber-300">{selectedItem.title}</h4>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30">
                  {selectedItem.year}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Vai diễn: <span className="font-semibold text-white">{selectedItem.character}</span>
              </p>
              <div className="flex items-center space-x-3 mt-2 text-xs text-slate-400">
                <span className="flex items-center text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" /> {selectedItem.vote_average}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">{selectedItem.genre}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/movie/${selectedItem.id}`)}
            className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl hover:from-amber-400 hover:to-amber-500 transition shadow-lg"
          >
            Xem Chi Tiết Phim &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
