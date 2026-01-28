
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
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span style={{ color: BRAND_SAGE }}>SelfieSkin</span> Protocol
          </h2>
          <button onClick={onClose} className="text-[10px] font-black text-gray-300 hover:text-gray-900 uppercase tracking-widest transition-colors">
            Close
          </button>
        </div>

        <div className="p-10 overflow-y-auto custom-scrollbar space-y-12">
            {/* Intro */}
            <section>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome & Core Philosophy</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    SelfieSkin is an AI-powered Clinical Decision Support System (AI-CDSS). Its purpose is to act as an expert "second opinion" by analyzing patient facial dynamics to provide evidence-based treatment recommendations. It is a tool to augment, not replace, your clinical judgment.
                </p>
                 <p className="mt-2 text-xs font-medium text-gray-500 italic">
                    <strong>Human-in-the-Loop Principle:</strong> You, the licensed provider, always make the final decision. This system provides data and a proposed plan; you provide the clinical expertise and final sign-off.
                 </p>
            </section>

            {/* Assessment Tab */}
            <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-3 uppercase tracking-widest">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-sans" style={{ backgroundColor: BRAND_CORAL }}>1</span>
                    The Assessment Tab: Your Primary Workspace
                </h3>
                <div className="pl-11 space-y-8">
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2">Step 1: Patient Intake (Data Foundation)</h4>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            Accurate intake is critical for a valid analysis. All fields must be completed.
                        </p>
                        <ul className="text-xs text-gray-500 space-y-4 list-disc pl-5 font-medium">
                            <li><strong>Patient ID:</strong> Use a consistent, unique identifier for each patient to enable reliable record retrieval in the History tab.</li>
                            <li><strong>Formula:</strong> Select the Botulinum Toxin brand you plan to use. This choice dictates the unit conversions in all subsequent dosing tables.</li>
                            <li><strong>Morphology:</strong> Selecting "Female Presenting" or "Male Presenting" informs the AI's aesthetic goals. For example, it will prioritize a gentle brow arch for female morphologies and a flatter, lower brow for male morphologies to preserve gender-affirming features.</li>
                            <li>
                                <strong>Upload Dynamic Scan (Critical Input):</strong> A high-quality video is the most important data source.
                                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <span className="font-black text-gray-600 block mb-1">Best Practices for Video Capture:</span>
                                    <ul className="list-[circle] pl-5 space-y-1 text-gray-500">
                                        <li><strong>Lighting:</strong> Use bright, even, frontal lighting to avoid shadows that can obscure muscle movement.</li>
                                        <li><strong>Angle:</strong> The camera should be stable, at eye level, and directly in front of the patient.</li>
                                        <li><strong>Patient Instructions:</strong> Clearly ask the patient to perform each expression to its maximum for 1-2 seconds: Rest -> Max Frown -> Max Surprise (eyebrow raise) -> Max Smile (crow's feet).</li>
                                        <li><strong>Framing:</strong> Ensure the entire face, from hairline to chin, is visible throughout the video.</li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2">Step 2: AI Analysis & Clinical Review (The "Second Opinion")</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            After clicking <strong>"Run Clinical Analysis,"</strong> the AI generates a multi-part report. Your task is to critically appraise its findings.
                        </p>
                         <ul className="text-xs text-gray-500 space-y-3 list-disc pl-5 font-medium mt-4">
                            <li><strong>Review the Visual Treatment Map:</strong> This is the AI's anatomical hypothesis. Do the proposed injection sites align with your anatomical knowledge and the patient's specific presentation? Do the danger zones accurately reflect high-risk areas for this individual?</li>
                            <li><strong>Cross-Reference the Data Panels:</strong> Check the AI's "Step 2: Video Dynamics" findings. Does its classification (e.g., "V-Pattern Glabella") match what you observed in the video? Does the "Step 3: Strategic Planning" rationale make clinical sense?</li>
                         </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2">Step 3: Protocol Execution (Your Clinical Judgment)</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            This is the most critical human-in-the-loop step. In the <strong>"Protocol Execution"</strong> table, the "Administered" column is editable for a reason. You must review each AI-suggested dose and override it with your own clinical decision based on your direct patient assessment. The system automatically flags any deviations from the AI's plan, which is essential for robust medical record-keeping.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2">Step 4: Finalize & Archive (Documentation)</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Proper documentation is the final step of the clinical workflow.
                        </p>
                         <ul className="text-xs text-gray-500 space-y-2 list-disc pl-5 font-medium mt-3">
                            <li><strong>View Full Clinical Report:</strong> This generates a clean, PDF-ready summary of the entire session, including the visual map, AI analysis, and your final, administered doses. It is designed to be printed or saved directly into a patient's EMR.</li>
                            <li><strong>Archive Record:</strong> Before saving, you are prompted to complete a feedback form. Logging your rationale for any deviations, as well as patient outcomes, is crucial for longitudinal tracking and contributes to the continuous refinement of best practices.</li>
                        </ul>
                    </div>
                </div>
            </section>

             {/* Visualizer Tab */}
            <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-3 uppercase tracking-widest">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-sans" style={{ backgroundColor: BRAND_CORAL }}>2</span>
                    The Visualizer Tab: Education & Consultation
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed pl-11 mb-4">
                    This is a powerful educational tool for both providers and patients, powered by a dedicated image generation model.
                </p>
                <ul className="text-xs text-gray-500 space-y-3 list-disc pl-16 font-medium">
                    <li><strong>Clinical Use Cases:</strong> These pre-built scenarios generate a triptych of images (Pre-treatment, Treatment Plan, Post-treatment) to illustrate common clinical concepts. Use them to explain the rationale for a procedure to a patient (e.g., "why we inject high on the forehead to avoid brow drop") or for staff training.</li>
                    <li><strong>Manual Anatomical Query:</strong> This free-text field allows you to generate custom medical illustrations on demand. Use it to explore complex anatomy for your own learning or to create a specific visual for a patient. Examples: <em>"Illustrate the path of the angular artery relative to the nasolabial fold,"</em> or <em>"Show the difference in masseter muscle size between a normal and a hypertrophic jaw."</em></li>
                </ul>
            </section>

            {/* Other Tabs */}
            <section className="pl-11 space-y-8">
                 <div>
                     <h3 className="text-base font-black text-gray-900 mb-2 uppercase tracking-widest">Knowledge Base: Quick Reference</h3>
                     <p className="text-sm text-gray-600 leading-relaxed">
                        This tab is not a textbook. It is a quick clinical refresher for essential information like toxin conversion ratios, contraindications, and common adverse events. Refer to it for at-a-glance information during treatment planning.
                    </p>
                 </div>
                 <div>
                    <h3 className="text-base font-black text-gray-900 mb-2 uppercase tracking-widest">History Tab: Secure & Private Records</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        <strong>Privacy First:</strong> All archived treatment sessions are stored exclusively on your device in your browser's local storage. No patient data is ever sent to or stored on an external server, ensuring complete confidentiality.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        Use this tab to track a patient's treatment journey over time, review past dosages to inform future sessions, and analyze outcomes.
                    </p>
                 </div>
            </section>
            
            {/* Disclaimer */}
            <section>
                <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-gray-300">
                    <h3 className="text-sm font-bold text-gray-800 mb-2">Final Disclaimer: Safety & Provider Responsibility</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        This AI-CDSS is a powerful tool, but it is not a substitute for comprehensive medical training, experience, and direct patient examination. The licensed provider is solely and entirely responsible for all diagnoses, treatment decisions, and outcomes. Use this tool wisely as one part of a holistic approach to patient care.
                    </p>
                </div>
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
