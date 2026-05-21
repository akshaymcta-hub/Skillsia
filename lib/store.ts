// Types for Skillsia Academy CRM

export interface Student {
  id: string; // Auto-generated SK-YYYY-XXXX
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  mobile: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  
  qualification: string;
  collegeSchool: string;
  occupation: string;
  skillsInterested: string;

  courseName: string;
  courseDuration: string;
  batchTiming: string;
  admissionDate: string;
  courseStartDate: string;
  courseEndDate: string;

  parentName: string;
  parentMobile: string;
  emergencyContact: string;

  aadhaarNumber: string;
  aadhaarFileName?: string;

  totalCourseFees: number;
  discountAmount: number;
  finalFees: number; // Auto: totalCourseFees - discountAmount
  registrationFees: number;
  paidAmount: number; // Sum of linked payments
  pendingAmount: number; // Auto: finalFees - paidAmount
  paymentStatus: 'Paid' | 'Partial' | 'Pending'; // Checked dynamically
  nextDueDate: string;
  remarks: string;
  notes: string;
  createdAt: string;
}

export interface Payment {
  receiptNumber: string; // Auto REC-YYYY-XXXX
  studentId: string;
  studentName: string;
  paymentDate: string;
  amountPaid: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Net Banking' | 'Cheque';
  transactionId: string;
  installmentNumber: number;
  remarks: string;
  nextDueDate: string;
}

export interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
}

export interface Notification {
  id: string;
  studentId: string;
  studentName: string;
  type: 'Due Date Reminder' | 'Pending Fees' | 'Payment Success' | 'New Admission';
  description: string;
  date: string;
  isRead: boolean;
  dueDate?: string;
  amount?: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
}

