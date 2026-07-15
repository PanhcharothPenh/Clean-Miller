/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  UserSquare2, 
  Globe2, 
  BellRing, 
  Activity, 
  Settings2,
  Users,
  Shield,
  HelpCircle,
  Clock,
  Menu,
  ChevronDown,
  LogOut
} from 'lucide-react';

// Core imports
import { 
  Role, 
  ActiveTab, 
  Branch, 
  Staff, 
  Salary, 
  Attendance, 
  Income, 
  Expense, 
  InventoryItem, 
  Machine, 
  User,
  CoinTransaction,
  RevenueRecord,
  GasRecord,
  DetergentRecord,
  SoftenerRecord,
  StockTransaction,
  Supplier,
  SupplierPayment,
  Debt,
  DebtPayment,
  CashDrawer,
  CashDrawerTransaction,
  MonthClosing,
  SalarySchedule,
  SalaryAdvance
} from './types';
import { db, translations } from './mockData';

// Subcomponents import
import Sidebar from './components/Sidebar';
import Clean24Logo from './components/Clean24Logo';
import DashboardView from './components/DashboardView';
import BranchManagementView from './components/BranchManagementView';
import StaffManagementView from './components/StaffManagementView';
import SalaryManagementView from './components/SalaryManagementView';
import TelegramConfigView from './components/TelegramConfigView';
import AttendanceView from './components/AttendanceView';
import DailyIncomeView from './components/DailyIncomeView';
import ExpenseView from './components/ExpenseView';
import InventoryView from './components/InventoryView';
import ReportsView from './components/ReportsView';
import UserManagementView from './components/UserManagementView';
import SettingsView from './components/SettingsView';
import TelegramLogin from './components/TelegramLogin';
import { authApi } from './utils/api';

// 6 New Submodules Imported Here
import CoinTransactionsView from './components/CoinTransactionsView';
import RevenueRecordsView from './components/RevenueRecordsView';
import GasRecordsView from './components/GasRecordsView';
import DetergentRecordsView from './components/DetergentRecordsView';
import SoftenerRecordsView from './components/SoftenerRecordsView';
import StockTransactionsView from './components/StockTransactionsView';

// Suppliers, Debts, CashDrawer, MonthClosing, and AuditLogs submodules
import SuppliersView from './components/SuppliersView';
import DebtsView from './components/DebtsView';
import CashDrawerView from './components/CashDrawerView';
import MonthClosingView from './components/MonthClosingView';
import AuditLogsView from './components/AuditLogsView';

