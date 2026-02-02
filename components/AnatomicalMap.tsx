
import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { InjectionSite, PatientGender } from '../types';

interface AnatomicalMapProps {
  treatmentMapImageUrl: string | null;
  anatomicalLayerImageUrl: string | null;
  isGenerating: boolean;
  sites?: InjectionSite[];
  assessmentNarrative?: string;
  gender?: PatientGender;
  onSiteMove?: (id: string, x: number, y: number) => void;
}

const AnatomicalMap = forwardRef<HTMLDivElement, AnatomicalMapProps>(({ 
  treatmentMapImageUrl,
  anatomicalLayerImageUrl,
  isGenerating,
  sites = [],
  assessmentNarrative,
  gender = PatientGender.FEMALE,
  onSiteMove
}, ref) => {
  const [showMuscles, setShowMuscles] = useState(false);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [draggingSiteId, setDraggingSiteId] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal ref with forwarded ref
  useEffect(() => {
    if (typeof ref === 'function') {
      ref(containerRef.current);
    } else if (ref) {
      ref.current = containerRef.current;
    }
  }, [ref]);

  // -- Drag Logic for Injection Points --
  const handleMouseDown = (e: React.MouseEvent, siteId: string) => {
    if (!isRecalibrating) return;
    e.stopPropagation();
    setDraggingSiteId(siteId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingSiteId || !containerRef.current || !onSiteMove) return;
    e.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Clamp to boundaries
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    onSiteMove(draggingSiteId, clampedX, clampedY);
  };

  const handleMouseUp = () => {
    setDraggingSiteId(null);
  };

  // Add global mouse up listener for smooth dragging outside div
  useEffect(() => {
    if (draggingSiteId) {
        window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingSiteId]);

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex justify-between items-end px-2 no-print">
         <div className="flex gap-4">
             <button 
                onClick={() => setShowMuscles(false)}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all border ${!showMuscles ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}
             >
                Patient Photo
             </button>
             <button 
                onClick={() => setShowMuscles(true)}
                disabled={isGenerating || !anatomicalLayerImageUrl}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all border ${showMuscles ? 'bg-[#cc7e6d] text-white border-[#cc7e6d]' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400 disabled:opacity-50'}`}
             >
                Muscle Layer
             </button>
         </div>
         <button 
            onClick={() => {
                setIsRecalibrating(!isRecalibrating);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all shadow-sm ${isRecalibrating ? 'bg-green-100 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900'}`}
         >
            <span className={`w-2 h-2 rounded-full ${isRecalibrating ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
            <span className="text-[10px] font-black uppercase tracking-widest">
                {isRecalibrating ? 'Drag Injection Points' : 'Recalibrate Map'}
            </span>
         </button>
      </div>

      <div 
        ref={containerRef} 
        onMouseMove={handleMouseMove}
        className={`relative w-full aspect-[16/9] bg-gray-50 rounded-[3rem] border border-gray-100 overflow-hidden shadow-lg flex items-center justify-center select-none group ${isRecalibrating ? 'cursor-crosshair' : 'cursor-default'}`}
      >
        {isGenerating && (
          <div className="flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-[#cc7e6d] rounded-full animate-spin mb-6"></div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Processing Clinical Tryptych...</p>
          </div>
        )}
        
        {!isGenerating && treatmentMapImageUrl && (
          <>
            {/* Layer 1: Base Patient Photo */}
            <img 
               src={treatmentMapImageUrl}
               alt="Baseline Tryptych"
               className="w-full h-full object-cover pointer-events-none absolute inset-0 transition-opacity duration-700"
            />

            {/* Layer 2: Anatomical Muscle Overlay (AI Generated) */}
            {anatomicalLayerImageUrl && (
                <img 
                    src={anatomicalLayerImageUrl}
                    alt="Anatomical Overlay"
                    className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${showMuscles ? 'opacity-100' : 'opacity-0'}`}
                />
            )}
            
            {/* Tryptych Dividers (Fixed) */}
            <div className="absolute inset-0 pointer-events-none flex opacity-30">
              <div className="h-full w-1/3 border-r-2 border-white shadow-[2px_0_5px_rgba(0,0,0,0.1)]"></div>
              <div className="h-full w-1/3 border-r-2 border-white shadow-[2px_0_5px_rgba(0,0,0,0.1)]"></div>
            </div>

            {/* Injection Points (Draggable) */}
            {sites.map(site => (
              site.x && site.y &&
              <div 
                key={site.id}
                onMouseDown={(e) => handleMouseDown(e, site.id)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group/point z-20 ${isRecalibrating ? 'cursor-move' : 'pointer-events-auto cursor-help'}`}
                style={{ left: `${site.x}%`, top: `${site.y}%` }}
              >
                {/* Visual Point */}
                <div className={`w-3 h-3 rounded-full border-2 border-white shadow-xl transition-transform ${isRecalibrating ? 'bg-blue-500 scale-125' : 'bg-green-500 group-hover/point:scale-150'}`}></div>
                
                {/* Label (Hidden during drag) */}
                {!isRecalibrating && (
                    <div 
                      className="absolute top-0 left-4 whitespace-nowrap text-[9px] font-black text-gray-900 opacity-0 group-hover/point:opacity-100 transition-opacity bg-white/90 backdrop-blur px-2 py-1 rounded-md pointer-events-none shadow-sm z-30" 
                    >
                      {site.label} <span className="text-gray-400 font-medium">| {site.muscle}</span>
                    </div>
                )}
              </div>
            ))}
            
            {/* Panel Labels */}
            <div className="absolute bottom-4 left-0 w-full flex px-8 pointer-events-none opacity-50 mix-blend-difference text-white">
                <span className="w-1/3 text-[9px] font-black uppercase tracking-widest text-center">Left Profile</span>
                <span className="w-1/3 text-[9px] font-black uppercase tracking-widest text-center">Anterior</span>
                <span className="w-1/3 text-[9px] font-black uppercase tracking-widest text-center">Right Profile</span>
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
