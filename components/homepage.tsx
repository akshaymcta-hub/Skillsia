'use client';

import React from 'react';
import { 
  GraduationCap, 
  Users, 
  Coins, 
  Clock, 
  ArrowRight, 
  Tv, 
  BookOpen, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles,
  ArrowUpRight,
  Database
} from 'lucide-react';
import { Student, Payment } from '@/lib/store';

interface HomepageProps {
  students: Student[];
  payments: Payment[];
  onNavigateAction: (targetView: string, requiresAuth: boolean) => void;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  isDark: boolean;
}

export const SkillsiaLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Blue Arch */}
    <path
      d="M15 52 A 35 35 0 0 1 85 52"
      stroke="#3b82f6"
      strokeWidth="14"
      strokeLinecap="round"
      fill="none"
    />
    {/* Central Pillar */}
    <rect
      x="43"
      y="49"
      width="14"
      height="20"
      rx="2"
      fill="#f59e0b"
    />
  </svg>
);

export function AcademyHomepage({ 
  students, 
  payments, 
  onNavigateAction, 
  isLoggedIn, 
  onOpenLogin,
  isDark 
}: HomepageProps) {
  
  // Calculate dynamic metrics from store
  const totalStudents = students.length;
  const totalCollected = students.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalPending = students.reduce((sum, s) => sum + s.pendingAmount, 0);
  const recentCount = students.filter(s => {
    const admissionDate = new Date(s.admissionDate);
    const limitDate = new Date();
    limitDate.setMonth(limitDate.getMonth() - 1);
    return admissionDate >= limitDate;
  }).length;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-[#fafafc] text-zinc-900 font-sans'
    }`}>
      {/* 1. Header Navigation */}
      <header className={`sticky top-0 z-50 backdrop-blur-sm border-b transition-all ${
        isDark ? 'bg-zinc-950/80 border-zinc-900' : 'bg-white/80 border-slate-200/60'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <SkillsiaLogo className="w-8 h-8" />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-zinc-50">
                Skillsia Academy
              </span>
              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-medium -mt-1 font-mono">
                Student Record Suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={() => onNavigateAction('dashboard', true)}
                className="flex items-center gap-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
              >
                Access Admin Portal
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className={`text-xs font-medium px-4 py-2 rounded-lg border transition-colors ${
                  isDark 
                    ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-200' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm'
                }`}
              >
                Admin Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-indigo-55/10 text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-100 dark:border-indigo-900/30">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Empowering India&apos;s Tech Talent
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white leading-tight">
            Modern Student CRM
            <br />
            <span className="text-indigo-600 dark:text-indigo-400">
              &amp; Fees Ledger Center
            </span>
          </h1>
          <p className={`mt-4 text-sm max-w-xl mx-auto leading-relaxed ${
            isDark ? 'text-zinc-400' : 'text-slate-600'
          }`}>
            A comprehensive, high-contrast, real-time student lifecycle administrator configured with customizable course pipelines, automated fee tracking status, and instant receipts.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigateAction('students', true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-xs transition-colors shadow-sm"
            >
              Add Student Admission
            </button>
            <button
              onClick={() => onNavigateAction('payments', true)}
              className={`px-5 py-2.5 font-medium rounded-lg text-xs transition-colors border ${
                isDark 
                  ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-100' 
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-sm'
              }`}
            >
              Search &amp; Record Installment
            </button>
          </div>
        </div>
      </section>

      {/* 3. Realtime Overviews Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-[10px] font-semibold tracking-wider uppercase mb-5 text-slate-400 font-mono flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-indigo-500" />
          Live Academic Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Stat 1 */}
          <div className={`p-5 rounded-lg border transition-colors ${
            isDark ? 'bg-zinc-900/40 border-zinc-900 text-zinc-100' : 'bg-white border-slate-200/80 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-semibold font-mono tracking-wider uppercase ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Total Enrolled Pupils
              </span>
              <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-semibold mt-3 tracking-none">{totalStudents}</p>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-600 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+{recentCount} admissions this month</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className={`p-5 rounded-lg border transition-colors ${
            isDark ? 'bg-zinc-900/40 border-zinc-900 text-zinc-100' : 'bg-white border-slate-200/80 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-semibold font-mono tracking-wider uppercase ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Total Fees Collected
              </span>
              <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-semibold mt-3 tracking-none">₹{totalCollected.toLocaleString('en-IN')}</p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-500 font-medium">
              <span>Installment timeline tracks receipts</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className={`p-5 rounded-lg border transition-colors ${
            isDark ? 'bg-zinc-900/40 border-zinc-900 text-zinc-100' : 'bg-white border-slate-200/80 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-semibold font-mono tracking-wider uppercase ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Outstanding Fees
              </span>
              <span className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-semibold mt-3 text-rose-600 tracking-none">
              ₹{totalPending.toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-rose-500 font-mono">
              <span>Automatic due alert routing</span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className={`p-5 rounded-lg border transition-colors ${
            isDark ? 'bg-zinc-900/40 border-zinc-900 text-zinc-100' : 'bg-white border-slate-200/80 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-semibold font-mono tracking-wider uppercase ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Available Programs
              </span>
              <span className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-semibold mt-3 tracking-none">5 Active</p>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-purple-500">
              <span>SCDM, SCSEO, SCSEM, SCSMM, Corp</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Academy Core Courses Feature Section */}
      <section className={`py-16 border-t ${
        isDark ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-slate-200/60'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Skillsia Certified Professional Programs</h2>
            <p className={`text-xs mt-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Practical training with personal mentors, real product development, and placement support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            <div className={`p-5 rounded-lg border ${
              isDark ? 'bg-zinc-900/40 border-zinc-905' : 'bg-[#fcfcff] border-slate-200 shadow-sm'
            }`}>
              <div className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 font-mono tracking-wider uppercase">01 / Digital Marketing</div>
              <h3 className="font-semibold text-base mt-1.5 text-neutral-900 dark:text-white">SCDM</h3>
              <p className={`text-xs mt-2 line-clamp-3 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Master digital marketing strategy, inbound marketing, content creation, brand positioning, and campaign analytics.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>3 Months FastTrack</span>
                <span>₹25,000</span>
              </div>
            </div>

            <div className={`p-5 rounded-lg border ${
              isDark ? 'bg-zinc-900/40 border-zinc-905' : 'bg-[#fcfcff] border-slate-200 shadow-sm'
            }`}>
              <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 font-mono tracking-wider uppercase">02 / Search Optimization</div>
              <h3 className="font-semibold text-base mt-1.5 text-neutral-900 dark:text-white">SCSEO</h3>
              <p className={`text-xs mt-2 line-clamp-3 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Excel in technical search optimization, keyword discovery, site indexing, backlink profiling, and performance auditing.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>3 Months FastTrack</span>
                <span>₹20,000</span>
              </div>
            </div>

            <div className={`p-5 rounded-lg border ${
              isDark ? 'bg-zinc-900/40 border-zinc-905' : 'bg-[#fcfcff] border-slate-200 shadow-sm'
            }`}>
              <div className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 font-mono tracking-wider uppercase">03 / Paid Marketing</div>
              <h3 className="font-semibold text-base mt-1.5 text-neutral-900 dark:text-white">SCSEM</h3>
              <p className={`text-xs mt-2 line-clamp-3 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Expert-level pay-per-click search campaign tactics, bidding optimization, paid conversions, and landing page development.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                <span>6 Months Advanced</span>
                <span>₹55,000</span>
              </div>
            </div>

            <div className={`p-5 rounded-lg border ${
              isDark ? 'bg-zinc-900/40 border-zinc-905' : 'bg-[#fcfcff] border-slate-200 shadow-sm'
            }`}>
              <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-450 font-mono tracking-wider uppercase">04 / Social Media</div>
              <h3 className="font-semibold text-base mt-1.5 text-neutral-900 dark:text-white">SCSMM</h3>
              <p className={`text-xs mt-2 line-clamp-3 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Master organic and paid strategies on Meta, LinkedIn, and video networking platforms to scale business funnels.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
                <span>4 Months Intensive</span>
                <span>₹35,000</span>
              </div>
            </div>

            <div className={`p-5 rounded-lg border ${
              isDark ? 'bg-zinc-900/40 border-zinc-905' : 'bg-[#fcfcff] border-slate-200 shadow-sm'
            }`}>
              <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono tracking-wider uppercase">05 / B2B Solutions</div>
              <h3 className="font-semibold text-base mt-1.5 text-neutral-900 dark:text-white">Corporate Training</h3>
              <p className={`text-xs mt-2 line-clamp-3 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Customized talent development, executive program streams, team masterclasses, and on-premises workforce alignment.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>6 Months Specialized</span>
                <span>₹45,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className={`py-8 text-center border-t transition-all text-xs font-medium ${
        isDark ? 'bg-zinc-950 border-zinc-900 text-zinc-500' : 'bg-white border-slate-200/60 text-slate-400'
      }`}>
        <p>© 2026 Skillsia Academy. Registered under Indian training guidelines. All rights reserved.</p>
        <p className="mt-1 font-mono text-[10px] text-indigo-500">Designated Technical Support: info@skillsia.in</p>
      </footer>
    </div>
  );
}