export default function App() {
  // Global State Managers
  const [lang, setLang] = useState<'en' | 'kh'>('en');
  const [currentRole, setCurrentRole] = useState<Role>('Owner');
  const [activeBranchId, setActiveBranchId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [exchangeRate, setExchangeRate] = useState<number>(4100);
  const [authenticatedUser, setAuthenticatedUser] = useState<any | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Live Database Sync States
  const [dbSyncStatus, setDbSyncStatus] = useState<'synced' | 'connecting' | 'error'>('connecting');

  useEffect(() => {
    const checkSync = async () => {
      try {
        const res = await fetch('/api/debug-supabase');
        if (!res.ok) throw new Error('API down');
        const data = await res.json();
        if (data.isSupabaseActive && !data.testSelectError) {
          setDbSyncStatus('synced');
        } else {
          setDbSyncStatus('error');
        }
      } catch (e) {
        setDbSyncStatus('error');
      }
    };
    checkSync();
    const interval = setInterval(checkSync, 20000);
    return () => clearInterval(interval);
  }, []);

  // Database lists
  const [branches, setBranches] = useState<Branch[]>(() => db.getBranches());
  const [staff, setStaff] = useState<Staff[]>(() => db.getStaff());
  const [salaries, setSalaries] = useState<Salary[]>(() => db.getSalaries());
  const [salarySchedules, setSalarySchedules] = useState<SalarySchedule[]>(() => db.getSalarySchedules());
  const [salaryAdvances, setSalaryAdvances] = useState<SalaryAdvance[]>(() => db.getSalaryAdvances());
  const [attendance, setAttendance] = useState<Attendance[]>(() => db.getAttendance());
  const [incomes, setIncomes] = useState<Income[]>(() => db.getIncomes());
  const [expenses, setExpenses] = useState<Expense[]>(() => db.getExpenses());
  const [inventory, setInventory] = useState<InventoryItem[]>(() => db.getInventory());
  const [machines, setMachines] = useState<Machine[]>(() => db.getMachines());
  const [users, setUsers] = useState<User[]>(() => db.getUsers());
  const [coinTransactions, setCoinTransactions] = useState<CoinTransaction[]>(() => db.getCoinTransactions());
  const [revenueRecords, setRevenueRecords] = useState<RevenueRecord[]>(() => db.getRevenueRecords());
  const [gasRecords, setGasRecords] = useState<GasRecord[]>(() => db.getGasRecords());
  const [detergentRecords, setDetergentRecords] = useState<DetergentRecord[]>(() => db.getDetergentRecords());
  const [softenerRecords, setSoftenerRecords] = useState<SoftenerRecord[]>(() => db.getSoftenerRecords());
  const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>(() => db.getStockTransactions());
  
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => db.getSuppliers());
  const [debts, setDebts] = useState<Debt[]>(() => db.getDebts());
  const [debtPayments, setDebtPayments] = useState<DebtPayment[]>(() => db.getDebtPayments());
  const [cashDrawers, setCashDrawers] = useState<CashDrawer[]>(() => db.getCashDrawers());
  const [cashDrawerTransactions, setCashDrawerTransactions] = useState<CashDrawerTransaction[]>(() => db.getCashDrawerTransactions());
  const [monthClosings, setMonthClosings] = useState<MonthClosing[]>(() => db.getMonthClosings());
  
  // Real-time audit trails state
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([
    "Low Stock alert: 'Bubble Lavender soap' drops under 5 units at Toul Kork branch.",
    "Salary sheet waiting approval: Manager 'Nguon Piseth' logged new period.",
    "Service Calibration: Washer #TK-01 motor carbon brushes checked."
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check user authentication session on mount
  useEffect(() => {
    let active = true;
    const checkSession = async () => {
      try {
        const user = await authApi.getMe();
        if (active && user) {
          setAuthenticatedUser(user);
          setCurrentRole(user.role);
          setActiveBranchId(user.assignedBranchIds && user.assignedBranchIds.length > 0 ? user.assignedBranchIds[0] : 'all');
          handleAddNewAuditLog(`Authenticated session recovered successfully for: [${user.fullName}]`);
        }
      } catch (err) {
        // No session exists, show login screen cleanly
      } finally {
        if (active) setAuthChecking(false);
      }
    };

    checkSession();

    const handleSessionExpired = () => {
      if (active) {
        setAuthenticatedUser(null);
        handleAddNewAuditLog(`Session expired or revoked by security monitor`);
      }
    };

    window.addEventListener('unauthorized-session-expired', handleSessionExpired);

    return () => {
      active = false;
      window.removeEventListener('unauthorized-session-expired', handleSessionExpired);
    };
  }, []);

  // Load database on initialization
  useEffect(() => {
    setBranches(db.getBranches());
    setStaff(db.getStaff());
    setSalaries(db.getSalaries());
    setSalarySchedules(db.getSalarySchedules());
    setSalaryAdvances(db.getSalaryAdvances());
    setAttendance(db.getAttendance());
    setIncomes(db.getIncomes());
    setExpenses(db.getExpenses());
    setInventory(db.getInventory());
    setMachines(db.getMachines());
    setUsers(db.getUsers());
    setCoinTransactions(db.getCoinTransactions());
    setRevenueRecords(db.getRevenueRecords());
    setGasRecords(db.getGasRecords());
    setDetergentRecords(db.getDetergentRecords());
    setSoftenerRecords(db.getSoftenerRecords());
    setStockTransactions(db.getStockTransactions());
    setSuppliers(db.getSuppliers());
    setDebts(db.getDebts());
    setDebtPayments(db.getDebtPayments());
    setCashDrawers(db.getCashDrawers());
    setCashDrawerTransactions(db.getCashDrawerTransactions());
    setMonthClosings(db.getMonthClosings());

    // Generate initial logs
    setAuditLogs([
      `[${new Date().toLocaleTimeString()}] Authenticated Clean24 admin session safely.`,
      `[${new Date().toLocaleTimeString()}] Checked multi-branch isolation integrity check sum.`
    ]);
  }, []);

  // Sync state mutations back to key-value local storage
  useEffect(() => {
    if (branches.length > 0) db.saveBranches(branches);
  }, [branches]);

  useEffect(() => {
    if (staff.length > 0) db.saveStaff(staff);
  }, [staff]);

  useEffect(() => {
    if (salaries.length > 0) db.saveSalaries(salaries);
  }, [salaries]);

  useEffect(() => {
    if (salarySchedules.length > 0) db.saveSalarySchedules(salarySchedules);
  }, [salarySchedules]);

  useEffect(() => {
    if (salaryAdvances.length > 0) db.saveSalaryAdvances(salaryAdvances);
  }, [salaryAdvances]);

  useEffect(() => {
    if (attendance.length > 0) db.saveAttendance(attendance);
  }, [attendance]);

  useEffect(() => {
    if (incomes.length > 0) db.saveIncomes(incomes);
  }, [incomes]);

  useEffect(() => {
    if (expenses.length > 0) db.saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    if (inventory.length > 0) db.saveInventory(inventory);
  }, [inventory]);

  useEffect(() => {
    if (machines.length > 0) db.saveMachines(machines);
  }, [machines]);

  useEffect(() => {
    if (users.length > 0) db.saveUsers(users);
  }, [users]);

  useEffect(() => {
    if (coinTransactions.length > 0) db.saveCoinTransactions(coinTransactions);
  }, [coinTransactions]);

  useEffect(() => {
    if (revenueRecords.length > 0) db.saveRevenueRecords(revenueRecords);
  }, [revenueRecords]);

  useEffect(() => {
    if (gasRecords.length > 0) db.saveGasRecords(gasRecords);
  }, [gasRecords]);

  useEffect(() => {
    if (detergentRecords.length > 0) db.saveDetergentRecords(detergentRecords);
  }, [detergentRecords]);

  useEffect(() => {
    if (softenerRecords.length > 0) db.saveSoftenerRecords(softenerRecords);
  }, [softenerRecords]);

  useEffect(() => {
    if (stockTransactions.length > 0) db.saveStockTransactions(stockTransactions);
  }, [stockTransactions]);

  useEffect(() => {
    if (suppliers.length > 0) db.saveSuppliers(suppliers);
  }, [suppliers]);

  useEffect(() => {
    if (debts.length > 0) db.saveDebts(debts);
  }, [debts]);

  useEffect(() => {
    if (debtPayments.length > 0) db.saveDebtPayments(debtPayments);
  }, [debtPayments]);

  useEffect(() => {
    if (cashDrawers.length > 0) db.saveCashDrawers(cashDrawers);
  }, [cashDrawers]);

  useEffect(() => {
    if (cashDrawerTransactions.length > 0) db.saveCashDrawerTransactions(cashDrawerTransactions);
  }, [cashDrawerTransactions]);

  useEffect(() => {
    if (monthClosings.length > 0) db.saveMonthClosings(monthClosings);
  }, [monthClosings]);

  // Synchronize database state to backend Express context for background scheduling checks
  useEffect(() => {
    const payload = {
      branches,
      staff,
      salaries,
      salarySchedules,
      salaryAdvances,
      attendance,
      incomes,
      expenses,
      inventory,
      machines,
      coinTransactions,
      revenueRecords,
      gasRecords,
      detergentRecords,
      softenerRecords,
      stockTransactions,
      suppliers,
      debts,
      debtPayments,
      cashDrawers,
      cashDrawerTransactions,
      monthClosings,
      settings: { shopName: "Clean24 Laundry" }
    };
    fetch('/api/sync-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.warn('Backend sync warning:', err.message));
  }, [
    branches,
    staff,
    salaries,
    salarySchedules,
    salaryAdvances,
    attendance,
    incomes,
    expenses,
    inventory,
    machines,
    coinTransactions,
    revenueRecords,
    gasRecords,
    detergentRecords,
    softenerRecords,
    stockTransactions,
    suppliers,
    debts,
    debtPayments,
    cashDrawers,
    cashDrawerTransactions,
    monthClosings
  ]);

  // Utility to append real time administrative logs
  const handleAddNewAuditLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const formatted = `[${timestamp}] ${msg}`;
    setAuditLogs(prev => [formatted, ...prev].slice(0, 50));
    
    // Auto push into live toast notification list if urgent
    if (msg.toLowerCase().includes('low') || msg.toLowerCase().includes('paid') || msg.toLowerCase().includes('calibration')) {
      setNotifications(prev => [msg, ...prev].slice(0, 10));
    }
  };

  const currentUser = authenticatedUser || (users.find(u => u.role === currentRole) || users[0]);
  const setCurrentUser = (u: any) => { 
    if (u && u.role) {
      handleRoleSimulationSwap(u.role);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {}
    setAuthenticatedUser(null);
    handleAddNewAuditLog(`User logged out successfully.`);
  };

  const t = translations[lang];

  // Restructure branch active view names
  const getActiveBranchLabel = () => {
    if (activeBranchId === 'all') {
      return lang === 'en' ? "Consolidated Branches View (All)" : "មើលរួមគ្រប់សាខាទាំងអស់";
    }
    const currentSelected = branches.find(b => b.id === activeBranchId);
    return currentSelected ? `${currentSelected.branchName} (${currentSelected.branchCode})` : activeBranchId;
  };

  // Switch role and apply access-level adjustments
  const handleRoleSimulationSwap = (nextRole: Role) => {
    setCurrentRole(nextRole);
    handleAddNewAuditLog(`Session privileges updated to: [${nextRole}]`);

    // Lock non-authorized roles from restricted tabs when swapping
    if (nextRole === 'Staff') {
      setActiveTab('income'); // staff defaults to daily income laundry book
      setActiveBranchId('b1'); // staff forced to Toul Kork (b1)
    } else if (nextRole === 'Manager') {
      setActiveBranchId('b1'); // manager restricted to Toul Kork (b1)
      if (['branches', 'users', 'settings'].includes(activeTab)) {
        setActiveTab('dashboard');
      }
    } else if (nextRole === 'Admin') {
      if (['branches', 'users'].includes(activeTab)) {
        setActiveTab('dashboard');
      }
    }
  };

  // Render Submodule Tab Panel Views
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            activeBranchId={activeBranchId}
            branches={branches}
            staffList={staff}
            salaryList={salaries}
            incomeList={incomes}
            expenseList={expenses}
            coinTransactions={coinTransactions}
            revenueRecords={revenueRecords}
            gasRecords={gasRecords}
            detergentRecords={detergentRecords}
            softenerRecords={softenerRecords}
            stockTransactions={stockTransactions}
            lang={lang}
            exchangeRate={exchangeRate}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            auditLogs={auditLogs}
            onAddLog={handleAddNewAuditLog}
          />
        );
      case 'branches':
        return (
          <BranchManagementView
            currentRole={currentRole}
            branches={branches}
            setBranches={setBranches}
            users={users}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
          />
        );
      case 'staff':
        return (
          <StaffManagementView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            staff={staff}
            setStaff={setStaff}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
          />
        );
      case 'telegram_config':
        return (
          <TelegramConfigView
            currentRole={currentRole}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
          />
        );
      case 'salary':
        return (
          <SalaryManagementView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            staffList={staff}
            setStaff={setStaff}
            salaries={salaries}
            setSalaries={setSalaries}
            salarySchedules={salarySchedules}
            setSalarySchedules={setSalarySchedules}
            salaryAdvances={salaryAdvances}
            setSalaryAdvances={setSalaryAdvances}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
            exchangeRate={exchangeRate}
          />
        );
      case 'attendance':
        return (
          <AttendanceView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            staffList={staff}
            attendance={attendance}
            setAttendance={setAttendance}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
          />
        );
      case 'income':
        return (
          <DailyIncomeView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            machines={machines}
            incomes={incomes}
            setIncomes={setIncomes}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
            exchangeRate={exchangeRate}
          />
        );
      case 'expense':
        return (
          <ExpenseView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            expenses={expenses}
            setExpenses={setExpenses}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
            exchangeRate={exchangeRate}
          />
        );
      case 'inventory':
        return (
          <InventoryView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            inventory={inventory}
            setInventory={setInventory}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
          />
        );
      case 'coins':
        return (
          <CoinTransactionsView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            coinTransactions={coinTransactions}
            setCoinTransactions={setCoinTransactions}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
            exchangeRate={exchangeRate}
          />
        );
      case 'revenues':
        return (
          <RevenueRecordsView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            revenueRecords={revenueRecords}
            setRevenueRecords={setRevenueRecords}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
            exchangeRate={exchangeRate}
          />
        );
      case 'gas':
        return (
          <GasRecordsView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            gasRecords={gasRecords}
            setGasRecords={setGasRecords}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
            exchangeRate={exchangeRate}
          />
        );
      case 'detergents':
        return (
          <DetergentRecordsView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            detergentRecords={detergentRecords}
            setDetergentRecords={setDetergentRecords}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
            exchangeRate={exchangeRate}
            inventory={inventory}
            setInventory={setInventory}
            stockTransactions={stockTransactions}
            setStockTransactions={setStockTransactions}
          />
        );
      case 'softeners':
        return (
          <SoftenerRecordsView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            softenerRecords={softenerRecords}
            setSoftenerRecords={setSoftenerRecords}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
            exchangeRate={exchangeRate}
            inventory={inventory}
            setInventory={setInventory}
            stockTransactions={stockTransactions}
            setStockTransactions={setStockTransactions}
          />
        );
      case 'stock':
        return (
          <StockTransactionsView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            stockTransactions={stockTransactions}
            setStockTransactions={setStockTransactions}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
            exchangeRate={exchangeRate}
          />
        );

      case 'reports':
        return (
          <ReportsView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            incomes={incomes}
            expenses={expenses}
            salaries={salaries}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
            exchangeRate={exchangeRate}
            currentUser={currentUser}
            attendance={attendance}
            inventory={inventory}
            machines={machines}
            coinTransactions={coinTransactions}
            revenueRecords={revenueRecords}
            gasRecords={gasRecords}
            detergentRecords={detergentRecords}
            softenerRecords={softenerRecords}
            stockTransactions={stockTransactions}
            suppliers={suppliers}
            debts={debts}
            debtPayments={debtPayments}
            cashDrawers={cashDrawers}
            cashDrawerTransactions={cashDrawerTransactions}
            monthClosings={monthClosings}
          />
        );
      case 'users':
        return (
          <UserManagementView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
          />
        );
      case 'settings':
        return (
          <SettingsView
            currentRole={currentRole}
            branches={branches}
            lang={lang}
            setLang={setLang}
            exchangeRate={exchangeRate}
            setExchangeRate={setExchangeRate}
            onAddLog={handleAddNewAuditLog}
          />
        );
      case 'suppliers':
        return (
          <SuppliersView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            suppliers={suppliers}
            setSuppliers={setSuppliers}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
          />
        );
      case 'debts':
        return (
          <DebtsView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            suppliers={suppliers}
            debts={debts}
            setDebts={setDebts}
            debtPayments={debtPayments}
            setDebtPayments={setDebtPayments}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
          />
        );
      case 'cashdrawer':
        return (
          <CashDrawerView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            incomes={incomes}
            expenses={expenses}
            cashDrawers={cashDrawers}
            setCashDrawers={setCashDrawers}
            cashDrawerTransactions={cashDrawerTransactions}
            setCashDrawerTransactions={setCashDrawerTransactions}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
          />
        );
      case 'monthclosing':
        return (
          <MonthClosingView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            incomes={incomes}
            expenses={expenses}
            coinTransactions={coinTransactions}
            monthClosings={monthClosings}
            setMonthClosings={setMonthClosings}
            lang={lang}
            onAddLog={handleAddNewAuditLog}
          />
        );
      case 'auditlogs':
        return (
          <AuditLogsView
            currentRole={currentRole}
            activeBranchId={activeBranchId}
            branches={branches}
            auditLogs={auditLogs}
            lang={lang}
          />
        );
      default:
        return <div className="text-slate-400">Section placeholder construction</div>;
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm font-semibold tracking-wide">Initializing secure Clean24 environment...</p>
        </div>
      </div>
    );
  }

  if (!authenticatedUser) {
    return (
      <TelegramLogin
        onLoginSuccess={(user) => {
          setAuthenticatedUser(user);
          setCurrentRole(user.role);
          
          // STRICT REDIRECTION MATRIX:
          // Owner -> Owner Dashboard (consolidated overview)
          // Admin -> Admin Dashboard (analytical admin level)
          // Manager -> Branch Dashboard (specific assigned branch workspace)
          // Staff -> Staff Dashboard (assigned branch operational console)
          if (user.role === 'Owner') {
            setActiveTab('dashboard');
            setActiveBranchId('all');
          } else if (user.role === 'Admin') {
            setActiveTab('dashboard');
            setActiveBranchId(user.assignedBranchIds && user.assignedBranchIds.length > 0 ? user.assignedBranchIds[0] : 'b1');
          } else if (user.role === 'Manager') {
            setActiveTab('dashboard');
            setActiveBranchId(user.assignedBranchIds && user.assignedBranchIds.length > 0 ? user.assignedBranchIds[0] : 'b1');
          } else if (user.role === 'Staff') {
            setActiveTab('dashboard');
            setActiveBranchId(user.assignedBranchIds && user.assignedBranchIds.length > 0 ? user.assignedBranchIds[0] : 'b1');
          } else {
            setActiveTab('dashboard');
            setActiveBranchId('all');
          }

          handleAddNewAuditLog(`User fully authenticated: Welcome, ${user.fullName} (${user.role})`);
        }}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  return (
    <div className="min-h-screen w-screen max-w-full bg-slate-50 flex overflow-hidden" id="main_saas_root">
      
      {/* 1. Left Sidebar Navigation Segment */}
      <div className="hidden lg:block shrink-0 w-64 h-screen sticky top-0">
        <Sidebar
          currentRole={currentRole}
          setCurrentRole={handleRoleSimulationSwap}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          users={users}
          activeBranchId={activeBranchId}
          setActiveBranchId={setActiveBranchId}
          branches={branches}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          setLang={setLang}
          exchangeRate={exchangeRate}
          onLogout={handleLogout}
        />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-72 bg-slate-900 h-full flex flex-col z-50">
            <Sidebar
              currentRole={currentRole}
              setCurrentRole={handleRoleSimulationSwap}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              users={users}
              activeBranchId={activeBranchId}
              setActiveBranchId={setActiveBranchId}
              branches={branches}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              lang={lang}
              setLang={setLang}
              exchangeRate={exchangeRate}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* 2. Main content area wrapper */}
      <div className="flex-1 min-w-0 flex flex-col overflow-x-hidden">
        
        {/* Top Header Segment bar */}
        <header className="bg-white border-b border-slate-100 px-6 py-2.5 flex items-center justify-between sticky top-0 z-30" id="header_saas_bar">
          
          {/* Menu Trigger and Title details */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 lg:hidden cursor-pointer transition-colors"
            >
              <Menu size={18} />
            </button>
            
            <div className="flex items-center gap-2">
              <Clean24Logo className="h-5.5 cursor-pointer" lightMode={true} />
              <div className="h-4 w-px bg-slate-200 self-center mx-1.5" />
              <span className="text-[10px] text-slate-400 font-bold tracking-wide uppercase hover:text-slate-700 transition-colors cursor-pointer self-center" id="header_branch_label">
                {getActiveBranchLabel()}
              </span>
            </div>
          </div>

          {/* Interactive controls and simulators (Bilingual + Role switches) */}
          <div className="flex items-center gap-3">
            
            {/* Live Database Sync Indicator */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/50 rounded-xl px-2.5 py-1.5 text-[10px] font-bold shrink-0 select-none">
              {dbSyncStatus === 'synced' ? (
                <>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-700 font-semibold tracking-wide uppercase text-[8px]">
                    {lang === 'en' ? 'Cloud Synced' : 'ទិន្នន័យបានភ្ជាប់'}
                  </span>
                </>
              ) : dbSyncStatus === 'connecting' ? (
                <>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                  </span>
                  <span className="text-amber-700 font-semibold tracking-wide uppercase text-[8px]">
                    {lang === 'en' ? 'Checking Sync...' : 'កំពុងឆែក...'}
                  </span>
                </>
              ) : (
                <>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                  </span>
                  <span className="text-rose-700 font-semibold tracking-wide uppercase text-[8px]">
                    {lang === 'en' ? 'Offline Mode' : 'គ្មានការតភ្ជាប់'}
                  </span>
                </>
              )}
            </div>
            
            
            

            {/* Language toggle trigger buttons */}
            <div className="flex bg-slate-50 border border-slate-200/50 rounded-xl p-0.5 text-xs font-bold items-center">
              <button
                onClick={() => setLang('en')}
                className={`py-1 px-2.5 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${lang==='en' ? 'bg-white text-slate-750 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                title="English"
              >
                <svg className="w-4 h-3 rounded-xs shrink-0 shadow-xs border border-slate-200/20" viewBox="0 0 741 390">
                  <rect width="741" height="390" fill="#B22234" />
                  <path d="M0,30h741M0,90h741M0,150h741M0,210h741M0,270h741M0,330h741" stroke="#FFF" strokeWidth="30" />
                  <rect width="296" height="210" fill="#3C3B6E" />
                  <g fill="#FFF">
                    <circle cx="25" cy="20" r="4" /><circle cx="75" cy="20" r="4" /><circle cx="125" cy="20" r="4" /><circle cx="175" cy="20" r="4" /><circle cx="225" cy="20" r="4" /><circle cx="275" cy="20" r="4" />
                    <circle cx="50" cy="40" r="4" /><circle cx="100" cy="40" r="4" /><circle cx="150" cy="40" r="4" /><circle cx="200" cy="40" r="4" /><circle cx="250" cy="40" r="4" />
                    <circle cx="25" cy="60" r="4" /><circle cx="75" cy="60" r="4" /><circle cx="125" cy="60" r="4" /><circle cx="175" cy="60" r="4" /><circle cx="225" cy="60" r="4" /><circle cx="275" cy="60" r="4" />
                    <circle cx="50" cy="80" r="4" /><circle cx="100" cy="80" r="4" /><circle cx="150" cy="80" r="4" /><circle cx="200" cy="80" r="4" /><circle cx="250" cy="80" r="4" />
                    <circle cx="25" cy="100" r="4" /><circle cx="75" cy="100" r="4" /><circle cx="125" cy="100" r="4" /><circle cx="175" cy="100" r="4" /><circle cx="225" cy="100" r="4" /><circle cx="275" cy="100" r="4" />
                    <circle cx="50" cy="120" r="4" /><circle cx="100" cy="120" r="4" /><circle cx="150" cy="120" r="4" /><circle cx="200" cy="120" r="4" /><circle cx="250" cy="120" r="4" />
                    <circle cx="25" cy="140" r="4" /><circle cx="75" cy="140" r="4" /><circle cx="125" cy="140" r="4" /><circle cx="175" cy="140" r="4" /><circle cx="225" cy="140" r="4" /><circle cx="275" cy="140" r="4" />
                    <circle cx="50" cy="160" r="4" /><circle cx="100" cy="160" r="4" /><circle cx="150" cy="160" r="4" /><circle cx="200" cy="160" r="4" /><circle cx="250" cy="160" r="4" />
                    <circle cx="25" cy="180" r="4" /><circle cx="75" cy="180" r="4" /><circle cx="125" cy="180" r="4" /><circle cx="175" cy="180" r="4" /><circle cx="225" cy="180" r="4" /><circle cx="275" cy="180" r="4" />
                  </g>
                </svg>
                <span className="text-[10px]">EN</span>
              </button>
              <button
                onClick={() => setLang('kh')}
                className={`py-1 px-2.5 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${lang==='kh' ? 'bg-white text-slate-750 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                title="ភាសាខ្មែរ"
              >
                <svg className="w-4 h-3 rounded-xs shrink-0 shadow-xs border border-slate-200/20" viewBox="0 0 936 600">
                  <rect width="936" height="150" fill="#032EA1" />
                  <rect y="150" width="936" height="300" fill="#E51B23" />
                  <rect y="450" width="936" height="150" fill="#032EA1" />
                  <g fill="#FFF" transform="translate(368, 200)">
                    <path d="M40,170 L50,110 L60,110 L70,170 Z" />
                    <path d="M130,170 L140,110 L150,110 L160,170 Z" />
                    <path d="M85,170 L100,70 L110,70 L125,170 Z" />
                    <rect x="20" y="170" width="160" height="15" />
                    <rect x="30" y="185" width="140" height="15" />
                  </g>
                </svg>
                <span className="text-[10px]">KH</span>
              </button>
            </div>

            {/* Live alerts ring and notifications panel dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center hover:bg-slate-100 text-slate-600 cursor-pointer transition-all"
                id="notification_bell_trigger"
              >
                <BellRing size={15} className={notifications.length > 0 ? "animate-swing" : ""} />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2.5 w-76 bg-white border border-slate-100 rounded-2xl shadow-lg p-4.5 z-50 space-y-3 fade-in-slide" id="notifications_dropdown_panel">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest flex items-center gap-1.5">
                      <Activity size={12} className="text-emerald-500" />
                      Live Alerts ({notifications.length})
                    </span>
                    <button onClick={() => setNotifications([])} className="text-[9px] font-bold text-rose-500 hover:underline">Clear</button>
                  </div>
                  <div className="space-y-2.5">
                    {notifications.map((notif, index) => (
                      <div key={index} className="flex gap-2 items-start py-1 border-b border-slate-50 last:border-none">
                        <span className="text-amber-500 shrink-0 text-xs">⚠️</span>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{notif}</p>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <span className="text-slate-400 text-[10px] text-center block py-4">No pending alerts.</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Widget (Moved from Sidebar Bottom to Top Right) */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200/60">
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/50 flex items-center justify-center font-bold text-xs text-slate-750 select-none">
                    {currentUser?.fullName?.charAt(0) || "?"}
                  </div>
                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-500 border border-white rounded-full"></span>
                </div>
                <div className="hidden md:block min-w-0 text-left">
                  <div className="text-[11px] font-bold text-slate-700 truncate leading-none">{currentUser?.fullName || "Active User"}</div>
                  <span className="text-[9px] text-slate-400 truncate mt-1 block leading-none">{currentUser?.email || ""}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-450 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                title="Sign Out of Clean24 Accounts"
                id="header_logout_btn"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* 3. Primary Workspace rendering and Audit Log trails panels */}
        <main className="flex-1 min-w-0 max-w-full p-6 space-y-6 overflow-y-auto" id="workspace_viewport">
          
          {/* Active branch indicator banner (Sleek light-mode modern status bar - Minimalist Overhaul) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100/80">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {t.activeBranch}: <strong className="font-bold text-slate-800 font-sans tracking-wide">{getActiveBranchLabel()}</strong>
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 p-1 px-2.5 rounded-lg border border-slate-200/50 font-medium">
              <span className="font-sans">1 USD = {exchangeRate.toLocaleString()} KHR</span>
            </div>
          </div>

          {/* Actual subtab components renders here */}
          <div className="transition-all duration-300 w-full min-w-0">
            {renderTabContent()}
          </div>

          {/* Real-time audit logs block (Only visible to Head Admin or Owners to verify multi-branch transactions) */}
          {['Owner', 'Admin'].includes(currentRole) && (
            <div className="bg-slate-900 text-slate-300 p-4.5 rounded-2xl border border-slate-850 font-mono text-[11px] space-y-3 shadow-md" id="admin_audit_terminal">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Bilingual Transaction log terminal: Clean24 Audit trail
                </span>
                <span className="text-[9px] text-indigo-400 italic font-semibold">Active role: {currentRole}</span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {auditLogs.map((log, id) => (
                  <div key={id} className="text-slate-400 flex gap-2">
                    <span className="text-emerald-500 shrink-0 select-none">&gt;</span>
                    <p className="leading-relaxed font-bold">{log}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
