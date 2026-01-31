
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
            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-24">Site</th>
            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-32">Muscle</th>
            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Technique</th>
            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Clinical Pearl</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sites.map((site) => {
            const technique = getTechnique(site.muscle);
            return (
              <tr key={site.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-4 align-top">
                  <div className="flex flex-col gap-1">
                    <div className="bg-[#cc7e6d]/10 text-[#cc7e6d] text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest text-center w-fit">
                        {site.label}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 ml-1">{site.doseOna}U</span>
                  </div>
                </td>
                <td className="px-6 py-4 align-top">
                    <span className="text-xs font-bold text-gray-700 block">{site.muscle}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{site.region}</span>
                </td>
                <td className="px-6 py-4 align-top">
                   <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-gray-600">{technique.depth}</span>
                      <span className="text-[10px] font-black text-gray-400 uppercase bg-gray-100 px-1.5 py-0.5 rounded w-fit">@{technique.angle}</span>
                   </div>
                </td>
                <td className="px-6 py-4 align-top">
                  <p className="text-[11px] text-gray-500 italic leading-relaxed">"{technique.pearl}"</p>
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
