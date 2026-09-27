import React, { useState } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { Ward } from '../types';
import { MapPin, Phone, CheckCircle2, AlertTriangle, Clock, Volume2, User, ChevronRight } from 'lucide-react';

interface WardInteractiveMapProps {
  onSelectWardFilter?: (wardName: string) => void;
}

export const WardInteractiveMap: React.FC<WardInteractiveMapProps> = ({ onSelectWardFilter }) => {
  const { wards, complaints, readAloudCustom, language } = usePanchayat();
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  const isEn = language === 'en';

  const getWardStats = (wardName: string) => {
    const wardComplaints = complaints.filter(
      (c) => c.ward.includes(wardName) || wardName.includes(c.ward)
    );
    const pending = wardComplaints.filter((c) => c.status === 'pending').length;
    const inProgress = wardComplaints.filter(
      (c) => c.status === 'in_progress' || c.status === 'under_review'
    ).length;
    const resolved = wardComplaints.filter((c) => c.status === 'resolved').length;
    const hasUrgent = wardComplaints.some(
      (c) => c.priority === 'urgent' && c.status !== 'resolved'
    );

    return {
      total: wardComplaints.length,
      pending,
      inProgress,
      resolved,
      hasUrgent,
      wardComplaints,
    };
  };

  const handleListenWard = (ward: Ward) => {
    const stats = getWardStats(ward.name);
    const wardName = isEn ? (ward.nameEn || ward.name) : ward.name;
    const area = isEn ? (ward.areaEn || ward.area) : ward.area;
    const rep = isEn ? (ward.representativeEn || ward.representative) : ward.representative;

    if (isEn) {
      const text = `${wardName}, Area: ${area}. Ward Member: ${rep}. Total Grievances: ${stats.total}, of which ${stats.resolved} are resolved and ${stats.pending + stats.inProgress} are currently active.`;
      readAloudCustom(text);
    } else {
      const text = `${ward.name}, क्षेत्र: ${ward.area}। वार्ड प्रतिनिधि: ${ward.representative}। कुल समस्याएं: ${stats.total}, जिनमें से ${stats.resolved} ठीक हो चुकी हैं, और ${stats.pending + stats.inProgress} पर कार्य जारी है।`;
      readAloudCustom(text);
    }
  };

  return (
    <section aria-label="Live Ward Map" className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs space-y-4">
      {/* Title Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              {isEn ? 'Live Ward Grievance Map' : 'गाँव का संवादात्मक वार्ड नक्शा व समस्या स्थिति'}
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {isEn
              ? 'Click any ward to check its active issues, resolution progress, and local representative'
              : 'किसी भी वार्ड पर क्लिक करके वहां की समस्याओं की स्थिति व वार्ड सदस्य का विवरण देखें'}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-stone-600 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> {isEn ? 'Urgent Alert' : 'अति आवश्यक'}
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> {isEn ? 'In Progress' : 'कार्य जारी'}
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> {isEn ? 'Clean & Resolved' : 'पूर्ण स्वच्छ'}
          </span>
        </div>
      </div>

      {/* Grid of Wards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {wards.map((ward) => {
          const stats = getWardStats(ward.name);
          const isSelected = selectedWard?.id === ward.id;
          const wardTitle = isEn ? (ward.nameEn || ward.name) : ward.name;
          const wardArea = isEn ? (ward.areaEn || ward.area) : ward.area;

          let statusBg = 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-400';
          let indicatorColor = 'bg-emerald-500';
          let statusText = isEn ? 'All Resolved' : 'समस्याएं निस्तारित';

          if (stats.hasUrgent) {
            statusBg = 'border-red-300 bg-red-50/50 hover:border-red-500 shadow-xs';
            indicatorColor = 'bg-red-500 animate-pulse';
            statusText = isEn ? 'Urgent Alert' : 'आपातकालीन अलर्ट';
          } else if (stats.pending > 0 || stats.inProgress > 0) {
            statusBg = 'border-amber-200 bg-amber-50/40 hover:border-amber-400';
            indicatorColor = 'bg-amber-400';
            statusText = isEn
              ? `${stats.pending + stats.inProgress} Active`
              : `${stats.pending + stats.inProgress} कार्य जारी`;
          }

          return (
            <div
              key={ward.id}
              onClick={() => setSelectedWard(ward)}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all relative ${statusBg} ${
                isSelected ? 'ring-2 ring-emerald-700 shadow-md scale-[1.02]' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs font-bold text-stone-800 bg-white/90 border border-stone-200 px-1.5 py-0.2 rounded">
                  W-{ward.number.toString().padStart(2, '0')}
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${indicatorColor}`}></span>
              </div>

              <h4 className="font-bold text-xs sm:text-sm text-stone-900 mt-2 truncate">
                {isEn ? (ward.nameEn || ward.name) : (ward.name.split('-')[1]?.trim() || ward.name)}
              </h4>
              <p className="text-[11px] text-stone-500 truncate mt-0.5" title={wardArea}>
                {wardArea}
              </p>

              <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px]">
                <span className="font-medium text-stone-700">{statusText}</span>
                <span className="font-mono font-bold text-stone-800 tabular-nums">
                  {stats.total} {isEn ? 'Total' : 'कुल'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Ward Interactive Details Panel */}
      {selectedWard && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-900 to-emerald-950 text-white shadow-lg border border-emerald-800/40 animate-in fade-in duration-150">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded">
                  {isEn ? `Ward No. ${selectedWard.number}` : `वार्ड संख्या ${selectedWard.number}`}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {isEn ? (selectedWard.nameEn || selectedWard.name) : selectedWard.name}
                </h4>
              </div>
              <p className="text-xs text-stone-300 mt-1">
                {isEn ? 'Area Coverage:' : 'पहचान व मुख्य क्षेत्र:'} {isEn ? (selectedWard.areaEn || selectedWard.area) : selectedWard.area}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleListenWard(selectedWard)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isEn ? 'Listen Ward Audio' : 'वार्ड हाल सुनें'}</span>
              </button>

              {onSelectWardFilter && (
                <button
                  onClick={() => onSelectWardFilter(selectedWard.name)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white text-stone-900 hover:bg-stone-100 rounded-lg text-xs font-bold shadow-xs"
                >
                  <span>{isEn ? 'View Ward Issues' : 'इस वार्ड की शिकायतें देखें'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
              <User className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-stone-400 block">
                  {isEn ? 'Ward Representative:' : 'वार्ड प्रतिनिधि (सदस्य):'}
                </span>
                <strong className="text-white">
                  {isEn ? (selectedWard.representativeEn || selectedWard.representative) : selectedWard.representative}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-stone-400 block">
                  {isEn ? 'Contact Mobile:' : 'संपर्क मोबाइल:'}
                </span>
                <a href={`tel:${selectedWard.phone}`} className="text-emerald-300 font-mono font-bold hover:underline">
                  {selectedWard.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-stone-400 block">
                  {isEn ? 'Active Work Status:' : 'सक्रिय कार्य स्थिति:'}
                </span>
                <span className="text-white font-medium">
                  {getWardStats(selectedWard.name).pending + getWardStats(selectedWard.name).inProgress} {isEn ? 'Grievances in Progress' : 'कार्य प्रक्रियाधीन'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
