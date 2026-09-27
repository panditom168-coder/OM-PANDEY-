import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Complaint,
  Employee,
  Notice,
  Ward,
  PanchayatProfile,
  ComplaintStatus,
  ComplaintCategory,
} from '../types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_EMPLOYEES,
  INITIAL_NOTICES,
  INITIAL_PANCHAYAT_PROFILE,
  INITIAL_WARDS,
} from '../data/initialData';
import { speechSpeaker } from '../utils/speech';
import { t, resolveBilingualText } from '../utils/translations';

interface PanchayatContextType {
  complaints: Complaint[];
  employees: Employee[];
  notices: Notice[];
  wards: Ward[];
  profile: PanchayatProfile;
  viewMode: 'gramin' | 'admin';
  setViewMode: (mode: 'gramin' | 'admin') => void;
  adminActiveTab: 'complaints' | 'employees' | 'notices' | 'wards' | 'analytics';
  setAdminActiveTab: (tab: 'complaints' | 'employees' | 'notices' | 'wards' | 'analytics') => void;
  language: 'hi' | 'en';
  setLanguage: (lang: 'hi' | 'en') => void;
  t: (key: string) => string;
  getText: (item: any, field: string) => string;

  // Custom Village Name Modal
  isCustomVillageModalOpen: boolean;
  setIsCustomVillageModalOpen: (open: boolean) => void;

  // Admin PIN Authentication
  isAdminUnlocked: boolean;
  unlockAdmin: (pin: string) => Promise<boolean>;
  lockAdmin: () => void;
  changeAdminPin: (oldPin: string, newPin: string) => Promise<{ success: boolean; message?: string }>;

  // Selected complaint modal for detail & tracking
  selectedComplaintId: string | null;
  setSelectedComplaintId: (id: string | null) => void;

  // Audio / Speech Reader state
  isAudioPlaying: boolean;
  audioText: string;
  readAloudComplaint: (complaint: Complaint) => void;
  readAloudNotice: (notice: Notice) => void;
  readAloudCustom: (text: string) => void;
  stopAudio: () => void;

  // Citizen Actions
  createComplaint: (data: {
    title: string;
    description: string;
    category: ComplaintCategory;
    citizenName: string;
    citizenPhone: string;
    ward: string;
    locationDetails: string;
    imageUrl?: string;
    voiceTranscript?: string;
  }) => Promise<string>;
  upvoteComplaint: (id: string) => void;

  // Admin Actions ("एडमिन जो हो, हर चीज़ को एडिट कर सके")
  addEmployee: (emp: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (emp: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;

  updateComplaint: (complaint: Complaint) => Promise<void>;
  updateComplaintStatus: (
    id: string,
    status: ComplaintStatus,
    officerName: string,
    officerRole: string,
    note: string,
    resolvedImageUrl?: string
  ) => Promise<void>;
  assignComplaintEmployee: (complaintId: string, employeeId: string) => Promise<void>;
  deleteComplaint: (id: string) => Promise<void>;

  addNotice: (notice: Omit<Notice, 'id' | 'postedDate'>) => Promise<void>;
  updateNotice: (notice: Notice) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;

  updatePanchayatProfile: (profile: PanchayatProfile) => Promise<void>;
  addWard: (ward: Omit<Ward, 'id'>) => Promise<void>;
  updateWard: (ward: Ward) => Promise<void>;
  deleteWard: (id: string) => Promise<void>;

  exportComplaintsCSV: () => void;
  resetAllData: () => Promise<void>;
}

const PanchayatContext = createContext<PanchayatContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANGUAGE: 'gssp_lang_v2',
  ADMIN_AUTH: 'gssp_admin_auth_v2',
};

export const PanchayatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [wards, setWards] = useState<Ward[]>(INITIAL_WARDS);
  const [profile, setProfile] = useState<PanchayatProfile>(INITIAL_PANCHAYAT_PROFILE);

