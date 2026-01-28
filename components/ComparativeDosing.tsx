
import React from 'react';
import { Step4Data } from '../types';

interface ComparativeDosingProps {
  data: Step4Data;
}

const ComparativeDosing: React.FC<ComparativeDosingProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Comparative Dosing Engine</h4>
            <span className="text-[9px] font-black text-[#cc7e6d] bg-[#cc7e6d]/10 px-2 py-1 rounded-md uppercase tracking-wider">Guide Only</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-center">
            <thead>
              <tr className="bg-gray-50/20 text-[9px] font-black text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-4 py-4 text-left w-1/5">Region</th>
                <th className="px-4 py-4 w-1/5 bg-blue-50/30 text-blue-800">Ona (1:1)<br/><span className="text-[8px] text-gray-400 opacity-70">Baseline</span></th>
                <th className="px-4 py-4 w-1/5">Abo (2.5:1)<br/><span className="text-[8px] text-gray-400 opacity-70">Option A</span></th>
                <th className="px-4 py-4 w-1/5 bg-gray-50/50">Abo (3:1)<br/><span className="text-[8px] text-gray-400 opacity-70">Option B</span></th>
                <th className="px-4 py-4 w-1/5 text-purple-800">Daxxify<br/><span className="text-[8px] text-gray-400 opacity-70">Peptide</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.dosingRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-4 py-4 text-left">
                    <span className="block text-xs font-black text-gray-800 uppercase tracking-tight">{row.region}</span>
                    <span className="block text-[9px] text-gray-400 italic mt-0.5 leading-tight max-w-[120px]">{row.notes}</span>
                  </td>
                  <td className="px-4 py-4 bg-blue-50/10">
                    <span className="text-sm font-black text-gray-900">{row.onaDose} U</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-bold text-gray-600">{row.aboDose25} U</span>
                  </td>
                  <td className="px-4 py-4 bg-gray-50/30">
                    <span className="text-xs font-bold text-gray-600">{row.aboDose30} U</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-bold text-purple-900">{row.daxDose}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Dosing Assumptions</h5>
              <ul className="space-y-2">
                  {data.dosingAssumptions.map((note, i) => (
                      <li key={i} className="flex gap-2 text-[10px] font-medium text-gray-600">
                          <span className="text-[#cc7e6d] font-bold">•</span>
                          {note}
                      </li>
                  ))}
              </ul>
          </div>
          <div className="flex-1 bg-amber-50/50 rounded-2xl p-6 border border-amber-100/50 flex flex-col justify-center">
               <div className="flex items-center gap-2 mb-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div>
                   <h5 className="text-[9px] font-black text-amber-500 uppercase tracking-widest">AIMS Protocol Disclaimer</h5>
               </div>
               <p className="text-[10px] text-amber-800/70 font-medium italic leading-relaxed">
                   "{data.aimsDisclaimer}"
               </p>
          </div>
      </div>
    </div>
  );
};

export default ComparativeDosing;
