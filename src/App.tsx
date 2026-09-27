/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PanchayatProvider, usePanchayat } from './context/PanchayatContext';
import { Header } from './components/Header';
import { GraminPortal } from './components/GraminPortal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLockScreen } from './components/AdminLockScreen';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';
import { CustomVillageModal } from './components/CustomVillageModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';

const MainContent: React.FC = () => {
  const { viewMode, isAdminUnlocked, profile, employees, language } = usePanchayat();

  const isEn = language === 'en';
  const villageDisplayName = isEn ? (profile.villageNameEn || profile.villageName) : profile.villageName;
  const blockName = isEn ? (profile.blockEn || profile.block) : profile.block;
  const districtName = isEn ? (profile.districtEn || profile.district) : profile.district;

  return (
    <div className="min-h-screen flex flex-col bg-stone-100/70 font-sans text-stone-900 selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Bar Header */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {viewMode === 'gramin' ? (
          <GraminPortal />
        ) : !isAdminUnlocked ? (
          <AdminLockScreen />
        ) : (
          <AdminPanel />
        )}
      </main>

      {/* Detail / Tracking Modal */}
      <ComplaintDetailModal />

      {/* Custom Village Name Setup Modal */}
      <CustomVillageModal />

      {/* Floating Audio Bar when text-to-speech is active */}
      <AudioPlayerBar />

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
              {isEn ? 'G' : 'ग'}
            </div>
            <span className="font-semibold text-stone-800">
              {villageDisplayName} {isEn ? 'E-Panchayat Services' : 'ई-पंचायत समाधान'}
            </span>
            <span className="text-stone-300">·</span>
            <span>{blockName}, {districtName}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-500">
            <span>
              {isEn ? 'Active Staff:' : 'सक्रिय कर्मचारी:'} <strong className="text-stone-800 font-mono">{employees.length}</strong>
            </span>
            <span>·</span>
            <span>{isEn ? 'Transparent Digital Governance' : 'पारदर्शी ई-गवर्नेंस पोर्टल'}</span>
            <span>·</span>
            <span>{isEn ? 'Toll-free Helpline: 1800-180-5145' : 'टोल-फ्री हेल्पलाइन: 1800-180-5145'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <PanchayatProvider>
      <MainContent />
    </PanchayatProvider>
  );
}
