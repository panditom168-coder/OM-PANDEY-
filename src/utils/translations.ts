/**
 * Universal bilingual dictionary for 100% English & Hindi support.
 * When language === 'en', NOT A SINGLE WORD remains in Hindi!
 */

export const DICTIONARY: Record<string, { hi: string; en: string }> = {
  // App Branding & Navigation
  appName: { hi: 'ग्राम समाधान', en: 'Gram Samadhan' },
  appTagline: { hi: 'ई-पंचायत सेवा व जन शिकायत निवारण पोर्टल', en: 'E-Panchayat Grievance Redressal & Public Services' },
  graminPortal: { hi: 'ग्रामीण पोर्टल', en: 'Citizen Portal' },
  adminPanel: { hi: 'एडमिन पैनल', en: 'Admin Panel' },
  adminLocked: { hi: 'एडमिन सुरक्षित पिन दर्ज करें', en: 'Admin PIN Required' },
  serviceActive: { hi: 'ई-पंचायत सेवा सक्रिय', en: 'E-Service Online' },
  totalStaff: { hi: 'कुल कर्मचारी', en: 'Total Staff' },
  pendingIssues: { hi: 'लंबित समस्याएं', en: 'Pending Issues' },
  voicePlaying: { hi: 'आवाज चालू', en: 'Audio Playing' },
  stopVoice: { hi: 'आवाज बंद करें', en: 'Stop Audio' },
  changeVillage: { hi: 'गाँव का नाम बदलें', en: 'Change Village Name' },
  lockAdmin: { hi: 'एडमिन लॉक करें', en: 'Lock Admin' },

  // Hero Section
  heroWelcome: { hi: 'ग्राम पंचायत ई-सेवा पोर्टल में आपका स्वागत है', en: 'Welcome to Gram Panchayat Digital Services' },
  heroSubtitle: {
    hi: 'गाँव की कोई भी समस्या हो - बिजली, पानी, नाली या सड़क - बोलकर या लिखकर दर्ज करें। एडमिन और कर्मचारी द्वारा की गई हर कार्रवाई यहाँ तुरंत दिखेगी।',
    en: 'Report any village issue — water, electricity, sanitation, or roads — by voice or text. Every action taken by the admin and field staff is tracked here in real time.',
  },
  listenIntro: { hi: 'पोर्टल का परिचय आवाज में सुनें', en: 'Listen to Portal Guide' },
  fileNewGrievanceBtn: { hi: '+ नई समस्या दर्ज करें', en: '+ File New Grievance' },

  // Tabs
  tabBoard: { hi: 'ग्राम समस्या बोर्ड', en: 'Public Issues Board' },
  tabFile: { hi: 'समस्या दर्ज करें (बोलकर/लिखकर)', en: 'File Issue (Voice / Text)' },
  tabTrack: { hi: 'स्थिति ट्रैक करें', en: 'Track Status' },
  tabNotices: { hi: 'ग्राम मुनादी व नोटिस', en: 'Village Notices' },
  tabHelpline: { hi: 'हेल्पलाइन नंबर', en: 'Helpline Contacts' },
  tabMap: { hi: 'वार्ड लाइव नक्शा', en: 'Live Ward Map' },

  // File Grievance Form
  formTitle: { hi: 'अपनी समस्या या शिकायत दर्ज करें', en: 'Register Your Grievance' },
  formSubtitle: {
    hi: 'आप माइक दबाकर सीधे अपनी भाषा में बोल भी सकते हैं। शिकायत दर्ज होते ही आपको ट्रैकिंग नंबर मिलेगा।',
    en: 'You can tap the microphone to speak your problem. A unique tracking ticket will be generated instantly.',
  },
  formSuccessTitle: { hi: 'शिकायत सफलतापूर्वक दर्ज हुई!', en: 'Grievance Registered Successfully!' },
  formSuccessTicket: { hi: 'आपकी शिकायत संख्या:', en: 'Your Tracking Ticket ID:' },
  viewTimelineBtn: { hi: 'पारदर्शी टाइमलाइन देखें', en: 'View Public Timeline' },
  fileAnotherBtn: { hi: 'दूसरी शिकायत दर्ज करें', en: 'File Another Complaint' },

  catSelectLabel: { hi: '१. समस्या की श्रेणी चुनें *', en: '1. Select Issue Category *' },
  titleInputLabel: { hi: '२. समस्या का मुख्य शीर्षक *', en: '2. Issue Title *' },
  titleInputPlaceholder: { hi: 'उदा. हैंडपंप से पानी नहीं आ रहा / बिजली का तार ढीला है', en: 'e.g. Handpump not working / Sagging electric wire / Drain clogged' },
  descInputLabel: { hi: '३. समस्या का पूरा विवरण *', en: '3. Detailed Description *' },
  descInputPlaceholder: { hi: 'विस्तार से बताएं कि क्या परेशानी है और किस जगह पर है...', en: 'Describe what the issue is, since when, and exact spot...' },
  voiceTypeBtn: { hi: 'बोलकर लिखें (माइक दबाएं)', en: 'Voice Typing (Tap Mic)' },
  voiceListening: { hi: 'सुन रहा हूँ... बोलें', en: 'Listening... Please speak' },
  wardSelectLabel: { hi: '४. वार्ड / टोला चुनें *', en: '4. Select Ward / Mohalla *' },
  locationInputLabel: { hi: '५. सटीक जगह या पहचान (Landmark)', en: '5. Exact Landmark / Spot' },
  locationInputPlaceholder: { hi: 'उदा. प्राथमिक विद्यालय के सामने / मुख्य चौराहे पर', en: 'e.g. Near Primary School / Main Village Square' },
  nameInputLabel: { hi: '६. आपका नाम *', en: '6. Your Full Name *' },
  nameInputPlaceholder: { hi: 'उदा. राजेश कुमार', en: 'e.g. Rajesh Kumar' },
  phoneInputLabel: { hi: '७. आपका मोबाइल नंबर *', en: '7. Your Phone Number *' },
  phoneInputPlaceholder: { hi: '+91 98765 43210', en: '+91 98765 43210' },
  submitGrievanceBtn: { hi: 'समस्या दर्ज करें (Submit)', en: 'Submit Grievance Now' },
  submittingText: { hi: 'दर्ज किया जा रहा है...', en: 'Submitting...' },

  // Public Board
  audioBannerTip: {
    hi: 'किसी भी समस्या का विवरण व स्थिति सुनने के लिए 🔊 "सुनें" बटन दबाएं।',
    en: 'Tap the 🔊 "Listen" button on any card to hear the full status and officer remarks aloud.',
  },
  listenSummaryBtn: { hi: 'समस्याओं का संक्षिप्त सार सुनें', en: 'Listen to Summary' },
  searchPlaceholder: { hi: 'समस्या, वार्ड या आईडी खोजें...', en: 'Search by issue, ward or ID...' },
  allCategories: { hi: 'सभी श्रेणियां', en: 'All Categories' },
  allWards: { hi: 'सभी वार्ड', en: 'All Wards' },
  noIssuesFound: { hi: 'कोई समस्या नहीं मिली। आप नई समस्या दर्ज कर सकते हैं।', en: 'No issues found. You can report a new one.' },
  assignedDept: { hi: 'संबंधित विभाग:', en: 'Department:' },
  assignedStaff: { hi: 'नियुक्त कर्मचारी:', en: 'Assigned Staff:' },
  unassigned: { hi: 'आवंटन जारी', en: 'Pending Assignment' },
  latestAction: { hi: 'ताज़ा कार्रवाई:', en: 'Latest Action:' },
  listenCardBtn: { hi: 'सुनें', en: 'Listen' },
  timelineBtn: { hi: 'टाइमलाइन', en: 'Timeline' },
  supportCount: { hi: 'ग्रामीणों का समर्थन', en: 'Citizens Support' },

  // Status Labels
  statusPending: { hi: 'लंबित', en: 'Pending' },
  statusUnderReview: { hi: 'समीक्षाधीन', en: 'Under Review' },
  statusInProgress: { hi: 'कार्य प्रगति पर', en: 'In Progress' },
  statusResolved: { hi: 'पूर्ण निस्तारित', en: 'Resolved' },
  statusRejected: { hi: 'अस्वीकृत', en: 'Rejected' },

  // Priority Labels
  priorityUrgent: { hi: 'अति आवश्यक', en: 'Urgent (24h)' },
  priorityHigh: { hi: 'उच्च प्राथमिकता', en: 'High Priority' },
  priorityMedium: { hi: 'मध्यम', en: 'Medium' },
  priorityLow: { hi: 'सामान्य', en: 'Normal' },

  // Tracking Section
  trackTitle: { hi: 'अपनी शिकायत की स्थिति ट्रैक करें', en: 'Track Grievance Status' },
  trackSubtitle: { hi: 'अपना मोबाइल नंबर अथवा शिकायत संख्या दर्ज करें।', en: 'Enter your registered mobile number or ticket ID.' },
  trackPlaceholder: { hi: 'उदा. 9800044444 या GP-101 या नाम', en: 'e.g. 9800044444 or GP-101 or your name' },
  trackBtn: { hi: 'खोजें', en: 'Search' },
  searchResults: { hi: 'खोज परिणाम', en: 'Search Results' },
  noTrackResults: { hi: 'कोई शिकायत नहीं मिली। कृपया दर्ज नंबर या आईडी जांचें।', en: 'No matching grievance found. Please verify details.' },
  stepRegistered: { hi: '१. दर्ज हुई ✓', en: '1. Logged ✓' },
  stepReview: { hi: '२. समीक्षा', en: '2. Review' },
  stepProgress: { hi: '३. कार्य प्रगति', en: '3. In Progress' },
  stepResolved: { hi: '४. पूर्ण निस्तारित', en: '4. Resolved' },

  // Notices Section
  noticesTitle: { hi: 'ग्राम पंचायत आधिकारिक नोटिस व मुनादी बोर्ड', en: 'Official Village Notices & Circulars' },
  noticesSubtitle: { hi: 'ग्राम प्रधान व पंचायत सचिव द्वारा जारी महत्वपूर्ण सूचनाएं', en: 'Important circulars issued by Village Administration' },
  listenLatestNotice: { hi: 'ताज़ा मुनादी आवाज में सुनें', en: 'Listen to Latest Notice' },
  urgentNoticeBadge: { hi: 'अति आवश्यक मुनादी', en: 'URGENT NOTICE' },
  issuedBy: { hi: 'जारीकर्ता:', en: 'Issued by:' },

  // Helplines Section
  helplineTitle: { hi: 'ग्राम पंचायत आपातकालीन फोन डायरेक्टरी', en: 'Panchayat Emergency Phone Directory' },
  helplineSubtitle: { hi: 'समस्या होने पर सीधे संबंधित अधिकारी या कर्मचारी से संपर्क करें', en: 'Direct contacts for local panchayat officials and technicians' },
  rolePradhan: { hi: 'ग्राम प्रधान', en: 'Village Head (Pradhan)' },
  roleSecretary: { hi: 'पंचायत सचिव (VDO)', en: 'Panchayat Secretary (VDO)' },
  roleElectrician: { hi: 'विद्युत लाइनमैन', en: 'Electricity Lineman' },
  roleWaterTech: { hi: 'जल निगम हैंडपंप मिस्त्री', en: 'Water Supply Technician' },
  roleSanitation: { hi: 'मुख्य सफाई मित्र (स्वच्छता)', en: 'Chief Sanitation Worker' },
  roleHealth: { hi: 'स्वास्थ्य व आशा कार्यकर्ता', en: 'Health & ASHA Worker' },

  // Detail Modal
  modalDetailsTitle: { hi: 'समस्या का विस्तृत विवरण', en: 'Detailed Grievance Description' },
  modalVoiceNoteTitle: { hi: 'ग्रामीण द्वारा बोलकर दर्ज:', en: 'Spoken by Citizen via Voice:' },
  citizenDetailsHeader: { hi: 'शिकायतकर्ता विवरण', en: 'Citizen Details' },
  locationWardHeader: { hi: 'स्थान व वार्ड', en: 'Location & Ward' },
  timelineHeader: { hi: 'पारदर्शी कार्रवाई टाइमलाइन (Action Taken Report)', en: 'Public Action Taken Report' },
  timelineSubtitle: { hi: 'एडमिन और कर्मचारियों द्वारा की गई प्रत्येक कार्रवाई यहाँ दर्ज होती है', en: 'Every action logged by admin or technicians is visible here' },
  closeModal: { hi: 'बंद करें', en: 'Close' },
  shareCopy: { hi: 'शेयर / कॉपी विवरण', en: 'Share / Copy Info' },
  copiedText: { hi: 'कॉपी हो गया!', en: 'Copied!' },
  adminActionHeader: { hi: 'एडमिन नियंत्रण: नया कार्रवाई नोट जोड़ें या स्थिति बदलें', en: 'Admin Action: Update Status & Add Progress Note' },
  newStatusLabel: { hi: 'नई स्थिति चुनें:', en: 'Select New Status:' },
  officerNameLabel: { hi: 'अधिकारी / कर्मचारी का नाम:', en: 'Officer / Staff Name:' },
  officerRoleLabel: { hi: 'पद / डेज़िग्नेशन:', en: 'Designation / Role:' },
  actionReportNoteLabel: { hi: 'कार्रवाई रिपोर्ट विवरण (यह नोट ग्रामीण को तुरंत दिखेगा):', en: 'Action Note (Visible instantly to the citizen):' },
  saveActionBtn: { hi: 'कार्रवाई दर्ज करें व अपडेट भेजें', en: 'Save & Broadcast Action' },
  deleteComplaintBtn: { hi: 'शिकायत हटाएं (Delete)', en: 'Delete Complaint' },

  // Admin Control Center
  adminTitle: { hi: 'ग्राम पंचायत प्रशासनिक नियंत्रण केंद्र', en: 'Panchayat Administrative Control Center' },
  adminSubtitle: { hi: 'एडमिन जो हो, हर चीज़ एडिट कर सके — नए कर्मचारी जोड़ें, शिकायतें निस्तारित करें, सूचनाएं व वार्ड बदलें।', en: 'Admin controls everything — add staff, resolve complaints, issue notices, and manage wards.' },
  downloadCSV: { hi: 'CSV रिपोर्ट डाउनलोड करें', en: 'Download CSV Report' },
  resetData: { hi: 'डेटा रीसेट करें', en: 'Reset to Default' },
  metricTotal: { hi: 'कुल शिकायतें', en: 'Total Complaints' },
  metricPending: { hi: 'लंबित (Pending)', en: 'Pending' },
  metricInProgress: { hi: 'प्रगति पर (In Progress)', en: 'In Progress' },
  metricResolved: { hi: 'पूर्ण निस्तारित (Resolved)', en: 'Resolved' },
  metricStaff: { hi: 'कुल तैनात कर्मचारी', en: 'Active Staff' },

  adminTabComplaints: { hi: 'शिकायतें व निस्तारण', en: 'Complaints & Resolution' },
  adminTabEmployees: { hi: 'कर्मचारी प्रबंधन (Staff CRUD)', en: 'Staff Management (CRUD)' },
  adminTabNotices: { hi: 'ग्राम मुनादी व नोटिस बोर्ड', en: 'Notice Board Management' },
  adminTabSettings: { hi: 'पंचायत वार्ड व सेटिंग्स', en: 'Panchayat & Ward Settings' },

  addNewStaffBtn: { hi: '+ नया कर्मचारी जोड़ें', en: '+ Add New Employee' },
  editStaffBtn: { hi: 'संपादित करें (Edit)', en: 'Edit Employee' },
  addNewNoticeBtn: { hi: '+ नई मुनादी जारी करें', en: '+ Issue New Notice' },
  addNewWardBtn: { hi: '+ नया वार्ड जोड़ें', en: '+ Add New Ward' },
  saveProfileBtn: { hi: 'प्रोफाइल सुरक्षित करें', en: 'Save Panchayat Profile' },

  // Custom Village Name Modal
  customVillageModalTitle: { hi: 'अपनी पंचायत का नाम व विवरण सेट करें', en: 'Set Your Panchayat Details' },
  customVillageModalSubtitle: { hi: 'आप जो चाहें वह नाम रख सकते हैं, कोई भी नाम अपने-आप थोपा नहीं जाएगा।', en: 'Enter your preferred village name, pradhan, and details freely.' },
  villageNameField: { hi: 'ग्राम पंचायत का नाम *', en: 'Gram Panchayat Name *' },
  blockField: { hi: 'विकास खंड (Block)', en: 'Development Block' },
  districtField: { hi: 'जनपद (District)', en: 'District' },
  pradhanField: { hi: 'ग्राम प्रधान का नाम', en: 'Pradhan / Village Head Name' },
  pradhanPhoneField: { hi: 'प्रधान का मोबाइल नंबर', en: 'Pradhan Phone Number' },
  secretaryField: { hi: 'पंचायत सचिव का नाम', en: 'Panchayat Secretary Name' },
  secretaryPhoneField: { hi: 'सचिव का मोबाइल नंबर', en: 'Secretary Phone Number' },
  saveVillageBtn: { hi: 'नाम व विवरण सुरक्षित करें', en: 'Save Details' },
  cancelBtn: { hi: 'रद्द करें', en: 'Cancel' },

  // PIN Lock Screen
  lockScreenTitle: { hi: 'एडमिन सुरक्षा सत्यापन', en: 'Admin Security Verification' },
  lockScreenSubtitle: { hi: 'प्रशासनिक संपादन के लिए 4 अंकों का गुप्त पिन दर्ज करें।', en: 'Enter 4-digit PIN to access administrative controls.' },
  enterPin: { hi: '4 अंकों का पिन दर्ज करें', en: 'Enter 4-Digit PIN' },
  verifyPinBtn: { hi: 'प्रवेश करें (Verify PIN)', en: 'Unlock Admin Panel' },
  pinSecurityNote: { hi: 'प्रशासनिक कक्ष पूर्णतः गोपनीय पिन द्वारा सुरक्षित है', en: 'Admin Panel is secured with confidential PIN' },
  backToGramin: { hi: '← वापस ग्रामीण पोर्टल पर जाएं', en: '← Back to Citizen Portal' },
  wrongPinMsg: { hi: 'गलत पिन कोड! कृपया दोबारा प्रयास करें।', en: 'Incorrect PIN! Please try again.' },

  // Categories
  cat_drinking_water: { hi: 'पेयजल व हैंडपंप', en: 'Drinking Water & Handpump' },
  cat_electricity: { hi: 'विद्युत व ट्रांसफार्मर', en: 'Electricity & Line' },
  cat_drainage_sanitation: { hi: 'नाली, कचरा व सफाई', en: 'Drainage & Sanitation' },
  cat_damaged_roads: { hi: 'सड़क व पुलिया मरम्मत', en: 'Roads & Culvert Repair' },
  cat_street_lights: { hi: 'स्ट्रीट लाइट व सोलर लाइट', en: 'Street & Solar Lights' },
  cat_health_education: { hi: 'स्वास्थ्य, स्कूल व उपकेंद्र', en: 'Health & Primary School' },
  cat_ration_welfare: { hi: 'राशन कार्ड व योजनाएं', en: 'Ration & Social Schemes' },
  cat_other: { hi: 'अन्य सार्वजनिक समस्या', en: 'Other Public Grievance' },

  // Departments
  dept_water: { hi: 'ग्रामीण पेयजल आपूर्ति (जल जीवन मिशन)', en: 'Rural Water Supply (Jal Jeevan Mission)' },
  dept_electricity: { hi: 'विद्युत वितरण निगम', en: 'Electricity Distribution Company' },
  dept_sanitation: { hi: 'स्वच्छ भारत ग्रामीण एवं सफाई प्रकोष्ठ', en: 'Swachh Bharat Sanitation Cell' },
  dept_roads: { hi: 'ग्राम पंचायत सड़क एवं निर्माण सेल', en: 'Panchayat Roads & Civil Works' },
  dept_health: { hi: 'राष्ट्रीय ग्रामीण स्वास्थ्य मिशन (NRHM)', en: 'National Rural Health Mission (NRHM)' },
  dept_sewa: { hi: 'ग्राम सचिवालय ई-सेवा केंद्र', en: 'Gram Secretariat E-Services' },
  dept_office: { hi: 'ग्राम प्रधान एवं सचिव कार्यालय', en: 'Pradhan & Secretary Office' },
};

