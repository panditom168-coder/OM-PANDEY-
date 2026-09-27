import React, { useState, useEffect } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { ComplaintCategory } from '../types';
import { CATEGORY_DETAILS } from '../data/initialData';
import { VoiceRecognition } from '../utils/speech';
import { WardInteractiveMap } from './WardInteractiveMap';
import {
  Volume2,
  Mic,
  MicOff,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  Phone,
  Send,
  ThumbsUp,
  MapPin,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Bell,
  HelpCircle,
  Map,
  Filter,
} from 'lucide-react';

export const GraminPortal: React.FC = () => {
  const {
    complaints,
    wards,
    notices,
    profile,
    createComplaint,
    upvoteComplaint,
    setSelectedComplaintId,
    readAloudComplaint,
    readAloudNotice,
    readAloudCustom,
    language,
    getText,
    t,
  } = usePanchayat();

  const isEn = language === 'en';

  // Active section tab
  const [activeTab, setActiveTab] = useState<'board' | 'new' | 'track' | 'notices' | 'helpline' | 'map'>('board');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('drinking_water');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [ward, setWard] = useState(wards[0]?.name || 'Ward 01');
  const [locationDetails, setLocationDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  // Voice recording state
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceRecognitionInstance, setVoiceRecognitionInstance] = useState<VoiceRecognition | null>(null);

  // Filters for public board
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedWardFilter, setSelectedWardFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Track search state
  const [trackInput, setTrackInput] = useState('');
  const [trackedComplaints, setTrackedComplaints] = useState<typeof complaints | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const vr = new VoiceRecognition({
      lang: isEn ? 'en-IN' : 'hi-IN',
      onResult: (transcript) => {
        setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
      },
      onError: (err) => {
        setVoiceError(isEn ? 'Microphone permission denied or not supported. Please type instead.' : 'माइक्रोफोन कनेक्ट नहीं हो सका। कृपया लिखकर दर्ज करें।');
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });
    setVoiceRecognitionInstance(vr);
  }, [isEn]);

  const toggleVoiceRecording = () => {
    if (!voiceRecognitionInstance) return;
    setVoiceError(null);
    if (isListening) {
      voiceRecognitionInstance.stop();
      setIsListening(false);
    } else {
      voiceRecognitionInstance.start();
      setIsListening(true);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !citizenName.trim() || !citizenPhone.trim()) {
      alert(isEn ? 'Please fill title, description, your name and phone number.' : 'कृपया समस्या का शीर्षक, विवरण, अपना नाम और फोन नंबर अवश्य भरें।');
      return;
    }

    setIsSubmitting(true);
    try {
      const ticketId = await createComplaint({
        title,
        description,
        category,
        citizenName,
        citizenPhone,
        ward,
        locationDetails,
        voiceTranscript: isListening ? description : undefined,
      });

      setCreatedTicketId(ticketId);
      readAloudCustom(
        isEn
          ? `Your grievance has been successfully registered with Ticket ID ${ticketId}. Department officers have been notified.`
          : `आपकी समस्या सफलतापूर्वक दर्ज हो गई है। आपकी शिकायत संख्या है: ${ticketId.replace(/-/g, ' ')}। संबंधित कर्मचारी को सूचना भेज दी गई है।`
      );

      setTitle('');
      setDescription('');
      setLocationDetails('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackInput.trim().toLowerCase();
    if (!query) return;

    const matched = complaints.filter(
      (c) =>
        c.id.toLowerCase().includes(query) ||
        c.citizenPhone.includes(query) ||
        c.citizenName.toLowerCase().includes(query) ||
        (c.citizenNameEn && c.citizenNameEn.toLowerCase().includes(query))
    );
    setTrackedComplaints(matched);
  };

  const filteredComplaints = complaints.filter((c) => {
    if (selectedCategoryFilter !== 'all' && c.category !== selectedCategoryFilter) return false;
    if (selectedWardFilter !== 'all' && c.ward !== selectedWardFilter && c.wardEn !== selectedWardFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        (c.titleEn && c.titleEn.toLowerCase().includes(q)) ||
        c.description.toLowerCase().includes(q) ||
        (c.descriptionEn && c.descriptionEn.toLowerCase().includes(q)) ||
        c.ward.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const villageDisplayName = isEn ? (profile.villageNameEn || profile.villageName) : profile.villageName;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <section aria-label="Portal Welcome" className="relative rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-950 text-white p-5 sm:p-8 overflow-hidden shadow-lg border border-emerald-800/40">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{isEn ? 'Citizen E-Governance & Transparency Portal' : 'जन शिकायत निवारण एवं पारदर्शी निगरानी केंद्र'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            {villageDisplayName} {isEn ? 'Services Portal' : 'ई-सेवा पोर्टल'}
          </h1>

          <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
            {t('heroSubtitle')}
          </p>

          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                readAloudCustom(
                  isEn
                    ? `Welcome to ${villageDisplayName} Grievance Portal. Tap "File Grievance" to submit any village issue or tap "Listen" on any card to hear its live progress.`
                    : `ग्राम पंचायत ${profile.villageName} में आपका स्वागत है। आप अपनी समस्या दर्ज करने के लिए समस्या दर्ज करें बटन दबाएं या किसी भी कार्ड पर सुनें बटन दबाएं।`
                );
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>{t('listenIntro')}</span>
            </button>

            <button
              onClick={() => setActiveTab('new')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold border border-emerald-500/40 transition-all active:scale-95"
            >
              <span>{t('fileNewGrievanceBtn')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 overflow-x-auto gap-2 pb-px">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'board'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{t('tabBoard')} ({complaints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'new'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Mic className="w-4 h-4 text-emerald-700" />
            <span>{t('tabFile')}</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'track'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>{t('tabTrack')}</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'map'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Map className="w-4 h-4 text-emerald-600" />
            <span>{t('tabMap')}</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'notices'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-600" />
            <span>{t('tabNotices')} ({notices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('helpline')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'helpline'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>{t('tabHelpline')}</span>
          </button>
        </div>
      </div>

      {/* TAB: INTERACTIVE MAP */}
      {activeTab === 'map' && (
        <WardInteractiveMap
          onSelectWardFilter={(wardName) => {
            setSelectedWardFilter(wardName);
            setActiveTab('board');
          }}
        />
      )}

      {/* TAB: NEW GRIEVANCE REGISTRATION */}
      {activeTab === 'new' && (
        <section aria-label="Grievance Registration Form" className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-7 max-w-3xl mx-auto space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">
              {t('formTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {t('formSubtitle')}
            </p>
          </div>

          {createdTicketId && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <h4 className="font-bold text-sm">{t('formSuccessTitle')}</h4>
              </div>
              <p className="text-xs text-emerald-900">
                {t('formSuccessTicket')} <strong className="font-mono text-sm underline">{createdTicketId}</strong>
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedComplaintId(createdTicketId)}
                  className="text-xs font-semibold px-3 py-1.5 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900"
                >
                  {t('viewTimelineBtn')}
                </button>
                <button
                  type="button"
                  onClick={() => setCreatedTicketId(null)}
                  className="text-xs text-stone-600 hover:text-stone-900 font-medium ml-2"
                >
                  {t('fileAnotherBtn')}
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Category Selector Buttons */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
                {t('catSelectLabel')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(CATEGORY_DETAILS) as ComplaintCategory[]).map((catKey) => {
                  const item = CATEGORY_DETAILS[catKey];
                  const isSelected = category === catKey;
                  const label = isEn ? item.labelEn : item.labelHi;
                  const dept = isEn ? (item.defaultDept.includes('Water') ? 'Water Dept' : item.defaultDept.includes('विद्युत') ? 'Power Dept' : item.defaultDept.includes('सफाई') ? 'Sanitation Cell' : 'Panchayat Cell') : item.defaultDept.split('(')[0];

                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setCategory(catKey)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex flex-col gap-1 transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm'
                          : 'border-stone-200 bg-stone-50/60 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span className="font-bold truncate">{label}</span>
                      <span className="text-[10px] text-stone-500 font-normal truncate">
                        {dept}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="complaint-title-input" className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                {t('titleInputLabel')}
              </label>
              <input
                id="complaint-title-input"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('titleInputPlaceholder')}
                className="w-full bg-white border border-stone-300 rounded-xl p-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Description with Voice Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="complaint-description-textarea" className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  {t('descInputLabel')}
                </label>
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse shadow-md'
                      : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300'
                  }`}
                  title={t('voiceTypeBtn')}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>{t('voiceListening')}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t('voiceTypeBtn')}</span>
                    </>
                  )}
                </button>
              </div>

              {voiceError && (
                <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg mb-2">
                  {voiceError}
                </p>
              )}

              <textarea
                id="complaint-description-textarea"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('descInputPlaceholder')}
                className="w-full bg-white border border-stone-300 rounded-xl p-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Ward & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="complaint-ward-select" className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  {t('wardSelectLabel')}
                </label>
                <select
                  id="complaint-ward-select"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl p-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {wards.map((w) => (
                    <option key={w.id} value={isEn ? (w.nameEn || w.name) : w.name}>
                      {isEn ? (w.nameEn || w.name) : w.name} ({isEn ? (w.areaEn || w.area) : w.area})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="complaint-landmark-input" className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  {t('locationInputLabel')}
                </label>
                <input
                  id="complaint-landmark-input"
                  type="text"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder={t('locationInputPlaceholder')}
                  className="w-full bg-white border border-stone-300 rounded-xl p-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Citizen Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-100 pt-4">
              <div>
                <label htmlFor="citizen-name-input" className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  {t('nameInputLabel')}
                </label>
                <input
                  id="citizen-name-input"
                  type="text"
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder={t('nameInputPlaceholder')}
                  className="w-full bg-white border border-stone-300 rounded-xl p-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label htmlFor="citizen-phone-input" className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  {t('phoneInputLabel')}
                </label>
                <input
                  id="citizen-phone-input"
                  type="tel"
                  required
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  placeholder={t('phoneInputPlaceholder')}
                  className="w-full bg-white border border-stone-300 rounded-xl p-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? t('submittingText') : t('submitGrievanceBtn')}</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* TAB: PUBLIC GRIEVANCES BOARD */}
      {activeTab === 'board' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-amber-950">
                  {t('audioBannerTip')}
                </p>
                <p className="text-[11px] text-amber-800">
                  {isEn
                    ? '100% Transparency: Every status update and action report is broadcast live to citizens.'
                    : 'पारदर्शी प्रणाली: हर नया कर्मचारी, कार्य प्रगति और समाधान सीधे गाँववासियों को दिखता है।'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const pendingList = complaints.filter((c) => c.status !== 'resolved');
                const speech = isEn
                  ? `There are currently ${complaints.length} registered issues, with ${pendingList.length} actively being resolved. Top issue: ${complaints[0]?.titleEn || complaints[0]?.title || 'None'}.`
                  : `ग्राम पंचायत में वर्तमान में कुल ${complaints.length} शिकायतें हैं, जिनमें से ${pendingList.length} पर कार्य चल रहा है।`;
                readAloudCustom(speech);
              }}
              className="text-xs font-bold px-3 py-1.5 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors shrink-0"
            >
              {t('listenSummaryBtn')}
            </button>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-xl border border-stone-200 p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <select
                aria-label="Filter by Category"
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-stone-800 focus:bg-white focus:ring-1 focus:ring-emerald-600"
              >
                <option value="all">{t('allCategories')}</option>
                {(Object.keys(CATEGORY_DETAILS) as ComplaintCategory[]).map((k) => (
                  <option key={k} value={k}>
                    {isEn ? CATEGORY_DETAILS[k].labelEn : CATEGORY_DETAILS[k].labelHi}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                aria-label="Filter by Ward"
                value={selectedWardFilter}
                onChange={(e) => setSelectedWardFilter(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-stone-800 focus:bg-white focus:ring-1 focus:ring-emerald-600"
              >
                <option value="all">{t('allWards')}</option>
                {wards.map((w) => (
                  <option key={w.id} value={isEn ? (w.nameEn || w.name) : w.name}>
                    {isEn ? (w.nameEn || w.name) : w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredComplaints.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500">
                {t('noIssuesFound')}
              </div>
            ) : (
              filteredComplaints.map((c) => {
                const cat = CATEGORY_DETAILS[c.category] || CATEGORY_DETAILS.other;
                const latestTimeline = c.timeline[c.timeline.length - 1];

                const statusBadgeStyle =
                  c.status === 'resolved'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : c.status === 'in_progress'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                    : c.status === 'under_review'
                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800';

                const statusText = isEn
                  ? (c.status === 'resolved' ? 'Resolved' : c.status === 'in_progress' ? 'In Progress' : c.status === 'under_review' ? 'Under Review' : 'Pending')
                  : (c.status === 'resolved' ? 'पूर्ण निस्तारित' : c.status === 'in_progress' ? 'कार्य प्रगति पर' : c.status === 'under_review' ? 'समीक्षाधीन' : 'लंबित');

                const titleText = isEn ? (c.titleEn || c.title) : c.title;
                const descText = isEn ? (c.descriptionEn || c.description) : c.description;
                const wardText = isEn ? (c.wardEn || c.ward) : c.ward;
                const deptText = isEn ? (c.assignedDepartmentEn || c.assignedDepartment) : c.assignedDepartment;
                const empText = isEn ? (c.assignedEmployeeNameEn || c.assignedEmployeeName) : c.assignedEmployeeName;
                const latestNote = latestTimeline ? (isEn ? (latestTimeline.noteEn || latestTimeline.note) : latestTimeline.note) : null;

                return (
                  <div
                    key={c.id}
                    className="bg-white rounded-xl border border-stone-200/90 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-2 gap-2">
                        <span className="font-mono font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                          {c.id}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-800 font-medium">{isEn ? cat.labelEn : cat.labelHi}</span>
                          <span>·</span>
                          <span className="truncate max-w-[130px]">{wardText}</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => setSelectedComplaintId(c.id)}
                        className="text-base font-bold text-stone-900 hover:text-emerald-800 cursor-pointer leading-snug line-clamp-2"
                      >
                        {titleText}
                      </h3>

                      <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                        {descText}
                      </p>

                      <div className="mt-3 p-2.5 rounded-lg bg-stone-50 border border-stone-100 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                          <span>{t('assignedDept')}</span>
                          <span className="font-medium text-stone-700 truncate max-w-[170px]">
                            {deptText}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-stone-600">{t('assignedStaff')}</span>
                          {empText ? (
                            <span className="font-semibold text-emerald-950 bg-emerald-100/60 px-1.5 py-0.5 rounded text-[11px]">
                              {empText}
                            </span>
                          ) : (
                            <span className="text-stone-400 italic text-[11px]">{t('unassigned')}</span>
                          )}
                        </div>

                        {latestNote && (
                          <div className="mt-1.5 pt-1.5 border-t border-stone-200/60 text-[11px] text-stone-600 line-clamp-1">
                            <strong className="text-stone-800">{t('latestAction')}</strong> {latestNote}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${statusBadgeStyle}`}>
                          {statusText}
                        </span>

                        <button
                          type="button"
                          onClick={() => upvoteComplaint(c.id)}
                          className="flex items-center gap-1 text-stone-600 hover:text-emerald-800 font-medium px-2 py-0.5 rounded hover:bg-stone-100"
                          title="Support"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{c.upvotes}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => readAloudComplaint(c)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-900 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                          title={isEn ? 'Listen to Grievance' : 'इस समस्या का विवरण आवाज में सुनें'}
                        >
                          <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{t('listenCardBtn')}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedComplaintId(c.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium transition-colors"
                        >
                          <span>{t('timelineBtn')}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB: TRACK GRIEVANCE STATUS */}
      {activeTab === 'track' && (
        <section aria-label="Tracking Section" className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-7 max-w-3xl mx-auto space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">
              {t('trackTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {t('trackSubtitle')}
            </p>
          </div>

          <form onSubmit={handleTrackSearch} className="flex gap-2">
            <input
              type="text"
              required
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              placeholder={t('trackPlaceholder')}
              className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-600"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm transition-colors flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{t('trackBtn')}</span>
            </button>
          </form>

          {trackedComplaints !== null && (
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {t('searchResults')} ({trackedComplaints.length})
              </h4>

              {trackedComplaints.length === 0 ? (
                <div className="p-6 text-center bg-stone-50 rounded-xl border border-stone-200 text-stone-600 text-sm">
                  {t('noTrackResults')}
                </div>
              ) : (
                trackedComplaints.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-stone-200 bg-white hover:border-emerald-500 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
                          {item.id}
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm sm:text-base mt-1">
                          {isEn ? (item.titleEn || item.title) : item.title}
                        </h4>
                        <p className="text-xs text-stone-500">
                          {isEn ? (item.wardEn || item.ward) : item.ward} · {isEn ? 'Citizen:' : 'शिकायतकर्ता:'} {isEn ? (item.citizenNameEn || item.citizenName) : item.citizenName} ({item.citizenPhone})
                        </p>
                      </div>

                      <button
                        onClick={() => readAloudComplaint(item)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 hover:bg-emerald-100"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Listen' : 'स्थिति सुनें'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-[11px] text-center pt-2">
                      <div className="p-1.5 rounded bg-emerald-100 text-emerald-900 font-semibold">
                        {t('stepRegistered')}
                      </div>
                      <div
                        className={`p-1.5 rounded ${
                          item.status !== 'pending'
                            ? 'bg-emerald-100 text-emerald-900 font-semibold'
                            : 'bg-stone-100 text-stone-400'
                        }`}
                      >
                        {t('stepReview')}
                      </div>
                      <div
                        className={`p-1.5 rounded ${
                          item.status === 'in_progress' || item.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-900 font-semibold'
                            : 'bg-stone-100 text-stone-400'
                        }`}
                      >
                        {t('stepProgress')}
                      </div>
                      <div
                        className={`p-1.5 rounded ${
                          item.status === 'resolved'
                            ? 'bg-emerald-600 text-white font-semibold'
                            : 'bg-stone-100 text-stone-400'
                        }`}
                      >
                        {t('stepResolved')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                      <span className="text-stone-600">
                        {t('assignedStaff')} <strong>{isEn ? (item.assignedEmployeeNameEn || item.assignedEmployeeName || 'Pending') : (item.assignedEmployeeName || 'प्रक्रियाधीन')}</strong>
                      </span>
                      <button
                        onClick={() => setSelectedComplaintId(item.id)}
                        className="text-emerald-800 hover:underline font-semibold"
                      >
                        {t('viewTimelineBtn')} →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      )}

      {/* TAB: NOTICES & CIRCULARS */}
      {activeTab === 'notices' && (
        <section aria-label="Notices Section" className="space-y-4 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                {t('noticesTitle')}
              </h2>
              <p className="text-xs text-stone-500">
                {t('noticesSubtitle')}
              </p>
            </div>
            <button
              onClick={() => {
                if (notices.length > 0) readAloudNotice(notices[0]);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-900 hover:bg-amber-200 rounded-lg text-xs font-semibold"
            >
              <Volume2 className="w-4 h-4 text-amber-800" />
              <span>{t('listenLatestNotice')}</span>
            </button>
          </div>

          <div className="space-y-3">
            {notices.map((n) => (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border transition-all ${
                  n.isUrgent
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                    : 'bg-white border-stone-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {n.isUrgent && (
                      <span className="text-[10px] font-bold tracking-wider uppercase bg-red-600 text-white px-2 py-0.5 rounded-full inline-block mb-1.5">
                        {t('urgentNoticeBadge')}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-stone-900 leading-snug">
                      {isEn ? (n.titleEn || n.title) : n.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                      <span>{t('issuedBy')} {isEn ? (n.postedByEn || n.postedBy) : n.postedBy}</span>
                      <span>·</span>
                      <span>{new Date(n.postedDate).toLocaleDateString(isEn ? 'en-US' : 'hi-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => readAloudNotice(n)}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl transition-colors shrink-0"
                    title="Audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 mt-3 leading-relaxed">
                  {isEn ? (n.contentEn || n.content) : n.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB: HELPLINE DIRECTORY */}
      {activeTab === 'helpline' && (
        <section aria-label="Helpline Directory" className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-7 max-w-4xl mx-auto space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">
              {t('helplineTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {t('helplineSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                {t('rolePradhan')}
              </span>
              <p className="font-bold text-stone-900 text-sm mt-1">{isEn ? (profile.pradhanNameEn || profile.pradhanName) : profile.pradhanName}</p>
              <a
                href={`tel:${profile.pradhanPhone}`}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mt-2 hover:underline font-mono"
              >
                <Phone className="w-3.5 h-3.5" />
                {profile.pradhanPhone}
              </a>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                {t('roleSecretary')}
              </span>
              <p className="font-bold text-stone-900 text-sm mt-1">{isEn ? (profile.secretaryNameEn || profile.secretaryName) : profile.secretaryName}</p>
              <a
                href={`tel:${profile.secretaryPhone}`}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mt-2 hover:underline font-mono"
              >
                <Phone className="w-3.5 h-3.5" />
                {profile.secretaryPhone}
              </a>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                {t('roleElectrician')}
              </span>
              <p className="font-bold text-stone-900 text-sm mt-1">{isEn ? 'Electricity Lineman' : 'विद्युत लाइनमैन'}</p>
              <a
                href="tel:+919800022003"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mt-2 hover:underline font-mono"
              >
                <Phone className="w-3.5 h-3.5" />
                +91 98000 22003
              </a>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                {t('roleWaterTech')}
              </span>
              <p className="font-bold text-stone-900 text-sm mt-1">{isEn ? 'Water Supply Technician' : 'जल मिस्त्री'}</p>
              <a
                href="tel:+919800022002"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mt-2 hover:underline font-mono"
              >
                <Phone className="w-3.5 h-3.5" />
                +91 98000 22002
              </a>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                {t('roleSanitation')}
              </span>
              <p className="font-bold text-stone-900 text-sm mt-1">{isEn ? 'Chief Sanitation Worker' : 'सफाई कर्मी'}</p>
              <a
                href="tel:+919800022001"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mt-2 hover:underline font-mono"
              >
                <Phone className="w-3.5 h-3.5" />
                +91 98000 22001
              </a>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                {t('roleHealth')}
              </span>
              <p className="font-bold text-stone-900 text-sm mt-1">{isEn ? 'ASHA Health Worker' : 'आशा स्वास्थ्य कार्यकर्ता'}</p>
              <a
                href="tel:+919800022004"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mt-2 hover:underline font-mono"
              >
                <Phone className="w-3.5 h-3.5" />
                +91 98000 22004
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
