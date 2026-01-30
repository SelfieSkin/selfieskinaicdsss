
import React, { useState } from 'react';
import { AnalysisResult, FeedbackData, ToxinBrand } from '../types';
import { AIMS_DOSING_NOTE, BRAND_CORAL, BRAND_SAGE } from '../constants';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    patientId: string;
    brand: ToxinBrand;
    result: AnalysisResult;
  };
  onSave: (feedback: FeedbackData) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, data, onSave }) => {
  const [rationale, setRationale] = useState('');
  const [safetyIssue, setSafetyIssue] = useState(false);
  const [safetyIssueDetails, setSafetyIssueDetails] = useState('');
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [satisfaction, setSatisfaction] = useState('Satisfied');

  const { result, brand } = data;
  const isDysport = brand === ToxinBrand.DYSPORT;
  const isDaxxify = brand === ToxinBrand.DAXXIFY;
  const conversionFactor = isDysport ? 3 : (isDaxxify ? 2 : 1);
  const brandUnit = brand.split(' ')[0] + ' Units';

  // Auto-calculate deviations
  const deviations = result.sites.filter(s => s.actualDoseOna !== undefined && s.actualDoseOna !== s.doseOna);
  const modified = deviations.length > 0;
  
  const regionsModified = Array.from(new Set(deviations.map(d => d.region)));
  const totalRec = result.sites.reduce((acc, s) => acc + s.doseOna, 0) * conversionFactor;
  const totalAct = result.sites.reduce((acc, s) => acc + (s.actualDoseOna ?? s.doseOna), 0) * conversionFactor;

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      modified,
      regionsModified,
      aiRecommendationSummary: `Total Recommended: ${totalRec} ${brandUnit}`,
      providerModificationSummary: modified ? `Modified Total: ${totalAct} ${brandUnit}` : 'Followed Protocol',
      rationale: rationale || (modified ? "Clinical judgment applied." : "No deviation from AI."),
      safetyIssue,
      safetyIssueDetails: safetyIssue ? safetyIssueDetails : undefined,
      finalDose: totalAct,
      outcomeNotes,
      patientSatisfaction: satisfaction as any
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-[#fcfcf9]">
          <div>
            <span className="text-[10px] font-black text-[#cc7e6d] uppercase tracking-[0.3em] block mb-1">Step 6: Log & Archive</span>
            <h2 className="text-xl font-bold text-gray-900">Feedback & Deviation Log</h2>
          </div>
          <button onClick={onClose} className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">
            Cancel
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
          {/* 1. Deviation Question */}
          <div className={`p-6 rounded-2xl border transition-colors ${modified ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'}`}>
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight mb-2">
              Did you modify the AI-recommended dose?
            </h3>
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-black ${modified ? 'text-orange-500' : 'text-green-500'}`}>
                {modified ? 'YES' : 'NO'}
              </span>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {modified ? `(${deviations.length} Sites Changed)` : '(Protocol Followed)'}
              </span>
            </div>
            {modified && (
              <div className="mt-4 pt-4 border-t border-orange-200/50">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest block mb-1">Affected Regions</span>
                      <p className="text-xs font-bold text-gray-700">{regionsModified.join(', ')}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest block mb-1">Net Dosage Change</span>
                      <p className="text-xs font-bold text-gray-700">
                        {totalAct - totalRec > 0 ? '+' : ''}{totalAct - totalRec} {brandUnit}
                      </p>
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* 2. Structured Log Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Case ID</label>
              <div className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-700">{data.patientId}</div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Toxin Brand</label>
               <div className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-700">{brand.split(' ')[0]}</div>
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Clinical Rationale for Modification</label>
             <textarea 
               value={rationale} 
               onChange={(e) => setRationale(e.target.value)}
               placeholder={modified ? "E.g., Increased glabella dose due to strong muscle mass..." : "Standard protocol followed."}
               className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-[#cc7e6d]/20 focus:border-[#cc7e6d] outline-none h-20 transition-all"
             />
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
             <div className="flex items-center gap-3">
               <input 
                 type="checkbox" 
                 id="safetyIssue" 
                 checked={safetyIssue} 
                 onChange={(e) => setSafetyIssue(e.target.checked)} 
                 className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500 cursor-pointer"
               />
               <label htmlFor="safetyIssue" className="text-xs font-bold text-gray-700 cursor-pointer">Safety Issue Encountered? (Adverse Event)</label>
             </div>
             
             {safetyIssue && (
               <div className="animate-in fade-in slide-in-from-top-2">
                 <input 
                   type="text" 
                   value={safetyIssueDetails} 
                   onChange={(e) => setSafetyIssueDetails(e.target.value)} 
                   placeholder="Specify (e.g., Hematoma, Ptosis...)" 
                   className="w-full bg-red-50 border border-red-200 text-red-800 placeholder-red-300 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-red-500/20 outline-none"
                 />
               </div>
             )}
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Outcome Notes (Optional)</label>
             <textarea 
               value={outcomeNotes} 
               onChange={(e) => setOutcomeNotes(e.target.value)}
               placeholder="Immediate reaction, patient feedback..."
               className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-[#cc7e6d]/20 focus:border-[#cc7e6d] outline-none h-16 transition-all"
             />
          </div>

          {/* Footer Note */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
             <span className="text-xl">💡</span>
             <p className="text-[10px] text-amber-800 font-medium leading-relaxed italic">
               "{AIMS_DOSING_NOTE}"
             </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-[#fcfcf9]">
           <button 
             onClick={handleSave}
             className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 hover:shadow-2xl hover:bg-[#86987a]"
             style={{ backgroundColor: BRAND_SAGE }}
           >
             Confirm & Archive Record
           </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