/**
 * Universal translation helper
 */
export function t(key: string, lang: 'hi' | 'en'): string {
  if (DICTIONARY[key]) {
    return lang === 'en' ? DICTIONARY[key].en : DICTIONARY[key].hi;
  }
  return key;
}

/**
 * Translates any category key
 */
export function translateCategory(cat: string, lang: 'hi' | 'en'): string {
  const dictKey = `cat_${cat}`;
  if (DICTIONARY[dictKey]) {
    return lang === 'en' ? DICTIONARY[dictKey].en : DICTIONARY[dictKey].hi;
  }
  return cat;
}

/**
 * Translates any department name
 */
export function translateDepartment(dept: string, lang: 'hi' | 'en'): string {
  if (lang === 'hi') return dept;
  if (dept.includes('पेयजल')) return 'Rural Water Supply (Jal Jeevan Mission)';
  if (dept.includes('विद्युत')) return 'Electricity Distribution Company';
  if (dept.includes('सफाई') || dept.includes('स्वच्छ')) return 'Swachh Bharat Sanitation Cell';
  if (dept.includes('सड़क') || dept.includes('निर्माण')) return 'Panchayat Roads & Civil Works';
  if (dept.includes('स्वास्थ्य') || dept.includes('NRHM')) return 'Rural Health Mission (NRHM)';
  if (dept.includes('सचिवालय') || dept.includes('ई-सेवा')) return 'Gram Secretariat E-Services';
  if (dept.includes('कार्यालय')) return 'Pradhan & Secretary Office';
  return dept;
}

