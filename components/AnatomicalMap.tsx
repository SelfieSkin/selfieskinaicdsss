
import React, { forwardRef, useState } from 'react';
import { InjectionSite } from '../types';
import { MUSCLE_SVG_PATHS } from '../services/assets';

interface AnatomicalMapProps {
  treatmentMapImageUrl: string | null;
  isGenerating: boolean;
  sites?: InjectionSite[];
}

const AnatomicalMap = forwardRef<HTMLDivElement, AnatomicalMapProps>(({ 
  treatmentMapImageUrl,
  isGenerating,
  sites = []
}, ref) => {
  const [showMuscles, setShowMuscles] = useState(false);
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

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
          {/* SVG Muscle Overlay */}
          {showMuscles && (
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-70 animate-in fade-in duration-500">
              {Object.entries(MUSCLE_SVG_PATHS).map(([key, muscle]) => (
                <path
                  key={key}
                  d={muscle.path}
                  fill="rgba(204, 126, 109, 0.3)" // Coral color with alpha
                  stroke="rgba(204, 126, 109, 0.6)"
                  strokeWidth="0.5"
                  className="transition-all duration-300"
                  style={{
                    fill: hoveredMuscle === muscle.name ? 'rgba(204, 126, 109, 0.6)' : 'rgba(204, 126, 109, 0.3)',
                  }}
                  onMouseEnter={() => setHoveredMuscle(muscle.name)}
                  onMouseLeave={() => setHoveredMuscle(null)}
                />
              ))}
            </svg>
          )}
          {sites.map(site => (
            site.x && site.y &&
            <div 
              key={site.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${site.x}%`, top: `${site.y}%` }}
            >
              {/* Green dot remains, but without hover effects */}
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
              {/* The label is still useful for cross-referencing with the table */}
              <div 
                className="absolute top-0 left-3 whitespace-nowrap text-xs font-bold text-gray-900 opacity-80" 
                style={{textShadow: '0px 1px 3px rgba(255,255,255,0.7), 0px 1px 3px rgba(255,255,255,0.7)'}}
              >
                {site.label}
              </div>
            </div>
          ))}
            {/* Muscle Anatomy Toggle Button */}
            <button
                onClick={() => setShowMuscles(!showMuscles)}
                title="Toggle Muscle Anatomy"
                className={`no-print absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                showMuscles ? 'bg-[#cc7e6d] text-white shadow-lg' : 'bg-white/50 backdrop-blur-sm text-gray-600 hover:bg-white'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v2.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
            </button>

            {/* Hovered Muscle Name Tooltip */}
            {showMuscles && hoveredMuscle && (
                <div className="no-print absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-gray-900/80 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                {hoveredMuscle}
                </div>
            )}
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
