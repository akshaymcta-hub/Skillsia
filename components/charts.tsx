'use client';

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Student, Payment } from '@/lib/store';

interface ChartsProps {
  students: Student[];
  payments: Payment[];
  isDark: boolean;
}

export function CRMCharts({ students, payments, isDark }: ChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse my-6">
        <div className="h-72 bg-slate-100 dark:bg-zinc-900 rounded-lg" />
        <div className="h-72 bg-slate-100 dark:bg-zinc-900 rounded-lg" />
        <div className="h-72 bg-slate-100 dark:bg-zinc-900 rounded-lg" />
        <div className="h-72 bg-slate-100 dark:bg-zinc-900 rounded-lg" />
      </div>
    );
  }

  // Monthly aggregator
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyRevenueData = monthNames.map((month, index) => {
    const monthPayments = payments.filter(p => {
      const pDate = new Date(p.paymentDate);
      return pDate.getFullYear() === 2026 && pDate.getMonth() === index;
    });
    const amount = monthPayments.reduce((sum, p) => sum + p.amountPaid, 0);
    return { name: month, Amount: amount };
  }).slice(0, 6);

  // Paid vs Pending Fees
  const totalPaid = students.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalPending = students.reduce((sum, s) => sum + s.pendingAmount, 0);
  const paidVsPendingData = [
    { name: 'Paid Fees', value: totalPaid, color: '#4f46e5' }, 
    { name: 'Pending Fees', value: totalPending, color: '#f43f5e' }
  ];

  // Student Admissions by Month
  const monthlyAdmissionsData = monthNames.map((month, index) => {
    const monthAdmissions = students.filter(s => {
      const aDate = new Date(s.admissionDate);
      return aDate.getFullYear() === 2026 && aDate.getMonth() === index;
    });
    return { name: month, Students: monthAdmissions.length };
  }).slice(0, 6);

  // Course-wise Revenue
  const courseRevenueMap: { [key: string]: number } = {};
  students.forEach(s => {
    courseRevenueMap[s.courseName] = (courseRevenueMap[s.courseName] || 0) + s.paidAmount;
  });
  const courseRevenueData = Object.keys(courseRevenueMap).map(course => ({
    name: course.length > 12 ? course.substring(0, 12) + '..' : course,
    Revenue: courseRevenueMap[course]
  }));

  // Recent payments
  const recentPaymentsData = [...payments]
    .sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())
    .slice(-8)
    .map(p => ({
      date: new Date(p.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      Amount: p.amountPaid,
      Student: p.studentName
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
      
      {/* 1. Monthly Revenue Collection */}
      <div className={`p-5 rounded-lg border transition-all ${
        isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <h4 className={`text-xs font-semibold mb-4 uppercase tracking-wider font-mono text-slate-400`}>
          Monthly Fee Collection (2026)
        </h4>
        <div className="h-60 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#27272a' : '#f1f5f9'} />
              <XAxis dataKey="name" stroke={isDark ? '#71717a' : '#64748b'} fontSize={10} tickLine={false} />
              <YAxis stroke={isDark ? '#71717a' : '#64748b'} fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#18181b' : '#ffffff', 
                  borderColor: isDark ? '#27272a' : '#e2e8f0',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: isDark ? '#f4f4f5' : '#0f172a'
                }} 
              />
              <Area type="monotone" dataKey="Amount" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Paid vs Pending (Pie) */}
      <div className={`p-5 rounded-lg border transition-all ${
        isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <h4 className={`text-xs font-semibold mb-4 uppercase tracking-wider font-mono text-slate-400`}>
          Financial Status (Paid vs Pending)
        </h4>
        <div className="h-60 flex flex-col sm:flex-row items-center justify-around">
          <div className="w-1/2 h-full min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paidVsPendingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {paidVsPendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                  contentStyle={{ 
                    backgroundColor: isDark ? '#18181b' : '#ffffff', 
                    borderRadius: '6px',
                    fontSize: '11px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2.5 justify-center">
            {paidVsPendingData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <div>
                  <p className={`text-[10px] uppercase font-semibold text-slate-400 tracking-wider`}>{item.name}</p>
                  <p className={`text-xs font-semibold ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                    ₹{item.value.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
            <div className={`pt-2 border-t ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
              <p className={`text-[10px] uppercase font-semibold text-slate-400 tracking-wider`}>Collection Ratio</p>
              <p className="text-xs font-bold text-indigo-500">
                {totalPaid + totalPending > 0 
                  ? `${((totalPaid / (totalPaid + totalPending)) * 100).toFixed(1)}%` 
                  : '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Students Growth admissions by month */}
      <div className={`p-5 rounded-lg border transition-all ${
        isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <h4 className={`text-xs font-semibold mb-4 uppercase tracking-wider font-mono text-slate-400`}>
          Student Admissions trend
        </h4>
        <div className="h-60 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyAdmissionsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#27272a' : '#f1f5f9'} />
              <XAxis dataKey="name" stroke={isDark ? '#71717a' : '#64748b'} fontSize={10} tickLine={false} />
              <YAxis stroke={isDark ? '#71717a' : '#64748b'} fontSize={10} tickLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#18181b' : '#ffffff', 
                  borderRadius: '6px',
                  fontSize: '11px'
                }} 
              />
              <Bar dataKey="Students" fill="#4f46e5" radius={[3, 3, 0, 0]} maxBarSize={30}>
                {monthlyAdmissionsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 5 ? '#4f46e5' : '#818cf8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Course-wise Revenue */}
      <div className={`p-5 rounded-lg border transition-all ${
        isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <h4 className={`text-xs font-semibold mb-4 uppercase tracking-wider font-mono text-slate-400`}>
          Course-wise Collections Report
        </h4>
        <div className="h-60 mt-2">
          {courseRevenueData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No revenue recorded yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseRevenueData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#27272a' : '#f1f5f9'} />
                <XAxis type="number" stroke={isDark ? '#71717a' : '#64748b'} fontSize={9} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke={isDark ? '#71717a' : '#64748b'} fontSize={9} tickLine={false} width={80} />
                <Tooltip 
                  formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                  contentStyle={{ 
                    backgroundColor: isDark ? '#18181b' : '#ffffff', 
                    borderRadius: '6px',
                    fontSize: '11px'
                  }} 
                />
                <Bar dataKey="Revenue" fill="#4f46e5" radius={[0, 3, 3, 0]} maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 5. Installment Collection Graph / Recent payments timeline */}
      <div className={`p-5 rounded-lg border transition-all lg:col-span-2 ${
        isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <h4 className={`text-xs font-semibold mb-4 uppercase tracking-wider font-mono text-slate-400`}>
          Interactive Installments Collection Graph
        </h4>
        <div className="h-64 mt-2">
          {recentPaymentsData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No collection entries yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recentPaymentsData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorInstallment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#27272a' : '#f1f5f9'} />
                <XAxis dataKey="date" stroke={isDark ? '#71717a' : '#64748b'} fontSize={10} tickLine={false} />
                <YAxis stroke={isDark ? '#71717a' : '#64748b'} fontSize={10} tickLine={false} />
                <Tooltip 
                  formatter={(value, name, props) => [`₹${value}`, `Student: ${props.payload.Student}`]}
                  contentStyle={{ 
                    backgroundColor: isDark ? '#18181b' : '#ffffff', 
                    borderRadius: '6px',
                    fontSize: '11px'
                  }} 
                />
                <Area type="monotone" dataKey="Amount" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorInstallment)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}
