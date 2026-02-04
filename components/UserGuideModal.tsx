
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
      <div className="bg-white rounded-[3rem] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-[#fcfcf9]">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span style={{ color: BRAND_SAGE }}>SelfieSkin</span> Protocol
          </h2>
          <button onClick={onClose} className="text-[10px] font-black text-gray-300 hover:text-gray-900 uppercase tracking-widest transition-colors">
            Close Guide
          </button>
        </div>

        <div className="p-10 overflow-y-auto custom-scrollbar space-y-12">
            {/* Intro */}
            <section>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Clinical Decision Support Architecture</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    SelfieSkin is an AI-powered Clinical Decision Support System (AI-CDSS) designed to augment expert judgment in aesthetic medicine. It combines computer vision analysis with interactive simulation to provide a "second opinion" on upper-face Botulinum Toxin treatments.
                </p>
            </section>

            {/* Assessment Tab */}
            <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-3 uppercase tracking-widest">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-sans shadow-md" style={{ backgroundColor: BRAND_CORAL }}>1</span>
                    Assessment Tab: Clinical Intake & Analysis
                </h3>
                <div className="pl-11 space-y-8">
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">Step 1: The Anatomical Tryptych</h4>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            The system analyzes patient video inputs to generate a high-fidelity <strong>Clinical Tryptych</strong> (Left Profile, Anterior, Right Profile). This standardized 16:9 visualization maps muscle dynamics across the entire upper face.
                        </p>
                        <ul className="text-xs text-gray-500 space-y-2 list-disc pl-5 font-medium">
                            <li><strong>Dynamic Analysis:</strong> The AI identifies recruitment patterns (e.g., "V-Pattern" Glabella) and asymmetries (e.g., "Spock Brow").</li>
                            <li><strong>Morphology Settings:</strong> Selecting "Male Presenting" triggers specific algorithms for hypertrophic muscle mass dosing (+50-100% units) and flat brow positioning.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">Step 2: Protocol Verification (Human-in-the-Loop)</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            The <strong>"Protocol Execution"</strong> table is the command center. The AI proposes a starting dose based on the AIMS protocol.
                        </p>
                        <div className="mt-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                             <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block mb-1">Provider Responsibility</span>
                             <p className="text-xs text-amber-900/80 font-medium">
                                You must manually verify or adjust every dose in the "Administered" column. The system automatically calculates "Ona-Equivalents" (OnabotulinumtoxinA units) regardless of whether you select Dysport or Daxxify, ensuring standardized record keeping.
                             </p>
                        </div>
                    </div>
                </div>
            </section>

             {/* Simulator Tab (UPDATED) */}
            <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-3 uppercase tracking-widest">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-sans shadow-md" style={{ backgroundColor: BRAND_CORAL }}>2</span>
                    Clinical Simulator: Interactive Training
                </h3>
                <div className="pl-11 space-y-6">
                    <p className="text-sm text-gray-600 leading-relaxed">
                        The <strong>Aesthetic Case Simulator</strong> provides a gamified environment for practicing injection strategy on generative patient cases.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Level 1 */}
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Level 1: Spock Brow</h4>
                            <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                <strong>Objective:</strong> Correct unilateral lateral brow elevation (Frontal View).
                                <br/><br/>
                                <strong>Success Criteria:</strong>
                                <br/>• Target hyperactive lateral frontalis.
                                <br/>• Place 1-2 units high (2cm above rim).
                                <br/>• <span className="text-red-500">AVOID</span> medial brow drop zone.
                            </p>
                        </div>

                        {/* Level 2 */}
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Level 2: Crow's Feet</h4>
                            <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                <strong>Objective:</strong> Treat lateral canthal rhytids (Profile View).
                                <br/><br/>
                                <strong>Success Criteria:</strong>
                                <br/>• Apply 3-Point Pattern (Central, Sup, Inf).
                                <br/>• <strong>Safety:</strong> 1.5cm temporal to canthus.
                                <br/>• <span className="text-red-500">AVOID</span> Zygomaticus (Cheek Drop).
                            </p>
                        </div>
                    </div>

                    <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
                        <h4 className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2">Real-Time Scoring Engine</h4>
                        <p className="text-xs text-gray-600 font-medium">
                            After submitting your plan, the simulator overlays a "Heat Map" showing:
                            <br/><span className="text-green-600 font-bold">● Green Zones:</span> Correct Target (Indication Resolved).
                            <br/><span className="text-red-500 font-bold">● Red Zones:</span> Danger Zone (Ptosis/Diplopia Risk).
                            <br/><span className="text-orange-400 font-bold">● Orange Zones:</span> Inefficient/Avoid (Asymmetry Risk).
                            <br/><br/>
                            Score > 85 is required for "Clinically Sound" certification.
                        </p>
                    </div>
                </div>
            </section>

            {/* Knowledge & History */}
            <section className="pl-11 space-y-8">
                 <div>
                     <h3 className="text-base font-black text-gray-900 mb-2 uppercase tracking-widest">Knowledge Base</h3>
                     <p className="text-sm text-gray-600 leading-relaxed">
                        A quick-reference guide for anatomy, muscle functions, and safety profiles. It includes specific injection depths and angles for each muscle group.
                    </p>
                 </div>
                 <div>
                    <h3 className="text-base font-black text-gray-900 mb-2 uppercase tracking-widest">Secure Treatment History</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        <strong>Local Storage Architecture:</strong> Patient data is stored locally in your browser to ensure privacy. Use the "Feedback & Deviation Log" after every case to archive your rationale, safety checks, and patient outcomes for longitudinal tracking.
                    </p>
                 </div>
            </section>
            
            {/* Disclaimer */}
            <section>
                <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-gray-300">
                    <h3 className="text-sm font-bold text-gray-800 mb-2">Final Disclaimer</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        This application is for educational and clinical decision support purposes only. It does not practice medicine. The generated visuals are simulations. Final treatment responsibility rests exclusively with the licensed practitioner.
                    </p>
                </div>
            </section>
        </div>

        <div className="p-6 border-t border-gray-100 bg-[#fcfcf9]">
          <button 
            onClick={onClose}
            className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 hover:shadow-2xl hover:bg-[#c96650]"
            style={{ backgroundColor: BRAND_CORAL }}
          >
            Enter Clinical Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserGuideModal;
