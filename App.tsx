
import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Header from './components/Header';
import AnatomicalMap from './components/AnatomicalMap';
import DosageTable from './components/DosageTable';
import KnowledgeBase from './components/KnowledgeBase';
import TreatmentHistory from './components/TreatmentHistory';
import UserGuideModal from './components/UserGuideModal';
import ClinicalReportModal from './components/ClinicalReportModal';
import FeedbackModal from './components/FeedbackModal';
import InjectionPlanTable from './components/InjectionPlanTable';
import { 
  analyzePatientInput, 
  generateAestheticVisual, 
  generatePostTreatmentVisual, 
  generateTreatmentMapVisual, 
  generateAnatomicalOverlayVisual,
  generateProtocolVisual
} from './services/geminiService';
import { AnalysisResult, ToxinBrand, TreatmentSession, PatientGender, ImageSize, FeedbackData } from './types';
import { SAMPLE_ANALYSIS_FEMALE, SAMPLE_ANALYSIS_MALE } from './constants';

type Tab = 'assessment' | 'visualizer' | 'knowledge' | 'history';

const useCases = [
  {
    id: 'muscle_isolation',
    name: "Muscle Isolation",
    icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    prePrompt: "Detailed medical illustration of the procerus muscle in isolation on a female face, showing fiber direction.",
    treatmentPrompt: "Highlighting the procerus muscle origin and insertion points.",
    postPrompt: "Visual of relaxed procerus muscle fibers.",
  },
  {
    id: 'muscle_group',
    name: "Muscle Interaction",
    icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 7v10M16 7v10M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    prePrompt: "Anatomical diagram showing the relationship between procerus and corrugator supercilii muscles, highlighting opposing vectors.",
    treatmentPrompt: "Strategic injection points to balance medial and lateral forces in the glabella.",
    postPrompt: "Illustration of balanced muscle interaction post-treatment.",
  },
  {
    id: 'risk_zone',
    name: "Frontalis & Brow Risk",
    icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    prePrompt: "Lateral view of frontalis muscle showing its role as the sole brow elevator. Highlight the 'danger zone' near the orbital rim.",
    treatmentPrompt: "Correct placement of microdroplets high in the forehead to preserve brow height.",
    postPrompt: "Result showing smoothed forehead with maintained brow position.",
  },
  {
    id: 'vasculature',
    name: "Vascular Safety",
    icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    prePrompt: "Detailed anatomy of the lateral canthal region showing the path of the angular artery and zygomaticofacial artery relative to orbicularis oculi.",
    treatmentPrompt: "Injection mapping avoiding superficial vessels in the temple region.",
    postPrompt: "Safe injection planes visualized relative to vasculature.",
  },
  {
    id: 'nerve_anatomy',
    name: "Nerve Pathways",
    icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    prePrompt: "Illustration of the supraorbital nerve emerging from the supraorbital notch, showing its deep branch path under the frontalis.",
    treatmentPrompt: "Injection points designed to modulate frontalis without affecting nerve function.",
    postPrompt: "Balanced brow elevation with nerve safety preserved.",
  }
];

