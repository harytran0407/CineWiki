import React, { useState, useEffect } from 'react';

interface ImgWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  type?: 'poster' | 'profile' | 'backdrop';
}

const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80';
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
