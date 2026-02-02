
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
import ComparativeDosing from './components/ComparativeDosing';
import SimulationEngine from './components/SimulationEngine';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import { 
  analyzePatientInput, 
  generatePostTreatmentVisual, 
  generateTreatmentMapVisual, 
  generateProtocolVisual
} from './services/geminiService';
import { AnalysisResult, ToxinBrand, TreatmentSession, PatientGender, FeedbackData } from './types';
import { SAMPLE_ANALYSIS_FEMALE, SAMPLE_ANALYSIS_MALE } from './constants';

type Tab = 'assessment' | 'visualizer' | 'knowledge' | 'history';

const dataUrlToBase64 = (dataUrl: string) => dataUrl.split(',')[1];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('assessment');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
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
  const [postTreatmentImageUrl, setPostTreatmentImageUrl] = useState<string | null>(null);
  const [protocolImageUrl, setProtocolImageUrl] = useState<string | null>(null);

  const [clinicalNote, setClinicalNote] = useState("");
  const [signature, setSignature] = useState("");

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
      setPostTreatmentImageUrl(null);
      setProtocolImageUrl(null);
    }
  };

  const handleLoadSample = async () => {
    setResult(null);
    setTreatmentMapImageUrl(null);
    setPostTreatmentImageUrl(null);
    setProtocolImageUrl(null);
    setError(null);
    setMediaFile(null);
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
        // Only generate the photo map, anatomy is now an overlay
        const imageUrl = await generateTreatmentMapVisual(freshSample, '2K');
        setTreatmentMapImageUrl(imageUrl);
        setIsGeneratingMap(false);

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
        
        const imageUrl = await generateTreatmentMapVisual(analysis, '2K');
        setTreatmentMapImageUrl(imageUrl);
        setIsGeneratingMap(false);

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
        setIsGeneratingPostTreatmentVisual(false);
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

  // Handle Recalibration Drags
  const handleSiteMove = (siteId: string, x: number, y: number) => {
    if (!result) return;
    const newSites = result.sites.map(s => s.id === siteId ? { ...s, x, y } : s);
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
  
  const isLoading = isAnalyzing || isGeneratingMap;

  return (
    <div className="min-h-screen bg-[#fcfcf9] pb-40">
      <Header onOpenGuide={() => setIsGuideOpen(true)} />
      <main className="max-w-7xl mx-auto px-6 md:px-10">
        <nav className="flex gap-16 border-b border-gray-100 mb-12 overflow-x-auto no-print">
          {['assessment', 'visualizer', 'knowledge', 'history'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t as Tab)} 
                    className={`pb-6 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] border-b-[3px] transition-all duration-300 whitespace-nowrap ${activeTab === t ? 'border-[#cc7e6d] text-gray-900' : 'border-transparent text-gray-300 hover:text-gray-500'}`}>
              {t === 'visualizer' ? 'Clinical Simulator' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>

        {activeTab === 'assessment' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            {/* INTAKE PANEL */}
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
                    <input type="text" placeholder="PX-000-000" value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full border-gray-100 bg-gray-50 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-[#cc7e6d]/10 outline-none transition-all"/>
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
                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">{loadingStage}</p>
              </div>
            )}

            {!isLoading && result && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                {/* 1. INTERACTIVE TRYPTYCH MAP */}
                <div ref={mapRef}>
                  <AnatomicalMap 
                    ref={mapRef}
                    treatmentMapImageUrl={treatmentMapImageUrl}
                    isGenerating={isGeneratingMap}
                    sites={result.sites}
                    assessmentNarrative={result.assessmentNarrative}
                    gender={selectedGender}
                    onSiteMove={handleSiteMove} 
                  />
                </div>

                {/* 2. PROJECTED OUTCOME CURTAIN SLIDER */}
                <div className="space-y-6">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Projected Clinical Outcome</h3>
                    <div className="w-full">
                        {treatmentMapImageUrl ? (
                             <BeforeAfterSlider 
                                beforeImage={treatmentMapImageUrl}
                                afterImage={postTreatmentImageUrl || ''}
                                isGenerating={isGeneratingPostTreatmentVisual}
                             />
                        ) : (
                             <div className="w-full aspect-[16/9] bg-gray-50 rounded-[3rem] border border-gray-100 flex items-center justify-center">
                                 <span className="text-xs font-bold text-gray-300 uppercase">Analysis Pending</span>
                             </div>
                        )}
                    </div>
                </div>

                {/* 3. CLINICAL DATA SUMMARY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Step 2: Dynamic Analysis</h3>
                      <div className="space-y-4">
                         <div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase block">Glabellar Pattern</span>
                            <span className="text-sm font-black text-gray-800">{result.step2.glabellarPattern}</span>
                         </div>
                         <div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase block">Max Contraction</span>
                            <ul className="text-xs text-gray-600 mt-1 space-y-1">
                                <li><strong>Frontalis:</strong> {result.step2.maxContraction.frontalis}</li>
                                <li><strong>Glabella:</strong> {result.step2.maxContraction.glabella}</li>
                            </ul>
                         </div>
                      </div>
                   </div>

                   <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Step 3: Strategic Plan</h3>
                       <ul className="space-y-3">
                          {result.step3.regionalPlans.map((plan, i) => (
                              <li key={i} className="text-xs text-gray-600">
                                  <span className="font-bold text-gray-800 block">{plan.region} ({plan.muscle})</span>
                                  {plan.reasoning}
                              </li>
                          ))}
                       </ul>
                   </div>
                </div>

                {/* 4. DETAILS & DOSING */}
                <div className="space-y-4">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Injection Technique</h3>
                    <InjectionPlanTable sites={result.sites} />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Dosing Intelligence</h3>
                    <ComparativeDosing data={result.step4} />
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Protocol Execution</h3>
                      <button onClick={handleOpenReport} className="text-[10px] font-black text-white bg-gray-900 px-6 py-2 rounded-full uppercase tracking-widest hover:bg-gray-700 transition-colors">
                          Generate Report
                      </button>
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

                <div className="flex justify-end gap-4 pt-8">
                   <button 
                     onClick={() => setIsFeedbackOpen(true)}
                     className="px-8 py-4 bg-[#cc7e6d] text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl hover:bg-[#b86d5e] transition-all"
                   >
                      Complete Session & Archive
                   </button>
                </div>
              </div>
            )}
            
            {error && (
               <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-center animate-pulse">
                   <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-2">System Error</p>
                   <p className="text-sm font-bold text-red-800">{error}</p>
               </div>
            )}
          </div>
        )}

        {/* REPLACED VISUALIZER WITH SIMULATION ENGINE */}
        {activeTab === 'visualizer' && (
             <div className="space-y-12">
                <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Clinical Case Simulator</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Interactive Decision Making Environment</p>
                </div>
                <SimulationEngine />
             </div>
        )}

        {activeTab === 'knowledge' && <KnowledgeBase />}

        {activeTab === 'history' && <TreatmentHistory sessions={history} />}

      </main>

      <UserGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      
      <ClinicalReportModal 
         isOpen={isReportOpen} 
         onClose={() => setIsReportOpen(false)}
         reportMarkdown={result?.clinicalReport || ''}
         mapImageDataUrl={treatmentMapImageUrl}
         protocolImageUrl={protocolImageUrl}
         clinicalNote={clinicalNote}
         signature={signature}
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
