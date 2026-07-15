/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Coins, 
  Plus, 
  Printer, 
  Search, 
  TrendingUp, 
  X, 
  CheckCircle, 
  Sparkles,
  CreditCard,
  Building,
  Receipt
} from 'lucide-react';
import { Income, LaundryServiceType, Role, Branch, Machine } from '../types';
import { translations } from '../mockData';
import { formatCurrency, formatDualCurrency } from '../utils';

interface DailyIncomeViewProps {
  currentRole: Role;
  activeBranchId: string;
  branches: Branch[];
  machines: Machine[];
  incomes: Income[];
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
  lang: 'en' | 'kh';
  onAddLog: (msg: string) => void;
  exchangeRate: number;
}

export default function DailyIncomeView({
  currentRole,
  activeBranchId,
  branches,
  machines,
  incomes,
  setIncomes,
  lang,
  onAddLog,
  exchangeRate
}: DailyIncomeViewProps) {
  const t = translations[lang];
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<Income | null>(null);

  // Form Fields
  const [date, setDate] = useState('2026-06-06');
  const [serviceType, setServiceType] = useState<LaundryServiceType>('Washing + Drying');
  const [machineId, setMachineId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(5.0);
  const [discount, setDiscount] = useState(0.0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'ABA' | 'Bank Transfer' | 'QR Payment'>('ABA');
  const [staffInCharge, setStaffInCharge] = useState('Sok Reaksmey');
  const [customerNote, setCustomerNote] = useState('');

  // 1. Resolve accessible branches based on roles (Data Security Check)
  const getFilteredIncomes = () => {
    let list = incomes;

    if (currentRole === 'Manager' || currentRole === 'Staff') {
      // Locked strictly to B1 (Toul Kork) and cannot see other branches
      list = list.filter(inc => inc.branchId === 'b1');
    } else if (currentRole === 'Admin') {
      // Admin sees b1 and b2
      list = list.filter(inc => inc.branchId === 'b1' || inc.branchId === 'b2');
    }

    if (activeBranchId !== 'all') {
      list = list.filter(inc => inc.branchId === activeBranchId);
    }

    // Sort by latest on top
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  };

  const filteredIncomes = getFilteredIncomes();

  // Get available machines of active branch
  const getBranchMachines = () => {
    const selectedBranchCode = activeBranchId === 'all' ? 'b1' : activeBranchId;
    return machines.filter(m => m.branchId === selectedBranchCode);
  };

  const branchMachines = getBranchMachines();

  // Auto set unit price based on service type to speed up cashier workflows
  const handleServiceChange = (st: LaundryServiceType) => {
    setServiceType(st);
    if (st === 'Washing') setUnitPrice(3.0);
    else if (st === 'Drying') setUnitPrice(2.5);
    else if (st === 'Washing + Drying') setUnitPrice(5.0);
    else setUnitPrice(10.0);
  };

  // Create new transaction records
  const handleRegisterIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity < 1 || unitPrice < 0 || discount < 0) return;

    const actualBranch = activeBranchId === 'all' ? 'b1' : activeBranchId;
    const computedTotal = (quantity * unitPrice) - discount;

    const newIncome: Income = {
      id: 'inc_' + Date.now(),
      branchId: actualBranch,
      date,
      serviceType,
      machineNumber: machineId || 'Manual Washer',
      quantity,
      unitPrice,
      discount,
      totalAmount: computedTotal >= 0 ? computedTotal : 0,
      paymentMethod,
      staffInCharge: currentRole === 'Staff' ? 'Sok Reaksmey' : staffInCharge,
      customerNote
    };

    setIncomes([newIncome, ...incomes]);
    onAddLog(`Logged daily income transaction of ${formatCurrency(newIncome.totalAmount, 'USD')} for service - ${serviceType}`);
    
    // Auto trigger printing review invoice
    setActiveInvoice(newIncome);

    // Reset Form
    setQuantity(1);
    setDiscount(0);
    setCustomerNote('');
    setShowAddForm(false);
  };

  const triggerPrint = (inc: Income) => {
    const title = `Clean24 Invoice #${inc.id.substring(4, 12)}`;
    
    // HTML build structure for local printing popup window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const khrAmount = Math.round(inc.totalAmount * exchangeRate);
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&display=swap">
            <style>
              body {
                font-family: 'Kantumruy Pro', sans-serif;
                padding: 30px;
                max-width: 350px;
                margin: 0 auto;
                font-size: 11px;
                line-height: 1.4;
                color: #1e293b;
              }
              .center { text-align: center; }
              .divider { border-top: 1px dashed #cbd5e1; margin: 12px 0; }
              table { width: 100%; border-collapse: collapse; }
              td { padding: 4px 0; }
              .bold { font-weight: bold; }
              .large { font-size: 14px; }
              .logo { font-size: 20px; font-weight: 800; color: #10l981; margin-bottom: 2px; }
              .footer { font-size: 9px; color: #64748b; margin-top: 25px; text-align: center; }
            </style>
          </head>
          <body onload="window.print();window.close()">
            <div class="center">
              <div class="logo">Clean24 Laundry</div>
              <div>Expert Wash & Dry Solutions</div>
              <div class="bold">Active Branch ID: Toul Kork 01</div>
              <div>Tel: 012 345 678</div>
            </div>

            <div class="divider"></div>

            <table>
              <tr><td>Date & Time:</td><td class="bold text-right" style="text-align: right;">${inc.date} (Today)</td></tr>
              <tr><td>Invoice ID:</td><td class="bold text-right" style="text-align: right;">${inc.id.substring(4, 12)}</td></tr>
              <tr><td>Cashier Staff:</td><td class="bold text-right" style="text-align: right;">${inc.staffInCharge}</td></tr>
            </table>

            <div class="divider"></div>

            <table>
              <tr class="bold">
                <td>Item description</td>
                <td style="text-align: center;">Qty</td>
                <td style="text-align: right;">Price</td>
              </tr>
              <tr>
                <td>${inc.serviceType} (${inc.machineNumber})</td>
                <td style="text-align: center;">${inc.quantity}</td>
                <td style="text-align: right;">$${inc.unitPrice.toFixed(2)}</td>
              </tr>
            </table>

            <div class="divider"></div>

            <table>
              <tr><td>Sub Total:</td><td style="text-align: right;">$${(inc.quantity * inc.unitPrice).toFixed(2)}</td></tr>
              <tr><td>Discount:</td><td style="text-align: right;">-$${inc.discount.toFixed(2)}</td></tr>
              <tr class="bold large">
                <td>TOTAL CHARGED (USD):</td>
                <td style="text-align: right; color:#10b981;">$${inc.totalAmount.toFixed(2)}</td>
              </tr>
              <tr class="bold">
                <td>TOTAL IN KHMER (KHR):</td>
                <td style="text-align: right;">${new Intl.NumberFormat('kh-KH').format(khrAmount)} ៛</td>
              </tr>
              <tr><td>Payment Type:</td><td class="bold" style="text-align: right; text-transform: uppercase;">${inc.paymentMethod}</td></tr>
            </table>

            <div class="divider"></div>

            <div class="center footer">
              Thank you for choosing Clean24!<br>
              សូមអរគុណសម្រាប់ការគាំទ្រហាងបោកអ៊ុត Clean24!<br>
              <strong>Open (6:00 AM – 10:00 PM) Always Fresh.</strong>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const getBranchCode = (bId: string) => {
    const b = branches.find(x => x.id === bId);
    return b ? b.branchCode : bId;
  };

  return (
    <div className="space-y-6" id="daily_income_module">
      {/* Header Board Panel */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-800">{t.income}</h2>
          <span className="text-[11px] text-slate-400 block mt-0.5">Register washes, dryers load-counts, compute discounts, and print bills.</span>
        </div>
        
        {/* Everyone, including staff role can input daily incomes! (Suitable for cash registers) */}
        <button
          onClick={() => {
            if (branchMachines.length > 0) {
              setMachineId(branchMachines[0].machineNumber);
            }
            setShowAddForm(!showAddForm);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-200 hover:bg-emerald-500 transition cursor-pointer"
          id="btn_record_income_trigger"
        >
          <Plus size={14} />
          {t.addNews}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleRegisterIncome} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4" id="form_income_entry">
          <h4 className="font-bold text-slate-800 text-xs pb-2 border-b border-slate-100">
            ➕ {lang === 'en' ? "Record Customer Laundry Transaction" : "កត់ត្រាការបោកគក់អតិថិជនថ្មី"}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Service Offer Type *</label>
              <select
                value={serviceType}
                onChange={e => handleServiceChange(e.target.value as LaundryServiceType)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
              >
                <option value="Washing + Drying">Washing + Drying Combination</option>
                <option value="Washing">Washing Only</option>
                <option value="Drying">Drying Only</option>
                <option value="Other">Other Deluxe Service</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Machine Association *</label>
              <select
                value={machineId}
                onChange={e => setMachineId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
                required
              >
                <option value="">-- Choose Machine --</option>
                {branchMachines.map(m => (
                  <option key={m.id} value={`${m.machineNumber} (${m.capacity}kg)`}>
                    {m.machineNumber} [{m.machineType}] ({m.capacity}kg)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Quantity *</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Unit Pricing (USD) *</label>
              <input
                type="number"
                step="0.1"
                min={0}
                value={unitPrice}
                onChange={e => setUnitPrice(Math.max(0, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.discount} (USD)</label>
              <input
                type="number"
                step="0.1"
                min={0}
                value={discount}
                onChange={e => setDiscount(Math.max(0, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none font-mono text-red-600"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.paymentMethod} *</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
              >
                <option value="ABA">ABA QR Code</option>
                <option value="QR Payment">Bakong QR Scan</option>
                <option value="Cash">Cash (USD/KHR)</option>
                <option value="Bank Transfer">Bank Wire Transfer</option>
              </select>
            </div>

            {currentRole !== 'Staff' && (
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">Staff Cashier In Charge</label>
                <input
                  type="text"
                  value={staffInCharge}
                  onChange={e => setStaffInCharge(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
                />
              </div>
            )}

            <div className={currentRole === 'Staff' ? 'sm:col-span-3' : 'sm:col-span-2'}>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Customer Notes / Preferences</label>
              <input
                type="text"
                placeholder="Separate color clothes, extra fragrance softener"
                value={customerNote}
                onChange={e => setCustomerNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-emerald-50/50 p-4 border border-emerald-100 rounded-2xl flex justify-between items-center text-xs" id="invoice_automatic_calculations">
            <div>
              <span className="text-slate-450 uppercase block font-bold tracking-wide">Automatic calculation:</span>
              <span className="text-slate-500">Subtotal: ${quantity * unitPrice} | Discount: -${discount}</span>
            </div>
            <div className="text-right">
              <strong className="text-base text-emerald-800 font-bold block font-mono">
                NET: {formatDualCurrency(Math.max(0, (quantity * unitPrice) - discount), exchangeRate)}
              </strong>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-200 hover:bg-emerald-500 cursor-pointer"
            >
              Confirm & Print Invoice
            </button>
          </div>
        </form>
      )}

      {/* Daily transactional ledger listing cards */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50">
          <h4 className="font-bold text-slate-800 text-xs">📜 {lang === 'en' ? "Daily Transaction Book" : "សៀវភៅកត់ត្រាប្រតិបត្តិការប្រចាំថ្ងៃ"}</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left" id="income_records_table">
            <thead className="text-[11px] text-slate-400 bg-slate-50/50 border-b border-slate-100 font-bold uppercase">
              <tr>
                <th className="px-6 py-3">Receipt ID</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Service Details</th>
                <th className="px-4 py-3">Machine</th>
                <th className="px-4 py-3">Charged Rate</th>
                <th className="px-4 py-3">Net Due</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Cashier</th>
                <th className="px-6 py-3 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncomes.map(inc => (
                <tr key={inc.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-700">
                    #{inc.id.substring(4, 12)}
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded text-[10px]">
                      {getBranchCode(inc.branchId)}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-800">
                    {inc.serviceType}
                    {inc.customerNote && (
                      <span className="text-[10px] text-slate-400 block font-normal mt-0.5">{inc.customerNote}</span>
                    )}
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-600 font-medium">({inc.machineNumber})</td>
                  <td className="px-4 py-4 text-slate-600 font-mono">
                    {inc.quantity} x ${inc.unitPrice.toFixed(2)}
                    {inc.discount > 0 && <span className="text-red-500 block text-[9px] font-bold">Disc: -${inc.discount}</span>}
                  </td>
                  <td className="px-4 py-4 font-bold font-mono text-emerald-700">
                    {formatCurrency(inc.totalAmount, 'USD')}
                  </td>
                  <td className="px-4 py-4 text-slate-600 uppercase font-bold tracking-wider">{inc.paymentMethod}</td>
                  <td className="px-4 py-4 text-slate-500 font-medium">{inc.staffInCharge}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => triggerPrint(inc)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-slate-700 font-bold rounded-lg text-[10px] cursor-pointer"
                    >
                      <Receipt size={12} />
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
              {filteredIncomes.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-450 bg-slate-50/20">
                    No transactions registered in this reporting window.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
