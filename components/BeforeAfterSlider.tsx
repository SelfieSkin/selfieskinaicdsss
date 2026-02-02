
import React, { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  aspectRatio?: string;
  isGenerating?: boolean;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ 
  beforeImage, 
  afterImage,
  aspectRatio = '16/9',
  isGenerating = false
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
      setSliderPosition(percent);
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  // Global event listeners for smooth dragging outside the container
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
        if (isDragging) handleMove(e.clientX);
    };
    const handleGlobalTouchMove = (e: TouchEvent) => {
        if (isDragging) handleMove(e.touches[0].clientX);
    };
    const handleGlobalTouchEnd = () => setIsDragging(false);

    if (isDragging) {
        window.addEventListener('mouseup', handleGlobalMouseUp);
        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('touchend', handleGlobalTouchEnd);
        window.addEventListener('touchmove', handleGlobalTouchMove);
    }
    return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('touchend', handleGlobalTouchEnd);
        window.removeEventListener('touchmove', handleGlobalTouchMove);
    };
  }, [isDragging]);

  return (
    <div 
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-[3rem] shadow-lg border border-gray-100 select-none group cursor-ew-resize bg-gray-50"
        style={{ aspectRatio }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
    >
      {/* Loading State */}
      {isGenerating && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
             <div className="w-12 h-12 border-4 border-gray-200 border-t-[#cc7e6d] rounded-full animate-spin mb-4"></div>
             <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Running Clinical Simulation...</p>
          </div>
      )}

      {/* Before Image (Background) - Presentation */}
      {beforeImage && (
        <img 
            src={beforeImage} 
            alt="Baseline Presentation" 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
        />
      )}
      
      {/* Label Before */}
      <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/40 shadow-sm z-10 pointer-events-none">
         <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Baseline</span>
         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Presentation</span>
      </div>

      {/* After Image (Foreground - Clipped) - Outcome */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {afterImage && (
            <img 
                src={afterImage} 
                alt="Projected Outcome" 
                className="absolute inset-0 w-full h-full object-cover" 
            />
        )}
        {/* Label After */}
         <div className="absolute bottom-6 right-6 bg-[#cc7e6d]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-sm z-10">
            <span className="text-[10px] font-black text-white uppercase tracking-widest block">Projected</span>
            <span className="text-[9px] font-bold text-white/80 uppercase tracking-tight">Outcome</span>
         </div>
         {/* Tryptych Dividers (Outcome Layer) */}
         <div className="absolute inset-0 flex opacity-30">
            <div className="h-full w-1/3 border-r border-white/50"></div>
            <div className="h-full w-1/3 border-r border-white/50"></div>
         </div>
      </div>

      {/* Slider Handle */}
      {!isGenerating && beforeImage && afterImage && (
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_15px_rgba(0,0,0,0.2)] flex items-center justify-center"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-10 h-10 bg-white rounded-full shadow-xl border-2 border-gray-50 flex items-center justify-center transform transition-transform group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#cc7e6d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)" />
                </svg>
            </div>
          </div>
      )}
    </div>
  );
};

export default BeforeAfterSlider;
