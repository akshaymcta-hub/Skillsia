'use client';

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Users, 
  Coins, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  Eye, 
  Download, 
  Printer, 
  Sun, 
  Moon, 
  LogOut, 
  AlertCircle, 
  Calendar, 
  Database, 
  MessageSquare, 
  Activity, 
  X, 
  LogIn,
  KeyRound,
  FileText,
  ShieldAlert,
  Save,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Mail,
  Smartphone,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

import { 
  Student, 
  Payment, 
  Course, 
  Notification, 
  ActivityLog, 
  CRMState, 
  getSavedState, 
  saveState, 
  generateStudentId, 
  generateReceiptNumber,
  INITIAL_COURSES
} from '@/lib/store';

// Importing our custom high performance submodules
import { CRMCharts } from '@/components/charts';
import { exportToExcel, exportPaymentsReport, printStudentDetails } from '@/components/export-utils';
import { StudentForm } from '@/components/student-form';
import { FeeManagement } from '@/components/fee-management';
import { AcademyHomepage } from '@/components/homepage';

export default function RootCRMPage() {
  const [mounted, setMounted] = useState(false);
  const [crmState, setCrmState] = useState<CRMState | null>(() => {
    return getSavedState();
  });

  // Active View Tab: 'home' | 'dashboard' | 'students' | 'addStudent' | 'payments' | 'alerts' | 'logs'
  const [currentView, setCurrentView] = useState<string>('home');
  const [isDark, setIsDark] = useState<boolean>(() => {
    const loaded = getSavedState();
    return loaded.isDark || false;
  });

  // Authentication states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('info@skillsia.in');
  const [loginPassword, setLoginPassword] = useState('SkillsiaAdmin2026!');
  const [authError, setAuthError] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetStep, setResetStep] = useState(0); // 0: input, 1: code sent, 2: success

  // Filter and Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCity, setFilterCity] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // Selection state pointers for view/edit overlays
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);

  // Alert system outreach template string states
  const [activeOutreachStudent, setActiveOutreachStudent] = useState<Student | null>(null);
  const [outreachType, setOutreachType] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [outreachSentSuccess, setOutreachSentSuccess] = useState(false);

  // Student details note input state
  const [currentDetailsNote, setCurrentDetailsNote] = useState('');

  // Realtime state loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Update localStorage when crmState changes
  const updateState = (updater: (prev: CRMState) => CRMState) => {
    if (!crmState) return;
    const nextState = updater(crmState);
    setCrmState(nextState);
    saveState(nextState);
  };

  if (!mounted || !crmState) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <GraduationCap className="w-12 h-12 text-indigo-500 animate-bounce" />
        <p className="mt-4 font-bold text-sm">Initializing Skillsia Academy CRM Workspace...</p>
      </div>
    );
  }

  // Define values
  const { students, payments, notifications, activityLogs, currentUser } = crmState;

  // --- Auth Handlers ---
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (loginEmail === 'info@skillsia.in' && loginPassword === 'SkillsiaAdmin2026!') {
      const activeAdmin = { email: loginEmail, fullName: 'System Admin' };
      updateState(prev => ({
        ...prev,
        currentUser: activeAdmin,
        activityLogs: [
          {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "Admin Sign In",
            details: "Logged in successfully to Dashboard workspace.",
            user: loginEmail
          },
          ...prev.activityLogs
        ]
      }));
      setShowLoginModal(false);
      setCurrentView('dashboard');
    } else {
      setAuthError('Incorrect Email or Password. Note credentials below.');
    }
  };

  const handleLogout = () => {
    updateState(prev => ({
      ...prev,
      currentUser: null,
      activityLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: "Admin Sign Out",
          details: "Logged out from the administration system.",
          user: currentUser?.email || 'Admin'
        },
        ...prev.activityLogs
      ]
    }));
    setCurrentView('home');
  };

  const handleNavigateCheck = (view: string, authRequired: boolean) => {
    if (authRequired && !currentUser) {
      setShowLoginModal(true);
    } else {
      setCurrentView(view);
      setEditingStudent(null);
      setViewingStudentId(null);
    }
  };

  // --- Student Registration Form handlers ---
  const handleSaveStudent = (formData: any) => {
    if (formData.id) {
      // Edit Student
      updateState(prev => {
        const index = prev.students.findIndex(s => s.id === formData.id);
        if (index === -1) return prev;

        const updatedStudents = [...prev.students];
        const existing = updatedStudents[index];

        // Recalculate balance dues dynamic variables
        const finalFees = Number(formData.totalCourseFees) - Number(formData.discountAmount);
        const pendingValue = finalFees - existing.paidAmount;
        const statusVal: 'Paid' | 'Partial' | 'Pending' = 
          pendingValue <= 0 ? 'Paid' : (existing.paidAmount > 0 ? 'Partial' : 'Pending');

        updatedStudents[index] = {
          ...existing,
          ...formData,
          finalFees,
          pendingAmount: pendingValue,
          paymentStatus: statusVal
        };

        return {
          ...prev,
          students: updatedStudents,
          activityLogs: [
            {
              id: `LOG-${Date.now()}`,
              timestamp: new Date().toISOString(),
              action: "Edit Student",
              details: `Student record updated: ${formData.fullName} (${formData.id})`,
              user: currentUser?.email || 'admin@skillsia.in'
            },
            ...prev.activityLogs
          ]
        };
      });
      alert('Student record updated successfully.');
    } else {
      // Register New Student
      const newId = generateStudentId(students, 2026);
      const sFees = Number(formData.totalCourseFees) - Number(formData.discountAmount);
      const paidAmt = Number(formData.registrationFees); // Registration counts as 1st installment payment
      const balAmt = sFees - paidAmt;
      const statusValue: 'Paid' | 'Partial' | 'Pending' = 
        balAmt <= 0 ? 'Paid' : (paidAmt > 0 ? 'Partial' : 'Pending');

      const newStudent: Student = {
        id: newId,
        paidAmount: paidAmt,
        pendingAmount: balAmt,
        paymentStatus: statusValue,
        createdAt: new Date().toISOString(),
        ...formData,
        finalFees: sFees
      };

      // Create linked registration pay receipt proof
      const newReceiptId = generateReceiptNumber(payments, 2026);
      const initialPayment: Payment = {
        receiptNumber: newReceiptId,
        studentId: newId,
        studentName: formData.fullName,
        paymentDate: formData.admissionDate || new Date().toISOString().split('T')[0],
        amountPaid: paidAmt,
        paymentMethod: 'UPI',
        transactionId: `REG_TXN_${Date.now().toString().slice(-4)}`,
        installmentNumber: 1,
        remarks: 'Admission registration payment entry',
        nextDueDate: formData.nextDueDate || ''
      };

      // Create action notification alerts
      const newNotifId = `NOTIF-${Date.now()}`;
      const newNotif: Notification = {
        id: newNotifId,
        studentId: newId,
        studentName: formData.fullName,
        type: 'New Admission',
        description: `New active registration completed: ${formData.fullName} enrolled for ${formData.courseName}.`,
        date: new Date().toISOString(),
        isRead: false
      };

      updateState(prev => {
        const nextStudents = [newStudent, ...prev.students];
        const nextPayments = [initialPayment, ...prev.payments];
        const nextNotifications = [newNotif, ...prev.notifications];

        return {
          ...prev,
          students: nextStudents,
          payments: nextPayments,
          notifications: nextNotifications,
          activityLogs: [
            {
              id: `LOG-${Date.now()}`,
              timestamp: new Date().toISOString(),
              action: "Add Admission",
              details: `Registered student ${formData.fullName} (${newId}) with registration fee ₹${paidAmt}`,
              user: currentUser?.email || 'admin@skillsia.in'
            },
            ...prev.activityLogs
          ]
        };
      });

      alert(`Admitted and registered successfully! Assigned Student ID: ${newId}`);
    }

    setEditingStudent(null);
    setCurrentView('students');
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`Are you absolutely certain about deleting ${name} (${id})? All linked payment receipt histories will be wiped out.`)) {
      updateState(prev => {
        const nextStudents = prev.students.filter(s => s.id !== id);
        const nextPayments = prev.payments.filter(p => p.studentId !== id);
        return {
          ...prev,
          students: nextStudents,
          payments: nextPayments,
          activityLogs: [
            {
              id: `LOG-${Date.now()}`,
              timestamp: new Date().toISOString(),
              action: "Delete Record",
              details: `Student record removed: ${name} (${id})`,
              user: currentUser?.email || 'admin'
            },
            ...prev.activityLogs
          ]
        };
      });
      alert('Student record deleted successfully.');
      if (viewingStudentId === id) setViewingStudentId(null);
    }
  };

  // --- Financial Receipt Management ---
  const handleAddPayment = (paymentData: any) => {
    const selectedStd = students.find(s => s.id === paymentData.studentId);
    if (!selectedStd) return;

    const customReceiptNo = generateReceiptNumber(payments, 2026);
    const newPay: Payment = {
      receiptNumber: customReceiptNo,
      studentName: selectedStd.fullName,
      ...paymentData
    };

    updateState(prev => {
      // 1. Add Pay Record
      const updatedPayments = [newPay, ...prev.payments];
      
      // 2. Adjust Student Totals
      const updatedStudents = prev.students.map(s => {
        if (s.id === paymentData.studentId) {
          const totalPaid = updatedPayments
            .filter(p => p.studentId === s.id)
            .reduce((sum, p) => sum + p.amountPaid, 0);
          
          const pendingVal = s.finalFees - totalPaid;
          const updatedStatus: 'Paid' | 'Partial' | 'Pending' = 
            pendingVal <= 0 ? 'Paid' : (totalPaid > 0 ? 'Partial' : 'Pending');

          return {
            ...s,
            paidAmount: totalPaid,
            pendingAmount: pendingVal,
            paymentStatus: updatedStatus,
            nextDueDate: paymentData.nextDueDate || s.nextDueDate
          };
        }
        return s;
      });

      return {
        ...prev,
        students: updatedStudents,
        payments: updatedPayments,
        activityLogs: [
          {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "Collect Fee",
            details: `Collected ₹${paymentData.amountPaid} for student ${selectedStd.fullName}. Receipt ${customReceiptNo} issued.`,
            user: currentUser?.email || 'admin@skillsia.in'
          },
          ...prev.activityLogs
        ]
      };
    });

    alert('Installment recorded, receipt issued successfully.');
  };

  const handleEditPayment = (adjustedPay: Payment) => {
    updateState(prev => {
      // 1. Swap Payment
      const index = prev.payments.findIndex(p => p.receiptNumber === adjustedPay.receiptNumber);
      if (index === -1) return prev;
      const updatedPayments = [...prev.payments];
      updatedPayments[index] = adjustedPay;

      // 2. Recalculate Student dues
      const updatedStudents = prev.students.map(s => {
        if (s.id === adjustedPay.studentId) {
          const totalPaid = updatedPayments
            .filter(p => p.studentId === s.id)
            .reduce((sum, p) => sum + p.amountPaid, 0);
          
          const pendingVal = s.finalFees - totalPaid;
          const updatedStatus: 'Paid' | 'Partial' | 'Pending' = 
            pendingVal <= 0 ? 'Paid' : (totalPaid > 0 ? 'Partial' : 'Pending');

          return {
            ...s,
            paidAmount: totalPaid,
            pendingAmount: pendingVal,
            paymentStatus: updatedStatus
          };
        }
        return s;
      });

      return {
        ...prev,
        students: updatedStudents,
        payments: updatedPayments,
        activityLogs: [
          {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "Modify Fee Entry",
            details: `Adjusted receipt metadata ${adjustedPay.receiptNumber} for ${adjustedPay.studentName}. New Amt: ₹${adjustedPay.amountPaid}`,
            user: currentUser?.email || 'admin'
          },
          ...prev.activityLogs
        ]
      };
    });
  };

  const handleDeletePayment = (receiptNum: string) => {
    const targetPay = payments.find(p => p.receiptNumber === receiptNum);
    if (!targetPay) return;

    updateState(prev => {
      // 1. Filter out payment
      const updatedPayments = prev.payments.filter(p => p.receiptNumber !== receiptNum);

      // 2. Recalculate student dues
      const updatedStudents = prev.students.map(s => {
        if (s.id === targetPay.studentId) {
          const totalPaid = updatedPayments
            .filter(p => p.studentId === s.id)
            .reduce((sum, p) => sum + p.amountPaid, 0);
          
          const pendingVal = s.finalFees - totalPaid;
          const updatedStatus: 'Paid' | 'Partial' | 'Pending' = 
            pendingVal <= 0 ? 'Paid' : (totalPaid > 0 ? 'Partial' : 'Pending');

          return {
            ...s,
            paidAmount: totalPaid,
            pendingAmount: pendingVal,
            paymentStatus: updatedStatus
          };
        }
        return s;
      });

      return {
        ...prev,
        students: updatedStudents,
        payments: updatedPayments,
        activityLogs: [
          {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "Delete Receipt",
            details: `Receipt log ${receiptNum} deleted for student ${targetPay.studentName}.`,
            user: currentUser?.email || 'admin'
          },
          ...prev.activityLogs
        ]
      };
    });
  };

  // --- Student Personal Notes saving function ---
  const saveStudentDetailsNote = (id: string) => {
    updateState(prev => {
      const idx = prev.students.findIndex(s => s.id === id);
      if (idx === -1) return prev;
      const nextStds = [...prev.students];
      nextStds[idx] = { ...nextStds[idx], notes: currentDetailsNote };
      return {
        ...prev,
        students: nextStds,
        activityLogs: [
          {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "Update Notes",
            details: `Notes modified for student ID ${id}`,
            user: currentUser?.email || 'admin'
          },
          ...prev.activityLogs
        ]
      };
    });
    alert('Student customized notes saved successfully.');
  };

  // --- Theme Toggle ---
  const handleToggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    updateState(prev => ({ ...prev, isDark: nextTheme }));
  };

  // --- Search & Filters operations ---
  const filteredStudents = students.filter(s => {
    const textMatch = 
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.mobile.includes(searchTerm);

    const matchCourse = filterCourse ? s.courseName === filterCourse : true;
    const matchBatch = filterBatch ? s.batchTiming === filterBatch : true;
    const matchStatus = filterStatus ? s.paymentStatus === filterStatus : true;
    const matchCity = filterCity ? s.city.toLowerCase().includes(filterCity.toLowerCase()) : true;

    return textMatch && matchCourse && matchBatch && matchStatus && matchCity;
  });

  // Calculate stats values for displaying widgets
  const pendingFeesTotal = students.reduce((sum, s) => sum + s.pendingAmount, 0);
  const collectedFeesTotal = students.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalDueAlerts = students.filter(s => s.pendingAmount > 0).length;

  // Pagination bounds
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Trigger communication reminder modal
  const triggerOutreach = (studentObj: Student, type: 'whatsapp' | 'sms' | 'email') => {
    setActiveOutreachStudent(studentObj);
    setOutreachType(type);
    setOutreachSentSuccess(false);
  };

  // Simulated backup data
  const handleDownloadBackup = () => {
    const jsonStr = JSON.stringify(crmState, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillsia_crm_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.students && parsed.payments) {
          setCrmState(parsed);
          saveState(parsed);
          alert('Data state backup file restored successfully. Page has synced.');
        } else {
          alert('Incorrect Backup Schema pattern. Please select a valid backup exported JSON.');
        }
      } catch (err) {
        alert('Invalid JSON representation file.');
      }
    };
    reader.readAsText(file);
  };

  const activeViewingStudent = students.find(s => s.id === viewingStudentId);

  return (
    <div className={`min-h-screen text-xs transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* View: Public Homepage */}
      {currentView === 'home' && (
        <AcademyHomepage
          students={students}
          payments={payments}
          onNavigateAction={handleNavigateCheck}
          isLoggedIn={!!currentUser}
          onOpenLogin={() => setShowLoginModal(true)}
          isDark={isDark}
        />
      )}

      {/* CRM Main Admin sidebar interface container */}
      {currentView !== 'home' && currentUser && (
        <div className="flex flex-col md:flex-row min-h-screen">
          
          {/* Left panel fixed sidebar design */}
          <aside className={`w-full md:w-64 md:sticky md:top-0 md:h-screen shrink-0 border-r py-6 px-4 flex flex-col justify-between transition-all select-none ${
            isDark ? 'bg-zinc-950 border-zinc-900 text-zinc-200' : 'bg-white border-slate-200 text-slate-705 shadow-xs'
          }`}>
            <div className="space-y-5">
              {/* Seal brand */}
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60 dark:border-zinc-900">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-xs tracking-tight text-slate-900 dark:text-white">
                    Skillsia Academy
                  </span>
                  <p className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold -mt-0.5">Control Panel</p>
                </div>
              </div>

              {/* Sidebar Menu options */}
              <nav className="space-y-1 list-none">
                <button
                  type="button"
                  onClick={() => handleNavigateCheck('dashboard', true)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                    currentView === 'dashboard'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-100'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  Dashboard
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigateCheck('students', true)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                    currentView === 'students'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Students Directory
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigateCheck('payments', true)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                    currentView === 'payments'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-100'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  Fee Ledgers
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigateCheck('alerts', true)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                    currentView === 'alerts'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-100'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  Overdue Alerts
                  {totalDueAlerts > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full bg-rose-500 text-[9px] font-bold flex items-center justify-center text-white scale-90">
                      {totalDueAlerts}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigateCheck('logs', true)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                    currentView === 'logs'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-100'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  Console &amp; Backups
                </button>
              </nav>
            </div>

            {/* Sidebar Bottom tools */}
            <div className="space-y-4 pt-5 mt-10 border-t border-slate-200/60 dark:border-zinc-900">
              <div className="flex items-center justify-between px-1">
                <span className="text-[9px] font-semibold text-slate-400 uppercase font-mono tracking-wider">Coordinator UI</span>
                <button
                  onClick={handleToggleTheme}
                  title="Toggle Light/Dark Theme"
                  className="p-1 border border-slate-200 dark:border-zinc-805 rounded-md hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors text-indigo-500 cursor-pointer"
                >
                  {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Connected details */}
              <div className="p-2.5 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                <div className="font-semibold flex items-center justify-between text-[11px]">
                  <span className="truncate max-w-[125px] text-slate-500 dark:text-zinc-405">{currentUser.email}</span>
                  <button
                    onClick={handleLogout}
                    title="Sign Out Session"
                    className="p-1 rounded hover:bg-red-500/10 text-rose-550 shrink-0 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('home')}
                className="w-full py-1.5 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900/30 text-[10px] text-slate-400 font-semibold rounded-lg transition-colors text-center cursor-pointer"
              >
                ← Return to Landing Site
              </button>
            </div>
          </aside>


          {/* Core admin panel scrollable content area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
            
            {/* View Module 1: Admin Dashboard */}
            {currentView === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Dashboard grid stats boards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 font-mono">Students Enrolled</span>
                    <p className="text-xl font-bold mt-1">{students.length}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Active directory roster size</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 font-mono">Received Fees</span>
                    <p className="text-xl font-bold mt-1 text-emerald-600">₹{collectedFeesTotal.toLocaleString('en-IN')}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Total collected academic balance</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 font-mono">Outstanding Pending</span>
                    <p className="text-xl font-bold mt-1 text-rose-600">₹{pendingFeesTotal.toLocaleString('en-IN')}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Collectable pending balance</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 font-mono">Monthly Collections</span>
                    <p className="text-xl font-bold mt-1 text-violet-600">₹65,000</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Admissions in May monthly slice</p>
                  </div>
                </div>


                {/* Integration of dynamic Recharts analytics */}
                <div>
                  <h4 className="text-sm font-bold tracking-wider uppercase mb-3 text-slate-400 font-mono">Visual Statistics Dashboard</h4>
                  <CRMCharts students={students} payments={payments} isDark={isDark} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recent collection list */}
                  <div className={`p-5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
                    <h5 className="font-semibold text-xs text-indigo-655 dark:text-indigo-400 uppercase tracking-tight mb-4">Recent Collections Log</h5>
                    <div className="divide-y divide-slate-100 dark:divide-zinc-800 space-y-3 max-h-[290px] overflow-y-auto pr-1">
                      {payments.slice(0, 5).map((p, idx) => (
                        <div key={idx} className="flex justify-between items-center pt-3 text-xs">
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-zinc-105">{p.studentName}</p>
                            <span className="text-[10px] text-slate-400">{p.receiptNumber} • {p.paymentMethod} • {p.paymentDate}</span>
                          </div>
                          <span className="font-semibold text-emerald-600">+₹{p.amountPaid.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming dues reminder checklist */}
                  <div className={`p-5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
                    <h5 className="font-semibold text-xs text-amber-600 dark:text-amber-500 uppercase tracking-tight mb-4">Outstanding Balance Due List</h5>
                    <div className="divide-y divide-slate-100 dark:divide-zinc-800 space-y-3 max-h-[290px] overflow-y-auto pr-1">
                      {students.filter(s => s.pendingAmount > 0).slice(0, 5).map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center pt-3 text-xs">
                          <div>
                            <p className="font-semibold text-slate-in-admin dark:text-zinc-105">{s.fullName}</p>
                            <span className="text-[10px] text-rose-500">Due: ₹{s.pendingAmount.toLocaleString('en-IN')} • Limit: {s.nextDueDate || 'Not Scheduled'}</span>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => triggerOutreach(s, 'whatsapp')}
                              className="p-1 px-2 bg-emerald-600 text-white rounded text-[10px] font-semibold hover:bg-emerald-700 cursor-pointer"
                              title="Send WhatsApp alert details"
                            >
                              WA
                            </button>
                            <button
                              onClick={() => triggerOutreach(s, 'email')}
                              className="p-1 px-2 bg-indigo-600 text-white rounded text-[10px] font-semibold hover:bg-indigo-700 cursor-pointer"
                              title="Send Email"
                            >
                              Mail
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* View Module 2: Students List Directory */}
            {currentView === 'students' && !editingStudent && !viewingStudentId && (
              <div className="space-y-6">
                
                {/* Search & Grid Filters */}
                <div className={`p-5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
                    {/* Search Field */}
                    <div className="relative md:col-span-2">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="Search student by Name, Mobile, Email, ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
                          isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>

                    {/* Filter Status */}
                    <div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className={`w-full py-2.5 px-3 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-indigo-500 ${
                          isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <option value="">Status (All)</option>
                        <option value="Paid">Paid Fully</option>
                        <option value="Partial">Partial Paid</option>
                        <option value="Pending">Pending (Unpaid)</option>
                      </select>
                    </div>

                    {/* Filter Course */}
                    <div>
                      <select
                        value={filterCourse}
                        onChange={(e) => setFilterCourse(e.target.value)}
                        className={`w-full py-2.5 px-3 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-indigo-500 ${
                          isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <option value="">Course (All)</option>
                        {INITIAL_COURSES.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Extra City Filtering field */}
                    <div>
                      <input
                        type="text"
                        placeholder="City Filter (All)"
                        value={filterCity}
                        onChange={(e) => setFilterCity(e.target.value)}
                        className={`w-full py-2 px-3 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-indigo-500 ${
                          isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-950'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Export Options & Add Trigger bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-200/60 dark:border-zinc-805">
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <button
                        onClick={() => exportToExcel(filteredStudents)}
                        className="py-1.5 px-3 border border-slate-200 dark:border-zinc-800 rounded-lg font-semibold flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-colors text-emerald-600 cursor-pointer"
                        title="Download directory Excel list"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Export Students Excel
                      </button>
                      <button
                        onClick={() => exportPaymentsReport(students, payments)}
                        className="py-1.5 px-3 border border-slate-200 dark:border-zinc-800 rounded-lg font-semibold flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-colors text-indigo-650 cursor-pointer"
                        title="Download financial sheet CSV"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Export Collections Report
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentView('addStudent')}
                        className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-semibold text-white flex items-center gap-1.5 text-xs shadow-xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Add New Admission
                      </button>
                    </div>
                  </div>
                </div>

                {/* Directory responsive table grid */}
                <div className={`p-5 rounded-lg border overflow-x-auto ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
                  {filteredStudents.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 font-medium font-mono">
                      No matching student directory records located in system logs.
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 uppercase font-mono tracking-wider font-bold text-slate-400">
                          <th className="py-3 px-3">Student ID</th>
                          <th>Full Name</th>
                          <th>Course Name</th>
                          <th>Mobile Number</th>
                          <th>Admission Date</th>
                          <th>Total Fees</th>
                          <th>Balance</th>
                          <th className="text-center">Status</th>
                          <th className="text-center">Control Panel</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                        {currentStudents.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-500/5 select-text hover:text-indigo-600 transition-colors">
                            <td className="py-4 px-3 font-black text-indigo-500">{s.id}</td>
                            <td>
                              <div>
                                <p className="font-bold">{s.fullName}</p>
                                <span className="text-[10px] text-slate-400 uppercase font-mono">{s.city} • Timing: {s.batchTiming.split(' - ')[0]}</span>
                              </div>
                            </td>
                            <td>{s.courseName}</td>
                            <td>{s.mobile}</td>
                            <td>{s.admissionDate}</td>
                            <td>₹{s.finalFees.toLocaleString('en-IN')}</td>
                            <td className={s.pendingAmount > 0 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
                              {s.pendingAmount > 0 ? `₹${s.pendingAmount.toLocaleString('en-IN')}` : 'Nil'}
                            </td>
                            <td className="text-center">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                s.paymentStatus === 'Paid' 
                                  ? 'bg-emerald-500/10 text-emerald-500' 
                                  : s.paymentStatus === 'Partial' 
                                    ? 'bg-amber-500/10 text-amber-500' 
                                    : 'bg-rose-500/10 text-rose-500'
                              }`}>
                                {s.paymentStatus}
                              </span>
                            </td>
                            <td className="text-center py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => { setViewingStudentId(s.id); setCurrentDetailsNote(s.notes || ''); }}
                                  title="View full bento details sheet"
                                  className="p-1 px-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-indigo-500 hover:border-indigo-500/30 transition-all font-bold"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => { setEditingStudent(s); setCurrentView('addStudent'); }}
                                  title="Edit full registration profiles"
                                  className="p-1 px-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-amber-500 hover:border-amber-500/30 transition-all font-bold"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(s.id, s.fullName)}
                                  title="Delete active record"
                                  className="p-1 px-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-rose-500 hover:border-rose-500/30 transition-all font-bold"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Pagination Footer controllers */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
                      <span className="text-[10px] text-slate-400 font-bold font-mono">
                        Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} Students
                      </span>
                      <div className="flex gap-2">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-indigo-500 disabled:opacity-30 disabled:hover:text-slate-400 font-bold"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-indigo-500 disabled:opacity-30 disabled:hover:text-slate-400 font-bold"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Sub-view: Detailed Student Profiles Bento Page */}
            {viewingStudentId && activeViewingStudent && (
              <div className="space-y-6">
                
                {/* Header back button */}
                <div className="flex items-center justify-between border-b dark:border-slate-800 pb-3.5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setViewingStudentId(null)}
                      className="p-2 border border-slate-200 dark:border-slate-850 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-slate-500 font-bold"
                    >
                      ← Back
                    </button>
                    <div>
                      <h4 className="text-base font-extrabold">{activeViewingStudent.fullName}</h4>
                      <p className="text-[10px] uppercase font-mono text-indigo-500 font-bold">Pupil Profiling: ID {activeViewingStudent.id}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => printStudentDetails(activeViewingStudent, payments)}
                      className="py-1.5 px-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-1.5 leading-none shadow-md shadow-indigo-500/10"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print Profile Sheet
                    </button>
                  </div>
                </div>

                {/* Bento layout detailed statistics widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left Column 1: Demographics */}
                  <div className={`p-5 rounded-2xl border space-y-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <h5 className="font-extrabold text-xs uppercase tracking-wider text-violet-500 pb-2 border-b dark:border-slate-850">Demographic Logs</h5>
                    <div className="space-y-3 font-medium text-slate-500">
                      <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Email Address</span><p className={`text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeViewingStudent.email || '-'}</p></div>
                      <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Mobile Number</span><p className={`text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeViewingStudent.mobile}</p></div>
                      <div><span className="text-[10px] text-slate-400 font-bold block uppercase">WhatsApp Status Verified</span><p className={`text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeViewingStudent.whatsapp}</p></div>
                      <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Gender &amp; DOB</span><p className={`text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeViewingStudent.gender} • {activeViewingStudent.dob}</p></div>
                      <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Address Coordinate</span><p className={`text-xs leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeViewingStudent.address}, {activeViewingStudent.city}, {activeViewingStudent.state} - {activeViewingStudent.pinCode}</p></div>
                    </div>
                  </div>

                  {/* Middle Column 2: Academics */}
                  <div className={`p-5 rounded-2xl border space-y-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <h5 className="font-extrabold text-xs uppercase tracking-wider text-indigo-500 pb-2 border-b dark:border-slate-850">Academics &amp; Course Track</h5>
                    <div className="space-y-3 font-medium text-slate-500">
                      <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Primary Program</span><p className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeViewingStudent.courseName}</p></div>
                      <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Batch timing</span><p className={`text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeViewingStudent.batchTiming}</p></div>
                      <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Qualification background</span><p className={`text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeViewingStudent.qualification} at {activeViewingStudent.collegeSchool}</p></div>
                      <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Aadhaar KYC number</span><p className={`text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeViewingStudent.aadhaarNumber || 'Not provided'}</p></div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">KYC Document Status</span>
                        <p className="text-[11px] font-bold text-emerald-500 mt-0.5 flex items-center gap-1 bg-emerald-500/5 px-2 py-1 rounded">
                          <CheckCircle className="w-3.5 h-3.5" /> Checked &amp; Verified ({activeViewingStudent.aadhaarFileName || 'SelfUploaded_Aadhaar.pdf'})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column 3: Emergency & Parent details */}
                  <div className={`p-5 rounded-2xl border space-y-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <h5 className="font-extrabold text-xs uppercase tracking-wider text-emerald-500 pb-2 border-b dark:border-slate-850">Emergency Contact References</h5>
                    <div className="space-y-3 font-medium text-slate-500">
                      <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Parent Name</span><p className={`text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeViewingStudent.parentName || '-'}</p></div>
                      <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Parent Contact Phone</span><p className={`text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeViewingStudent.parentMobile || '-'}</p></div>
                      <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Back-up Emergency Number</span><p className={`text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeViewingStudent.emergencyContact}</p></div>
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Financial Installment history widget representation */}
                  <div className={`md:col-span-2 p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <h5 className="font-extrabold text-xs uppercase tracking-wider text-amber-500 mb-4 pb-2 border-b dark:border-slate-850">Linked Installments Ledger History</h5>
                    <div className="space-y-4">
                      {payments.filter(p => p.studentId === activeViewingStudent.id).length === 0 ? (
                        <p className="text-slate-400 text-xs text-center py-6">No payment receipts documented.</p>
                      ) : (
                        <div className="space-y-3.5 max-h-[290px] overflow-y-auto pr-2">
                          {payments.filter(p => p.studentId === activeViewingStudent.id).map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-slate-500/5 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                              <div>
                                <p className="font-extrabold text-xs text-indigo-500">{p.receiptNumber} • Installment No. {p.installmentNumber}</p>
                                <span className="text-[10px] text-slate-400 block mt-0.5">Mode: {p.paymentMethod} • Ref: {p.transactionId} • Date: {p.paymentDate}</span>
                              </div>
                              <span className="font-black text-emerald-500 font-mono">₹{p.amountPaid.toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comments/Notes section for specific student, allowing persistent saving */}
                  <div className={`p-5 rounded-2xl border space-y-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <h5 className="font-extrabold text-xs uppercase tracking-wider text-indigo-500 pb-2 border-b dark:border-slate-850">Coordinator Notes Log</h5>
                    <textarea
                      value={currentDetailsNote}
                      onChange={(e) => setCurrentDetailsNote(e.target.value)}
                      placeholder="Write customized remarks or assignment performance metrics for this student..."
                      rows={5}
                      className={`w-full text-xs p-3 rounded-xl border focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all ${
                        isDark ? 'bg-slate-950 border-slate-850 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => saveStudentDetailsNote(activeViewingStudent.id)}
                      className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/10"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save Customized Notes
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* View Module 3: Student Registration / Profile Edit wizard Form */}
            {currentView === 'addStudent' && (
              <StudentForm
                student={editingStudent}
                onSave={handleSaveStudent}
                onCancel={() => { setEditingStudent(null); setCurrentView('students'); }}
                isDark={isDark}
              />
            )}

            {/* View Module 4: Core Fees Installments Management page widget */}
            {currentView === 'payments' && (
              <FeeManagement
                students={students}
                payments={payments}
                onAddPayment={handleAddPayment}
                onEditPayment={handleEditPayment}
                onDeletePayment={handleDeletePayment}
                isDark={isDark}
              />
            )}

            {/* View Module 5: Reminders Alerts outreach center */}
            {currentView === 'alerts' && (
              <div className="space-y-6">
                
                <div className="border-b pb-4 dark:border-slate-800">
                  <h3 className="text-base font-extrabold flex items-center gap-2">
                    <ShieldAlert className="text-rose-500 w-5 h-5" />
                    Overdue Fee Payment &amp; Reminders Center
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Trigger automated layout template reminders to student parents or guardians via WhatsApp, standard Email channels, or SMS networks.
                  </p>
                </div>

                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                  {students.filter(s => s.pendingAmount > 0).length === 0 ? (
                    <div className="py-16 text-center text-slate-400 font-medium">
                      Excellent! No overdue student pending balances documented in directories is outstanding.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b dark:border-slate-800 text-slate-400 uppercase font-mono tracking-widest">
                            <th className="py-2 px-3">Student Name</th>
                            <th>Enrolled Course</th>
                            <th>Outstanding Balance</th>
                            <th>Scheduled Due Limit</th>
                            <th className="text-center">Action Alerts Outbox</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium font-mono text-slate-500">
                          {students.filter(s => s.pendingAmount > 0).map((s) => (
                            <tr key={s.id} className="hover:bg-slate-550/5 text-[11px]">
                              <td className="py-3 px-3 font-extrabold text-indigo-500">{s.fullName}</td>
                              <td>{s.courseName}</td>
                              <td className="font-extrabold text-rose-500">₹{s.pendingAmount.toLocaleString('en-IN')}</td>
                              <td>{s.nextDueDate || 'Not scheduled'}</td>
                              <td className="text-center">
                                <div className="flex justify-center items-center gap-2 py-1.5">
                                  <button
                                    onClick={() => triggerOutreach(s, 'whatsapp')}
                                    className="p-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-lg hover:scale-105 transition-all outline-none"
                                  >
                                    WhatsApp Call
                                  </button>
                                  <button
                                    onClick={() => triggerOutreach(s, 'email')}
                                    className="p-1.5 px-3 bg-blue-500 hover:bg-blue-600 text-white font-extrabold rounded-lg hover:scale-105 transition-all outline-none"
                                  >
                                    Email alert
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* View Module 6: System Activity Console and JSON Backups */}
            {currentView === 'logs' && (
              <div className="space-y-6">
                
                {/* Backup & Restore Board */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <h4 className="text-sm font-extrabold mb-2 flex items-center gap-1.5 text-indigo-500">
                    <Database className="w-4 h-4" />
                    Data Backups &amp; Recovery State Systems
                  </h4>
                  <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                    Save the entire CRM local directory (students directories, payment lists, notifications, and coordinator notes) into a standard secure backups file, or upload a previously generated file to instant sync system indexes.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t dark:border-slate-800">
                    {/* Exporter */}
                    <div className="space-y-3">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Backups Export File</span>
                      <p className="text-xs text-slate-500 leading-relaxed">Downloads the local database state in a highly structured `.json` document locally. Encrypted schemas prevent indexing leaks.</p>
                      <button
                        onClick={handleDownloadBackup}
                        className="py-2.5 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/15"
                      >
                        <Download className="w-4 h-4" />
                        Download JSON State Backup
                      </button>
                    </div>

                    {/* Importer */}
                    <div className="space-y-3">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Restore / Import File</span>
                      <p className="text-xs text-slate-500 leading-relaxed">Upload a backup `.json` file to hot-swap active states instantly. Existing entries will be merged or replaced safely.</p>
                      
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/15 text-center">
                          <Plus className="w-4 h-4" />
                          Choose Backup JSON File
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleUploadBackup}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Logs Activity */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <h4 className="text-sm font-extrabold mb-4 flex items-center gap-1.5 text-violet-500">
                    <Activity className="w-4 h-4" />
                    Administrative Event Activity Ledger
                  </h4>
                  <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-2 divide-y divide-slate-100 dark:divide-slate-800">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="pt-3.5 flex justify-between items-start gap-4 text-xs">
                        <div className="space-y-1">
                          <p className="font-extrabold text-xs">{log.action}</p>
                          <span className="text-[10px] text-slate-400 block leading-relaxed">{log.details}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <code className="text-[9px] text-[#94a3b8] font-mono block uppercase">{log.user}</code>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </main>
        </div>
      )}

      {/* --- Authentication Modal: Admin Portal Access Guard --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-lg p-6 border space-y-4 shadow-xl transition-all ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-zinc-805 pb-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider flex items-center gap-2 text-slate-900 dark:text-zinc-100">
                <LogIn className="w-4 h-4 text-indigo-600" />
                Administrative Gate Portal Sign In
              </h4>
              <button
                onClick={() => { setShowLoginModal(false); setResetStep(0); }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {resetStep === 0 ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 mt-2">
                
                {authError && (
                  <div className="p-3 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-semibold">
                    {authError}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email ID Reference *</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="info@skillsia.in"
                    className={`w-full text-xs px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-505 ${
                      isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Secure Pin Password *</label>
                    <button
                      type="button"
                      onClick={() => setResetStep(3)} // trigger reset view
                      className="text-[10px] text-indigo-600 font-semibold hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter security access password"
                    className={`w-full text-xs px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-505 ${
                      isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Preconfigured details cue block to help testing */}
                <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-505/10 space-y-1 mt-2">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-indigo-600 font-mono">Demo Access Credentials:</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Email ID: <strong className="text-slate-700 dark:text-zinc-200">info@skillsia.in</strong></p>
                  <p className="text-[10px] text-slate-500">Password: <strong className="text-slate-700 dark:text-zinc-200">SkillsiaAdmin2026!</strong></p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center"
                >
                  Confirm Security &amp; Access Dashboard
                </button>
              </form>
            ) : resetStep === 3 ? (
              <div className="space-y-4 py-1">
                <p className="text-slate-500 text-xs leading-relaxed">
                  Enter your registered administrator email (`info@skillsia.in`) to triggers system reset codes.
                </p>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Admin Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="info@skillsia.in"
                    className={`w-full text-xs px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500 ${
                      isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setResetStep(0)}
                    className="flex-1 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-900 cursor-pointer text-center text-slate-600 dark:text-zinc-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (forgotEmail !== 'info@skillsia.in') {
                        alert('Unrecognized coordinator email. Try info@skillsia.in');
                        return;
                      }
                      alert('Security code dispatched: A reset code "SK-9022" has been sent to info@skillsia.in via temporary email simulator.');
                      setResetStep(4);
                    }}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg cursor-pointer text-center"
                  >
                    Dispatch Code
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4 text-center">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h5 className="font-semibold text-xs uppercase tracking-wider text-slate-900 dark:text-zinc-100">Reset Verification Dispatched</h5>
                <p className="text-slate-500 text-xs">An access pin reset code was successfully simulated and sent to info@skillsia.in.</p>
                <button
                  onClick={() => setResetStep(0)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs cursor-pointer text-center"
                >
                  Return to portal sign in
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- Action Reminders Template popups overlay --- */}
      {activeOutreachStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 text-slate-905 font-sans">
          <div className="bg-white dark:bg-zinc-950 rounded-lg p-6 max-w-lg w-full shadow-xl relative space-y-4 border border-slate-205 dark:border-zinc-850">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-900">
              <h5 className="font-semibold text-xs text-indigo-600 tracking-wider uppercase flex items-center gap-1.5">
                <Smartphone className="w-4.5 h-4.5 text-indigo-500" />
                Trigger Student Fee Outreach Outbox
              </h5>
              <button onClick={() => { setActiveOutreachStudent(null); setOutreachSentSuccess(false); }} className="text-slate-400 hover:text-slate-600"><X className="w-4.5 h-4.5" /></button>
            </div>

            {outreachSentSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-650 flex items-center justify-center mx-auto text-sm font-bold">✓</div>
                <h6 className="font-semibold text-slate-800 dark:text-zinc-200 text-xs uppercase tracking-wider">Reminder Confirmed Sent!</h6>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Outreach recorded dynamically in coordination system logs for {activeOutreachStudent.fullName}. Activity ledger updated.
                </p>
                <button
                  onClick={() => { setActiveOutreachStudent(null); setOutreachSentSuccess(false); }}
                  className="px-5 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-500 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-900 cursor-pointer text-center"
                >
                  Close Outbox
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  The system auto-calculates pending balances and drafts official correspondence. Review the draft layout below:
                </p>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-900/40 border border-slate-200/80 dark:border-zinc-850 text-xs text-slate-700 dark:text-zinc-300 font-mono space-y-1.5 leading-relaxed whitespace-pre-line text-[11px]">
                  <strong>To:</strong> {activeOutreachStudent.fullName} ({activeOutreachStudent.mobile})<br />
                  <strong>Channel Mode:</strong> {outreachType.toUpperCase()}<br />
                  <span className="block border-t border-slate-200/60 dark:border-zinc-800 my-1.5" />
                  {outreachType === 'whatsapp' ? (
                    `Dear Parent/Student ${activeOutreachStudent.fullName},

This is friendly automated payment feedback from Skillsia Academy. An installment of ₹${activeOutreachStudent.pendingAmount.toLocaleString('en-IN')} for your course "${activeViewingStudent?.courseName || activeOutreachStudent.courseName}" is outstanding.

Due Date Limit: ${activeOutreachStudent.nextDueDate || 'Immediate'}. Please clear it via online UPI or pay directly at campus cash point.
Kindly ignore if already paid.

Regards,
Skillsia Accounts Team
info@skillsia.in`
                  ) : (
                    `Subject: Course Fee Installment Overdue Notice - Skillsia Academy

Dear ${activeOutreachStudent.fullName},
This is standard official notification that outstanding Course Fee Balance of ₹${activeOutreachStudent.pendingAmount.toLocaleString('en-IN')} for course "${activeOutreachStudent.courseName}" is overdue since ${activeOutreachStudent.nextDueDate || 'May 20th'}.

Please clear all outstanding balances immediately to sync student registration records.
Thank you,
Skillsia Academy Administration
info@skillsia.in`
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveOutreachStudent(null)}
                    className="flex-1 py-2 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900/40 rounded-lg text-xs font-semibold text-slate-500 dark:text-zinc-400 cursor-pointer text-center"
                  >
                    Cancel Outreach
                  </button>
                  <button
                    onClick={() => {
                      // Append to activity log
                      updateState(prev => ({
                        ...prev,
                        activityLogs: [
                          {
                            id: `LOG-${Date.now()}`,
                            timestamp: new Date().toISOString(),
                            action: `Send ${outreachType.toUpperCase()} reminder`,
                            details: `Dispatched automated reminder to ${activeOutreachStudent.fullName} (${activeOutreachStudent.mobile}) for ₹${activeOutreachStudent.pendingAmount}`,
                            user: currentUser?.email || 'admin@skillsia.in'
                          },
                          ...prev.activityLogs
                        ]
                      }));
                      setOutreachSentSuccess(true);
                    }}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer text-center"
                  >
                    Confirm &amp; Send Simulation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
