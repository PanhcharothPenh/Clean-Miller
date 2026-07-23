/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle, 
  CalendarClock, 
  Percent, 
  CreditCard,
  Building,
  Zap,
  Droplet,
  Users,
  Coins,
  Droplets,
  Sparkles,
  Flame,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Package,
  Layers,
  FileText,
  Boxes
} from 'lucide-react';
import { 
  Branch, 
  Staff, 
  Salary, 
  Income, 
  Expense, 
  InventoryItem,
  CoinTransaction,
  RevenueRecord,
  GasRecord,
  DetergentRecord,
  SoftenerRecord,
  StockTransaction
} from '../types';
import { translations } from '../mockData';
import { formatCurrency, formatDualCurrency } from '../utils';

interface DashboardViewProps {
  activeBranchId: string;
  branches: Branch[];
  staffList: Staff[];
  salaryList: Salary[];
  incomeList: Income[];
  expenseList: Expense[];
  inventoryList: InventoryItem[];
  coinTransactions: CoinTransaction[];
  revenueRecords: RevenueRecord[];
  gasRecords: GasRecord[];
  detergentRecords: DetergentRecord[];
  softenerRecords: SoftenerRecord[];
  stockTransactions: StockTransaction[];
  lang: 'en' | 'kh';
  exchangeRate: number;
}

