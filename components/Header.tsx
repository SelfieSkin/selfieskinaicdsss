
import React from 'react';
import { BRAND_SAGE, BRAND_CORAL } from '../constants';

interface HeaderProps {
  onOpenGuide: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenGuide }) => {
  return (
    <header className="bg-white pt-10 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-100 pb-8">
        <div className="flex items-center gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center">
            <span className="text-4xl font-serif tracking-tight" style={{ color: BRAND_SAGE }}>Selfie</span>
            <div className="w-full h-[3px] my-1" style={{ backgroundColor: BRAND_CORAL }}></div>
            <span className="text-4xl font-serif tracking-tight" style={{ color: BRAND_SAGE }}>Skin</span>
          </div>

          <div className="border-l border-gray-200 pl-8 h-12 flex flex-col justify-center">
            <h1 className="text-lg font-bold text-gray-300 tracking-widest uppercase flex items-center gap-3">
              AI-CDSS
            </h1>
            <p className="text-sm font-semibold text-gray-400">Evidence-Based Clinical Support</p>
          </div>
        </div>

        <div className="mt-6 md:mt-0 text-right flex flex-col items-end">
          <div className="flex items-center gap-4 mb-4 no-print">
            <button 
              onClick={onOpenGuide}
              className="text-[10px] font-black text-gray-400 hover:text-gray-800 transition-colors uppercase tracking-widest border border-gray-200 px-4 py-1.5 rounded-full hover:border-gray-400"
            >
              User Guide
            </button>
          </div>
          <h2 className="text-lg font-bold text-gray-600 tracking-tight">Aesthetic Medicine Tool</h2>
          <p className="text-sm font-medium text-gray-300">Secure Provider Portal</p>
        </div>
      </div>
      <div className="text-center pt-4 pb-6">
        <p className="text-sm italic" style={{ color: BRAND_CORAL }}>
          SelfieSkin AI-CDSS for Aesthetic Medicine was created for and by Jason Walker. This application is only meant for simulation and play, therefore should not be used for actual patient interaction.
        </p>
      </div>
    </header>
  );
};

export default Header;
