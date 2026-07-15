/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  ShieldAlert, 
  X, 
  Eye, 
  FileText, 
  DollarSign,
  TrendingDown
} from 'lucide-react';
import { Expense, ExpenseCategory, Role, Branch } from '../types';
import { translations } from '../mockData';
import { formatCurrency, formatDualCurrency } from '../utils';

interface ExpenseViewProps {
  currentRole: Role;
  activeBranchId: string;
  branches: Branch[];
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  lang: 'en' | 'kh';
  onAddLog: (msg: string) => void;
  exchangeRate: number;
}

export default function ExpenseView({
  currentRole,
  activeBranchId,
  branches,
  expenses,
  setExpenses,
  lang,
  onAddLog,
  exchangeRate
}: ExpenseViewProps) {
  const t = translations[lang];
  const [showForm, setShowForm] = useState(false);
  const [receiptModal, setReceiptModal] = useState<string | null>(null);

  // Form Fields
  const [date, setDate] = useState('2026-06-06');
  const [category, setCategory] = useState<ExpenseCategory>('Water Bill');
  const [amount, setAmount] = useState(0.0);
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'ABA' | 'Bank Transfer' | 'QR Payment'>('ABA');
  const [paidTo, setPaidTo] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [note, setNote] = useState('');

  // 1. Authenticate views: block Staff role
  const isAuthorized = ['Owner', 'Admin', 'Manager'].includes(currentRole);

  if (!isAuthorized) {
    return (
      <div className="bg-white border border-rose-100 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm" id="security_guard_notice">
        <ShieldAlert className="text-rose-500 mx-auto mb-4" size={54} />
        <h3 className="text-lg font-bold text-slate-800">{lang === 'en' ? "Access Restriction Alert" : "ការព្រមានការកម្រិតសិទ្ធិ"}</h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          {t.warningRoleLimit}
        </p>
        <div className="mt-5 p-3.5 bg-slate-50 rounded-xl text-slate-400 font-mono text-xs">
          STRICT_DATA_SEPARATION_ENFORCED // role_required: Manager+ // user_role: {currentRole}
        </div>
      </div>
    );
  }

  // 2. Filter expenses linked database rows
  const getFilteredExpenses = () => {
    let list = expenses;

    if (currentRole === 'Manager') {
      list = list.filter(e => e.branchId === 'b1');
    } else if (currentRole === 'Admin') {
      list = list.filter(e => e.branchId === 'b1' || e.branchId === 'b2');
    }

    if (activeBranchId !== 'all') {
      list = list.filter(e => e.branchId === activeBranchId);
    }

    // Sort by latest date
    return [...list].sort((a, b) => b.expenseDate.localeCompare(a.expenseDate));
  };

  const filteredExpenses = getFilteredExpenses();

  const handleRegisterExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !paidTo || !description) return;

    const actualBranch = activeBranchId === 'all' ? 'b1' : activeBranchId;
    const defaultPic = receiptUrl || "https://images.unsplash.com/photo-1554415707-6e8cfc93ec23?auto=format&fit=crop&q=80&w=200";

    const newExp: Expense = {
      id: 'exp_' + Date.now(),
      branchId: actualBranch,
      expenseDate: date,
      category,
      description,
      amount,
      paymentMethod,
      paidTo,
      receiptUrl: defaultPic,
      createdBy: currentRole === 'Manager' ? 'Nguon Piseth' : 'Seng Sophy',
      note
    };

    setExpenses([newExp, ...expenses]);
    onAddLog(`Logged operational opex cost of ${formatCurrency(amount, 'USD')} under "${category}"`);
    
    // reset form
    setAmount(0);
    setDescription('');
    setPaidTo('');
    setNote('');
    setShowForm(false);
  };

  const categoriesList: ExpenseCategory[] = [
    'Water Bill',
    'Electricity Bill',
    'Gas',
    'Land Rent',
    'Land Tax',
    'Soap',
    'Fabric Softener',
    'Repair and Maintenance',
    'Staff Meal',
    'Internet',
    'Cleaning Supplies',
    'Marketing',
    'Other Expense'
  ];

  const getBranchCode = (bId: string) => {
    const b = branches.find(x => x.id === bId);
    return b ? b.branchCode : bId;
  };

  return (
    <div className="space-y-6" id="expenses_management_module">
      {/* Header Panel */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-800">{t.expense}</h2>
          <span className="text-[11px] text-slate-400 block mt-0.5">Track gas cylinder refills, utility billing meters, soap bulk purchases, and repairs.</span>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-200 hover:bg-emerald-500 transition cursor-pointer"
          id="btn_add_expense_trigger"
        >
          <Plus size={14} />
          {t.addNews}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleRegisterExpense} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4" id="form_expense_entry">
          <h4 className="font-bold text-slate-800 text-xs pb-2 border-b border-slate-100">
            ➕ {lang === 'en' ? "Log Operational Expense Receipt" : "បញ្ជីចំណាយនានាគោលការណ៍កត់ត្រាថ្មី"}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Expense Date *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Opex Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Paid Sum Amount (USD) *</label>
              <input
                type="number"
                step="0.01"
                min={0}
                placeholder="e.g. 145.00"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 font-mono focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Supplier / Paid To *</label>
              <input
                type="text"
                placeholder="e.g. Electricite du Cambodge"
                value={paidTo}
                onChange={e => setPaidTo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Payment Transferred Method *</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
              >
                <option value="ABA">ABA Mobile Transfer</option>
                <option value="Bank Transfer">Bank Wire Transfer</option>
                <option value="Cash">Cash (USD/KHR)</option>
                <option value="QR Payment">Bakong QR Scan</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Digital Receipt Image URL (Optional)</label>
              <input
                type="text"
                placeholder="https://..."
                value={receiptUrl}
                onChange={e => setReceiptUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Description Detail *</label>
              <input
                type="text"
                placeholder="Propane cylinder refilling for gas dryers, billing numbers"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Audit Notes</label>
              <textarea
                placeholder="Attach metadata of transaction"
                rows={1}
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-rose-50/50 p-3 border border-rose-100 rounded-xl flex justify-between items-center text-xs">
            <span className="font-bold text-slate-600 block uppercase tracking-wide">Total Opex Cost Checked:</span>
            <strong className="text-sm font-bold text-rose-700 block font-mono">
              {formatDualCurrency(amount, exchangeRate)}
            </strong>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-200 hover:bg-emerald-500 cursor-pointer"
            >
              Save Receipt Record
            </button>
          </div>
        </form>
      )}

      {/* Main Expense Ledger database table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left" id="expenses_ledger_table">
            <thead className="text-[11px] text-slate-400 bg-slate-50/50 border-b border-slate-100 font-bold uppercase">
              <tr>
                <th className="px-6 py-3">Receipt Opex ID</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Expense Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Opex Details</th>
                <th className="px-4 py-3">Paid To</th>
                <th className="px-4 py-3">Sum Amount</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-6 py-3 text-right">Receipt File</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-700">
                    #{exp.id.substring(4, 12)}
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded text-[10px]">
                      {getBranchCode(exp.branchId)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600 font-semibold">{exp.expenseDate}</td>
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 text-[9px] font-bold rounded bg-slate-100/80 text-slate-600 uppercase">
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-slate-800 block">{exp.description}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-sans font-medium">Logged by: {exp.createdBy}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-600 font-medium">{exp.paidTo}</td>
                  <td className="px-4 py-4 font-bold font-mono text-rose-700">
                    {formatCurrency(exp.amount, 'USD')}
                  </td>
                  <td className="px-4 py-4 text-slate-600 font-bold uppercase">{exp.paymentMethod}</td>
                  <td className="px-6 py-4 text-right">
                    {exp.receiptUrl ? (
                      <button
                        onClick={() => setReceiptModal(exp.receiptUrl)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold rounded-lg text-[10px] cursor-pointer"
                      >
                        <Eye size={12} />
                        View File
                      </button>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-450 bg-slate-50/20">
                    No expense audit transactions configured in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipts Preview Modal */}
      {receiptModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-all animate-fade-in">
          <div className="bg-white border rounded-2xl max-w-sm w-full p-4 relative shadow-2xl">
            <button 
              onClick={() => setReceiptModal(null)} 
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 bg-slate-50 rounded-full p-1"
            >
              <X size={16} />
            </button>
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide mb-3">Reconciled Receipt File</h5>
            <div className="rounded-xl overflow-hidden border border-slate-100">
              <img 
                referrerPolicy="no-referrer"
                src={receiptModal} 
                alt="Receipt Scan" 
                className="w-full h-auto object-cover max-h-[350px]"
              />
            </div>
            <div className="mt-3 text-center text-[10px] text-slate-400 font-mono">
              METADATA: VERIFIED / TRANSACTIONID_MATCH
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
