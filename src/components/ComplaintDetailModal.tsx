import React, { useState } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { ComplaintStatus, PriorityLevel } from '../types';
import { CATEGORY_DETAILS } from '../data/initialData';
import {
  X,
  Volume2,
  CheckCircle2,
  Clock,
  User,
  Phone,
  MapPin,
  Calendar,
  ThumbsUp,
  Send,
  AlertCircle,
  Briefcase,
  Share2,
} from 'lucide-react';

export const ComplaintDetailModal: React.FC = () => {
  const {
    complaints,
    selectedComplaintId,
    setSelectedComplaintId,
    viewMode,
    employees,
    updateComplaintStatus,
    assignComplaintEmployee,
    upvoteComplaint,
    readAloudComplaint,
    deleteComplaint,
    language,
    getText,
    t,
  } = usePanchayat();

  const isEn = language === 'en';

  // Admin inline form state
  const [adminNote, setAdminNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>('in_progress');
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [officerNameInput, setOfficerNameInput] = useState('');
  const [officerRoleInput, setOfficerRoleInput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  if (!selectedComplaintId) return null;

  const complaint = complaints.find((c) => c.id === selectedComplaintId);
  if (!complaint) return null;

  const catInfo = CATEGORY_DETAILS[complaint.category] || CATEGORY_DETAILS.other;
  const categoryLabel = isEn ? catInfo.labelEn : catInfo.labelHi;

  const statusMap: Record<ComplaintStatus, { label: string; color: string; bg: string }> = {
    pending: {
      label: isEn ? 'Pending (Verification Underway)' : 'लंबित (सत्यापन जारी)',
      color: 'text-amber-800',
      bg: 'bg-amber-50 border-amber-200',
    },
    under_review: {
      label: isEn ? 'Under Review (Staff Assigned)' : 'समीक्षाधीन (अधिकारी आवंटित)',
      color: 'text-blue-800',
      bg: 'bg-blue-50 border-blue-200',
    },
    in_progress: {
      label: isEn ? 'In Progress (Active Work)' : 'कार्य प्रगति पर (मरम्मत जारी)',
      color: 'text-indigo-800',
      bg: 'bg-indigo-50 border-indigo-200',
    },
    resolved: {
      label: isEn ? 'Resolved (Completed)' : 'पूर्ण रूप से निस्तारित (सफल)',
      color: 'text-emerald-800',
      bg: 'bg-emerald-50 border-emerald-200',
    },
    rejected: {
      label: isEn ? 'Rejected / Dismissed' : 'अस्वीकृत / निरस्त',
      color: 'text-red-800',
      bg: 'bg-red-50 border-red-200',
    },
  };

  const priorityMap: Record<PriorityLevel, { label: string; textClass: string }> = {
    urgent: {
      label: isEn ? 'Urgent (24h Priority)' : 'अति आवश्यक (24 घंटे)',
      textClass: 'text-red-600 font-semibold',
    },
    high: {
      label: isEn ? 'High Priority' : 'उच्च प्राथमिकता',
      textClass: 'text-amber-600 font-medium',
    },
    medium: {
      label: isEn ? 'Medium' : 'मध्यम',
      textClass: 'text-stone-600 font-medium',
    },
    low: {
      label: isEn ? 'Normal' : 'सामान्य',
      textClass: 'text-stone-500 font-normal',
    },
  };

  const currentStatus = statusMap[complaint.status];
  const currentPriority = priorityMap[complaint.priority];

  const handleAdminUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNote.trim()) {
      alert(isEn ? 'Please write the action report note.' : 'कृपया कार्रवाई विवरण या प्रगति नोट लिखें।');
      return;
    }
    updateComplaintStatus(
      complaint.id,
      selectedStatus,
      officerNameInput || (isEn ? 'Panchayat Officer' : 'ग्राम पंचायत अधिकारी'),
      officerRoleInput || 'Admin',
      adminNote
    );
    setAdminNote('');
  };

  const handleAssignEmployee = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const empId = e.target.value;
    setSelectedEmpId(empId);
    if (empId) {
      assignComplaintEmployee(complaint.id, empId);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      const shareTitle = isEn ? (complaint.titleEn || complaint.title) : complaint.title;
      navigator.clipboard.writeText(
        `${isEn ? 'Grievance ID' : 'ग्राम समाधान शिकायत सं'}: ${complaint.id} - ${shareTitle} (${currentStatus.label})`
      );
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const titleText = isEn ? (complaint.titleEn || complaint.title) : complaint.title;
  const descriptionText = isEn ? (complaint.descriptionEn || complaint.description) : complaint.description;
  const citizenName = isEn ? (complaint.citizenNameEn || complaint.citizenName) : complaint.citizenName;
  const wardName = isEn ? (complaint.wardEn || complaint.ward) : complaint.ward;
  const locationDetails = isEn ? (complaint.locationDetailsEn || complaint.locationDetails) : complaint.locationDetails;
  const departmentName = isEn ? (complaint.assignedDepartmentEn || complaint.assignedDepartment) : complaint.assignedDepartment;
  const employeeName = isEn ? (complaint.assignedEmployeeNameEn || complaint.assignedEmployeeName) : complaint.assignedEmployeeName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50/70 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap text-xs text-stone-500 mb-1">
              <span className="font-mono font-semibold text-stone-800 bg-stone-200/80 px-2 py-0.5 rounded">
                {complaint.id}
              </span>
              <span>·</span>
              <span>{categoryLabel}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(complaint.dateSubmitted).toLocaleDateString(isEn ? 'en-US' : 'hi-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
              {titleText}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => readAloudComplaint(complaint)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              title={isEn ? 'Listen in Voice' : 'आवाज में सुनें'}
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isEn ? 'Listen in Voice' : 'आवाज में सुनें'}</span>
            </button>
            <button
              onClick={() => setSelectedComplaintId(null)}
              className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Strip */}
        <div className="px-4 sm:px-5 py-3 border-b border-stone-200 bg-stone-50 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-medium">
              {isEn ? 'Current Status:' : 'वर्तमान स्थिति:'}
            </span>
            <span className={`px-2.5 py-1 rounded-md border font-semibold ${currentStatus.bg} ${currentStatus.color}`}>
              {currentStatus.label}
            </span>
          </div>

          <div className="flex items-center gap-3 text-stone-600">
            <span>
              {isEn ? 'Priority:' : 'प्राथमिकता:'} <span className={currentPriority.textClass}>{currentPriority.label}</span>
            </span>
            <span>·</span>
            <button
              onClick={() => upvoteComplaint(complaint.id)}
              className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-semibold"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{complaint.upvotes} {isEn ? 'Citizens Endorsed' : 'ग्रामीणों का समर्थन'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[calc(85vh-160px)] overflow-y-auto">
          {/* Main Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              {t('modalDetailsTitle')}
            </h4>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
              {descriptionText}
            </div>

            {complaint.voiceNoteTranscript && (
              <div className="mt-2 text-xs text-stone-600 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-start gap-2">
                <span className="font-semibold text-amber-900 shrink-0">
                  {t('modalVoiceNoteTitle')}
                </span>
                <span className="italic text-stone-700">"{complaint.voiceNoteTranscript}"</span>
              </div>
            )}
          </div>

          {/* Citizen & Location Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-stone-200 bg-white">
              <span className="text-stone-500 block mb-1 font-medium">
                {t('citizenDetailsHeader')}
              </span>
              <div className="flex items-center gap-2 font-semibold text-stone-900">
                <User className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{citizenName}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600 mt-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <a href={`tel:${complaint.citizenPhone}`} className="hover:underline text-emerald-800 font-semibold">
                  {complaint.citizenPhone}
                </a>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-stone-200 bg-white">
              <span className="text-stone-500 block mb-1 font-medium">
                {t('locationWardHeader')}
              </span>
              <div className="flex items-center gap-2 font-semibold text-stone-900">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <span>{wardName}</span>
              </div>
              <p className="text-stone-600 mt-1 text-[11px] truncate" title={locationDetails}>
                {locationDetails || (isEn ? 'Location details attached' : 'स्थान विवरण संलग्न')}
              </p>
            </div>
          </div>

          {/* Assigned Officer / Staff Box */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                  {isEn ? 'Assigned Department & Staff' : 'नियुक्त विभाग एवं कर्मचारी'}
                </span>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span className="text-sm font-bold text-stone-900">{departmentName}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-stone-700">
                  <span>{isEn ? 'Assigned Person:' : 'प्रभारी कर्मचारी:'}</span>
                  {employeeName ? (
                    <span className="font-semibold text-emerald-950 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded">
                      {employeeName}
                    </span>
                  ) : (
                    <span className="italic text-stone-500">
                      {isEn ? 'Assignment in progress' : 'अभी कोई कर्मचारी नियुक्त नहीं'}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Reassign Dropdown for Admin */}
              {viewMode === 'admin' && (
                <div className="text-xs mt-2 sm:mt-0">
                  <label htmlFor="reassign-officer-select" className="text-stone-500 block mb-1 font-medium">
                    {isEn ? 'Assign / Change Staff:' : 'कर्मचारी बदलें / नियुक्त करें:'}
                  </label>
                  <select
                    id="reassign-officer-select"
                    value={complaint.assignedEmployeeId || selectedEmpId}
                    onChange={handleAssignEmployee}
                    className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="">{isEn ? '-- Select Staff --' : '-- कर्मचारी चुनें --'}</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {isEn ? (emp.nameEn || emp.name) : emp.name} ({isEn ? (emp.designationEn || emp.designation) : emp.designation})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Action Taken Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  {t('timelineHeader')}
                </h4>
                <p className="text-xs text-stone-500">
                  {t('timelineSubtitle')}
                </p>
              </div>
              <span className="text-xs font-mono font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                {complaint.timeline.length} {isEn ? 'Updates' : 'अपडेट्स'}
              </span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {complaint.timeline.map((item, idx) => {
                const isLatest = idx === complaint.timeline.length - 1;
                const badgeInfo = statusMap[item.statusBadge] || statusMap.pending;
                const itemTitle = isEn ? (item.titleEn || item.title) : item.title;
                const itemNote = isEn ? (item.noteEn || item.note) : item.note;
                const itemOfficer = isEn ? (item.officerNameEn || item.officerName) : item.officerName;
                const itemRole = isEn ? (item.officerRoleEn || item.officerRole) : item.officerRole;

                return (
                  <div key={item.id} className="relative">
                    <div
                      className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        isLatest
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-stone-400'
                      }`}
                    >
                      {isLatest && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>

                    <div className="bg-stone-50 border border-stone-200/90 rounded-xl p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="font-bold text-stone-900 text-xs sm:text-sm">
                          {itemTitle}
                        </span>
                        <span className="text-stone-400 font-mono text-[11px]">
                          {new Date(item.timestamp).toLocaleString(isEn ? 'en-US' : 'hi-IN', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>

                      <p className="text-stone-700 text-xs leading-relaxed">
                        {itemNote}
                      </p>

                      <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-200/60 mt-1">
                        <span>
                          {isEn ? 'Officer:' : 'अधिकारी:'} <strong className="text-stone-700">{itemOfficer}</strong> ({itemRole})
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${badgeInfo.bg} ${badgeInfo.color}`}>
                          {badgeInfo.label.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Admin Action Form */}
          {viewMode === 'admin' && (
            <div className="border-t border-stone-200 pt-5 mt-4 bg-emerald-50/50 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 p-4 sm:p-6 rounded-b-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-emerald-800" />
                <h4 className="text-xs sm:text-sm font-bold text-emerald-950 uppercase tracking-wider">
                  {t('adminActionHeader')}
                </h4>
              </div>

              <form onSubmit={handleAdminUpdate} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="new-complaint-status-select" className="text-stone-700 font-semibold block mb-1">
                      {t('newStatusLabel')}
                    </label>
                    <select
                      id="new-complaint-status-select"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2 font-medium text-stone-800"
                    >
                      <option value="pending">{isEn ? 'Pending' : 'लंबित (Pending)'}</option>
                      <option value="under_review">{isEn ? 'Under Review' : 'समीक्षाधीन (Under Review)'}</option>
                      <option value="in_progress">{isEn ? 'In Progress' : 'कार्य प्रगति पर (In Progress)'}</option>
                      <option value="resolved">{isEn ? 'Resolved' : 'पूर्ण निस्तारित (Resolved)'}</option>
                      <option value="rejected">{isEn ? 'Rejected' : 'अस्वीकृत (Rejected)'}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="officer-name-input" className="text-stone-700 font-semibold block mb-1">
                      {t('officerNameLabel')}
                    </label>
                    <input
                      id="officer-name-input"
                      type="text"
                      placeholder={isEn ? 'e.g. Officer Name' : 'उदा. अधिकारी का नाम'}
                      value={officerNameInput}
                      onChange={(e) => setOfficerNameInput(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-800"
                    />
                  </div>

                  <div>
                    <label htmlFor="officer-role-input" className="text-stone-700 font-semibold block mb-1">
                      {t('officerRoleLabel')}
                    </label>
                    <input
                      id="officer-role-input"
                      type="text"
                      placeholder={isEn ? 'e.g. Secretary / Supervisor' : 'उदा. ग्राम विकास अधिकारी / लाइनमैन'}
                      value={officerRoleInput}
                      onChange={(e) => setOfficerRoleInput(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="action-report-note-textarea" className="text-stone-700 font-semibold block mb-1">
                    {t('actionReportNoteLabel')}
                  </label>
                  <textarea
                    id="action-report-note-textarea"
                    rows={2}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder={isEn ? 'e.g. Staff dispatched with replacement parts. Work underway...' : 'उदा. मौके पर टीम पहुंच गई है और मरम्मत कार्य शुरू कर दिया गया है...'}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-800 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(isEn ? 'Are you sure you want to delete this complaint?' : 'क्या आप सचमुच इस शिकायत को हटाना चाहते हैं?')) {
                        deleteComplaint(complaint.id);
                      }
                    }}
                    className="text-red-700 hover:text-red-900 font-medium text-xs hover:underline"
                  >
                    {t('deleteComplaintBtn')}
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t('saveActionBtn')}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 font-medium"
          >
            <Share2 className="w-4 h-4" />
            <span>{copySuccess ? t('copiedText') : t('shareCopy')}</span>
          </button>

          <button
            onClick={() => setSelectedComplaintId(null)}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-lg transition-colors"
          >
            {t('closeModal')}
          </button>
        </div>
      </div>
    </div>
  );
};
