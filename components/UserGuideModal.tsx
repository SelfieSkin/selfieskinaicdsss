
import React from 'react';
import { BRAND_CORAL, BRAND_SAGE } from '../constants';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span style={{ color: BRAND_SAGE }}>SelfieSkin</span> Protocol
          </h2>
          <button onClick={onClose} className="text-[10px] font-black text-gray-300 hover:text-gray-900 uppercase tracking-widest transition-colors">
            Close
          </button>
        </div>

        <div className="p-10 overflow-y-auto custom-scrollbar space-y-10">
          <section>
            <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-3 uppercase tracking-widest">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: BRAND_CORAL }}>1</span>
              Clinical Assessment
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 pl-9">
              Begin by entering a unique <strong>Patient Identifier</strong>. This ensures all logs are searchable in your history. Select the specific <strong>Botulinum Toxin Brand</strong> you intend to use; the system will automatically calculate dose conversions (Ona-Equivalent).
            </p>
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 ml-9">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Video Upload Guide</h4>
              <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4 font-medium">
                <li>Capture a clear 10-15 second video of the patient's face.</li>
                <li>Ask the patient to perform movements: resting, maximum frown (glabella), maximum eyebrow raise (frontalis), and big smile (periocular).</li>
                <li>Ensure stable lighting and a neutral background for optimal AI dynamic analysis.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-3 uppercase tracking-widest">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: BRAND_CORAL }}>2</span>
              Analysis Interpretation
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed pl-9">
              Once processing is complete, you will receive:
            </p>
            <ul className="mt-4 space-y-4 pl-9">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-1.5 h-1.5 bg-[#22c55e] rounded-full mt-1.5"></div>
                <div>
                  <span className="block text-xs font-black text-gray-800 uppercase tracking-wide">Injection Map</span>
                  <span className="block text-xs text-gray-500 mt-1">Precise anatomical target points overlaid on the muscle schematic.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-1.5 h-1.5 bg-[#ef4444] rounded-full mt-1.5"></div>
                <div>
                  <span className="block text-xs font-black text-gray-800 uppercase tracking-wide">Danger Zones</span>
                  <span className="block text-xs text-gray-500 mt-1">Red hashed areas indicating high risk of diffusion (ptosis/diplopia).</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-1.5 h-1.5 bg-[#cc7e6d] rounded-full mt-1.5"></div>
                <div>
                  <span className="block text-xs font-black text-gray-800 uppercase tracking-wide">Placement Rationale</span>
                  <span className="block text-xs text-gray-500 mt-1">AI-generated clinical reasoning for each site based on muscle vectors.</span>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-3 uppercase tracking-widest">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: BRAND_CORAL }}>3</span>
              AIMS Protocol
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 pl-9">
              The AI-CDSS relies on the <strong>AIMS Protocol</strong> (AI with Medical Supervision). After your procedure, record any modifications made to the suggested doses and log the observed patient satisfaction.
            </p>
          </section>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button 
            onClick={onClose}
            className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 hover:shadow-2xl"
            style={{ backgroundColor: BRAND_CORAL }}
          >
            Acknowledge & Begin
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserGuideModal;
