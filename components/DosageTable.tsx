
import React, { useState, useEffect } from 'react';
import { AnalysisResult, ToxinBrand } from '../types';

interface DosageTableProps {
  result: AnalysisResult;
  selectedBrand: ToxinBrand;
  patientId: string;
  onUpdateSiteDose: (siteId: string, doseInBrandUnits: number) => void;
  onUpdateClinicalNote: (note: string) => void;
  onUpdateSignature: (sig: string) => void;
}

const DosageTable: React.FC<DosageTableProps> = ({ result, selectedBrand, patientId, onUpdateSiteDose, onUpdateClinicalNote, onUpdateSignature }) => {
  const [rationale, setRationale] = useState("");
  const [clinicalNote, setClinicalNote] = useState("");
  const [signature, setSignature] = useState("");

  const isDysport = selectedBrand === ToxinBrand.DYSPORT;
  const isDaxxify = selectedBrand === ToxinBrand.DAXXIFY;
  
  // Ratios relative to OnabotulinumtoxinA (Ona)
  const conversionFactor = isDysport ? 3 : (isDaxxify ? 2 : 1);
  const brandLabel = isDysport ? 'Abo' : (isDaxxify ? 'Dax' : 'Ona');

  const totalRecOna = result.sites.reduce((sum, s) => sum + s.doseOna, 0);
  const totalActOna = result.sites.reduce((sum, s) => sum + (s.actualDoseOna ?? s.doseOna), 0);

  // Auto-generate clinical note when inputs change
  useEffect(() => {
    const deviations = result.sites.filter(s => s.actualDoseOna !== undefined && s.actualDoseOna !== s.doseOna);
    const hasModifications = deviations.length > 0;
    
    let noteBuilder = `Patient ID: ${patientId}. `;
    noteBuilder += `${result.assessmentNarrative} `;
    
    if (hasModifications) {
        noteBuilder += `\n\nPLAN MODIFICATIONS: Total dosage adjusted from ${totalRecOna * conversionFactor}U to ${totalActOna * conversionFactor}U (${brandLabel}). `;
        noteBuilder += `Specific adjustments: ${deviations.map(d => `${d.label} (${(d.actualDoseOna||0) * conversionFactor}U)`).join(', ')}. `;
    } else {
        noteBuilder += `\n\nPLAN: Standard AI-recommended protocol followed (${totalRecOna * conversionFactor}U ${brandLabel}). `;
    }

    if (rationale) {
        noteBuilder += `\n\nRATIONALE: ${rationale}`;
    }

    setClinicalNote(noteBuilder);
    onUpdateClinicalNote(noteBuilder);
  }, [result, rationale, patientId, totalRecOna, totalActOna, brandLabel, conversionFactor]);

  // Handle signature updates
  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSignature(e.target.value);
      onUpdateSignature(e.target.value);
  }

  return (
    <div className="space-y-8">
      {/* Dosage Table */}
      <div className="overflow-hidden bg-white border border-gray-100 rounded-[2rem] shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Site ID</th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Rec ({brandLabel} U)</th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-[#cc7e6d] uppercase tracking-widest">Administered ({brandLabel} U)</th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Equivalent (Ona-Eq)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {result.sites.map((site) => {
              const recBrandUnits = site.doseOna * conversionFactor;
              const actualOnaUnits = site.actualDoseOna ?? site.doseOna;
              const actualBrandUnits = actualOnaUnits * conversionFactor;
              const hasDeviation = site.actualDoseOna !== undefined && site.actualDoseOna !== site.doseOna;

              const handleDoseChange = (newBrandValue: number) => {
                const newOnaValue = Math.max(0, newBrandValue) / conversionFactor;
                onUpdateSiteDose(site.id, newOnaValue);
              };

              return (
                <tr key={site.id} className={`group transition-colors ${hasDeviation ? 'bg-orange-50/20' : 'hover:bg-gray-50/30'}`}>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black text-gray-900 tracking-tight">{site.label}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{site.muscle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs font-bold text-gray-400">
                    {recBrandUnits} U
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 no-print w-fit shadow-sm">
                        <button 
                          onClick={() => handleDoseChange(actualBrandUnits - 1)}
                          className="w-7 h-7 flex items-center justify-center text-lg font-bold text-gray-400 bg-gray-50 rounded-lg hover:bg-gray-200 transition-colors active:bg-gray-300 disabled:opacity-50"
                          disabled={actualBrandUnits <= 0}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          value={actualBrandUnits}
                          onChange={(e) => handleDoseChange(parseFloat(e.target.value) || 0)}
                          className="w-16 text-center text-sm font-black text-gray-900 bg-transparent outline-none border-none focus:ring-0 p-0"
                          step="0.5"
                        />
                        <button 
                           onClick={() => handleDoseChange(actualBrandUnits + 1)}
                           className="w-7 h-7 flex items-center justify-center text-lg font-bold text-gray-400 bg-gray-50 rounded-lg hover:bg-gray-200 transition-colors active:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                      
                      <span className="hidden print:inline text-sm font-black text-gray-900">{actualBrandUnits} U</span>
                      {hasDeviation && (
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse no-print" title="Clinical deviation detected"></span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[11px] font-bold text-gray-300">
                    {actualOnaUnits} Ona-Eq
                  </td>
                </tr>
              );
            })}
            <tr className="bg-[#fdfdfb] border-t-2 border-gray-50">
              <td className="px-6 py-8 text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Clinical Total</td>
              <td className="px-6 py-8 text-sm font-bold text-gray-400">{totalRecOna * conversionFactor} U</td>
              <td className="px-6 py-8">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-[#cc7e6d] leading-none">
                    {totalActOna * conversionFactor} <span className="text-xs uppercase ml-1">{brandLabel} Units</span>
                  </span>
                  {totalActOna !== totalRecOna && (
                    <span className={`text-[10px] font-black uppercase tracking-widest mt-2 px-2 py-0.5 rounded-full w-fit ${totalActOna > totalRecOna ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                      {totalActOna > totalRecOna ? 'Hyper-Correction' : 'Hypo-Correction'} ({Math.abs(Math.round((totalActOna - totalRecOna) * conversionFactor))} U)
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-8 text-sm font-black text-gray-400">
                {totalActOna} Ona-Eq
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Rationale and Notes Section - SINGLE COLUMN */}
      <div className="space-y-8">
          {/* Rationale */}
          <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Clinical Rationale for Adjustments</label>
              <textarea 
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="Enter clinical reasoning for any dose modifications here..."
                  className="w-full h-32 bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-[#cc7e6d]/10 outline-none transition-all shadow-sm"
              />
          </div>
          
          {/* Auto-Generated Note */}
          <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Auto-Generated Clinical Note</label>
                  <span className="text-[9px] font-bold text-[#cc7e6d] bg-[#cc7e6d]/10 px-2 py-0.5 rounded-full">LIVE PREVIEW</span>
              </div>
              <div className="w-full h-40 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs font-mono text-gray-600 overflow-y-auto leading-relaxed whitespace-pre-wrap shadow-inner">
                  {clinicalNote}
              </div>
          </div>
      </div>

      {/* Signature Line */}
      <div className="pt-8 border-t border-gray-100 flex justify-end">
          <div className="w-full md:w-1/3 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Clinician Signature</label>
              <input 
                  type="text" 
                  value={signature}
                  onChange={handleSignatureChange}
                  placeholder="Sign with Full Name, Credential"
                  className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-lg font-handwriting font-bold text-gray-800 focus:border-[#cc7e6d] outline-none transition-colors placeholder-gray-300"
                  style={{ fontFamily: 'cursive' }} 
              />
          </div>
      </div>
    </div>
  );
};

export default DosageTable;
