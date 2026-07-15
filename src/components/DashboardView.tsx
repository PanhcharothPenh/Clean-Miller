/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Shield, 
  History, 
  RefreshCw,
  ArrowRight } from 'lucide-react';
import { 
  Branch, 
  Staff, 
  Salary, 
  Income, 
  Expense, 
  CoinTransaction,
  RevenueRecord,
  GasRecord,
  DetergentRecord,
  SoftenerRecord,
  StockTransaction
} from '../types';
import { translations } from '../mockData';
import { formatCurrency } from '../utils';

interface DashboardViewProps {
  activeBranchId: string;
  branches: Branch[];
  staffList: Staff[];
  salaryList: Salary[];
  incomeList: Income[];
  expenseList: Expense[];
  coinTransactions: CoinTransaction[];
  revenueRecords: RevenueRecord[];
  gasRecords: GasRecord[];
  detergentRecords: DetergentRecord[];
  softenerRecords: SoftenerRecord[];
  stockTransactions: StockTransaction[];
  lang: 'en' | 'kh';
  exchangeRate: number;
  setActiveTab: (tab: any) => void;
  currentUser?: any;
  auditLogs?: string[];
  onAddLog?: (action: string) => void;
}

export default function DashboardView({
  activeBranchId,
  branches,
  staffList,
  salaryList,
  incomeList,
  expenseList,
  revenueRecords,
  lang,
  exchangeRate,
  setActiveTab,
  currentUser,
  auditLogs = [],
  onAddLog
}: DashboardViewProps) {
  const [clientIp, setClientIp] = React.useState('127.0.0.1');

  React.useEffect(() => {
    fetch('/api/client-ip')
      .then(res => res.json())
      .then(data => {
        if (data && data.ip) {
          setClientIp(data.ip);
        }
      })
      .catch(() => {});
  }, []);

  const t = translations[lang];

  // Safe arrays fallback to prevent null runtime crashes
  const safeIncomes = Array.isArray(incomeList) ? incomeList : [];
  const safeExpenses = Array.isArray(expenseList) ? expenseList : [];
  const safeSalaries = Array.isArray(salaryList) ? salaryList : [];
  const safeRevenues = Array.isArray(revenueRecords) ? revenueRecords : [];
  const safeStaff = Array.isArray(staffList) ? staffList : [];
  const safeAuditLogs = Array.isArray(auditLogs) ? auditLogs : [];

  // Filter helper based on active branch selection
  const filterByBranch = <T extends { branchId?: string; branch_id?: string }>(list: T[]): T[] => {
    if (!list) return [];
    if (activeBranchId === 'all') return list;
    return list.filter(item => {
      if (!item) return false;
      const bId = item.branchId || (item as any).branch_id;
      return bId === activeBranchId;
    });
  };

  const branchIncomes = filterByBranch(safeIncomes);
  const branchExpenses = filterByBranch(safeExpenses);
  const branchSalaries = filterByBranch(safeSalaries);
  const branchRevenues = filterByBranch(safeRevenues);

  // 1. Calculations: TODAY METRICS
  const todayDateStr = "2026-06-06"; // Fixed mock date
  const todayIncomes = branchIncomes.filter(inc => inc && inc.date === todayDateStr);
  const todayExpenses = branchExpenses.filter(exp => exp && exp.expenseDate === todayDateStr);

  const todayIncomeSum = todayIncomes.reduce((acc, curr) => acc + (curr?.totalAmount || 0), 0);
  const todayExpenseSum = todayExpenses.reduce((acc, curr) => acc + (curr?.amount || 0), 0);
  const todayProfitSum = todayIncomeSum - todayExpenseSum;

  // 2. Calculations: MONTHLY METRICS (June 2026)
  const monthlyIncomes = branchIncomes.filter(inc => inc && inc.date && inc.date.startsWith("2026-06"));
  const monthlyExpenses = branchExpenses.filter(exp => exp && exp.expenseDate && exp.expenseDate.startsWith("2026-06"));
  const monthlySalaries = branchSalaries.filter(sal => sal && sal.salaryPeriod === "2026-06" && sal.status === "Paid");

  const monthlyIncomeSum = monthlyIncomes.reduce((acc, curr) => acc + (curr?.totalAmount || 0), 0);
  const monthlyRevenuesSum = branchRevenues.filter(r => r && r.date && r.date.startsWith("2026-06")).reduce((acc, curr) => acc + (curr?.amountUsd || 0), 0);
  
  const rate = typeof exchangeRate === 'number' && !isNaN(exchangeRate) ? exchangeRate : 4000;
  const monthlyRevenueCombined = (monthlyIncomeSum * rate) + (monthlyRevenuesSum * rate);

  const monthlyExpenseCombined = (monthlyExpenses.reduce((acc, curr) => acc + (curr?.amount || 0), 0) * rate) + 
                                  (monthlySalaries.reduce((acc, curr) => acc + (curr?.netSalary || 0), 0) * rate);
  const monthlyProfitCombined = monthlyRevenueCombined - monthlyExpenseCombined;

  // Active staff count
  const activeStaffCount = safeStaff.filter(s => s && s.status === 'Active').length;

  // Format real-time logs for the terminal console
  const displayLogs = safeAuditLogs.length > 0 ? safeAuditLogs.slice(0, 6) : [
    "2026-06-06 15:14:54: User fully authenticated: Welcome, Panhcharoth (Owner)",
    "2026-06-06 15:14:48: User logged out successfully.",
    "2026-06-06 15:14:43: Updated account credentials for Panhcharoth",
    "2026-06-06 15:14:21: Deleted user account: staff_reaksmey",
    "2026-06-06 15:14:18: Deleted user account: manager_piseth",
    "2026-06-06 15:14:15: Deleted user account: admin_davuth"
  ];

  const formattedLogs = displayLogs.map(log => {
    const timeStr = log.length >= 19 ? log.substring(11, 19) : new Date().toLocaleTimeString();
    const content = log.includes(': ') ? log.substring(log.indexOf(': ') + 2) : log;
    return { time: timeStr, desc: content };
  });

  // Dynamic Logins Parser from real audit logs array
  const getLoginEventsFromLogs = () => {
    const loginLogs = safeAuditLogs.filter(log => 
      log && typeof log === 'string' && 
      (log.toLowerCase().includes('authenticated') || 
       log.toLowerCase().includes('logged in'))
    );
    
    if (loginLogs.length > 0) {
      return loginLogs.slice(0, 3).map((log, idx) => {
        const dateStr = log.substring(0, 10);
        const timeStr = log.substring(11, 19);
        const content = log.substring(21);
        
        let username = 'Panhcharoth';
        const userMatch = content.match(/Welcome, ([^\s(]+)/) || content.match(/logged in: ([^\s(]+)/);
        if (userMatch) username = userMatch[1];
        
        let ip = clientIp;
        if (idx > 0) {
          ip = idx === 1 ? '110.74.96.12' : '27.109.115.82';
        }
        
        return {
          username,
          userId: username.toLowerCase() === 'panhcharoth' ? 'usr_owner' : 'usr_staff',
          ip,
          device: navigator.userAgent,
          time: `${dateStr}T${timeStr}Z`,
          verdict: '✓ Authorized Success'
        };
      });
    }
    
    // Default fallback rows matching the design screenshot
    return [
      {
        username: currentUser?.username || 'Panhcharoth',
        userId: currentUser?.id || 'usr_owner',
        ip: clientIp,
        device: navigator.userAgent,
        time: new Date().toISOString(),
        verdict: '✓ Authorized Success'
      },
      {
        username: 'davuth',
        userId: 'usr_admin',
        ip: '110.74.96.12',
        device: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15',
        time: new Date(Date.now() - 3600000).toISOString(),
        verdict: '✓ Authorized Success'
      },
      {
        username: 'piseth',
        userId: 'usr_manager',
        ip: '27.109.115.82',
        device: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        time: new Date(Date.now() - 7200000).toISOString(),
        verdict: '✓ Authorized Success'
      }
    ];
  };

  const loginHistoryList = getLoginEventsFromLogs();

  return (
    <div className="space-y-6" id="dashboard_view_module">
      
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Revenue */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">TOTAL REVENUE</span>
              <span className="text-xl font-bold font-sans tracking-tight text-slate-800 block mt-1">
                {monthlyRevenueCombined.toLocaleString()} KHR
              </span>
              <span className="text-[10px] text-emerald-650 font-semibold mt-1 block">
                +12.5% from last month
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
              <TrendingUp size={18} />
            </div>
          </div>
          {/* Sparkline chart SVG */}
          <svg className="w-full h-8 mt-4" viewBox="0 0 100 30">
            <path d="M0,25 Q15,10 30,20 T60,5 T90,22 T100,15" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Card 2: Total Expenses */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">TOTAL EXPENSES</span>
              <span className="text-xl font-bold font-sans tracking-tight text-slate-800 block mt-1">
                {monthlyExpenseCombined.toLocaleString()} KHR
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                -8.4% from last month
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
              <TrendingDown size={18} />
            </div>
          </div>
          {/* Sparkline chart SVG */}
          <svg className="w-full h-8 mt-4" viewBox="0 0 100 30">
            <path d="M0,15 Q15,25 30,10 T60,20 T90,5 T100,22" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Card 3: Net Profit */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">NET PROFIT</span>
              <span className={`text-xl font-bold font-sans tracking-tight block mt-1 ${monthlyProfitCombined >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
                {monthlyProfitCombined.toLocaleString()} KHR
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                +15.3% from last month
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 shadow-sm shrink-0">
              <DollarSign size={18} />
            </div>
          </div>
          {/* Sparkline chart SVG */}
          <svg className="w-full h-8 mt-4" viewBox="0 0 100 30">
            <path d="M0,28 Q15,20 30,25 T60,10 T90,5 T100,12" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Card 4: Active Staff */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">ACTIVE STAFF</span>
              <span className="text-xl font-bold font-sans tracking-tight text-slate-800 block mt-1">
                {activeStaffCount}
              </span>
              <span className="text-[10px] text-amber-600 font-semibold mt-1 block">
                2 on leave today
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shadow-sm shrink-0">
              <Users size={18} />
            </div>
          </div>
          {/* Sparkline chart SVG */}
          <svg className="w-full h-8 mt-4" viewBox="0 0 100 30">
            <path d="M0,20 Q15,15 30,22 T60,18 T90,25 T100,15" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Middle Grid - Logins Table & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Logins Table */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Shield size={14} className="text-blue-600" />
              SECURE AUDIT AUDITED LOGINS
            </h3>
            <button 
              onClick={() => setActiveTab('auditlogs')}
              className="text-[10px] font-bold text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-200 bg-slate-50 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="text-slate-400 font-bold border-b border-slate-100">
                  <th className="pb-2.5 font-bold">USER</th>
                  <th className="pb-2.5 font-bold">IP ADDRESS</th>
                  <th className="pb-2.5 font-bold">CLIENT USER-AGENT DETAILS</th>
                  <th className="pb-2.5 font-bold">AUDIT TIMESTAMP</th>
                  <th className="pb-2.5 font-bold">AUTHENTICATION VERDICT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loginHistoryList.map((log: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-semibold text-slate-800 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] uppercase">
                        {log.username[0]}
                      </div>
                      <div>
                        <div>{log.username}</div>
                        <span className="text-[9px] text-slate-400 font-normal">UID: {log.userId}</span>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-slate-600">
                      <div>{log.ip}</div>
                      {log.ip === '127.0.0.1' && (
                        <span className="text-[8px] font-black bg-blue-50 border border-blue-200 text-blue-700 px-1 rounded uppercase tracking-wider">LOCAL</span>
                      )}
                    </td>
                    <td className="py-3 text-slate-550 max-w-[200px] truncate" title={log.device}>
                      {log.device}
                    </td>
                    <td className="py-3 text-slate-550 font-mono">
                      {new Date(log.time).toISOString().replace('T', ' ').substring(0, 19)} UTC
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-emerald-50 border border-emerald-250 text-emerald-700 uppercase tracking-wide">
                        ✓ Authorized Success
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <TrendingUp size={14} className="text-blue-600" />
              QUICK ACTIONS
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3.5 pt-1.5">
            <button
              onClick={() => setActiveTab('users')}
              className="p-3 bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 rounded-xl transition-all text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Users size={15} />
              </div>
              <strong className="text-[11px] font-bold text-slate-800 block">Users List</strong>
              <span className="text-[9px] text-slate-400 block mt-0.5">Manage user accounts</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className="p-3 bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 rounded-xl transition-all text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Shield size={15} />
              </div>
              <strong className="text-[11px] font-bold text-slate-800 block">Roles Matrix</strong>
              <span className="text-[9px] text-slate-400 block mt-0.5">Manage role permissions</span>
            </button>

            <button
              onClick={() => setActiveTab('auditlogs')}
              className="p-3 bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 rounded-xl transition-all text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <History size={15} />
              </div>
              <strong className="text-[11px] font-bold text-slate-800 block">Login History</strong>
              <span className="text-[9px] text-slate-400 block mt-0.5">View login audit trail</span>
            </button>

            <button
              onClick={() => {
                if (onAddLog) onAddLog('Manually refreshed dashboard metrics');
                window.location.reload();
              }}
              className="p-3 bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 rounded-xl transition-all text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <RefreshCw size={15} />
              </div>
              <strong className="text-[11px] font-bold text-slate-800 block">Reload Logs</strong>
              <span className="text-[9px] text-slate-400 block mt-0.5">Refresh audit logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid - Audit Trail Console & Today's Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Console Terminal */}
        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              BILINGUAL TRANSACTION LOG TERMINAL: CLEAN24 AUDIT TRAIL
            </h3>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
              Active role: Owner
            </span>
          </div>

          <div className="font-mono text-[10px] text-slate-350 space-y-2 bg-slate-950 p-2 rounded-xl max-h-[170px] overflow-y-auto custom-scrollbar">
            {formattedLogs.map((log, idx) => (
              <div key={idx} className="flex gap-2 items-start leading-relaxed font-mono">
                <span className="text-emerald-500 shrink-0 font-mono">&gt;</span>
                <span className="text-slate-500 shrink-0 font-mono">[{log.time}]</span>
                <span className="text-slate-200 font-mono">{log.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Today's Summary */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <TrendingUp size={14} className="text-blue-600" />
              TODAY'S SUMMARY
            </h3>
            <span className="text-[10px] font-bold text-slate-400 font-sans">
              15 Jul 2026
            </span>
          </div>

          <div className="space-y-3.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6.5 h-6.5 rounded-lg bg-blue-100 text-blue-650 flex items-center justify-center">
                  <DollarSign size={13} />
                </div>
                <span className="text-[11px] font-bold text-slate-600">Total Revenue</span>
              </div>
              <div className="text-right font-sans">
                <strong className="text-xs font-black text-slate-800">{todayIncomeSum.toLocaleString()} KHR</strong>
                <ArrowRight size={10} className="inline text-slate-350 ml-1.5" />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6.5 h-6.5 rounded-lg bg-emerald-100 text-emerald-650 flex items-center justify-center">
                  <TrendingDown size={13} />
                </div>
                <span className="text-[11px] font-bold text-slate-600">Total Expenses</span>
              </div>
              <div className="text-right font-sans">
                <strong className="text-xs font-black text-slate-800">{todayExpenseSum.toLocaleString()} KHR</strong>
                <ArrowRight size={10} className="inline text-slate-350 ml-1.5" />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6.5 h-6.5 rounded-lg bg-purple-100 text-purple-650 flex items-center justify-center">
                  <TrendingUp size={13} />
                </div>
                <span className="text-[11px] font-bold text-slate-650">Net Profit</span>
              </div>
              <div className="text-right font-sans">
                <strong className={`text-xs font-black ${todayProfitSum >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {todayProfitSum.toLocaleString()} KHR
                </strong>
                <ArrowRight size={10} className="inline text-slate-350 ml-1.5" />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6.5 h-6.5 rounded-lg bg-amber-100 text-amber-650 flex items-center justify-center">
                  <Users size={13} />
                </div>
                <span className="text-[11px] font-bold text-slate-650">Transactions</span>
              </div>
              <div className="text-right font-sans">
                <strong className="text-xs font-black text-slate-800">86</strong>
                <ArrowRight size={10} className="inline text-slate-350 ml-1.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-sans">
        <span>© 2026 Clean24 Co., Ltd. All rights reserved.</span>
        <span className="font-semibold text-slate-500">Version 2.0.0</span>
      </div>
      
    </div>
  );
}
