export type SupportedLanguage = 'hi' | 'en' | 'bho' | 'mr' | 'bn' | 'pa';

export type ComplaintCategory =
  | 'drinking_water'
  | 'electricity'
  | 'drainage_sanitation'
  | 'damaged_roads'
  | 'street_lights'
  | 'health_education'
  | 'ration_welfare'
  | 'other';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export type ComplaintStatus =
  | 'pending'
  | 'under_review'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export interface ActionLog {
  id: string;
  timestamp: string;
  title: string;
  titleEn?: string;
  note: string;
  noteEn?: string;
  officerName: string;
  officerNameEn?: string;
  officerRole: string;
  officerRoleEn?: string;
  statusBadge: ComplaintStatus;
}

export interface Complaint {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  category: ComplaintCategory;
  citizenName: string;
  citizenNameEn?: string;
  citizenPhone: string;
  ward: string;
  wardEn?: string;
  locationDetails: string;
  locationDetailsEn?: string;
  priority: PriorityLevel;
  status: ComplaintStatus;
  assignedDepartment: string;
  assignedDepartmentEn?: string;
  assignedEmployeeId: string | null;
  assignedEmployeeName: string | null;
  assignedEmployeeNameEn?: string;
  dateSubmitted: string;
  resolvedDate: string | null;
  adminRemarks: string;
  adminRemarksEn?: string;
  timeline: ActionLog[];
  upvotes: number;
  upvoterIds: string[];
  imageUrl?: string;
  resolvedImageUrl?: string;
  voiceNoteTranscript?: string;
}

export interface Employee {
  id: string;
  name: string;
  nameEn?: string;
  designation: string;
  designationEn?: string;
  department: string;
  departmentEn?: string;
  phone: string;
  email?: string;
  assignedWards: string[];
  joiningDate: string;
  status: 'active' | 'on_leave' | 'transferred';
  avatar?: string;
  specialization?: string;
  specializationEn?: string;
}

export interface Notice {
  id: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  category: 'announcement' | 'scheme' | 'meeting' | 'emergency';
  postedDate: string;
  postedBy: string;
  postedByEn?: string;
  isUrgent: boolean;
  validUntil?: string;
}

export interface Ward {
  id: string;
  number: number;
  name: string;
  nameEn?: string;
  area: string;
  areaEn?: string;
  representative: string;
  representativeEn?: string;
  phone: string;
}

export interface PanchayatProfile {
  villageName: string;
  villageNameEn: string;
  block: string;
  blockEn?: string;
  district: string;
  districtEn?: string;
  state: string;
  stateEn?: string;
  pinCode: string;
  pradhanName: string;
  pradhanNameEn?: string;
  pradhanPhone: string;
  secretaryName: string;
  secretaryNameEn?: string;
  secretaryPhone: string;
  totalPopulation: number;
  totalHouseholds: number;
}
