/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Edit3, 
  MapPin, 
  PhoneCall, 
  UserPlus, 
  Clock, 
  ShieldAlert, 
  Trophy, 
  BarChart, 
  TrendingUp, 
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Branch, Role, User } from '../types';
import { translations } from '../mockData';
import { formatCurrency } from '../utils';

interface BranchManagementViewProps {
  currentRole: Role;
  branches: Branch[];
  setBranches: React.Dispatch<React.SetStateAction<Branch[]>>;
  users: User[];
  lang: 'en' | 'kh';
  onAddLog: (msg: string) => void;
}

export default function BranchManagementView({
  currentRole,
  branches,
  setBranches,
  users,
  lang,
  onAddLog
}: BranchManagementViewProps) {
  const t = translations[lang];
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [managerId, setManagerId] = useState('');
  const [openTime, setOpenTime] = useState('06:00 AM');
  const [closeTime, setCloseTime] = useState('10:00 PM');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  // Verify Role (Permissions: Owner only has full access to this page)
  if (currentRole !== 'Owner') {
    return (
      <div className="bg-white border border-rose-100 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm" id="security_guard_notice">
        <ShieldAlert className="text-rose-500 mx-auto mb-4" size={54} />
        <h3 className="text-lg font-bold text-slate-800">{lang === 'en' ? "Access Restriction Alert" : "ការព្រមានការកម្រិតសិទ្ធិ"}</h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          {t.warningRoleLimit}
        </p>
        <div className="mt-5 p-3.5 bg-slate-50 rounded-xl text-slate-400 font-mono text-xs">
          STRICT_DATA_SEPARATION_ENFORCED // role_required: Owner // user_role: {currentRole}
        </div>
      </div>
    );
  }

  const handleCreateOrEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !address || !phone) return;

    const managerObj = users.find(u => u.id === managerId);
    const mName = managerObj ? managerObj.fullName : 'Unassigned';

    if (editingBranch) {
      // Edit
      const updated = branches.map(b => b.id === editingBranch.id ? {
        ...b,
        branchCode: code,
        branchName: name,
        address,
        phone,
        managerId,
        managerName: mName,
        openingTime: openTime,
        closingTime: closeTime,
        status,
        updatedAt: new Date().toISOString()
      } : b);
      setBranches(updated);
      onAddLog(`Edited branch "${name}" details (${code})`);
      setEditingBranch(null);
    } else {
      // Create
      const newB: Branch = {
        id: 'b_' + Date.now(),
        branchCode: code,
        branchName: name,
        address,
        phone,
        managerId,
        managerName: mName,
        openingTime: openTime,
        closingTime: closeTime,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setBranches([...branches, newB]);
      onAddLog(`Created new laundry branch "${name}" with code ${code}`);
    }

    // Reset Form
    setCode('');
    setName('');
    setAddress('');
    setPhone('');
    setManagerId('');
    setOpenTime('06:00 AM');
    setCloseTime('10:00 PM');
    setStatus('Active');
    setShowForm(false);
  };

  const startEdit = (b: Branch) => {
    setEditingBranch(b);
    setCode(b.branchCode);
    setName(b.branchName);
    setAddress(b.address);
    setPhone(b.phone);
    setManagerId(b.managerId);
    setOpenTime(b.openingTime);
    setCloseTime(b.closingTime);
    setStatus(b.status);
    setShowForm(true);
  };

  const toggleStatus = (b: Branch) => {
    const nextStatus = b.status === 'Active' ? 'Inactive' : 'Active';
    setBranches(branches.map(x => x.id === b.id ? { ...x, status: nextStatus } : x));
    onAddLog(`Toggled status of branch "${b.branchName}" to ${nextStatus}`);
  };

  // Branch Rankings (Mock values based on machine revenues inside database)
  const branchPerformances = [
    { name: 'Clean24 Toul Kork', revenue: 2050, expense: 650, profit: 1400, rank: 1 },
    { name: 'Clean24 Boeung Keng Kang', revenue: 1420, expense: 505, profit: 915, rank: 2 },
    { name: 'Clean24 Sen Sok', revenue: 260, expense: 120, profit: 140, rank: 3 },
  ];

  return (
    <div className="space-y-6" id="branch_management_module">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-800">{lang === 'en' ? "Multi-Branch Directory" : "សៀវភៅបញ្ជីគ្រប់គ្រងសាខា"}</h2>
          <span className="text-[11px] text-slate-400 block mt-0.5">Configure, shut down, edit base parameters of company locations.</span>
        </div>
        <button
          onClick={() => {
            setEditingBranch(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-200 hover:bg-emerald-500 transition cursor-pointer"
          id="btn_add_branch_trigger"
        >
          <Plus size={14} />
          {t.addNews}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateOrEdit} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4" id="form_branch_entry">
          <h4 className="font-bold text-slate-800 text-xs pb-2 border-b border-slate-100">
            {editingBranch ? `${t.edit} - ${editingBranch.branchName}` : t.addNews}
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.branchCode} *</label>
              <input
                type="text"
                placeholder="e.g. C24-TK01"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.branchName} *</label>
              <input
                type="text"
                placeholder="e.g. Clean24 Toul Kork"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.branchPhone} *</label>
              <input
                type="text"
                placeholder="e.g. 012 345 678"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.branchManager}</label>
              <select
                value={managerId}
                onChange={e => setManagerId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.fullName} ({u.role})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.openingHours}</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="e.g. 06:00 AM"
                  value={openTime}
                  onChange={e => setOpenTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="e.g. 10:00 PM"
                  value={closeTime}
                  onChange={e => setCloseTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.status}</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as 'Active' | 'Inactive')}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="Active">{t.active}</option>
                <option value="Inactive">{t.inactive}</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.branchAddress} *</label>
              <textarea
                placeholder="e.g. St. 289, Sangkat Boeung Kak I, Khan Toul Kork, Phnom Penh"
                rows={2}
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
              {t.save}
            </button>
          </div>
        </form>
      )}

      {/* Grid: Branch Display and Ranking Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main List panel */}
        <div className="xl:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {branches.map(b => (
              <div 
                key={b.id} 
                className={`bg-white border rounded-2xl p-5 shadow-xs relative transition hover:shadow-md
                  ${b.status === 'Active' ? 'border-slate-150' : 'border-rose-100 bg-rose-50/10'}
                `}
                id={`branch_card_${b.id}`}
              >
                {/* Badge Status */}
                <span className={`absolute top-4 right-4 px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider
                  ${b.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}
                `}>
                  {b.status === 'Active' ? t.active : t.inactive}
                </span>

                <div className="flex gap-3.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{b.branchName}</h3>
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded tracking-wide font-bold mt-1 inline-block">
                      {b.branchCode}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-505 border-t border-slate-50 pt-3">
                  <div className="flex items-start gap-2">
                    <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>{b.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneCall size={13} className="text-slate-400 shrink-0" />
                    <span>{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserPlus size={13} className="text-slate-400 shrink-0" />
                    <span>{t.branchManager}: <strong className="text-slate-700">{b.managerName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-slate-400 shrink-0" />
                    <span>{t.openingHours}: <strong className="text-slate-700">{b.openingTime} – {b.closingTime}</strong></span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end mt-4 border-t border-slate-50 pt-3">
                  <button
                    onClick={() => startEdit(b)}
                    className="flex items-center gap-1 text-[10px] font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 cursor-pointer"
                  >
                    <Edit3 size={11} />
                    {t.edit}
                  </button>
                  <button
                    onClick={() => toggleStatus(b)}
                    className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer
                      ${b.status === 'Active' 
                        ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' 
                        : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                      }
                    `}
                  >
                    {b.status === 'Active' ? <XCircle size={11} /> : <CheckCircle size={11} />}
                    {b.status === 'Active' ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Branch rankings panel */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs shrink-0 self-start">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50 mb-4">
            <Trophy className="text-amber-500" size={18} />
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">{t.branchRanking}</h4>
          </div>

          <div className="space-y-4">
            {branchPerformances.map((bp, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-3xs">
                <div className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono tracking-tight text-white
                    ${bp.rank === 1 ? 'bg-amber-500' : bp.rank === 2 ? 'bg-slate-400' : 'bg-amber-700'}
                  `}>
                    #{bp.rank}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block truncate max-w-[130px]">{bp.name}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Opex: {formatCurrency(bp.expense, 'USD')}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 block">{formatCurrency(bp.revenue, 'USD')}</span>
                  <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Net Margin: {Math.round((bp.profit / bp.revenue) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl">
            <span className="text-[10px] text-emerald-700 block uppercase font-bold tracking-wider mb-1">
              🏆 {t.bestPerforming}
            </span>
            <span className="text-sm font-bold text-slate-800 block">Clean24 Toul Kork</span>
            <p className="text-[11px] text-slate-550 mt-1 leading-relaxed">
              Leading June YTD cycles with a net operating profit margin exceeding <strong>68%</strong>. Highest dryer utilization rate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
