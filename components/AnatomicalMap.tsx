
import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { InjectionSite, DangerZone, PatientGender } from '../types';

interface Landmark {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface AnatomicalMapProps {
  gender: PatientGender;
  sites: InjectionSite[];
  dangerZones: DangerZone[];
  onUpdateSites: (sites: InjectionSite[]) => void;
  onUpdateDangerZones: (zones: DangerZone[]) => void;
}

const AnatomicalMap = forwardRef<HTMLDivElement, AnatomicalMapProps>(({ 
  gender,
  sites, 
  dangerZones, 
  onUpdateSites, 
  onUpdateDangerZones 
}, ref) => {
  const [siteOpacity, setSiteOpacity] = useState(1);
  const [dangerOpacity, setDangerOpacity] = useState(0.6);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [hoveredSite, setHoveredSite] = useState<InjectionSite | null>(null);
  const [imgError, setImgError] = useState(false);
  
  // Reset error state when gender changes to try loading the new image
  useEffect(() => {
    setImgError(false);
  }, [gender]);

  // Image Sources based on Gender
  // NOTE: These files must be placed in the public/ root directory of the web server
  const ANATOMY_IMAGE_FEMALE = "Female face template image.jpg";
  const ANATOMY_IMAGE_MALE = "Male face template image.jpg";
  
  // Fallback (Standard Gray's Anatomy)
  const FALLBACK_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Gray779.png/507px-Gray779.png";
  
  const targetImage = gender === PatientGender.MALE ? ANATOMY_IMAGE_MALE : ANATOMY_IMAGE_FEMALE;
  const activeImage = imgError ? FALLBACK_IMAGE : targetImage;

  const [landmarks, setLandmarks] = useState<Landmark[]>([
    { id: 'pupil-l', name: 'Left Pupil', x: 36, y: 46 },
    { id: 'pupil-r', name: 'Right Pupil', x: 64, y: 46 },
    { id: 'glabella', name: 'Glabella', x: 50, y: 42 },
    { id: 'commissure-l', name: 'Left Mouth', x: 38, y: 78 },
    { id: 'commissure-r', name: 'Right Mouth', x: 62, y: 78 },
    { id: 'menton', name: 'Chin', x: 50, y: 92 },
  ]);

  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<{ type: 'site' | 'danger' | 'landmark', id: string } | null>(null);

  const getSVGCoords = (e: MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: cursorpt.x, y: cursorpt.y };
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'site' | 'danger' | 'landmark', id: string) => {
    e.preventDefault();
    setDragging({ type, id });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const { x, y } = getSVGCoords(e);
      const boundedX = Math.max(0, Math.min(100, x));
      const boundedY = Math.max(0, Math.min(100, y));

      if (dragging.type === 'site') {
        const newSites = sites.map(s => s.id === dragging.id ? { ...s, x: boundedX, y: boundedY } : s);
        onUpdateSites(newSites);
      } else if (dragging.type === 'danger') {
        const newZones = dangerZones.map(z => z.id === dragging.id ? { ...z, x: boundedX, y: boundedY } : z);
        onUpdateDangerZones(newZones);
      } else if (dragging.type === 'landmark') {
        setLandmarks(prev => prev.map(l => l.id === dragging.id ? { ...l, x: boundedX, y: boundedY } : l));
      }
    };

    const handleMouseUp = () => setDragging(null);
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, sites, dangerZones, onUpdateSites, onUpdateDangerZones]);

  return (
    <div ref={ref} className="relative w-full aspect-[3/4] bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] flex flex-col group select-none">
      {/* Control Panel Toggle */}
      <div className="absolute top-6 right-6 z-40 no-print">
        <div className={`bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden ${isPanelOpen ? 'w-64 p-5' : 'w-auto'}`}>
          {isPanelOpen ? (
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Display Settings</span>
                <button onClick={(e) => { e.stopPropagation(); setIsPanelOpen(false); }} className="text-[9px] font-bold text-gray-300 hover:text-gray-600 px-2 py-1 uppercase tracking-wider">
                  Close
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase"><span>Injection Sites</span><span>{Math.round(siteOpacity * 100)}%</span></div>
                  <input type="range" min="0" max="1" step="0.05" value={siteOpacity} onChange={(e) => setSiteOpacity(parseFloat(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#22c55e]"/>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase"><span>Risk Zones</span><span>{Math.round(dangerOpacity * 100)}%</span></div>
                  <input type="range" min="0" max="1" step="0.05" value={dangerOpacity} onChange={(e) => setDangerOpacity(parseFloat(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#ef4444]"/>
                </div>
              </div>
            </div>
          ) : (
             <button 
                onClick={() => setIsPanelOpen(true)}
                className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-[#cc7e6d] transition-colors"
             >
                Display Settings
             </button>
          )}
        </div>
      </div>

      <div className="relative flex-1 bg-gray-50 overflow-hidden">
        {/* --- BASE ANATOMY IMAGE (Gender Specific) --- */}
        <div className="absolute inset-0 flex items-center justify-center bg-white">
           <img 
             src={activeImage}
             alt={`Facial Muscle Anatomy Reference (${gender})`}
             className="w-full h-full object-contain opacity-100 transition-opacity duration-300"
             referrerPolicy="no-referrer"
             crossOrigin="anonymous"
             onError={() => setImgError(true)}
           />
           {imgError && (
             <div className="absolute top-4 left-4 right-4 bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-lg z-50 flex gap-4 animate-in fade-in slide-in-from-top-2">
               <div className="text-2xl">⚠️</div>
               <div>
                 <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">Image Not Found</h4>
                 <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                   Unable to load: <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 border border-amber-200">{targetImage}</code>
                   <br/>
                   <span className="opacity-80">Please ensure this file exists in your project's public directory. Using standard fallback.</span>
                 </p>
               </div>
             </div>
           )}
        </div>

        {/* --- INTERACTIVE OVERLAY --- */}
        <svg ref={svgRef} viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-10" preserveAspectRatio="none">
          {/* Reference Landmarks (Draggable for calibration) */}
          {landmarks.map(l => (
            <g key={l.id} onMouseDown={(e) => handleMouseDown(e, 'landmark', l.id)} className="cursor-move group/landmark">
              <circle cx={l.x} cy={l.y} r="0.6" fill="#3b82f6" fillOpacity="0.6" />
              <circle cx={l.x} cy={l.y} r="3" fill="transparent" /> {/* Hit area */}
              <text x={l.x} y={l.y - 3} fontSize="1.5" fontWeight="700" fill="#3b82f6" textAnchor="middle" className="opacity-0 group-hover/landmark:opacity-100 transition-opacity uppercase tracking-wider select-none bg-white/80">{l.name}</text>
            </g>
          ))}
          
          {/* Danger Zones (Red) */}
          <g style={{ opacity: dangerOpacity }}>
            {dangerZones.map(zone => (
              <g key={zone.id} onMouseDown={(e) => handleMouseDown(e, 'danger', zone.id)} className="cursor-move">
                <circle cx={zone.x} cy={zone.y} r={zone.radius} fill="url(#muscleFibers)" fillOpacity="0.2" stroke="#ef4444" strokeWidth="0.3" strokeDasharray="1,1" />
                <circle cx={zone.x} cy={zone.y} r={zone.radius * 0.2} fill="#ef4444" fillOpacity="0.4" />
              </g>
            ))}
          </g>
          
          {/* Injection Sites (Green) */}
          <g style={{ opacity: siteOpacity }}>
            {sites.map(site => (
              <g key={site.id} onMouseDown={(e) => handleMouseDown(e, 'site', site.id)} onMouseEnter={() => setHoveredSite(site)} onMouseLeave={() => setHoveredSite(null)} className="cursor-move group/site">
                {/* Outer Glow */}
                <circle cx={site.x} cy={site.y} r="3" fill="#22c55e" fillOpacity="0" className="group-hover/site:fillOpacity-10 transition-all duration-300" />
                {/* Core Marker */}
                <circle cx={site.x} cy={site.y} r="1.5" fill="#22c55e" stroke="white" strokeWidth="0.5" className="shadow-lg" />
                {/* Label */}
                <text x={site.x + 2.5} y={site.y + 0.5} fontSize="2.5" fontWeight="900" fill="#111827" className="pointer-events-none select-none drop-shadow-md font-sans bg-white/50">{site.label}</text>
              </g>
            ))}
          </g>
        </svg>

        {/* HOVER TOOLTIP */}
        {hoveredSite && !dragging && (
          <div className="absolute z-50 bg-white/95 backdrop-blur-xl border border-gray-100 p-6 rounded-[2rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] w-72 pointer-events-none animate-in fade-in zoom-in-95 duration-200"
            style={{ left: `${hoveredSite.x}%`, top: `${hoveredSite.y}%`, transform: 'translate(-50%, -120%)' }}>
            <div className="flex justify-between items-center mb-3 border-b border-gray-50 pb-2">
              <span className="bg-[#22c55e] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm tracking-widest">{hoveredSite.label}</span>
              <span className="text-[#22c55e] font-black text-xs">{hoveredSite.actualDoseOna ?? hoveredSite.doseOna}U</span>
            </div>
            <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight mb-1">{hoveredSite.muscle}</h4>
            <div className="text-[10px] text-gray-500 font-medium leading-snug">
              <span className="block text-gray-300 text-[8px] uppercase tracking-wider mb-0.5">Rationale</span>
              "{hoveredSite.rationale}"
            </div>
          </div>
        )}
      </div>

      <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-between bg-white/60 backdrop-blur-sm text-[9px] font-black text-gray-400 uppercase tracking-[0.25em]">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] shadow-sm"></div>
            <span>Injection Site</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full border border-[#ef4444] border-dashed"></div>
            <span>Danger Zone</span>
          </div>
        </div>
        <span className="opacity-50">Reference: {imgError ? "Standard Gray's Anatomy" : (gender === PatientGender.MALE ? "Male Reference" : "Female Reference")}</span>
      </div>
    </div>
  );
});

export default AnatomicalMap;