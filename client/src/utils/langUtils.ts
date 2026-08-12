import i18n from '../i18n';

export const getActiveLangParam = (): string => {
  return i18n.language?.startsWith('en') ? 'en-US' : 'vi-VN';
};

export const getMovieTitle = (
  movie?: { title?: string; original_title?: string; title_vi?: string } | null,
  lang?: string
): string => {
  if (!movie) return '';
  const activeLang = lang || i18n.language || 'vi';
  if (activeLang.startsWith('en')) {
    return movie.title || movie.original_title || '';
  }
  return movie.title_vi || movie.title || movie.original_title || '';
};
