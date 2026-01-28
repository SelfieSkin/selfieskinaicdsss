
import React, { forwardRef } from 'react';

interface AnatomicalMapProps {
  treatmentMapImageUrl: string | null;
  isGenerating: boolean;
}

const AnatomicalMap = forwardRef<HTMLDivElement, AnatomicalMapProps>(({ 
  treatmentMapImageUrl,
  isGenerating
}, ref) => {

  return (
    <div ref={ref} className="relative w-full aspect-[1/1] bg-gray-50 rounded-[3rem] border border-gray-100 overflow-hidden shadow-lg flex items-center justify-center select-none">
      {isGenerating && (
        <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#cc7e6d] rounded-full animate-spin mb-6"></div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Generating Visual Map...</p>
            <p className="text-[10px] text-gray-300 mt-2">This may take a moment</p>
        </div>
      )}
      {!isGenerating && treatmentMapImageUrl && (
        <img 
          src={treatmentMapImageUrl}
          alt="AI-Generated Visual Treatment Plan"
          className="w-full h-full object-cover animate-in fade-in duration-500"
        />
      )}
       {!isGenerating && !treatmentMapImageUrl && (
        <div className="text-center p-8">
           <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
          <p className="mt-4 text-xs font-black text-gray-300 uppercase tracking-[0.3em]">Visual Map will appear here</p>
           <p className="text-[10px] text-gray-400 mt-2">Run clinical analysis to generate the plan.</p>
        </div>
      )}
    </div>
  );
});

export default AnatomicalMap;
