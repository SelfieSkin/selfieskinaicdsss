
import React, { useState, useRef } from 'react';
import { SimCase, SimInjectionPoint, SimZone } from '../types';
import { generateSimulationCaseVisual } from '../services/geminiService';

// --- CASE DATA DEFINITION (Level 1 - Frontal) ---
const LEVEL_1_CASE: SimCase = {
  id: 'lvl1_spock',
  title: "Level 1: Asymmetric Brow Elevation",
  level: 1,
  patientDescription: "38-year-old male. Reports 'overly surprised' appearance on the left side. No prior treatment history.",
  view: 'frontal',
  findings: {
    static: ["Left lateral brow elevation at rest", "Preserved central brow position"],
    dynamic: ["Dominant recruitment of left lateral frontalis", "Compensatory engagement during relaxation"],
    primary: ["Left-sided lateral frontalis overactivity", "Secondary bilateral glabellar contribution"]
  },
  idealPointCount: { min: 1, max: 3 },
  maxScore: 100,
  zones: [
    {
      id: 'target_left_lat_front',
      name: 'Left Lateral Frontalis',
      type: 'target',
      // TARGET: High Lateral Forehead (Patient Left / Image Right)
      poly: "60,20 90,20 85,35 60,35", 
      scoreImpact: 40,
      feedback: "Correct identification of hyperactive lateral fibers."
    },
    {
      id: 'avoid_right_lat_front',
      name: 'Right Lateral Frontalis',
      type: 'avoid',
      poly: "10,20 40,20 40,35 15,35", 
      scoreImpact: -15,
      feedback: "Unnecessary treatment of normal side may cause asymmetry."
    },
    {
      id: 'avoid_central_front',
      name: 'Central Frontalis',
      type: 'avoid',
      poly: "40,20 60,20 60,38 40,38",
      scoreImpact: -20,
      feedback: "Risk of brow heaviness due to central overtreatment."
    },
    {
      id: 'avoid_low_zone',
      name: 'Orbital Rim / Low Frontalis',
      type: 'avoid',
      poly: "0,40 100,40 100,55 0,55",
      scoreImpact: -30,
      feedback: "CRITICAL SAFETY: Injection too close to orbital rim. High Ptosis Risk."
    }
  ]
};

// --- CASE DATA DEFINITION (Level 2 - Profile) ---
// Coordinates for Profile View (Patient Facing Right).
// Ear ~15%, Eye ~65%.
// Target: 1.5cm Temporal to Canthus (~15% width behind eye).
const LEVEL_2_CASE: SimCase = {
  id: 'lvl2_crows',
  title: "Level 2: Lateral Canthal Rhytids",
  level: 2,
  patientDescription: "45-year-old female. Concerns about deep 'fan-like' lines around eyes when smiling. Desires natural softening.",
  view: 'profile',
  findings: {
    static: ["Deep static rhytids extending to cheek", "Thin skin in periocular region"],
    dynamic: ["Strong Orbicularis Oculi recruitment", "Involvement of zygomaticus (cheek) in smile"],
    primary: ["Hyperactive Orbicularis Oculi (Lateral)", "Risk of lip drop if injected too low/medial"]
  },
  idealPointCount: { min: 3, max: 5 },
  maxScore: 100,
  zones: [
    {
      id: 'target_c1',
      name: 'C1: Central Orbicularis',
      type: 'target',
      // 1.5cm Temporal to Canthus (X~50-55, Y~46)
      poly: "48,43 56,43 56,49 48,49",
      scoreImpact: 30,
      feedback: "Excellent. 1.5cm temporal to canthus ensures safety."
    },
    {
      id: 'target_c2',
      name: 'C2: Superior Orbicularis',
      type: 'target',
      // Superior, angled 30 deg medially (X~50, Y~38)
      poly: "45,35 53,35 53,41 45,41",
      scoreImpact: 20,
      feedback: "Good superior placement treating upward radiating lines."
    },
    {
      id: 'target_c3',
      name: 'C3: Inferior Orbicularis',
      type: 'target',
      // Inferior, angled 30 deg medially (X~50, Y~52)
      poly: "45,51 53,51 53,58 45,58",
      scoreImpact: 20,
      feedback: "Correct inferior placement. Careful of zygomaticus."
    },
    {
      id: 'danger_medial',
      name: 'Orbital Rim / Medial Zone',
      type: 'avoid',
      // Anterior to canthus (X > 60)
      poly: "60,35 75,35 75,60 60,60",
      scoreImpact: -40,
      feedback: "DANGER: Injection medial to orbital rim. High risk of Diplopia/Ptosis."
    },
    {
      id: 'danger_inferior',
      name: 'Zygomaticus Major Origin',
      type: 'avoid',
      // Low and medial (Cheek area)
      poly: "50,62 70,62 70,75 50,75",
      scoreImpact: -30,
      feedback: "AVOID: Too low/medial. Risk of Zygomaticus/Lip Drop."
    }
  ]
};

