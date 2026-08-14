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
  Boxes,
  PlusCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle
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
import { formatCurrency } from '../utils';

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

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      
      {/* 1. TOP STAT CARDS ROW (4 COLUMNS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* TODAY'S REVENUE */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-[#E7EEFF] flex items-center justify-center text-[#003D9B]">
              <DollarSign size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4B5563]">
              TODAY'S REVENUE
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#003D9B] tracking-tight">4,200,000៛</h3>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-[#4B5563] font-medium">vs Yesterday</span>
            <span className="bg-[#D1FAE5] text-[#065F46] px-2 py-0.5 rounded-lg font-bold flex items-center gap-0.5">
              ▲ +12.5%
            </span>
          </div>
        </div>

        {/* MONTHLY NET PROFIT */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-[#D1FAE5] flex items-center justify-center text-[#065F46]">
              <TrendingUp size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4B5563]">
              MONTHLY NET PROFIT
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#065F46] tracking-tight">12,450,000៛</h3>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-[#4B5563] font-medium">vs Last Month</span>
            <span className="bg-[#D1FAE5] text-[#065F46] px-2 py-0.5 rounded-lg font-bold flex items-center gap-0.5">
              ▲ +8.2%
            </span>
          </div>
        </div>

        {/* ACTIVE STAFF */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Users size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4B5563]">
              ACTIVE STAFF
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#111827] tracking-tight">28</h3>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-[#4B5563] font-medium">Across 6 Branches</span>
            <span className="bg-blue-50 text-[#0052CC] px-2 py-0.5 rounded-lg font-bold">
              On Duty: 18
            </span>
          </div>
        </div>

        {/* COIN VAULT BALANCE */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-[#92400E]">
              <Coins size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4B5563]">
              COIN VAULT BALANCE
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#92400E] tracking-tight">1,250,000៛</h3>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-[#4B5563] font-medium">Coins: 125,000</span>
            <span className="bg-[#D1FAE5] text-[#065F46] px-2 py-0.5 rounded-lg font-bold flex items-center gap-1">
              <ShieldCheck size={12} /> Vault Safe
            </span>
          </div>
        </div>

      </div>

      {/* 2. MIDDLE MAIN SECTION (LEFT 2/3 + RIGHT 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: TODAY'S OPERATIONS SUMMARY TABLE */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider">
                TODAY'S OPERATIONS SUMMARY
              </h3>
              <button type="button" className="text-xs font-bold text-[#0052CC] hover:underline flex items-center gap-1 cursor-pointer">
                View all branches <ArrowRight size={13} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-extrabold text-[#4B5563] uppercase tracking-wider">
                    <th className="pb-3 pr-2">BRANCH</th>
                    <th className="pb-3 px-2 text-center">ORDERS (PCS)</th>
                    <th className="pb-3 px-2 text-center">WASH</th>
                    <th className="pb-3 px-2 text-center">DRY</th>
                    <th className="pb-3 px-2 text-right">REVENUE</th>
                    <th className="pb-3 px-2 text-right">EXPENSES</th>
                    <th className="pb-3 px-2 text-right">NET PROFIT</th>
                    <th className="pb-3 pl-2 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[#111827] font-medium">
                  <tr>
                    <td className="py-3.5 pr-2 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      Chamkar Doung 2 (Head Office)
                    </td>
                    <td className="py-3.5 px-2 text-center">156</td>
                    <td className="py-3.5 px-2 text-center">98</td>
                    <td className="py-3.5 px-2 text-center">58</td>
                    <td className="py-3.5 px-2 text-right">2,350,000៛</td>
                    <td className="py-3.5 px-2 text-right">1,450,000៛</td>
                    <td className="py-3.5 px-2 text-right font-extrabold text-[#065F46]">900,000៛</td>
                    <td className="py-3.5 pl-2 text-center">
                      <span className="bg-[#D1FAE5] text-[#065F46] px-2.5 py-0.5 rounded-full text-[10px] font-bold">Open</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 pr-2 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Tuol Kork Branch
                    </td>
                    <td className="py-3.5 px-2 text-center">98</td>
                    <td className="py-3.5 px-2 text-center">61</td>
                    <td className="py-3.5 px-2 text-center">37</td>
                    <td className="py-3.5 px-2 text-right">1,420,000៛</td>
                    <td className="py-3.5 px-2 text-right">870,000៛</td>
                    <td className="py-3.5 px-2 text-right font-extrabold text-[#065F46]">550,000៛</td>
                    <td className="py-3.5 pl-2 text-center">
                      <span className="bg-[#D1FAE5] text-[#065F46] px-2.5 py-0.5 rounded-full text-[10px] font-bold">Open</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 pr-2 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Boeung Tumpun Branch
                    </td>
                    <td className="py-3.5 px-2 text-center">76</td>
                    <td className="py-3.5 px-2 text-center">44</td>
                    <td className="py-3.5 px-2 text-center">32</td>
                    <td className="py-3.5 px-2 text-right">980,000៛</td>
                    <td className="py-3.5 px-2 text-right">620,000៛</td>
                    <td className="py-3.5 px-2 text-right font-extrabold text-[#065F46]">360,000៛</td>
                    <td className="py-3.5 pl-2 text-center">
                      <span className="bg-[#D1FAE5] text-[#065F46] px-2.5 py-0.5 rounded-full text-[10px] font-bold">Open</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 pr-2 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Mean Chey Branch
                    </td>
                    <td className="py-3.5 px-2 text-center">52</td>
                    <td className="py-3.5 px-2 text-center">29</td>
                    <td className="py-3.5 px-2 text-center">23</td>
                    <td className="py-3.5 px-2 text-right">730,000៛</td>
                    <td className="py-3.5 px-2 text-right">420,000៛</td>
                    <td className="py-3.5 px-2 text-right font-extrabold text-[#065F46]">310,000៛</td>
                    <td className="py-3.5 pl-2 text-center">
                      <span className="bg-[#D1FAE5] text-[#065F46] px-2.5 py-0.5 rounded-full text-[10px] font-bold">Open</span>
                    </td>
                  </tr>

                  <tr className="bg-slate-50/80 font-black border-t-2 border-slate-200">
                    <td className="py-3.5 pr-2 text-[#0052CC]">Total (6 Branches)</td>
                    <td className="py-3.5 px-2 text-center">382</td>
                    <td className="py-3.5 px-2 text-center">232</td>
                    <td className="py-3.5 px-2 text-center">150</td>
                    <td className="py-3.5 px-2 text-right">5,480,000៛</td>
                    <td className="py-3.5 px-2 text-right">3,360,000៛</td>
                    <td className="py-3.5 px-2 text-right text-[#065F46]">2,120,000៛</td>
                    <td className="py-3.5 pl-2 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          {/* BOTTOM LEFT: BRANCH PERFORMANCE (THIS MONTH) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider">
                BRANCH PERFORMANCE <span className="text-[#4B5563] font-medium">(THIS MONTH)</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-extrabold text-[#4B5563] uppercase tracking-wider">
                    <th className="pb-3 pr-2">BRANCH</th>
                    <th className="pb-3 px-2 text-right">REVENUE</th>
                    <th className="pb-3 px-2 text-right">EXPENSES</th>
                    <th className="pb-3 px-2 text-right">NET PROFIT</th>
                    <th className="pb-3 px-2 text-right">MARGIN</th>
                    <th className="pb-3 pl-2 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[#111827] font-medium">
                  <tr>
                    <td className="py-3 pr-2 font-bold">Chamkar Doung 2 (Head Office)</td>
                    <td className="py-3 px-2 text-right">52,600,000៛</td>
                    <td className="py-3 px-2 text-right">31,800,000៛</td>
                    <td className="py-3 px-2 text-right font-bold text-[#065F46]">20,800,000៛</td>
                    <td className="py-3 px-2 text-right font-semibold">39.5%</td>
                    <td className="py-3 pl-2 text-center"><span className="bg-[#D1FAE5] text-[#065F46] px-2 py-0.5 rounded-full text-[10px] font-bold">Active</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-2 font-bold">Tuol Kork Branch</td>
                    <td className="py-3 px-2 text-right">28,450,000៛</td>
                    <td className="py-3 px-2 text-right">17,900,000៛</td>
                    <td className="py-3 px-2 text-right font-bold text-[#065F46]">10,550,000៛</td>
                    <td className="py-3 px-2 text-right font-semibold">37.1%</td>
                    <td className="py-3 pl-2 text-center"><span className="bg-[#D1FAE5] text-[#065F46] px-2 py-0.5 rounded-full text-[10px] font-bold">Active</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-2 font-bold">Boeung Tumpun Branch</td>
                    <td className="py-3 px-2 text-right">22,130,000៛</td>
                    <td className="py-3 px-2 text-right">13,600,000៛</td>
                    <td className="py-3 px-2 text-right font-bold text-[#065F46]">8,530,000៛</td>
                    <td className="py-3 px-2 text-right font-semibold">38.6%</td>
                    <td className="py-3 pl-2 text-center"><span className="bg-[#D1FAE5] text-[#065F46] px-2 py-0.5 rounded-full text-[10px] font-bold">Active</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-2 font-bold">Mean Chey Branch</td>
                    <td className="py-3 px-2 text-right">16,780,000៛</td>
                    <td className="py-3 px-2 text-right">10,200,000៛</td>
                    <td className="py-3 px-2 text-right font-bold text-[#065F46]">6,580,000៛</td>
                    <td className="py-3 px-2 text-right font-semibold">39.2%</td>
                    <td className="py-3 pl-2 text-center"><span className="bg-[#D1FAE5] text-[#065F46] px-2 py-0.5 rounded-full text-[10px] font-bold">Active</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button type="button" className="font-bold text-[#0052CC] hover:underline flex items-center gap-1 cursor-pointer">
                View full performance report <ArrowRight size={13} />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: QUICK ACTIONS, STOCK ALERTS, RECENT ACTIVITY, MACHINE STATUS */}
        <div className="space-y-6">
          
          {/* QUICK ACTIONS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider mb-3">
              QUICK ACTIONS
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button type="button" className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 rounded-xl flex flex-col items-center justify-center text-center group cursor-pointer transition-all">
                <PlusCircle size={20} className="text-[#0052CC] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#111827]">Create Laundry Bill</span>
              </button>
              <button type="button" className="p-3 bg-slate-50 hover:bg-rose-50/60 border border-slate-200/60 rounded-xl flex flex-col items-center justify-center text-center group cursor-pointer transition-all">
                <CreditCard size={20} className="text-[#991B1B] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#111827]">Record Expense</span>
              </button>
              <button type="button" className="p-3 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/60 rounded-xl flex flex-col items-center justify-center text-center group cursor-pointer transition-all">
                <Droplets size={20} className="text-[#065F46] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#111827]">Add Soap Stock</span>
              </button>
              <button type="button" className="p-3 bg-slate-50 hover:bg-purple-50/60 border border-slate-200/60 rounded-xl flex flex-col items-center justify-center text-center group cursor-pointer transition-all">
                <Users size={20} className="text-purple-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#111827]">Staff Attendance</span>
              </button>
              <button type="button" className="p-3 bg-slate-50 hover:bg-amber-50/60 border border-slate-200/60 rounded-xl flex flex-col items-center justify-center text-center group cursor-pointer transition-all">
                <Coins size={20} className="text-[#92400E] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#111827]">Transfer Coins</span>
              </button>
              <button type="button" className="p-3 bg-slate-50 hover:bg-teal-50/60 border border-slate-200/60 rounded-xl flex flex-col items-center justify-center text-center group cursor-pointer transition-all">
                <FileText size={20} className="text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#111827]">Daily Report</span>
              </button>
            </div>
          </div>

          {/* STOCK ALERTS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider mb-3">
              STOCK ALERTS
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-rose-50/60 border border-rose-200/60 rounded-xl">
                <span className="font-bold text-[#111827] flex items-center gap-2">
                  <Droplet size={14} className="text-[#991B1B]" /> Liquid Detergent
                </span>
                <span className="bg-rose-100 text-[#991B1B] px-2 py-0.5 rounded-md font-black text-[11px]">12 L</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-amber-50/60 border border-amber-200/60 rounded-xl">
                <span className="font-bold text-[#111827] flex items-center gap-2">
                  <Sparkles size={14} className="text-[#92400E]" /> Softener
                </span>
                <span className="bg-amber-100 text-[#92400E] px-2 py-0.5 rounded-md font-black text-[11px]">8 L</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-emerald-50/40 border border-emerald-100 rounded-xl">
                <span className="font-semibold text-[#111827] flex items-center gap-2">
                  <Package size={14} className="text-[#065F46]" /> Bleach
                </span>
                <span className="text-[#065F46] font-bold text-[11px]">OK</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-emerald-50/40 border border-emerald-100 rounded-xl">
                <span className="font-semibold text-[#111827] flex items-center gap-2">
                  <Boxes size={14} className="text-[#065F46]" /> Dryer Sheet
                </span>
                <span className="text-[#065F46] font-bold text-[11px]">OK</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
              <button type="button" className="text-xs font-bold text-[#0052CC] hover:underline flex items-center gap-1 cursor-pointer">
                View all inventory <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* MACHINE STATUS DONUT CHART */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider mb-3">
              MACHINE STATUS <span className="text-[#4B5563] font-medium">(ALL BRANCHES)</span>
            </h3>
            
            <div className="flex items-center justify-between">
              {/* Donut graphic representation */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path strokeDasharray="61.8, 100" className="text-emerald-500 stroke-current" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path strokeDasharray="30.9, 100" strokeDashoffset="-61.8" className="text-blue-500 stroke-current" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path strokeDasharray="4.4, 100" strokeDashoffset="-92.7" className="text-amber-500 stroke-current" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path strokeDasharray="2.9, 100" strokeDashoffset="-97.1" className="text-rose-500 stroke-current" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-[#111827]">68</span>
                  <span className="text-[8px] text-[#4B5563] font-bold uppercase">Total</span>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="space-y-1.5 text-[11px] font-medium flex-1 pl-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Running</span>
                  <span className="font-bold">42 (61.8%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Available</span>
                  <span className="font-bold">21 (30.9%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Maintenance</span>
                  <span className="font-bold">3 (4.4%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Down</span>
                  <span className="font-bold">2 (2.9%)</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
              <button type="button" className="text-xs font-bold text-[#0052CC] hover:underline flex items-center gap-1 cursor-pointer">
                View machine details <ArrowRight size={13} />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
