/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Copy, Send, Image as ImageIcon, Printer, CheckCircle2, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { generatePayslipText } from '../utils/khmerPayrollUtils';

interface KhmerPayrollPayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
  lang: 'en' | 'kh';
  onUpdateStatus?: (newStatus: 'paid' | 'unpaid') => void;
}

export default function KhmerPayrollPayslipModal({
  isOpen,
  onClose,
  record,
  lang,
  onUpdateStatus
}: KhmerPayrollPayslipModalProps) {
  if (!isOpen || !record) return null;

  const monthNamesKh = ['', 'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
  const monthNamesEn = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthStr = lang === 'kh' ? monthNamesKh[record.month || 7] : monthNamesEn[record.month || 7];
  
  const name = lang === 'kh' ? (record.empNameKh || record.staffName) : (record.empNameEn || record.staffName);
  const position = record.position || 'Staff';
  const joinDate = record.startDate || 'N/A';

  const stdDays = record.standardDays || 26;
  const dailyRate = record.dailyRate || ((record.basicSalary || record.baseSalary) / stdDays);
  const proratedBaseVal = record.proratedBasic !== undefined ? record.proratedBasic : (record.basicSalary || record.baseSalary);
  const periodBase = record.periodBase !== undefined ? record.periodBase : proratedBaseVal;

  const pName = record.period === 1 
    ? (lang === 'kh' ? 'លើកទី១ (ពាក់កណ្តាលខែ)' : 'Period 1 (Mid-Month)')
    : (record.period === 2 
      ? (lang === 'kh' ? 'លើកទី២ (ដាច់ខែ)' : 'Period 2 (End-Month)')
      : (lang === 'kh' ? 'ពេញ ១ខែ (ទូទាត់ប្រចាំខែ)' : 'Full Month (Monthly)'));

  const isPaid = record.status === 'paid' || record.status === 'Paid';

  const copyToClipboard = () => {
    const text = generatePayslipText(record, lang);
    navigator.clipboard.writeText(text).then(() => {
      alert(lang === 'kh' ? 'បានចម្លងបង្កាន់ដៃបើកប្រាក់ខែរួចរាល់!' : 'Salary payslip copied to clipboard!');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  const shareToTelegram = () => {
    const text = generatePayslipText(record, lang);
    const encodedText = encodeURIComponent(text);
    const url = `https://t.me/share/url?url=&text=${encodedText}`;
    window.open(url, '_blank');
  };

  const downloadAsImage = () => {
    const element = document.getElementById('payslip-print-area');
    if (!element) return;

    html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false
    }).then(canvas => {
      const link = document.createElement('a');
      const empName = record.empNameKh || record.empNameEn || record.staffName || 'Employee';
      link.download = `Payslip_${empName.replace(/\s+/g, '_')}_M${record.month || 7}_${record.year || 2026}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }).catch(err => {
      console.error('Error exporting image:', err);
      alert(lang === 'kh' ? 'មានបញ្ហាក្នុងការទាញយកជារូបភាព!' : 'Error exporting payslip as image!');
    });
  };

  const printPayslip = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto no-print">
      <div className="max-w-lg w-full">
        {/* Quick actions top bar */}
        <div className="flex flex-wrap justify-end gap-2 mb-4">
          <button 
            onClick={onClose} 
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer mr-auto"
            title={lang === 'kh' ? 'បិទ' : 'Close'}
          >
            <X size={18} />
          </button>
          
          {onUpdateStatus && (
            <button 
              onClick={() => onUpdateStatus(isPaid ? 'unpaid' : 'paid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                isPaid ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {isPaid ? (
                <>
                  <AlertCircle size={14} />
                  <span>{lang === 'kh' ? 'សម្គាល់មិនទាន់បើក' : 'Mark Unpaid'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  <span>{lang === 'kh' ? 'សម្គាល់ថាបានបើក' : 'Mark Paid'}</span>
                </>
              )}
            </button>
          )}

          <button 
            onClick={copyToClipboard}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Copy size={14} />
            <span>{lang === 'kh' ? 'ចម្លងអត្ថបទ' : 'Copy Text'}</span>
          </button>

          <button 
            onClick={shareToTelegram}
            className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Send size={14} />
            <span>Telegram</span>
          </button>

          <button 
            onClick={downloadAsImage}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ImageIcon size={14} />
            <span>{lang === 'kh' ? 'ជារូបភាព' : 'Save Image'}</span>
          </button>

          <button 
            onClick={printPayslip}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Printer size={14} />
            <span>{lang === 'kh' ? 'បោះពុម្ភ' : 'Print'}</span>
          </button>
        </div>

        {/* Paper Container */}
        <div 
          id="payslip-print-area" 
          className="relative bg-white text-slate-800 p-8 rounded-2xl border border-slate-200 shadow-2xl max-w-md mx-auto select-none overflow-hidden"
          style={{ fontFamily: "sans-serif" }}
        >
          {/* Watermark background stamp */}
          <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[20deg] border-[5px] rounded-xl px-6 py-2 text-4xl font-black uppercase tracking-wider opacity-10 pointer-events-none select-none z-0 ${
              isPaid ? 'border-emerald-500 text-emerald-500' : 'border-rose-500 text-rose-500'
            }`}
          >
            {isPaid ? (lang === 'kh' ? 'បានបើក (PAID)' : 'PAID') : (lang === 'kh' ? 'មិនទាន់បើក (UNPAID)' : 'UNPAID')}
          </div>

          <div className="relative z-10 space-y-6">
            <div className="text-center border-b-2 border-slate-700 pb-3">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                {lang === 'kh' ? 'បង្កាន់ដៃបើកប្រាក់ខែបុគ្គលិក' : 'EMPLOYEE SALARY PAYSLIP'}
              </h2>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">
                {lang === 'kh' ? 'ប្រព័ន្ធទូទាត់ប្រាក់ខែស្វ័យប្រវត្ត' : 'Automated Payroll Management Engine'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div>
                  <span className="text-slate-400 font-medium">{lang === 'kh' ? 'ឈ្មោះបុគ្គលិក' : 'Employee'}:</span>{' '}
                  <strong className="text-slate-800">{name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">{lang === 'kh' ? 'តួនាទី' : 'Position'}:</span>{' '}
                  <span className="text-slate-700 font-medium">{position}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">{lang === 'kh' ? 'ថ្ងៃចូលធ្វើការ' : 'Join Date'}:</span>{' '}
                  <span className="text-slate-700 font-mono font-semibold">{joinDate}</span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div>
                  <span className="text-slate-400 font-medium">{lang === 'kh' ? 'សម្រាប់ខែ' : 'Pay Month'}:</span>{' '}
                  <strong className="text-slate-800">{monthStr} {record.year || 2026}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">{lang === 'kh' ? 'វគ្គបើកប្រាក់' : 'Pay Cycle'}:</span>{' '}
                  <span className="text-slate-700 font-semibold">{pName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">{lang === 'kh' ? 'កាលបរិច្ឆេទគណនា' : 'Calculated Date'}:</span>{' '}
                  <span className="text-slate-700 font-mono font-semibold">{record.dateCalculated || record.paymentDate}</span>
                </div>
              </div>
            </div>

            {/* Breakdown table */}
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="text-left font-bold text-slate-500 pb-2 uppercase tracking-wide">
                    {lang === 'kh' ? 'ការពិពណ៌នា' : 'Description'}
                  </th>
                  <th className="text-right font-bold text-slate-500 pb-2 uppercase tracking-wide">
                    {lang === 'kh' ? 'ទឹកប្រាក់' : 'Amount'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 text-slate-700">
                    <strong>{lang === 'kh' ? 'ប្រាក់ខែគោល (Basic Salary)' : 'Basic Salary'}</strong>
                  </td>
                  <td className="py-2.5 text-right font-mono font-semibold text-slate-800">
                    ${(record.basicSalary || record.baseSalary || 0).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500">
                    {lang === 'kh' ? 'កម្រៃការងារប្រចាំថ្ងៃ (Daily Rate)' : 'Daily Rate'}
                  </td>
                  <td className="py-2 text-right font-mono text-slate-600">
                    ${dailyRate.toFixed(2)} / {lang === 'kh' ? 'ថ្ងៃ' : 'day'}
                  </td>
                </tr>
                {record.workedDays !== undefined && record.workedDays !== stdDays && (
                  <tr>
                    <td className="py-2 text-slate-500">
                      {lang === 'kh' ? 'ប្រាក់ខែតាមថ្ងៃធ្វើការជាក់ស្តែង' : 'Prorated Basic Salary'} ({record.workedDays} {lang === 'kh' ? 'ថ្ងៃ' : 'days'})
                    </td>
                    <td className="py-2 text-right font-mono text-slate-600">
                      ${proratedBaseVal.toFixed(2)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="py-2 text-slate-500">
                    {lang === 'kh' ? 'ប្រាក់ខែតាមវគ្គ' : 'Period Base Salary'}
                  </td>
                  <td className="py-2 text-right font-mono text-slate-600">
                    ${periodBase.toFixed(2)}
                  </td>
                </tr>

                {/* Overtime breakdown details */}
                {(record.otPayDay > 0 || record.otDaysDay > 0) && (
                  <tr>
                    <td className="py-2 text-slate-600">
                      {lang === 'kh' ? 'ប្រាក់ថែមម៉ោងវេនថ្ងៃ (Day OT)' : 'Overtime Day Shift'} ({record.otDaysDay?.toFixed(1) || 0} {lang === 'kh' ? 'ថ្ងៃ' : 'days'})
                    </td>
                    <td className="py-2 text-right font-mono font-medium text-emerald-600">
                      +${(record.otPayDay || 0).toFixed(2)}
                    </td>
                  </tr>
                )}
                {(record.otPayNight > 0 || record.otDaysNight > 0) && (
                  <tr>
                    <td className="py-2 text-slate-600">
                      {lang === 'kh' ? 'ប្រាក់ថែមម៉ោងវេនយប់ (Night OT)' : 'Overtime Night Shift'} ({record.otDaysNight?.toFixed(1) || 0} {lang === 'kh' ? 'ថ្ងៃ' : 'days'})
                    </td>
                    <td className="py-2 text-right font-mono font-medium text-emerald-600">
                      +${(record.otPayNight || 0).toFixed(2)}
                    </td>
                  </tr>
                )}
                {record.overtime > 0 && !record.otPayDay && !record.otPayNight && (
                  <tr>
                    <td className="py-2 text-slate-600">
                      {lang === 'kh' ? 'ប្រាក់ថែមម៉ោង (Overtime)' : 'Overtime Pay'}
                    </td>
                    <td className="py-2 text-right font-mono font-medium text-emerald-600">
                      +${record.overtime.toFixed(2)}
                    </td>
                  </tr>
                )}

                {/* Allowances */}
                {(record.bonus > 0 || record.allowance > 0) && (
                  <tr>
                    <td className="py-2 text-slate-600">
                      {lang === 'kh' ? 'ប្រាក់ឧបត្ថម្ភផ្សេងៗ (Allowances)' : 'Allowances'}
                    </td>
                    <td className="py-2 text-right font-mono font-medium text-emerald-600">
                      +${(record.bonus || record.allowance).toFixed(2)}
                    </td>
                  </tr>
                )}

                {/* Deductions */}
                {record.period1Deduct > 0 && (
                  <tr>
                    <td className="py-2 text-slate-600">
                      {lang === 'kh' ? 'ដកប្រាក់បើកលើកទី១ (Period 1 Payout)' : 'Period 1 Payout Deducted'}
                    </td>
                    <td className="py-2 text-right font-mono text-rose-500">
                      -${record.period1Deduct.toFixed(2)}
                    </td>
                  </tr>
                )}
                {(record.advancePayment > 0 || record.advancesDeduct > 0) && (
                  <tr>
                    <td className="py-2 text-slate-600">
                      {lang === 'kh' ? 'ដកប្រាក់បើកមុន (Advances Deducted)' : 'Salary Advances Deducted'}
                    </td>
                    <td className="py-2 text-right font-mono text-rose-500">
                      -${(record.advancePayment || record.advancesDeduct).toFixed(2)}
                    </td>
                  </tr>
                )}
                {(record.deduction > 0 || record.customDeduct > 0) && (
                  <tr>
                    <td className="py-2 text-slate-600">
                      {lang === 'kh' ? 'ប្រាក់ពិន័យ/ដកផ្សេងៗ (Deductions)' : 'Other Deductions / Fines'}
                    </td>
                    <td className="py-2 text-right font-mono text-rose-500">
                      -${(record.deduction || record.customDeduct).toFixed(2)}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-700 font-bold text-slate-900 text-sm">
                  <td className="py-3">
                    {lang === 'kh' ? 'ប្រាក់ខែត្រូវបើកជាក់ស្តែង (Net Payout)' : 'Net Paid Amount'}
                  </td>
                  <td className="py-3 text-right font-mono text-lg">
                    ${(record.netSalary || record.netPay || 0).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Signature fields */}
            <div className="grid grid-cols-2 gap-8 text-[10px] text-slate-500 text-center pt-8">
              <div className="border-t border-slate-200 pt-3">
                <p>{lang === 'kh' ? 'ហត្ថលេខាអ្នករៀបចំ' : 'Prepared By (Signature)'}</p>
                <div className="h-12"></div>
                <p className="text-slate-300 font-mono">.........................................</p>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <p>{lang === 'kh' ? 'ស្នាមមេដៃ/ហត្ថលេខាទទួល' : 'Received By (Signature/Thumbprint)'}</p>
                <div className="h-12"></div>
                <p className="text-slate-300 font-mono">.........................................</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
