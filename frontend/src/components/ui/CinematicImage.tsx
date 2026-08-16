import React, { useState } from 'react';

interface CinematicImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: string;
  overlayGradient?: boolean;
  className?: string;
}

export const CinematicImage: React.FC<CinematicImageProps> = ({
  src,
  alt,
  aspectRatio = 'aspect-video',
  overlayGradient = true,
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-1000 ${
          isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-md'
        }`}
        {...props}
      />
      {overlayGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default CinematicImage;
