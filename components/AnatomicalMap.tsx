
import React, { forwardRef, useState } from 'react';
import { InjectionSite } from '../types';

interface AnatomicalMapProps {
  treatmentMapImageUrl: string | null;
  anatomicalOverlayUrl: string | null;
  isGenerating: boolean;
  isGeneratingAnatomy: boolean;
  sites?: InjectionSite[];
}

const AnatomicalMap = forwardRef<HTMLDivElement, AnatomicalMapProps>(({ 
  treatmentMapImageUrl,
  anatomicalOverlayUrl,
  isGenerating,
  isGeneratingAnatomy,
  sites = []
}, ref) => {
  const [muscleOpacity, setMuscleOpacity] = useState(0);

  return (
    <div ref={ref} className="relative w-full aspect-[3/4] bg-gray-50 rounded-[3rem] border border-gray-100 overflow-hidden shadow-lg flex items-center justify-center select-none">
      {isGenerating && (
        <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#cc7e6d] rounded-full animate-spin mb-6"></div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Generating Visual Map...</p>
            <p className="text-[10px] text-gray-300 mt-2">This may take a moment</p>
        </div>
      )}
      {!isGenerating && treatmentMapImageUrl && (
        <>
          <img 
            src={treatmentMapImageUrl}
            alt="AI-Generated Visual Treatment Plan"
            className="w-full h-full object-cover"
          />
          {/* Anatomical Muscle Overlay Image */}
          {anatomicalOverlayUrl && (
            <img
              src={anatomicalOverlayUrl}
              alt="Anatomical Muscle Overlay"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
              style={{ opacity: muscleOpacity }}
            />
          )}
          
          {sites.map(site => (
            site.x && site.y &&
            <div 
              key={site.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${site.x}%`, top: `${site.y}%` }}
            >
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
              <div 
                className="absolute top-0 left-3 whitespace-nowrap text-xs font-bold text-gray-900 opacity-80" 
                style={{textShadow: '0px 1px 3px rgba(255,255,255,0.7), 0px 1px 3px rgba(255,255,255,0.7)'}}
              >
                {site.label}
              </div>
            </div>
          ))}

            {/* Muscle Anatomy Slider Control */}
            <div className="no-print absolute top-4 right-4 z-10 p-2 bg-white/60 backdrop-blur-sm rounded-full flex items-center gap-2 shadow-lg border border-white/20">
              {isGeneratingAnatomy ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-1"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v2.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
              )}
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={muscleOpacity}
                    onChange={(e) => setMuscleOpacity(parseFloat(e.target.value))}
                    className="w-24"
                    title="Adjust muscle layer opacity"
                    disabled={isGeneratingAnatomy || !anatomicalOverlayUrl}
                />
            </div>
        </>
      )}
       {!isGenerating && !treatmentMapImageUrl && (
        <div className="text-center p-8">
           <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
          <p className="mt-4 text-xs font-black text-gray-300 uppercase tracking-[0.3em]">Visual Map will appear here</p>
           <p className="text-[10px] text-gray-400 mt-2">Run clinical analysis to generate the plan.</p>
        </div>
      )}
    </div>
  );
});

export default AnatomicalMap;
