'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Coins, 
  Trash2, 
  Calendar, 
  Edit3, 
  Printer, 
  X, 
  Receipt,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { Student, Payment } from '@/lib/store';

interface FeeManagementProps {
  students: Student[];
  payments: Payment[];
  onAddPayment: (p: Omit<Payment, 'receiptNumber' | 'studentName'> & { receiptNumber?: string; studentId: string }) => void;
  onEditPayment: (p: Payment) => void;
  onDeletePayment: (receiptNum: string) => void;
  isDark: boolean;
}

export function FeeManagement({ 
  students, 
  payments, 
  onAddPayment, 
  onEditPayment, 
  onDeletePayment,
  isDark 
}: FeeManagementProps) {

  // Selected student pointer for recording/viewing installments
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
  // Addition Form State
  const [isAdding, setIsAdding] = useState(false);
  const [amountPaid, setAmountPaid] = useState<number>(5000);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Card' | 'Net Banking' | 'Cheque'>('UPI');
  const [transactionId, setTransactionId] = useState('');
  const [installmentNumber, setInstallmentNumber] = useState<number>(1);
  const [remarks, setRemarks] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');

  // Editing state
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  // Active printable receipt (modal overlay)
  const [viewingReceipt, setViewingReceipt] = useState<Payment | null>(null);

  const activeStudent = students.find(s => s.id === selectedStudentId);
  const studentPayments = payments.filter(p => p.studentId === selectedStudentId);

  // Auto-calculate default installment rank
  const triggerOpenAdd = () => {
    if (!selectedStudentId) {
      alert('Please select a student from the dropdown first.');
      return;
    }
    if (activeStudent) {
      // Determine next installment number
      const count = studentPayments.length;
      setInstallmentNumber(count + 1);
      // Determine outstanding fee to suggest
      setAmountPaid(activeStudent.pendingAmount);
    }
    setIsAdding(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || isNaN(amountPaid) || amountPaid <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    onAddPayment({
      studentId: selectedStudentId,
      paymentDate: new Date().toISOString().split('T')[0],
      amountPaid: Number(amountPaid),
      paymentMethod,
      transactionId: transactionId || `TXN_${Date.now().toString().slice(-6)}`,
      installmentNumber,
      remarks,
      nextDueDate
    });

    // Reset Adding
    setIsAdding(false);
    setAmountPaid(5000);
    setTransactionId('');
    setRemarks('');
    setNextDueDate('');
  };

  const startEdit = (p: Payment) => {
    setEditingPayment(p);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPayment) {
      onEditPayment(editingPayment);
      setEditingPayment(null);
    }
  };

  const handleTriggerPrint = (receipt: Payment) => {
    setViewingReceipt(receipt);
  };

  const executePrintReceipt = () => {
    const printContent = document.getElementById('printable-invoice-container');
    const printWindow = window.open('', '_blank');
    if (!printWindow || !printContent) return;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Fee Receipt - ${viewingReceipt?.receiptNumber}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; background: white; margin: 0; }
            .receipt-box { width: 100%; border: 2px dashed #6366f1; border-radius: 12px; padding: 30px; box-sizing: border-box; }
            .badge { display: inline-block; padding: 4px 10px; background: #e0e7ff; color: #4338ca; border-radius: 6px; font-size: 11px; font-weight: bold; }
            .header-info { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 25px; }
            .heading { font-size: 24px; font-weight: 950; color: #4f46e5; margin: 0; letter-spacing: 0.5px; }
            .sub { font-size: 11px; color: #64748b; margin-top: 2px; }
            .grid-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
            .item-lbl { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
            .item-val { font-size: 14px; font-weight: 600; color: #0f172a; margin-top: 2px; }
            .amount-banner { display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 30px; }
            .signature-area { display: flex; justify-content: space-between; margin-top: 50px; font-size: 12px; }
            .stamp { text-align: center; color: #6366f1; border: 2px solid #6366f1; padding: 6px 12px; border-radius: 8px; }
          </style>
        </head>
        <body onload="window.print()">
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header with details selector */}
      <div className={`p-5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Coins className="text-indigo-600 w-4.5 h-4.5" />
              Fees Installments Ledger Management
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Select an academy student to view complete receipts, timeline logs, and schedule future installments.
            </p>
          </div>

          <div className="w-full md:w-72">
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className={`w-full text-xs px-3 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-xs'
              }`}
            >
              <option value="">-- Choose Student --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.id}) - {s.courseName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic calculations card if student is selected */}
        {activeStudent && (
          <div className="mt-5 pt-5 border-t border-slate-200/60 dark:border-zinc-800 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div>
              <span className="text-[10px] font-semibold text-slate-450 uppercase font-mono tracking-wider">Total Fee</span>
              <p className="text-base font-semibold mt-0.5">₹{activeStudent.totalCourseFees.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-450 uppercase font-mono tracking-wider font-medium">Discount</span>
              <p className="text-base font-semibold text-amber-600 dark:text-amber-500 mt-0.5">₹{activeStudent.discountAmount.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-450 uppercase font-mono tracking-wider">Net Fees</span>
              <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">₹{activeStudent.finalFees.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-450 uppercase font-mono tracking-wider">Collected</span>
              <p className="text-base font-semibold text-emerald-600 mt-0.5">₹{activeStudent.paidAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="col-span-2 md:col-span-1 border-t md:border-t-0 pt-3 md:pt-0">
              <span className="text-[10px] font-semibold text-slate-450 uppercase font-mono tracking-wider">Outstanding</span>
              <p className={`text-base font-semibold mt-0.5 ${activeStudent.pendingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                ₹{activeStudent.pendingAmount.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        )}
      </div>

      {activeStudent ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Timeline and linked payments list */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* List of payments */}
            <div className={`p-5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/60 dark:border-zinc-800">
                <h4 className="text-xs font-semibold flex items-center gap-2 text-violet-600 dark:text-violet-400 uppercase tracking-tight">
                  <Receipt className="w-4 h-4" />
                  Recorded Receipts Link ({studentPayments.length})
                </h4>
                <button
                  type="button"
                  onClick={triggerOpenAdd}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold leading-none flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Record Installment
                </button>
              </div>

              {studentPayments.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 font-medium">
                  No payment entries found. Click &quot;Record Installment&quot; to register/installments.
                </div>
              ) : (
                <div className="overflow-x-auto font-sans">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="py-2">Receipt ID</th>
                        <th>Pay Date</th>
                        <th>Amount Paid</th>
                        <th>Inst. No</th>
                        <th>Method</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {studentPayments.map((p, idx) => (
                        <tr key={idx} className="hover:bg-zinc-500/5 transition-colors">
                          <td className="py-2.5 font-semibold text-indigo-600 dark:text-indigo-400">{p.receiptNumber}</td>
                          <td>{p.paymentDate}</td>
                          <td className="font-semibold text-emerald-600">₹{p.amountPaid.toLocaleString('en-IN')}</td>
                          <td>No. {p.installmentNumber}</td>
                          <td>{p.paymentMethod}</td>
                          <td className="text-center flex items-center justify-center gap-2 py-2.5">
                            <button
                              onClick={() => handleTriggerPrint(p)}
                              title="Print / View Receipt"
                              className="p-1 px-1.5 border border-slate-200 dark:border-zinc-805 rounded-lg text-slate-400 hover:text-indigo-600 hover:border-indigo-500/30 transition-all cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => startEdit(p)}
                              title="Modify payment metadata"
                              className="p-1 px-1.5 border border-slate-200 dark:border-zinc-805 rounded-lg text-slate-400 hover:text-amber-600 hover:border-amber-500/30 transition-all cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => { if (confirm('Are you certain about deleting this receipt record? Balance calculation will auto-tune.')) onDeletePayment(p.receiptNumber); }}
                              title="Delete collection log"
                              className="p-1 px-1.5 border border-slate-200 dark:border-zinc-805 rounded-lg text-slate-400 hover:text-rose-600 hover:border-rose-500/30 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Simulated future installments scheduler visual timeline */}
            <div className={`p-5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
              <h4 className="text-xs font-semibold mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">
                <Calendar className="w-4 h-4" />
                Scheduled Payments &amp; Installments Timeline
              </h4>
              <div className="relative border-l border-indigo-500/25 pl-5 ml-2.5 py-1 space-y-5">
                
                {/* Registration step */}
                <div className="relative">
                  <span className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15 flex items-center justify-center">
                    <CheckCircle className="w-2.5 h-2.5 text-white" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold font-mono text-emerald-600 uppercase">Step 1: Registration Complete</p>
                    <p className="text-xs text-slate-400 mt-0.5">₹{activeStudent.registrationFees.toLocaleString('en-IN')} paid successfully on course admission ({activeStudent.admissionDate}).</p>
                  </div>
                </div>

                {/* Additional installments */}
                {studentPayments.filter(p => p.installmentNumber > 1).map((p, index) => (
                  <div key={index} className="relative">
                    <span className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-500 ring-4 ring-indigo-500/15 flex items-center justify-center">
                      <CheckCircle className="w-2.5 h-2.5 text-white" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold font-mono uppercase text-indigo-600 dark:text-indigo-400">Step {index + 2}: Installment No. {p.installmentNumber} Collected</p>
                      <p className="text-xs text-slate-400 mt-0.5">₹{p.amountPaid.toLocaleString('en-IN')} recorded on {p.paymentDate} via {p.paymentMethod}.</p>
                    </div>
                  </div>
                ))}

                {/* Next pending installment */}
                {activeStudent.pendingAmount > 0 && (
                  <div className="relative">
                    <span className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-amber-500/15 flex items-center justify-center" />
                    <div>
                      <p className="text-[11px] font-semibold font-mono text-amber-600 dark:text-amber-500 uppercase">Upcoming Scheduled Balance</p>
                      <p className="text-xs text-slate-400 mt-0.5">₹{activeStudent.pendingAmount.toLocaleString('en-IN')} outstanding. Scheduled Due Date: <strong className="text-amber-600 dark:text-amber-500">{activeStudent.nextDueDate || 'Not Scheduled'}</strong></p>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Column 3: Actions sidebar / Modal Form fields */}
          <div className="space-y-6">
            
            {/* Record New installment Section */}
            {isAdding ? (
              <form onSubmit={handleSavePayment} className={`p-5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
                <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-2 dark:border-zinc-800">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-450 font-mono">Record Payment</h4>
                  <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-500"><X className="w-4 h-4" /></button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">Received Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(Number(e.target.value))}
                      className={`w-full text-xs px-3 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none transition-all ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-205 text-slate-900 shadow-xs'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">Receipt Number</label>
                    <input
                      type="text"
                      disabled
                      value="Auto REC-YYYY-XXXX"
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-slate-50 text-slate-400 border-slate-105 dark:bg-zinc-950 dark:border-zinc-805 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">Payment Channel / Mode</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className={`w-full text-xs px-3 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none transition-all ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-205 text-slate-900 shadow-xs'
                      }`}
                    >
                      <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Credit Card / Debit Card</option>
                      <option value="Net Banking">IMPS / NEFT Transfer</option>
                      <option value="Cheque">Bank Cheque</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">Transaction Ref / ID</label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. TXN902837482"
                      className={`w-full text-xs px-3 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none transition-all ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-205 text-slate-900 shadow-xs'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">Installment Rank Reference</label>
                    <input
                      type="number"
                      required
                      value={installmentNumber}
                      onChange={(e) => setInstallmentNumber(Number(e.target.value))}
                      className={`w-full text-xs px-3 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none transition-all ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-205 text-slate-900 shadow-xs'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">Specify Next Due Date (if any)</label>
                    <input
                      type="date"
                      value={nextDueDate}
                      onChange={(e) => setNextDueDate(e.target.value)}
                      className={`w-full text-xs px-3 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none transition-all ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-205 text-slate-900 shadow-xs'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">Transaction Remarks</label>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Received 3rd installment.."
                      className={`w-full text-xs px-3 py-2 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none transition-all ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-205 text-slate-900 shadow-xs'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 mt-2 shadow-xs transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Record Receipt
                  </button>
                </div>
              </form>
            ) : editingPayment ? (
              <form onSubmit={handleSaveEdit} className={`p-5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
                <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-2 dark:border-zinc-800">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-500 font-mono">Edit Installment</h4>
                  <button type="button" onClick={() => setEditingPayment(null)} className="text-slate-400 hover:text-slate-500"><X className="w-4 h-4" /></button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">Receipt ID</label>
                    <input type="text" disabled value={editingPayment.receiptNumber} className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 cursor-not-allowed text-slate-400 dark:bg-zinc-950 dark:border-zinc-800 font-bold" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">Paid Amount (₹)</label>
                    <input
                      type="number"
                      value={editingPayment.amountPaid}
                      onChange={(e) => setEditingPayment({ ...editingPayment, amountPaid: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-slate-800 dark:text-white border-slate-200 dark:border-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">Payment Channel / Mode</label>
                    <select
                      value={editingPayment.paymentMethod}
                      onChange={(e) => setEditingPayment({ ...editingPayment, paymentMethod: e.target.value as any })}
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-slate-850 dark:text-white border-slate-200 dark:border-zinc-800"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">Transaction Ref / ID</label>
                    <input
                      type="text"
                      value={editingPayment.transactionId}
                      onChange={(e) => setEditingPayment({ ...editingPayment, transactionId: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-slate-850 dark:text-white border-slate-200 dark:border-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">Installment Rank</label>
                    <input
                      type="number"
                      value={editingPayment.installmentNumber}
                      onChange={(e) => setEditingPayment({ ...editingPayment, installmentNumber: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-slate-850 dark:text-white border-slate-200 dark:border-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider font-mono">Remarks Note</label>
                    <input
                      type="text"
                      value={editingPayment.remarks}
                      onChange={(e) => setEditingPayment({ ...editingPayment, remarks: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-slate-855 dark:text-white border-slate-200 dark:border-zinc-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    Save Adjustments
                  </button>
                </div>
              </form>
            ) : (
              <div className={`p-5 rounded-lg border text-center ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'}`}>
                <Coins className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <h5 className="text-xs font-semibold">Ledger Controllers Ready</h5>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] mx-auto leading-relaxed">
                  Click below to log a designated fee payment installment or admissions credit for this student.
                </p>
                <button
                  type="button"
                  onClick={triggerOpenAdd}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 mt-4 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Record Installment
                </button>
              </div>
            )}

          </div>

        </div>
      ) : (
        <div className="py-20 text-center text-xs text-slate-450 font-medium border border-dashed border-slate-200/80 rounded-lg bg-white/50 dark:bg-zinc-905/20">
          Please select an academic student from the dropdown menu above to access their installments ledger.
        </div>
      )}

      {/* Printable invoice modal overlay slider */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-lg p-5 max-w-lg w-full shadow-lg space-y-4 border border-indigo-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[10px] font-semibold text-indigo-600 font-mono tracking-wider uppercase">Receipt Proof Invoice</span>
              <button onClick={() => setViewingReceipt(null)} className="text-slate-450 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>

            {/* Simulated Receipt Preview Canvas Card */}
            <div id="printable-invoice-container" className="border border-dashed border-indigo-500/25 rounded-md p-4 bg-indigo-50/5">
              <div className="header-info">
                <div>
                  <h1 className="heading" style={{ fontSize: '18px', fontWeight: 'bold', color: '#4f46e5' }}>Skillsia Academy</h1>
                  <span className="sub" style={{ fontSize: '10px' }}>info@skillsia.in | Registration Ledger Facility</span>
                </div>
                <span className="badge" style={{ background: '#e0e7ff', color: '#4338ca', fontSize: '10px' }}>No. {viewingReceipt.receiptNumber}</span>
              </div>

              <div className="grid-details">
                <div>
                  <span className="item-lbl">Student Name</span>
                  <div className="item-val">{viewingReceipt.studentName}</div>
                </div>
                <div>
                  <span className="item-lbl">Student ID</span>
                  <div className="item-val">{viewingReceipt.studentId}</div>
                </div>
                <div>
                  <span className="item-lbl">Payment Date</span>
                  <div className="item-val">{viewingReceipt.paymentDate}</div>
                </div>
                <div>
                  <span className="item-lbl">Installment Term</span>
                  <div className="item-val">No. {viewingReceipt.installmentNumber} Payment</div>
                </div>
                <div>
                  <span className="item-lbl">Transaction Reference</span>
                  <div className="item-val">{viewingReceipt.transactionId}</div>
                </div>
                <div>
                  <span className="item-lbl">Payment Channel</span>
                  <div className="item-val">{viewingReceipt.paymentMethod}</div>
                </div>
              </div>

              <div className="amount-banner" style={{ background: '#f8fafc', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <div>
                  <span className="item-lbl" style={{ color: '#4f46e5' }}>Received Amount</span>
                  <p className="item-val" style={{ fontSize: '16px', fontWeight: 'bold', color: '#4f46e5', margin: 0 }}>
                    ₹{viewingReceipt.amountPaid.toLocaleString('en-IN')}
                  </p>
                </div>
                {viewingReceipt.nextDueDate && (
                  <div style={{ textAlign: 'right' }}>
                    <span className="item-lbl">Next Due Date Limit</span>
                    <p className="item-val" style={{ color: '#e11d48', margin: 0 }}>{viewingReceipt.nextDueDate}</p>
                  </div>
                )}
              </div>

              {viewingReceipt.remarks && (
                <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                  <span className="item-lbl">Remarks Note</span>
                  <p className="item-val" style={{ fontWeight: 'normal', fontSize: '12px', margin: 0 }}>{viewingReceipt.remarks}</p>
                </div>
              )}

              <div className="signature-area" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', fontSize: '11px' }}>
                <div className="stamp" style={{ border: '1.5px solid #6366f1', color: '#6366f1', padding: '4px 8px', borderRadius: '4px' }}>OFFICIAL SECURED TRANSACTION</div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ textDecoration: 'underline', fontWeight: 'bold', margin: 0 }}>Authorized Signatory</p>
                  <p className="sub" style={{ margin: 0 }}>Accounts Division, Skillsia Academy</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setViewingReceipt(null)}
                className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-500 cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={executePrintReceipt}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-xs cursor-pointer transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print PDF Receipt
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
