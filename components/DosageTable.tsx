
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
              const actualBrandUnits = (site.actualDoseOna ?? site.doseOna) * conversionFactor;
              const hasDeviation = site.actualDoseOna !== undefined && site.actualDoseOna !== site.doseOna;

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
                      <input 
                        type="number" 
                        value={actualBrandUnits}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          // Convert brand units back to Ona for storage
                          onUpdateSiteDose(site.id, val / conversionFactor);
                        }}
                        className="w-20 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-900 focus:ring-2 focus:ring-[#cc7e6d]/20 focus:border-[#cc7e6d] outline-none transition-all no-print"
                      />
                      <span className="hidden print:inline text-sm font-black text-gray-900">{actualBrandUnits} U</span>
                      {hasDeviation && (
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse no-print" title="Clinical deviation detected"></span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[11px] font-bold text-gray-300">
                    {site.actualDoseOna ?? site.doseOna} Ona-Eq
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
