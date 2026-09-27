import React from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { ShieldCheck, UserCheck, Volume2, Globe, Building2, Lock } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    profile,
    viewMode,
    setViewMode,
    language,
    setLanguage,
    complaints,
    employees,
    isAudioPlaying,
    stopAudio,
    setIsCustomVillageModalOpen,
    isAdminUnlocked,
    lockAdmin,
    t,
  } = usePanchayat();

  const isEn = language === 'en';
  const pendingCount = complaints.filter((c) => c.status === 'pending').length;
  const villageDisplayName = isEn
    ? (profile.villageNameEn || profile.villageName)
    : profile.villageName;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[64px] sm:min-h-[72px] py-2 gap-2 sm:gap-4">
          {/* Zone 1: Wordmark Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-sm shadow-emerald-900/10 shrink-0">
              <span className="font-serif text-lg sm:text-xl">{isEn ? 'G' : 'ग'}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-bold text-sm sm:text-lg tracking-tight text-stone-900 leading-none truncate">
                  {t('appName')}
                </span>
                <button
                  type="button"
                  onClick={() => setIsCustomVillageModalOpen(true)}
                  className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-1.5 sm:px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  title={t('changeVillage')}
                >
                  <Building2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate max-w-[85px] xs:max-w-[120px] sm:max-w-[190px]">{villageDisplayName}</span>
                  <span className="text-[10px] text-emerald-600">✎</span>
                </button>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block mt-0.5 truncate">
                {isEn ? `${profile.blockEn || profile.block} · ${profile.districtEn || profile.district}` : `${profile.block} · ${profile.district}`}
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Info */}
          <nav className="hidden lg:flex items-center gap-5 text-xs text-stone-600 font-medium">
            <div className="flex items-center gap-1.5 text-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t('serviceActive')}</span>
            </div>
            <span className="text-stone-300">·</span>
            <span>{t('totalStaff')}: <strong className="text-stone-900 tabular-nums">{employees.length}</strong></span>
            <span className="text-stone-300">·</span>
            <span>{t('pendingIssues')}: <strong className="text-amber-700 tabular-nums">{pendingCount}</strong></span>
          </nav>

          {/* Zone 3: Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Indicator */}
            {isAudioPlaying && (
              <button
                onClick={stopAudio}
                title={t('stopVoice')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors border border-amber-300"
              >
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-700" />
                <span className="hidden sm:inline">{t('voicePlaying')}</span>
              </button>
            )}

            {/* Language Toggle: Ultra-compact, elegant micro-switch */}
            <div
              className="inline-flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-[11px] font-bold shrink-0 shadow-2xs"
              title={isEn ? 'Language: English / Hindi' : 'भाषा: हिंदी / English'}
            >
              <Globe className="w-3 h-3 text-stone-400 mx-1 shrink-0 hidden xs:block" />
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title="हिंदी में बदलें"
              >
                हिं
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center bg-stone-100 p-0.5 sm:p-1 rounded-xl border border-stone-200 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('gramin')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'gramin'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="hidden sm:inline">{t('graminPortal')}</span>
                <span className="sm:hidden">{isEn ? 'Citizen' : 'ग्रामीण'}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('admin')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'admin'
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="hidden sm:inline">{t('adminPanel')}</span>
                <span className="sm:hidden">{isEn ? 'Admin' : 'एडमिन'}</span>
                {pendingCount > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
                    viewMode === 'admin' ? 'bg-amber-400 text-stone-950' : 'bg-amber-500 text-white'
                  }`}>
                    {pendingCount}
                  </span>
                )}
              </button>
            </div>

            {/* Admin Lock Button if unlocked & in admin view */}
            {viewMode === 'admin' && isAdminUnlocked && (
              <button
                type="button"
                onClick={lockAdmin}
                className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer shrink-0"
                title={t('lockAdmin')}
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