const CASES = [LEVEL_1_CASE, LEVEL_2_CASE];

const SimulationEngine: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [gameState, setGameState] = useState<'briefing' | 'loading' | 'active' | 'feedback'>('briefing');
  const [points, setPoints] = useState<SimInjectionPoint[]>([]);
  const [simulationImage, setSimulationImage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentCase = CASES[currentLevelIdx];

  // --- ACTIONS ---

  const handleInitialize = async () => {
    setGameState('loading');
    try {
        const img = await generateSimulationCaseVisual(
            currentCase.patientDescription, 
            currentCase.findings.primary,
            currentCase.view
        );
        setSimulationImage(img);
        setPoints([]);
        setGameState('active');
    } catch (error) {
        console.error(error);
        alert("Failed to generate clinical case. Please check API settings.");
        setGameState('briefing');
    }
  };

  const handleNextLevel = () => {
      if (currentLevelIdx < CASES.length - 1) {
          setCurrentLevelIdx(prev => prev + 1);
          setGameState('briefing');
          setSimulationImage(null);
          setPoints([]);
      }
  };

  const handlePrevLevel = () => {
      if (currentLevelIdx > 0) {
          setCurrentLevelIdx(prev => prev - 1);
          setGameState('briefing');
          setSimulationImage(null);
          setPoints([]);
      }
  };

  // Helper function to check if point is in polygon
  const isPointInPoly = (p: {x: number, y: number}, polyString: string) => {
    const vertices = polyString.split(' ').map(pair => {
        const [vx, vy] = pair.split(',').map(Number);
        return { x: vx, y: vy };
    });
    
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i].x, yi = vertices[i].y;
        const xj = vertices[j].x, yj = vertices[j].y;
        
        const intersect = ((yi > p.y) !== (yj > p.y))
            && (p.x < (xj - xi) * (p.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (gameState !== 'active') return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Determine immediate hit feedback
    let hitType: 'target' | 'avoid' | 'danger' | 'neutral' = 'neutral';

    for (const zone of currentCase.zones) {
        if (isPointInPoly({x, y}, zone.poly)) {
            if (zone.type === 'target') {
                hitType = 'target';
                break; // Prioritize target matches
            } else if (zone.scoreImpact <= -30) {
                 hitType = 'danger';
            } else if (zone.type === 'avoid') {
                 hitType = 'avoid';
            }
        }
    }

    // Add point
    const newPoint: SimInjectionPoint = {
      id: Date.now().toString(),
      x,
      y,
      hitType
    };
    setPoints([...points, newPoint]);
  };

  const removePoint = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (gameState !== 'active') return;
    setPoints(points.filter(p => p.id !== id));
  };

  const calculateScore = () => {
    let score = 0;
    const feedbackLog: string[] = [];
    const zoneHits: Record<string, number> = {};

    points.forEach(p => {
        currentCase.zones.forEach(z => {
            if (isPointInPoly(p, z.poly)) {
                if (!zoneHits[z.id]) zoneHits[z.id] = 0;
                zoneHits[z.id]++;
                
                // Add specific zone feedback if not already added
                if (zoneHits[z.id] === 1) { // Log once per zone
                    if (z.scoreImpact > 0) feedbackLog.push(`✅ ${z.feedback}`);
                    else if (z.scoreImpact <= -30) feedbackLog.push(`⛔ ${z.feedback}`);
                    else feedbackLog.push(`⚠️ ${z.feedback}`);
                }
            }
        });
    });

    // Sum Score Impacts
    Object.keys(zoneHits).forEach(zoneId => {
        const zone = currentCase.zones.find(z => z.id === zoneId);
        if (zone) {
            score += zone.scoreImpact * zoneHits[zoneId];
        }
    });

    // Point Count Logic (Efficiency)
    if (points.length >= currentCase.idealPointCount.min && points.length <= currentCase.idealPointCount.max) {
        score += 20; // Efficiency bonus
        feedbackLog.push(`✅ Optimal number of injection points used (${points.length}).`);
    } else if (points.length > currentCase.idealPointCount.max) {
        score -= 10;
        feedbackLog.push("ℹ️ Over-injection: Too many sites selected.");
    } else if (points.length < currentCase.idealPointCount.min) {
        feedbackLog.push("ℹ️ Under-treatment: Insufficient coverage.");
    }

    // Base Participation
    if (points.length > 0) score += 10;

    // Cap Score
    score = Math.max(0, Math.min(100, score));

    return { score, feedbackLog };
  };

  const results = gameState === 'feedback' ? calculateScore() : null;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-gray-100 pb-4">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <span className="text-[10px] font-black text-[#cc7e6d] uppercase tracking-widest">
               Level {currentCase.level} / {CASES.length}
             </span>
             {currentLevelIdx > 0 && (
                <button onClick={handlePrevLevel} className="text-[9px] text-gray-400 hover:text-gray-600 underline">Previous</button>
             )}
           </div>
           <h2 className="text-2xl font-black text-gray-800">{currentCase.title}</h2>
        </div>
        <div className="text-right">
           <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${gameState === 'active' ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-gray-100 text-gray-500'}`}>
              {gameState === 'briefing' ? 'Case Briefing' : gameState === 'loading' ? 'Generating Case...' : gameState === 'active' ? 'Simulation Active' : 'Performance Review'}
           </span>
        </div>
      </div>

      {/* GAME AREA */}
      <div className="flex flex-col lg:flex-row gap-8 min-h-[500px]">
        
        {/* LEFT PANEL: CONTEXT OR RESULTS */}
        <div className="flex-1 space-y-6">
            {gameState === 'briefing' && (
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                   <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Patient Profile</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{currentCase.patientDescription}</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="bg-gray-50 p-4 rounded-2xl">
                           <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Static Findings</h4>
                           <ul className="list-disc list-inside space-y-1">
                               {currentCase.findings.static.map((f, i) => <li key={i} className="text-xs font-bold text-gray-700">{f}</li>)}
                           </ul>
                       </div>
                       <div className="bg-blue-50 p-4 rounded-2xl">
                           <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Dynamic Findings</h4>
                           <ul className="list-disc list-inside space-y-1">
                               {currentCase.findings.dynamic.map((f, i) => <li key={i} className="text-xs font-bold text-blue-800">{f}</li>)}
                           </ul>
                       </div>
                   </div>
                   <div className="pt-4">
                       <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Mission Objective</h3>
                       <p className="text-xs text-gray-500 mb-6">Identify indications and place injection points to correct rhytids while minimizing risk. {currentCase.view === 'profile' ? 'View is lateral profile.' : 'View is frontal.'}</p>
                       <button 
                         onClick={handleInitialize}
                         className="w-full py-4 bg-[#cc7e6d] text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:bg-[#b86d5e] transition-all"
                       >
                           Initialize Simulation
                       </button>
                   </div>
                </div>
            )}

            {gameState === 'loading' && (
                 <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col items-center justify-center text-center">
                     <div className="w-16 h-16 border-[6px] border-gray-100 border-t-[#cc7e6d] rounded-full animate-spin mb-6"></div>
                     <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Generating Patient Simulation</h3>
                     <p className="text-xs text-gray-400 mt-2">Creating medically realistic {currentCase.view} facial anatomy...</p>
                 </div>
            )}

            {gameState === 'active' && (
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col justify-between">
                   <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-2xl border-l-4 border-[#cc7e6d]">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Indications</h4>
                            <p className="text-sm font-bold text-gray-800">{currentCase.findings.primary[0]}</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-dashed border-gray-200 text-center">
                            <span className="text-4xl block mb-2">💉</span>
                            <p className="text-xs font-bold text-gray-500">Tap/Click on the face map to place injection points.</p>
                            <p className="text-[10px] text-gray-400 mt-1">Target: {currentCase.title}</p>
                        </div>
                   </div>
                   
                   <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <span>Syringes Used</span>
                            <span>{points.length} / {currentCase.idealPointCount.max} Max</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-[#cc7e6d] h-2 rounded-full transition-all duration-300" style={{ width: `${(points.length/currentCase.idealPointCount.max)*100}%`}}></div>
                        </div>
                        <button 
                            onClick={() => setGameState('feedback')}
                            disabled={points.length === 0}
                            className="w-full mt-4 py-4 bg-gray-900 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Assess Treatment Plan
                        </button>
                   </div>
                </div>
            )}

            {gameState === 'feedback' && results && (
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 animate-in slide-in-from-left-4">
                    <div className="text-center border-b border-gray-100 pb-6">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Clinical Performance Score</span>
                        <div className="text-6xl font-black text-gray-900 mb-2">{results.score}<span className="text-2xl text-gray-300">/100</span></div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${results.score >= 85 ? 'bg-green-100 text-green-700' : results.score >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {results.score >= 85 ? 'Clinically Sound' : results.score >= 70 ? 'Acceptable with Caution' : 'Unsafe / Inappropriate'}
                        </span>
                    </div>

                    <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Feedback Log</h4>
                        {results.feedbackLog.map((log, i) => (
                            <div key={i} className="text-xs font-medium text-gray-700 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                {log}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={() => { setPoints([]); setGameState('briefing'); }}
                            className="flex-1 py-3 bg-gray-100 text-gray-500 font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all text-[10px]"
                        >
                            Retry Level
                        </button>
                        {currentLevelIdx < CASES.length - 1 && results.score >= 70 && (
                            <button 
                                onClick={handleNextLevel}
                                className="flex-1 py-3 bg-[#cc7e6d] text-white font-black uppercase tracking-widest rounded-2xl hover:bg-[#b86d5e] transition-all text-[10px]"
                            >
                                Next Level
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* RIGHT PANEL: INTERACTIVE FACE */}
        <div className="flex-1 lg:flex-[1.5] relative">
             <div 
                ref={containerRef}
                className="relative w-full aspect-[4/3] bg-gray-100 rounded-[3rem] border border-gray-100 shadow-inner overflow-hidden select-none cursor-crosshair group" 
                onClick={handleCanvasClick}
             >
                 {simulationImage ? (
                     <img 
                        src={simulationImage} 
                        alt="Clinical Simulation" 
                        className="w-full h-full object-cover pointer-events-none"
                     />
                 ) : (
                    // Placeholder if no image yet
                    <div className="w-full h-full flex items-center justify-center opacity-10">
                         <span className="text-6xl">👤</span>
                    </div>
                 )}

                 {/* Hit Zones Overlay (Visible only in Feedback) */}
                 {gameState === 'feedback' && (
                     <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                         {currentCase.zones.map(zone => (
                             <polygon 
                                 key={zone.id}
                                 points={zone.poly}
                                 fill={zone.type === 'target' ? '#4ade80' : zone.type === 'avoid' ? '#f87171' : 'gray'}
                                 fillOpacity="0.4"
                                 stroke={zone.type === 'target' ? '#16a34a' : '#dc2626'}
                                 strokeWidth="0.5"
                             />
                         ))}
                     </svg>
                 )}

                 {/* Rendering Points */}
                 {points.map(p => {
                    let bgColor = 'bg-[#cc7e6d]';
                    let icon = 'X';
                    let label = null;

                    if (p.hitType === 'target') {
                        bgColor = 'bg-green-500';
                        icon = '✓';
                        label = 'TARGET';
                    } else if (p.hitType === 'danger') {
                        bgColor = 'bg-red-600 animate-pulse';
                        icon = '!';
                        label = 'DANGER';
                    } else if (p.hitType === 'avoid') {
                        bgColor = 'bg-orange-400';
                        icon = '-';
                        label = 'AVOID';
                    }

                    return (
                        <div 
                          key={p.id}
                          onClick={(e) => removePoint(e, p.id)}
                          className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-transform hover:scale-125 group/point"
                          style={{ left: `${p.x}%`, top: `${p.y}%` }}
                        >
                            <div className={`w-full h-full rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] text-white font-bold ${bgColor}`}>
                                {icon}
                            </div>
                            
                            {/* Immediate Feedback Label */}
                            {label && (
                                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest whitespace-nowrap shadow-sm pointer-events-none
                                    ${p.hitType === 'target' ? 'bg-green-100 text-green-800' : p.hitType === 'danger' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}
                                `}>
                                    {label}
                                </div>
                            )}
                        </div>
                    );
                 })}
                 
                 {/* Instructions Overlay if empty */}
                 {gameState === 'active' && points.length === 0 && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                         <span className="text-3xl font-black text-gray-300 uppercase tracking-[0.5em] rotate-12">Click to Inject</span>
                     </div>
                 )}
             </div>
             
             {/* Legend */}
             {gameState === 'feedback' && (
                 <div className="flex gap-4 justify-center mt-4">
                     <div className="flex items-center gap-2">
                         <div className="w-3 h-3 bg-green-400 rounded-sm opacity-50"></div>
                         <span className="text-[10px] font-bold text-gray-500 uppercase">Target Zone</span>
                     </div>
                     <div className="flex items-center gap-2">
                         <div className="w-3 h-3 bg-red-400 rounded-sm opacity-50"></div>
                         <span className="text-[10px] font-bold text-gray-500 uppercase">Danger/Avoid</span>
                     </div>
                 </div>
             )}
        </div>

      </div>
    </div>
  );
};

export default SimulationEngine;
