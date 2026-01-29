
import React from 'react';
import { InjectionSite } from '../types';
import { INJECTION_TECHNIQUES } from '../constants';

interface InjectionPlanTableProps {
  sites: InjectionSite[];
}

const InjectionPlanTable: React.FC<InjectionPlanTableProps> = ({ sites }) => {
  const getTechnique = (muscle: string) => {
    const key = Object.keys(INJECTION_TECHNIQUES).find(k => muscle.includes(k)) || 'Default';
    return INJECTION_TECHNIQUES[key as keyof typeof INJECTION_TECHNIQUES];
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-100 rounded-[2rem] shadow-sm">
      <table className="min-w-full">
        <thead className="bg-gray-50/50">
          <tr>
            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Site</th>
            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Muscle</th>
            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Technique</th>
            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Clinical Pearl</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sites.map((site) => {
            const technique = getTechnique(site.muscle);
            return (
              <tr key={site.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#cc7e6d]/10 text-[#cc7e6d] text-[10px] font-black w-10 h-6 flex items-center justify-center rounded-md uppercase tracking-widest">{site.label}</span>
                    <span className="text-xs font-bold text-gray-700">{site.doseOna}U</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-gray-600">{site.muscle}</td>
                <td className="px-6 py-4 text-[11px] font-medium text-gray-500">
                  {technique.depth} <br /> @ {technique.angle}
                </td>
                <td className="px-6 py-4">
                  <p className="text-[10px] text-gray-500 italic max-w-xs">"{technique.pearl}"</p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InjectionPlanTable;
