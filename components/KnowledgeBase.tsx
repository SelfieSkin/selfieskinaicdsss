
import React from 'react';
import { KNOWLEDGE_BASE_DATA } from '../constants';

const KnowledgeBase: React.FC = () => {
  return (
    <div className="space-y-12 pb-12">
      <section>
        <div className="border-b border-gray-100 pb-8 mb-8">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">Clinical Reference Guide</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Evidence-Based BoNT Administration</p>
        </div>
        
        <div className="space-y-10">
          {KNOWLEDGE_BASE_DATA.treatmentAreas.map(area => (
            <div key={area.area}>
              <h3 className={`text-sm font-black text-gray-800 uppercase tracking-[0.3em] mb-6 border-l-4 ${area.color} pl-4`}>{area.area}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {area.muscles.map(muscle => (
                  <div key={muscle.name} className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 flex flex-col">
                    <h4 className="font-black text-gray-900 tracking-tight text-lg">{muscle.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">{muscle.description}</p>
                    <div className="space-y-3 pt-4 border-t border-gray-100/80">
                      {muscle.indications.map(indication => (
                         <div key={indication.title}>
                           <h5 className="text-xs font-bold text-gray-800">{indication.title}</h5>
                           <p className="text-[11px] text-gray-500 leading-relaxed">{indication.detail}</p>
                         </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-[0.3em] mb-6 border-l-4 border-red-500 pl-4">Safety & Pharmacology</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6">
                <h4 className="font-bold text-red-800 mb-4 text-lg">Contraindications</h4>
                 <div className="space-y-4">
                  {KNOWLEDGE_BASE_DATA.contraindications.map((item, idx) => (
                    <div key={idx}>
                      <h5 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h5>
                      <p className="text-gray-600 text-xs leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                 </div>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6">
                <h4 className="font-bold text-amber-800 mb-4 text-lg">Common Adverse Events</h4>
                <div className="space-y-4">
                  {KNOWLEDGE_BASE_DATA.adverseEvents.map((item, idx) => (
                    <div key={idx}>
                      <h5 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h5>
                      <p className="text-gray-600 text-xs leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                 </div>
              </div>
          </div>
      </section>

    </div>
  );
};

export default KnowledgeBase;
