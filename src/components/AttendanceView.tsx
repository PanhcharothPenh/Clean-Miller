/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  ShieldAlert, 
  UserPlus, 
  UserMinus,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react';
import { Attendance, Staff, Role, Branch } from '../types';
import { translations } from '../mockData';

interface AttendanceViewProps {
  currentRole: Role;
  activeBranchId: string;
  branches: Branch[];
  staffList: Staff[];
  attendance: Attendance[];
  setAttendance: React.Dispatch<React.SetStateAction<Attendance[]>>;
  lang: 'en' | 'kh';
  onAddLog: (msg: string) => void;
}

export default function AttendanceView({
  currentRole,
  activeBranchId,
  branches,
  staffList,
  attendance,
  setAttendance,
  lang,
  onAddLog
}: AttendanceViewProps) {
  const t = translations[lang];
  const [showLogModal, setShowLogModal] = useState(false);

  // Form Fields
  const [staffId, setStaffId] = useState('');
  const [date, setDate] = useState('2026-06-06');
  const [checkIn, setCheckIn] = useState('06:00 AM');
  const [checkOut, setCheckOut] = useState('04:00 PM');
  const [shiftType, setShiftType] = useState('Full Time');
  const [workHours, setWorkHours] = useState(8);
  const [otHours, setOtHours] = useState(0);
  const [status, setStatus] = useState<'Present' | 'Absent' | 'Late' | 'Day Off'>('Present');

  // 1. Roles access: block Staff role
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

  // 2. Filter records based on branch constraints (Manager sees only assigned branch)
  const getFilteredAttendance = () => {
    let list = attendance;

    if (currentRole === 'Manager') {
      list = list.filter(a => a.branchId === 'b1');
    } else if (currentRole === 'Admin') {
      list = list.filter(a => a.branchId === 'b1' || a.branchId === 'b2');
    }

    if (activeBranchId !== 'all') {
      list = list.filter(a => a.branchId === activeBranchId);
    }

    // Sort by most recent date
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  };

  const filteredAttendance = getFilteredAttendance();

  // Find staff options who can be logged
  const getAccessibleStaffOptions = () => {
    let list = staffList.filter(s => s.status === 'Active');
    if (currentRole === 'Manager') {
      list = list.filter(s => s.branchId === 'b1');
    }
    return list;
  };

  const accessibleStaffOptions = getAccessibleStaffOptions();

  const handleLogClockEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffId) return;

    const chosenStaff = staffList.find(x => x.id === staffId);
    if (!chosenStaff) return;

    const newRow: Attendance = {
      id: 'att_' + Date.now(),
      branchId: chosenStaff.branchId,
      staffId,
      staffName: chosenStaff.fullName,
      date,
      checkIn: status === 'Absent' || status === 'Day Off' ? '' : checkIn,
      checkOut: status === 'Absent' || status === 'Day Off' ? '' : checkOut,
      shiftType: chosenStaff.shift,
      workHours: status === 'Absent' || status === 'Day Off' ? 0 : Number(workHours),
      overtimeHours: status === 'Absent' || status === 'Day Off' ? 0 : Number(otHours),
      status
    };

    // Prevent duplicate entries for same staff on same date
    const duplicatesRemoved = attendance.filter(x => !(x.staffId === staffId && x.date === date));
    setAttendance([newRow, ...duplicatesRemoved]);
    onAddLog(`Logged clock event for "${chosenStaff.fullName}" on ${date} as [${status}]`);
    
    // Reset
    setStaffId('');
    setShowLogModal(false);
  };

  const getBranchCode = (bId: string) => {
    const b = branches.find(x => x.id === bId);
    return b ? b.branchCode : bId;
  };

  return (
    <div className="space-y-6" id="attendance_management_module">
      {/* Header and Toggle Modal panel */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-800">{t.attendance}</h2>
          <span className="text-[11px] text-slate-400 block mt-0.5">Track shifts, control late timing, audit overtime logs, and enforce branch standards.</span>
        </div>
        
        {['Owner', 'Admin', 'Manager'].includes(currentRole) && (
          <button
            onClick={() => {
              if (accessibleStaffOptions.length > 0) {
                setStaffId(accessibleStaffOptions[0].id);
              }
              setShowLogModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-200 hover:bg-emerald-500 transition cursor-pointer"
            id="register_clock_event_btn"
          >
            <Plus size={14} />
            Log Clock Event
          </button>
        )}
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-3xs flex justify-between items-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Today Present</span>
            <span className="text-base font-bold text-slate-800 mt-1 block">
              {filteredAttendance.filter(a => a.date === '2026-06-06' && a.status === 'Present').length} Staffs
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">✓</div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-3xs flex justify-between items-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Today Overtime</span>
            <span className="text-base font-bold text-slate-800 mt-1 block">
              {filteredAttendance.filter(a => a.date === '2026-06-06').reduce((sum, current) => sum + current.overtimeHours, 0)} Hrs
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">OT</div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-3xs flex justify-between items-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Today Lates</span>
            <span className="text-base font-bold text-slate-800 mt-1 block">
              {filteredAttendance.filter(a => a.date === '2026-06-06' && a.status === 'Late').length} Staffs
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">L</div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-3xs flex justify-between items-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Absent Outliers</span>
            <span className="text-base font-bold text-slate-800 mt-1 block">
              {filteredAttendance.filter(a => a.status === 'Absent').length} Days
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">A</div>
        </div>
      </div>

      {/* Main Logs listing table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left" id="attendance_logs_table">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-50 border-b border-slate-100 font-bold">
              <tr>
                <th className="px-6 py-3">Employee</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Log Date</th>
                <th className="px-4 py-3">Duty Time</th>
                <th className="px-4 py-3">Work Hours</th>
                <th className="px-4 py-3">Overtime Hours</th>
                <th className="px-4 py-3">Shift</th>
                <th className="px-6 py-3 text-right">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendance.map(att => (
                <tr key={att.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold font-mono text-[10px] uppercase">
                        {att.staffName.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800">{att.staffName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded text-[10px]">
                      {getBranchCode(att.branchId)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600 font-semibold">{att.date}</td>
                  <td className="px-4 py-4 font-mono text-slate-600">
                    {att.checkIn ? `${att.checkIn} – ${att.checkOut}` : '—'}
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-700">{att.workHours} Hrs</td>
                  <td className="px-4 py-4">
                    {att.overtimeHours > 0 ? (
                      <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">{att.overtimeHours} Hrs OT</span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-4 text-slate-600">{att.shiftType}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                      ${att.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : 
                        att.status === 'Late' ? 'bg-amber-100 text-amber-800' : 
                        att.status === 'Absent' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'}
                    `}>
                      {att.status === 'Present' ? t.present : 
                       att.status === 'Late' ? t.late : 
                       att.status === 'Absent' ? t.absent : t.dayOff}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredAttendance.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-450 bg-slate-50/25">
                    No active attendance logged for the selected filter view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CLOCK LOG MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="attendance_modal_clock">
          <div className="bg-white border border-slate-100 rounded-2xl max-w-md w-full shadow-lg p-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-800 text-sm">Log Attendance Mark</h4>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <form onSubmit={handleLogClockEvent} className="space-y-4 pt-4" id="form_log_attendance">
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">Staff Employee *</label>
                <select
                  value={staffId}
                  onChange={e => setStaffId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
                  required
                >
                  <option value="">-- Choose Employee --</option>
                  {accessibleStaffOptions.map(st => (
                    <option key={st.id} value={st.id}>{st.fullName} ({st.position} - {getBranchCode(st.branchId)})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">Log Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">Work Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late Arrival</option>
                    <option value="Absent">Absent</option>
                    <option value="Day Off">Day Off / Official</option>
                  </select>
                </div>

                {status !== 'Absent' && status !== 'Day Off' && (
                  <>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1 block">Check In Time</label>
                      <input
                        type="text"
                        placeholder="e.g. 06:15 AM"
                        value={checkIn}
                        onChange={e => setCheckIn(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1 block">Check Out Time</label>
                      <input
                        type="text"
                        placeholder="e.g. 04:00 PM"
                        value={checkOut}
                        onChange={e => setCheckOut(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1 block">Work Hours</label>
                      <input
                        type="number"
                        value={workHours}
                        onChange={e => setWorkHours(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1 block">Overtime Hours</label>
                      <input
                        type="number"
                        value={otHours}
                        onChange={e => setOtHours(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-200 hover:bg-emerald-500 cursor-pointer"
                >
                  Confirm Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
