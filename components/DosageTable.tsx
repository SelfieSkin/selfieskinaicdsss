
import React from 'react';
import { AnalysisResult, ToxinBrand } from '../types';

interface DosageTableProps {
  result: AnalysisResult;
  selectedBrand: ToxinBrand;
  onUpdateSiteDose: (siteId: string, doseInBrandUnits: number) => void;
}

const DosageTable: React.FC<DosageTableProps> = ({ result, selectedBrand, onUpdateSiteDose }) => {
  const isDysport = selectedBrand === ToxinBrand.DYSPORT;
  const isDaxxify = selectedBrand === ToxinBrand.DAXXIFY;
  
  // Ratios relative to OnabotulinumtoxinA (Ona)
  const conversionFactor = isDysport ? 3 : (isDaxxify ? 2 : 1);
  const brandLabel = isDysport ? 'Abo' : (isDaxxify ? 'Dax' : 'Ona');

  const totalRecOna = result.sites.reduce((sum, s) => sum + s.doseOna, 0);
  const totalActOna = result.sites.reduce((sum, s) => sum + (s.actualDoseOna ?? s.doseOna), 0);

  return (
    <div className="space-y-6">
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
                      {/* New Interactive Stepper */}
                      <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 no-print w-fit">
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
                          step="0.5" // Allow manual entry of fractions
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
      <div className="flex items-start gap-4 p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">[Clinical Note]</span>
        <p className="text-[10px] text-gray-400 italic font-medium leading-relaxed">
          Pharmacological Note: Ratios are fixed at 1:1 for Xeomin/Botox, 1:3 for Dysport, and 1:2 for Daxxify based on consensus clinical publications.
          Deviations from AI recommendations should be clinically justified in the treatment notes.
        </p>
      </div>
    </div>
  );
};

export default DosageTable;