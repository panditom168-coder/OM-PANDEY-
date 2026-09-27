import React, { useState } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { Employee, Complaint, Notice, Ward, ComplaintStatus, PriorityLevel, ComplaintCategory } from '../types';
import { CATEGORY_DETAILS } from '../data/initialData';
import {
  Users,
  FileText,
  Bell,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Search,
  Filter,
  UserPlus,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
  Volume2,
  RotateCcw,
  Check,
  X,
  Eye,
  EyeOff,
  Shield,
  BarChart3,
  Lock,
  KeyRound,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    complaints,
    employees,
    notices,
    wards,
    profile,
    adminActiveTab,
    setAdminActiveTab,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    updateComplaint,
    updateComplaintStatus,
    assignComplaintEmployee,
    deleteComplaint,
    addNotice,
    updateNotice,
    deleteNotice,
    updatePanchayatProfile,
    addWard,
    updateWard,
    deleteWard,
    setSelectedComplaintId,
    readAloudComplaint,
    exportComplaintsCSV,
    resetAllData,
    changeAdminPin,
    lockAdmin,
    language,
    getText,
    t,
  } = usePanchayat();

  const isEn = language === 'en';

  // Sub-tab search/filters
  const [complaintSearch, setComplaintSearch] = useState('');
  const [complaintStatusFilter, setComplaintStatusFilter] = useState<string>('all');
  const [complaintDeptFilter, setComplaintDeptFilter] = useState<string>('all');

  // Employee Modals
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Notice Modals
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // Quick Action Modal (Update Status & Action Report)
  const [quickActionComplaint, setQuickActionComplaint] = useState<Complaint | null>(null);
  const [quickStatus, setQuickStatus] = useState<ComplaintStatus>('in_progress');
  const [quickNote, setQuickNote] = useState('');
  const [quickOfficerName, setQuickOfficerName] = useState(profile.pradhanName);
  const [quickOfficerRole, setQuickOfficerRole] = useState(isEn ? 'Pradhan' : 'ग्राम प्रधान');

  // Employee Form State
  const [empName, setEmpName] = useState('');
  const [empDesignation, setEmpDesignation] = useState('');
  const [empDepartment, setEmpDepartment] = useState('स्वच्छ भारत ग्रामीण एवं सफाई प्रकोष्ठ');
  const [empPhone, setEmpPhone] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empSpecialization, setEmpSpecialization] = useState('');
  const [empStatus, setEmpStatus] = useState<'active' | 'on_leave' | 'transferred'>('active');
  const [empWards, setEmpWards] = useState<string[]>(['समस्त ग्राम पंचायत']);

  // Notice Form State
  const [notTitle, setNotTitle] = useState('');
  const [notContent, setNotContent] = useState('');
  const [notCategory, setNotCategory] = useState<'announcement' | 'scheme' | 'meeting' | 'emergency'>('announcement');
  const [notPostedBy, setNotPostedBy] = useState(profile.pradhanName);
  const [notIsUrgent, setNotIsUrgent] = useState(false);

  // Ward Form State
  const [isAddWardOpen, setIsAddWardOpen] = useState(false);
  const [wardName, setWardName] = useState('');
  const [wardArea, setWardArea] = useState('');
  const [wardRep, setWardRep] = useState('');
  const [wardPhone, setWardPhone] = useState('');

  // Profile Edit State
  const [editProfileData, setEditProfileData] = useState(profile);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // PIN Change State
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinChangeMsg, setPinChangeMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleOpenEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setEmpName(isEn ? (emp.nameEn || emp.name) : emp.name);
    setEmpDesignation(isEn ? (emp.designationEn || emp.designation) : emp.designation);
    setEmpDepartment(emp.department);
    setEmpPhone(emp.phone);
    setEmpEmail(emp.email || '');
    setEmpSpecialization(isEn ? (emp.specializationEn || emp.specialization || '') : (emp.specialization || ''));
    setEmpStatus(emp.status);
    setEmpWards(emp.assignedWards);
    setIsAddEmployeeOpen(true);
  };

  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !empDesignation.trim() || !empPhone.trim()) {
      alert(isEn ? 'Please fill employee name, designation and phone number.' : 'कृपया कर्मचारी का नाम, पद और फोन नंबर अवश्य भरें।');
      return;
    }

    if (editingEmployee) {
      await updateEmployee({
        ...editingEmployee,
        name: empName,
        nameEn: isEn ? empName : editingEmployee.nameEn,
        designation: empDesignation,
        designationEn: isEn ? empDesignation : editingEmployee.designationEn,
        department: empDepartment,
        departmentEn: isEn ? (empDepartment.includes('Water') ? 'Water Supply' : empDepartment.includes('विद्युत') ? 'Electricity' : 'Sanitation') : undefined,
        phone: empPhone,
        email: empEmail,
        specialization: empSpecialization,
        specializationEn: isEn ? empSpecialization : editingEmployee.specializationEn,
        status: empStatus,
        assignedWards: empWards,
      });
    } else {
      await addEmployee({
        name: empName,
        nameEn: isEn ? empName : undefined,
        designation: empDesignation,
        designationEn: isEn ? empDesignation : undefined,
        department: empDepartment,
        departmentEn: isEn ? 'Panchayat Services' : undefined,
        phone: empPhone,
        email: empEmail,
        specialization: empSpecialization,
        specializationEn: isEn ? empSpecialization : undefined,
        status: empStatus,
        assignedWards: empWards,
        joiningDate: new Date().toISOString().slice(0, 10),
      });
    }

    setIsAddEmployeeOpen(false);
    setEditingEmployee(null);
    setEmpName('');
    setEmpDesignation('');
    setEmpPhone('');
    setEmpSpecialization('');
  };

  const handleOpenQuickAction = (c: Complaint) => {
    setQuickActionComplaint(c);
    setQuickStatus(c.status === 'pending' ? 'under_review' : c.status === 'under_review' ? 'in_progress' : 'resolved');
    setQuickNote('');
    setQuickOfficerName(isEn ? (c.assignedEmployeeNameEn || c.assignedEmployeeName || profile.pradhanName) : (c.assignedEmployeeName || profile.pradhanName));
    setQuickOfficerRole(isEn ? 'Officer' : 'प्रशासन');
  };

  const handleSaveQuickAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickActionComplaint || !quickNote.trim()) {
      alert(isEn ? 'Please fill in the action progress note.' : 'कृपया कार्रवाई विवरण या प्रगति नोट भरें।');
      return;
    }

    await updateComplaintStatus(
      quickActionComplaint.id,
      quickStatus,
      quickOfficerName,
      quickOfficerRole,
      quickNote
    );
    setQuickActionComplaint(null);
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notTitle.trim() || !notContent.trim()) {
      alert(isEn ? 'Please fill title and content.' : 'कृपया सूचना का शीर्षक और विवरण भरें।');
      return;
    }

    if (editingNotice) {
      await updateNotice({
        ...editingNotice,
        title: notTitle,
        titleEn: isEn ? notTitle : editingNotice.titleEn,
        content: notContent,
        contentEn: isEn ? notContent : editingNotice.contentEn,
        category: notCategory,
        postedBy: notPostedBy,
        postedByEn: isEn ? notPostedBy : editingNotice.postedByEn,
        isUrgent: notIsUrgent,
      });
    } else {
      await addNotice({
        title: notTitle,
        titleEn: isEn ? notTitle : undefined,
        content: notContent,
        contentEn: isEn ? notContent : undefined,
        category: notCategory,
        postedBy: notPostedBy,
        postedByEn: isEn ? notPostedBy : undefined,
        isUrgent: notIsUrgent,
      });
    }

    setIsAddNoticeOpen(false);
    setEditingNotice(null);
    setNotTitle('');
    setNotContent('');
  };

  const handleSaveWard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wardName.trim()) return;

    await addWard({
      number: wards.length + 1,
      name: wardName,
      nameEn: isEn ? wardName : undefined,
      area: wardArea,
      areaEn: isEn ? wardArea : undefined,
      representative: wardRep,
      representativeEn: isEn ? wardRep : undefined,
      phone: wardPhone,
    });

    setIsAddWardOpen(false);
    setWardName('');
    setWardArea('');
    setWardRep('');
    setWardPhone('');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePanchayatProfile(editProfileData);
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length < 4) {
      setPinChangeMsg({ text: isEn ? 'New PIN must be at least 4 digits.' : 'नया गुप्त पिन कम से कम 4 अंकों का होना चाहिए।', isError: true });
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinChangeMsg({ text: isEn ? 'New PIN and Confirm PIN do not match.' : 'नया पिन और पुष्टि पिन आपस में मेल नहीं खा रहे हैं।', isError: true });
      return;
    }
    const res = await changeAdminPin(oldPinInput, newPinInput);
    if (res.success) {
      setPinChangeMsg({
        text: isEn ? 'Secret PIN updated successfully! Only you can access now.' : 'गोपनीय सुरक्षा पिन सफलतापूर्वक बदल गया! अब केवल आप ही नए पिन से प्रवेश कर सकेंगे।',
        isError: false,
      });
      setOldPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    } else {
      setPinChangeMsg({ text: res.message || (isEn ? 'Current PIN is incorrect.' : 'वर्तमान सुरक्षा पिन गलत है।'), isError: true });
    }
  };

  // Metrics
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter((c) => c.status === 'pending').length;
  const inProgressComplaints = complaints.filter((c) => c.status === 'in_progress').length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'resolved').length;

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (complaintStatusFilter !== 'all' && c.status !== complaintStatusFilter) return false;
    if (complaintDeptFilter !== 'all' && c.assignedDepartment !== complaintDeptFilter) return false;
    if (complaintSearch.trim()) {
      const q = complaintSearch.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        (c.titleEn && c.titleEn.toLowerCase().includes(q)) ||
        c.citizenName.toLowerCase().includes(q) ||
        c.ward.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.assignedEmployeeName && c.assignedEmployeeName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Stats Overview */}
      <div className="bg-stone-900 text-white rounded-2xl p-5 sm:p-7 border border-stone-800 shadow-md">
        <div className="flex items-start justify-between gap-4 flex-wrap pb-5 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {t('adminTitle')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              {t('adminSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportComplaintsCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-semibold border border-stone-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-stone-300" />
              <span>{t('downloadCSV')}</span>
            </button>
            <button
              onClick={lockAdmin}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-red-950/70 text-stone-300 hover:text-red-300 rounded-xl text-xs font-semibold border border-stone-700 transition-colors"
              title={t('lockAdmin')}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('lockAdmin')}</span>
            </button>
            <button
              onClick={resetAllData}
              title={t('resetData')}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors border border-stone-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 Tabular Stat Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-5 text-xs">
          <div className="p-3 rounded-xl bg-stone-800/60 border border-stone-700/60">
            <span className="text-stone-400 block text-[11px]">{t('metricTotal')}</span>
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{totalComplaints}</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/40">
            <span className="text-amber-400 block text-[11px]">{t('metricPending')}</span>
            <span className="text-2xl font-bold font-mono text-amber-300 tabular-nums">{pendingComplaints}</span>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/40">
            <span className="text-blue-400 block text-[11px]">{t('metricInProgress')}</span>
            <span className="text-2xl font-bold font-mono text-blue-300 tabular-nums">{inProgressComplaints}</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/40">
            <span className="text-emerald-400 block text-[11px]">{t('metricResolved')}</span>
            <span className="text-2xl font-bold font-mono text-emerald-300 tabular-nums">{resolvedComplaints}</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-800/60 border border-stone-700/60">
            <span className="text-stone-400 block text-[11px]">{t('metricStaff')}</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{employees.length}</span>
          </div>
        </div>
      </div>

      {/* Admin Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-px">
        <button
          onClick={() => setAdminActiveTab('complaints')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            adminActiveTab === 'complaints'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t('adminTabComplaints')} ({complaints.length})</span>
        </button>

        <button
          onClick={() => setAdminActiveTab('employees')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            adminActiveTab === 'employees'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('adminTabEmployees')} ({employees.length})</span>
        </button>

        <button
          onClick={() => setAdminActiveTab('notices')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            adminActiveTab === 'notices'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>{t('adminTabNotices')} ({notices.length})</span>
        </button>

        <button
          onClick={() => setAdminActiveTab('wards')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            adminActiveTab === 'wards'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t('adminTabSettings')} ({wards.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: COMPLAINTS MASTER & ACTIONS */}
      {adminActiveTab === 'complaints' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={isEn ? 'Search complaint, citizen or officer...' : 'शिकायत, नागरिक या कर्मचारी खोजें...'}
                value={complaintSearch}
                onChange={(e) => setComplaintSearch(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <select
                aria-label="Filter by Status"
                value={complaintStatusFilter}
                onChange={(e) => setComplaintStatusFilter(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-stone-800"
              >
                <option value="all">{isEn ? 'All Status' : 'सभी स्थितियां'}</option>
                <option value="pending">{isEn ? 'Pending' : 'लंबित (Pending)'}</option>
                <option value="under_review">{isEn ? 'Under Review' : 'समीक्षाधीन (Under Review)'}</option>
                <option value="in_progress">{isEn ? 'In Progress' : 'कार्य प्रगति पर (In Progress)'}</option>
                <option value="resolved">{isEn ? 'Resolved' : 'पूर्ण निस्तारित (Resolved)'}</option>
                <option value="rejected">{isEn ? 'Rejected' : 'अस्वीकृत (Rejected)'}</option>
              </select>
            </div>

            <div>
              <select
                aria-label="Filter by Department"
                value={complaintDeptFilter}
                onChange={(e) => setComplaintDeptFilter(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-stone-800"
              >
                <option value="all">{isEn ? 'All Departments' : 'सभी विभाग'}</option>
                <option value="विद्युत वितरण निगम">{isEn ? 'Electricity Distribution' : 'विद्युत वितरण निगम'}</option>
                <option value="ग्रामीण पेयजल आपूर्ति (जल जीवन मिशन)">{isEn ? 'Water Supply (JJM)' : 'ग्रामीण पेयजल आपूर्ति (जल जीवन मिशन)'}</option>
                <option value="स्वच्छ भारत ग्रामीण एवं सफाई प्रकोष्ठ">{isEn ? 'Sanitation Cell' : 'स्वच्छ भारत ग्रामीण एवं सफाई प्रकोष्ठ'}</option>
                <option value="ग्राम पंचायत सड़क एवं निर्माण सेल">{isEn ? 'Roads & Civil Works' : 'सड़क एवं निर्माण सेल'}</option>
                <option value="राष्ट्रीय ग्रामीण स्वास्थ्य मिशन (NRHM)">{isEn ? 'Health Mission (NRHM)' : 'स्वास्थ्य मिशन (NRHM)'}</option>
                <option value="ग्राम सचिवालय ई-सेवा केंद्र">{isEn ? 'Secretariat E-Services' : 'ग्राम सचिवालय ई-सेवा केंद्र'}</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 sm:p-4">{isEn ? 'Ticket ID & Date' : 'आईडी व तारीख'}</th>
                  <th className="p-3 sm:p-4">{isEn ? 'Issue & Citizen' : 'समस्या व शिकायतकर्ता'}</th>
                  <th className="p-3 sm:p-4">{isEn ? 'Ward' : 'वार्ड'}</th>
                  <th className="p-3 sm:p-4">{isEn ? 'Assigned Staff' : 'नियुक्त कर्मचारी'}</th>
                  <th className="p-3 sm:p-4">{isEn ? 'Status' : 'स्थिति'}</th>
                  <th className="p-3 sm:p-4 text-right">{isEn ? 'Admin Action' : 'एडमिन कार्रवाई'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-500">
                      {isEn ? 'No complaints found.' : 'कोई शिकायत नहीं मिली।'}
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c) => {
                    const statusBadgeClass =
                      c.status === 'resolved'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : c.status === 'in_progress'
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                        : c.status === 'under_review'
                        ? 'bg-blue-50 border-blue-200 text-blue-800'
                        : 'bg-amber-50 border-amber-200 text-amber-800';

                    const statusDisplay = isEn
                      ? (c.status === 'resolved' ? 'Resolved' : c.status === 'in_progress' ? 'In Progress' : c.status === 'under_review' ? 'Under Review' : 'Pending')
                      : (c.status === 'resolved' ? 'निस्तारित' : c.status === 'in_progress' ? 'प्रगति पर' : c.status === 'under_review' ? 'समीक्षाधीन' : 'लंबित');

                    const titleText = isEn ? (c.titleEn || c.title) : c.title;
                    const citizenText = isEn ? (c.citizenNameEn || c.citizenName) : c.citizenName;
                    const wardText = isEn ? (c.wardEn || c.ward) : c.ward;
                    const empName = isEn ? (c.assignedEmployeeNameEn || c.assignedEmployeeName) : c.assignedEmployeeName;

                    return (
                      <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="p-3 sm:p-4 font-mono font-medium text-stone-700 whitespace-nowrap">
                          <div>{c.id}</div>
                          <span className="text-[10px] text-stone-400 font-sans">
                            {new Date(c.dateSubmitted).toLocaleDateString(isEn ? 'en-US' : 'hi-IN')}
                          </span>
                        </td>

                        <td className="p-3 sm:p-4 max-w-xs">
                          <button
                            onClick={() => setSelectedComplaintId(c.id)}
                            className="font-bold text-stone-900 hover:text-emerald-800 text-left line-clamp-1 text-xs sm:text-sm"
                          >
                            {titleText}
                          </button>
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            {isEn ? 'Citizen:' : 'नागरिक:'} <strong className="text-stone-700">{citizenText}</strong> ({c.citizenPhone})
                          </div>
                        </td>

                        <td className="p-3 sm:p-4 text-stone-700 whitespace-nowrap">
                          {wardText}
                        </td>

                        <td className="p-3 sm:p-4 whitespace-nowrap">
                          {empName ? (
                            <div>
                              <span className="font-semibold text-emerald-950 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                                {empName}
                              </span>
                            </div>
                          ) : (
                            <select
                              aria-label="Assign Staff"
                              onChange={(e) => assignComplaintEmployee(c.id, e.target.value)}
                              className="text-[11px] p-1 border border-stone-300 rounded bg-white text-stone-700"
                            >
                              <option value="">{isEn ? '+ Assign Staff' : '+ कर्मचारी चुनें'}</option>
                              {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                  {isEn ? (emp.nameEn || emp.name) : emp.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>

                        <td className="p-3 sm:p-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${statusBadgeClass}`}>
                            {statusDisplay}
                          </span>
                        </td>

                        <td className="p-3 sm:p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenQuickAction(c)}
                              className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-[11px] font-semibold transition-colors"
                              title={isEn ? 'Update Action' : 'कार्रवाई नोट दर्ज करें'}
                            >
                              {isEn ? 'Action / Status' : 'कार्रवाई / स्थिति'}
                            </button>

                            <button
                              onClick={() => setSelectedComplaintId(c.id)}
                              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded"
                              title={isEn ? 'View Timeline' : 'विस्तृत टाइमलाइन देखें'}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(isEn ? `Delete complaint ${c.id}?` : `क्या आप शिकायत ${c.id} को डिलीट करना चाहते हैं?`)) {
                                  deleteComplaint(c.id);
                                }
                              }}
                              className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: EMPLOYEE MANAGEMENT ("नया कर्मचारी आए तो उसका नाम भी डाल सके") */}
      {adminActiveTab === 'employees' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                {isEn ? 'Staff & Field Worker Management (Full CRUD)' : 'ग्राम पंचायत कर्मचारी एवं स्वच्छता मित्र प्रबंधन'}
              </h3>
              <p className="text-xs text-stone-500">
                {isEn
                  ? 'Add any new staff member, customize names, designations, mobile numbers and assigned wards freely'
                  : 'नया कर्मचारी आने पर नाम, पद, फोन व कार्यक्षेत्र जोड़ें और किसी भी समय संपादित करें'}
              </p>
            </div>

            <button
              onClick={() => {
                setEditingEmployee(null);
                setEmpName('');
                setEmpDesignation('');
                setEmpPhone('');
                setEmpSpecialization('');
                setIsAddEmployeeOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('addNewStaffBtn')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((emp) => {
              const assignedTasksCount = complaints.filter(
                (c) => c.assignedEmployeeId === emp.id && c.status !== 'resolved'
              ).length;
              const resolvedTasksCount = complaints.filter(
                (c) => c.assignedEmployeeId === emp.id && c.status === 'resolved'
              ).length;

              const empDisplayName = isEn ? (emp.nameEn || emp.name) : emp.name;
              const empRole = isEn ? (emp.designationEn || emp.designation) : emp.designation;
              const empDept = isEn ? (emp.departmentEn || emp.department) : emp.department;

              return (
                <div
                  key={emp.id}
                  className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:border-emerald-500/50 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base border border-emerald-200">
                          {empDisplayName.slice(0, 1)}
                        </div>
                        <div>
                          <h4 className="font-bold text-stone-900 text-sm sm:text-base leading-tight">
                            {empDisplayName}
                          </h4>
                          <p className="text-xs text-emerald-800 font-medium mt-0.5">
                            {empRole}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          emp.status === 'active'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}
                      >
                        {isEn
                          ? (emp.status === 'active' ? 'Active' : 'On Leave')
                          : (emp.status === 'active' ? 'सक्रिय ड्यूटी' : 'अवकाश पर')}
                      </span>
                    </div>

                    <div className="mt-3.5 space-y-1.5 text-xs text-stone-600">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{empDept}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <a href={`tel:${emp.phone}`} className="text-emerald-800 font-semibold hover:underline">
                          {emp.phone}
                        </a>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-stone-500 line-clamp-1">
                          {emp.assignedWards.join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-stone-50 p-1.5 rounded-lg border border-stone-100">
                        <span className="text-[10px] text-stone-400 block">{isEn ? 'Active Work' : 'सक्रिय कार्य'}</span>
                        <strong className="text-stone-900 font-mono tabular-nums">{assignedTasksCount}</strong>
                      </div>
                      <div className="bg-stone-50 p-1.5 rounded-lg border border-stone-100">
                        <span className="text-[10px] text-stone-400 block">{isEn ? 'Resolved' : 'निस्तारित कार्य'}</span>
                        <strong className="text-emerald-700 font-mono tabular-nums">{resolvedTasksCount}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleOpenEditEmployee(emp)}
                      className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-semibold hover:underline"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{t('editStaffBtn')}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(isEn ? `Remove staff member '${empDisplayName}'?` : `क्या आप कर्मचारी '${empDisplayName}' को हटाना चाहते हैं?`)) {
                          deleteEmployee(emp.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete Staff"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: NOTICES MANAGEMENT */}
      {adminActiveTab === 'notices' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                {isEn ? 'Village Notice Board Control' : 'ग्राम पंचायत सूचना व मुनादी नियंत्रण'}
              </h3>
              <p className="text-xs text-stone-500">
                {isEn ? 'Issue, edit or remove notices and announcements for citizens' : 'ग्रामीणों के लिए पानी, राशन, बैठक व सरकारी योजनाओं की सूचना जारी व संपादित करें'}
              </p>
            </div>

            <button
              onClick={() => {
                setEditingNotice(null);
                setNotTitle('');
                setNotContent('');
                setIsAddNoticeOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addNewNoticeBtn')}</span>
            </button>
          </div>

          <div className="space-y-3">
            {notices.map((n) => (
              <div
                key={n.id}
                className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    {n.isUrgent && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded">
                        {isEn ? 'URGENT' : 'अति आवश्यक'}
                      </span>
                    )}
                    <span className="text-xs text-stone-400 font-mono">
                      {new Date(n.postedDate).toLocaleDateString(isEn ? 'en-US' : 'hi-IN')}
                    </span>
                    <span className="text-xs text-stone-400">·</span>
                    <span className="text-xs text-stone-600 font-medium">
                      {isEn ? 'Issued by:' : 'जारीकर्ता:'} {isEn ? (n.postedByEn || n.postedBy) : n.postedBy}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-stone-900">
                    {isEn ? (n.titleEn || n.title) : n.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {isEn ? (n.contentEn || n.content) : n.content}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingNotice(n);
                      setNotTitle(isEn ? (n.titleEn || n.title) : n.title);
                      setNotContent(isEn ? (n.contentEn || n.content) : n.content);
                      setNotCategory(n.category);
                      setNotPostedBy(isEn ? (n.postedByEn || n.postedBy) : n.postedBy);
                      setNotIsUrgent(n.isUrgent);
                      setIsAddNoticeOpen(true);
                    }}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(isEn ? 'Delete this notice?' : 'क्या आप इस सूचना को हटाना चाहते हैं?')) {
                        deleteNotice(n.id);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PANCHAYAT SETTINGS & WARDS */}
      {adminActiveTab === 'wards' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Edit Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-stone-900">
                  {isEn ? 'Panchayat Profile & Official Names' : 'ग्राम पंचायत प्रोफाइल व पदाधिकारी विवरण'}
                </h3>
                <p className="text-xs text-stone-500">
                  {isEn ? 'Customize Gram Panchayat name, Pradhan and Secretary details freely' : 'ग्राम प्रधान, पंचायत सचिव व बुनियादी जानकारी संपादित करें'}
                </p>
              </div>

              {profileSaveSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-950 text-xs font-semibold rounded-lg border border-emerald-200">
                  {isEn ? '✓ Profile saved successfully!' : '✓ ग्राम पंचायत प्रोफाइल सफलतापूर्वक सुरक्षित हो गई!'}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      {isEn ? 'Panchayat Name:' : 'ग्राम पंचायत का नाम:'}
                    </label>
                    <input
                      type="text"
                      value={isEn ? (editProfileData.villageNameEn || editProfileData.villageName) : editProfileData.villageName}
                      onChange={(e) => {
                        if (isEn) {
                          setEditProfileData({ ...editProfileData, villageNameEn: e.target.value, villageName: e.target.value });
                        } else {
                          setEditProfileData({ ...editProfileData, villageName: e.target.value });
                        }
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      {isEn ? 'Block:' : 'विकास खंड (Block):'}
                    </label>
                    <input
                      type="text"
                      value={isEn ? (editProfileData.blockEn || editProfileData.block) : editProfileData.block}
                      onChange={(e) => setEditProfileData({ ...editProfileData, block: e.target.value, blockEn: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      {isEn ? 'Pradhan Name:' : 'ग्राम प्रधान का नाम:'}
                    </label>
                    <input
                      type="text"
                      value={isEn ? (editProfileData.pradhanNameEn || editProfileData.pradhanName) : editProfileData.pradhanName}
                      onChange={(e) => setEditProfileData({ ...editProfileData, pradhanName: e.target.value, pradhanNameEn: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      {isEn ? 'Pradhan Phone:' : 'प्रधान का फोन नंबर:'}
                    </label>
                    <input
                      type="text"
                      value={editProfileData.pradhanPhone}
                      onChange={(e) => setEditProfileData({ ...editProfileData, pradhanPhone: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      {isEn ? 'Secretary Name:' : 'पंचायत सचिव का नाम:'}
                    </label>
                    <input
                      type="text"
                      value={isEn ? (editProfileData.secretaryNameEn || editProfileData.secretaryName) : editProfileData.secretaryName}
                      onChange={(e) => setEditProfileData({ ...editProfileData, secretaryName: e.target.value, secretaryNameEn: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      {isEn ? 'Secretary Phone:' : 'सचिव का फोन नंबर:'}
                    </label>
                    <input
                      type="text"
                      value={editProfileData.secretaryPhone}
                      onChange={(e) => setEditProfileData({ ...editProfileData, secretaryPhone: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold transition-colors"
                  >
                    {t('saveProfileBtn')}
                  </button>
                </div>
              </form>
            </div>

            {/* Wards Management */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {isEn ? 'Wards & Local Members' : 'वार्ड व मोहल्ला सूची'} ({wards.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    {isEn ? 'Manage village wards, localities and representatives' : 'ग्राम पंचायत के सभी वार्ड, टोले व प्रतिनिधि'}
                  </p>
                </div>

                <button
                  onClick={() => setIsAddWardOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('addNewWardBtn')}</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {wards.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-900 block">{isEn ? (w.nameEn || w.name) : w.name}</span>
                      <span className="text-stone-500 text-[11px]">
                        {isEn ? (w.areaEn || w.area) : w.area} · {isEn ? 'Rep:' : 'प्रतिनिधि:'} {isEn ? (w.representativeEn || w.representative) : w.representative}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(isEn ? `Delete ${w.nameEn || w.name}?` : `क्या आप ${w.name} को हटाना चाहते हैं?`)) {
                          deleteWard(w.id);
                        }
                      }}
                      className="text-stone-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Admin Security PIN change card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 max-w-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-stone-900">
                  {isEn ? 'Change Admin Security PIN' : 'एडमिन सुरक्षा पासवर्ड / पिन बदलें'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPinInput(!showPinInput)}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium cursor-pointer"
              >
                {showPinInput ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-stone-400" />}
                <span>{showPinInput ? (isEn ? 'Hide' : 'छिपाएं') : (isEn ? 'Show' : 'देखें')}</span>
              </button>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              {isEn
                ? 'Keep your administrative access confidential. You can update your secret PIN anytime so unauthorized persons cannot access.'
                : 'प्रशासनिक नियंत्रण को पूर्णतः गोपनीय रखें। अपनी पसंद का नया गुप्त पिन सेट करें ताकि कोई दूसरा न खोल सके।'}
            </p>

            {pinChangeMsg && (
              <div className={`p-2.5 rounded-xl text-xs mb-3 font-semibold ${pinChangeMsg.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'}`}>
                {pinChangeMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePin} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    {isEn ? 'Current PIN:' : 'वर्तमान पिन:'}
                  </label>
                  <input
                    type={showPinInput ? 'text' : 'password'}
                    required
                    maxLength={6}
                    value={oldPinInput}
                    onChange={(e) => setOldPinInput(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono text-center tracking-[0.2em] text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    {isEn ? 'New Secret PIN:' : 'नया गुप्त पिन:'}
                  </label>
                  <input
                    type={showPinInput ? 'text' : 'password'}
                    required
                    maxLength={6}
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono text-center tracking-[0.2em] text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    {isEn ? 'Confirm PIN:' : 'पुष्टि करें:'}
                  </label>
                  <input
                    type={showPinInput ? 'text' : 'password'}
                    required
                    maxLength={6}
                    value={confirmPinInput}
                    onChange={(e) => setConfirmPinInput(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono text-center tracking-[0.2em] text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
              <div className="pt-1 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold shadow-xs cursor-pointer transition-colors"
                >
                  {isEn ? 'Update Secret PIN' : 'नया पिन सुरक्षित करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT EMPLOYEE */}
      {isAddEmployeeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 p-5 sm:p-6 space-y-4 my-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">
                {editingEmployee ? (isEn ? 'Edit Staff Member' : 'कर्मचारी विवरण संपादित करें') : (isEn ? '+ Add New Staff Member' : '+ नया कर्मचारी / अधिकारी जोड़ें')}
              </h3>
              <button
                onClick={() => setIsAddEmployeeOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-3 text-xs">
              <div>
                <label htmlFor="modal-emp-name-input" className="font-semibold text-stone-700 block mb-1">
                  {isEn ? 'Staff Member Full Name *' : 'कर्मचारी का पूरा नाम *'}
                </label>
                <input
                  id="modal-emp-name-input"
                  type="text"
                  required
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  placeholder={isEn ? 'e.g. Ramesh Kumar' : 'उदा. रमेश कुमार / हरिश्चंद्र'}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-emp-designation-input" className="font-semibold text-stone-700 block mb-1">
                    {isEn ? 'Designation / Role *' : 'पद / डेज़िग्नेशन *'}
                  </label>
                  <input
                    id="modal-emp-designation-input"
                    type="text"
                    required
                    value={empDesignation}
                    onChange={(e) => setEmpDesignation(e.target.value)}
                    placeholder={isEn ? 'e.g. Electrician / Lineman / Plumber' : 'उदा. स्वच्छता मित्र / लाइनमैन / हैंडपंप मिस्त्री'}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>

                <div>
                  <label htmlFor="modal-emp-department-select" className="font-semibold text-stone-700 block mb-1">
                    {isEn ? 'Department *' : 'संबंधित विभाग *'}
                  </label>
                  <select
                    id="modal-emp-department-select"
                    value={empDepartment}
                    onChange={(e) => setEmpDepartment(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 font-medium"
                  >
                    <option value="स्वच्छ भारत ग्रामीण एवं सफाई प्रकोष्ठ">{isEn ? 'Sanitation & Cleanliness Cell' : 'स्वच्छ भारत ग्रामीण एवं सफाई प्रकोष्ठ'}</option>
                    <option value="ग्रामीण पेयजल आपूर्ति (जल जीवन मिशन)">{isEn ? 'Drinking Water Supply (JJM)' : 'ग्रामीण पेयजल आपूर्ति (जल जीवन मिशन)'}</option>
                    <option value="विद्युत वितरण निगम">{isEn ? 'Electricity Distribution' : 'विद्युत वितरण निगम'}</option>
                    <option value="ग्राम पंचायत सड़क एवं निर्माण सेल">{isEn ? 'Roads & Civil Works' : 'ग्राम पंचायत सड़क एवं निर्माण सेल'}</option>
                    <option value="राष्ट्रीय ग्रामीण स्वास्थ्य मिशन (NRHM)">{isEn ? 'Health Mission (NRHM)' : 'राष्ट्रीय ग्रामीण स्वास्थ्य मिशन (NRHM)'}</option>
                    <option value="ग्राम सचिवालय ई-सेवा केंद्र">{isEn ? 'Secretariat E-Services' : 'ग्राम सचिवालय ई-सेवा केंद्र'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-emp-phone-input" className="font-semibold text-stone-700 block mb-1">
                    {isEn ? 'Mobile Number *' : 'मोबाइल नंबर (संपर्क) *'}
                  </label>
                  <input
                    id="modal-emp-phone-input"
                    type="tel"
                    required
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="modal-emp-status-select" className="font-semibold text-stone-700 block mb-1">
                    {isEn ? 'Duty Status:' : 'वर्तमान स्थिति (Duty Status):'}
                  </label>
                  <select
                    id="modal-emp-status-select"
                    value={empStatus}
                    onChange={(e) => setEmpStatus(e.target.value as any)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  >
                    <option value="active">{isEn ? 'Active Duty' : 'सक्रिय ड्यूटी (Active)'}</option>
                    <option value="on_leave">{isEn ? 'On Leave' : 'अवकाश पर (On Leave)'}</option>
                    <option value="transferred">{isEn ? 'Transferred' : 'स्थानांतरित (Transferred)'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="modal-emp-specialization-input" className="font-semibold text-stone-700 block mb-1">
                  {isEn ? 'Specialization / Skill:' : 'कार्य दक्षता / विशेषज्ञता:'}
                </label>
                <input
                  id="modal-emp-specialization-input"
                  type="text"
                  value={empSpecialization}
                  onChange={(e) => setEmpSpecialization(e.target.value)}
                  placeholder={isEn ? 'e.g. Pipe repairs, street lighting, drain cleaning' : 'उदा. हैंडपंप रिबोर, नाली सफाई, तार जोड़'}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium"
                >
                  {isEn ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold"
                >
                  {editingEmployee ? (isEn ? 'Save Updates' : 'अपडेट सुरक्षित करें') : (isEn ? 'Add Staff' : 'कर्मचारी जोड़ें')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QUICK ACTION REPORT */}
      {quickActionComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 p-5 sm:p-6 space-y-4 my-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-stone-500">
                  {quickActionComplaint.id}
                </span>
                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  {isEn ? 'Update Action Report & Status' : 'कार्रवाई रिपोर्ट व स्थिति अपडेट करें'}
                </h3>
              </div>
              <button
                onClick={() => setQuickActionComplaint(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
              {isEn ? 'Title:' : 'विषय:'} <strong>{isEn ? (quickActionComplaint.titleEn || quickActionComplaint.title) : quickActionComplaint.title}</strong>
              <br />
              {isEn ? 'Citizen:' : 'नागरिक:'} {isEn ? (quickActionComplaint.citizenNameEn || quickActionComplaint.citizenName) : quickActionComplaint.citizenName}
            </p>

            <form onSubmit={handleSaveQuickAction} className="space-y-3 text-xs">
              <div>
                <label htmlFor="modal-quick-status-select" className="font-semibold text-stone-700 block mb-1">
                  {isEn ? 'Select Status:' : 'नई स्थिति चुनें:'}
                </label>
                <select
                  id="modal-quick-status-select"
                  value={quickStatus}
                  onChange={(e) => setQuickStatus(e.target.value as ComplaintStatus)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 font-semibold"
                >
                  <option value="pending">{isEn ? 'Pending' : 'लंबित (Pending)'}</option>
                  <option value="under_review">{isEn ? 'Under Review' : 'समीक्षाधीन (Under Review)'}</option>
                  <option value="in_progress">{isEn ? 'In Progress' : 'कार्य प्रगति पर (In Progress)'}</option>
                  <option value="resolved">{isEn ? 'Resolved' : 'पूर्ण निस्तारित (Resolved)'}</option>
                  <option value="rejected">{isEn ? 'Rejected' : 'अस्वीकृत (Rejected)'}</option>
                </select>
              </div>

              <div>
                <label htmlFor="modal-quick-note-textarea" className="font-semibold text-stone-700 block mb-1">
                  {isEn ? 'Action Report Note (Visible to citizen):' : 'कार्रवाई विवरण / समाधान नोट (यह नोट ग्रामीण को तुरंत दिखेगा) *'}
                </label>
                <textarea
                  id="modal-quick-note-textarea"
                  required
                  rows={3}
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder={isEn ? 'e.g. Field staff inspected the site, repair completed and tested.' : 'उदा. कर्मचारी मौके पर पहुंचकर कार्य पूर्ण कर चुके हैं।'}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-quick-officer-name-input" className="font-semibold text-stone-700 block mb-1">
                    {isEn ? 'Officer / Signatory Name:' : 'अधिकारी का नाम:'}
                  </label>
                  <input
                    id="modal-quick-officer-name-input"
                    type="text"
                    value={quickOfficerName}
                    onChange={(e) => setQuickOfficerName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900"
                  />
                </div>
                <div>
                  <label htmlFor="modal-quick-officer-role-input" className="font-semibold text-stone-700 block mb-1">
                    {isEn ? 'Designation:' : 'पद / भूमिका:'}
                  </label>
                  <input
                    id="modal-quick-officer-role-input"
                    type="text"
                    value={quickOfficerRole}
                    onChange={(e) => setQuickOfficerRole(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setQuickActionComplaint(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium"
                >
                  {isEn ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold"
                >
                  {isEn ? 'Save Action' : 'कार्रवाई सुरक्षित करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT NOTICE */}
      {isAddNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 p-5 sm:p-6 space-y-4 my-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">
                {editingNotice ? (isEn ? 'Edit Notice' : 'सूचना संपादित करें') : (isEn ? '+ Issue New Notice' : '+ नई ग्राम मुनादी जारी करें')}
              </h3>
              <button
                onClick={() => setIsAddNoticeOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="space-y-3 text-xs">
              <div>
                <label htmlFor="modal-not-title-input" className="font-semibold text-stone-700 block mb-1">
                  {isEn ? 'Notice Title *' : 'मुनादी / सूचना का शीर्षक *'}
                </label>
                <input
                  id="modal-not-title-input"
                  type="text"
                  required
                  value={notTitle}
                  onChange={(e) => setNotTitle(e.target.value)}
                  placeholder={isEn ? 'e.g. Water Pipeline Maintenance Notice' : 'उदा. पेयजल आपूर्ति सूचना'}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div>
                <label htmlFor="modal-not-content-textarea" className="font-semibold text-stone-700 block mb-1">
                  {isEn ? 'Detailed Announcement *' : 'सूचना का विस्तृत विवरण *'}
                </label>
                <textarea
                  id="modal-not-content-textarea"
                  required
                  rows={4}
                  value={notContent}
                  onChange={(e) => setNotContent(e.target.value)}
                  placeholder={isEn ? 'All residents are hereby informed that...' : 'समस्त ग्रामवासियों को सूचित किया जाता है कि...'}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-not-category-select" className="font-semibold text-stone-700 block mb-1">
                    {isEn ? 'Category:' : 'श्रेणी:'}
                  </label>
                  <select
                    id="modal-not-category-select"
                    value={notCategory}
                    onChange={(e) => setNotCategory(e.target.value as any)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900"
                  >
                    <option value="announcement">{isEn ? 'Announcement' : 'सामान्य मुनादी'}</option>
                    <option value="scheme">{isEn ? 'Govt Scheme' : 'सरकारी योजना'}</option>
                    <option value="meeting">{isEn ? 'Village Meeting' : 'ग्राम सभा बैठक'}</option>
                    <option value="emergency">{isEn ? 'Emergency Alert' : 'आपातकालीन सूचना'}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="modal-not-postedby-input" className="font-semibold text-stone-700 block mb-1">
                    {isEn ? 'Issued By:' : 'जारीकर्ता का नाम:'}
                  </label>
                  <input
                    id="modal-not-postedby-input"
                    type="text"
                    value={notPostedBy}
                    onChange={(e) => setNotPostedBy(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgentNoticeCheck"
                  checked={notIsUrgent}
                  onChange={(e) => setNotIsUrgent(e.target.checked)}
                  className="rounded text-emerald-800 focus:ring-emerald-600"
                />
                <label htmlFor="urgentNoticeCheck" className="text-stone-700 font-semibold cursor-pointer">
                  {isEn ? 'Highlight as Urgent Alert' : 'अति आवश्यक सूचना के रूप में हाइलाइट करें'}
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddNoticeOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium"
                >
                  {isEn ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold"
                >
                  {editingNotice ? (isEn ? 'Save Updates' : 'अपडेट सुरक्षित करें') : (isEn ? 'Publish Notice' : 'सूचना जारी करें')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD WARD */}
      {isAddWardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-base font-bold text-stone-900">
                {isEn ? '+ Add New Ward' : '+ नया वार्ड जोड़ें'}
              </h3>
              <button onClick={() => setIsAddWardOpen(false)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWard} className="space-y-3 text-xs">
              <div>
                <label htmlFor="modal-ward-name-input" className="font-semibold text-stone-700 block mb-1">
                  {isEn ? 'Ward Name (e.g. Ward 06 - East Colony) *' : 'वार्ड का नाम *'}
                </label>
                <input
                  id="modal-ward-name-input"
                  type="text"
                  required
                  value={wardName}
                  onChange={(e) => setWardName(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 text-stone-900"
                />
              </div>

              <div>
                <label htmlFor="modal-ward-area-input" className="font-semibold text-stone-700 block mb-1">
                  {isEn ? 'Area Coverage:' : 'क्षेत्र / मोहल्ला पहचान:'}
                </label>
                <input
                  id="modal-ward-area-input"
                  type="text"
                  value={wardArea}
                  onChange={(e) => setWardArea(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 text-stone-900"
                />
              </div>

              <div>
                <label htmlFor="modal-ward-rep-input" className="font-semibold text-stone-700 block mb-1">
                  {isEn ? 'Representative Member Name:' : 'वार्ड सदस्य / प्रतिनिधि का नाम:'}
                </label>
                <input
                  id="modal-ward-rep-input"
                  type="text"
                  value={wardRep}
                  onChange={(e) => setWardRep(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 text-stone-900"
                />
              </div>

              <div>
                <label htmlFor="modal-ward-phone-input" className="font-semibold text-stone-700 block mb-1">
                  {isEn ? 'Member Phone Number:' : 'फोन नंबर:'}
                </label>
                <input
                  id="modal-ward-phone-input"
                  type="text"
                  value={wardPhone}
                  onChange={(e) => setWardPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full border border-stone-300 rounded-lg p-2 text-stone-900 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddWardOpen(false)}
                  className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg"
                >
                  {isEn ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 text-white rounded-lg font-bold"
                >
                  {isEn ? 'Save Ward' : 'वार्ड सुरक्षित करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
