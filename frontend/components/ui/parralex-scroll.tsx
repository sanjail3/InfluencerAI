import React, { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

interface VideoData {
  url: string;
  name: string;
  description: string;
  id: string | number;
}

interface ParallaxScrollProps {
  videos: VideoData[];
  className?: string;
  onError?: (error: Error) => void;
  onSelect?: (video: VideoData) => void;
  selectedId?: string | number;
}

const VideoCard = React.memo(({ 
  url, 
  name, 
  description, 
  id,
  isSelected,
  onSelect,
  onError 
}: VideoData & { 
  isSelected: boolean;
  onSelect: (video: VideoData) => void;
  onError: (error: Error) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    videoRef.current?.play().catch(error => onError(error));
  }, [onError]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <motion.div 
      className={`w-full rounded-lg overflow-hidden cursor-pointer mb-4 ${
        isSelected ? 'ring-2 ring-purple-500' : ''
      }`}
      onClick={() => onSelect({ url, name, description, id })}
      initial={{ scale: 1 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <div className="aspect-[9/16] relative max-w-sm mx-auto">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={url}
          muted
          loop
          playsInline
          onLoadedData={() => setIsLoading(false)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-purple-900/20 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-purple-500 border-purple-200 rounded-full animate-spin" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-lg font-bold text-white">{name}</h3>
          <p className="text-sm text-white/80">{description}</p>
        </div>
      </div>
    </motion.div>
  );
});

VideoCard.displayName = 'VideoCard';

const ParallaxColumn = React.memo(({ 
  videos,
  translateY,
  onError,
  onSelect,
  selectedId
}: {
  videos: VideoData[];
  translateY: MotionValue;
  onError: (error: Error) => void;
  onSelect: (video: VideoData) => void;
  selectedId?: string | number;
}) => (
  <motion.div style={{ y: translateY }} className="px-2 max-w-sm mx-auto">
    {videos.map((video) => (
      <VideoCard
        key={video.id}
        {...video}
        isSelected={video.id === selectedId}
        onSelect={onSelect}
        onError={onError}
      />
    ))}
  </motion.div>
));

ParallaxColumn.displayName = 'ParallaxColumn';

export const ParallaxScroll: React.FC<ParallaxScrollProps> = ({
  videos,
  className = '',
  onError = console.error,
  onSelect,
  selectedId
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const midpoint = Math.ceil(videos.length / 2);
  const firstColumn = videos.slice(0, midpoint);
  const secondColumn = videos.slice(midpoint);

  return (
    <div
      ref={gridRef}
      className={`h-[85vh] overflow-y-auto scrollbar-hide w-full grid grid-cols-2 gap-x-4 ${className}`}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <ParallaxColumn 
        videos={firstColumn} 
        translateY={translateFirst} 
        onError={onError}
        onSelect={onSelect || (() => {})}
        selectedId={selectedId}
      />
      <ParallaxColumn 
        videos={secondColumn} 
        translateY={translateSecond} 
        onError={onError}
        onSelect={onSelect || (() => {})}
        selectedId={selectedId}
      />
    </div>
  );
};

export default ParallaxScroll;