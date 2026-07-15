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
  Droplet
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

  // Filter lists based on strict data separation
  const filterByBranch = <T extends { branchId?: string; branch_id?: string }>(list: T[]): T[] => {
    if (activeBranchId === 'all') return list;
    return list.filter(item => {
      const bId = item.branchId || (item as any).branch_id;
      return bId === activeBranchId;
    });
  };

  const branchIncomes = filterByBranch(incomeList);
  const branchExpenses = filterByBranch(expenseList);
  const branchSalaries = filterByBranch(salaryList);
  const branchInventory = filterByBranch(inventoryList);

  // 1. Calculations: TODAY METRICS
  const todayDateStr = "2026-06-06"; // Fixed relative mock date
  const todayIncomes = branchIncomes.filter(inc => inc.date === todayDateStr);
  const todayExpenses = branchExpenses.filter(exp => exp.expenseDate === todayDateStr);

  const todayIncomeSum = todayIncomes.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const todayExpenseSum = todayExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const todayProfitSum = todayIncomeSum - todayExpenseSum;

  // New Cards Metrics calculations
  const branchCoins = filterByBranch(coinTransactions);
  const totalInCoins = branchCoins.filter(c => c.type === 'In').reduce((sum, c) => sum + c.amount, 0);
  const totalOutCoins = branchCoins.filter(c => c.type === 'Out').reduce((sum, c) => sum + c.amount, 0);
  const totalCoinBalance = totalInCoins - totalOutCoins;

  const branchRevenues = filterByBranch(revenueRecords);
  const todayRevenuesSum = branchRevenues.filter(r => r.date === todayDateStr).reduce((acc, curr) => acc + curr.amountUsd, 0);
  const dailyRevenueCombined = todayIncomeSum + todayRevenuesSum;

  // 2. Calculations: MONTHLY METRICS (June 2026)
  const monthlyIncomes = branchIncomes.filter(inc => inc.date.startsWith("2026-06"));
  const monthlyExpenses = branchExpenses.filter(exp => exp.expenseDate.startsWith("2026-06"));
  const monthlySalaries = branchSalaries.filter(sal => sal.salaryPeriod === "2026-06" && sal.status === "Paid");

  const monthlyIncomeSum = monthlyIncomes.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const monthlyRevenuesSum = branchRevenues.filter(r => r.date.startsWith("2026-06")).reduce((acc, curr) => acc + curr.amountUsd, 0);
  const monthlyRevenueCombined = monthlyIncomeSum + monthlyRevenuesSum;

  const monthlyExpenseSum = monthlyExpenses.reduce((acc, curr) => acc + curr.amount, 0) + 
                            monthlySalaries.reduce((acc, curr) => acc + curr.netSalary, 0);
  const monthlyProfitSum = monthlyRevenueCombined - monthlyExpenseSum;

  // Operational levels
  const branchGas = filterByBranch(gasRecords);
  const gasRemaining = branchGas.length > 0 ? branchGas[0].remainingKg : 45;

  const branchDetergent = filterByBranch(detergentRecords);
  const detergentRemaining = branchDetergent.length > 0 ? branchDetergent[0].remainingLiters : 20;

  // Calculate exact requested Powder, Soap, Cleaner and Total Soap monthly usages
  const currentMonthPrefix = "2026-06";
  const branchDetergentThisMonth = branchDetergent.filter(d => d.date.startsWith(currentMonthPrefix));
  const monthlyPowderUsage = branchDetergentThisMonth.reduce((acc, curr) => acc + (curr.powder || 0), 0);
  const monthlySoapUsage = branchDetergentThisMonth.reduce((acc, curr) => acc + (curr.soap || 0), 0);
  const monthlyCleanerUsage = branchDetergentThisMonth.reduce((acc, curr) => acc + (curr.cleaner || 0), 0);
  const monthlyTotalDetergentUsage = branchDetergentThisMonth.reduce((acc, curr) => acc + (curr.total || (curr.powder || 0) + (curr.soap || 0) + (curr.cleaner || 0)), 0);

  const branchSoftener = filterByBranch(softenerRecords);
  const rawSoftenerRemaining = branchSoftener.length > 0 ? (branchSoftener[0].remainingStock !== undefined ? branchSoftener[0].remainingStock : (branchSoftener[0].remainingLiters !== undefined ? branchSoftener[0].remainingLiters : 48)) : 48;
  const softenerRemaining = rawSoftenerRemaining;
  const packagesPerCaseVal = 20;
  const softenerCases = Math.floor(rawSoftenerRemaining / packagesPerCaseVal);
  const softenerPackages = Math.round(rawSoftenerRemaining % packagesPerCaseVal);
  
  // Calculate exact requested Softener monthly usages
  const branchSoftenerThisMonth = branchSoftener.filter(s => s.date.startsWith(currentMonthPrefix));
  const monthlySoftenerIn = branchSoftenerThisMonth.reduce((acc, curr) => acc + (curr.inQty || 0), 0);
  const monthlySoftenerOut = branchSoftenerThisMonth.reduce((acc, curr) => acc + (curr.outQty !== undefined ? curr.outQty : (curr.total || (curr.comfort || 0) + (curr.ora || 0))), 0);
  const monthlyTotalUsage = monthlySoftenerOut;
  const softenerSpentTrend = monthlyTotalUsage;

  const branchStockTrans = filterByBranch(stockTransactions);
  const registry: Record<string, number> = {};
  branchStockTrans.forEach(tx => {
    registry[tx.itemName] = tx.currentStock;
  });
  const lowStockCount = Object.values(registry).filter(stock => stock < 10).length;

  // Profit by Branch calculations
  const profitByBranchList = branches.map(b => {
    const bIncomes = incomeList.filter(i => i.branchId === b.id).reduce((s, c) => s + c.totalAmount, 0);
    const bRevenues = revenueRecords.filter(r => r.branchId === b.id).reduce((s, c) => s + c.amountUsd, 0);
    const bExpenses = expenseList.filter(e => e.branchId === b.id).reduce((s, c) => s + c.amount, 0);
    const bSalaries = salaryList.filter(s => s.branchId === b.id && s.status === 'Paid').reduce((s, c) => s + c.netSalary, 0);
    
    const profit = (bIncomes + bRevenues) - (bExpenses + bSalaries);
    return {
      id: b.id,
      branchName: b.branchName,
      branchCode: b.branchCode,
      profit
    };
  });

  // 3. Calculations: YEARLY METRICS (2026)
  const yearlyIncomes = branchIncomes.filter(inc => inc.date.startsWith("2026"));
  const yearlyExpenses = branchExpenses.filter(exp => exp.expenseDate.startsWith("2026"));
  const yearlySalaries = branchSalaries.filter(sal => sal.salaryPeriod.startsWith("2026") && sal.status === "Paid");

  const yearlyIncomeSum = yearlyIncomes.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const yearlyRevenuesSum = branchRevenues.filter(r => r.date.startsWith("2026")).reduce((acc, curr) => acc + curr.amountUsd, 0);
  const yearlyRevenueCombined = yearlyIncomeSum + yearlyRevenuesSum;

  const yearlyExpenseSum = yearlyExpenses.reduce((acc, curr) => acc + curr.amount, 0) +
                           yearlySalaries.reduce((acc, curr) => acc + curr.netSalary, 0);
  const yearlyProfitSum = yearlyRevenueCombined - yearlyExpenseSum;

  // 4. Expense break-down by category
  const expenseBreakdown = {
    utility: branchExpenses.filter(e => e.category === 'Water Bill' || e.category === 'Electricity Bill' || e.category === 'Internet').reduce((sum, e) => sum + e.amount, 0),
    supplies: branchExpenses.filter(e => e.category === 'Soap' || e.category === 'Fabric Softener' || e.category === 'Cleaning Supplies').reduce((sum, e) => sum + e.amount, 0),
    salaries: branchSalaries.filter(s => s.status === 'Paid').reduce((sum, s) => sum + s.netSalary, 0),
    rentTax: branchExpenses.filter(e => e.category === 'Land Rent' || e.category === 'Land Tax').reduce((sum, e) => sum + e.amount, 0),
    other: branchExpenses.filter(e => e.category === 'Gas' || e.category === 'Repair and Maintenance' || e.category === 'Staff Meal' || e.category === 'Marketing' || e.category === 'Other Expense').reduce((sum, e) => sum + e.amount, 0),
  };

  // 5. Payment Ratios Cash vs ABA vs Transfer
  const paymentsByMethod = {
    cash: branchIncomes.filter(i => i.paymentMethod === 'Cash').reduce((sum, i) => sum + i.totalAmount, 0),
    aba: branchIncomes.filter(i => i.paymentMethod === 'ABA' || i.paymentMethod === 'QR Payment').reduce((sum, i) => sum + i.totalAmount, 0),
    bank: branchIncomes.filter(i => i.paymentMethod === 'Bank Transfer').reduce((sum, i) => sum + i.totalAmount, 0)
  };
  const totalRatios = paymentsByMethod.cash + paymentsByMethod.aba + paymentsByMethod.bank || 1;

  // Alerts
  const lowStockItems = branchInventory.filter(item => item.remainingStock <= item.minimumStockAlert);
  const unpaidSalaries = branchSalaries.filter(s => s.status === 'Unpaid');

  // Chart data setup based on daily trends of June (June 1 - June 6)
  const dayLabels = ['06/01', '06/02', '06/03', '06/04', '06/05', '06/06'];
  const getIncomeByDay = (dayStr: string) => {
    return branchIncomes.filter(i => i.date === `2026-06-${dayStr}`).reduce((sum, i) => sum + i.totalAmount, 0);
  };
  const getExpenseByDay = (dayStr: string) => {
    return branchExpenses.filter(e => e.expenseDate === `2026-06-${dayStr}`).reduce((sum, e) => sum + e.amount, 0);
  };

  const chartData = [
    { label: 'Jun 1', income: getIncomeByDay('01') || 12, expense: getExpenseByDay('01') || 4 },
    { label: 'Jun 2', income: getIncomeByDay('02') || 8, expense: getExpenseByDay('02') || 6 },
    { label: 'Jun 3', income: getIncomeByDay('03') || 14, expense: getExpenseByDay('03') || 3 },
    { label: 'Jun 4', income: getIncomeByDay('04') || 25, expense: getExpenseByDay('04') || 15 },
    { label: 'Jun 5', income: getIncomeByDay('05') || 38, expense: getExpenseByDay('05') || 22 },
    { label: 'Jun 6', income: getIncomeByDay('06') || 48, expense: getExpenseByDay('06') || 10 },
  ];

  // Finding max for SVG scaling
  const maxVal = Math.max(...chartData.map(d => Math.max(d.income, d.expense)), 50) + 10;

  return (
    <div className="space-y-6" id="dashboard_view_module">
      {/* Notifications and Alerts container */}
      {(lowStockItems.length > 0 || unpaidSalaries.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStockItems.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start shadow-sm" id="low_stock_banner">
              <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-amber-800 text-sm">{t.lowStockAlert} ({lowStockItems.length})</h4>
                <p className="text-xs text-amber-600 mt-1">
                  {lowStockItems.map(i => `${i.itemName} (${i.remainingStock} ${i.unit})`).join(', ')}
                </p>
              </div>
            </div>
          )}
          
          {unpaidSalaries.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex gap-3 items-start shadow-sm" id="salary_payment_banner">
              <CalendarClock className="text-indigo-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-indigo-800 text-sm">{t.salaryReminder}</h4>
                <p className="text-xs text-indigo-600 mt-1">
                  Pending payouts for: {unpaidSalaries.map(s => `${s.staffName} (${s.salaryPeriod})`).join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Supply & Resource Diagnostic Center (Requested Cards Layout Grid) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
          📋 {lang === 'en' ? "Reserves & Supply Diagnostics" : "ការវិភាគគណនេយ្យនិងសម្ភារៈឃ្លាំង"}
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6">
          {/* 1. Total coin balance */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 hover:border-slate-300 transition-colors duration-200 overflow-hidden">
            <span className="text-xs text-slate-400 block font-medium">{lang === 'en' ? 'Total Coin Balance' : 'តុល្យភាពកាក់ក្នុងទូ'}</span>
            <span className="text-xl font-bold font-sans tracking-tight text-slate-800 block mt-1">
              {totalCoinBalance.toLocaleString()} Coins
            </span>
            <span className="text-[10px] text-slate-500 font-sans block mt-1">
              {formatDualCurrency(totalCoinBalance * 0.25, exchangeRate)}
            </span>
          </div>

          {/* 2. Daily revenue */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 hover:border-slate-300 transition-colors duration-200 overflow-hidden">
            <span className="text-xs text-slate-400 block font-medium">{lang === 'en' ? 'Daily Revenue' : 'ចំណូលប្រចាំថ្ងៃ'}</span>
            <span className="text-xl font-bold font-sans tracking-tight text-slate-800 block mt-1">
              {formatCurrency(dailyRevenueCombined, 'USD')}
            </span>
            <span className="text-[10px] text-slate-500 font-sans block mt-1">
              {formatCurrency(dailyRevenueCombined, 'KHR', exchangeRate)}
            </span>
          </div>

          {/* 3. Monthly revenue */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 hover:border-slate-300 transition-colors duration-200 overflow-hidden">
            <span className="text-xs text-slate-400 block font-medium">{lang === 'en' ? 'Monthly Revenue (June)' : 'ចំណូលប្រចាំខែមិថុនា'}</span>
            <span className="text-xl font-bold font-sans tracking-tight text-slate-800 block mt-1">
              {formatCurrency(monthlyRevenueCombined, 'USD')}
            </span>
            <span className="text-[10px] text-slate-500 font-sans block mt-1">
              {formatCurrency(monthlyRevenueCombined, 'KHR', exchangeRate)}
            </span>
          </div>

          {/* 4. Gas remaining */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 hover:border-slate-300 transition-colors duration-200 overflow-hidden">
            <span className="text-xs text-slate-400 block font-medium">{lang === 'en' ? 'Gas Remaining' : 'ហ្គាសនៅសល់'}</span>
            <span className={`text-xl font-bold font-sans tracking-tight block mt-1 ${gasRemaining <= 20 ? 'text-rose-600' : 'text-slate-800'}`}>
              {gasRemaining} Kg LPG
            </span>
            <span className="text-[10px] text-slate-500 font-sans block mt-1">
              {gasRemaining <= 20 ? '⚠️ Critical Warning' : '🟢 Safe Levels'}
            </span>
          </div>

          {/* 5a. Monthly Powder Usage */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 hover:border-slate-300 transition-colors duration-200 overflow-hidden">
            <span className="text-xs text-slate-400 block font-medium">
              {lang === 'en' ? 'Monthly Powder Usage' : 'ការប្រើប្រាស់សាប៊ូម៉្សៅប្រចាំខែ'}
            </span>
            <span className="text-xl font-bold font-sans tracking-tight text-slate-800 block mt-1">
              {monthlyPowderUsage} {lang === 'en' ? 'pcs' : 'កញ្ចប់'}
            </span>
            <span className="text-[10px] text-slate-500 font-sans block mt-1">
              {lang === 'en' ? '🧺 Royal powder lines' : '🧺 ប្រភេទទំនិញសាប៊ូបោកម្សៅ'}
            </span>
          </div>

          {/* 5b. Monthly Soap Usage */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 hover:border-slate-300 transition-colors duration-200 overflow-hidden">
            <span className="text-xs text-slate-400 block font-medium">
              {lang === 'en' ? 'Monthly Soap Usage' : 'ការប្រើប្រាស់សាប៊ូទឹកប្រចាំខែ'}
            </span>
            <span className="text-xl font-bold font-sans tracking-tight text-slate-800 block mt-1">
              {monthlySoapUsage} {lang === 'en' ? 'pcs' : 'កញ្ចប់'}
            </span>
            <span className="text-[10px] text-slate-500 font-sans block mt-1">
              {lang === 'en' ? '💧 Eco-liquid detergent active' : '💧 សាប៊ូបោកទឹកកំហាប់ខ្លាំង-បាញ់ម៉ាស៊ីន'}
            </span>
          </div>

          {/* 5c. Monthly Cleaner Usage */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 hover:border-slate-300 transition-colors duration-200 overflow-hidden">
            <span className="text-xs text-slate-400 block font-medium">
              {lang === 'en' ? 'Monthly Cleaner Usage' : 'ការប្រើប្រាស់ទឹកជូតសម្អាតប្រចាំខែ'}
            </span>
            <span className="text-xl font-bold font-sans tracking-tight text-slate-800 block mt-1">
              {monthlyCleanerUsage} {lang === 'en' ? 'pcs' : 'កញ្ចប់'}
            </span>
            <span className="text-[10px] text-slate-500 font-sans block mt-1">
              {lang === 'en' ? '🧼 Multi-surface disinfectant' : '🧼 ជូតកញ្ចក់និងកម្រាលឥដ្ឋ'}
            </span>
          </div>

          {/* 5d. Total Soap Usage */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 hover:border-slate-300 transition-colors duration-200 overflow-hidden">
            <span className="text-xs text-slate-400 block font-bold">
              {lang === 'en' ? 'Total Soap & Cleaner Usage' : 'ការប្រើប្រាស់សាប៊ូសរុប'}
            </span>
            <span className="text-xl font-bold font-sans tracking-tight text-slate-800 block mt-1">
              {monthlyTotalDetergentUsage} {lang === 'en' ? 'pcs' : 'កញ្ចប់'}
            </span>
            <span className="text-[10px] text-slate-500 font-sans block mt-1">
              {lang === 'en' ? '✨ Combined Daily Sheet total' : '✨ សរុបម្សៅ + ទឹក + ទឹកជូតសម្អាត'}
            </span>
          </div>

          {/* 6a. Monthly Softener Refills */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 hover:border-slate-300 transition-colors duration-200 overflow-hidden">
            <span className="text-xs text-slate-400 block font-medium">
              {lang === 'en' ? 'Monthly Softener Refills' : 'នាំចូលទឹកក្រអូបប្រចាំខែ'}
            </span>
            <span className="text-xl font-bold font-sans tracking-tight text-slate-800 block mt-1">
              {monthlySoftenerIn} {lang === 'en' ? 'pcs' : 'កញ្ចប់'}
            </span>
            <span className="text-[10px] text-slate-500 font-sans block mt-1">
              {lang === 'en' ? '💧 Softener refill count' : '💧 នាំចូលបន្ថែមក្នុងធុងស្តុក'}
            </span>
          </div>

          {/* 6b. Total Softener Usage */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 hover:border-slate-300 transition-colors duration-200 overflow-hidden">
            <span className="text-xs text-slate-400 block font-bold">
              {lang === 'en' ? 'Total Softener Usage' : 'ការប្រើប្រាស់ទឹកក្រអូបសរុប'}
            </span>
            <span className="text-xl font-bold font-sans tracking-tight text-slate-800 block mt-1">
              {monthlySoftenerOut} {lang === 'en' ? 'pcs' : 'កញ្ចប់'}
            </span>
            <span className="text-[10px] text-slate-500 font-sans block mt-1">
              {lang === 'en' ? '✨ Mixed brands consumption' : '✨ សរុបប្រើប្រាស់ចម្រុះម៉ូដ'}
            </span>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-4.5 hover:border-slate-300 transition-colors duration-200 overflow-hidden">
            <span className="text-xs text-slate-400 block font-medium">{lang === 'en' ? 'Low Stock Alerts' : 'ទំនិញជិតអស់ឃ្លាំង'}</span>
            <span className={`text-xl font-bold font-sans tracking-tight block mt-1 ${lowStockCount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
              {lowStockCount} items
            </span>
            <span className="text-[10px] text-slate-500 font-sans block mt-1">
              {lowStockCount > 0 ? '⚠️ Action Required' : '🟢 Fully Re-stocked'}
            </span>
          </div>

          {/* 8. Profit by branch */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 hover:border-slate-300 transition-colors duration-200 overflow-hidden col-span-2 md:col-span-1">
            <span className="text-xs text-slate-400 block font-medium">{lang === 'en' ? 'Profit by Branch' : 'ប្រាក់ចំណេញតាមសាខា'}</span>
            <div className="mt-1.5 space-y-1 text-[10px] font-semibold text-slate-650">
              {profitByBranchList.map((pb, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span>{pb.branchName}:</span>
                  <span className={pb.profit >= 0 ? "text-emerald-650" : "text-rose-600"}>
                    {formatCurrency(pb.profit, 'USD')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid 1: Today Stats */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
          ⚡ {lang === 'en' ? "Today Insights (June 6, 2026)" : "ការយល់ដឹងថ្ងៃនេះ (ថ្ងៃទី ០៦ ខែមិថុនា ឆ្នាំ ២០២៦)"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center justify-between hover:scale-[1.01] transition-transform duration-200" id="card_today_income">
            <div>
              <span className="text-xs text-slate-400 block font-medium">{t.todayIncome}</span>
              <span className="text-xl font-bold font-mono tracking-tight text-slate-800 block mt-1">
                {formatCurrency(todayIncomeSum, 'USD')}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {formatCurrency(todayIncomeSum, 'KHR', exchangeRate)}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-sm">
              <TrendingUp size={22} />
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center justify-between hover:scale-[1.01] transition-transform duration-200" id="card_today_expense">
            <div>
              <span className="text-xs text-slate-400 block font-medium">{t.todayExpense}</span>
              <span className="text-xl font-bold font-mono tracking-tight text-slate-800 block mt-1">
                {formatCurrency(todayExpenseSum, 'USD')}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {formatCurrency(todayExpenseSum, 'KHR', exchangeRate)}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 shadow-sm">
              <TrendingDown size={22} />
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center justify-between hover:scale-[1.01] transition-transform duration-200" id="card_today_profit">
            <div>
              <span className="text-xs text-slate-400 block font-medium">{t.todayProfit}</span>
              <span className={`text-xl font-bold font-mono tracking-tight block mt-1 ${todayProfitSum >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {formatCurrency(todayProfitSum, 'USD')}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {formatCurrency(todayProfitSum, 'KHR', exchangeRate)}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${todayProfitSum >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <DollarSign size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Summary card */}
        <div className="bg-white border border-slate-100 rounded-xl p-4.5 overflow-hidden" id="card_monthly_card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100/60 mb-4">
            <h4 className="font-bold text-slate-800 text-sm">🗓️ {t.monthlyProfit} (June 2026)</h4>
            <span className="px-2 py-0.5 text-[9px] font-bold rounded-lg bg-emerald-50 text-emerald-700 uppercase tracking-wider">
              {lang === 'en' ? "Active Cycle" : "វដ្តសកម្ម"}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-100/50">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">{t.monthlyIncome}</span>
              <span className="text-sm font-semibold text-slate-800 mt-1 block font-sans">{formatCurrency(monthlyIncomeSum, 'USD')}</span>
              <span className="text-[8.5px] text-slate-500 block font-sans">{formatCurrency(monthlyIncomeSum, 'KHR', exchangeRate)}</span>
            </div>
            
            <div className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-100/50">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">{t.monthlyExpense}</span>
              <span className="text-sm font-semibold text-slate-800 mt-1 block font-sans">{formatCurrency(monthlyExpenseSum, 'USD')}</span>
              <span className="text-[8.5px] text-slate-500 block font-sans">{formatCurrency(monthlyExpenseSum, 'KHR', exchangeRate)}</span>
            </div>

            <div className="p-2.5 bg-emerald-50/30 border border-emerald-100/50 rounded-xl">
              <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-700 block">{t.monthlyProfit}</span>
              <span className="text-sm font-bold text-emerald-800 mt-1 block font-sans">{formatCurrency(monthlyProfitSum, 'USD')}</span>
              <span className="text-[8.5px] text-emerald-600 block font-sans">{formatCurrency(monthlyProfitSum, 'KHR', exchangeRate)}</span>
            </div>
          </div>
        </div>

        {/* Yearly Summary Card */}
        <div className="bg-white border border-slate-100 rounded-xl p-4.5 overflow-hidden" id="card_yearly_card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100/60 mb-4">
            <h4 className="font-bold text-slate-800 text-sm">🌐 {t.yearlyProfit} (2026)</h4>
            <span className="px-2 py-0.5 text-[9px] font-bold rounded-lg bg-slate-50 text-slate-500 uppercase tracking-widest border border-slate-200/50">YTD</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-100/50">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">{t.yearlyIncome}</span>
              <span className="text-sm font-semibold text-slate-800 mt-1 block font-sans">{formatCurrency(yearlyIncomeSum, 'USD')}</span>
              <span className="text-[8.5px] text-slate-500 block font-sans">{formatCurrency(yearlyIncomeSum, 'KHR', exchangeRate)}</span>
            </div>
            
            <div className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-100/50">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">{t.yearlyExpense}</span>
              <span className="text-sm font-semibold text-slate-800 mt-1 block font-sans">{formatCurrency(yearlyExpenseSum, 'USD')}</span>
              <span className="text-[8.5px] text-slate-500 block font-sans">{formatCurrency(yearlyExpenseSum, 'KHR', exchangeRate)}</span>
            </div>

            <div className="p-2.5 bg-emerald-50/30 border border-emerald-100/50 rounded-xl">
              <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-700 block">{t.yearlyProfit}</span>
              <span className="text-sm font-bold text-emerald-800 mt-1 block font-sans">{formatCurrency(yearlyProfitSum, 'USD')}</span>
              <span className="text-[8.5px] text-emerald-600 block font-sans">{formatCurrency(yearlyProfitSum, 'KHR', exchangeRate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Dynamic Area SVG Chart */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 xl:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{t.profitRange}</h4>
              <span className="text-[11px] text-slate-400 font-medium">Daily trends of Income vs Operations costs (USD)</span>
            </div>
            <div className="flex gap-4 text-[10px] font-bold">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-emerald-500"></span> {t.income}</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-slate-350"></span> {t.expense}</div>
            </div>
          </div>
          
          {/* Handdrawn precise SVG chart component */}
          <div className="relative mt-2" id="svg_report_chart">
            <svg viewBox="0 0 600 240" className="w-full h-auto">
              {/* Grid Background lines */}
              <line x1="40" y1="20" x2="580" y2="20" stroke="#f8fafc" strokeWidth="0.75" />
              <line x1="40" y1="70" x2="580" y2="70" stroke="#f8fafc" strokeWidth="0.75" />
              <line x1="40" y1="120" x2="580" y2="120" stroke="#f8fafc" strokeWidth="0.75" />
              <line x1="40" y1="170" x2="580" y2="170" stroke="#f8fafc" strokeWidth="0.75" />
              <line x1="40" y1="220" x2="580" y2="220" stroke="#e2e8f0" strokeWidth="1.25" />

              {/* Y Axis text labels */}
              <text x="5" y="24" fontSize="10" className="fill-slate-400 font-mono">${Math.round(maxVal)}</text>
              <text x="5" y="124" fontSize="10" className="fill-slate-400 font-mono">${Math.round(maxVal / 2)}</text>
              <text x="15" y="224" fontSize="10" className="fill-slate-400 font-mono">$0</text>

              {/* Day Coordinates math maps mapping */}
              {/* Path generation for Income */}
              <path
                d={`M 70,${220 - (chartData[0].income / maxVal * 190)} 
                   L 170,${220 - (chartData[1].income / maxVal * 190)} 
                   L 270,${220 - (chartData[2].income / maxVal * 190)} 
                   L 370,${220 - (chartData[3].income / maxVal * 190)} 
                   L 470,${220 - (chartData[4].income / maxVal * 190)} 
                   L 570,${220 - (chartData[5].income / maxVal * 190)}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Path generation for Expense */}
              <path
                d={`M 70,${220 - (chartData[0].expense / maxVal * 190)} 
                   L 170,${220 - (chartData[1].expense / maxVal * 190)} 
                   L 270,${220 - (chartData[2].expense / maxVal * 190)} 
                   L 370,${220 - (chartData[3].expense / maxVal * 190)} 
                   L 470,${220 - (chartData[4].expense / maxVal * 190)} 
                   L 570,${220 - (chartData[5].expense / maxVal * 190)}`}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="3 3"
              />

              {/* Interactive Dot Markers */}
              {chartData.map((d, i) => {
                const cx = 70 + i * 100;
                const cyInc = 220 - (d.income / maxVal * 190);
                const cyExp = 220 - (d.expense / maxVal * 190);
                return (
                  <g key={i}>
                    {/* Income dot */}
                    <circle cx={cx} cy={cyInc} r="4.5" className="fill-emerald-500 stroke-white" strokeWidth="1.5" />
                    {/* Expense dot */}
                    <circle cx={cx} cy={cyExp} r="3.5" className="fill-slate-400 stroke-white" strokeWidth="1" />
                    {/* Tick Label */}
                    <text x={cx - 15} y="238" fontSize="10" className="fill-slate-400 font-medium font-sans">{d.label}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Expense Category Distributions widget */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 overflow-hidden" id="expense_distribution_widget">
          <h4 className="font-bold text-slate-800 text-sm mb-4">💰 {lang === 'en' ? "Opex Resource Breakdown" : "ការចែកលម្អិតចំណាយប្រតិបត្តិការ"}</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Zap size={13} className="text-amber-500" />
                  {t.utilityExpense}
                </span>
                <span className="font-bold tracking-tight text-slate-800">{formatCurrency(expenseBreakdown.utility, 'USD')}</span>
              </div>
              <div className="w-full bg-slate-100/70 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-450 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (expenseBreakdown.utility / (monthlyExpenseSum || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Droplet size={13} className="text-blue-500" />
                  {t.supplyExpense}
                </span>
                <span className="font-bold tracking-tight text-slate-800">{formatCurrency(expenseBreakdown.supplies, 'USD')}</span>
              </div>
              <div className="w-full bg-slate-100/70 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (expenseBreakdown.supplies / (monthlyExpenseSum || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <DollarSign size={13} className="text-emerald-550" />
                  {t.salaryExpense}
                </span>
                <span className="font-bold tracking-tight text-slate-800">{formatCurrency(expenseBreakdown.salaries, 'USD')}</span>
              </div>
              <div className="w-full bg-slate-100/70 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (expenseBreakdown.salaries / (monthlyExpenseSum || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Building size={13} className="text-indigo-500" />
                  Land Rent / Rent
                </span>
                <span className="font-bold tracking-tight text-slate-800">{formatCurrency(expenseBreakdown.rentTax, 'USD')}</span>
              </div>
              <div className="w-full bg-slate-100/70 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (expenseBreakdown.rentTax / (monthlyExpenseSum || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between" id="payment_ratio_subpanel">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">ABA / Cash Split</span>
                <span className="text-xs text-slate-650 block mt-0.5">
                  ABA/Transfer: <strong>{Math.round((paymentsByMethod.aba / totalRatios) * 100)}%</strong> | Cash: <strong>{Math.round((paymentsByMethod.cash / totalRatios) * 100)}%</strong>
                </span>
              </div>
              <div className="w-8.5 h-8.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100 flex items-center justify-center font-bold text-xs">
                <Percent size={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
