
import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Header from './components/Header';
import AnatomicalMap from './components/AnatomicalMap';
import DosageTable from './components/DosageTable';
import ComparativeDosing from './components/ComparativeDosing';
import KnowledgeBase from './components/KnowledgeBase';
import TreatmentHistory from './components/TreatmentHistory';
import UserGuideModal from './components/UserGuideModal';
import ClinicalReportModal from './components/ClinicalReportModal';
import FeedbackModal from './components/FeedbackModal';
import { analyzePatientVideo, generateAestheticVisual, generatePostTreatmentVisual, generateTreatmentMapVisual } from './services/geminiService';
import { AnalysisResult, ToxinBrand, TreatmentSession, InjectionSite, DangerZone, PatientGender, ImageSize, FeedbackData } from './types';
import { SAMPLE_ANALYSIS_FEMALE, SAMPLE_ANALYSIS_MALE } from './constants';

type Tab = 'assessment' | 'visualizer' | 'knowledge' | 'history';

// --- VISUALIZER USE CASES ---
const useCases = [
  {
    id: 'procerus',
    name: "Procerus Isolation",
    icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8C10.8954 8 10 7.10457 10 6C10 4.89543 10.8954 4 12 4C13.1046 4 14 4.89543 14 6C14 7.10457 13.1046 8 12 8ZM12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12ZM12 16C10.8954 16 10 15.1046 10 14C10 12.8954 10.8954 12 12 12C13.1046 12 14 12.8954 14 14C14 15.1046 13.1046 16 12 16ZM12 20C10.8954 20 10 19.1046 10 18C10 16.8954 10.8954 16 12 16C13.1046 16 14 16.8954 14 18C14 19.1046 13.1046 20 12 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    prePrompt: "Medical illustration of a hyperdynamic procerus muscle causing a deep horizontal rhytid at the nasal root. Show muscle contraction lines.",
    treatmentPrompt: "Medical illustration of a single injection point in the belly of the procerus muscle. Label it 'G1' with a dose of '4U'.",
    postPrompt: "Medical illustration of a relaxed procerus muscle after botulinum toxin treatment. The overlying skin is smooth and the horizontal rhytid is softened.",
    narrative: {
        who: "A patient with a static horizontal line at the top of their nose.",
        what: "A hyperdynamic procerus muscle pulling the medial brows down.",
        when: "The patient complains of looking 'angry' or 'scrunched up' even at rest.",
        where: "A single, targeted injection into the belly of the procerus muscle (G1).",
        why: "To relax the procerus with 4 Units of OnabotulinumtoxinA, softening the horizontal line for a more serene expression."
    }
  },
  {
    id: 'glabellar',
    name: "Glabellar Complex",
    icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 14L12 10L16 14M8 10L12 6L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    prePrompt: "Anatomical view of a V-Pattern glabellar contraction, showing the downward pull of the procerus and the medial pull of the hypertrophic corrugator supercilii muscles, creating deep '11' lines.",
    treatmentPrompt: "Medical illustration of a 7-point injection pattern for a V-pattern glabella. Label a central procerus point 'G1' (4U), two medial corrugator points 'G2' (4U each), and four lateral/superior corrugator points 'G3' (2U each).",
    postPrompt: "Anatomical view of a relaxed glabellar complex post-treatment. The procerus and corrugator muscles are smooth, and the '11' lines are significantly reduced.",
    narrative: {
        who: "A patient presenting with deep vertical '11' lines between the eyebrows, typical of a V-Pattern contraction.",
        what: "Hypertrophic corrugator supercilii muscles pulling brows medially, with strong procerus involvement.",
        when: "The patient expresses concern about looking 'stern' or 'worried.'",
        where: "A 7-point injection pattern across the glabellar complex targeting the procerus and corrugators.",
        why: "To administer a total of 20 Units to reduce the action of the brow depressors, smoothing the '11s' and opening the medial brow."
    }
  },
  {
    id: 'frontalis',
    name: "Frontalis & Brow Ptosis",
    icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12H20M4 8H20M4 16H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    prePrompt: "Illustration of the frontalis muscle contracting, creating deep horizontal forehead lines but also elevating low-set eyebrows. Highlight the lower third as a high-risk zone for ptosis.",
    treatmentPrompt: "Medical illustration of a conservative frontalis injection plan. Show 8 small-dose injection points placed at least 2cm above the orbital rim. Label each point 'F' with a dose of '1.5U'.",
    postPrompt: "Post-treatment illustration showing softened horizontal forehead lines with preserved eyebrow position. The injections were placed high in the frontalis, relaxing the upper muscle fibers while maintaining support for the brows.",
    narrative: {
        who: "A patient with low-set brows concerned about forehead lines but at high risk for iatrogenic brow drop.",
        what: "The frontalis is the sole elevator of the brow; treating it too aggressively or too low can cause ptosis.",
        when: "The patient desires smoother forehead skin without a 'heavy' or 'tired' look post-treatment.",
        where: "The superior two-thirds of the frontalis muscle, with all injection points >2cm above the orbital rim.",
        why: "To use a total of 12 Units in microdroplets to conservatively soften upper horizontal rhytids while preserving the muscle's brow-lifting function."
    }
  },
  {
    id: 'vasculature',
    name: "Periocular Vasculature",
    icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V20M12 4C10 6 8 10 8 12C8 14 10 18 12 20M12 4C14 6 16 10 16 12C16 14 14 18 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    prePrompt: "Detailed view of the lateral canthal region showing dynamic crow's feet rhytids on skin contraction. Overlay the typical superficial course of the angular and zygomaticofacial arteries beneath the skin.",
    treatmentPrompt: "Medical illustration of safe injection points for crow's feet. Show 3 superficial injection points per side, placed over 1.5cm lateral to the lateral canthus, avoiding the illustrated arteries. Label each point 'C' with a dose of '2U'.",
    postPrompt: "View of the lateral canthal region post-treatment. The crow's feet are smooth. Illustrate safe, superficial injection points that successfully avoided the underlying vasculature, preventing bruising.",
    narrative: {
        who: "Any patient, especially those with thin, translucent skin, undergoing treatment for crow's feet.",
        what: "The superficial course of the angular and zygomaticofacial arteries poses a risk for bruising.",
        when: "Planning lateral orbicularis oculi injections to minimize the risk of ecchymosis.",
        where: "Three injection points per side, placed superficially and >1.5cm from the lateral canthus.",
        why: "To administer a total of 12 Units (6 per side) in a safe plane, avoiding vessel puncture for a better patient experience and outcome."
    }
  },
  {
    id: 'nerve',
    name: "Supraorbital Nerve",
    icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L12 6M12 18L12 22M6 12L2 12M22 12L18 12M18 18L20 20M4 4L6 6M18 6L20 4M4 20L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    prePrompt: "Anatomy of a 'Spock Brow' or 'Mephisto Sign', showing over-treatment of the central frontalis, leading to unopposed action of the lateral frontalis fibers and a peaked eyebrow.",
    treatmentPrompt: "Medical illustration correcting a 'Spock Brow'. Show two targeted microdroplet injection points in the lateral frontalis fibers, superior and lateral to the brow peak. Label each point 'Correction' with a dose of '1U'.",
    postPrompt: "Corrected brow appearance after targeted microdroplet injections into the lateral frontalis. The brow has a natural, gentle arch. Show the supraorbital notch and nerve path to illustrate how precise injection placement resolved the issue.",
    narrative: {
        who: "A patient with a 'Spock brow' (peaked lateral brow) from a previous treatment.",
        what: "Over-treatment of the central frontalis has led to unopposed hyper-action of the lateral fibers.",
        when: "Correcting an aesthetically undesirable outcome from a prior injection.",
        where: "The lateral aspect of the frontalis muscle, superior to the peak of the brow.",
        why: "To use a small dose (1U per side) to relax the hyperactive lateral frontalis fibers, lowering the brow peak and restoring a natural, aesthetically pleasing arch."
    }
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('assessment');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const [isGeneratingPostTreatmentVisual, setIsGeneratingPostTreatmentVisual] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Step 1 Intake State
  const [selectedBrand, setSelectedBrand] = useState<ToxinBrand>(ToxinBrand.BOTOX);
  const [selectedGender, setSelectedGender] = useState<PatientGender>(PatientGender.FEMALE);
  const [patientId, setPatientId] = useState('');
  const [offLabelConsent, setOffLabelConsent] = useState(false);

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [mapImageDataUrl, setMapImageDataUrl] = useState<string | null>(null);
  const [treatmentMapImageUrl, setTreatmentMapImageUrl] = useState<string | null>(null);
  const [postTreatmentImageUrl, setPostTreatmentImageUrl] = useState<string | null>(null);
  const [isDemoCase, setIsDemoCase] = useState(false);
  
  // Visualizer States
  const [visualPrompt, setVisualPrompt] = useState('');
  const [visualSize, setVisualSize] = useState<ImageSize>('1K');
  const [visualResult, setVisualResult] = useState<{pre: string | null, treatment: string | null, post: string | null} | null>(null);
  const [visualLoading, setVisualLoading] = useState(false);
  const [activeUseCase, setActiveUseCase] = useState<string | null>(null);

  const [history, setHistory] = useState<TreatmentSession[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('selfieskin-history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setResult(null);
      setError(null);
      setTreatmentMapImageUrl(null);
      setPostTreatmentImageUrl(null);
      setIsDemoCase(false);
    }
  };

  const handleLoadSample = async () => {
    // Reset state
    setResult(null);
    setTreatmentMapImageUrl(null);
    setPostTreatmentImageUrl(null);
    setError(null);
    setVideoFile(null);
    setIsDemoCase(true);

    const isF = selectedGender === PatientGender.FEMALE;
    setPatientId(`DEMO-${isF ? 'F' : 'M'}-${Math.floor(Math.random() * 899) + 100}`);
    const sample = isF ? SAMPLE_ANALYSIS_FEMALE : SAMPLE_ANALYSIS_MALE;
    
    // Deep clone to ensure demo data remains fresh and mutable for this session
    const freshSample = JSON.parse(JSON.stringify(sample));
    freshSample.gender = selectedGender;
    
    // Set text-based results first
    setResult(freshSample);
    window.scrollTo({ top: 350, behavior: 'smooth' });
    
    // Now generate the visual map
    setIsGeneratingMap(true);
    setLoadingStage("Generating Demo Visuals...");

    try {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await (window as any).aistudio.openSelectKey();
        }
        const imageUrl = await generateTreatmentMapVisual(freshSample);
        setTreatmentMapImageUrl(imageUrl);
        setIsGeneratingMap(false);
        
        setIsGeneratingPostTreatmentVisual(true);
        const postTreatmentUrl = await generatePostTreatmentVisual(freshSample);
        setPostTreatmentImageUrl(postTreatmentUrl);

    } catch (err: any) {
        setError("Failed to generate demo visuals. Please check your API key or try a live analysis. Error: " + err.message);
    } finally {
        setIsGeneratingMap(false);
        setIsGeneratingPostTreatmentVisual(false);
    }
  };

  const handleAnalyze = async () => {
    if (!videoFile || !patientId) return;
    setResult(null);
    setTreatmentMapImageUrl(null);
    setPostTreatmentImageUrl(null);
    setError(null);
    setIsAnalyzing(true);
    setIsDemoCase(false);
    setLoadingStage("Step 2: Analyzing Video Dynamics...");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(videoFile);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        try {
          // Step 1: Get JSON analysis
          const analysis = await analyzePatientVideo(
            base64, 
            videoFile.type, 
            selectedGender,
            selectedBrand,
            offLabelConsent
          );
          
          analysis.sites = (analysis.sites || []).map((s, i) => ({ 
            ...s, id: `site-${i}`, actualDoseOna: s.doseOna, 
            muscleFunction: s.muscleFunction || "Analyzing..." 
          }));
          analysis.dangerZones = (analysis.dangerZones || []).map((z, i) => ({ ...z, id: `danger-${i}` }));
          setResult(analysis);
          setIsAnalyzing(false);

          // Step 2: Generate Visual Map
          setIsGeneratingMap(true);
          setLoadingStage("Step 3B: Generating Visual Treatment Map...");
          const imageUrl = await generateTreatmentMapVisual(analysis);
          setTreatmentMapImageUrl(imageUrl);
          setIsGeneratingMap(false);
          
          // Step 3: Generate Post-Treatment Simulation
          setIsGeneratingPostTreatmentVisual(true);
          setLoadingStage("Step 3C: Simulating Post-Treatment Outcome...");
          const postTreatmentUrl = await generatePostTreatmentVisual(analysis);
          setPostTreatmentImageUrl(postTreatmentUrl);
          setIsGeneratingPostTreatmentVisual(false);
          
        } catch (err: any) { 
          setError(err.message); 
          setIsAnalyzing(false);
          setIsGeneratingMap(false);
          setIsGeneratingPostTreatmentVisual(false);
        }
      };
      reader.onerror = (error) => {
          setError('Failed to read the video file.');
          setIsAnalyzing(false);
      };
    } catch (err: any) {
      setError(err.message);
      setIsAnalyzing(false);
    }
  };

  const handleGenerateVisual = async () => {
    if (!visualPrompt) return;
    setActiveUseCase(null); // Clear use case selection
    
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }

    setVisualLoading(true);
    setVisualResult(null);
    setError(null);
    try {
      const url = await generateAestheticVisual(visualPrompt, visualSize);
      setVisualResult({ pre: url, treatment: null, post: null });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setVisualLoading(false);
    }
  };

  const handleUseCaseClick = async (useCase: typeof useCases[0]) => {
    setActiveUseCase(useCase.id);
    setVisualPrompt(''); // Clear manual prompt
    
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }

    setVisualLoading(true);
    setVisualResult(null);
    setError(null);

    try {
      const [preUrl, treatmentUrl, postUrl] = await Promise.all([
        generateAestheticVisual(useCase.prePrompt, visualSize),
        generateAestheticVisual(useCase.treatmentPrompt, visualSize),
        generateAestheticVisual(useCase.postPrompt, visualSize),
      ]);
      setVisualResult({ pre: preUrl, treatment: treatmentUrl, post: postUrl });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setVisualLoading(false);
    }
  };

  const handleOpenReport = async () => {
    if (!mapRef.current) return;
    setIsGeneratingReport(true);
    try {
      const dataUrl = await toPng(mapRef.current, { 
        quality: 0.95,
        backgroundColor: 'white',
        // Hide panel for cleaner report image
        filter: (node: HTMLElement) => !node.classList?.contains('no-print'),
      });
      setMapImageDataUrl(dataUrl);
    } catch (error) {
      console.error('Failed to generate map image:', error);
      setMapImageDataUrl(null); // Proceed without image on error
    } finally {
      setIsGeneratingReport(false);
      setIsReportOpen(true);
    }
  };

  const updateSiteDose = (siteId: string, doseInOna: number) => {
    if (!result) return;
    const newSites = result.sites.map(s => 
      s.id === siteId ? { ...s, actualDoseOna: doseInOna } : s
    );
    setResult({ ...result, sites: newSites });
  };

  const initiateArchive = () => {
    if (!result || !patientId) return;
    setIsFeedbackOpen(true);
  };

  const handleFeedbackSubmit = (feedback: FeedbackData) => {
    if (!result || !patientId) return;
    
    const session: TreatmentSession = {
      id: Date.now().toString(),
      patientId, 
      gender: selectedGender, 
      date: new Date().toISOString(), 
      brand: selectedBrand,
      analysis: JSON.parse(JSON.stringify(result)), // Deep copy state
      feedback: feedback
    };
    
    const newHistory = [session, ...history];
    setHistory(newHistory);
    localStorage.setItem('selfieskin-history', JSON.stringify(newHistory));
    
    setIsFeedbackOpen(false);
    alert("Treatment record archived securely.");
  };
  
  const isLoading = isAnalyzing || isGeneratingMap || isGeneratingPostTreatmentVisual;

  return (
    <div className="min-h-screen bg-[#fcfcf9] pb-40">
      <Header onOpenGuide={() => setIsGuideOpen(true)} />
      <main className="max-w-7xl mx-auto px-6 md:px-10">
        <nav className="flex gap-16 border-b border-gray-100 mb-12 overflow-x-auto no-print">
          {['assessment', 'visualizer', 'knowledge', 'history'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t as Tab)} 
                    className={`pb-6 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] border-b-[3px] transition-all duration-300 whitespace-nowrap ${activeTab === t ? 'border-[#cc7e6d] text-gray-900' : 'border-transparent text-gray-300 hover:text-gray-500'}`}>
              {t === 'visualizer' ? 'Visualizer' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>

        {activeTab === 'assessment' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            {/* WORKSTATION SETUP (Step 1) */}
            <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-gray-50 flex flex-col xl:flex-row gap-14 items-center justify-between no-print">
              <div className="flex-1 space-y-10 w-full">
                <div className="flex items-center justify-between flex-wrap gap-4">
                   <div>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Step 1: Intake</span>
                     <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Anatomical Intake</h2>
                   </div>
                   <button onClick={handleLoadSample} className="text-[10px] font-black text-[#cc7e6d] border border-[#cc7e6d]/40 px-6 py-2.5 rounded-full hover:bg-[#cc7e6d] hover:text-white transition-all tracking-widest uppercase shadow-sm">
                     Load Demo Case
                   </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Patient ID</label>
                    <input type="text" placeholder="PX-000-000" value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full border-gray-100 bg-gray-50 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-[#cc7e6d]/10 outline-none transition-all"/>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Formula</label>
                    <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value as ToxinBrand)} className="w-full border-gray-100 bg-gray-50 rounded-2xl px-6 py-4 text-sm font-black text-gray-700 outline-none focus:ring-4 focus:ring-[#cc7e6d]/10 cursor-pointer">
                      {Object.values(ToxinBrand).map(brand => <option key={brand} value={brand}>{brand.split(' ')[0]}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Morphology</label>
                    <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                      <button onClick={() => setSelectedGender(PatientGender.FEMALE)} className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${selectedGender === PatientGender.FEMALE ? 'bg-white shadow-lg text-gray-900 ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}>Female</button>
                      <button onClick={() => setSelectedGender(PatientGender.MALE)} className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${selectedGender === PatientGender.MALE ? 'bg-white shadow-lg text-gray-900 ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}>Male</button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Scope of Practice</label>
                    <div 
                      onClick={() => setOffLabelConsent(!offLabelConsent)}
                      className={`cursor-pointer w-full border border-gray-100 rounded-2xl px-6 py-3.5 flex items-center justify-between transition-all ${offLabelConsent ? 'bg-blue-50/50' : 'bg-gray-50'}`}
                    >
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Include Off-Label Lower Face?</span>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${offLabelConsent ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
                        {offLabelConsent ? 'YES' : 'NO'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full xl:w-auto min-w-[300px]">
                <button onClick={() => fileInputRef.current?.click()} className="w-full px-8 py-5 rounded-2xl border-2 border-dashed border-gray-200 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 bg-white hover:border-[#cc7e6d]/50 hover:text-[#cc7e6d] transition-all">
                  {videoFile ? 'Replace Capture' : 'Upload Dynamic Scan'}
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
                <button disabled={isLoading || !videoFile || !patientId} onClick={handleAnalyze} className={`w-full px-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest text-white transition-all shadow-xl transform active:scale-95 ${isLoading || !videoFile || !patientId ? 'bg-gray-200 cursor-not-allowed shadow-none' : 'bg-[#cc7e6d] hover:bg-[#b86d5e]'}`}>
                  {isLoading ? 'Processing...' : 'Run Clinical Analysis'}
                </button>
              </div>
            </div>

            {isLoading && <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[4rem] border border-gray-50 animate-pulse"><div className="w-20 h-20 border-[6px] border-gray-100 border-t-[#cc7e6d] rounded-full animate-spin mb-8"></div><p className="text-xs font-black text-[#cc7e6d] uppercase tracking-[0.4em]">{loadingStage}</p></div>}
            
            {(result || error) && !isLoading && (
              <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                {error && <div className="mb-12 p-8 bg-red-50 border border-red-100 rounded-3xl text-red-600 font-bold text-center text-sm">{error}</div>}
                
                {result && (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
                      {/* Left Column: Map & Sites (Step 3 Visualization) */}
                      <div className="space-y-16">
                        <AnatomicalMap 
                          ref={mapRef}
                          isGenerating={isGeneratingMap}
                          treatmentMapImageUrl={treatmentMapImageUrl}
                        />

                        {/* NEW: Outcome Simulation View */}
                        {(postTreatmentImageUrl || isGeneratingPostTreatmentVisual) && (
                          <div className="space-y-8 animate-in fade-in duration-500">
                            <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] border-b border-gray-50 pb-4">Clinical Outcome Simulation</h3>
                            <div className="grid grid-cols-2 gap-4 items-start bg-gray-50/30 p-4 rounded-[2.5rem] border border-gray-100">
                              {/* Pre-Treatment Video/Image */}
                              <div className="space-y-2">
                                <div className="w-full rounded-2xl aspect-square overflow-hidden flex items-center justify-center">
                                  {videoFile ? (
                                    <video controls muted loop playsInline className="w-full h-full object-cover">
                                      <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
                                    </video>
                                  ) : isDemoCase ? (
                                    <div className="w-full h-full p-4 flex items-center justify-center" style={{ backgroundColor: '#F2E5CF' }}>
                                        <div className="w-full h-full border-2 border-dashed border-blue-400 rounded-xl"></div>
                                    </div>
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 text-center p-4 flex flex-col items-center justify-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.55a2 2 0 01.996 1.713V14a2 2 0 01-2 2h-1.55a2 2 0 01-1.789-1.118l-1.9-3.774a2 2 0 00-1.79-1.108h-1.912a2 2 0 00-1.79 1.108l-1.9 3.774A2 2 0 015.55 16H4a2 2 0 01-2-2v-.287a2 2 0 01.996-1.713L7.5 10m7.5 0l-3.75-3.75M7.5 10l3.75-3.75" /></svg>
                                      <p className="text-[10px] font-bold text-gray-400 mt-2">Dynamic Scan appears here</p>
                                    </div>
                                  )}
                                </div>
                                <p className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pre-Treatment</p>
                              </div>
                              {/* Post-Treatment Image */}
                              <div className="space-y-2">
                                <div className="relative w-full aspect-square bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center">
                                  {isGeneratingPostTreatmentVisual && (
                                    <div className="flex flex-col items-center justify-center text-center p-2">
                                        <div className="w-8 h-8 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Simulating Outcome...</p>
                                    </div>
                                  )}
                                  {!isGeneratingPostTreatmentVisual && postTreatmentImageUrl && (
                                    <img src={postTreatmentImageUrl} alt="AI-Generated Post-Treatment Simulation" className="w-full h-full object-cover animate-in fade-in duration-500" />
                                  )}
                                </div>
                                <p className="text-center text-[10px] font-bold text-green-600 uppercase tracking-widest">AI Simulation (Post-Treatment)</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 3: Injection Strategy (Sites Detail) */}
                        <div className="space-y-8">
                          <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] border-b border-gray-50 pb-4">Step 3B: Plan Visualization</h3>
                          <div className="grid grid-cols-1 gap-6">
                            {result.sites.map((site) => (
                              <div key={site.id} className="bg-gray-50/30 p-8 rounded-[2.5rem] border border-gray-100 flex justify-between items-start group hover:bg-white hover:shadow-xl hover:border-gray-200 transition-all duration-500">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <span className="bg-[#cc7e6d]/10 text-[#cc7e6d] text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">{site.label}</span>
                                    <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">{site.muscle}</h4>
                                  </div>
                                  <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-xs italic">"{site.rationale}"</p>
                                </div>
                                <div className="text-[#22c55e] font-black text-xl">{site.actualDoseOna ?? site.doseOna}U</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Analysis Steps 2, 3, 4 */}
                      <div className="space-y-20">
                        {/* STEP 2: VIDEO DYNAMICS UI */}
                        <div className="space-y-10">
                          <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em]">Step 2: Video Dynamics</h3>
                          
                          <div className="p-10 bg-gray-50/50 rounded-[3rem] border-l-[8px] border-[#cc7e6d] shadow-sm">
                            <h4 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Glabellar Classification</h4>
                            <p className="text-3xl font-black text-gray-900 tracking-tighter leading-tight">
                              {result.step2?.glabellarPattern || "Unclassified"} Pattern
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                               <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Resting Tone</h5>
                               <p className="text-xs font-bold text-gray-700 leading-snug">{result.step2?.restingTone}</p>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                               <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Max Contraction</h5>
                               <ul className="space-y-2">
                                  <li className="text-[10px] text-gray-600"><strong className="text-gray-900">Frontalis:</strong> {result.step2?.maxContraction?.frontalis}</li>
                                  <li className="text-[10px] text-gray-600"><strong className="text-gray-900">Glabella:</strong> {result.step2?.maxContraction?.glabella}</li>
                               </ul>
                            </div>
                          </div>
                        </div>

                        {/* STEP 3: STRATEGIC PLANNING UI */}
                        <div className="space-y-10">
                           <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em]">Step 3: Strategic Planning</h3>
                           
                           {/* Plan Overview */}
                           <div className="bg-gray-100 rounded-[3rem] p-8">
                             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Regional Strategy</h4>
                             <div className="space-y-4">
                               {result.step3?.regionalPlans.map((plan, i) => (
                                 <div key={i} className="bg-white rounded-2xl p-4 flex gap-4 items-center shadow-sm">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-lg font-black text-[#cc7e6d]">
                                      {plan.points}
                                    </div>
                                    <div>
                                      <h5 className="text-xs font-black text-gray-800 uppercase tracking-wide">{plan.region} ({plan.muscle})</h5>
                                      <p className="text-[10px] text-gray-500 leading-relaxed mt-1">{plan.reasoning}</p>
                                    </div>
                                 </div>
                               ))}
                             </div>
                           </div>

                           {/* Safety Flags & Adjustments */}
                           <div className="bg-red-50/40 border border-red-100 rounded-[3rem] p-10">
                              <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-4">Patient-Specific Safety Flags</h4>
                              <ul className="space-y-3 mb-6">
                                {result.step3?.safetyFlags.map((flag, i) => (
                                  <li key={i} className="flex gap-3 text-xs font-bold text-gray-700 items-center">
                                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0"></span>
                                    {flag}
                                  </li>
                                ))}
                              </ul>
                              {result.step3?.conservativeAdjustments && (
                                <div className="bg-white/60 p-4 rounded-2xl border border-red-100">
                                   <span className="text-[9px] font-black text-red-300 uppercase tracking-widest block mb-1">Conservative Adjustment</span>
                                   <p className="text-[10px] font-medium text-gray-600 italic">"{result.step3.conservativeAdjustments}"</p>
                                </div>
                              )}
                           </div>
                        </div>
                        
                        {/* STEP 4: DOSING ENGINE */}
                        <div>
                          <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6">Step 4: Dosing Engine</h3>
                          {result.step4 && <ComparativeDosing data={result.step4} />}
                        </div>

                        <div>
                           <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6 mt-12">Step 4B: Protocol Execution ({selectedBrand.split(' ')[0]})</h3>
                           <DosageTable result={result} selectedBrand={selectedBrand} onUpdateSiteDose={updateSiteDose} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-24 pt-20 border-t border-gray-100 flex justify-center gap-8 no-print">
                      <button 
                        onClick={handleOpenReport}
                        disabled={isGeneratingReport}
                        className="bg-[#2a3038] text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all transform active:scale-95 disabled:bg-gray-300 disabled:cursor-wait"
                      >
                        {isGeneratingReport ? 'Generating...' : 'View Full Clinical Report (Step 5)'}
                      </button>
                      <button onClick={initiateArchive} className="bg-[#97a98c] text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#86987a] transition-all transform active:scale-95">Archive Record</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="bg-white p-14 rounded-[4rem] shadow-2xl border border-gray-50">
              <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Clinical Visualizer</h2>
                  <p className="text-gray-400 font-bold uppercase text-[11px] tracking-[0.4em]">Powered by Gemini 3 Image Pro</p>
                </div>

                {/* --- USE CASE SELECTOR --- */}
                <div className="space-y-6">
                  <label className="text-center block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Select a Clinical Use Case</label>
                  <div className="grid grid-cols-5 gap-4">
                    {useCases.map((uc) => (
                      <button 
                        key={uc.id} 
                        onClick={() => handleUseCaseClick(uc)}
                        className={`p-6 rounded-3xl border text-center transition-all duration-300 group ${activeUseCase === uc.id ? 'bg-[#cc7e6d] text-white shadow-lg' : 'bg-gray-50 hover:bg-white hover:shadow-lg hover:border-gray-200'}`}
                        title={uc.name}
                      >
                        <div className="flex justify-center items-center mb-4">
                          <uc.icon className={`w-8 h-8 ${activeUseCase === uc.id ? 'text-white' : 'text-gray-400 group-hover:text-[#cc7e6d]'}`} />
                        </div>
                        <h4 className={`text-[10px] font-black uppercase tracking-widest ${activeUseCase === uc.id ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-800'}`}>{uc.name}</h4>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-100"></div>
                  <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">OR</span>
                  <div className="flex-1 h-px bg-gray-100"></div>
                </div>

                {/* --- MANUAL QUERY --- */}
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Manual Anatomical Query</label>
                    <textarea 
                      value={visualPrompt}
                      onChange={(e) => { setVisualPrompt(e.target.value); setActiveUseCase(null); }}
                      placeholder="e.g., Detail of the angular artery path relative to the nasolabial fold..."
                      className="w-full h-32 border-gray-100 bg-gray-50 rounded-[2.5rem] px-10 py-8 text-sm font-bold focus:ring-4 focus:ring-[#cc7e6d]/10 outline-none resize-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Fidelity</label>
                      <select 
                        value={visualSize}
                        onChange={(e) => setVisualSize(e.target.value as ImageSize)}
                        className="w-full border-gray-100 bg-gray-50 rounded-2xl px-7 py-5 text-sm font-black text-gray-700 outline-none focus:ring-4 focus:ring-[#cc7e6d]/10"
                      >
                        <option value="1K">1K (Standard)</option>
                        <option value="2K">2K (High-Res)</option>
                        <option value="4K">4K (Ultra-Res)</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button 
                        disabled={visualLoading || (!visualPrompt && !activeUseCase)}
                        onClick={visualPrompt ? handleGenerateVisual : () => {
                           const active = useCases.find(uc => uc.id === activeUseCase);
                           if (active) handleUseCaseClick(active);
                        }}
                        className={`w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] text-white transition-all shadow-xl transform active:scale-95 ${visualLoading || (!visualPrompt && !activeUseCase) ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#cc7e6d] hover:bg-[#b86d5e]'}`}
                      >
                        {visualLoading ? 'Rendering...' : 'Generate Visual'}
                      </button>
                    </div>
                  </div>
                </div>
                
                {error && <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-red-600 font-bold text-center text-sm">{error}</div>}

                {visualLoading && (
                  <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[3rem] border border-gray-100 animate-pulse">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-[#cc7e6d] rounded-full animate-spin mb-6"></div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Generating High-Fidelity Visuals...</p>
                  </div>
                )}

                {visualResult && (
                  <div className="space-y-8 pt-12 animate-in fade-in zoom-in duration-700">
                    <div className={`grid ${visualResult.post ? 'grid-cols-3 gap-8' : 'grid-cols-1'}`}>
                      {/* Pre-Treatment Image */}
                      <div className="space-y-4">
                         <div className="relative group rounded-[3rem] overflow-hidden border-8 border-gray-50 shadow-xl aspect-square bg-gray-100">
                            {visualResult.pre && <img src={visualResult.pre} alt="Generated Medical Asset" className="w-full h-full object-cover" />}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              {visualResult.pre && <a href={visualResult.pre} download="clinical-visual-pre.png" className="bg-white text-gray-900 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl">Download</a>}
                            </div>
                         </div>
                         <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">{visualResult.post ? 'Pre-Treatment' : 'Generated Visual'}</p>
                      </div>

                      {/* Treatment Plan Image */}
                      {visualResult.treatment && (
                        <div className="space-y-4">
                           <div className="relative group rounded-[3rem] overflow-hidden border-8 border-blue-100 shadow-xl aspect-square bg-blue-50">
                              <img src={visualResult.treatment} alt="Generated Medical Asset - Treatment Plan" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <a href={visualResult.treatment} download="clinical-visual-treatment.png" className="bg-white text-gray-900 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl">Download</a>
                              </div>
                           </div>
                           <p className="text-center text-[10px] text-blue-500 font-bold uppercase tracking-widest">Treatment Plan</p>
                        </div>
                      )}

                      {/* Post-Treatment Image */}
                      {visualResult.post && (
                        <div className="space-y-4">
                           <div className="relative group rounded-[3rem] overflow-hidden border-8 border-green-100 shadow-xl aspect-square bg-green-50">
                              <img src={visualResult.post} alt="Generated Medical Asset - Post Treatment" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <a href={visualResult.post} download="clinical-visual-post.png" className="bg-white text-gray-900 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl">Download</a>
                              </div>
                           </div>
                           <p className="text-center text-[10px] text-green-500 font-bold uppercase tracking-widest">Post-Treatment</p>
                        </div>
                      )}
                    </div>
                    {/* --- CLINICAL NARRATIVE --- */}
                    {activeUseCase && (
                      <div className="bg-gray-50/70 p-8 rounded-[2.5rem] border border-gray-100 space-y-4 mt-8">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest text-center">Clinical Narrative: {useCases.find(uc => uc.id === activeUseCase)?.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-gray-200">
                          {(Object.entries(useCases.find(uc => uc.id === activeUseCase)?.narrative || {}) as [string, string][]).map(([key, value]) => (
                             <div key={key} className="flex items-start gap-3">
                               <dt className="w-12 flex-shrink-0 text-[10px] font-black text-[#cc7e6d] uppercase tracking-widest">{key}:</dt>
                               <dd className="text-xs text-gray-600 font-medium">{value}</dd>
                             </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'knowledge' && <KnowledgeBase />}
        {activeTab === 'history' && <TreatmentHistory sessions={history} />}
      </main>
      <UserGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <ClinicalReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        reportMarkdown={result?.clinicalReport || ""}
        mapImageDataUrl={treatmentMapImageUrl || mapImageDataUrl}
      />
      {result && (
        <FeedbackModal 
          isOpen={isFeedbackOpen} 
          onClose={() => setIsFeedbackOpen(false)} 
          data={{ patientId, brand: selectedBrand, result }}
          onSave={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default App;