export interface CRMState {
  students: Student[];
  payments: Payment[];
  courses: Course[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
  isDark: boolean;
  currentUser: { email: string; fullName: string } | null;
}

// Default initial lists for a spectacular state presentation on first load
export const INITIAL_COURSES: Course[] = [
  { id: 'C1', name: 'SCDM', duration: '3 Months', fees: 25000 },
  { id: 'C2', name: 'SCSEO', duration: '3 Months', fees: 20000 },
  { id: 'C3', name: 'SCSEM', duration: '6 Months', fees: 55000 },
  { id: 'C4', name: 'SCSMM', duration: '4 Months', fees: 35000 },
  { id: 'C5', name: 'Corporate Training', duration: '6 Months', fees: 45000 }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "SK-2026-0001",
    fullName: "Aryan Sharma",
    gender: "Male",
    dob: "2002-12-15",
    mobile: "9876543210",
    whatsapp: "9876543210",
    email: "aryan.sharma@gmail.com",
    address: "Flat 405, Suncity Heights",
    city: "New Delhi",
    state: "Delhi",
    pinCode: "110001",
    qualification: "B.Tech Undergrad",
    collegeSchool: "Amity University",
    occupation: "Student",
    skillsInterested: "React, Node.js, Web Technologies",
    courseName: "Corporate Training",
    courseDuration: "6 Months",
    batchTiming: "09:00 AM - 11:00 AM",
    admissionDate: "2026-03-10",
    courseStartDate: "2026-03-15",
    courseEndDate: "2026-09-15",
    parentName: "Sanjay Sharma",
    parentMobile: "9812345678",
    emergencyContact: "9812345678",
    aadhaarNumber: "1234 5678 9012",
    aadhaarFileName: "aadhaar_aryan.pdf",
    totalCourseFees: 45000,
    discountAmount: 5000,
    finalFees: 40000,
    registrationFees: 5000,
    paidAmount: 40000,
    pendingAmount: 0,
    paymentStatus: "Paid",
    nextDueDate: "",
    remarks: "Full fee paid in advance with discount",
    notes: "Very interactive and grasping. Working on assignment projects on time.",
    createdAt: "2026-03-10T11:30:00Z"
  },
  {
    id: "SK-2026-0002",
    fullName: "Ananya Iyer",
    gender: "Female",
    dob: "2003-05-24",
    mobile: "9123456780",
    whatsapp: "9123456780",
    email: "ananya.iyer@yahoo.com",
    address: "Flat 12B, Ocean Spray",
    city: "Mumbai",
    state: "Maharashtra",
    pinCode: "400001",
    qualification: "B.Sc General",
    collegeSchool: "Mithibai College",
    occupation: "Student",
    skillsInterested: "Figma, Adobe XD, Typography",
    courseName: "SCDM",
    courseDuration: "3 Months",
    batchTiming: "11:30 AM - 01:30 PM",
    admissionDate: "2026-04-12",
    courseStartDate: "2026-04-15",
    courseEndDate: "2026-07-15",
    parentName: "Ganesh Iyer",
    parentMobile: "9123498765",
    emergencyContact: "9123498765",
    aadhaarNumber: "4567 8901 2345",
    aadhaarFileName: "aadhaar_ananya.jpg",
    totalCourseFees: 25000,
    discountAmount: 1000,
    finalFees: 24000,
    registrationFees: 4000,
    paidAmount: 14000,
    pendingAmount: 10000,
    paymentStatus: "Partial",
    nextDueDate: "2026-05-25",
    remarks: "10,000 pending to be paid as 2nd installment",
    notes: "Outstanding progress, designs are clean. Reminded about fee next installment.",
    createdAt: "2026-04-12T09:45:00Z"
  },
  {
    id: "SK-2026-0003",
    fullName: "Rohan Das",
    gender: "Male",
    dob: "2000-08-11",
    mobile: "8765432109",
    whatsapp: "8765432109",
    email: "rohan.das@gmail.com",
    address: "Block G, Salt Lake Sec 5",
    city: "Kolkata",
    state: "West Bengal",
    pinCode: "700091",
    qualification: "MBA Graduate",
    collegeSchool: "IEM Kolkata",
    occupation: "Job Seeker",
    skillsInterested: "SEO, SEM, Copywriting, Ads",
    courseName: "SCSEO",
    courseDuration: "3 Months",
    batchTiming: "04:30 PM - 06:30 PM",
    admissionDate: "2026-05-01",
    courseStartDate: "2026-05-05",
    courseEndDate: "2026-08-05",
    parentName: "Pranab Das",
    parentMobile: "8765400112",
    emergencyContact: "8765400112",
    aadhaarNumber: "7890 1234 5678",
    aadhaarFileName: "aadhar_rohan.pdf",
    totalCourseFees: 20000,
    discountAmount: 0,
    finalFees: 20000,
    registrationFees: 5000,
    paidAmount: 5000,
    pendingAmount: 15000,
    paymentStatus: "Partial",
    nextDueDate: "2026-05-20", // Overdue by yesterday!
    remarks: "Paid registration fees. Instalment overdue on May 20th",
    notes: "Absented from class on May 18th due to sibling wedding. Reminded via Email & WhatsApp for Pending installment.",
    createdAt: "2026-05-01T14:15:00Z"
  },
  {
    id: "SK-2026-0004",
    fullName: "Priyanka Patel",
    gender: "Female",
    dob: "1998-03-31",
    mobile: "7654321098",
    whatsapp: "7654321098",
    email: "priyanka.patel@outlook.com",
    address: "34, Sardar Patel Marg",
    city: "Ahmedabad",
    state: "Gujarat",
    pinCode: "380009",
    qualification: "B.CA Graduate",
    collegeSchool: "LD College of Engg",
    occupation: "Working Professional",
    skillsInterested: "Python, ML, Scikit Learn, Pandas",
    courseName: "SCSEM",
    courseDuration: "6 Months",
    batchTiming: "07:00 PM - 09:00 PM",
    admissionDate: "2026-02-15",
    courseStartDate: "2026-02-20",
    courseEndDate: "2026-08-20",
    parentName: "Vijay Patel",
    parentMobile: "7654300998",
    emergencyContact: "7654300998",
    aadhaarNumber: "9012 3456 7890",
    aadhaarFileName: "aadhaar_priyanka.jpg",
    totalCourseFees: 55000,
    discountAmount: 5000,
    finalFees: 50000,
    registrationFees: 10000,
    paidAmount: 25000,
    pendingAmount: 25000,
    paymentStatus: "Partial",
    nextDueDate: "2026-06-15",
    remarks: "Paid 10k registration and 15k first installment. Balance 25k split as 2 monthly installments.",
    notes: "Highly professional, working as Analyst. Learning fast.",
    createdAt: "2026-02-15T18:00:00Z"
  },
  {
    id: "SK-2026-0005",
    fullName: "Kabir Malhotra",
    gender: "Male",
    dob: "2001-11-02",
    mobile: "6543210987",
    whatsapp: "6543210987",
    email: "kabir.malhotra@gmail.com",
    address: "Sector 15, H.No 120",
    city: "Chandigarh",
    state: "Chandigarh",
    pinCode: "160015",
    qualification: "BBA Pursuing",
    collegeSchool: "DAV College",
    occupation: "Student",
    skillsInterested: "Flutter, React Native",
    courseName: "SCSMM",
    courseDuration: "4 Months",
    batchTiming: "02:00 PM - 04:00 PM",
    admissionDate: "2026-05-15",
    courseStartDate: "2026-05-20",
    courseEndDate: "2026-09-20",
    parentName: "Rajeev Malhotra",
    parentMobile: "6543200112",
    emergencyContact: "6543200112",
    aadhaarNumber: "2345 6789 0123",
    aadhaarFileName: "aadhaar_kabir.pdf",
    totalCourseFees: 35000,
    discountAmount: 5000,
    finalFees: 30000,
    registrationFees: 30000,
    paidAmount: 30000,
    pendingAmount: 0,
    paymentStatus: "Paid",
    nextDueDate: "",
    remarks: "Full fee paid at once with special flat discount approved by director.",
    notes: "Admitted newly into the Flutter batch.",
    createdAt: "2026-05-15T10:00:00Z"
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  // Aryan Sharma Payments (SK-2026-0001) Final fees 40,000
  {
    receiptNumber: "REC-2026-0001",
    studentId: "SK-2026-0001",
    studentName: "Aryan Sharma",
    paymentDate: "2026-03-10",
    amountPaid: 5000,
    paymentMethod: "UPI",
    transactionId: "TXN1029384756",
    installmentNumber: 1,
    remarks: "Registration Fees",
    nextDueDate: "2026-03-15"
  },
  {
    receiptNumber: "REC-2026-0002",
    studentId: "SK-2026-0001",
    studentName: "Aryan Sharma",
    paymentDate: "2026-03-15",
    amountPaid: 35000,
    paymentMethod: "Net Banking",
    transactionId: "TXN2039485761",
    installmentNumber: 2,
    remarks: "Final advance course fee payment",
    nextDueDate: ""
  },
  // Ananya Iyer Payments (SK-2026-0002) Final fees 24,000, Paid 14,000, Pending 10,000
  {
    receiptNumber: "REC-2026-0003",
    studentId: "SK-2026-0002",
    studentName: "Ananya Iyer",
    paymentDate: "2026-04-12",
    amountPaid: 4000,
    paymentMethod: "UPI",
    transactionId: "TXN4059681123",
    installmentNumber: 1,
    remarks: "Registration amount",
    nextDueDate: "2026-04-15"
  },
  {
    receiptNumber: "REC-2026-0004",
    studentId: "SK-2026-0002",
    studentName: "Ananya Iyer",
    paymentDate: "2026-04-15",
    amountPaid: 10000,
    paymentMethod: "Card",
    transactionId: "TXN9048375862",
    installmentNumber: 2,
    remarks: "First Installment payment",
    nextDueDate: "2026-05-25"
  },
  // Rohan Das Payments (SK-2026-0003) Final fees 20,000, Paid 5,000, Pending 15,000
  {
    receiptNumber: "REC-2026-0005",
    studentId: "SK-2026-0003",
    studentName: "Rohan Das",
    paymentDate: "2026-05-01",
    amountPaid: 5000,
    paymentMethod: "Cash",
    transactionId: "CASH_501",
    installmentNumber: 1,
    remarks: "Registration Fee payment",
    nextDueDate: "2026-05-20"
  },
  // Priyanka Patel Payments (SK-2026-0004) Final fees 50,000, Paid 25,000, Pending 25,000
  {
    receiptNumber: "REC-2026-0006",
    studentId: "SK-2026-0004",
    studentName: "Priyanka Patel",
    paymentDate: "2026-02-15",
    amountPaid: 10000,
    paymentMethod: "Net Banking",
    transactionId: "TXN5599881122",
    installmentNumber: 1,
    remarks: "Registration Amount paid online",
    nextDueDate: "2026-02-20"
  },
  {
    receiptNumber: "REC-2026-0007",
    studentId: "SK-2026-0004",
    studentName: "Priyanka Patel",
    paymentDate: "2026-02-20",
    amountPaid: 15000,
    paymentMethod: "UPI",
    transactionId: "TXN1122334455",
    installmentNumber: 2,
    remarks: "First installment out of total",
    nextDueDate: "2026-06-15"
  },
  // Kabir Malhotra Payments (SK-2026-0005) Final fees 30,000, Paid 30,000
  {
    receiptNumber: "REC-2026-0008",
    studentId: "SK-2026-0005",
    studentName: "Kabir Malhotra",
    paymentDate: "2026-05-15",
    amountPaid: 30000,
    paymentMethod: "Net Banking",
    transactionId: "TXN9988001122",
    installmentNumber: 1,
    remarks: "Full Course Fees paid with registration",
    nextDueDate: ""
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "NOTIF-0001",
    studentId: "SK-2026-0003",
    studentName: "Rohan Das",
    type: "Pending Fees",
    description: "Installment of ₹15,000 is overdue since May 20th, 2026.",
    date: "2026-05-21T00:00:00Z",
    isRead: false,
    dueDate: "2026-05-20",
    amount: 15000
  },
  {
    id: "NOTIF-0002",
    studentId: "SK-2026-0002",
    studentName: "Ananya Iyer",
    type: "Due Date Reminder",
    description: "Installment of ₹10,000 is due in 4 days (May 25th, 2026).",
    date: "2026-05-21T01:00:00Z",
    isRead: false,
    dueDate: "2026-05-25",
    amount: 10000
  },
  {
    id: "NOTIF-0003",
    studentId: "SK-2026-0005",
    studentName: "Kabir Malhotra",
    type: "New Admission",
    description: "New registration completed: Kabir Malhotra enrolled for Mobile App Development.",
    date: "2026-05-15T10:00:00Z",
    isRead: true
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "LOG-0001",
    timestamp: "2026-05-21T02:00:00Z",
    action: "System Initialization",
    details: "Skillsia Academy database system initialized successfully with default records.",
    user: "System Admin"
  },
  {
    id: "LOG-0002",
    timestamp: "2026-05-15T10:05:00Z",
    action: "Add Admission",
    details: "Student Kabir Malhotra (SK-2026-0005) was registered.",
    user: "info@skillsia.in"
  },
  {
    id: "LOG-0003",
    timestamp: "2026-05-15T10:10:00Z",
    action: "Collect Fee",
    details: "Collected full fees ₹30,000 of Kabir Malhotra. Receipt REC-2026-0008 issued.",
    user: "info@skillsia.in"
  }
];

// Helper functions for application store
export function getSavedState(): CRMState {
  if (typeof window === "undefined") {
    return {
      students: INITIAL_STUDENTS,
      payments: INITIAL_PAYMENTS,
      courses: INITIAL_COURSES,
      notifications: INITIAL_NOTIFICATIONS,
      activityLogs: INITIAL_ACTIVITY_LOGS,
      isDark: false,
      currentUser: null,
    };
  }

  try {
    const saved = localStorage.getItem("skillsia_crm_state");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate structure matches
      if (parsed.students && parsed.payments) {
        // Self-heal and safeguard any missing arrays or fields from older state schemas
        parsed.students = Array.isArray(parsed.students) ? parsed.students : INITIAL_STUDENTS;
        parsed.payments = Array.isArray(parsed.payments) ? parsed.payments : INITIAL_PAYMENTS;
        parsed.courses = Array.isArray(parsed.courses) ? parsed.courses : INITIAL_COURSES;
        parsed.notifications = Array.isArray(parsed.notifications) ? parsed.notifications : INITIAL_NOTIFICATIONS;
        parsed.activityLogs = Array.isArray(parsed.activityLogs) ? parsed.activityLogs : INITIAL_ACTIVITY_LOGS;
        parsed.isDark = typeof parsed.isDark === "boolean" ? parsed.isDark : false;
        if (parsed.currentUser === undefined) {
          parsed.currentUser = null;
        }

        // Sync with newest courses/students if the cached ones are outdated
        if (
          !parsed.courses ||
          parsed.courses.length !== INITIAL_COURSES.length ||
          parsed.courses[0]?.name !== INITIAL_COURSES[0].name
        ) {
          parsed.courses = INITIAL_COURSES;
          parsed.students = INITIAL_STUDENTS;
          parsed.payments = INITIAL_PAYMENTS;
          saveState(parsed);
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to parse saved state", err);
  }

  // Def-fallback
  const state: CRMState = {
    students: INITIAL_STUDENTS,
    payments: INITIAL_PAYMENTS,
    courses: INITIAL_COURSES,
    notifications: INITIAL_NOTIFICATIONS,
    activityLogs: INITIAL_ACTIVITY_LOGS,
    isDark: false,
    currentUser: null,
  };
  saveState(state);
  return state;
}

export function saveState(state: CRMState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("skillsia_crm_state", JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save state to localStorage", err);
  }
}

// Helper to auto-generate Student ID based on year
export function generateStudentId(students: Student[], year: number = 2026): string {
  const prefix = `SK-${year}-`;
  const yearStudents = students.filter(s => s.id.startsWith(prefix));
  let maxNum = 0;
  yearStudents.forEach(s => {
    const numPart = s.id.substring(prefix.length);
    const parsed = parseInt(numPart, 10);
    if (!isNaN(parsed) && parsed > maxNum) {
      maxNum = parsed;
    }
  });
  const nextNum = maxNum + 1;
  const numString = String(nextNum).padStart(4, '0');
  return `${prefix}${numString}`;
}

// Helper to auto-generate Receipt Number
export function generateReceiptNumber(payments: Payment[], year: number = 2026): string {
  const prefix = `REC-${year}-`;
  const yearPayments = payments.filter(p => p.receiptNumber.startsWith(prefix));
  let maxNum = 0;
  yearPayments.forEach(p => {
    const numPart = p.receiptNumber.substring(prefix.length);
    const parsed = parseInt(numPart, 10);
    if (!isNaN(parsed) && parsed > maxNum) {
      maxNum = parsed;
    }
  });
  const nextNum = maxNum + 1;
  const numString = String(nextNum).padStart(4, '0');
  return `${prefix}${numString}`;
}
