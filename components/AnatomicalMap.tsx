
import React, { forwardRef, useState } from 'react';
import { InjectionSite } from '../types';
import { TRIPTYCH_ANATOMY } from '../services/assets';

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
                className="absolute inset-0 w-full h-full pointer-events-none z-10" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
              >
                 {Object.values(TRIPTYCH_ANATOMY).flat().map((muscle, idx) => (
                    <path 
                      key={idx} 
                      d={muscle.path} 
                      fill={muscle.fill || 'none'} 
                      fillOpacity={muscle.fillOpacity || 0} 
                      stroke={muscle.stroke || '#cc7e6d'} 
                      strokeWidth={muscle.strokeWidth || 0.1}
                      className="mix-blend-multiply"
                    />
                  ))}
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

              {/* Enhanced Map Controls */}
              <div className="no-print absolute top-4 right-4 z-40 flex items-center gap-3 pointer-events-auto">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowWireframe(!showWireframe); }}
                  className={`p-3 rounded-2xl backdrop-blur-md transition-all shadow-lg border cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center ${showWireframe ? 'bg-[#cc7e6d] text-white border-[#cc7e6d]' : 'bg-white/80 text-gray-500 border-white/40'}`}
                  title="Toggle Wireframe Guide"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>

                <div className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-2xl flex items-center gap-3 shadow-lg border border-white/40 pointer-events-auto">
                  <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Muscle Layer</span>
                  <div className="h-4 border-l border-gray-300 mx-1"></div>
                  {isGeneratingAnatomy ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                  ) : (
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
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
                  )}
                </div>
              </div>
              
              <div className="absolute bottom-4 left-0 w-full flex px-8 pointer-events-none opacity-40">
                <span className="w-1/3 text-[9px] font-black uppercase text-gray-600 tracking-widest text-center">Left Profile</span>
                <span className="w-1/3 text-[9px] font-black uppercase text-gray-600 tracking-widest text-center">Anterior Baseline</span>
                <span className="w-1/3 text-[9px] font-black uppercase text-gray-600 tracking-widest text-center">Right Profile</span>
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