/**
 * Smart field resolver for bilingual objects
 */
export function resolveBilingualText(
  item: any,
  field: string,
  lang: 'hi' | 'en'
): string {
  if (!item) return '';

  if (lang === 'en') {
    const enField = `${field}En`;
    if (item[enField] && String(item[enField]).trim()) {
      return item[enField];
    }

    // Auto-translation mappings for common Hindi strings if enField isn't present
    const val = String(item[field] || '');
    if (val === 'सफाई कर्मी') return 'Sanitation Worker';
    if (val === 'जल मिस्त्री') return 'Water Technician';
    if (val === 'विद्युत लाइनमैन') return 'Electrician Lineman';
    if (val === 'ग्रामवासी') return 'Villager';
    if (val === 'ग्राम प्रधान') return 'Village Pradhan';
    if (val === 'पंचायत सचिव') return 'Panchayat Secretary';
    if (val === 'पोर्टल' || val === 'सिस्टम') return 'Portal System';
    if (val.startsWith('वार्ड')) {
      return val.replace('वार्ड', 'Ward').replace('उत्तर टोला', 'North Sector').replace('पूरब पट्टी', 'East Sector').replace('दक्षिण टोला', 'South Sector').replace('पश्चिम टोला', 'West Sector').replace('बाज़ार क्षेत्र', 'Market Area');
    }

    // If string has a known category / department / status translation
    if (val === 'pending') return 'Pending';
    if (val === 'under_review') return 'Under Review';
    if (val === 'in_progress') return 'In Progress';
    if (val === 'resolved') return 'Resolved';
    if (val === 'rejected') return 'Rejected';

    return val;
  }

  // Hindi
  return String(item[field] || '');
}