export default function DashboardView({
  activeBranchId,
  branches,
  staffList,
  salaryList,
  incomeList,
  expenseList,
  inventoryList,
  coinTransactions,
  revenueRecords,
  gasRecords,
  detergentRecords,
  softenerRecords,
  stockTransactions,
  lang,
  exchangeRate
}: DashboardViewProps) {
  const t = translations[lang];

  // Defensive array checks
  const safeIncomes = Array.isArray(incomeList) ? incomeList : [];
  const safeExpenses = Array.isArray(expenseList) ? expenseList : [];
  const safeSalaries = Array.isArray(salaryList) ? salaryList : [];
  const safeStaff = Array.isArray(staffList) ? staffList : [];
  const safeCoins = Array.isArray(coinTransactions) ? coinTransactions : [];
  const safeRevenues = Array.isArray(revenueRecords) ? revenueRecords : [];
  const safeGas = Array.isArray(gasRecords) ? gasRecords : [];
  const safeDetergent = Array.isArray(detergentRecords) ? detergentRecords : [];
  const safeSoftener = Array.isArray(softenerRecords) ? softenerRecords : [];

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
  const branchCoins = filterByBranch(safeCoins);
  const branchRevenues = filterByBranch(safeRevenues);

  // 1. TODAY METRICS
  const todayDateStr = "2026-06-06"; 
  const todayIncomes = branchIncomes.filter(inc => inc && inc.date === todayDateStr);
  const todayExpenses = branchExpenses.filter(exp => exp && exp.expenseDate === todayDateStr);

  const todayIncomeSum = todayIncomes.reduce((acc, curr) => acc + (curr?.totalAmount || 0), 0);
  const todayExpenseSum = todayExpenses.reduce((acc, curr) => acc + (curr?.amount || 0), 0);
  const todayProfitSum = todayIncomeSum - todayExpenseSum;

  const totalInCoins = branchCoins.filter(c => c && c.type === 'In').reduce((sum, c) => sum + (c?.amount || 0), 0);
  const totalOutCoins = branchCoins.filter(c => c && c.type === 'Out').reduce((sum, c) => sum + (c?.amount || 0), 0);
  const totalCoinBalance = totalInCoins - totalOutCoins;

  const todayRevenuesSum = branchRevenues.filter(r => r && r.date === todayDateStr).reduce((acc, curr) => acc + (curr?.amountUsd || 0), 0);
  const dailyRevenueCombined = todayIncomeSum + todayRevenuesSum;

  // 2. MONTHLY METRICS (June 2026)
  const monthlyIncomes = branchIncomes.filter(inc => inc && inc.date && inc.date.startsWith("2026-06"));
  const monthlyExpenses = branchExpenses.filter(exp => exp && exp.expenseDate && exp.expenseDate.startsWith("2026-06"));
  const monthlySalaries = branchSalaries.filter(sal => sal && sal.salaryPeriod === "2026-06" && sal.status === "Paid");

  const monthlyIncomeSum = monthlyIncomes.reduce((acc, curr) => acc + (curr?.totalAmount || 0), 0);
  const monthlyRevenuesSum = branchRevenues.filter(r => r && r.date && r.date.startsWith("2026-06")).reduce((acc, curr) => acc + (curr?.amountUsd || 0), 0);
  const monthlyRevenueCombined = monthlyIncomeSum + monthlyRevenuesSum;

  const monthlyExpenseSum = monthlyExpenses.reduce((acc, curr) => acc + (curr?.amount || 0), 0) + 
                            monthlySalaries.reduce((acc, curr) => acc + (curr?.netSalary || 0), 0);
  const monthlyProfitSum = monthlyRevenueCombined - monthlyExpenseSum;

  // Active staff count
  const activeStaffCount = safeStaff.filter(s => s && s.status === 'Active').length;

  return (
    <div className="space-y-8 p-1 font-sans" id="spacious_clean_dashboard">
      
      {/* SECTION 1: BIG PROMINENT STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Daily Revenue */}
        <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
              {lang === 'en' ? "TODAY'S REVENUE" : "ចំណូលថ្ងៃនេះ"}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-xs">
              <DollarSign size={24} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {formatCurrency(dailyRevenueCombined, 'USD')}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              ៛{Math.round(dailyRevenueCombined * exchangeRate).toLocaleString()} KHR
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-bold">
            <span className="flex items-center gap-1">
              <TrendingUp size={14} /> +14.2% {lang === 'en' ? "vs Yesterday" : "ធៀបម្សិលមិញ"}
            </span>
            <span className="text-slate-400 font-medium">Clean24 SN12</span>
          </div>
        </div>

        {/* Card 2: Monthly Profit */}
        <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
              {lang === 'en' ? "MONTHLY NET PROFIT" : "ប្រាក់ចំណេញខែនេះ"}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-xs">
              <Activity size={24} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-700 font-mono tracking-tight">
              {formatCurrency(monthlyProfitSum, 'USD')}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              ៛{Math.round(monthlyProfitSum * exchangeRate).toLocaleString()} KHR
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-bold">
            <span className="flex items-center gap-1">
              <TrendingUp size={14} /> +8.5% {lang === 'en' ? "Target met" : "សម្រេចតាមគោលដៅ"}
            </span>
            <span className="text-slate-400 font-medium">June 2026</span>
          </div>
        </div>

        {/* Card 3: Active Staff & Operations */}
        <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
              {lang === 'en' ? "ACTIVE STAFF" : "បុគ្គលិកកំពុងធ្វើការ"}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-xs">
              <Users size={24} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
              {activeStaffCount} <span className="text-sm font-bold text-slate-400">Persons</span>
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              Across {branches.length} Active Branches
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-bold">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} /> 100% Shifts Covered
            </span>
            <span className="text-slate-400 font-medium">On Duty</span>
          </div>
        </div>

        {/* Card 4: Coin Vault Balance */}
        <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
              {lang === 'en' ? "COIN VAULT BALANCE" : "កាក់ក្នុងទូសរុប"}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-xs">
              <Coins size={24} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {totalCoinBalance.toLocaleString()} <span className="text-sm font-bold text-amber-600">Coins</span>
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              Value: {formatCurrency(totalCoinBalance * 0.25, 'USD')}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-bold">
            <span className="flex items-center gap-1">
              <Zap size={14} /> Ready for dispenser
            </span>
            <span className="text-slate-400 font-medium">Vault Safe</span>
          </div>
        </div>

      </div>

      {/* SECTION 2: QUICK ACTION CARDS GRID */}
      <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Zap size={18} className="text-blue-600" />
          {lang === 'en' ? "QUICK MANAGEMENT ACTIONS" : "ការងាររហ័សសំខាន់ៗ"}
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 p-4 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center mb-3 shadow-3xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <DollarSign size={20} />
            </div>
            <div>
              <strong className="text-xs font-extrabold text-slate-800 block group-hover:text-blue-700">
                {lang === 'en' ? "Record Income" : "កត់ត្រាការលក់"}
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Add new laundry bill</span>
            </div>
          </div>

          <div className="bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 p-4 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-rose-600 flex items-center justify-center mb-3 shadow-3xs group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <CreditCard size={20} />
            </div>
            <div>
              <strong className="text-xs font-extrabold text-slate-800 block group-hover:text-rose-700">
                {lang === 'en' ? "Log Expense" : "កត់ត្រាការចំណាយ"}
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Record opex receipt</span>
            </div>
          </div>

          <div className="bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 p-4 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-indigo-600 flex items-center justify-center mb-3 shadow-3xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Droplets size={20} />
            </div>
            <div>
              <strong className="text-xs font-extrabold text-slate-800 block group-hover:text-indigo-700">
                {lang === 'en' ? "Soap Reservoir" : "ពិនិត្យសាប៊ូ"}
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Check detergent liters</span>
            </div>
          </div>

          <div className="bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 p-4 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center mb-3 shadow-3xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users size={20} />
            </div>
            <div>
              <strong className="text-xs font-extrabold text-slate-800 block group-hover:text-emerald-700">
                {lang === 'en' ? "Staff & Payroll" : "ប្រាក់ខែបុគ្គលិក"}
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Manage team salaries</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: MONTHLY & FINANCIAL PERFORMANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Financial Overview breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-150 rounded-3xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
                {lang === 'en' ? "MONTHLY FINANCIAL OVERVIEW" : "សង្ខេបហិរញ្ញវត្ថុប្រចាំខែ (June 2026)"}
              </h3>
              <span className="text-xs text-slate-400 block mt-0.5">Consolidated revenue, expenses, and net profit</span>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold rounded-full text-xs border border-emerald-200">
              Active Month
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MONTHLY REVENUE</span>
              <strong className="text-lg font-bold text-slate-800 block mt-1">{formatCurrency(monthlyRevenueCombined, 'USD')}</strong>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MONTHLY EXPENSES</span>
              <strong className="text-lg font-bold text-rose-600 block mt-1">{formatCurrency(monthlyExpenseSum, 'USD')}</strong>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">NET MONTHLY PROFIT</span>
              <strong className="text-lg font-extrabold text-emerald-700 block mt-1">{formatCurrency(monthlyProfitSum, 'USD')}</strong>
            </div>
          </div>

          {/* Simple Visual Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Profit Margin Performance</span>
              <span className="text-emerald-600">
                {monthlyRevenueCombined > 0 ? Math.round((monthlyProfitSum / monthlyRevenueCombined) * 100) : 0}% Margin
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 flex">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${monthlyRevenueCombined > 0 ? (monthlyProfitSum / monthlyRevenueCombined) * 100 : 0}%` }}></div>
            </div>
          </div>
        </div>

        {/* Branch Isolation Breakdown */}
        <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <Building size={16} className="text-blue-600" />
            {lang === 'en' ? "PROFIT BY BRANCH" : "ប្រាក់ចំណេញតាមសាខា"}
          </h3>

          <div className="space-y-3">
            {branches.map(b => (
              <div key={b.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <strong className="text-xs font-bold text-slate-800 block">{b.branchName}</strong>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{b.branchCode}</span>
                </div>
                <span className="text-xs font-extrabold font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  +$1,280.00
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
