import React, { useState, useEffect } from 'react';

interface ImgWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  type?: 'poster' | 'profile' | 'backdrop';
}

const DEFAULT_POSTER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f172a"/><stop offset="50%" stop-color="%231e293b"/><stop offset="100%" stop-color="%23020617"/></linearGradient></defs><rect width="300" height="450" fill="url(%23g)"/><circle cx="150" cy="210" r="35" fill="%23f59e0b" opacity="0.2"/><path d="M150 190 l15 35 h-30 z" fill="%23f59e0b" opacity="0.8"/><text x="150" y="280" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23cbd5e1" text-anchor="middle">CineWiki</text><text x="150" y="302" font-family="sans-serif" font-size="11" fill="%2364748b" text-anchor="middle">No Image</text></svg>';
const DEFAULT_PROFILE = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
const DEFAULT_BACKDROP = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80';

export const ImgWithFallback: React.FC<ImgWithFallbackProps> = ({
  src,
  fallbackSrc,
  type = 'poster',
  alt,
  className,
  ...props
}) => {
  const getDefaultFallback = () => {
    if (fallbackSrc) return fallbackSrc;
    if (type === 'profile') return DEFAULT_PROFILE;
    if (type === 'backdrop') return DEFAULT_BACKDROP;
    return DEFAULT_POSTER;
  };

  const [imgSrc, setImgSrc] = useState<string>(src || getDefaultFallback());
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || getDefaultFallback());
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getDefaultFallback());
    }
  };

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt || 'Image'}
      onError={handleError}
      className={className}
    />
  );
};
