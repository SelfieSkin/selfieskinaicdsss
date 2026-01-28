
import React, { useState } from 'react';
import { TreatmentSession } from '../types';

interface TreatmentHistoryProps {
  sessions: TreatmentSession[];
}

const TreatmentHistory: React.FC<TreatmentHistoryProps> = ({ sessions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'patientId'>('date');

  const filteredSessions = sessions
    .filter(s => s.patientId.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return a.patientId.localeCompare(b.patientId);
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-8">
        <div>
           <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">Treatment Log</h2>
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Secure Local Archive</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <input
              type="text"
              placeholder="SEARCH PATIENT ID..."
              className="block w-full px-5 py-3 border border-gray-200 rounded-xl text-xs font-bold bg-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#cc7e6d]/20 focus:border-[#cc7e6d] transition-all uppercase tracking-wider"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="border-gray-200 rounded-xl text-xs font-bold py-3 px-4 focus:ring-[#cc7e6d] focus:border-[#cc7e6d] uppercase tracking-wider text-gray-600 cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'patientId')}
          >
            <option value="date">SORT: DATE</option>
            <option value="patientId">SORT: ID</option>
          </select>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
          <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No records found</p>
        </div>
      ) : (
        <div className="grid gap-4">
            {filteredSessions.map((session) => (
              <div key={session.id} className="group bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Patient Identifier</span>
                        <p className="text-lg font-black text-[#97a98c]">{session.patientId}</p>
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Brand</span>
                            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-gray-50 text-gray-600 border border-gray-100">
                                {session.brand.split(' ')[0]}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Date</span>
                            <span className="text-xs font-bold text-gray-600">{new Date(session.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        {session.feedback.modified && (
                           <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 inline-block">
                             <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest block mb-1">Deviation Log</span>
                             <p className="text-xs text-orange-800 font-bold">{session.feedback.providerModificationSummary || "Modifications recorded"}</p>
                           </div>
                        )}
                        <div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Clinical Rationale</span>
                            <p className="text-xs text-gray-600 font-medium italic leading-relaxed">
                                "{session.feedback.rationale || "No rationale recorded."}"
                            </p>
                        </div>
                        {session.feedback.safetyIssue && (
                           <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                             <span className="text-[9px] font-black text-red-400 uppercase tracking-widest block mb-1">Adverse Event Reported</span>
                             <p className="text-xs text-red-800 font-bold">{session.feedback.safetyIssueDetails}</p>
                           </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-between items-end gap-2">
                         <div className="text-right">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Total Dosage</span>
                            <span className="text-lg font-black text-gray-800">{session.feedback.finalDose || session.analysis.totalDoseOna} <span className="text-xs text-gray-400">UNITS</span></span>
                         </div>
                         <div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block text-right mb-1">Outcome Notes</span>
                            <p className="text-xs text-gray-500 font-medium text-right max-w-xs">
                                {session.feedback.outcomeNotes || "None"}
                            </p>
                         </div>
                    </div>
                  </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default TreatmentHistory;
