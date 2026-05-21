'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  UploadCloud, 
  Plus, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Contact, 
  Coins,
  CheckCircle
} from 'lucide-react';
import { Student, Course, INITIAL_COURSES } from '@/lib/store';

interface StudentFormProps {
  student: Student | null; // Null if adding a new student
  onSave: (data: Omit<Student, 'id' | 'paidAmount' | 'pendingAmount' | 'paymentStatus' | 'createdAt'> & { id?: string }) => void;
  onCancel: () => void;
  isDark: boolean;
}

const BATCH_TIMINGS = [
  "07:30 AM - 09:30 AM",
  "09:00 AM - 11:00 AM",
  "11:30 AM - 01:30 PM",
  "02:00 PM - 04:00 PM",
  "04:30 PM - 06:30 PM",
  "07:00 PM - 09:00 PM",
  "08:30 PM - 10:30 PM"
];

export function StudentForm({ student, onSave, onCancel, isDark }: StudentFormProps) {
  // 1. Core State
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');

  const [qualification, setQualification] = useState('');
  const [collegeSchool, setCollegeSchool] = useState('');
  const [occupation, setOccupation] = useState('');
  const [skillsInterested, setSkillsInterested] = useState('');

  const [courseName, setCourseName] = useState(INITIAL_COURSES[0].name);
  const [courseDuration, setCourseDuration] = useState('6 Months');
  const [batchTiming, setBatchTiming] = useState(BATCH_TIMINGS[1]);
  const [admissionDate, setAdmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [courseStartDate, setCourseStartDate] = useState('');
  const [courseEndDate, setCourseEndDate] = useState('');

  const [parentName, setParentName] = useState('');
  const [parentMobile, setParentMobile] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarFileName, setAadhaarFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Fees values
  const [totalCourseFees, setTotalCourseFees] = useState(INITIAL_COURSES[0].fees);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [registrationFees, setRegistrationFees] = useState(5000);
  const [nextDueDate, setNextDueDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [notes, setNotes] = useState('');

  // 2. Pre-fill on Edit Mode
  useEffect(() => {
    if (student) {
      const timer = setTimeout(() => {
        setFullName(student.fullName);
        setGender(student.gender);
        setDob(student.dob);
        setMobile(student.mobile);
        setWhatsapp(student.whatsapp);
        setEmail(student.email);
        setAddress(student.address);
        setCity(student.city);
        setState(student.state);
        setPinCode(student.pinCode);
        setQualification(student.qualification);
        setCollegeSchool(student.collegeSchool);
        setOccupation(student.occupation);
        setSkillsInterested(student.skillsInterested);
        setCourseName(student.courseName);
        setCourseDuration(student.courseDuration);
        setBatchTiming(student.batchTiming);
        setAdmissionDate(student.admissionDate);
        setCourseStartDate(student.courseStartDate);
        setCourseEndDate(student.courseEndDate);
        setParentName(student.parentName);
        setParentMobile(student.parentMobile);
        setEmergencyContact(student.emergencyContact);
        setAadhaarNumber(student.aadhaarNumber);
        setAadhaarFileName(student.aadhaarFileName || '');
        setTotalCourseFees(student.totalCourseFees);
        setDiscountAmount(student.discountAmount);
        setRegistrationFees(student.registrationFees);
        setNextDueDate(student.nextDueDate);
        setRemarks(student.remarks);
        setNotes(student.notes);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [student]);

  // Sync Course name selection to Auto-populate fee and duration
  const handleCourseChange = (selectedName: string) => {
    setCourseName(selectedName);
    const matched = INITIAL_COURSES.find(c => c.name === selectedName);
    if (matched) {
      setTotalCourseFees(matched.fees);
      setCourseDuration(matched.duration);
      const start = new Date(courseStartDate || admissionDate);
      const months = matched.duration.toLowerCase().includes('6') ? 6 : matched.duration.toLowerCase().includes('4') ? 4 : 3;
      start.setMonth(start.getMonth() + months);
      setCourseEndDate(start.toISOString().split('T')[0]);
    }
  };

  const finalFees = totalCourseFees - discountAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !mobile || !courseName) {
      alert('Please fill out Name, Mobile and Course to register.');
      return;
    }

    onSave({
      ...(student ? { id: student.id } : {}),
      fullName,
      gender,
      dob,
      mobile,
      whatsapp: whatsapp || mobile, 
      email,
      address,
      city,
      state,
      pinCode,
      qualification,
      collegeSchool,
      occupation,
      skillsInterested,
      courseName,
      courseDuration,
      batchTiming,
      admissionDate,
      courseStartDate: courseStartDate || admissionDate,
      courseEndDate: courseEndDate || new Date().toISOString().split('T')[0],
      parentName,
      parentMobile,
      emergencyContact,
      aadhaarNumber,
      aadhaarFileName: aadhaarFileName || 'SelfUploaded_Aadhaar.pdf',
      totalCourseFees: Number(totalCourseFees),
      discountAmount: Number(discountAmount),
      finalFees: Number(finalFees),
      registrationFees: Number(registrationFees),
      nextDueDate,
      remarks,
      notes
    });
  };

  const handleSimulatedUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      setAadhaarFileName(files[0].name);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200/60 dark:border-zinc-800">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-zinc-50">
            {student ? `Modify Profile: ${student.fullName}` : 'Admit & Register New Student'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Fill out academic, commercial, and emergency parameters for class registration.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition-colors ${
            isDark ? 'border-zinc-800 hover:bg-zinc-900 text-zinc-300' : 'border-slate-205 bg-white hover:bg-slate-50 text-slate-700 shadow-xs'
          }`}
        >
          Go Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Demographics */}
          <div className={`p-5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
            <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mb-4 text-violet-600 dark:text-violet-400 font-mono">
              <Contact className="w-4 h-4" />
              1. Basic Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aryan Sharma"
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9876543210"
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">WhatsApp Number</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Same as mobile"
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gmail.com"
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Address Details</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Plot No, Street, Landmark"
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New Delhi"
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Delhi"
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">PIN Code</label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="110001"
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academics */}
          <div className={`p-5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
            <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400 font-mono">
              <GraduationCap className="w-4.5 h-4.5" />
              2. Academic Qualification &amp; Aspirations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Qualification</label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="B.Tech Undergrad / PostGraduate"
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">College / School Name</label>
                <input
                  type="text"
                  value={collegeSchool}
                  onChange={(e) => setCollegeSchool(e.target.value)}
                  placeholder="Amity University"
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Occupation</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="Student / Job Seeker / Professional"
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Skills Interested In</label>
                <input
                  type="text"
                  value={skillsInterested}
                  onChange={(e) => setSkillsInterested(e.target.value)}
                  placeholder="React, Next.js, Product Design"
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Course setup */}
          <div className={`p-5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
            <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400 font-mono">
              <BookOpen className="w-4.5 h-4.5" />
              3. Course Selection &amp; Timings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Course *</label>
                <select
                  value={courseName}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  {INITIAL_COURSES.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Batch Timing</label>
                <select
                  value={batchTiming}
                  onChange={(e) => setBatchTiming(e.target.value)}
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  {BATCH_TIMINGS.map((timing, idx) => (
                    <option key={idx} value={timing}>{timing}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Course Duration</label>
                <input
                  type="text"
                  value={courseDuration}
                  disabled
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border outline-none opacity-80 ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-slate-50 border-slate-205 text-slate-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Admission Date</label>
                <input
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Class Commencing Date</label>
                <input
                  type="date"
                  value={courseStartDate}
                  onChange={(e) => setCourseStartDate(e.target.value)}
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Estimated End Date</label>
                <input
                  type="date"
                  value={courseEndDate}
                  onChange={(e) => setCourseEndDate(e.target.value)}
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Emergency Contacts */}
          <div className={`p-5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
            <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400 font-mono">
              <Contact className="w-4.5 h-4.5" />
              4. Emergency &amp; Parent References
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Parent / Guardian Full Name</label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Sanjay Sharma"
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Parent Mobile Number</label>
                <input
                  type="tel"
                  value={parentMobile}
                  onChange={(e) => setParentMobile(e.target.value)}
                  placeholder="9812345678"
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Alternate Emergency Number *</label>
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Additional backup contact"
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-905'
                  }`}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Columns: Documents, Aadhaar simulated upload, fee totals */}
        <div className="space-y-6">
          
          {/* Section 5: Documents */}
          <div className={`p-5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
            <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mb-4 text-pink-600 dark:text-pink-400 font-mono">
              <FileText className="w-4.5 h-4.5" />
              5. KYC Verification Gate
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Aadhaar Card Number</label>
                <input
                  type="text"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  placeholder="1234 5678 9012"
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Aadhaar Document Attachment</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleSimulatedUpload(e.dataTransfer.files); }}
                  className={`border-2 border-dashed rounded-lg p-5 text-center transition-all cursor-pointer ${
                    isDragOver 
                      ? 'border-indigo-500 bg-indigo-50/10' 
                      : aadhaarFileName 
                        ? 'border-emerald-500 bg-emerald-500/5' 
                        : 'border-slate-200 dark:border-zinc-800 hover:border-slate-350'
                  }`}
                >
                  <input
                    type="file"
                    id="file-aadhar"
                    className="hidden"
                    onChange={(e) => handleSimulatedUpload(e.target.files)}
                  />
                  <label htmlFor="file-aadhar" className="cursor-pointer">
                    <UploadCloud className={`w-8 h-8 mx-auto mb-1.5 ${aadhaarFileName ? 'text-emerald-500' : 'text-slate-400'}`} />
                    {aadhaarFileName ? (
                      <div>
                        <p className="text-xs font-semibold text-emerald-500">Document Uploaded</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{aadhaarFileName}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-medium text-slate-700 dark:text-zinc-300">Drag &amp; drop Aadhaar image</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, JPG, PNG up to 2MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Commercial details */}
          <div className={`p-5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
            <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mb-4 text-amber-600 dark:text-amber-500 font-mono">
              <Coins className="w-4.5 h-4.5" />
              6. Enrollment Fees Outline
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Total Course Fee (₹)</label>
                <input
                  type="number"
                  value={totalCourseFees}
                  onChange={(e) => setTotalCourseFees(Number(e.target.value))}
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Discount Amount (₹)</label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-900/40 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-zinc-300">Final Net Fees</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 font-mono">₹{finalFees.toLocaleString('en-IN')}</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Registration Amount (₹)</label>
                <input
                  type="number"
                  value={registrationFees}
                  onChange={(e) => setRegistrationFees(Number(e.target.value))}
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Next Payment Due Date</label>
                <input
                  type="date"
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Commercial Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Split initial as Google Pay installment.."
                  rows={2}
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">Coordinator Assignment Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Highly energetic, interested in modern react hooks.."
                  rows={2}
                  className={`w-full text-xs px-3.5 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 py-2.5 border rounded-lg text-xs font-semibold leading-none ${
                isDark ? 'border-zinc-805 hover:bg-zinc-900 text-zinc-300' : 'border-slate-200 hover:bg-slate-50 text-slate-600 shadow-xs'
              }`}
            >
              Cancel Profile Page
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg leading-none flex items-center justify-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Save Student Record
            </button>
          </div>

        </div>
      </div>
    </form>
  );
}
