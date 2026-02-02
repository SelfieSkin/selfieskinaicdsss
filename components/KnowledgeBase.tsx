
import React, { useState } from 'react';
import { KNOWLEDGE_BASE_DATA, BRAND_CORAL, BRAND_SAGE } from '../constants';
import { askClinicalQuestion } from '../services/geminiService';

const KnowledgeBase: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConsult = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResponse('');
    try {
      const result = await askClinicalQuestion(query);
      setResponse(result);
    } catch (e) {
      setResponse("Consultation unavailable. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
        if (line.startsWith('### ')) return <h3 key={index} className="text-sm font-black text-gray-800 uppercase tracking-widest mt-4 mb-2">{line.replace('### ', '')}</h3>;
        if (line.startsWith('## ')) return <h2 key={index} className="text-base font-bold text-gray-900 mt-4 mb-2">{line.replace('## ', '')}</h2>;
        if (line.startsWith('**') && line.endsWith('**')) return <strong key={index} className="block font-black text-gray-800 mt-2">{line.replace(/\*\*/g, '')}</strong>;
        if (line.trim().startsWith('- ')) return <li key={index} className="text-xs text-gray-600 ml-4 mb-1 list-disc">{line.replace('- ', '')}</li>;
        if (line.trim() === '') return <div key={index} className="h-2"></div>;
        return <p key={index} className="text-xs text-gray-600 leading-relaxed mb-1" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
    });
  };

  return (
    <div className="space-y-12 pb-12">
      {/* AI Consultant Section */}
      <section className="bg-gradient-to-br from-white to-[#fcfcf9] rounded-[2.5rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-2 bg-[#cc7e6d]"></div>
         <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
                <div>
                   <span className="text-[10px] font-black text-[#cc7e6d] uppercase tracking-[0.3em] block mb-2">Gemini Intelligence</span>
                   <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Clinical Consultant</h2>
                   <p className="text-xs font-medium text-gray-500 max-w-md">
                      Ask complex questions about injection technique, product reconstitution, anatomy, or adverse event management. 
                      Powered by <strong>Gemini 3 Pro</strong> with deep reasoning capabilities.
                   </p>
                </div>
                
                <div className="space-y-4">
                    <textarea 
                       value={query}
                       onChange={(e) => setQuery(e.target.value)}
                       placeholder="E.g., What is the recommended depth for Corrugator injection to avoid ptosis?"
                       className="w-full h-24 bg-white border border-gray-200 rounded-2xl p-4 text-xs font-bold text-gray-800 placeholder-gray-300 focus:ring-4 focus:ring-[#cc7e6d]/10 outline-none transition-all resize-none shadow-sm"
                    />
                    <div className="flex justify-end">
                       <button 
                          onClick={handleConsult}
                          disabled={isLoading || !query}
                          className="px-6 py-3 bg-[#cc7e6d] text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg hover:bg-[#b86d5e] disabled:opacity-50 transition-all flex items-center gap-2"
                       >
                          {isLoading ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Reasoning...
                              </>
                          ) : (
                              'Consult Knowledge Engine'
                          )}
                       </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[200px] bg-white rounded-2xl border border-gray-100 p-6 shadow-inner overflow-y-auto max-h-[400px] custom-scrollbar relative">
                {response ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-2">
                            <span className="text-lg">✨</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">AI Analysis</span>
                        </div>
                        <div className="space-y-1">
                            {renderMarkdown(response)}
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 pointer-events-none">
                        <span className="text-4xl mb-2 opacity-20">🧠</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Ready for Inquiry</span>
                    </div>
                )}
            </div>
         </div>
      </section>

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
