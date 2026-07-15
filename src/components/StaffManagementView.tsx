/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  MapPin, 
  PhoneCall, 
  Briefcase, 
  Clock, 
  UserPlus, 
  ShieldAlert, 
  CreditCard,
  Edit2,
  Trash2,
  Contact2
} from 'lucide-react';
import { Staff, Role, Branch } from '../types';
import { translations } from '../mockData';
import { formatCurrency } from '../utils';
import { userApi } from '../utils/api';

interface StaffManagementViewProps {
  currentRole: Role;
  activeBranchId: string;
  branches: Branch[];
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
  lang: 'en' | 'kh';
  onAddLog: (msg: string) => void;
}

export default function StaffManagementView({
  currentRole,
  activeBranchId,
  branches,
  staff,
  setStaff,
  lang,
  onAddLog
}: StaffManagementViewProps) {
  const t = translations[lang];
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [branchId, setBranchId] = useState('b1');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dob, setDob] = useState('1998-01-01');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [position, setPosition] = useState<'Manager' | 'Cashier' | 'Helper' | 'Technician'>('Helper');
  const [shift, setShift] = useState<'Morning' | 'Afternoon' | 'Night' | 'Full Time'>('Morning');
  const [startDate, setStartDate] = useState('2026-06-06');
  const [baseSalary, setBaseSalary] = useState(250);
  const [idCardNumber, setIdCardNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Optional User account link states
  const [createUserAccount, setCreateUserAccount] = useState<boolean>(false);
  const [userAccountUsername, setUserAccountUsername] = useState('');
  const [userAccountEmail, setUserAccountEmail] = useState('');
  const [userAccountPassword, setUserAccountPassword] = useState('');
  const [userAccountRole, setUserAccountRole] = useState('Staff');
  const [userAccountBranches, setUserAccountBranches] = useState<string[]>([]);

  // 1. Enforce strict directory guard: Staff is blocked, Managers can see the directory but only for B1
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

  // 2. Filter list based on branch rules and active branch selection
  const getFilteredStaff = () => {
    let list = staff;

    // Strict Manager Lock to their assigned branch ('b1')
    if (currentRole === 'Manager') {
      list = list.filter(s => s.branchId === 'b1');
    } else if (currentRole === 'Admin') {
      // Admin sees b1 and b2
      list = list.filter(s => s.branchId === 'b1' || s.branchId === 'b2');
    }

    // Secondary navigation dropdown filter (Active branch selection)
    if (activeBranchId !== 'all') {
      list = list.filter(s => s.branchId === activeBranchId);
    }

    return list;
  };

  const filteredStaff = getFilteredStaff();

  const handleCreateOrEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !idCardNumber) return;

    // Build default generic portrait block if none provided
    const pic = photoUrl || `https://images.unsplash.com/photo-${gender === 'Female' ? '1534528741775-53994a69daeb' : '1507003211169-0a1dd7228f2d'}?auto=format&fit=crop&q=80&w=200`;

    if (editingStaff) {
      // Edit
      const updated = staff.map(s => s.id === editingStaff.id ? {
        ...s,
        fullName,
        branchId,
        gender,
        dob,
        phone,
        address,
        position,
        shift,
        startDate,
        baseSalary: Number(baseSalary),
        idCardNumber,
        emergencyContact,
        photoUrl: pic
      } : s);
      setStaff(updated);
      onAddLog(`Updated staff profile for ${fullName}`);
      setEditingStaff(null);
    } else {
      // Create
      const newStaff: Staff = {
        id: 's_' + Date.now(),
        fullName,
        branchId,
        gender,
        dob,
        phone,
        address,
        position,
        shift,
        startDate,
        baseSalary: Number(baseSalary),
        status: 'Active',
        photoUrl: pic,
        idCardNumber,
        emergencyContact
      };
      setStaff([...staff, newStaff]);
      onAddLog(`Registered new staff "${fullName}" under position ${position}`);

      if (createUserAccount) {
        userApi.createUser({
          fullName,
          username: userAccountUsername || fullName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          email: userAccountEmail || `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '')}@clean24.com`,
          phone,
          password: userAccountPassword || 'Clean24@123',
          role: userAccountRole as Role,
          assignedBranchIds: userAccountBranches.length > 0 ? userAccountBranches : [branchId],
          status: 'Active',
          twoFactorMethod: 'disabled'
        } as any).then(() => {
          onAddLog(`Linked login user account was auto-created for staff member ${fullName}`);
        }).catch((err) => {
          console.error('Failed to auto-create credentials during staff setup:', err);
          alert(`Staff registered successfully, but automatic login account creation failed: ${err.message}`);
        });
      }
    }

    // Reset Form
    setFullName('');
    setPhone('');
    setAddress('');
    setIdCardNumber('');
    setEmergencyContact('');
    setPhotoUrl('');
    setBaseSalary(250);
    setCreateUserAccount(false);
    setUserAccountUsername('');
    setUserAccountEmail('');
    setUserAccountPassword('');
    setUserAccountRole('Staff');
    setUserAccountBranches([]);
    setShowForm(false);
  };

  const startEdit = (s: Staff) => {
    setEditingStaff(s);
    setFullName(s.fullName);
    setBranchId(s.branchId);
    setGender(s.gender);
    setDob(s.dob);
    setPhone(s.phone);
    setAddress(s.address);
    setPosition(s.position);
    setShift(s.shift);
    setStartDate(s.startDate);
    setBaseSalary(s.baseSalary);
    setIdCardNumber(s.idCardNumber);
    setEmergencyContact(s.emergencyContact);
    setPhotoUrl(s.photoUrl);
    setShowForm(true);
  };

  const toggleStaffStatus = (id: string, status: 'Active' | 'Resigned' | 'Suspended') => {
    setStaff(staff.map(s => s.id === id ? { ...s, status } : s));
    onAddLog(`Toggled staff ID ${id} status to ${status}`);
  };

  const getBranchCode = (bId: string) => {
    const b = branches.find(x => x.id === bId);
    return b ? b.branchCode : bId;
  };

  return (
    <div className="space-y-6" id="staff_management_module">
      {/* Search Header Panel */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-800">{t.staff}</h2>
          <span className="text-[11px] text-slate-400 block mt-0.5">Maintain registration directories, emergency lines, and compensation parameters.</span>
        </div>
        
        {/* Only Owner and Admins can register new staff. Managers can look at records. */}
        {['Owner', 'Admin'].includes(currentRole) && (
          <button
            onClick={() => {
              setEditingStaff(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-200 hover:bg-emerald-500 transition cursor-pointer"
            id="add_staff_trigger"
          >
            <Plus size={14} />
            {t.addNews}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreateOrEdit} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4" id="form_staff_entry">
          <h4 className="font-bold text-slate-800 text-xs pb-2 border-b border-slate-100">
            {editingStaff ? `${t.edit} - ${editingStaff.fullName}` : t.addNews}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.fullName} *</label>
              <input
                type="text"
                placeholder="e.g. Srey Pich"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Branch *</label>
              <select
                value={branchId}
                onChange={e => setBranchId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.branchName} ({b.branchCode})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.gender} *</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.phone} *</label>
              <input
                type="text"
                placeholder="e.g. 096 111 222"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none address"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.position} *</label>
              <select
                value={position}
                onChange={e => setPosition(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
              >
                <option value="Manager">Manager</option>
                <option value="Cashier">Cashier</option>
                <option value="Helper">Helper</option>
                <option value="Technician">Technician</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.shift} *</label>
              <select
                value={shift}
                onChange={e => setShift(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
                <option value="Full Time">Full Time</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.idCard} *</label>
              <input
                type="text"
                placeholder="e.g. 012098755"
                value={idCardNumber}
                onChange={e => setIdCardNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.emergency} *</label>
              <input
                type="text"
                placeholder="e.g. 012 999 881 (Mother)"
                value={emergencyContact}
                onChange={e => setEmergencyContact(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.baseSalary} (USD) *</label>
              <input
                type="number"
                placeholder="e.g. 350"
                value={baseSalary}
                onChange={e => setBaseSalary(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.dob}</label>
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.startDate}</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.photo} URL (Optional)</label>
              <input
                type="text"
                placeholder="https://..."
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.address} *</label>
              <textarea
                placeholder="e.g. Sangkat Olympic, Phnom Penh"
                rows={1}
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* User Account Auto-Creation Toggle Section */}
          {!editingStaff && (
            <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4.5 space-y-4" id="staff_user_account_link_box">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk_create_user_account"
                    checked={createUserAccount}
                    onChange={e => {
                      setCreateUserAccount(e.target.checked);
                      if (e.target.checked) {
                        setUserAccountUsername(fullName.toLowerCase().replace(/[^a-z0-9]/g, '_'));
                        setUserAccountEmail(`${fullName.toLowerCase().replace(/[^a-z0-9]/g, '')}@clean24.com`);
                        setUserAccountPassword('Clean24@123');
                        setUserAccountBranches([branchId]);
                      }
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                  />
                  <label htmlFor="chk_create_user_account" className="text-xs font-extrabold text-slate-800 cursor-pointer select-none">
                    Create Staff + User Account (Automatically generate login credentials)
                  </label>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-105 border border-slate-200 px-2 py-0.5 rounded text-slate-500">
                  {createUserAccount ? 'Full Integration' : 'Staff Only'}
                </span>
              </div>

              {createUserAccount && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 animate-fadeIn" id="user_account_fields_pane">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Username *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. srey_pich"
                      value={userAccountUsername}
                      onChange={e => setUserAccountUsername(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. srey.pich@clean24.com"
                      value={userAccountEmail}
                      onChange={e => setUserAccountEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">System Login Password *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pass@991"
                      value={userAccountPassword}
                      onChange={e => setUserAccountPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Assign System Role *</label>
                    <select
                      value={userAccountRole}
                      onChange={e => setUserAccountRole(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
                    >
                      <option value="Staff">Staff</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                      <option value="Owner">Owner</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Assign Branch Access Mapping * (Checkbox assignment)</label>
                    <div className="grid grid-cols-2 gap-3.5 bg-white p-3 rounded-xl border border-slate-200">
                      {branches.map(b => {
                        const isChecked = userAccountBranches.includes(b.id);
                        return (
                          <label key={b.id} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setUserAccountBranches(userAccountBranches.filter(id => id !== b.id));
                                } else {
                                  setUserAccountBranches([...userAccountBranches, b.id]);
                                }
                              }}
                              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer h-3.7 w-3.7"
                            />
                            <span>{b.branchName} ({b.branchCode})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

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

      {/* Roster profiles grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" id="staff_cards_grid">
        {filteredStaff.map(s => (
          <div 
            key={s.id} 
            className={`bg-white border rounded-2xl p-5 shadow-xs transition hover:shadow-md relative flex flex-col justify-between
              ${s.status === 'Active' ? 'border-slate-100' : s.status === 'Suspended' ? 'border-amber-200 bg-amber-50/5' : 'border-rose-100 bg-rose-50/5'}
            `}
          >
            {/* Status indicators */}
            <span className={`absolute top-4 right-4 px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider
              ${s.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : s.status === 'Suspended' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}
            `}>
              {s.status === 'Active' ? t.active : s.status === 'Suspended' ? t.suspended : t.resigned}
            </span>

            {/* Top segment profile details */}
            <div>
              <div className="flex gap-4 items-center mb-4">
                <img 
                  referrerPolicy="no-referrer"
                  src={s.photoUrl} 
                  alt={s.fullName} 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shrink-0"
                />
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{s.fullName}</h3>
                  <div className="flex gap-1.5 mt-1 items-center">
                    <span className="text-[9px] font-bold uppercase py-0.5 px-2 bg-slate-100 text-slate-600 rounded">
                      {s.position}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium font-mono">
                      {getBranchCode(s.branchId)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Roster fields listing */}
              <div className="space-y-2 text-xs border-t border-slate-50 pt-3 text-slate-505">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">{t.gender}:</span>
                  <span className="font-semibold text-slate-700">{s.gender}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">{t.phone}:</span>
                  <span className="font-semibold text-slate-700">{s.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">{t.shift}:</span>
                  <div className="flex items-center gap-1 font-semibold text-slate-700">
                    <Clock size={12} className="text-slate-400" />
                    <span>{s.shift}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">{t.idCard}:</span>
                  <span className="font-mono text-slate-600 font-bold">{s.idCardNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">{t.baseSalary}:</span>
                  <span className="font-bold text-emerald-600 font-mono">{formatCurrency(s.baseSalary, 'USD')}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-400 font-medium shrink-0">Emergency Contact:</span>
                  <span className="text-right text-slate-600 font-medium max-w-[130px] truncate">{s.emergencyContact}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-400 font-medium shrink-0 mb-1">{t.address}:</span>
                  <span className="text-right text-slate-600 max-w-[150px] truncate">{s.address}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions available for authorized managers/admins */}
            {['Owner', 'Admin'].includes(currentRole) && (
              <div className="mt-4 pt-3 border-t border-slate-50 flex gap-1.5 justify-end">
                <button
                  onClick={() => startEdit(s)}
                  className="flex items-center gap-1.5 text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg cursor-pointer"
                >
                  <Edit2 size={11} />
                  {t.edit}
                </button>
                <div className="flex gap-1">
                  {s.status === 'Active' ? (
                    <>
                      <button
                        onClick={() => toggleStaffStatus(s.id, 'Suspended')}
                        className="text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg cursor-pointer"
                      >
                        Suspend
                      </button>
                      <button
                        onClick={() => toggleStaffStatus(s.id, 'Resigned')}
                        className="text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg cursor-pointer"
                      >
                        Resign
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => toggleStaffStatus(s.id, 'Active')}
                      className="text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg cursor-pointer"
                    >
                      Re-activate
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
