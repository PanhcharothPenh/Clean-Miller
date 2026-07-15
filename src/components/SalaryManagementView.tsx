/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Users, 
  Coins, 
  Clock, 
  Calculator, 
  History, 
  Bell,
  Globe,
  CircleCheck,
  AlertTriangle,
  X
} from 'lucide-react';
import { Salary, Staff, Role, Branch, SalarySchedule, SalaryAdvance } from '../types';

// Modular Khmer Payroll Subcomponents
import { OvertimeLog, khmerPayrollTranslations } from '../utils/khmerPayrollUtils';
import KhmerPayrollDashboard from './KhmerPayrollDashboard';
import KhmerPayrollEmployees from './KhmerPayrollEmployees';
import KhmerPayrollAdvances from './KhmerPayrollAdvances';
import KhmerPayrollOvertime from './KhmerPayrollOvertime';
import KhmerPayrollCalculator from './KhmerPayrollCalculator';
import KhmerPayrollHistory from './KhmerPayrollHistory';
import KhmerPayrollPayslipModal from './KhmerPayrollPayslipModal';

interface SalaryManagementViewProps {
  currentRole: Role;
  activeBranchId: string;
  branches: Branch[];
  staffList: Staff[];
  setStaff?: React.Dispatch<React.SetStateAction<Staff[]>>;
  salaries: Salary[];
  setSalaries: React.Dispatch<React.SetStateAction<Salary[]>>;
  salarySchedules: SalarySchedule[];
  setSalarySchedules: React.Dispatch<React.SetStateAction<SalarySchedule[]>>;
  salaryAdvances: SalaryAdvance[];
  setSalaryAdvances: React.Dispatch<React.SetStateAction<SalaryAdvance[]>>;
  lang: 'en' | 'kh';
  onAddLog: (msg: string) => void;
  exchangeRate: number;
}

