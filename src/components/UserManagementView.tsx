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
  Loader2,
  Edit,
  Trash2
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
  const [editUser, setEditUser] = useState<User | null>(null);
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

  // Bilingual translation dictionary
  const t = {
    en: {
      title: "User Identity & Role Configuration Security Matrix",
      subtitle: "Configure multi-branch logins, reset emergency passes, modify role matrix permissions, and examine chronological login audits.",
      usersList: "Users List",
      rolesMatrix: "Roles Matrix",
      loginHistory: "Login History",
      searchPlaceholder: "Search by full name, ID, or email...",
      provisionNew: "Provision New User",
      formTitle: "Provision Secure Identity Credential",
      formEditTitle: "Update Secure Identity Credential",
      fullName: "Full Name",
      fullNamePlaceholder: "e.g. Sok Reaksmey",
      username: "Username ID",
      usernamePlaceholder: "e.g. reaksmey_cashier",
      email: "Email address",
      emailPlaceholder: "e.g. reaksmey@clean24.com",
      phone: "Phone Number",
      phonePlaceholder: "e.g. 096 444 555",
      password: "Password",
      passwordEditHelp: "leave blank to keep current",
      passwordPlaceholder: "Temporary (Defaults to ChangeMe@123)",
      role: "System Role",
      assignedBranches: "Assigned Scope Branches * (Strict Access Restrictions Active)",
      cancel: "Cancel",
      confirm: "Confirm Account Provision",
      confirmEdit: "Update User Information",
      actions: "Actions",
      status: "Status",
      emptyAlert: "No identity accounts match your search filters.",
      forcePasswordReset: "Force Password Reset",
      forcePasswordResetDesc: "Reset credentials for user. The user's status will require a password change on their first login.",
      newSecurePassword: "New Secure Password",
      resetAndForce: "Reset and Force Change",
      privilegeMatrixFor: "Privilege Matrix for:",
      configureAllowedActions: "Configure allowed granular actions for this credentials class.",
      saveCustomMatrix: "Save Custom Matrix",
      ownerPrivilegeNotice: "The system Owner possesses absolute root administrative parameters across all modules and cannot be edited.",
      selectRoleToConfigure: "Select Role to Configure",
                  secureAuditLogins: "Secure Audit Audited Logins",
      reloadLogs: "Reload Logs",
      tblIdentityEmail: "Access User ID / Email",
      tblIpAddress: "IP Address",
      tblClientUserAgent: "Client User-Agent details",
      tblAuditTimestamp: "Audit Timestamp",
      tblVerdict: "Authentication Verdict",
      downloadingLogs: "Downloading security logs from auditing agent...",
      noLoginsRecorded: "No security logins recorded yet on the node.",
      downloadingAccounts: "Downloading Secure Accounts Ledger...",
      tblFullName: "Full Identity Name",
      tblUsername: "Username ID",
      tblContact: "Contact Detail",
      tblRole: "Security Role",
      tblBranches: "Assigned Scope Branches",
      tblStatus: "Status",
      resetTooltip: "Reset security passcode",
      editTooltip: "Edit User Info",
      deleteTooltip: "Delete User",
      securityAlert: "Access Restriction Alert",
      securityGuardDesc: "This security module is strictly partitioned for the system Owner. You do not possess authorized clearance keys to analyze or modify user access control credentials.",
      lockLabel: "Lock Account",
      unlockLabel: "Unlock / Activate",
      createSuccess: "Created safe login credential for",
      updateSuccess: "Successfully updated user credentials for",
      deleteSuccess: "Successfully deleted user account",
      statusSuccess: "User account status updated successfully.",
      resetSuccess: "Password reset successful! User must configure a new password on next login.",
      roleSaveSuccess: "Granular security matrix updated successfully for role",
      deleteConfirmText: "Are you sure you want to delete user account",
      ownerDeleteRefuse: "The primary system Owner account cannot be deleted.",
      deleteAuthRefuse: "Only the Owner is authorized to delete accounts.",
      ownerStatusRefuse: "The primary system Owner account status cannot be deactivated or locked.",
      statusAuthRefuse: "Only the Owner is authorized to toggle status of other IAM credentials.",
      permsAuthRefuse: "Permission configurations are exclusively restricted to the system Owner.",
      ownerPermsRefuse: "The Owner role is globally hard-linked to all module privileges and cannot be modified."
    },
    kh: {
      title: "ប្រព័ន្ធគ្រប់គ្រងគណនី និងសិទ្ធិប្រើប្រាស់",
      subtitle: "កំណត់ការចូលប្រើប្រាស់សាខាច្រើន កំណត់លេខសម្ងាត់ឡើងវិញ កែប្រែសិទ្ធិតួនាទី និងពិនិត្យមើលកំណត់ហេតុសកម្មភាពចូលប្រព័ន្ធ។",
      usersList: "បញ្ជីគណនី",
      rolesMatrix: "តារាងសិទ្ធិតួនាទី",
      loginHistory: "ប្រវត្តិចូលប្រព័ន្ធ",
      searchPlaceholder: "ស្វែងរកតាមឈ្មោះពេញ អត្តសញ្ញាណ ឬអ៊ីមែល...",
      provisionNew: "បង្កើតគណនីថ្មី",
      formTitle: "បង្កើតព័ត៌មានគណនីសុវត្ថិភាព",
      formEditTitle: "កែសម្រួលព័ត៌មានគណនីសុវត្ថិភាព",
      fullName: "ឈ្មោះពេញ",
      fullNamePlaceholder: "ឧ. សុខ រស្មី",
      username: "ឈ្មោះគណនី (Username)",
      usernamePlaceholder: "ឧ. reaksmey_cashier",
      email: "អាសយដ្ឋានអ៊ីមែល",
      emailPlaceholder: "ឧ. reaksmey@clean24.com",
      phone: "លេខទូរស័ព្ទ",
      phonePlaceholder: "ឧ. 096 444 555",
      password: "លេខកូដសម្ងាត់",
      passwordEditHelp: "ទុកទទេបើមិនចង់ប្តូរ",
      passwordPlaceholder: "លេខកូដបណ្តោះអាសន្ន (លំនាំដើម ChangeMe@123)",
      role: "តួនាទីប្រព័ន្ធ",
      assignedBranches: "សាខាដែលបានចាត់តាំង * (សិទ្ធិរឹតត្បិតសាខាត្រូវបានបើក)",
      cancel: "បោះបង់",
      confirm: "បញ្ជាក់ការបង្កើតគណនី",
      confirmEdit: "រក្សាទុកការកែប្រែ",
      actions: "សកម្មភាព",
      status: "ស្ថានភាព",
      emptyAlert: "រកមិនឃើញគណនីដែលត្រូវគ្នានឹងការស្វែងរករបស់អ្នកទេ។",
      forcePasswordReset: "បង្ខំឱ្យកំណត់លេខសម្ងាត់ឡើងវិញ",
      forcePasswordResetDesc: "កំណត់លេខសម្ងាត់ថ្មីសម្រាប់គណនីនេះ។ គណនីនេះនឹងតម្រូវឱ្យប្តូរលេខសម្ងាត់ពេលចូលប្រព័ន្ធលើកក្រោយ។",
      newSecurePassword: "លេខកូដសម្ងាត់សុវត្ថិភាពថ្មី",
      resetAndForce: "កំណត់ឡើងវិញ និងបង្ខំប្តូរ",
      privilegeMatrixFor: "តារាងសិទ្ធិសម្រាប់តួនាទី៖",
      configureAllowedActions: "កំណត់សិទ្ធិលម្អិតដែលអាចធ្វើបានសម្រាប់តួនាទីគណនីនេះ។",
      saveCustomMatrix: "រក្សាទុកសិទ្ធិតួនាទី",
      ownerPrivilegeNotice: "ម្ចាស់ហាងចម្បង (Owner) មានសិទ្ធិពេញលេញលើគ្រប់ផ្នែកទាំងអស់ ហើយមិនអាចកែប្រែបានឡើយ។",
      selectRoleToConfigure: "ជ្រើសរើសតួនាទីដើម្បីកំណត់សិទ្ធិ",
                  secureAuditLogins: "កំណត់ហេតុសុវត្ថិភាពនៃការចូលប្រព័ន្ធ",
      reloadLogs: "ទាញយកប្រវត្តិឡើងវិញ",
      tblIdentityEmail: "ឈ្មោះគណនី / អ៊ីមែល",
      tblIpAddress: "អាសយដ្ឋាន IP",
      tblClientUserAgent: "ព័ត៌មានឧបករណ៍/កម្មវិធីរុករក",
      tblAuditTimestamp: "ម៉ោងចូលប្រព័ន្ធ",
      tblVerdict: "លទ្ធផលនៃការផ្ទៀងផ្ទាត់",
      downloadingLogs: "កំពុងទាញយកកំណត់ហេតុសុវត្ថិភាពពីម៉ាស៊ីនមេ...",
      noLoginsRecorded: "មិនទាន់មានកំណត់ហេតុនៃការចូលប្រព័ន្ធណាមួយឡើយ។",
      downloadingAccounts: "កំពុងទាញយកបញ្ជីគណនីប្រើប្រាស់...",
      tblFullName: "ឈ្មោះពេញគណនី",
      tblUsername: "ឈ្មោះគណនី (Username)",
      tblContact: "ព័ត៌មានទំនាក់ទំនង",
      tblRole: "តួនាទីសន្តិសុខ",
      tblBranches: "សាខាដែលបានចាត់តាំង",
      tblStatus: "ស្ថានភាព",
      resetTooltip: "កំណត់លេខសម្ងាត់ឡើងវិញ",
      editTooltip: "កែសម្រួលគណនី",
      deleteTooltip: "លុបគណនី",
      securityAlert: "ការព្រមានការកម្រិតសិទ្ធិ",
      securityGuardDesc: "ផ្នែកគ្រប់គ្រងសិទ្ធិនេះត្រូវបានកំណត់យ៉ាងតឹងរ៉ឹងសម្រាប់តែគណនីម្ចាស់ហាង (Owner) តែប៉ុណ្ណោះ។ លោកអ្នកគ្មានសិទ្ធិគ្រប់គ្រាន់ដើម្បីវិភាគ ឬកែប្រែគណនីអ្នកប្រើប្រាស់ឡើយ។",
      lockLabel: "ចាក់សោគណនី",
      unlockLabel: "ដោះសោ / ធ្វើឱ្យសកម្ម",
      createSuccess: "បានបង្កើតគណនីសុវត្ថិភាពសម្រាប់",
      updateSuccess: "បានកែសម្រួលព័ត៌មានគណនីដោយជោគជ័យសម្រាប់",
      deleteSuccess: "បានលុបគណនីអ្នកប្រើប្រាស់ដោយជោគជ័យ",
      statusSuccess: "បានធ្វើបច្ចុប្បន្នភាពស្ថានភាពគណនីដោយជោគជ័យ។",
      resetSuccess: "បានកំណត់លេខសម្ងាត់ឡើងវិញជោគជ័យ! អ្នកប្រើប្រាស់ត្រូវប្តូរលេខសម្ងាត់ពេលចូលប្រព័ន្ធលើកក្រោយ។",
      roleSaveSuccess: "បានរក្សាទុកតារាងសិទ្ធិប្រើប្រាស់ដោយជោគជ័យសម្រាប់តួនាទី",
      deleteConfirmText: "តើអ្នកពិតជាចង់លុបគណនីអ្នកប្រើប្រាស់មែនទេ៖",
      ownerDeleteRefuse: "គណនីម្ចាស់ហាងចម្បង (Owner) មិនអាចលុបបានទេ។",
      deleteAuthRefuse: "មានតែម្ចាស់ហាង (Owner) ទេដែលអាចលុបគណនីបាន។",
      ownerStatusRefuse: "គណនីម្ចាស់ហាងចម្បងមិនអាចបិទដំណើរការ ឬចាក់សោបានទេ។",
      statusAuthRefuse: "មានតែម្ចាស់ហាង (Owner) ទេដែលអាចផ្លាស់ប្តូរស្ថានភាពគណនីបាន។",
      permsAuthRefuse: "ការកំណត់សិទ្ធិត្រូវបានអនុញ្ញាតសម្រាប់តែគណនីម្ចាស់ហាង (Owner) តែប៉ុណ្ណោះ។",
      ownerPermsRefuse: "តួនាទីម្ចាស់ហាង (Owner) មានសិទ្ធិគ្រប់សកម្មភាពទាំងអស់ជាអចិន្ត្រៃយ៍ និងមិនអាចកែប្រែបានឡើយ។"
    }
  }[lang];

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

  // Add or Update user
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
      
      const payload: any = {
        fullName,
        username,
        email,
        phone,
        roleId: selectedRoleId,
        role: mapping[selectedRoleId] || 'Staff',
        assignedBranchIds: selectedRoleId === 'owner' ? [] : assignedBranchIds
      };

      if (editUser) {
        if (password) {
          payload.password = password;
        }
        await userApi.updateUser(editUser.id, payload);
        showBannerMessage('success', `${t.updateSuccess} "${fullName}" (${username})`);
        onAddLog(`Updated account credentials for ${fullName}`);
      } else {
        payload.password = password || 'ChangeMe@123';
        payload.status = 'Active';
        await userApi.createUser(payload);
        showBannerMessage('success', `${t.createSuccess} "${fullName}" (${username})`);
        onAddLog(`Created authorization credentials for ${fullName}`);
      }

      // clean fields
      setUsername('');
      setFullName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setAssignedBranchIds(['b1']);
      setEditUser(null);
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
      showBannerMessage('refuse', t.statusAuthRefuse);
      return;
    }
    if (userObj.role === 'Owner') {
      showBannerMessage('error', t.ownerStatusRefuse);
      return;
    }

    try {
      await userApi.patchStatus(userObj.id, nextStatus);
      showBannerMessage('success', `${t.statusSuccess} "${userObj.fullName}" ➡️ ${nextStatus}.`);
      onAddLog(`Updated status of user ${userObj.username} to ${nextStatus}`);
      loadData();
    } catch (err: any) {
      showBannerMessage('error', err?.message || 'Failed to modify account settings');
    }
  };

  // Delete user account
  const handleDeleteUser = async (userObj: User) => {
    if (currentRole !== 'Owner') {
      showBannerMessage('refuse', t.deleteAuthRefuse);
      return;
    }
    if (userObj.role === 'Owner') {
      showBannerMessage('error', t.ownerDeleteRefuse);
      return;
    }

    const confirmText = `${t.deleteConfirmText} "${userObj.fullName}" (${userObj.username})?`;
    if (window.confirm(confirmText)) {
      try {
        await userApi.deleteUser(userObj.id);
        showBannerMessage('success', `${t.deleteSuccess}: "${userObj.fullName}"`);
        onAddLog(`Deleted user account: ${userObj.username}`);
        loadData();
      } catch (err: any) {
        showBannerMessage('error', err?.message || 'Failed to delete user account');
      }
    }
  };

  // Reset user password with forced reset flag active
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUser || !resetPasswordVal) return;

    try {
      await userApi.resetPassword(resetUser.id, resetPasswordVal);
      showBannerMessage('success', t.resetSuccess);
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
      showBannerMessage('refuse', t.permsAuthRefuse);
      return;
    }
    if (selectedRoleForPerms.id === 'owner') {
      showBannerMessage('error', t.ownerPermsRefuse);
      return;
    }

    setSubmitting(true);
    try {
      await roleApi.updateRolePermissions(selectedRoleForPerms.id, rolePermissionsList);
      showBannerMessage('success', `${t.roleSaveSuccess} "${selectedRoleForPerms.name}"!`);
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
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-2">
          {t.securityAlert}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          {t.securityGuardDesc}
        </p>
      </div>
    );
  }

  // Filter users list based on search term
  const filteredUsers = users.filter(u => {
    if (searchQuery.trim() === '') return true;
    const query = searchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(query) ||
      u.username.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.id.toLowerCase().includes(query)
    );
  });

  // Group permissions per module for the grid editor
  const modulesWithPermissions = permissions.reduce((acc, p) => {
    if (!acc[p.module]) acc[p.module] = [];
    acc[p.module].push(p);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6" id="user_credential_module">
      {/* Tab Select Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-150 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={18} />
            {t.title}
          </h2>
          <span className="text-xs text-slate-400 block mt-0.5 font-sans">
            {t.subtitle}
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
            {t.usersList}
          </button>
          <button
            onClick={() => { setSubTab('roles'); setBanner(null); }}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer
              ${subTab === 'roles' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}
            `}
            id="tab_roles_permissions"
          >
            <Settings size={14} />
            {t.rolesMatrix}
          </button>
          <button
            onClick={() => { setSubTab('history'); setBanner(null); }}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer
              ${subTab === 'history' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}
            `}
            id="tab_login_history"
          >
            <History size={14} />
            {t.loginHistory}
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
            <strong className="font-bold uppercase block mb-0.5">{banner.type === 'success' ? (lang === 'en' ? 'Operation Success' : 'ប្រតិបត្តិការជោគជ័យ') : (lang === 'en' ? 'Security Warning' : 'ការព្រមានប្រព័ន្ធសុវត្ថិភាព')}</strong>
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
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-slate-800 font-sans"
              />
            </div>

            <button
              onClick={() => {
                setEditUser(null);
                setFullName('');
                setUsername('');
                setEmail('');
                setPhone('');
                setPassword('');
                setSelectedRoleId('manager');
                setAssignedBranchIds(['b1']);
                setShowForm(!showForm);
              }}
              className="flex items-center justify-center gap-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition-all text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer shadow-md shadow-slate-900/10"
              id="btn_provision_user_trigger"
            >
              <UserPlus size={14} />
              {t.provisionNew}
            </button>
          </div>

          {/* Provision / Edit Form */}
          {showForm && (
            <form onSubmit={handleCreateUserSubmit} className="bg-white border border-slate-205 rounded-xl p-5 shadow-sm space-y-4 animate-in fade-in" id="form_create_user">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                  <Key size={14} className="text-emerald-500" />
                  {editUser ? t.formEditTitle : t.formTitle}
                </h4>
                <button 
                  type="button" 
                  onClick={() => { setShowForm(false); setEditUser(null); }} 
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t.fullName} *</label>
                  <input
                    type="text"
                    placeholder={t.fullNamePlaceholder}
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-slate-880 placeholder-slate-400 font-sans font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t.username} *</label>
                  <input
                    type="text"
                    placeholder={t.usernamePlaceholder}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-slate-880 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t.email} *</label>
                  <input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-slate-880 placeholder-slate-400 font-sans font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t.phone}</label>
                  <input
                    type="text"
                    placeholder={t.phonePlaceholder}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-slate-880 font-sans"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {editUser ? `${t.password} (${t.passwordEditHelp})` : t.password}
                  </label>
                  <input
                    type="password"
                    placeholder={editUser ? t.passwordEditHelp : t.passwordPlaceholder}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-slate-880 placeholder-slate-400 font-sans"
                    required={!editUser}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t.role} *</label>
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
                      {t.assignedBranches}
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
                  onClick={() => { setShowForm(false); setEditUser(null); }}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/10 cursor-pointer"
                  id="btn_confirm_provision"
                >
                  {submitting && <Loader2 className="animate-spin" size={13} />}
                  <span>{editUser ? t.confirmEdit : t.confirm} &nbsp; &rarr;</span>
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
                  {t.forcePasswordReset}
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  {t.forcePasswordResetDesc.replace('user', `"${resetUser.fullName}"`)}
                </p>

                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      {t.newSecurePassword}
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
                      className="px-3.5 py-2 border border-slate-200 text-slate-500 rounded-lg cursor-pointer"
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-850 text-white rounded-lg hover:bg-slate-755 cursor-pointer"
                    >
                      {t.resetAndForce}
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
                <span>{t.downloadingAccounts}</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left" id="tbl_iam_users">
                  <thead className="text-[10px] font-bold text-slate-400 bg-slate-50/50 border-b border-slate-150 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">{t.tblFullName}</th>
                      <th className="px-4 py-4">{t.tblUsername}</th>
                      <th className="px-4 py-4">{t.tblContact}</th>
                      <th className="px-4 py-4">{t.tblRole}</th>
                      <th className="px-4 py-4">{t.tblBranches}</th>
                      <th className="px-4 py-4">{t.tblStatus}</th>
                      <th className="px-6 py-4 text-right">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-slate-400 text-xs">
                          {t.emptyAlert}
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
                              {u.role === 'Owner' ? (lang === 'en' ? 'Owner' : 'ម្ចាស់ហាង') : 
                               u.role === 'Admin' ? (lang === 'en' ? 'Admin' : 'អ្នកគ្រប់គ្រង') : 
                               u.role === 'Manager' ? (lang === 'en' ? 'Manager' : 'ប្រធានសាខា') : 
                               (lang === 'en' ? 'Staff' : 'បុគ្គលិក')}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-1">
                              {u.role === 'Owner' ? (
                                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded text-[9px] uppercase tracking-wider">
                                  {lang === 'en' ? 'Full System Authority' : 'សិទ្ធិគ្រប់គ្រងប្រព័ន្ធពេញលេញ'}
                                </span>
                              ) : !u.assignedBranchIds || u.assignedBranchIds.length === 0 ? (
                                <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 font-bold rounded text-[9px] uppercase tracking-wider">
                                  {lang === 'en' ? 'No Branches Appointed' : 'មិនទាន់ចាត់តាំងសាខា'}
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
                              {u.status === 'Active' ? (lang === 'en' ? 'Active' : 'ដំណើរការ') : 
                               u.status === 'Inactive' ? (lang === 'en' ? 'Inactive' : 'ផ្អាក') : 
                               (lang === 'en' ? 'Locked' : 'ជាប់សោ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {u.role !== 'Owner' && (
                              <div className="flex justify-end gap-1.5">
                                {/* Reset Password */}
                                <button
                                  onClick={() => setResetUser(u)}
                                  className="text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 font-bold p-1.5 rounded-lg transition cursor-pointer"
                                  title={t.resetTooltip}
                                >
                                  <Key size={13.5} />
                                </button>

                                {/* Edit User Info */}
                                <button
                                  onClick={() => {
                                    setEditUser(u);
                                    setFullName(u.fullName);
                                    setUsername(u.username);
                                    setEmail(u.email);
                                    setPhone(u.phone || '');
                                    setPassword(''); // Clear password block, only change if user enters new value
                                    setSelectedRoleId(u.roleId);
                                    setAssignedBranchIds(u.assignedBranchIds || []);
                                    setShowForm(true);
                                  }}
                                  className="text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 font-bold p-1.5 rounded-lg transition cursor-pointer"
                                  title={t.editTooltip}
                                >
                                  <Edit size={13.5} />
                                </button>

                                {/* Delete User */}
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  className="text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 font-bold p-1.5 rounded-lg transition cursor-pointer"
                                  title={t.deleteTooltip}
                                >
                                  <Trash2 size={13.5} />
                                </button>
                                
                                {u.status === 'Active' ? (
                                  <button
                                    onClick={() => handleToggleStatus(u, 'Locked')}
                                    className="bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-1 rounded-lg transition shrink-0 cursor-pointer"
                                  >
                                    {t.lockLabel}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleToggleStatus(u, 'Active')}
                                    className="bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-lg transition cursor-pointer"
                                  >
                                    {t.unlockLabel}
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
              {t.selectRoleToConfigure}
            </h3>

            <div className="bg-white border border-slate-150 rounded-xl divide-y divide-slate-100 overflow-hidden shadow-3xs">
              {roles.map(r => {
                const isSelected = selectedRoleForPerms?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRoleForPermissions(r)}
                    className={`w-full text-left p-3.5 transition-all outline-none flex items-start gap-3 cursor-pointer
                      ${isSelected ? 'bg-slate-800 text-white' : 'bg-white hover:bg-slate-50 text-slate-700'}
                    `}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <div>
                      <strong className={`text-xs block font-bold ${isSelected ? 'text-white' : 'text-slate-850'}`}>
                        {r.name === 'Owner' ? (lang === 'en' ? 'Owner' : 'ម្ចាស់ហាង') : 
                         r.name === 'Admin' ? (lang === 'en' ? 'Admin' : 'អ្នកគ្រប់គ្រង') : 
                         r.name === 'Manager' ? (lang === 'en' ? 'Manager' : 'ប្រធានសាខា') : 
                         (lang === 'en' ? 'Staff' : 'បុគ្គលិក')}
                      </strong>
                      <span className={`text-[10px] leading-relaxed block mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {r.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>


          </div>

          {/* Granular Permission Toggles Editor Grid */}
          <div className="md:col-span-2 space-y-4">
            {selectedRoleForPerms && (
              <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center pb-3.5 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      {t.privilegeMatrixFor} <strong className="text-emerald-600">{selectedRoleForPerms.name === 'Owner' ? (lang === 'en' ? 'Owner' : 'ម្ចាស់ហាង') : 
                         selectedRoleForPerms.name === 'Admin' ? (lang === 'en' ? 'Admin' : 'អ្នកគ្រប់គ្រង') : 
                         selectedRoleForPerms.name === 'Manager' ? (lang === 'en' ? 'Manager' : 'ប្រធានសាខា') : 
                         (lang === 'en' ? 'Staff' : 'បុគ្គលិក')}</strong>
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
                      {t.configureAllowedActions}
                    </p>
                  </div>

                  <button
                    onClick={handleSaveRolePermissions}
                    disabled={submitting || selectedRoleForPerms.id === 'owner'}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-all active:scale-[0.98]"
                    id="btn_save_permissions_matrix"
                  >
                    {submitting && <Loader2 className="animate-spin" size={13} />}
                    <span>{t.saveCustomMatrix}</span>
                  </button>
                </div>

                {selectedRoleForPerms.id === 'owner' && (
                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl text-xs text-emerald-400 flex items-start gap-2">
                    <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                    <span>{t.ownerPrivilegeNotice}</span>
                  </div>
                )}

                {/* Permissions Grid Editor partitioned per module */}
                <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                  {Object.entries(modulesWithPermissions).map(([modName, perms]) => (
                    <div key={modName} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                      <h4 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-2">
                        {modName} Module
                      </h4>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-sans">
                        {(perms as Permission[]).map(p => {
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
              {t.secureAuditLogins}
            </h3>
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className={loading ? 'animate-spin' : ''} size={14} />
              {t.reloadLogs}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left" id="tbl_iam_login_history">
              <thead className="text-[10px] font-bold text-slate-400 bg-slate-50/50 border-b border-slate-150 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">{t.tblIdentityEmail}</th>
                  <th className="px-4 py-4">{t.tblIpAddress}</th>
                  <th className="px-4 py-4">{t.tblClientUserAgent}</th>
                  <th className="px-4 py-4">{t.tblAuditTimestamp}</th>
                  <th className="px-6 py-4 text-right">{t.tblVerdict}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-600 font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-sans">
                      {t.downloadingLogs}
                    </td>
                  </tr>
                ) : loginHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-sans">
                      {t.noLoginsRecorded}
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
                      <td className="px-4 py-4 text-slate-455 font-sans">
                        {l.timestamp.replace('T', ' ').substring(0, 19)} UTC
                      </td>
                      <td className="px-6 py-4 text-right font-sans">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold select-none border
                          ${l.status === 'Success' ? 'bg-emerald-50 border-emerald-200 text-emerald-650' : 
                            l.status === 'Failed_Locked' ? 'bg-amber-50 border-amber-250 text-amber-700' : 
                            'bg-rose-50 border-rose-200 text-rose-650'}
                        `}>
                          {l.status === 'Success' ? (lang === 'en' ? '✔ AUTHORIZED SUCCESS' : '✔ អនុញ្ញាតជោគជ័យ') : `❌ ${l.status.toUpperCase()}`}
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
