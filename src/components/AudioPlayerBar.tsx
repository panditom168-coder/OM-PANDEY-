import React from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { Volume2, Square, VolumeX } from 'lucide-react';

export const AudioPlayerBar: React.FC = () => {
  const { isAudioPlaying, audioText, stopAudio, language } = usePanchayat();

  if (!isAudioPlaying) return null;

  const isEn = language === 'en';

  return (
    <aside
      aria-label={isEn ? 'Audio Player' : 'ऑडियो प्लेयर'}
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-stone-900 text-white rounded-2xl shadow-xl border border-stone-800 p-3 sm:p-4 animate-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
          <Volume2 className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400">
              {isEn ? 'Audio Reading in Progress' : 'आवाज से सुनाया जा रहा है'}
            </span>
            <span className="flex items-center gap-0.5">
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
            </span>
          </div>
          <p className="text-xs text-stone-300 truncate mt-0.5" title={audioText}>
            {audioText || (isEn ? 'Playing audio announcement...' : 'शिकायत विवरण व स्थिति की आवाज जारी है...')}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={stopAudio}
            className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            title={isEn ? 'Stop Audio' : 'आवाज बंद करें'}
          >
            <Square className="w-4 h-4 fill-stone-300" />
          </button>
          <button
            onClick={stopAudio}
            className="p-2 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-lg transition-colors"
            title={isEn ? 'Cancel' : 'रद्द करें'}
          >
            <VolumeX className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
