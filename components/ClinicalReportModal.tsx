
import React from 'react';
import { BRAND_CORAL, BRAND_SAGE, BRAND_CREAM } from '../constants';

interface ClinicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportMarkdown: string;
  mapImageDataUrl: string | null;
}

const ClinicalReportModal: React.FC<ClinicalReportModalProps> = ({ isOpen, onClose, reportMarkdown, mapImageDataUrl }) => {
  if (!isOpen) return null;

  // Markdown renderer respecting new branding (Sage headers, Cream background)
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Branding Header Detection
      if (line.startsWith('# ')) {
        return (
          <div key={index} className="flex flex-col items-center border-b-2 border-[#B2AC88] pb-6 mb-8 mt-4">
             <span className="text-5xl font-serif tracking-tight text-[#B2AC88]">Selfie</span>
             <div className="w-24 h-1 my-2 bg-[#E2725B]"></div>
             <span className="text-5xl font-serif tracking-tight text-[#B2AC88]">Skin</span>
             <h1 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Clinical Report Pack</h1>
          </div>
        );
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-black text-[#B2AC88] mt-8 mb-3 uppercase tracking-widest border-l-4 border-[#E2725B] pl-3">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3 tracking-tight">{line.replace('## ', '')}</h2>;
      }
      if (line.trim().startsWith('- **ALERT:**')) {
        const content = line.replace('- **ALERT:**', '');
        return (
          <div key={index} className="bg-[#E2725B]/10 border border-[#E2725B]/30 p-4 rounded-xl my-3 flex gap-3 items-start">
             <span className="text-[#E2725B] font-black text-xs uppercase tracking-widest mt-1">Safety Alert</span>
             <p className="text-sm text-gray-800 font-medium leading-relaxed">{content}</p>
          </div>
        );
      }
      if (line.trim().startsWith('- ')) {
        const content = line.replace('- ', '');
        const bolded = content.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-gray-900">$1</span>');
        return <li key={index} className="text-sm text-gray-600 ml-4 mb-2 list-disc pl-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: bolded }} />;
      }
      // Table rendering (Basic)
      if (line.trim().startsWith('|')) {
         // Check if it's a separator line
         if (line.includes('---')) return null;
         const cells = line.split('|').filter(c => c.trim() !== '');
         const isHeader = index > 0 && text.split('\n')[index-1].startsWith('###'); // Heuristic for header row
         
         return (
           <div key={index} className={`grid grid-cols-${cells.length} gap-4 py-2 border-b border-[#B2AC88]/20 ${line.includes('**') ? 'bg-[#B2AC88]/10' : ''}`}>
              {cells.map((cell, i) => (
                <span key={i} className="text-xs text-gray-700 font-medium whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: cell.replace(/\*\*(.*?)\*\*/g, '<span class="font-black text-gray-900">$1</span>')}}></span>
              ))}
           </div>
         );
      }
      
      const content = line.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-gray-900">$1</span>');
      if (content.trim() === '') return <div key={index} className="h-2"></div>;
      
      return <p key={index} className="text-sm text-gray-600 leading-relaxed mb-1" dangerouslySetInnerHTML={{ __html: content }} />;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in print:p-0 print:bg-white print:block print:static">
      <style>{`
        @media print {
          @page { margin: 20mm; }
          body { background-color: white; }
          .print-footer { position: fixed; bottom: 0; left: 0; right: 0; text-align: center; font-size: 9px; color: #999; padding: 10px; background: white; border-top: 1px solid #eee; }
        }
      `}</style>
      
      <div className="bg-[#F2E5CF] rounded-[3rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col print:shadow-none print:max-h-none print:w-full print:rounded-none">
        
        {/* Modal Header - Hidden on Print */}
        <div className="p-8 border-b border-[#B2AC88]/20 flex justify-between items-center bg-[#F2E5CF] no-print">
          <div>
            <span className="text-[10px] font-black text-[#E2725B] uppercase tracking-[0.3em] block mb-1">Step 5 Output</span>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Clinical Report Pack
            </h2>
          </div>
          <button onClick={onClose} className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors px-4 py-2 border border-gray-300 rounded-full hover:bg-white">
            Close
          </button>
        </div>

        <div className="p-12 overflow-y-auto custom-scrollbar bg-[#F2E5CF] print:p-0 print:overflow-visible">
          <div className="bg-white p-12 shadow-sm rounded-3xl print:shadow-none print:p-0 print:rounded-none">
             {renderMarkdown(reportMarkdown)}
             {mapImageDataUrl && (
              <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-100 break-inside-avoid">
                <h3 className="text-lg font-black text-[#B2AC88] mb-4 uppercase tracking-widest border-l-4 border-[#E2725B] pl-3">
                  Visual Injection Map
                </h3>
                <div className="border-4 border-gray-50 rounded-3xl overflow-hidden shadow-md mt-4">
                  <img src={mapImageDataUrl} alt="Visual injection map" className="w-full h-auto" />
                </div>
                <p className="text-center text-[9px] text-gray-400 mt-3 uppercase tracking-widest">
                  Rendered from live session data for patient record
                </p>
              </div>
             )}
          </div>
        </div>

        {/* Modal Footer - Hidden on Print */}
        <div className="p-6 border-t border-[#B2AC88]/20 bg-[#F2E5CF] flex justify-between items-center no-print">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SelfieSkin AI-CDSS v2.0</span>
          <button 
            onClick={() => window.print()}
            className="px-8 py-4 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 hover:shadow-2xl hover:bg-gray-800 bg-[#333]"
          >
            Print to PDF
          </button>
        </div>
        
        {/* PDF Footer - Visible ONLY on Print */}
        <div className="print-footer hidden print:block">
           AI-generated clinical decision support tool. Final dosing and injection decisions remain the responsibility of the licensed provider.
        </div>
      </div>
    </div>
  );
};

export default ClinicalReportModal;