const dataUrlToBase64 = (dataUrl: string) => dataUrl.split(',')[1];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('assessment');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const [isGeneratingAnatomy, setIsGeneratingAnatomy] = useState(false);
  const [isGeneratingPostTreatmentVisual, setIsGeneratingPostTreatmentVisual] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedBrand, setSelectedBrand] = useState<ToxinBrand>(ToxinBrand.BOTOX);
  const [selectedGender, setSelectedGender] = useState<PatientGender>(PatientGender.FEMALE);
  const [patientId, setPatientId] = useState('');

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const [treatmentMapImageUrl, setTreatmentMapImageUrl] = useState<string | null>(null);
  const [anatomicalOverlayUrl, setAnatomicalOverlayUrl] = useState<string | null>(null);
  const [postTreatmentImageUrl, setPostTreatmentImageUrl] = useState<string | null>(null);
  const [protocolImageUrl, setProtocolImageUrl] = useState<string | null>(null);

  const [clinicalNote, setClinicalNote] = useState("");
  const [signature, setSignature] = useState("");

  const [isDemoCase, setIsDemoCase] = useState(false);
  
  const [visualPrompt, setVisualPrompt] = useState('');
  const [visualSize, setVisualSize] = useState<ImageSize>('1K');
  const [visualResult, setVisualResult] = useState<{pre: string | null, treatment: string | null, post: string | null} | null>(null);
  const [visualLoading, setVisualLoading] = useState(false);
  const [activeUseCase, setActiveUseCase] = useState<string | null>(null);

  const [sliderPos, setSliderPos] = useState(50);

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
      setMediaFile(file);
      setResult(null);
      setError(null);
      setTreatmentMapImageUrl(null);
      setAnatomicalOverlayUrl(null);
      setPostTreatmentImageUrl(null);
      setProtocolImageUrl(null);
      setIsDemoCase(false);
    }
  };

  const handleLoadSample = async () => {
    setResult(null);
    setTreatmentMapImageUrl(null);
    setAnatomicalOverlayUrl(null);
    setPostTreatmentImageUrl(null);
    setProtocolImageUrl(null);
    setError(null);
    setMediaFile(null);
    setIsDemoCase(true);
    setIsAnalyzing(true);

    const isF = selectedGender === PatientGender.FEMALE;
    setPatientId(`DEMO-${isF ? 'F' : 'M'}-${Math.floor(Math.random() * 899) + 100}`);
    const sample = isF ? SAMPLE_ANALYSIS_FEMALE : SAMPLE_ANALYSIS_MALE;
    const freshSample = JSON.parse(JSON.stringify(sample));
    freshSample.gender = selectedGender;
    
    setResult(freshSample);
    
    try {
        setLoadingStage("Generating Clinical Baseline...");
        setIsGeneratingMap(true);
        setIsGeneratingAnatomy(true);
        const [imageUrl, overlayUrl] = await Promise.all([
          generateTreatmentMapVisual(freshSample, '2K'),
          generateAnatomicalOverlayVisual(selectedGender, '2K')
        ]);
        setTreatmentMapImageUrl(imageUrl);
        setAnatomicalOverlayUrl(overlayUrl);
        setIsGeneratingMap(false);
        setIsGeneratingAnatomy(false);

        // Generate Protocol Image parallel to Post Visual
        setLoadingStage("Simulating Outcomes & Protocol...");
        setIsGeneratingPostTreatmentVisual(true);
        const [postUrl, protoUrl] = await Promise.all([
            generatePostTreatmentVisual(freshSample, imageUrl, '2K'),
            generateProtocolVisual(freshSample.assessmentNarrative, selectedGender, '2K')
        ]);
        setPostTreatmentImageUrl(postUrl);
        setProtocolImageUrl(protoUrl);

    } catch (err: any) {
        setError("Clinical generation failed. Check API key. " + err.message);
    } finally {
        setIsAnalyzing(false);
        setIsGeneratingMap(false);
        setIsGeneratingAnatomy(false);
        setIsGeneratingPostTreatmentVisual(false);
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleAnalyze = async () => {
    if (!mediaFile || !patientId) return;
    setResult(null);
    setTreatmentMapImageUrl(null);
    setAnatomicalOverlayUrl(null);
    setPostTreatmentImageUrl(null);
    setProtocolImageUrl(null);
    setError(null);
    setIsAnalyzing(true);

    try {
        const mediaBase64Url = await readFileAsBase64(mediaFile);
        const mediaBase64 = dataUrlToBase64(mediaBase64Url);
        const isStaticImage = mediaFile.type.startsWith('image/');

        // 1. Analyze Clinical Dynamics First
        setLoadingStage("Reasoning Dynamic Patterns...");
        const analysis = await analyzePatientInput(mediaBase64, mediaFile.type, selectedGender, selectedBrand, false, isStaticImage);
        
        // Ensure analysis IDs are unique for the map
        analysis.sites = (analysis.sites || []).map((s, i) => ({ ...s, id: s.id || `site-${i}`, actualDoseOna: s.doseOna }));
        setResult(analysis);

        // 2. Generate Patient-Specific Visuals using Analysis Data
        setLoadingStage("Establishing Baseline Tryptych...");
        setIsGeneratingMap(true);
        setIsGeneratingAnatomy(true);
        
        const [imageUrl, overlayUrl] = await Promise.all([
          generateTreatmentMapVisual(analysis, '2K'),
          generateAnatomicalOverlayVisual(selectedGender, '2K')
        ]);
        setTreatmentMapImageUrl(imageUrl);
        setAnatomicalOverlayUrl(overlayUrl);
        setIsGeneratingMap(false);
        setIsGeneratingAnatomy(false);

        // 3. Project Outcome based on Visual & Analysis
        setLoadingStage("Projecting Clinical Outcome...");
        setIsGeneratingPostTreatmentVisual(true);
        const [postUrl, protoUrl] = await Promise.all([
             generatePostTreatmentVisual(analysis, imageUrl, '2K'),
             generateProtocolVisual(analysis.assessmentNarrative, selectedGender, '2K')
        ]);
        setPostTreatmentImageUrl(postUrl);
        setProtocolImageUrl(protoUrl);

    } catch (err: any) {
        setError("Assessment generation failed: " + err.message);
    } finally {
        setIsAnalyzing(false);
        setIsGeneratingMap(false);
        setIsGeneratingAnatomy(false);
        setIsGeneratingPostTreatmentVisual(false);
    }
  };

  const handleGenerateVisual = async () => {
    if (!visualPrompt) return;
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
    setVisualLoading(true);
    setVisualResult(null);
    setError(null);
    try {
      const [preUrl] = await Promise.all([
        generateAestheticVisual(useCase.prePrompt, visualSize)
      ]);
      setVisualResult({ pre: preUrl, treatment: null, post: null });
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
        fontEmbedCSS: '' 
      });
      setIsReportOpen(true);
    } catch (error) {
      console.error('Report capture failed:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const updateSiteDose = (siteId: string, doseInOna: number) => {
    if (!result) return;
    const newSites = result.sites.map(s => s.id === siteId ? { ...s, actualDoseOna: doseInOna } : s);
    setResult({ ...result, sites: newSites });
  };

  const handleFeedbackSubmit = (feedback: FeedbackData) => {
    if (!result || !patientId) return;
    const session: TreatmentSession = {
      id: Date.now().toString(),
      patientId, 
      gender: selectedGender, 
      date: new Date().toISOString(), 
      brand: selectedBrand,
      analysis: JSON.parse(JSON.stringify(result)),
      feedback: feedback
    };
    const newHistory = [session, ...history];
    setHistory(newHistory);
    localStorage.setItem('selfieskin-history', JSON.stringify(newHistory));
    setIsFeedbackOpen(false);
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
            <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-gray-50 flex flex-col xl:flex-row gap-14 items-center justify-between no-print">
              <div className="flex-1 space-y-10 w-full">
                <div className="flex items-center justify-between flex-wrap gap-4">
                   <div>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Clinical Intake</span>
                     <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Anatomical Baseline</h2>
                   </div>
                   <button onClick={handleLoadSample} className="text-[10px] font-black text-[#cc7e6d] border border-[#cc7e6d]/40 px-6 py-2.5 rounded-full hover:bg-[#cc7e6d] hover:text-white transition-all tracking-widest uppercase shadow-sm">
                     Demo Case
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
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Facial Morphology</label>
                    <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                      <button onClick={() => setSelectedGender(PatientGender.FEMALE)} className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${selectedGender === PatientGender.FEMALE ? 'bg-white shadow-lg text-gray-900 ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}>Female</button>
                      <button onClick={() => setSelectedGender(PatientGender.MALE)} className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${selectedGender === PatientGender.MALE ? 'bg-white shadow-lg text-gray-900 ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}>Male</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full xl:w-auto min-w-[300px]">
                <button onClick={() => fileInputRef.current?.click()} className="w-full px-8 py-5 rounded-2xl border-2 border-dashed border-gray-200 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 bg-white hover:border-[#cc7e6d]/50 hover:text-[#cc7e6d] transition-all">
                  {mediaFile ? `REPLACE (${mediaFile.name})` : 'Upload Upper Face Scan'}
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="video/*,image/*" onChange={handleFileChange} />
                <button disabled={isLoading || !mediaFile || !patientId} onClick={handleAnalyze} className={`w-full px-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest text-white transition-all shadow-xl transform active:scale-95 ${isLoading || !mediaFile || !patientId ? 'bg-gray-200 cursor-not-allowed shadow-none' : 'bg-[#cc7e6d] hover:bg-[#b86d5e]'}`}>
                  {isLoading ? 'Processing Clinical Logic...' : 'Analyze Dynamics'}
                </button>
              </div>
            </div>

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[4rem] border border-gray-50 animate-pulse">
                <div className="w-20 h-20 border-[6px] border-gray-100 border-t-[#cc7e6d] rounded-full animate-spin mb-8"></div>
                <p className="text-xs font-black text-[#cc7e6d] uppercase tracking-[0.4em]">{loadingStage}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-4">Gemini 3 Pro Reasoning Engine Engaged</p>
              </div>
            )}
            
            {(result || error) && !isLoading && (
              <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                {error && <div className="mb-12 p-8 bg-red-50 border border-red-100 rounded-3xl text-red-600 font-bold text-center text-sm">{error}</div>}
                
                {result && (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
                      <div className="space-y-16">
                        {/* Section 1: Treatment Assessment Map */}
                        <div className="space-y-8">
                          <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                            <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em]">Treatment Assessment Map</h3>
                            <div className="flex gap-4 items-center">
                               <span className="text-[9px] font-black text-[#cc7e6d] uppercase tracking-widest opacity-60">High-Fidelity Clinical Asset</span>
                            </div>
                          </div>
                          <AnatomicalMap 
                             ref={mapRef}
                             isGenerating={isGeneratingMap && !treatmentMapImageUrl}
                             isGeneratingAnatomy={isGeneratingAnatomy}
                             treatmentMapImageUrl={treatmentMapImageUrl}
                             anatomicalOverlayUrl={anatomicalOverlayUrl}
                             sites={result.sites}
                             assessmentNarrative={result.assessmentNarrative}
                          />
                        </div>

                         {/* Section 3: Interactive Outcome */}
                        {postTreatmentImageUrl && (
                          <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                                <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em]">Interactive Outcome Projection</h3>
                            </div>
                            <div className="relative w-full aspect-[16/9] bg-gray-50 rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden group cursor-ew-resize select-none">
                              <img src={treatmentMapImageUrl || ""} alt="Baseline" className="absolute inset-0 w-full h-full object-cover" />
                              <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                                <img src={postTreatmentImageUrl} alt="Simulated Outcome" className="absolute inset-0 w-full h-full object-cover" style={{ width: '100%', height: '100%' }} />
                              </div>
                              <div className="absolute inset-y-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10" style={{ left: `${sliderPos}%` }}>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border border-gray-100">
                                   <div className="flex gap-1"><div className="w-1 h-3 bg-gray-200 rounded-full"></div><div className="w-1 h-3 bg-gray-200 rounded-full"></div></div>
                                </div>
                              </div>
                              <input type="range" min="0" max="100" value={sliderPos} onChange={(e) => setSliderPos(parseInt(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20" />
                              <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md text-[10px] font-black text-white px-4 py-2 rounded-full uppercase tracking-widest border border-white/20">Baseline Map</div>
                              <div className="absolute top-6 right-6 bg-green-500/80 backdrop-blur-md text-[10px] font-black text-white px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">Projected Outcome</div>
                            </div>
                            <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest px-12 leading-relaxed">
                                Disclaimer: Simulated outcome projection for educational purposes only. Individual results vary based on metabolic rate, muscle mass, and adherence to aftercare. Optimal correction not guaranteed.
                            </p>
                          </div>
                        )}

                        {/* Section 4: Injection Plan Logic */}
                        <div className="space-y-8">
                          <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] border-b border-gray-50 pb-4">Injection Plan Logic</h3>
                          <InjectionPlanTable sites={result.sites} />
                        </div>
                      </div>

                      <div className="space-y-20">
                        {/* Section 2: Clinical Reasonings */}
                        <div className="space-y-10">
                          <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em]">Clinical Reasonings</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border-l-[8px] border-[#cc7e6d] shadow-sm flex flex-col justify-center">
                                <h4 className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Morphology Classification</h4>
                                <p className="text-2xl font-black text-gray-900 tracking-tighter leading-tight">{result.step2?.glabellarPattern || "Unclassified"} Pattern</p>
                              </div>
                              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center">
                                <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Skin Texture</h5>
                                <p className="text-sm font-bold text-gray-700 leading-snug">{result.step2?.restingTone}</p>
                              </div>
                          </div>
                          
                          {/* Protocol Visual */}
                          {protocolImageUrl && (
                              <div className="border border-gray-100 rounded-[2.5rem] p-2 bg-white shadow-sm">
                                  <div className="rounded-[2rem] overflow-hidden border border-gray-50 relative group">
                                      <img src={protocolImageUrl} alt="Protocol Illustration" className="w-full h-auto" />
                                      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-800">
                                          Suggested Protocol
                                      </div>
                                  </div>
                              </div>
                          )}

                          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                               <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Dynamics Assessment</h5>
                               <ul className="space-y-3">
                                  <li className="text-[11px] text-gray-600 border-b border-gray-50 pb-2"><strong className="text-gray-900 block mb-1">Frontalis</strong> {result.step2?.maxContraction?.frontalis}</li>
                                  <li className="text-[11px] text-gray-600 border-b border-gray-50 pb-2"><strong className="text-gray-900 block mb-1">Glabella</strong> {result.step2?.maxContraction?.glabella}</li>
                                  <li className="text-[11px] text-gray-600"><strong className="text-gray-900 block mb-1">Orbicularis</strong> {result.step2?.maxContraction?.orbicularis}</li>
                               </ul>
                           </div>
                        </div>

                        {/* Section 5: Precision Execution */}
                        <div className="space-y-10">
                           <div className="flex justify-between items-center mb-6">
                               <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em]">Precision Execution</h3>
                           </div>
                           <DosageTable 
                                result={result} 
                                selectedBrand={selectedBrand} 
                                patientId={patientId}
                                onUpdateSiteDose={updateSiteDose}
                                onUpdateClinicalNote={setClinicalNote}
                                onUpdateSignature={setSignature}
                           />
                        </div>
                      </div>
                    </div>

                    <div className="mt-24 pt-20 border-t border-gray-100 flex justify-center gap-8 no-print">
                      <button onClick={handleOpenReport} disabled={isGeneratingReport} className="bg-[#2a3038] text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all transform active:scale-95 disabled:bg-gray-300">
                        {isGeneratingReport ? 'Compiling Package...' : 'Clinical Report Pack'}
                      </button>
                      <button onClick={() => setIsFeedbackOpen(true)} className="bg-[#97a98c] text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#86987a] transition-all transform active:scale-95">Archive & Save</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ... (Visualizer, Knowledge, History tabs kept same) ... */}
        {activeTab === 'visualizer' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="bg-white p-14 rounded-[4rem] shadow-2xl border border-gray-50">
              <div className="max-w-6xl mx-auto space-y-12 text-center">
                  <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Clinical Asset Engine</h2>
                  <div className="inline-block bg-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-[0.2em] px-4 py-1.5 rounded-full mb-8">Gemini 3 Image Visualization</div>
                <div className="grid grid-cols-2 gap-6">
                  {useCases.map((uc) => (
                    <button key={uc.id} onClick={() => handleUseCaseClick(uc)} className={`p-8 rounded-[2.5rem] border text-center transition-all duration-300 group ${activeUseCase === uc.id ? 'bg-[#cc7e6d] text-white shadow-xl scale-105' : 'bg-gray-50 hover:bg-white hover:shadow-lg hover:border-gray-200'}`}>
                      <div className="flex justify-center items-center mb-4"><uc.icon className={`w-10 h-10 ${activeUseCase === uc.id ? 'text-white' : 'text-gray-300 group-hover:text-[#cc7e6d]'}`} /></div>
                      <h4 className={`text-[11px] font-black uppercase tracking-widest ${activeUseCase === uc.id ? 'text-white' : 'text-gray-500'}`}>{uc.name}</h4>
                    </button>
                  ))}
                </div>
                {activeUseCase && (
                  <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-100 text-left animate-in fade-in slide-in-from-top-4">
                     {(() => {
                        const uc = useCases.find(u => u.id === activeUseCase);
                        return uc ? (
                          <>
                             <div className="flex items-center gap-3 mb-2">
                                <span className="bg-[#cc7e6d] text-white text-[9px] font-black uppercase px-2 py-1 rounded">Scenario</span>
                                <h5 className="text-xs font-bold text-gray-900">{uc.name}</h5>
                             </div>
                             <p className="text-xs text-gray-600 mb-4">{uc.prePrompt}</p>
                             <div className="flex items-center gap-3 mb-2">
                                <span className="bg-[#97a98c] text-white text-[9px] font-black uppercase px-2 py-1 rounded">Clinical Value</span>
                             </div>
                             <p className="text-xs text-gray-600">{uc.postPrompt}</p>
                          </>
                        ) : null;
                     })()}
                  </div>
                )}
                <div className="pt-12">
                   <textarea value={visualPrompt} onChange={(e) => setVisualPrompt(e.target.value)} placeholder="Describe custom anatomical asset..." className="w-full h-32 border-gray-100 bg-gray-50 rounded-[2.5rem] px-10 py-8 text-sm font-bold focus:ring-4 focus:ring-[#cc7e6d]/10 outline-none resize-none" />
                   <button disabled={visualLoading || !visualPrompt} onClick={handleGenerateVisual} className="mt-6 bg-[#cc7e6d] text-white px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-[#b86d5e] transition-all disabled:bg-gray-200">{visualLoading ? 'Rendering Asset...' : 'Generate Clinical Asset'}</button>
                </div>
                {visualResult && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
                     {visualResult.pre && <img src={visualResult.pre} className="rounded-[3rem] border-8 border-gray-50 shadow-xl" />}
                     {visualResult.treatment && <img src={visualResult.treatment} className="rounded-[3rem] border-8 border-blue-50 shadow-xl" />}
                     {visualResult.post && <img src={visualResult.post} className="rounded-[3rem] border-8 border-green-50 shadow-xl" />}
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
        mapImageDataUrl={treatmentMapImageUrl} 
        protocolImageUrl={protocolImageUrl}
        clinicalNote={clinicalNote}
        signature={signature}
      />
      {result && <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} data={{ patientId, brand: selectedBrand, result }} onSave={handleFeedbackSubmit} />}
    </div>
  );
};

export default App;
