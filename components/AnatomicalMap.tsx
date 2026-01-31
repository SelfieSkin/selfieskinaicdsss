
import React, { forwardRef, useState } from 'react';
import { InjectionSite } from '../types';
import { MUSCLE_SVG_PATHS } from '../services/assets';

interface AnatomicalMapProps {
  treatmentMapImageUrl: string | null;
  anatomicalOverlayUrl: string | null;
  isGenerating: boolean;
  isGeneratingAnatomy: boolean;
  sites?: InjectionSite[];
  assessmentNarrative?: string;
}

const AnatomicalMap = forwardRef<HTMLDivElement, AnatomicalMapProps>(({ 
  treatmentMapImageUrl,
  anatomicalOverlayUrl,
  isGenerating,
  isGeneratingAnatomy,
  sites = [],
  assessmentNarrative
}, ref) => {
  const [muscleOpacity, setMuscleOpacity] = useState(0);
  const [showWireframe, setShowWireframe] = useState(false);

  // Helper to render repeated wireframes for tryptych panels
  const renderWireframe = (offsetX: number) => (
    <g transform={`translate(${offsetX}, 0) scale(0.333, 1)`}>
      {Object.entries(MUSCLE_SVG_PATHS).map(([key, muscle]) => (
        <path 
          key={key} 
          d={muscle.path} 
          fill="#cc7e6d" 
          fillOpacity="0.1" 
          stroke="#cc7e6d" 
          strokeWidth="0.3"
        />
      ))}
    </g>
  );

  return (
    <div className="space-y-6">
      <div ref={ref} className="relative w-full aspect-[16/9] bg-gray-50 rounded-[3rem] border border-gray-100 overflow-hidden shadow-lg flex items-center justify-center select-none group">
        {isGenerating && (
          <div className="flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-[#cc7e6d] rounded-full animate-spin mb-6"></div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Generating Clinical Tryptych...</p>
          </div>
        )}
        {!isGenerating && treatmentMapImageUrl && (
          <>
            <img 
              src={treatmentMapImageUrl}
              alt="Baseline Tryptych"
              className="w-full h-full object-cover"
            />
            {anatomicalOverlayUrl && (
              <img
                src={anatomicalOverlayUrl}
                alt="Anatomical Overlay"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
                style={{ opacity: muscleOpacity }}
              />
            )}

            {showWireframe && (
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none opacity-50 mix-blend-multiply z-10" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
              >
                {renderWireframe(0)}    {/* Left Panel */}
                {renderWireframe(33.3)} {/* Center Panel */}
                {renderWireframe(66.6)} {/* Right Panel */}
              </svg>
            )}
            
            <div className="absolute inset-0 pointer-events-none flex">
              <div className="h-full w-1/3 border-r border-white/10"></div>
              <div className="h-full w-1/3 border-r border-white/10"></div>
            </div>

            {sites.map(site => (
              site.x && site.y &&
              <div 
                key={site.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 group/point z-20 pointer-events-auto cursor-help"
                style={{ left: `${site.x}%`, top: `${site.y}%` }}
                title={`${site.label}: ${site.rationale}`}
              >
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full border border-white shadow-xl group-hover/point:scale-150 transition-transform"></div>
                <div 
                  className="absolute top-0 left-3 whitespace-nowrap text-[9px] font-black text-gray-900 opacity-0 group-hover/point:opacity-100 transition-opacity bg-white/80 px-1 rounded pointer-events-none" 
                  style={{textShadow: '0px 1px 2px rgba(255,255,255,0.9)'}}
                >
                  {site.label}
                </div>
              </div>
            ))}

              {/* Map Controls */}
              <div className="no-print absolute top-4 right-4 z-40 flex items-center gap-4 pointer-events-auto">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowWireframe(!showWireframe); }}
                  className={`p-2 rounded-full backdrop-blur-sm transition-all shadow-lg border cursor-pointer hover:scale-105 active:scale-95 ${showWireframe ? 'bg-[#cc7e6d] text-white border-white/20' : 'bg-white/80 text-gray-600 border-white/20'}`}
                  title="Toggle Wireframe Guide"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>

                <div className="p-2 bg-white/80 backdrop-blur-sm rounded-full flex items-center gap-2 shadow-lg border border-white/20 pointer-events-auto">
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
                        onChange={(e) => { e.stopPropagation(); setMuscleOpacity(parseFloat(e.target.value)); }}
                        className="w-24 cursor-pointer accent-[#cc7e6d]"
                        disabled={isGeneratingAnatomy || !anatomicalOverlayUrl}
                    />
                </div>
              </div>
              
              <div className="absolute bottom-4 left-0 w-full flex px-8 pointer-events-none opacity-40">
                <span className="w-1/3 text-[9px] font-black uppercase text-gray-600 tracking-widest text-center">Left Oblique</span>
                <span className="w-1/3 text-[9px] font-black uppercase text-gray-600 tracking-widest text-center">Anterior Baseline</span>
                <span className="w-1/3 text-[9px] font-black uppercase text-gray-600 tracking-widest text-center">Right Oblique</span>
              </div>
          </>
        )}
      </div>

      {assessmentNarrative && !isGenerating && (
        <div className="bg-[#f8f8f6] p-6 rounded-3xl border-l-4 border-[#cc7e6d]">
          <h4 className="text-[10px] font-black text-[#cc7e6d] uppercase tracking-widest mb-2">Clinical Assessment Narrative</h4>
          <p className="text-sm text-gray-700 font-medium leading-relaxed italic">
            "{assessmentNarrative}"
          </p>
        </div>
      )}
    </div>
  );
});

export default AnatomicalMap;
