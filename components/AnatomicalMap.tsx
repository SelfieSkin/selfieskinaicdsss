
import React, { forwardRef } from 'react';
import { InjectionSite } from '../types';

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
  isGenerating,
  sites = [],
  assessmentNarrative
}, ref) => {
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
