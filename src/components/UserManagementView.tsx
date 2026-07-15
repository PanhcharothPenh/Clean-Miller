/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  ShieldAlert, 
  Key, 
  UserPlus, 
  CheckCircle2, 
  Mail, 
  MapPin, 
  Lock,
  Contact,
  X,
  ShieldCheck,
  History,
  Check,
  AlertCircle,
  ToggleLeft,
  Settings,
  Eye,
  RefreshCw,
  Search,
  CheckSquare,
  Square,
  Loader2
} from 'lucide-react';
import { User, Role, Branch, RoleDefinition, Permission, LoginHistoryLog } from '../types';
import { userApi, roleApi, logsApi } from '../utils/api';

interface UserManagementViewProps {
  currentRole: Role;
  activeBranchId: string;
  branches: Branch[];
  lang: 'en' | 'kh';
  onAddLog: (msg: string) => void;
}

export default function UserManagementView({
  currentRole,
  activeBranchId,
  branches,
  lang,
  onAddLog
}: UserManagementViewProps) {
  // Navigation Tabs inside UserManagement Suite: 'users' | 'roles' | 'history'
  const [subTab, setSubTab] = useState<'users' | 'roles' | 'history'>('users');

  // Loading States
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryLog[]>([]);

  // Form Open States & Fields
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('manager');
  const [assignedBranchIds, setAssignedBranchIds] = useState<string[]>(['b1']);

  // Password Reset Dialog
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [resetPasswordVal, setResetPasswordVal] = useState('');

  // Selected Role for Permission Map Editor
  const [selectedRoleForPerms, setSelectedRoleForPerms] = useState<RoleDefinition | null>(null);
  const [rolePermissionsList, setRolePermissionsList] = useState<string[]>([]);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Success/Error notifications
  const [banner, setBanner] = useState<{ type: 'success' | 'refuse' | 'error'; msg: string } | null>(null);

  const isOwner = currentRole === 'Owner' || currentRole === 'Admin'; // Admin can view but Owner gets full config

  useEffect(() => {
    if (isOwner) {
      loadData();
    }
  }, [isOwner, subTab]);

  const loadData = async () => {
    setLoading(true);
    setBanner(null);
    try {
      if (subTab === 'users') {
        const uList = await userApi.getUsers();
        setUsers(uList);
        const rList = await roleApi.getRoles();
        setRoles(rList);
      } else if (subTab === 'roles') {
        const rList = await roleApi.getRoles();
        setRoles(rList);
        const pList = await roleApi.getPermissions();
        setPermissions(pList);

        if (rList.length > 0 && !selectedRoleForPerms) {
          handleSelectRoleForPermissions(rList[0]);
        }
      } else if (subTab === 'history') {
        const logs = await logsApi.getLoginHistory();
        setLoginHistory(logs);
      }
    } catch (err: any) {
      setBanner({ type: 'error', msg: err?.message || 'Failed to download data from authentication server' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoleForPermissions = (roleDef: RoleDefinition) => {
    setSelectedRoleForPerms(roleDef);
    // Gather matching permission ids
    const activeIds = roleDef.permissions.map(p => p.id);
    setRolePermissionsList(activeIds);
  };

  const showBannerMessage = (type: 'success' | 'refuse' | 'error', msg: string) => {
    setBanner({ type, msg });
    setTimeout(() => {
      setBanner(null);
    }, 5000);
  };

  // Add standard user
  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email) return;

    setSubmitting(true);
    try {
      // role mapping based on roleId
      const mapping: Record<string, Role> = {
        owner: 'Owner',
        admin: 'Admin',
        manager: 'Manager',
        staff: 'Staff'
      };
      
      const payload = {
        fullName,
        username,
        email,
        phone,
        roleId: selectedRoleId,
        role: mapping[selectedRoleId] || 'Staff',
        password: password || 'ChangeMe@123',
        assignedBranchIds: selectedRoleId === 'owner' ? [] : assignedBranchIds,
        status: 'Active' as const
      };

      await userApi.createUser(payload);
      
      showBannerMessage('success', `Created safe login credential for "${fullName}" (${username}) under role ${payload.role}`);
      onAddLog(`Created authorization credentials for ${fullName}`);

      // clean fields
      setUsername('');
      setFullName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setAssignedBranchIds(['b1']);
      setShowForm(false);
      loadData();
    } catch (err: any) {
      showBannerMessage('error', err?.message || 'Error occurred while saving credentials');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBranchSelectToggle = (bId: string) => {
    if (assignedBranchIds.includes(bId)) {
      setAssignedBranchIds(assignedBranchIds.filter(x => x !== bId));
    } else {
      setAssignedBranchIds([...assignedBranchIds, bId]);
    }
  };

  // Toggle user status: Active / Inactive / Locked
  const handleToggleStatus = async (userObj: User, nextStatus: 'Active' | 'Inactive' | 'Locked') => {
    if (currentRole !== 'Owner') {
      showBannerMessage('refuse', 'Only the Owner is authorized to toggle status of other IAM credentials.');
      return;
    }
    if (userObj.role === 'Owner') {
      showBannerMessage('error', 'The primary system Owner account status cannot be deactivated or locked.');
      return;
    }

    try {
      await userApi.patchStatus(userObj.id, nextStatus);
      showBannerMessage('success', `User account of "${userObj.fullName}" is now set to ${nextStatus}.`);
      onAddLog(`Updated status of user ${userObj.username} to ${nextStatus}`);
      loadData();
    } catch (err: any) {
      showBannerMessage('error', err?.message || 'Failed to modify account settings');
    }
  };

  // Reset user password with forced reset flag active
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUser || !resetPasswordVal) return;

    try {
      await userApi.resetPassword(resetUser.id, resetPasswordVal);
      showBannerMessage('success', `Password reset successful! User "${resetUser.fullName}" must configure a new password on next login.`);
      onAddLog(`Force reset credentials passcode for ${resetUser.fullName}`);
      setResetUser(null);
      setResetPasswordVal('');
    } catch (err: any) {
      showBannerMessage('error', err?.message || 'Failed resetting credentials');
    }
  };

  // Toggle role permissions
  const handleTogglePermissionId = (permId: string) => {
    if (rolePermissionsList.includes(permId)) {
      setRolePermissionsList(rolePermissionsList.filter(id => id !== permId));
    } else {
      setRolePermissionsList([...rolePermissionsList, permId]);
    }
  };

  const handleSaveRolePermissions = async () => {
    if (!selectedRoleForPerms) return;
    if (currentRole !== 'Owner') {
      showBannerMessage('refuse', 'Permission configurations are exclusively restricted to the system Owner.');
      return;
    }
    if (selectedRoleForPerms.id === 'owner') {
      showBannerMessage('error', 'The Owner role is globally hard-linked to all module privileges and cannot be modified.');
      return;
    }

    setSubmitting(true);
    try {
      await roleApi.updateRolePermissions(selectedRoleForPerms.id, rolePermissionsList);
      showBannerMessage('success', `Granular security matrix updated successfully for role "${selectedRoleForPerms.name}"!`);
      onAddLog(`Updated permissions matrix for role: ${selectedRoleForPerms.name}`);
      
      // reload roles
      const freshRoles = await roleApi.getRoles();
      setRoles(freshRoles);
      const matched = freshRoles.find(r => r.id === selectedRoleForPerms.id);
      if (matched) setSelectedRoleForPerms(matched);
    } catch (err: any) {
      showBannerMessage('error', err?.message || 'Failed to update credentials matrix');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOwner) {
    return (
      <div className="bg-white border border-rose-100 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm" id="security_guard_notice">
        <ShieldAlert className="text-rose-500 mx-auto mb-4 animate-bounce" size={54} />
        <h3 className="text-lg font-bold text-slate-800">
          {lang === 'en' ? "Access Restriction Alert" : "ការព្រមានការកម្រិតសិទ្ធិ"}
        </h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          {lang === 'en' 
            ? "Your simulated user session does not possess Owner or Head Administrate credentials to configure enterprise IAM rules." 
            : "ការចូលប្រើសិទ្ធិអ្នកគ្រប់គ្រងគណនី និងអ្នកកំណត់សិទ្ធិទូទៅ គឺកំណត់សម្រាប់តែម្ចាស់ហាង (Owner) ឬអភិបាលប្រព័ន្ធ (Admin) ប៉ុណ្ណោះ។"}
        </p>
        <div className="mt-5 p-3.5 bg-slate-50 rounded-xl text-slate-400 font-mono text-xs">
          STRICT_DATA_SEPARATION_ENFORCED // role_required: Owner_or_Admin // user_role: {currentRole}
        </div>
      </div>
    );
  }

  // Filter users based on query
  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group permissions per module for the grid editor
  const modulesWithPermissions: Record<string, Permission[]> = {};
  permissions.forEach(p => {
    if (!modulesWithPermissions[p.module]) {
      modulesWithPermissions[p.module] = [];
    }
    modulesWithPermissions[p.module].push(p);
  });

  return (
    <div className="space-y-6" id="user_credential_module">
      {/* Tab Select Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-150 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={18} />
            User Identity & Role Configuration Security Matrix
          </h2>
          <span className="text-xs text-slate-400 block mt-0.5">
            Configure multi-branch logins, reset emergency passes, modify role matrix permissions, and examine chronological login audits.
          </span>
        </div>

        {/* Action Tabs selector */}
        <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0">
          <button
            onClick={() => { setSubTab('users'); setBanner(null); }}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer
              ${subTab === 'users' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}
            `}
            id="tab_users_profiles"
          >
            <Users size={14} />
            Users List
          </button>
          <button
            onClick={() => { setSubTab('roles'); setBanner(null); }}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer
              ${subTab === 'roles' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}
            `}
            id="tab_roles_permissions"
          >
            <Settings size={14} />
            Roles Matrix
          </button>
          <button
            onClick={() => { setSubTab('history'); setBanner(null); }}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer
              ${subTab === 'history' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}
            `}
            id="tab_login_history"
          >
            <History size={14} />
            Login History
          </button>
        </div>
      </div>

      {/* Global alert banner */}
      {banner && (
        <div className={`p-4 rounded-xl text-xs flex items-start gap-2.5 shadow-2xs animate-pulse
          ${banner.type === 'success' ? 'bg-emerald-50 border border-emerald-250 text-emerald-800' : 
            banner.type === 'refuse' ? 'bg-amber-50 border border-amber-250 text-amber-800' : 'bg-rose-50 border border-rose-250 text-rose-800'}
        `}>
          {banner.type === 'success' ? <CheckCircle2 size={15} className="mt-0.5 shrink-0" /> : <AlertCircle size={15} className="mt-0.5 shrink-0" />}
          <div>
            <strong className="font-bold uppercase block mb-0.5">{banner.type === 'success' ? 'Operation Success' : 'Security Warning'}</strong>
            <span>{banner.msg}</span>
          </div>
        </div>
      )}

      {/* SUB-VIEW 1: USERS DIRECTORY MANAGEMENT */}
      {subTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Search Input */}
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search by full name, ID, or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-slate-800 font-sans"
              />
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center justify-center gap-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition-all text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer shadow-md shadow-slate-900/10"
              id="btn_provision_user_trigger"
            >
              <UserPlus size={14} />
              Provision New User
            </button>
          </div>

          {/* Provision Form */}
          {showForm && (
            <form onSubmit={handleCreateUserSubmit} className="bg-white border border-slate-205 rounded-xl p-5 shadow-sm space-y-4 animate-in fade-in" id="form_create_user">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                  <Key size={14} className="text-emerald-500" />
                  Provision Secure Identity Credential
                </h4>
                <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Sok Reaksmey"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-slate-800 placeholder-slate-400 font-sans font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Username ID *</label>
                  <input
                    type="text"
                    placeholder="e.g. reaksmey_cashier"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-slate-800 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email address *</label>
                  <input
                    type="email"
                    placeholder="e.g. reaksmey@clean24.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-slate-800 placeholder-slate-400 font-sans font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 096 444 555"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-slate-800 font-sans"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Initial Password</label>
                  <input
                    type="password"
                    placeholder="Temporary (Defaults to ChangeMe@123)"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-slate-800 placeholder-slate-400 font-sans"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">System Role *</label>
                  <select
                    value={selectedRoleId}
                    onChange={e => setSelectedRoleId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 focus:outline-none font-sans font-bold cursor-pointer"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedRoleId !== 'owner' && (
                  <div className="sm:col-span-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Assigned Scope Branches * (Strict Access Restrictions Active)
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1 font-bold">
                      {branches.map(b => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => handleBranchSelectToggle(b.id)}
                          className={`px-3 py-1.5 rounded-lg border text-[11px] transition duration-200 cursor-pointer flex items-center gap-1.5
                            ${assignedBranchIds.includes(b.id) 
                              ? 'bg-slate-800 border-slate-900 text-white shadow-xs' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }
                          `}
                        >
                          {assignedBranchIds.includes(b.id) ? <Check size={12} /> : null}
                          {b.branchName} ({b.branchCode})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 font-semibold">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/10 cursor-pointer"
                  id="btn_confirm_provision"
                >
                  {submitting && <Loader2 className="animate-spin" size={13} />}
                  <span>Confirm Account Provision &nbsp; &rarr;</span>
                </button>
              </div>
            </form>
          )}

          {/* User Passcode Reset Dialog Modal */}
          {resetUser && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
                <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Key className="text-amber-500 animate-bounce" size={16} />
                  Force Password Reset
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Reset credentials for user <strong className="font-bold text-slate-800">{resetUser.fullName}</strong>. The user's status will require a password change on their first login.
                </p>

                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      New Secure Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 chars and a number"
                      value={resetPasswordVal}
                      onChange={e => setResetPasswordVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-slate-850 font-sans"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-50 font-semibold text-xs">
                    <button
                      type="button"
                      onClick={() => setResetUser(null)}
                      className="px-3.5 py-2 border border-slate-200 text-slate-500 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-850 text-white rounded-lg hover:bg-slate-750"
                    >
                      Reset and Force Change
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white border border-slate-150 rounded-2xl shadow-2xs overflow-hidden">
            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-emerald-500" size={24} />
                <span>Downloading Secure Accounts Ledger...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left" id="tbl_iam_users">
                  <thead className="text-[10px] font-bold text-slate-400 bg-slate-50/50 border-b border-slate-150 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Full Identity Name</th>
                      <th className="px-4 py-4">Username ID</th>
                      <th className="px-4 py-4">Contact Detail</th>
                      <th className="px-4 py-4">Security Role</th>
                      <th className="px-4 py-4">Assigned Scope Branches</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-slate-400 text-xs">
                          No identity accounts match your search filters.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/40 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8.5 h-8.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center uppercase shadow-3xs border border-slate-200 shrink-0 select-none">
                                {u.fullName.charAt(0)}
                              </div>
                              <div>
                                <strong className="text-slate-800 text-xs font-bold block">{u.fullName}</strong>
                                <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
                                  UUID: {u.id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 font-mono font-extrabold text-slate-600">{u.username}</td>
                          <td className="px-4 py-4">
                            <div className="space-y-0.5">
                              <div className="text-slate-600 font-sans flex items-center gap-1 select-all">
                                <Mail size={12} className="text-slate-400 shrink-0" />
                                {u.email}
                              </div>
                              {u.phone && <div className="text-[10px] text-slate-400 select-all font-sans">{u.phone}</div>}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-wider border select-none
                              ${u.role === 'Owner' ? 'bg-slate-900 border-slate-950 text-white' : 
                                u.role === 'Admin' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 
                                u.role === 'Manager' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                                'bg-slate-50 border-slate-200 text-slate-600'}
                            `}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-1">
                              {u.role === 'Owner' ? (
                                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded text-[9px] uppercase tracking-wider">
                                  Full System Authority
                                </span>
                              ) : u.assignedBranchIds.length === 0 ? (
                                <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 font-bold rounded text-[9px] uppercase tracking-wider">
                                  No Branches Appointed
                                </span>
                              ) : (
                                u.assignedBranchIds.map(bId => {
                                  const name = branches.find(b => b.id === bId)?.branchName || bId;
                                  return (
                                    <span key={bId} className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[9px] font-sans font-semibold">
                                      📍 {name.replace('Clean24 ', '')}
                                    </span>
                                  );
                                })
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border select-none
                              ${u.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                                u.status === 'Inactive' ? 'bg-slate-50 border-slate-200 text-slate-400' : 
                                'bg-rose-50 border-rose-250 text-rose-700'}
                            `}>
                              {u.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {u.role !== 'Owner' && (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => setResetUser(u)}
                                  className="text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 font-bold p-1 rounded-lg transition"
                                  title="Reset security passcode"
                                >
                                  <Key size={14} />
                                </button>
                                
                                {u.status === 'Active' ? (
                                  <button
                                    onClick={() => handleToggleStatus(u, 'Locked')}
                                    className="bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-1 rounded-lg transition shrink-0"
                                  >
                                    Lock Account
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleToggleStatus(u, 'Active')}
                                    className="bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-lg transition"
                                  >
                                    Unlock / Activate
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: GRANULAR ROLE & PERMISSIONS MATRIX */}
      {subTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {/* Role selector panel */}
          <div className="md:col-span-1 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">
              Select Role to Configure
            </h3>

            <div className="bg-white border border-slate-150 rounded-xl divide-y divide-slate-100 overflow-hidden shadow-3xs">
              {roles.map(r => {
                const isSelected = selectedRoleForPerms?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRoleForPermissions(r)}
                    className={`w-full text-left p-3.5 transition-all outline-none flex items-start gap-3
                      ${isSelected ? 'bg-slate-800 text-white' : 'bg-white hover:bg-slate-50 text-slate-700'}
                    `}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <div>
                      <strong className={`text-xs block font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                        {r.name}
                      </strong>
                      <span className={`text-[10px] leading-relaxed block mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {r.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[11px] leading-relaxed text-amber-800">
              <strong className="font-bold block mb-1">💡 Sandbox Protection Rule:</strong>
              When defining roles on the client, modifications sync securely to the background server. Custom roles are fully supportable by adding roles dynamically over the REST API.
            </div>
          </div>

          {/* Granular Permission Toggles Editor Grid */}
          <div className="md:col-span-2 space-y-4">
            {selectedRoleForPerms && (
              <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center pb-3.5 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Privilege Matrix Matrix for: <strong className="text-emerald-600">{selectedRoleForPerms.name}</strong>
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Configure allowed granular actions for this credentials class.
                    </p>
                  </div>

                  <button
                    onClick={handleSaveRolePermissions}
                    disabled={submitting || selectedRoleForPerms.id === 'owner'}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-all active:scale-[0.98]"
                    id="btn_save_permissions_matrix"
                  >
                    {submitting && <Loader2 className="animate-spin" size={13} />}
                    <span>Save Custom Matrix</span>
                  </button>
                </div>

                {selectedRoleForPerms.id === 'owner' && (
                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl text-xs text-emerald-400 flex items-start gap-2">
                    <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                    <span>The system Owner possesses absolute root administrative parameters across all modules and cannot be edited.</span>
                  </div>
                )}

                {/* Permissions Grid Editor partitioned per module */}
                <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                  {Object.entries(modulesWithPermissions).map(([modName, perms]) => (
                    <div key={modName} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                      <h4 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-2">
                        {modName} Module
                      </h4>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {perms.map(p => {
                          const active = rolePermissionsList.includes(p.id);
                          const disabled = selectedRoleForPerms.id === 'owner';
                          
                          return (
                            <button
                              key={p.id}
                              type="button"
                              disabled={disabled}
                              onClick={() => handleTogglePermissionId(p.id)}
                              className={`px-2.5 py-1.5 border rounded-lg text-[10px] font-semibold transition cursor-pointer flex items-center justify-between text-left gap-1
                                ${active 
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                }
                              `}
                            >
                              <span className="truncate">{p.action}</span>
                              {active ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 shrink-0"></span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: SECURITY AUDIT LOGIN HISTORY LOGS */}
      {subTab === 'history' && (
        <div className="bg-white border border-slate-150 rounded-2xl shadow-2xs overflow-hidden font-sans">
          <div className="p-4 border-b border-slate-150 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Secure Audit Audited Logins
            </h3>
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              <RefreshCw className={loading ? 'animate-spin' : ''} size={14} />
              Reload Logs
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left" id="tbl_iam_login_history">
              <thead className="text-[10px] font-bold text-slate-400 bg-slate-50/50 border-b border-slate-150 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Access User ID / Email</th>
                  <th className="px-4 py-4">IP Address</th>
                  <th className="px-4 py-4">Client User-Agent details</th>
                  <th className="px-4 py-4">Audit Timestamp</th>
                  <th className="px-6 py-4 text-right">Authentication Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-600 font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      Downloading security logs from auditing agent...
                    </td>
                  </tr>
                ) : loginHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      No security logins recorded yet on the node.
                    </td>
                  </tr>
                ) : (
                  loginHistory.map((l, index) => (
                    <tr key={l.id || index} className="hover:bg-slate-50/40 transition">
                      <td className="px-6 py-4 font-sans">
                        <strong className="text-slate-800 font-bold block">{l.username}</strong>
                        {l.userId && <span className="text-[9px] text-slate-450 block font-mono mt-0.5">UID: {l.userId}</span>}
                      </td>
                      <td className="px-4 py-4 text-slate-500 select-all">{l.ipAddress}</td>
                      <td className="px-4 py-4 text-slate-400 select-all max-w-sm truncate text-[10px]">{l.device}</td>
                      <td className="px-4 py-4 text-slate-450 font-sans">
                        {l.timestamp.replace('T', ' ').substring(0, 19)} UTC
                      </td>
                      <td className="px-6 py-4 text-right font-sans">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold select-none border
                          ${l.status === 'Success' ? 'bg-emerald-50 border-emerald-200 text-emerald-650' : 
                            l.status === 'Failed_Locked' ? 'bg-amber-50 border-amber-250 text-amber-700' : 
                            'bg-rose-50 border-rose-200 text-rose-650'}
                        `}>
                          {l.status === 'Success' ? '✔ AUTHORIZED SUCCESS' : `❌ ${l.status.toUpperCase()}`}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
