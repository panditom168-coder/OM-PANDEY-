import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// File-based persistence storage
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'panchayat_db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default state with clean, customizable names
const defaultData = {
  adminPin: '1234',
  profile: {
    villageName: 'मेरी ग्राम पंचायत',
    villageNameEn: 'My Gram Panchayat',
    block: 'विकास खंड',
    district: 'जनपद',
    state: 'उत्तर प्रदेश',
    pinCode: '000000',
    pradhanName: 'ग्राम प्रधान',
    pradhanPhone: '+91 98000 00000',
    secretaryName: 'पंचायत सचिव',
    secretaryPhone: '+91 98000 00001',
    totalPopulation: 3500,
    totalHouseholds: 650,
  },
  employees: [
    {
      id: 'emp-1',
      name: 'सफाई कर्मी',
      designation: 'मुख्य स्वच्छता मित्र',
      department: 'स्वच्छ भारत ग्रामीण एवं सफाई प्रकोष्ठ',
      phone: '+91 98000 11111',
      email: 'safai@gram.in',
      assignedWards: ['वार्ड 1', 'वार्ड 2'],
      joiningDate: '2024-01-15',
      status: 'active',
      specialization: 'नाली सफाई व कूड़ा निस्तारण',
    },
    {
      id: 'emp-2',
      name: 'जल मिस्त्री',
      designation: 'पेयजल तकनीशियन',
      department: 'ग्रामीण पेयजल आपूर्ति (जल जीवन मिशन)',
      phone: '+91 98000 22222',
      email: 'jal@gram.in',
      assignedWards: ['समस्त वार्ड'],
      joiningDate: '2024-02-10',
      status: 'active',
      specialization: 'हैंडपंप व पाइपलाइन मरम्मत',
    },
    {
      id: 'emp-3',
      name: 'विद्युत लाइनमैन',
      designation: 'लाइन तकनीशियन',
      department: 'विद्युत वितरण निगम',
      phone: '+91 98000 33333',
      assignedWards: ['समस्त वार्ड'],
      joiningDate: '2024-03-01',
      status: 'active',
      specialization: 'तार व ट्रांसफार्मर देखभाल',
    },
  ],
  complaints: [
    {
      id: 'GP-101',
      title: 'मुख्य मार्ग पर पेयजल हैंडपंप की मरम्मत आवश्यक',
      description: 'हैंडपंप में पानी कम आ रहा है और चेन ढीली हो गई है। कृपया ठीक करवाया जाए।',
      category: 'drinking_water',
      citizenName: 'ग्रामवासी',
      citizenPhone: '+91 98000 44444',
      ward: 'वार्ड 01 - उत्तर टोला',
      locationDetails: 'चौराहे के पास',
      priority: 'high',
      status: 'in_progress',
      assignedDepartment: 'ग्रामीण पेयजल आपूर्ति (जल जीवन मिशन)',
      assignedEmployeeId: 'emp-2',
      assignedEmployeeName: 'जल मिस्त्री',
      dateSubmitted: new Date(Date.now() - 86400000).toISOString(),
      resolvedDate: null,
      adminRemarks: 'तकनीशियन को सामग्री उपलब्ध कराकर स्थल पर भेजा गया है। कार्य प्रगति पर है।',
      timeline: [
        {
          id: 'tl-1',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          title: 'शिकायत दर्ज हुई',
          note: 'नागरिक द्वारा पेयजल समस्या दर्ज की गई।',
          officerName: 'सिस्टम',
          officerRole: 'पोर्टल',
          statusBadge: 'pending',
        },
        {
          id: 'tl-2',
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          title: 'मरम्मत कार्य शुरू',
          note: 'जल मिस्त्री द्वारा नया वॉशर लगाने का कार्य जारी है।',
          officerName: 'जल मिस्त्री',
          officerRole: 'तकनीशियन',
          statusBadge: 'in_progress',
        },
      ],
      upvotes: 6,
      upvoterIds: ['cit-1'],
    },
  ],
  notices: [
    {
      id: 'not-1',
      title: 'पेयजल आपूर्ति व ग्राम स्वच्छता अभियान सूचना',
      content: 'ग्राम पंचायत परिसर व संपर्क मार्गों पर स्वच्छता कार्य एवं ब्लीचिंग पाउडर छिड़काव किया जा रहा है। सभी ग्रामवासी सहयोग करें।',
      category: 'announcement',
      postedDate: new Date().toISOString(),
      postedBy: 'ग्राम पंचायत कार्यालय',
      isUrgent: false,
    },
  ],
  wards: [
    { id: 'w-1', number: 1, name: 'वार्ड 01 - उत्तर टोला', area: 'प्राथमिक विद्यालय मार्ग', representative: 'वार्ड सदस्य 1', phone: '+91 98000 55001' },
    { id: 'w-2', number: 2, name: 'वार्ड 02 - पूरब पट्टी', area: 'मुख्य चौक', representative: 'वार्ड सदस्य 2', phone: '+91 98000 55002' },
    { id: 'w-3', number: 3, name: 'वार्ड 03 - दक्षिण टोला', area: 'मंदिर परिसर', representative: 'वार्ड सदस्य 3', phone: '+91 98000 55003' },
    { id: 'w-4', number: 4, name: 'वार्ड 04 - पश्चिम टोला', area: 'नहर मार्ग', representative: 'वार्ड सदस्य 4', phone: '+91 98000 55004' },
    { id: 'w-5', number: 5, name: 'वार्ड 05 - बाज़ार क्षेत्र', area: 'हाट बाज़ार', representative: 'वार्ड सदस्य 5', phone: '+91 98000 55005' },
  ],
};

function readDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading db file:', err);
  }
  return defaultData;
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db file:', err);
  }
}

// In-memory DB with disk sync
let db = readDb();

// ----------------- BACKEND REST API ROUTES ----------------- //

// 1. Get full state
app.get('/api/state', (req, res) => {
  res.json({
    profile: db.profile,
    employees: db.employees,
    complaints: db.complaints,
    notices: db.notices,
    wards: db.wards,
  });
});

// 2. Profile Management
app.get('/api/profile', (req, res) => {
  res.json(db.profile);
});

app.put('/api/profile', (req, res) => {
  db.profile = { ...db.profile, ...req.body };
  writeDb(db);
  res.json(db.profile);
});

// 3. Employee Management (CRUD)
app.get('/api/employees', (req, res) => {
  res.json(db.employees);
});

app.post('/api/employees', (req, res) => {
  const newEmp = {
    ...req.body,
    id: req.body.id || `emp-${Date.now()}`,
    joiningDate: req.body.joiningDate || new Date().toISOString().slice(0, 10),
    status: req.body.status || 'active',
  };
  db.employees.unshift(newEmp);
  writeDb(db);
  res.status(201).json(newEmp);
});

app.put('/api/employees/:id', (req, res) => {
  const id = req.params.id;
  const index = db.employees.findIndex((e: any) => e.id === id);
  if (index !== -1) {
    db.employees[index] = { ...db.employees[index], ...req.body };
    // Sync employee name with assigned complaints
    db.complaints = db.complaints.map((c: any) => {
      if (c.assignedEmployeeId === id) {
        return {
          ...c,
          assignedEmployeeName: req.body.name || c.assignedEmployeeName,
          assignedDepartment: req.body.department || c.assignedDepartment,
        };
      }
      return c;
    });
    writeDb(db);
    res.json(db.employees[index]);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.delete('/api/employees/:id', (req, res) => {
  const id = req.params.id;
  db.employees = db.employees.filter((e: any) => e.id !== id);
  // Clear assignment from complaints
  db.complaints = db.complaints.map((c: any) => {
    if (c.assignedEmployeeId === id) {
      return { ...c, assignedEmployeeId: null, assignedEmployeeName: null };
    }
    return c;
  });
  writeDb(db);
  res.json({ success: true, id });
});

// 4. Complaint Management (CRUD)
app.get('/api/complaints', (req, res) => {
  res.json(db.complaints);
});

app.post('/api/complaints', (req, res) => {
  const randomNum = Math.floor(100 + Math.random() * 900);
  const newId = `GP-${randomNum}`;
  const nowIso = new Date().toISOString();

  const newComplaint = {
    ...req.body,
    id: newId,
    status: req.body.status || 'pending',
    priority: req.body.priority || 'medium',
    dateSubmitted: nowIso,
    resolvedDate: null,
    adminRemarks: 'शिकायत दर्ज हुई। संबंधित कर्मचारी को सूचना प्रेषित।',
    timeline: [
      {
        id: `tl-${Date.now()}`,
        timestamp: nowIso,
        title: 'शिकायत सफलतापूर्वक दर्ज हुई',
        note: `नागरिक ${req.body.citizenName || 'ग्रामवासी'} द्वारा शिकायत दर्ज कराई गई।`,
        officerName: 'पोर्टल',
        officerRole: 'सिस्टम',
        statusBadge: 'pending',
      },
    ],
    upvotes: 1,
    upvoterIds: ['creator'],
  };

  db.complaints.unshift(newComplaint);
  writeDb(db);
  res.status(201).json(newComplaint);
});

app.put('/api/complaints/:id', (req, res) => {
  const id = req.params.id;
  const index = db.complaints.findIndex((c: any) => c.id === id);
  if (index !== -1) {
    db.complaints[index] = { ...db.complaints[index], ...req.body };
    writeDb(db);
    res.json(db.complaints[index]);
  } else {
    res.status(404).json({ error: 'Complaint not found' });
  }
});

// Update complaint status & add timeline entry
app.post('/api/complaints/:id/action', (req, res) => {
  const id = req.params.id;
  const { status, note, officerName, officerRole } = req.body;
  const index = db.complaints.findIndex((c: any) => c.id === id);

  if (index !== -1) {
    const c = db.complaints[index];
    const nowIso = new Date().toISOString();

    const newTimelineItem = {
      id: `tl-${Date.now()}`,
      timestamp: nowIso,
      title:
        status === 'resolved'
          ? 'समस्या का पूर्ण समाधान'
          : status === 'in_progress'
          ? 'मरम्मत कार्य प्रगति पर'
          : status === 'under_review'
          ? 'अधिकारी द्वारा स्थलीय समीक्षा'
          : 'स्थिति अपडेट',
      note: note || 'स्थिति में परिवर्तन किया गया।',
      officerName: officerName || db.profile.pradhanName || 'ग्राम अधिकारी',
      officerRole: officerRole || 'प्रशासन',
      statusBadge: status,
    };

    db.complaints[index] = {
      ...c,
      status: status || c.status,
      resolvedDate: status === 'resolved' ? nowIso : c.resolvedDate,
      adminRemarks: note || c.adminRemarks,
      timeline: [...(c.timeline || []), newTimelineItem],
    };

    writeDb(db);
    res.json(db.complaints[index]);
  } else {
    res.status(404).json({ error: 'Complaint not found' });
  }
});

app.delete('/api/complaints/:id', (req, res) => {
  const id = req.params.id;
  db.complaints = db.complaints.filter((c: any) => c.id !== id);
  writeDb(db);
  res.json({ success: true, id });
});

// 5. Notices (CRUD)
app.get('/api/notices', (req, res) => {
  res.json(db.notices);
});

app.post('/api/notices', (req, res) => {
  const newNotice = {
    ...req.body,
    id: `not-${Date.now()}`,
    postedDate: new Date().toISOString(),
  };
  db.notices.unshift(newNotice);
  writeDb(db);
  res.status(201).json(newNotice);
});

app.put('/api/notices/:id', (req, res) => {
  const id = req.params.id;
  const index = db.notices.findIndex((n: any) => n.id === id);
  if (index !== -1) {
    db.notices[index] = { ...db.notices[index], ...req.body };
    writeDb(db);
    res.json(db.notices[index]);
  } else {
    res.status(404).json({ error: 'Notice not found' });
  }
});

app.delete('/api/notices/:id', (req, res) => {
  const id = req.params.id;
  db.notices = db.notices.filter((n: any) => n.id !== id);
  writeDb(db);
  res.json({ success: true, id });
});

// 6. Wards (CRUD)
app.get('/api/wards', (req, res) => {
  res.json(db.wards);
});

app.post('/api/wards', (req, res) => {
  const newWard = {
    ...req.body,
    id: `w-${Date.now()}`,
    number: db.wards.length + 1,
  };
  db.wards.push(newWard);
  writeDb(db);
  res.status(201).json(newWard);
});

app.put('/api/wards/:id', (req, res) => {
  const id = req.params.id;
  const index = db.wards.findIndex((w: any) => w.id === id);
  if (index !== -1) {
    db.wards[index] = { ...db.wards[index], ...req.body };
    writeDb(db);
    res.json(db.wards[index]);
  } else {
    res.status(404).json({ error: 'Ward not found' });
  }
});

app.delete('/api/wards/:id', (req, res) => {
  const id = req.params.id;
  db.wards = db.wards.filter((w: any) => w.id !== id);
  writeDb(db);
  res.json({ success: true, id });
});

// 7. Admin PIN Authentication
app.post('/api/auth/verify-pin', (req, res) => {
  const { pin } = req.body;
  const currentPin = (db.adminPin || '1234').toString().trim();
  if (pin && pin.toString().trim() === currentPin) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'गलत पिन कोड! प्रवेश अस्वीकृत।' });
  }
});

app.post('/api/auth/change-pin', (req, res) => {
  const { oldPin, newPin } = req.body;
  const currentPin = (db.adminPin || '1234').toString().trim();
  const inputOldPin = (oldPin || '').toString().trim();
  const inputNewPin = (newPin || '').toString().trim();

  if (inputOldPin === currentPin && inputNewPin.length >= 4) {
    db.adminPin = inputNewPin;
    writeDb(db);
    res.json({ success: true, message: 'पिन सफलतापूर्वक बदल दिया गया।' });
  } else if (inputOldPin !== currentPin) {
    res.status(400).json({ success: false, message: 'वर्तमान सुरक्षा पिन गलत है।' });
  } else {
    res.status(400).json({ success: false, message: 'नया गुप्त पिन कम से कम 4 अंकों का होना चाहिए।' });
  }
});

// 8. Reset data
app.post('/api/reset', (req, res) => {
  db = JSON.parse(JSON.stringify(defaultData));
  writeDb(db);
  res.json({ success: true });
});

// ----------------- VITE SETUP ----------------- //
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