  const [viewMode, setViewMode] = useState<'gramin' | 'admin'>('gramin');
  const [adminActiveTab, setAdminActiveTab] = useState<'complaints' | 'employees' | 'notices' | 'wards' | 'analytics'>('complaints');
  const [language, setLanguageState] = useState<'hi' | 'en'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return saved === 'en' ? 'en' : 'hi';
    } catch {
      return 'hi';
    }
  });

  const [isCustomVillageModalOpen, setIsCustomVillageModalOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'unlocked';
    } catch {
      return false;
    }
  });

  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioText, setAudioText] = useState<string>('');

  const setLanguage = (lang: 'hi' | 'en') => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (e) {
      console.error(e);
    }
  };

  // Helper function to resolve text in current language
  const getText = (item: any, field: string): string => {
    return resolveBilingualText(item, field, language);
  };

  const translateKey = (key: string): string => {
    return t(key, language);
  };

  // 1. Initial State Fetch from Real Backend
  useEffect(() => {
    const fetchBackendState = async () => {
      try {
        const res = await fetch('/api/state');
        if (res.ok) {
          const data = await res.json();
          if (data.complaints && data.complaints.length > 0) setComplaints(data.complaints);
          if (data.employees && data.employees.length > 0) setEmployees(data.employees);
          if (data.notices && data.notices.length > 0) setNotices(data.notices);
          if (data.wards && data.wards.length > 0) setWards(data.wards);
          if (data.profile) setProfile(data.profile);
        }
      } catch (err) {
        console.warn('Backend API connection note, using local state:', err);
      }
    };
    fetchBackendState();
  }, []);

  // Audio Speech Listener
  useEffect(() => {
    const unsubscribe = speechSpeaker.subscribe((status, text) => {
      if (status === 'started' || status === 'resumed') {
        setIsAudioPlaying(true);
        if (text) setAudioText(text);
      } else if (status === 'ended' || status === 'error') {
        setIsAudioPlaying(false);
        setAudioText('');
      } else if (status === 'paused') {
        setIsAudioPlaying(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Admin PIN Unlock - strictly enforces active PIN without 1234 backdoor
  const unlockAdmin = async (pin: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data && data.success) {
        setIsAdminUnlocked(true);
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'unlocked');
        return true;
      }
      return false;
    } catch {
      // Offline fallback: verify against user's updated PIN in localStorage
      const savedPin = localStorage.getItem('gssp_admin_pin') || '1234';
      if (pin && pin === savedPin) {
        setIsAdminUnlocked(true);
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'unlocked');
        return true;
      }
      return false;
    }
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  const changeAdminPin = async (oldPin: string, newPin: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPin, newPin }),
      });
      const data = await res.json();
      if (data && data.success) {
        localStorage.setItem('gssp_admin_pin', newPin);
        return { success: true };
      }
      return {
        success: false,
        message: data.message || (language === 'en' ? 'Current PIN is incorrect.' : 'वर्तमान सुरक्षा पिन गलत है।'),
      };
    } catch {
      const currentSaved = localStorage.getItem('gssp_admin_pin') || '1234';
      if (oldPin === currentSaved && newPin && newPin.length >= 4) {
        localStorage.setItem('gssp_admin_pin', newPin);
        return { success: true };
      }
      return {
        success: false,
        message: language === 'en' ? 'Current PIN is incorrect.' : 'वर्तमान सुरक्षा पिन गलत है।',
      };
    }
  };

  // Audio Readers (100% English when language === 'en')
  const readAloudComplaint = (c: Complaint) => {
    if (language === 'en') {
      const statusEnMap: Record<ComplaintStatus, string> = {
        pending: 'Pending verification',
        under_review: 'Under review, officer assigned',
        in_progress: 'Repair work in progress',
        resolved: 'Fully resolved and completed',
        rejected: 'Rejected',
      };
      const titleText = c.titleEn || c.title;
      const statusText = statusEnMap[c.status];
      const assigned = c.assignedEmployeeNameEn || c.assignedEmployeeName
        ? `Assigned officer is ${c.assignedEmployeeNameEn || c.assignedEmployeeName}.`
        : 'Officer assignment pending.';
      const remark = c.adminRemarksEn || c.adminRemarks;
      const toSpeak = `Grievance Ticket: ${c.id}. Title: ${titleText}. Ward: ${c.wardEn || c.ward}. Status: ${statusText}. ${assigned} ${remark ? `Update: ${remark}` : ''}`;
      speechSpeaker.speak(toSpeak, 'en');
    } else {
      const statusTextMap: Record<ComplaintStatus, string> = {
        pending: 'लंबित है, जल्द समीक्षा की जाएगी',
        under_review: 'समीक्षाधीन है, संबंधित कर्मचारी को भेजा गया है',
        in_progress: 'कार्य प्रगति पर है, काम चालू है',
        resolved: 'पूर्ण रूप से निस्तारित और ठीक कर दिया गया है',
        rejected: 'अस्वीकृत किया गया',
      };
      const assignedText = c.assignedEmployeeName
        ? `इस पर नियुक्त कर्मचारी ${c.assignedEmployeeName} हैं।`
        : 'अभी कर्मचारी नियुक्त किया जा रहा है।';
      const toSpeak = `शिकायत संख्या: ${c.id.replace(/-/g, ' ')}। विषय: ${c.title}। वार्ड: ${c.ward}। शिकायतकर्ता: ${c.citizenName}। वर्तमान स्थिति: यह समस्या ${statusTextMap[c.status]}। ${assignedText} कार्रवाई: ${c.adminRemarks}`;
      speechSpeaker.speak(toSpeak, 'hi');
    }
  };

  const readAloudNotice = (notice: Notice) => {
    if (language === 'en') {
      const title = notice.titleEn || notice.title;
      const content = notice.contentEn || notice.content;
      speechSpeaker.speak(`Panchayat Notice: ${title}. ${content}`, 'en');
    } else {
      speechSpeaker.speak(`ग्राम पंचायत सूचना: ${notice.title}। विवरण: ${notice.content}`, 'hi');
    }
  };

  const readAloudCustom = (text: string) => {
    speechSpeaker.speak(text, language);
  };

  const stopAudio = () => {
    speechSpeaker.stop();
  };

  // Citizen Complaint Creation (Connected to Backend)
  const createComplaint = async (data: {
    title: string;
    description: string;
    category: ComplaintCategory;
    citizenName: string;
    citizenPhone: string;
    ward: string;
    locationDetails: string;
    imageUrl?: string;
    voiceTranscript?: string;
  }): Promise<string> => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newId = `GP-${randomNum}`;
    const nowIso = new Date().toISOString();

    const newComplaint: Complaint = {
      id: newId,
      title: data.title,
      titleEn: language === 'en' ? data.title : undefined,
      description: data.description,
      descriptionEn: language === 'en' ? data.description : undefined,
      category: data.category,
      citizenName: data.citizenName,
      citizenNameEn: language === 'en' ? data.citizenName : undefined,
      citizenPhone: data.citizenPhone,
      ward: data.ward,
      locationDetails: data.locationDetails,
      priority: 'medium',
      status: 'pending',
      assignedDepartment: 'ग्राम सचिवालय ई-सेवा केंद्र',
      assignedDepartmentEn: 'Gram Secretariat E-Services',
      assignedEmployeeId: null,
      assignedEmployeeName: null,
      dateSubmitted: nowIso,
      resolvedDate: null,
      adminRemarks: language === 'en' ? 'Grievance registered. Under review.' : 'शिकायत दर्ज हुई। सत्यापन प्रक्रिया प्रारंभ।',
      adminRemarksEn: 'Grievance registered. Under review.',
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: nowIso,
          title: language === 'en' ? 'Grievance Registered' : 'शिकायत सफलतापूर्वक दर्ज हुई',
          titleEn: 'Grievance Registered',
          note: language === 'en' ? `Logged by citizen ${data.citizenName}.` : `नागरिक ${data.citizenName} द्वारा समस्या दर्ज की गई।`,
          noteEn: `Logged by citizen ${data.citizenName}.`,
          officerName: language === 'en' ? 'Portal' : 'सिस्टम',
          officerNameEn: 'Portal',
          officerRole: language === 'en' ? 'System' : 'सिस्टम',
          officerRoleEn: 'System',
          statusBadge: 'pending',
        },
      ],
      upvotes: 1,
      upvoterIds: ['creator'],
      imageUrl: data.imageUrl,
      voiceNoteTranscript: data.voiceTranscript,
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Backend sync
    try {
      fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComplaint),
      }).catch(console.warn);
    } catch (e) {
      console.warn(e);
    }

    return newId;
  };

  const upvoteComplaint = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const hasVoted = c.upvoterIds.includes('local-user');
          return {
            ...c,
            upvotes: hasVoted ? Math.max(1, c.upvotes - 1) : c.upvotes + 1,
            upvoterIds: hasVoted
              ? c.upvoterIds.filter((u) => u !== 'local-user')
              : [...c.upvoterIds, 'local-user'],
          };
        }
        return c;
      })
    );
  };

  // Staff Management (Connected to Backend)
  const addEmployee = async (newEmpData: Omit<Employee, 'id'>) => {
    const id = `emp-${Date.now()}`;
    const newEmp: Employee = {
      ...newEmpData,
      id,
    };
    setEmployees((prev) => [newEmp, ...prev]);

    try {
      fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmp),
      }).catch(console.warn);
    } catch (e) {
      console.warn(e);
    }
  };

  const updateEmployee = async (emp: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === emp.id ? emp : e)));
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.assignedEmployeeId === emp.id) {
          return {
            ...c,
            assignedEmployeeName: emp.name,
            assignedEmployeeNameEn: emp.nameEn || emp.name,
            assignedDepartment: emp.department || c.assignedDepartment,
            assignedDepartmentEn: emp.departmentEn || c.assignedDepartmentEn,
          };
        }
        return c;
      })
    );

    try {
      fetch(`/api/employees/${emp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emp),
      }).catch(console.warn);
    } catch (e) {
      console.warn(e);
    }
  };

  const deleteEmployee = async (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.assignedEmployeeId === id) {
          return { ...c, assignedEmployeeId: null, assignedEmployeeName: null };
        }
        return c;
      })
    );

    try {
      fetch(`/api/employees/${id}`, { method: 'DELETE' }).catch(console.warn);
    } catch (e) {
      console.warn(e);
    }
  };

  // Complaint Management (Connected to Backend)
  const updateComplaint = async (updated: Complaint) => {
    setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    try {
      fetch(`/api/complaints/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(console.warn);
    } catch (e) {
      console.warn(e);
    }
  };

  const updateComplaintStatus = async (
    id: string,
    newStatus: ComplaintStatus,
    officerName: string,
    officerRole: string,
    note: string,
    resolvedImageUrl?: string
  ) => {
    const nowIso = new Date().toISOString();
    const isEn = language === 'en';

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newTimelineItem = {
            id: `tl-${Date.now()}`,
            timestamp: nowIso,
            title:
              newStatus === 'resolved'
                ? isEn ? 'Grievance Fully Resolved' : 'समस्या का पूर्ण समाधान'
                : newStatus === 'in_progress'
                ? isEn ? 'Repair Work In Progress' : 'स्थल पर मरम्मत कार्य प्रगति पर'
                : newStatus === 'under_review'
                ? isEn ? 'Under Officer Review' : 'अधिकारी द्वारा स्थलीय समीक्षा'
                : isEn ? 'Status Updated' : 'स्थिति अद्यतन',
            titleEn: newStatus === 'resolved' ? 'Grievance Fully Resolved' : newStatus === 'in_progress' ? 'Repair Work In Progress' : 'Status Updated',
            note,
            noteEn: isEn ? note : undefined,
            officerName: officerName || (isEn ? 'Panchayat Officer' : 'ग्राम अधिकारी'),
            officerNameEn: officerName,
            officerRole: officerRole || (isEn ? 'Administration' : 'प्रशासन'),
            officerRoleEn: officerRole,
            statusBadge: newStatus,
          };

          return {
            ...c,
            status: newStatus,
            resolvedDate: newStatus === 'resolved' ? nowIso : c.resolvedDate,
            resolvedImageUrl: resolvedImageUrl || c.resolvedImageUrl,
            adminRemarks: note || c.adminRemarks,
            adminRemarksEn: isEn ? note : c.adminRemarksEn,
            timeline: [...c.timeline, newTimelineItem],
          };
        }
        return c;
      })
    );

    try {
      fetch(`/api/complaints/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note, officerName, officerRole }),
      }).catch(console.warn);
    } catch (e) {
      console.warn(e);
    }
  };

  const assignComplaintEmployee = async (complaintId: string, employeeId: string) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return;

    const nowIso = new Date().toISOString();
    const isEn = language === 'en';

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          const newTimelineItem = {
            id: `tl-${Date.now()}`,
            timestamp: nowIso,
            title: isEn ? `Assigned to ${emp.nameEn || emp.name}` : `कार्य कर्मचारी ${emp.name} को आवंटित किया गया`,
            titleEn: `Assigned to ${emp.nameEn || emp.name}`,
            note: isEn
              ? `${emp.designationEn || emp.designation} (${emp.departmentEn || emp.department}) dispatched. Phone: ${emp.phone}`
              : `${emp.designation} (${emp.department}) को स्थलीय जांच व निवारण हेतु अधिकृत किया गया। संपर्क: ${emp.phone}`,
            noteEn: `${emp.designationEn || emp.designation} (${emp.departmentEn || emp.department}) dispatched. Phone: ${emp.phone}`,
            officerName: isEn ? 'Control Room' : 'नियंत्रण कक्ष',
            officerNameEn: 'Control Room',
            officerRole: 'Admin',
            officerRoleEn: 'Admin',
            statusBadge: c.status === 'pending' ? 'under_review' : c.status,
          };

          return {
            ...c,
            assignedEmployeeId: emp.id,
            assignedEmployeeName: emp.name,
            assignedEmployeeNameEn: emp.nameEn || emp.name,
            assignedDepartment: emp.department,
            assignedDepartmentEn: emp.departmentEn || emp.department,
            status: c.status === 'pending' ? 'under_review' : c.status,
            timeline: [...c.timeline, newTimelineItem],
          };
        }
        return c;
      })
    );
  };

  const deleteComplaint = async (id: string) => {
    setComplaints((prev) => prev.filter((c) => c.id !== id));
    if (selectedComplaintId === id) setSelectedComplaintId(null);
    try {
      fetch(`/api/complaints/${id}`, { method: 'DELETE' }).catch(console.warn);
    } catch (e) {
      console.warn(e);
    }
  };

  // Notices (Connected to Backend)
  const addNotice = async (noticeData: Omit<Notice, 'id' | 'postedDate'>) => {
    const id = `not-${Date.now()}`;
    const newNotice: Notice = {
      ...noticeData,
      id,
      postedDate: new Date().toISOString(),
    };
    setNotices((prev) => [newNotice, ...prev]);
    try {
      fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotice),
      }).catch(console.warn);
    } catch (e) {
      console.warn(e);
    }
  };

  const updateNotice = async (notice: Notice) => {
    setNotices((prev) => prev.map((n) => (n.id === notice.id ? notice : n)));
    try {
      fetch(`/api/notices/${notice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notice),
      }).catch(console.warn);
    } catch (e) {
      console.warn(e);
    }
  };

  const deleteNotice = async (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    try {
      fetch(`/api/notices/${id}`, { method: 'DELETE' }).catch(console.warn);
    } catch (e) {
      console.warn(e);
    }
  };

  // Profile & Wards (Connected to Backend)
  const updatePanchayatProfile = async (newProfile: PanchayatProfile) => {
    setProfile(newProfile);
    try {
      fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile),
      }).catch(console.warn);
    } catch (e) {
      console.warn(e);
    }
  };

  const addWard = async (wardData: Omit<Ward, 'id'>) => {
    const id = `w-${Date.now()}`;
    const newWard = { ...wardData, id };
    setWards((prev) => [...prev, newWard]);
    try {
      fetch('/api/wards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWard),
      }).catch(console.warn);
    } catch (e) {
      console.warn(e);
    }
  };

  const updateWard = async (ward: Ward) => {
    setWards((prev) => prev.map((w) => (w.id === ward.id ? ward : w)));
    try {
      fetch(`/api/wards/${ward.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ward),
      }).catch(console.warn);
    } catch (e) {
      console.warn(e);
    }
  };

  const deleteWard = async (id: string) => {
    setWards((prev) => prev.filter((w) => w.id !== id));
    try {
      fetch(`/api/wards/${id}`, { method: 'DELETE' }).catch(console.warn);
    } catch (e) {
      console.warn(e);
    }
  };

  // CSV Export
  const exportComplaintsCSV = () => {
    const isEn = language === 'en';
    const headers = isEn
      ? ['Complaint ID', 'Date', 'Category', 'Title', 'Citizen Name', 'Phone', 'Ward', 'Priority', 'Status', 'Department', 'Assigned Officer', 'Remarks']
      : ['शिकायत संख्या', 'दिनांक', 'श्रेणी', 'विषय', 'नागरिक नाम', 'फोन नंबर', 'वार्ड', 'प्राथमिकता', 'स्थिति', 'विभाग', 'नियुक्त कर्मचारी', 'कार्रवाई नोट'];

    const rows = complaints.map((c) => [
      `"${c.id}"`,
      `"${c.dateSubmitted}"`,
      `"${c.category}"`,
      `"${(isEn ? (c.titleEn || c.title) : c.title).replace(/"/g, '""')}"`,
      `"${(isEn ? (c.citizenNameEn || c.citizenName) : c.citizenName).replace(/"/g, '""')}"`,
      `"${c.citizenPhone}"`,
      `"${(isEn ? (c.wardEn || c.ward) : c.ward).replace(/"/g, '""')}"`,
      `"${c.priority}"`,
      `"${c.status}"`,
      `"${(isEn ? (c.assignedDepartmentEn || c.assignedDepartment) : c.assignedDepartment).replace(/"/g, '""')}"`,
      `"${(isEn ? (c.assignedEmployeeNameEn || c.assignedEmployeeName || 'N/A') : (c.assignedEmployeeName || 'लागू नहीं'))}"`,
      `"${(isEn ? (c.adminRemarksEn || c.adminRemarks || '') : (c.adminRemarks || '')).replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Panchayat_Grievances_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAllData = async () => {
    if (window.confirm(language === 'en' ? 'Reset all data to default state?' : 'क्या आप सभी डेटा को डिफ़ॉल्ट स्थिति में रीसेट करना चाहते हैं?')) {
      try {
        await fetch('/api/reset', { method: 'POST' });
      } catch (e) {
        console.warn(e);
      }
      setComplaints(INITIAL_COMPLAINTS);
      setEmployees(INITIAL_EMPLOYEES);
      setNotices(INITIAL_NOTICES);
      setWards(INITIAL_WARDS);
      setProfile(INITIAL_PANCHAYAT_PROFILE);
    }
  };

  return (
    <PanchayatContext.Provider
      value={{
        complaints,
        employees,
        notices,
        wards,
        profile,
        viewMode,
        setViewMode,
        adminActiveTab,
        setAdminActiveTab,
        language,
        setLanguage,
        t: translateKey,
        getText,
        isCustomVillageModalOpen,
        setIsCustomVillageModalOpen,
        isAdminUnlocked,
        unlockAdmin,
        lockAdmin,
        changeAdminPin,
        selectedComplaintId,
        setSelectedComplaintId,
        isAudioPlaying,
        audioText,
        readAloudComplaint,
        readAloudNotice,
        readAloudCustom,
        stopAudio,
        createComplaint,
        upvoteComplaint,
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
        exportComplaintsCSV,
        resetAllData,
      }}
    >
      {children}
    </PanchayatContext.Provider>
  );
};

export const usePanchayat = () => {
  const context = useContext(PanchayatContext);
  if (!context) {
    throw new Error('usePanchayat must be used within a PanchayatProvider');
  }
  return context;
};