export default function SalaryManagementView({
  currentRole,
  activeBranchId,
  branches,
  staffList,
  setStaff,
  salaries,
  setSalaries,
  salarySchedules,
  setSalarySchedules,
  salaryAdvances,
  setSalaryAdvances,
  lang: globalLang,
  onAddLog,
  exchangeRate
}: SalaryManagementViewProps) {
  // Localized view language, defaulting to the global system language
  const [localLang, setLocalLang] = useState<'en' | 'kh'>(globalLang);
  
  // Sync local language if global system language toggles
  useEffect(() => {
    setLocalLang(globalLang);
  }, [globalLang]);

  const trans = khmerPayrollTranslations[localLang];

  // Active Tab state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'advances' | 'overtime' | 'calculate' | 'history'>('dashboard');

  // Local Custom States (Overtime persisted locally)
  const [overtimeLogs, setOvertimeLogs] = useState<OvertimeLog[]>(() => {
    const saved = localStorage.getItem('khmer_payroll_overtime');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync back to localstorage on changes
  useEffect(() => {
    localStorage.setItem('khmer_payroll_overtime', JSON.stringify(overtimeLogs));
  }, [overtimeLogs]);

  // Payday alerts state for top visual notice bar
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [showNotificationBanner, setShowNotificationBanner] = useState(true);

  // Payslip preview modal state
  const [selectedPayslipRecord, setSelectedPayslipRecord] = useState<any | null>(null);

  // Strict role authentication guard
  const isAuthorized = ['Owner', 'Admin', 'Manager'].includes(currentRole);

  if (!isAuthorized) {
    return (
      <div className="bg-white border border-rose-100 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm relative overflow-hidden" id="security_guard_notice">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-rose-500/40 via-rose-500 to-rose-500/40"></div>
        <ShieldAlert className="text-rose-500 mx-auto mb-4" size={54} />
        <h3 className="text-lg font-bold text-slate-800 font-sans">{localLang === 'en' ? "Access Restriction Alert" : "ការព្រមានការកម្រិតសិទ្ធិ"}</h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          {localLang === 'en' 
            ? "Your current system security role is restricted. Only Owners, Admins, or Managers can access employee compensation, advance records, and payroll processing." 
            : "តួនាទីសន្តិសុខប្រព័ន្ធបច្ចុប្បន្នរបស់អ្នកត្រូវបានកំណត់។ មានតែម្ចាស់, អ្នកគ្រប់គ្រងជាន់ខ្ពស់ ឬអ្នកចាត់ការទូទៅប៉ុណ្ណោះ ដែលអាចមើល និងដំណើរការប្រាក់ខែបុគ្គលិកបាន។"
          }
        </p>
        <div className="mt-6 p-3.5 bg-slate-50 rounded-xl text-slate-400 font-mono text-xs border border-slate-100">
          STRICT_DATA_SEPARATION_ENFORCED // role_required: Manager+ // user_role: {currentRole}
        </div>
      </div>
    );
  }

  // Count of urgent alerts
  const urgentAlertsCount = useMemo(() => {
    return activeAlerts.filter(a => a.type === 'urgent' || a.type === 'pastdue').length;
  }, [activeAlerts]);

  // Update record status from the payslip modal directly
  const handleUpdatePayslipStatus = (newStatus: 'paid' | 'unpaid') => {
    if (!selectedPayslipRecord) return;
    const finalStatus = newStatus === 'paid' ? 'Paid' : 'Unpaid';
    setSalaries(prev => prev.map(s => s.id === selectedPayslipRecord.id ? { ...s, status: finalStatus as any } : s));
    setSelectedPayslipRecord(prev => prev ? { ...prev, status: newStatus } : null);
    onAddLog(`Toggled status of salary record ID ${selectedPayslipRecord.id} to: ${finalStatus}`);
  };

  return (
    <div className="space-y-6" id="khmer_payroll_module">
      
      {/* Top Floating Urgent Alert Banner */}
      {showNotificationBanner && urgentAlertsCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm animate-pulse relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[3px] h-full bg-amber-500"></div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl border border-amber-200">
              <Bell size={16} />
            </div>
            <div className="space-y-0.5">
              <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                {localLang === 'kh' ? 'សេចក្តីជូនដំណឹងថ្ងៃបើកប្រាក់ខែប្រញាប់!' : 'Urgent Payday Notification!'}
              </h5>
              <p className="text-[11px] text-slate-500 leading-normal">
                {localLang === 'kh' 
                  ? `មានបុគ្គលិកចំនួន ${urgentAlertsCount} នាក់ ដល់ថ្ងៃត្រូវគណនា និងបើកប្រាក់ខែឱ្យហើយ។ សូមចូលទៅផ្ស្ថាំងគណនា។`
                  : `There are ${urgentAlertsCount} employee payday cycles requiring immediate processing today.`
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-650 text-slate-950 text-[10.5px] font-black rounded-xl transition-all cursor-pointer shadow-xs"
            >
              {localLang === 'kh' ? 'ពិនិត្យមើល' : 'View Alerts'}
            </button>
            <button 
              onClick={() => setShowNotificationBanner(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-all cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Glassmorphic Switcher Hub Container */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        {/* Floating Accent Ring */}
        <div className="absolute right-0 bottom-0 translate-y-12 translate-x-12 opacity-[0.06] pointer-events-none">
          <Calculator size={260} className="text-indigo-900" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9.5px] bg-indigo-50 text-indigo-600 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-100">
                Khmer Payroll Engine v2.0
              </span>
              <span className="text-[9.5px] bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
                Dual Currency USD/KHR
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black font-sans tracking-tight mt-2 text-slate-800">
              {trans['app-title']}
            </h1>
            <p className="text-[11px] text-slate-500 mt-1 max-w-2xl leading-relaxed font-medium">
              {trans['app-subtitle']}
            </p>
          </div>

          {/* Quick language toggle */}
          <button 
            onClick={() => setLocalLang(prev => prev === 'en' ? 'kh' : 'en')}
            className="self-start md:self-center px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-850 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs animate-none"
          >
            {localLang === 'en' ? (
              <svg className="w-4 h-3 rounded-xs shrink-0 shadow-xs border border-slate-200/20" viewBox="0 0 936 600">
                <rect width="936" height="150" fill="#032EA1" />
                <rect y="150" width="936" height="300" fill="#E51B23" />
                <rect y="450" width="936" height="150" fill="#032EA1" />
                <g fill="#FFF" transform="translate(368, 200)">
                  <path d="M40,170 L50,110 L60,110 L70,170 Z" />
                  <path d="M130,170 L140,110 L150,110 L160,170 Z" />
                  <path d="M85,170 L100,70 L110,70 L125,170 Z" />
                  <rect x="20" y="170" width="160" height="15" />
                  <rect x="30" y="185" width="140" height="15" />
                </g>
              </svg>
            ) : (
              <svg className="w-4 h-3 rounded-xs shrink-0 shadow-xs border border-slate-200/20" viewBox="0 0 741 390">
                <rect width="741" height="390" fill="#B22234" />
                <path d="M0,30h741M0,90h741M0,150h741M0,210h741M0,270h741M0,330h741" stroke="#FFF" strokeWidth="30" />
                <rect width="296" height="210" fill="#3C3B6E" />
                <g fill="#FFF">
                  <circle cx="25" cy="20" r="4" /><circle cx="75" cy="20" r="4" /><circle cx="125" cy="20" r="4" /><circle cx="175" cy="20" r="4" /><circle cx="225" cy="20" r="4" /><circle cx="275" cy="20" r="4" />
                  <circle cx="50" cy="40" r="4" /><circle cx="100" cy="40" r="4" /><circle cx="150" cy="40" r="4" /><circle cx="200" cy="40" r="4" /><circle cx="250" cy="40" r="4" />
                  <circle cx="25" cy="60" r="4" /><circle cx="75" cy="60" r="4" /><circle cx="125" cy="60" r="4" /><circle cx="175" cy="60" r="4" /><circle cx="225" cy="60" r="4" /><circle cx="275" cy="60" r="4" />
                  <circle cx="50" cy="80" r="4" /><circle cx="100" cy="80" r="4" /><circle cx="150" cy="80" r="4" /><circle cx="200" cy="80" r="4" /><circle cx="250" cy="80" r="4" />
                  <circle cx="25" cy="100" r="4" /><circle cx="75" cy="100" r="4" /><circle cx="125" cy="100" r="4" /><circle cx="175" cy="100" r="4" /><circle cx="225" cy="100" r="4" /><circle cx="275" cy="100" r="4" />
                  <circle cx="50" cy="120" r="4" /><circle cx="100" cy="120" r="4" /><circle cx="150" cy="120" r="4" /><circle cx="200" cy="120" r="4" /><circle cx="250" cy="120" r="4" />
                  <circle cx="25" cy="140" r="4" /><circle cx="75" cy="140" r="4" /><circle cx="125" cy="140" r="4" /><circle cx="175" cy="140" r="4" /><circle cx="225" cy="140" r="4" /><circle cx="275" cy="140" r="4" />
                  <circle cx="50" cy="160" r="4" /><circle cx="100" cy="160" r="4" /><circle cx="150" cy="160" r="4" /><circle cx="200" cy="160" r="4" /><circle cx="250" cy="160" r="4" />
                  <circle cx="25" cy="180" r="4" /><circle cx="75" cy="180" r="4" /><circle cx="125" cy="180" r="4" /><circle cx="175" cy="180" r="4" /><circle cx="225" cy="180" r="4" /><circle cx="275" cy="180" r="4" />
                </g>
              </svg>
            )}
            <span>{localLang === 'en' ? 'ភាសាខ្មែរ (Khmer)' : 'English'}</span>
          </button>
        </div>

        {/* Tab Selection Row */}
        <div className="flex gap-1.5 mt-6 border-t border-slate-100 pt-4 overflow-x-auto select-none no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 rounded-xl text-[11px] font-black tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'dashboard' 
                ? 'bg-indigo-600 text-white border-indigo-600/10 shadow-xs scale-[1.02]' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-transparent'
            }`}
          >
            <LayoutDashboard size={13} />
            <span>{trans['tab-dashboard']}</span>
          </button>

          <button
            onClick={() => setActiveTab('employees')}
            className={`px-3 py-2 rounded-xl text-[11px] font-black tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'employees' 
                ? 'bg-indigo-600 text-white border-indigo-600/10 shadow-xs scale-[1.02]' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-transparent'
            }`}
          >
            <Users size={13} />
            <span>{trans['tab-employees']}</span>
          </button>

          <button
            onClick={() => setActiveTab('advances')}
            className={`px-3 py-2 rounded-xl text-[11px] font-black tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'advances' 
                ? 'bg-indigo-600 text-white border-indigo-600/10 shadow-xs scale-[1.02]' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-transparent'
            }`}
          >
            <Coins size={13} />
            <span>{trans['tab-advances']}</span>
          </button>

          <button
            onClick={() => setActiveTab('overtime')}
            className={`px-3 py-2 rounded-xl text-[11px] font-black tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'overtime' 
                ? 'bg-indigo-600 text-white border-indigo-600/10 shadow-xs scale-[1.02]' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-transparent'
            }`}
          >
            <Clock size={13} />
            <span>{trans['tab-overtime']}</span>
          </button>

          <button
            onClick={() => setActiveTab('calculate')}
            className={`px-3 py-2 rounded-xl text-[11px] font-black tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'calculate' 
                ? 'bg-indigo-600 text-white border-indigo-600/10 shadow-xs scale-[1.02]' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-transparent'
            }`}
          >
            <Calculator size={13} />
            <span>{trans['tab-calculate']}</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-2 rounded-xl text-[11px] font-black tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'history' 
                ? 'bg-indigo-600 text-white border-indigo-600/10 shadow-xs scale-[1.02]' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-transparent'
            }`}
          >
            <History size={13} />
            <span>{trans['tab-history']}</span>
          </button>
        </div>
      </div>

      {/* Render Active Subcomponent */}
      <div className="relative z-10 transition-all duration-300">
        {activeTab === 'dashboard' && (
          <KhmerPayrollDashboard
            staffList={staffList}
            salaries={salaries}
            salaryAdvances={salaryAdvances}
            overtimeLogs={overtimeLogs}
            lang={localLang}
            onAlertsCalculated={setActiveAlerts}
          />
        )}

        {activeTab === 'employees' && (
          <KhmerPayrollEmployees
            staffList={staffList}
            setStaff={setStaff}
            lang={localLang}
            onAddLog={onAddLog}
          />
        )}

        {activeTab === 'advances' && (
          <KhmerPayrollAdvances
            staffList={staffList}
            salaryAdvances={salaryAdvances}
            setSalaryAdvances={setSalaryAdvances}
            lang={localLang}
            onAddLog={onAddLog}
          />
        )}

        {activeTab === 'overtime' && (
          <KhmerPayrollOvertime
            staffList={staffList}
            overtimeLogs={overtimeLogs}
            setOvertimeLogs={setOvertimeLogs}
            lang={localLang}
            onAddLog={onAddLog}
          />
        )}

        {activeTab === 'calculate' && (
          <KhmerPayrollCalculator
            staffList={staffList}
            salaries={salaries}
            setSalaries={setSalaries}
            salaryAdvances={salaryAdvances}
            setSalaryAdvances={setSalaryAdvances}
            overtimeLogs={overtimeLogs}
            lang={localLang}
            onAddLog={onAddLog}
            onOpenPayslip={setSelectedPayslipRecord}
          />
        )}

        {activeTab === 'history' && (
          <KhmerPayrollHistory
            staffList={staffList}
            salaries={salaries}
            setSalaries={setSalaries}
            lang={localLang}
            onAddLog={onAddLog}
            onOpenPayslip={setSelectedPayslipRecord}
          />
        )}
      </div>

      {/* Payslip Modal Overlay */}
      <KhmerPayrollPayslipModal
        isOpen={selectedPayslipRecord !== null}
        onClose={() => setSelectedPayslipRecord(null)}
        record={selectedPayslipRecord}
        lang={localLang}
        onUpdateStatus={handleUpdatePayslipStatus}
      />

    </div>
  );
}
