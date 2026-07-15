/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  User,
  Branch,
  Staff,
  Salary,
  Attendance,
  Income,
  Expense,
  InventoryItem,
  Machine,
  AppSettings,
  InventoryTransaction,
  MachineMaintenance,
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

// Translation Dictionary for English and Khmer
export const translations = {
  en: {
    dashboard: "Dashboard",
    multiBranch: "Branches",
    staff: "Staff Management",
    salary: "Salary Management",
    attendance: "Attendance",
    income: "Daily Incomes",
    expense: "Expenses",
    inventory: "Inventory & Supplies",
    machine: "Machine Status",
    reports: "Analytical Reports",
    settings: "Settings",
    rolePermissions: "Roles & Security",
    
    // Stats
    todayIncome: "Today's Income",
    todayExpense: "Today's Expense",
    todayProfit: "Today's Profit",
    monthlyIncome: "Monthly Income",
    monthlyExpense: "Monthly Expense",
    monthlyProfit: "Monthly Profit",
    yearlyIncome: "Yearly Income",
    yearlyExpense: "Yearly Expense",
    yearlyProfit: "Yearly Profit",
    salaryExpense: "Salary Expense",
    utilityExpense: "Utility Expense",
    supplyExpense: "Supply Expense",
    profitRange: "P&L Summary",
    lowStockAlert: "Low Stock Alert",
    salaryReminder: "Salary Payment Reminder",
    machineMaintenanceReminder: "Machine Maintenance Due",
    unpaidTransactions: "Unpaid Transactions",
    
    // General terms
    activeBranch: "Active Branch",
    allBranches: "All Branches (Consolidated)",
    branchSelector: "Select Branch",
    addNews: "Create New",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    actions: "Actions",
    search: "Search...",
    print: "Print",
    exportExcel: "Export Excel",
    exportPDF: "Export PDF",
    status: "Status",
    active: "Active",
    inactive: "Inactive",
    currency: "Currency",
    exchangeRate: "Exchange Rate",
    totalAmount: "Total Amount",
    paymentMethod: "Payment Method",
    note: "Note",
    date: "Date",
    quantity: "Quantity",
    unitPrice: "Unit Price",
    discount: "Discount",
    
    // Multi branch labels
    branchCode: "Branch Code",
    branchName: "Branch Name",
    branchAddress: "Branch Address",
    branchPhone: "Branch Phone",
    branchManager: "Branch Manager",
    openingHours: "Opening Hours",
    bestPerforming: "Best Performing Branch",
    branchRanking: "Branch Performance Ranking",
    compareIncome: "Income Comparison",
    compareExpense: "Expense Comparison",
    compareProfit: "Profit Comparison",
    
    // Staff metrics
    staffId: "Staff ID",
    fullName: "Full Name",
    gender: "Gender",
    dob: "Date of Birth",
    phone: "Phone Number",
    address: "Address",
    position: "Position",
    shift: "Shift Type",
    startDate: "Start Date",
    baseSalary: "Base Salary",
    idCard: "ID Card Number",
    emergency: "Emergency Contact",
    photo: "Profile Photo",
    resigned: "Resigned",
    suspended: "Suspended",
    
    // Salary metrics
    salaryPeriod: "Salary Period",
    overtime: "Overtime (OT)",
    bonus: "Bonus",
    deduction: "Deductions",
    advance: "Advance Payment",
    netSalary: "Net Salary",
    paymentDate: "Payment Date",
    paidBy: "Paid By",
    paid: "Paid",
    unpaid: "Unpaid",
    customPeriod: "Custom Period",
    
    // Attendance
    checkIn: "Check In",
    checkOut: "Check Out",
    workHours: "Work Hours",
    overtimeHours: "OT Hours",
    present: "Present",
    absent: "Absent",
    late: "Late",
    dayOff: "Day Off",
    
    // Machine list
    machineId: "Machine ID",
    machineType: "Machine Type",
    machineNumber: "Machine No.",
    brand: "Brand",
    capacity: "Capacity (kg)",
    available: "Available",
    inUse: "In Use",
    maintenance: "Maintenance",
    broken: "Broken",
    maintenanceHistory: "Maintenance History",
    revenueByMachine: "Revenue by Machine",
    washer: "Washer",
    dryer: "Dryer",
    
    // Inventory
    itemName: "Item Name",
    category: "Category",
    unit: "Unit",
    currentStock: "Current Stock",
    minStock: "Min Alert Level",
    purchasePrice: "Purchase Price",
    supplier: "Supplier",
    remainingStock: "Remaining Stock",
    stockIn: "Stock In (+)",
    stockOut: "Stock Out (-)",
    
    // Reports list
    dailyIncomeRep: "Daily Income Report",
    monthlyIncomeRep: "Monthly Income Report",
    yearlyIncomeRep: "Yearly Income Report",
    dailyExpenseRep: "Daily Expense Report",
    monthlyExpenseRep: "Monthly Expense Report",
    yearlyExpenseRep: "Yearly Expense Report",
    salaryRep: "Salary Payroll Report",
    staffRep: "Staff Directory Report",
    attendanceRep: "Attendance Log Report",
    inventoryRep: "Inventory Stock Report",
    paymentRep: "Payment Reconciliation Report",
    machineRevenueRep: "Machine Revenue Report",
    profitLossRep: "Profit & Loss (P&L) Report",
    branchCompareRep: "Branch Comparison Report",
    
    // Settings
    shopInfo: "Shop Information",
    backupRestore: "Backup & Restore Data",
    backupSuccess: "Database backup created successfully! Download started.",
    restoreSuccess: "Database restored successfully!",
    khmerFont: "Khmer Font Support Active",
    
    // User credentials
    roleOwner: "Owner (All Branches)",
    roleAdmin: "Admin (Assigned Branches)",
    roleManager: "Manager (One Branch)",
    roleStaff: "Staff (Add Income Only)",
    currentUserLabel: "Simulated Role View",
    warningRoleLimit: "This module is locked for the current role due to strict data separation rules."
  },
  kh: {
    dashboard: "ផ្ទាំងព័ត៌មាន",
    multiBranch: "ការគ្រប់គ្រងសាខា",
    staff: "បុគ្គលិក",
    salary: "ការបើកប្រាក់បៀវត្សរ៍",
    attendance: "វត្តមានបុគ្គលិក",
    income: "ចំណូលប្រចាំថ្ងៃ",
    expense: "ចំណាយនានា",
    inventory: "ស្តុក និងការផ្គត់ផ្គង់",
    machine: "ស្ថានភាពម៉ាស៊ីន",
    reports: "របាយការណ៍វិភាគ",
    settings: "ការកំណត់",
    rolePermissions: "សិទ្ធិ និងសុវត្ថិភាព",
    
    // Stats
    todayIncome: "ចំណូលថ្ងៃនេះ",
    todayExpense: "ចំណាយថ្ងៃនេះ",
    todayProfit: "ប្រាក់ចំណេញថ្ងៃនេះ",
    monthlyIncome: "ចំណូលខែនេះ",
    monthlyExpense: "ចំណាយខែនេះ",
    monthlyProfit: "ប្រាក់ចំណេញខែនេះ",
    yearlyIncome: "ចំណូលឆ្នាំនេះ",
    yearlyExpense: "ចំណាយឆ្នាំនេះ",
    yearlyProfit: "ប្រាក់ចំណេញឆ្នាំនេះ",
    salaryExpense: "ចំណាយប្រាក់ខែបុគ្គលិក",
    utilityExpense: "ចំណាយទឹកភ្លើង",
    supplyExpense: "ចំណាយសាប៊ូ/ទឹកក្រអូប",
    profitRange: "តារាងចំណូលចំណាយ",
    lowStockAlert: "ការដាស់តឿនស្តុកទាប",
    salaryReminder: "រំលឹកការបើកប្រាក់ខែ",
    machineMaintenanceReminder: "ម៉ាស៊ីនដល់ពេលថែទាំ",
    unpaidTransactions: "ប្រតិបត្តិការមិនទាន់ទូទាត់",
    
    // General terms
    activeBranch: "សាខាសកម្ម",
    allBranches: "សាខាទាំងអស់ (រួមបញ្ចូលគ្នា)",
    branchSelector: "ជ្រើសរើសសាខា",
    addNews: "បង្កើតថ្មី",
    edit: "កែសម្រួល",
    delete: "លុប",
    save: "រក្សាទុក",
    cancel: "បោះបង់",
    actions: "សកម្មភាព",
    search: "ស្វែងរក...",
    print: "បោះពុម្ព",
    exportExcel: "ទាញយកជា Excel",
    exportPDF: "ទាញយកជា PDF",
    status: "ស្ថានភាព",
    active: "ដំណើរការ",
    inactive: "ផ្អាកដំណើរការ",
    currency: "រូបិយប័ណ្ណ",
    exchangeRate: "អត្រាប្តូរប្រាក់",
    totalAmount: "ទឹកប្រាក់សរុប",
    paymentMethod: "វិធីសាស្ត្រទូទាត់",
    note: "កំណត់ចំណាំ",
    date: "កាលបរិច្ឆេទ",
    quantity: "ចំនួន",
    unitPrice: "តម្លៃរាយ",
    discount: "បញ្ចុះតម្លៃ",
    
    // Multi branch labels
    branchCode: "កូដសាខា",
    branchName: "ឈ្មោះសាខា",
    branchAddress: "អាសយដ្ឋានសាខា",
    branchPhone: "លេខទូរស័ព្ទសាខា",
    branchManager: "អ្នកគ្រប់គ្រងសាខា",
    openingHours: "ម៉ោងបើកទ្វារ",
    bestPerforming: "សាខាដំណើរការល្អបំផុត",
    branchRanking: "ចំណាត់ថ្នាក់របស់សាខា",
    compareIncome: "ប្រៀបធៀបចំណូល",
    compareExpense: "ប្រៀបធៀបចំណាយ",
    compareProfit: "ប្រៀបធៀបប្រាក់ចំណេញ",
    
    // Staff metrics
    staffId: "អត្តសញ្ញាណប័ណ្ណបុគ្គលិក",
    fullName: "ឈ្មោះពេញ",
    gender: "ភេទ",
    dob: "ថ្ងៃខែឆ្នាំកំណើត",
    phone: "លេខទូរស័ព្ទ",
    address: "អាសយដ្ឋាន",
    position: "តួនាទី",
    shift: "វេនការងារ",
    startDate: "ថ្ងៃចូលបម្រើការងារ",
    baseSalary: "ប្រាក់ខែគោល",
    idCard: "លេខអត្តសញ្ញាណប័ណ្ណ",
    emergency: "ទំនាក់ទំនងបន្ទាន់",
    photo: "រូបថត",
    resigned: "លាឈប់",
    suspended: "ព្យួរការងារ",
    
    // Salary metrics
    salaryPeriod: "វដ្តបើកប្រាក់ខែ",
    overtime: "ថែមម៉ោង (OT)",
    bonus: "ប្រាក់លើកទឹកចិត្ត",
    deduction: "ការផាកពិន័យ/កាត់កង",
    advance: "បុរេប្រទាន/បើកមុន",
    netSalary: "ប្រាក់ខែសុទ្ធ",
    paymentDate: "ថ្ងៃបើកប្រាក់",
    paidBy: "បើកប្រាក់ដោយ",
    paid: "បានបើក",
    unpaid: "មិនទាន់បើក",
    customPeriod: "កាលកំណត់ផ្ទាល់ខ្លួន",
    
    // Attendance
    checkIn: "ម៉ោងចូល",
    checkOut: "ម៉ោងចេញ",
    workHours: "ម៉ោងធ្វើការសរុប",
    overtimeHours: "ម៉ោងថែមសរុប",
    present: "វត្តមាន",
    absent: "អវត្តមាន",
    late: "យឺត",
    dayOff: "ថ្ងៃសម្រាក",
    
    // Machine list
    machineId: "លេខកូដម៉ាស៊ីន",
    machineType: "ប្រភេទម៉ាស៊ីន",
    machineNumber: "លេខម៉ាស៊ីន",
    brand: "ម៉ាក",
    capacity: "ចំណុះ (គីឡូ)",
    available: "ទំនេរ",
    inUse: "កំពុងបោក/សមោ្ងត",
    maintenance: "កំពុងថែទាំ",
    broken: "ខូច",
    maintenanceHistory: "ប្រវត្តិនៃការថែទាំ",
    revenueByMachine: "ចំណូលតាមម៉ាស៊ីន",
    washer: "ម៉ាស៊ីនបោក",
    dryer: "ម៉ាស៊ីនសម្ងួត",
    
    // Inventory
    itemName: "ឈ្មោះមុខទំនិញ",
    category: "ប្រភេទ",
    unit: "ឯកតា",
    currentStock: "ស្តុកបច្ចុប្បន្ន",
    minStock: "កម្រិតដាស់តឿនស្តុក",
    purchasePrice: "តម្លៃទិញចូល",
    supplier: "អ្នកផ្គត់ផ្គង់",
    remainingStock: "ស្តុកនៅសល់",
    stockIn: "ទិញចូល (+)",
    stockOut: "ប្រើប្រាស់ (-)",
    
    // Reports list
    dailyIncomeRep: "របាយការណ៍ចំណូលប្រចាំថ្ងៃ",
    monthlyIncomeRep: "របាយការណ៍ចំណូលប្រចាំខែ",
    yearlyIncomeRep: "របាយការណ៍ចំណូលប្រចាំឆ្នាំ",
    dailyExpenseRep: "របាយការណ៍ចំណាយប្រចាំថ្ងៃ",
    monthlyExpenseRep: "របាយការណ៍ចំណាយប្រចាំខែ",
    yearlyExpenseRep: "របាយការណ៍ចំណាយប្រចាំឆ្នាំ",
    salaryRep: "របាយការណ៍ប្រាក់បៀវត្សរ៍",
    staffRep: "បញ្ជីឈ្មោះបុគ្គលិក",
    attendanceRep: "របាយការណ៍វត្តមាន",
    inventoryRep: "របាយការណ៍សន្និធិស្តុក",
    paymentRep: "របាយការណ៍ទូទាត់ការបង្វែរប្រាក់",
    machineRevenueRep: "របាយការណ៍ចំណូលតាមម៉ាស៊ីន",
    profitLossRep: "របាយការណ៍ចំណេញ និងខាត (P&L)",
    branchCompareRep: "របាយការណ៍ប្រៀបធៀបតាមសាខា",
    
    // Settings
    shopInfo: "ព័ត៌មានហាង",
    backupRestore: "ចម្លងទុកបំរុង & ស្ដារទិន្នន័យ",
    backupSuccess: "ការចម្លងទិ​ន្នន័យបំរុងបានជោគជ័យ! ការទាញយកបានចាប់ផ្ដើម។",
    restoreSuccess: "ការស្ដារទិន្នន័យត្រូវបានបញ្ចប់ដោយជោគជ័យ!",
    khmerFont: "ប្រើប្រាស់ពុម្ពអក្សរខ្មែរទំនើប",
    
    // User credentials
    roleOwner: "ម្ចាស់ហាង (មើលគ្រប់សាខា)",
    roleAdmin: "អតីតអភិបាល (មើលសាខាដែលចាត់តាំង)",
    roleManager: "អ្នកគ្រប់គ្រង (មើលតែសាខាខ្លួន)",
    roleStaff: "បុគ្គលិក (បញ្ចូលតែចំណូល)",
    currentUserLabel: "ការបង្ហាញតាមតួនាទីសាកល្បង",
    warningRoleLimit: "ទំព័រនេះត្រូវបានចាក់សោសម្រាប់តួនាទីបច្ចុប្បន្នរបស់អ្នក ដោយសារច្បាប់បំបែកទិន្នន័យសាខាយ៉ាងតឹងរ៉ឹង។"
  }
};

// Initial Sample Users
export const initialUsers: User[] = [
  { id: 'u1', username: 'owner_sophy', email: 'owner@clean24.com', fullName: 'Seng Sophy', role: 'Owner', assignedBranchIds: [], status: 'Active' },
  { id: 'u2', username: 'admin_darith', email: 'darith.admin@clean24.com', fullName: 'Chan Darith', role: 'Admin', assignedBranchIds: ['b1', 'b2'], status: 'Active' },
  { id: 'u3', username: 'manager_piseth', email: 'piseth.tk@clean24.com', fullName: 'Nguon Piseth', role: 'Manager', assignedBranchIds: ['b1'], status: 'Active' },
  { id: 'u4', username: 'staff_reaksmey', email: 'reaksmey.staff@clean24.com', fullName: 'Sok Reaksmey', role: 'Staff', assignedBranchIds: ['b1'], status: 'Active' }
];

// Initial Sample Branches in Phnom Penh
export const initialBranches: Branch[] = [
  {
    id: 'b1',
    branchCode: 'C24-SN12',
    branchName: 'SN12 Branch',
    address: 'St. 271, Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh',
    phone: '012 345 678',
    managerId: 'u3',
    managerName: 'Nguon Piseth',
    openingTime: '06:00 AM',
    closingTime: '10:00 PM',
    status: 'Active',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'b2',
    branchCode: 'C24-VS02',
    branchName: 'Veng Sreng Branch',
    address: 'Veng Sreng Blvd, Sangkat Choam Chao, Khan Pou Senchey, Phnom Penh',
    phone: '098 765 432',
    managerId: 'u2',
    managerName: 'Chan Darith',
    openingTime: '06:00 AM',
    closingTime: '10:00 PM',
    status: 'Active',
    createdAt: '2026-02-15T09:30:00Z',
    updatedAt: '2026-02-15T09:30:00Z'
  },
  {
    id: 'b3',
    branchCode: 'C24-SS03',
    branchName: 'Sen Sok Branch',
    address: 'Mong Reththy Blvd, Sangkat Phnom Penh Thmey, Khan Sen Sok, Phnom Penh',
    phone: '077 888 999',
    managerId: 'u1',
    managerName: 'Seng Sophy (acting)',
    openingTime: '06:00 AM',
    closingTime: '10:00 PM',
    status: 'Active',
    createdAt: '2026-03-22T10:15:00Z',
    updatedAt: '2026-03-22T10:15:00Z'
  },
  {
    id: 'b4',
    branchCode: 'C24-CH04',
    branchName: 'Clean24 Chroy Changvar',
    address: 'National Road 6, Sangkat Chroy Changvar, Khan Chroy Changvar, Phnom Penh',
    phone: '085 111 222',
    managerId: 'u1',
    managerName: 'Unassigned',
    openingTime: '06:00 AM',
    closingTime: '10:00 PM',
    status: 'Inactive',
    createdAt: '2026-04-01T11:00:00Z',
    updatedAt: '2026-05-10T14:20:00Z'
  }
];

// Initial Staff Roster linked to branchIds
export const initialStaff: Staff[] = [
  {
    id: 's1',
    branchId: 'b1',
    fullName: 'Nguon Piseth',
    gender: 'Male',
    dob: '1992-05-12',
    phone: '012 999 888',
    address: 'Sangkat Teuk Laak, Khan Toul Kork',
    position: 'Manager',
    shift: 'Full Time',
    startDate: '2026-01-12',
    baseSalary: 650,
    status: 'Active',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    idCardNumber: '0120265432',
    emergencyContact: '012 999 881 (Spouse)'
  },
  {
    id: 's2',
    branchId: 'b1',
    fullName: 'Sok Reaksmey',
    gender: 'Female',
    dob: '1998-08-20',
    phone: '096 444 555',
    address: 'Sangkat Boeung Salang, Khan Toul Kork',
    position: 'Cashier',
    shift: 'Morning',
    startDate: '2026-01-15',
    baseSalary: 280,
    status: 'Active',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    idCardNumber: '0250987654',
    emergencyContact: '096 444 551 (Mother)'
  },
  {
    id: 's3',
    branchId: 'b1',
    fullName: 'Khorn Sothea',
    gender: 'Male',
    dob: '1995-11-03',
    phone: '085 222 333',
    address: 'Sangkat Phsar Depo, Khan Toul Kork',
    position: 'Technician',
    shift: 'Afternoon',
    startDate: '2026-01-20',
    baseSalary: 350,
    status: 'Active',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    idCardNumber: '0150987111',
    emergencyContact: '085 222 330 (Father)'
  },
  {
    id: 's4',
    branchId: 'b2',
    fullName: 'Oung Sreylen',
    gender: 'Female',
    dob: '2000-02-14',
    phone: '015 678 910',
    address: 'Sangkat Olympic, Khan Chamkar Mon',
    position: 'Cashier',
    shift: 'Night',
    startDate: '2026-02-18',
    baseSalary: 300,
    status: 'Active',
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200',
    idCardNumber: '024119875',
    emergencyContact: '015 678 900 (Sister)'
  },
  {
    id: 's5',
    branchId: 'b2',
    fullName: 'Chea Voleak',
    gender: 'Female',
    dob: '1999-04-25',
    phone: '093 321 654',
    address: 'Sangkat Boeung Trabek, Khan Chamkar Mon',
    position: 'Helper',
    shift: 'Morning',
    startDate: '2026-02-20',
    baseSalary: 230,
    status: 'Active',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    idCardNumber: '0130987222',
    emergencyContact: '093 321 611 (Brother)'
  },
  {
    id: 's6',
    branchId: 'b3',
    fullName: 'Heng Samnang',
    gender: 'Male',
    dob: '1993-09-08',
    phone: '077 555 666',
    address: 'Sangkat Phnom Penh Thmey, Khan Sen Sok',
    position: 'Helper',
    shift: 'Afternoon',
    startDate: '2026-03-24',
    baseSalary: 230,
    status: 'Active',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    idCardNumber: '0142898711',
    emergencyContact: '077 555 661 (Mother)'
  },
  {
    id: 's7',
    branchId: 'b1',
    fullName: 'Keo Mesa',
    gender: 'Male',
    dob: '1996-03-12',
    phone: '017 333 444',
    address: 'Sangkat Teuk Thla, Khan Sen Sok',
    position: 'Helper',
    shift: 'Morning',
    startDate: '2026-02-01',
    baseSalary: 230,
    status: 'Resigned',
    photoUrl: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=200',
    idCardNumber: '010098335',
    emergencyContact: '017 333 400 (Uncle)'
  }
];

// Initial Salaries Paid
export const initialSalaries: Salary[] = [
  // Toul Kork Salaries for May 2026
  {
    id: 'sal1',
    branchId: 'b1',
    staffId: 's1',
    staffName: 'Nguon Piseth',
    salaryPeriod: '2026-05',
    baseSalary: 650,
    overtime: 45,
    bonus: 50,
    deduction: 10,
    advancePayment: 100,
    netSalary: 635, // 650 + 45 + 50 - 10 - 100
    paymentDate: '2026-05-31',
    paymentMethod: 'Bank Transfer',
    paidBy: 'Seng Sophy',
    note: 'Premium Manager Monthly salary + bonus performance',
    status: 'Paid'
  },
  {
    id: 'sal2',
    branchId: 'b1',
    staffId: 's2',
    staffName: 'Sok Reaksmey',
    salaryPeriod: '2026-05',
    baseSalary: 280,
    overtime: 25,
    bonus: 20,
    deduction: 0,
    advancePayment: 0,
    netSalary: 325,
    paymentDate: '2026-05-31',
    paymentMethod: 'ABA',
    paidBy: 'Nguon Piseth',
    note: 'Regular morning shift cashier payout',
    status: 'Paid'
  },
  {
    id: 'sal3',
    branchId: 'b1',
    staffId: 's3',
    staffName: 'Khorn Sothea',
    salaryPeriod: '2026-05',
    baseSalary: 350,
    overtime: 15,
    bonus: 0,
    deduction: 15,
    advancePayment: 30,
    netSalary: 320,
    paymentDate: '2026-05-31',
    paymentMethod: 'ABA',
    paidBy: 'Nguon Piseth',
    note: 'Deducted 15$ for broken washer accessory replacement',
    status: 'Paid'
  },
  // BKK Salaries
  {
    id: 'sal4',
    branchId: 'b2',
    staffId: 's4',
    staffName: 'Oung Sreylen',
    salaryPeriod: '2026-05',
    baseSalary: 300,
    overtime: 60,
    bonus: 30,
    deduction: 0,
    advancePayment: 0,
    netSalary: 390,
    paymentDate: '2026-05-31',
    paymentMethod: 'ABA',
    paidBy: 'Seng Sophy',
    note: 'High volume BKK Night Shift shift premium included',
    status: 'Paid'
  },
  {
    id: 'sal5',
    branchId: 'b2',
    staffId: 's5',
    staffName: 'Chea Voleak',
    salaryPeriod: '2026-05',
    baseSalary: 230,
    overtime: 10,
    bonus: 10,
    deduction: 5,
    advancePayment: 0,
    netSalary: 245,
    paymentDate: '2026-05-31',
    paymentMethod: 'Cash',
    paidBy: 'Chan Darith',
    note: 'Late arrivals deduction 5$',
    status: 'Paid'
  },
  // Unpaid current salaries (June 2026) for testing
  {
    id: 'sal6',
    branchId: 'b1',
    staffId: 's1',
    staffName: 'Nguon Piseth',
    salaryPeriod: '2026-06',
    baseSalary: 650,
    overtime: 0,
    bonus: 0,
    deduction: 0,
    advancePayment: 50,
    netSalary: 600,
    paymentDate: '',
    paymentMethod: 'ABA',
    paidBy: '',
    note: 'Advance 50$ approved mid-month',
    status: 'Unpaid'
  },
  {
    id: 'sal7',
    branchId: 'b1',
    staffId: 's2',
    staffName: 'Sok Reaksmey',
    salaryPeriod: '2026-06',
    baseSalary: 280,
    overtime: 0,
    bonus: 0,
    deduction: 0,
    advancePayment: 0,
    netSalary: 280,
    paymentDate: '',
    paymentMethod: 'ABA',
    paidBy: '',
    note: '',
    status: 'Unpaid'
  }
];

// Initial Attendance Records (June 1 to June 5, 2026)
export const initialAttendance: Attendance[] = [
  // June 1
  { id: 'att1', branchId: 'b1', staffId: 's1', staffName: 'Nguon Piseth', date: '2026-06-01', checkIn: '06:00 AM', checkOut: '04:00 PM', shiftType: 'Full Time', workHours: 9, overtimeHours: 1, status: 'Present' },
  { id: 'att2', branchId: 'b1', staffId: 's2', staffName: 'Sok Reaksmey', date: '2026-06-01', checkIn: '05:58 AM', checkOut: '02:00 PM', shiftType: 'Morning', workHours: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att3', branchId: 'b1', staffId: 's3', staffName: 'Khorn Sothea', date: '2026-06-01', checkIn: '02:05 PM', checkOut: '10:00 PM', shiftType: 'Afternoon', workHours: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att4', branchId: 'b2', staffId: 's4', staffName: 'Oung Sreylen', date: '2026-06-01', checkIn: '10:00 PM', checkOut: '06:00 AM', shiftType: 'Night', workHours: 8, overtimeHours: 0, status: 'Present' },
  
  // June 2
  { id: 'att5', branchId: 'b1', staffId: 's1', staffName: 'Nguon Piseth', date: '2026-06-02', checkIn: '06:15 AM', checkOut: '04:00 PM', shiftType: 'Full Time', workHours: 8.75, overtimeHours: 0, status: 'Late' },
  { id: 'att6', branchId: 'b1', staffId: 's2', staffName: 'Sok Reaksmey', date: '2026-06-02', checkIn: '05:55 AM', checkOut: '02:00 PM', shiftType: 'Morning', workHours: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att7', branchId: 'b1', staffId: 's3', staffName: 'Khorn Sothea', date: '2026-06-02', checkIn: '', checkOut: '', shiftType: 'Afternoon', workHours: 0, overtimeHours: 0, status: 'Absent' },
  
  // June 3
  { id: 'att8', branchId: 'b1', staffId: 's1', staffName: 'Nguon Piseth', date: '2026-06-03', checkIn: '06:00 AM', checkOut: '04:00 PM', shiftType: 'Full Time', workHours: 9, overtimeHours: 1, status: 'Present' },
  { id: 'att9', branchId: 'b1', staffId: 's2', staffName: 'Sok Reaksmey', date: '2026-06-03', checkIn: '', checkOut: '', shiftType: 'Morning', workHours: 0, overtimeHours: 0, status: 'Day Off' },
  { id: 'att10', branchId: 'b1', staffId: 's3', staffName: 'Khorn Sothea', date: '2026-06-03', checkIn: '02:00 PM', checkOut: '10:00 PM', shiftType: 'Afternoon', workHours: 8, overtimeHours: 0, status: 'Present' }
];

// Initial Incomes
export const initialIncomes: Income[] = [
  // Toul Kork Branch (B1)
  {
    id: 'inc1',
    branchId: 'b1',
    date: '2026-06-06',
    serviceType: 'Washing + Drying',
    machineNumber: 'W-01 (12kg)',
    quantity: 2,
    unitPrice: 5.0,
    discount: 0.5,
    totalAmount: 9.5, // 2 * 5 - 0.5
    paymentMethod: 'ABA',
    staffInCharge: 'Sok Reaksmey',
    customerNote: 'Customer selected extra perfume softener'
  },
  {
    id: 'inc2',
    branchId: 'b1',
    date: '2026-06-06',
    serviceType: 'Washing',
    machineNumber: 'W-03 (15kg)',
    quantity: 1,
    unitPrice: 4.0,
    discount: 0.0,
    totalAmount: 4.0,
    paymentMethod: 'Cash',
    staffInCharge: 'Sok Reaksmey',
    customerNote: 'Wash only cold water'
  },
  {
    id: 'inc3',
    branchId: 'b1',
    date: '2026-06-05',
    serviceType: 'Washing + Drying',
    machineNumber: 'W-02 (9kg)',
    quantity: 3,
    unitPrice: 3.5,
    discount: 1.0,
    totalAmount: 9.5,
    paymentMethod: 'QR Payment',
    staffInCharge: 'Nguon Piseth',
    customerNote: 'Regular customer loyalty discount'
  },
  {
    id: 'inc4',
    branchId: 'b1',
    date: '2026-06-04',
    serviceType: 'Drying',
    machineNumber: 'D-02 (15kg)',
    quantity: 4,
    unitPrice: 2.5,
    discount: 0.0,
    totalAmount: 10.0,
    paymentMethod: 'Bank Transfer',
    staffInCharge: 'Khorn Sothea',
    customerNote: 'Drying wet blankets'
  },
  // Boeung Keng Kang Branch (B2)
  {
    id: 'inc5',
    branchId: 'b2',
    date: '2026-06-06',
    serviceType: 'Washing + Drying',
    machineNumber: 'W-21 (15kg)',
    quantity: 3,
    unitPrice: 6.0,
    discount: 2.0,
    totalAmount: 16.0,
    paymentMethod: 'ABA',
    staffInCharge: 'Oung Sreylen',
    customerNote: 'Premium high capacity express washing'
  },
  {
    id: 'inc6',
    branchId: 'b2',
    date: '2026-06-05',
    serviceType: 'Washing',
    machineNumber: 'W-22 (9kg)',
    quantity: 5,
    unitPrice: 3.5,
    discount: 0.0,
    totalAmount: 17.5,
    paymentMethod: 'QR Payment',
    staffInCharge: 'Chea Voleak',
    customerNote: 'Hotel bulk napkins washing process'
  },
  // Sen Sok Branch (B3)
  {
    id: 'inc7',
    branchId: 'b3',
    date: '2026-06-06',
    serviceType: 'Washing + Drying',
    machineNumber: 'W-31 (12kg)',
    quantity: 2,
    unitPrice: 4.5,
    discount: 0.5,
    totalAmount: 8.5,
    paymentMethod: 'Cash',
    staffInCharge: 'Heng Samnang',
    customerNote: 'Cash transaction'
  },
  {
    id: 'inc8',
    branchId: 'b3',
    date: '2026-06-04',
    serviceType: 'Other',
    machineNumber: 'Manual Handwash',
    quantity: 1,
    unitPrice: 25.0,
    discount: 2.0,
    totalAmount: 23.0,
    paymentMethod: 'Bank Transfer',
    staffInCharge: 'Heng Samnang',
    customerNote: 'Delicate silk dress treatment'
  }
];

// Initial Expenses
export const initialExpenses: Expense[] = [
  // Toul Kork Expenses (B1)
  {
    id: 'exp1',
    branchId: 'b1',
    expenseDate: '2026-06-05',
    category: 'Water Bill',
    description: 'PPWSA Water supply billing for May 2026',
    amount: 85.0,
    paymentMethod: 'ABA',
    paidTo: 'Phnom Penh Water Supply Authority',
    receiptUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93ec23?auto=format&fit=crop&q=80&w=200',
    createdBy: 'Nguon Piseth',
    note: 'Invoiced ID PPWSA-2026-9938'
  },
  {
    id: 'exp2',
    branchId: 'b1',
    expenseDate: '2026-06-04',
    category: 'Electricity Bill',
    description: 'EDC Power consumption statement',
    amount: 145.0,
    paymentMethod: 'Bank Transfer',
    paidTo: 'Electricite du Cambodge',
    receiptUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93ec23?auto=format&fit=crop&q=80&w=200',
    createdBy: 'Nguon Piseth',
    note: 'High Dryer usage heat power'
  },
  {
    id: 'exp3',
    branchId: 'b1',
    expenseDate: '2026-06-02',
    category: 'Gas',
    description: 'Drying heating propane cylinder refilling 45kg x 2',
    amount: 68.0,
    paymentMethod: 'Cash',
    paidTo: 'LPG Gas Station TK',
    receiptUrl: '',
    createdBy: 'Khorn Sothea',
    note: 'Propane gas tanks refitted into dryers'
  },
  {
    id: 'exp4',
    branchId: 'b1',
    expenseDate: '2026-05-30',
    category: 'Soap',
    description: 'Bulk purchase liquid detergent 10 drums x 20L',
    amount: 120.0,
    paymentMethod: 'ABA',
    paidTo: 'Lando Supplies Cambodia',
    receiptUrl: '',
    createdBy: 'Nguon Piseth',
    note: 'OxyClean detergent formula'
  },
  // BKK Expenses (B2)
  {
    id: 'exp5',
    branchId: 'b2',
    expenseDate: '2026-06-05',
    category: 'Land Rent',
    description: 'Monthly office rent BKK St 51',
    amount: 450.0,
    paymentMethod: 'Bank Transfer',
    paidTo: 'Oknha Bun Seng',
    receiptUrl: '',
    createdBy: 'Seng Sophy',
    note: 'June Rental pre-paid'
  },
  {
    id: 'exp6',
    branchId: 'b2',
    expenseDate: '2026-06-03',
    category: 'Repair and Maintenance',
    description: 'Washer belt replacement and calibration service',
    amount: 55.0,
    paymentMethod: 'Cash',
    paidTo: 'TK Mechanics Group',
    receiptUrl: '',
    createdBy: 'Chan Darith',
    note: 'Machine W-23'
  }
];

// Initial Inventory
export const initialInventory: InventoryItem[] = [
  // Toul Kork (B1)
  {
    id: 'inv1',
    branchId: 'b1',
    itemName: 'UltraClean Liquid Soap',
    category: 'Soap',
    unit: 'Bottle (5L)',
    currentStock: 25,
    minimumStockAlert: 10,
    purchasePrice: 8.5,
    supplier: 'CleanChem Supply Co., Ltd',
    purchaseDate: '2026-05-20',
    usedQuantity: 15,
    remainingStock: 10 // currentStock is remaining or remaining = stock
  },
  {
    id: 'inv2',
    branchId: 'b1',
    itemName: 'Lavender Softener',
    category: 'Fabric Softener',
    unit: 'Bottle (5L)',
    currentStock: 18,
    minimumStockAlert: 5,
    purchasePrice: 6.0,
    supplier: 'CleanChem Supply Co., Ltd',
    purchaseDate: '2026-05-20',
    usedQuantity: 12,
    remainingStock: 6
  },
  {
    id: 'inv3',
    branchId: 'b1',
    itemName: 'Large Premium Plastic Bags',
    category: 'Plastic Bag',
    unit: 'Roll (100pcs)',
    currentStock: 15,
    minimumStockAlert: 5,
    purchasePrice: 4.5,
    supplier: 'Phnom Penh Plastic Wholesale',
    purchaseDate: '2026-05-18',
    usedQuantity: 11,
    remainingStock: 4 // Trigger Alert!
  },
  {
    id: 'inv4',
    branchId: 'b1',
    itemName: 'Heavy Duty Laundry Baskets',
    category: 'Basket',
    unit: 'Piece',
    currentStock: 40,
    minimumStockAlert: 8,
    purchasePrice: 2.2,
    supplier: 'Dara Plastic Store',
    purchaseDate: '2026-02-10',
    usedQuantity: 0,
    remainingStock: 40
  },
  // BKK (B2)
  {
    id: 'inv5',
    branchId: 'b2',
    itemName: 'UltraClean Liquid Soap',
    category: 'Soap',
    unit: 'Bottle (5L)',
    currentStock: 30,
    minimumStockAlert: 10,
    purchasePrice: 8.5,
    supplier: 'CleanChem Supply Co., Ltd',
    purchaseDate: '2026-05-25',
    usedQuantity: 28,
    remainingStock: 2 // Trigger Alert!
  },
  {
    id: 'inv6',
    branchId: 'b2',
    itemName: 'Lavender Softener',
    category: 'Fabric Softener',
    unit: 'Bottle (5L)',
    currentStock: 25,
    minimumStockAlert: 5,
    purchasePrice: 6.0,
    supplier: 'CleanChem Supply Co., Ltd',
    purchaseDate: '2026-05-25',
    usedQuantity: 10,
    remainingStock: 15
  }
];

// Initial Machines list
export const initialMachines: Machine[] = [
  // Toul Kork (B1)
  { id: 'm1', branchId: 'b1', machineId: 'M-TK-W01', machineType: 'Washer', machineNumber: 'W-01', brand: 'LG Commercial', capacity: 12, status: 'In Use', purchaseDate: '2026-01-12', maintenanceNote: 'Last service May 10, calibrated spin cycle', revenue: 470 },
  { id: 'm2', branchId: 'b1', machineId: 'M-TK-W02', machineType: 'Washer', machineNumber: 'W-02', brand: 'LG Commercial', capacity: 9, status: 'Available', purchaseDate: '2026-01-12', maintenanceNote: 'Fitted new inlet hose', revenue: 380 },
  { id: 'm3', branchId: 'b1', machineId: 'M-TK-W03', machineType: 'Washer', machineNumber: 'W-03', brand: 'Speed Queen', capacity: 15, status: 'Maintenance', purchaseDate: '2026-02-05', maintenanceNote: 'Inlet valve repair in progress', revenue: 590 },
  { id: 'm4', branchId: 'b1', machineId: 'M-TK-D01', machineType: 'Dryer', machineNumber: 'D-01', brand: 'Speed Queen Gas', capacity: 15, status: 'Available', purchaseDate: '2026-01-12', maintenanceNote: 'Exhaust lint filters vacuumed daily', revenue: 420 },
  { id: 'm5', branchId: 'b1', machineId: 'M-TK-D02', machineType: 'Dryer', machineNumber: 'D-02', brand: 'LG Commercial', capacity: 12, status: 'Broken', purchaseDate: '2026-01-15', maintenanceNote: 'Heating element disconnected, awaiting parts', revenue: 210 },
  
  // BKK (B2)
  { id: 'm6', branchId: 'b2', machineId: 'M-BKK-W21', machineType: 'Washer', machineNumber: 'W-21', brand: 'LG Commercial', capacity: 15, status: 'In Use', purchaseDate: '2026-02-18', maintenanceNote: 'Perfect status', revenue: 620 },
  { id: 'm7', branchId: 'b2', machineId: 'M-BKK-W22', machineType: 'Washer', machineNumber: 'W-22', brand: 'LG Commercial', capacity: 9, status: 'Available', purchaseDate: '2026-02-18', maintenanceNote: 'Calibrated', revenue: 290 },
  { id: 'm8', branchId: 'b2', machineId: 'M-BKK-D21', machineType: 'Dryer', machineNumber: 'D-21', brand: 'Speed Queen Gas', capacity: 15, status: 'Available', purchaseDate: '2026-02-18', maintenanceNote: 'Cleaned', revenue: 510 },
  
  // Sen Sok (B3)
  { id: 'm9', branchId: 'b3', machineId: 'M-SS-W31', machineType: 'Washer', machineNumber: 'W-31', brand: 'Speed Queen', capacity: 12, status: 'Available', purchaseDate: '2026-03-24', maintenanceNote: 'Newly installed', revenue: 150 },
  { id: 'm10', branchId: 'b3', machineId: 'M-SS-D31', machineType: 'Dryer', machineNumber: 'D-31', brand: 'LG Commercial', capacity: 12, status: 'In Use', purchaseDate: '2026-03-24', maintenanceNote: 'Newly installed', revenue: 110 }
];

// App Settings
export const initialSettings: AppSettings = {
  shopName: "Clean24 Laundry",
  openingHours: "6:00 AM – 10:00 PM",
  mainCurrency: "USD",
  khmerExchangeRate: 4100,
  language: "en",
  darkMode: false,
  expenseCategories: [
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
  ],
  incomeCategories: [
    'Washing',
    'Drying',
    'Washing + Drying',
    'Other'
  ],
  paymentMethods: [
    'Cash',
    'ABA',
    'Bank Transfer',
    'QR Payment'
  ]
};

// Initial Sample Coin Transactions
export const initialCoinTransactions: CoinTransaction[] = [
  { id: 'coin1', branchId: 'b1', date: '2026-06-06', amount: 150, valueUsd: 37.5, type: 'In', createdBy: 'Sok Reaksmey', createdAt: '2026-06-06T08:00:00Z', updatedAt: '2026-06-06T08:00:00Z', note: 'Customer exchanged dollar cash for 150 coins' },
  { id: 'coin2', branchId: 'b1', date: '2026-06-05', amount: 400, valueUsd: 100.0, type: 'Out', createdBy: 'Nguon Piseth', createdAt: '2026-06-05T18:30:00Z', updatedAt: '2026-06-05T18:30:00Z', note: 'Empty coin acceptor from Washer W-01 and W-02' },
  { id: 'coin3', branchId: 'b2', date: '2026-06-06', amount: 200, valueUsd: 50.0, type: 'In', createdBy: 'Oung Sreylen', createdAt: '2026-06-06T10:15:00Z', updatedAt: '2026-06-06T10:15:00Z', note: 'Token coin dispenser refilled' },
  { id: 'coin4', branchId: 'b3', date: '2026-06-06', amount: 80, valueUsd: 20.0, type: 'In', createdBy: 'Heng Samnang', createdAt: '2026-06-06T09:00:00Z', updatedAt: '2026-06-06T09:00:00Z', note: 'Manual coin exchange' }
];

// Initial Sample Revenue Records
export const initialRevenueRecords: RevenueRecord[] = [
  {
    id: 'rev_b2_2026_06_01',
    branchId: 'b2',
    date: '2026-06-01',
    time: '10:30',
    startCounter: 13441000,
    endCounter: 13613000,
    startCounterAba: 35632000,
    endCounterAba: 36298000,
    counterRevenue: 838000,
    cash: 172000,
    aba: 666000,
    dailyRevenue: 838000,
    bankDeposit: 0,
    remainingCash: 838000,
    actualCashCount: 172000,
    difference: 0,
    amountUsd: 209.50,
    amountKhr: 838000,
    paymentMethod: 'ABA',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-01T10:30:00Z',
    updatedAt: '2026-06-01T10:30:00Z',
    status: 'Submitted',
    note: ''
  },
  {
    id: 'rev_b2_2026_06_02',
    branchId: 'b2',
    date: '2026-06-02',
    time: '10:30',
    startCounter: 13613000,
    endCounter: 13748000,
    startCounterAba: 36298000,
    endCounterAba: 36854000,
    counterRevenue: 691000,
    cash: 135000,
    aba: 556000,
    dailyRevenue: 691000,
    bankDeposit: 0,
    remainingCash: 691000,
    actualCashCount: 135000,
    difference: 0,
    amountUsd: 172.75,
    amountKhr: 691000,
    paymentMethod: 'ABA',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-02T10:30:00Z',
    updatedAt: '2026-06-02T10:30:00Z',
    status: 'Submitted',
    note: ''
  },
  {
    id: 'rev_b2_2026_06_03',
    branchId: 'b2',
    date: '2026-06-03',
    time: '10:30',
    startCounter: 13748000,
    endCounter: 13893000,
    startCounterAba: 36854000,
    endCounterAba: 37279000,
    counterRevenue: 570000,
    cash: 145000,
    aba: 425000,
    dailyRevenue: 570000,
    bankDeposit: 0,
    remainingCash: 570000,
    actualCashCount: 145000,
    difference: 0,
    amountUsd: 142.50,
    amountKhr: 570000,
    paymentMethod: 'ABA',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-03T10:30:00Z',
    updatedAt: '2026-06-03T10:30:00Z',
    status: 'Submitted',
    note: ''
  },
  {
    id: 'rev_b2_2026_06_04',
    branchId: 'b2',
    date: '2026-06-04',
    time: '10:30',
    startCounter: 13893000,
    endCounter: 14102000,
    startCounterAba: 37279000,
    endCounterAba: 37749000,
    counterRevenue: 679000,
    cash: 209000,
    aba: 470000,
    dailyRevenue: 679000,
    bankDeposit: 0,
    remainingCash: 679000,
    actualCashCount: 209000,
    difference: 0,
    amountUsd: 169.75,
    amountKhr: 679000,
    paymentMethod: 'ABA',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-04T10:30:00Z',
    updatedAt: '2026-06-04T10:30:00Z',
    status: 'Submitted',
    note: ''
  },
  {
    id: 'rev_b2_2026_06_05',
    branchId: 'b2',
    date: '2026-06-05',
    time: '10:30',
    startCounter: 14102000,
    endCounter: 14356000,
    startCounterAba: 37749000,
    endCounterAba: 38484000,
    counterRevenue: 989000,
    cash: 254000,
    aba: 735000,
    dailyRevenue: 989000,
    bankDeposit: 0,
    remainingCash: 989000,
    actualCashCount: 254000,
    difference: 0,
    amountUsd: 247.25,
    amountKhr: 989000,
    paymentMethod: 'ABA',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-05T10:30:00Z',
    updatedAt: '2026-06-05T10:30:00Z',
    status: 'Submitted',
    note: ''
  },
  {
    id: 'rev_b2_2026_06_06',
    branchId: 'b2',
    date: '2026-06-06',
    time: '10:30',
    startCounter: 14356000,
    endCounter: 14656000,
    startCounterAba: 38484000,
    endCounterAba: 39259000,
    counterRevenue: 1075000,
    cash: 300000,
    aba: 775000,
    dailyRevenue: 1075000,
    bankDeposit: 0,
    remainingCash: 1075000,
    actualCashCount: 300000,
    difference: 0,
    amountUsd: 268.75,
    amountKhr: 1075000,
    paymentMethod: 'ABA',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-06T10:30:00Z',
    updatedAt: '2026-06-06T10:30:00Z',
    status: 'Submitted',
    note: ''
  },
  {
    id: 'rev_b2_2026_06_07',
    branchId: 'b2',
    date: '2026-06-07',
    time: '10:30',
    startCounter: 14656000,
    endCounter: 14887000,
    startCounterAba: 39259000,
    endCounterAba: 40451000,
    counterRevenue: 1423000,
    cash: 231000,
    aba: 1192000,
    dailyRevenue: 1423000,
    bankDeposit: 0,
    remainingCash: 1423000,
    actualCashCount: 231000,
    difference: 0,
    amountUsd: 355.75,
    amountKhr: 1423000,
    paymentMethod: 'ABA',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-07T10:30:00Z',
    updatedAt: '2026-06-07T10:30:00Z',
    status: 'Submitted',
    note: ''
  },
  {
    id: 'rev_b2_2026_06_08',
    branchId: 'b2',
    date: '2026-06-08',
    time: '10:30',
    startCounter: 14887000,
    endCounter: 15095000,
    startCounterAba: 40451000,
    endCounterAba: 40974000,
    counterRevenue: 731000,
    cash: 208000,
    aba: 523000,
    dailyRevenue: 731000,
    bankDeposit: 0,
    remainingCash: 731000,
    actualCashCount: 208000,
    difference: 0,
    amountUsd: 182.75,
    amountKhr: 731000,
    paymentMethod: 'ABA',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-08T10:30:00Z',
    updatedAt: '2026-06-08T10:30:00Z',
    status: 'Submitted',
    note: ''
  },
  {
    id: 'rev_b2_2026_06_09',
    branchId: 'b2',
    date: '2026-06-09',
    time: '10:30',
    startCounter: 15095000,
    endCounter: 15229000,
    startCounterAba: 40974000,
    endCounterAba: 41561000,
    counterRevenue: 721000,
    cash: 134000,
    aba: 587000,
    dailyRevenue: 721000,
    bankDeposit: 0,
    remainingCash: 721000,
    actualCashCount: 134000,
    difference: 0,
    amountUsd: 180.25,
    amountKhr: 721000,
    paymentMethod: 'ABA',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-09T10:30:00Z',
    updatedAt: '2026-06-09T10:30:00Z',
    status: 'Submitted',
    note: ''
  },
  {
    id: 'rev_b2_2026_06_10',
    branchId: 'b2',
    date: '2026-06-10',
    time: '10:30',
    startCounter: 15229000,
    endCounter: 15388000,
    startCounterAba: 41561000,
    endCounterAba: 41860000,
    counterRevenue: 458000,
    cash: 159000,
    aba: 299000,
    dailyRevenue: 458000,
    bankDeposit: 0,
    remainingCash: 458000,
    actualCashCount: 159000,
    difference: 0,
    amountUsd: 114.50,
    amountKhr: 458000,
    paymentMethod: 'ABA',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-10T10:30:00Z',
    updatedAt: '2026-06-10T10:30:00Z',
    status: 'Submitted',
    note: ''
  },
  {
    id: 'rev_b2_2026_06_11',
    branchId: 'b2',
    date: '2026-06-11',
    time: '10:30',
    startCounter: 15388000,
    endCounter: 15598000,
    startCounterAba: 41860000,
    endCounterAba: 42328000,
    counterRevenue: 678000,
    cash: 210000,
    aba: 468000,
    dailyRevenue: 678000,
    bankDeposit: 0,
    remainingCash: 678000,
    actualCashCount: 210000,
    difference: 0,
    amountUsd: 169.50,
    amountKhr: 678000,
    paymentMethod: 'ABA',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-11T10:30:00Z',
    updatedAt: '2026-06-11T10:30:00Z',
    status: 'Submitted',
    note: ''
  },
  {
    id: 'rev_b2_2026_06_12',
    branchId: 'b2',
    date: '2026-06-12',
    time: '10:30',
    startCounter: 15598000,
    endCounter: 15810000,
    startCounterAba: 42328000,
    endCounterAba: 42734000,
    counterRevenue: 618000,
    cash: 212000,
    aba: 406000,
    dailyRevenue: 618000,
    bankDeposit: 0,
    remainingCash: 618000,
    actualCashCount: 212000,
    difference: 0,
    amountUsd: 154.50,
    amountKhr: 618000,
    paymentMethod: 'ABA',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-12T10:30:00Z',
    updatedAt: '2026-06-12T10:30:00Z',
    status: 'Submitted',
    note: ''
  },
  {
    id: 'rev_b2_2026_06_13',
    branchId: 'b2',
    date: '2026-06-13',
    time: '10:30',
    startCounter: 15810000,
    endCounter: 16101000,
    startCounterAba: 42734000,
    endCounterAba: 43597000,
    counterRevenue: 1154000,
    cash: 291000,
    aba: 863000,
    dailyRevenue: 1154000,
    bankDeposit: 0,
    remainingCash: 1154000,
    actualCashCount: 291000,
    difference: 0,
    amountUsd: 288.50,
    amountKhr: 1154000,
    paymentMethod: 'ABA',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-13T10:30:00Z',
    updatedAt: '2026-06-13T10:30:00Z',
    status: 'Submitted',
    note: ''
  },
  {
    id: 'rev_b2_2026_06_14',
    branchId: 'b2',
    date: '2026-06-14',
    time: '10:30',
    startCounter: 16101000,
    endCounter: 16378000,
    startCounterAba: 43597000,
    endCounterAba: 44519000,
    counterRevenue: 1199000,
    cash: 277000,
    aba: 922000,
    dailyRevenue: 1199000,
    bankDeposit: 0,
    remainingCash: 1199000,
    actualCashCount: 277000,
    difference: 0,
    amountUsd: 299.75,
    amountKhr: 1199000,
    paymentMethod: 'ABA',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-14T10:30:00Z',
    updatedAt: '2026-06-14T10:30:00Z',
    status: 'Submitted',
    note: ''
  },
  {
    id: 'rev_b2_2026_06_15',
    branchId: 'b2',
    date: '2026-06-15',
    time: '10:30',
    startCounter: 16378000,
    endCounter: 16640000,
    startCounterAba: 44519000,
    endCounterAba: 44949000,
    counterRevenue: 692000,
    cash: 262000,
    aba: 430000,
    dailyRevenue: 692000,
    bankDeposit: 0,
    remainingCash: 692000,
    actualCashCount: 262000,
    difference: 0,
    amountUsd: 173.00,
    amountKhr: 692050,
    paymentMethod: 'ABA',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-15T10:30:00Z',
    updatedAt: '2026-06-15T10:30:00Z',
    status: 'Submitted',
    note: ''
  }
];

// Initial Sample Gas Records
export const initialGasRecords: GasRecord[] = [
  { id: 'gas1', branchId: 'b1', date: '2026-06-06', tankCount: 2, remainingKg: 42.5, type: 'Use', cost: 0, createdBy: 'Khorn Sothea', createdAt: '2026-06-06T10:00:00Z', updatedAt: '2026-06-06T10:00:00Z', note: 'Daily drying operation consumption' },
  { id: 'gas2', branchId: 'b1', date: '2026-06-02', tankCount: 2, remainingKg: 90.0, type: 'Refill', cost: 68.0, createdBy: 'Khorn Sothea', createdAt: '2026-06-02T09:15:00Z', updatedAt: '2026-06-02T09:15:00Z', note: 'Refilled 2 propane tanks' },
  { id: 'gas3', branchId: 'b2', date: '2026-06-06', tankCount: 1, remainingKg: 35.0, type: 'Use', cost: 0, createdBy: 'Chan Darith', createdAt: '2026-06-06T12:00:00Z', updatedAt: '2026-06-06T12:00:00Z', note: 'BKK central backup gas tank check' },
  { id: 'gas4', branchId: 'b3', date: '2026-06-06', tankCount: 1, remainingKg: 15.0, type: 'Use', cost: 0, createdBy: 'Heng Samnang', createdAt: '2026-06-06T11:00:00Z', updatedAt: '2026-06-06T11:00:00Z', note: 'Low level alert check under 20kg' }
];

// Initial Sample Detergent Records
export const initialDetergentRecords: DetergentRecord[] = [
  { id: 'det_b1_2026_06_01', branchId: 'b1', date: '2026-06-01', quantityLiters: 13, remainingLiters: 72, type: 'Use', cost: 0, createdBy: 'Sok Reaksmey', createdAt: '2026-06-01T10:00:00Z', updatedAt: '2026-06-01T10:00:00Z', note: 'Daily Sheet entry', powder: 0, soap: 13, cleaner: 0, total: 13 },
  { id: 'det_b1_2026_06_02', branchId: 'b1', date: '2026-06-02', quantityLiters: 5, remainingLiters: 72, type: 'Use', cost: 0, createdBy: 'Sok Reaksmey', createdAt: '2026-06-02T10:00:00Z', updatedAt: '2026-06-02T10:00:00Z', note: 'Daily Sheet entry', powder: 0, soap: 5, cleaner: 0, total: 5 },
  { id: 'det_b1_2026_06_03', branchId: 'b1', date: '2026-06-03', quantityLiters: 16, remainingLiters: 72, type: 'Use', cost: 0, createdBy: 'Sok Reaksmey', createdAt: '2026-06-03T10:00:00Z', updatedAt: '2026-06-03T10:00:00Z', note: 'Daily Sheet entry', powder: 0, soap: 16, cleaner: 0, total: 16 },
  { id: 'det_b1_2026_06_04', branchId: 'b1', date: '2026-06-04', quantityLiters: 13, remainingLiters: 72, type: 'Use', cost: 0, createdBy: 'Sok Reaksmey', createdAt: '2026-06-04T10:00:00Z', updatedAt: '2026-06-04T10:00:00Z', note: 'Daily Sheet entry', powder: 2, soap: 10, cleaner: 1, total: 13 },
  { id: 'det_b1_2026_06_05', branchId: 'b1', date: '2026-06-05', quantityLiters: 13, remainingLiters: 72, type: 'Use', cost: 0, createdBy: 'Sok Reaksmey', createdAt: '2026-06-05T10:00:00Z', updatedAt: '2026-06-05T10:00:00Z', note: 'Daily Sheet entry', powder: 1, soap: 12, cleaner: 0, total: 13 },
  { id: 'det_b1_2026_06_06', branchId: 'b1', date: '2026-06-06', quantityLiters: 20, remainingLiters: 72, type: 'Use', cost: 0, createdBy: 'Sok Reaksmey', createdAt: '2026-06-06T10:30:00Z', updatedAt: '2026-06-06T10:30:00Z', note: 'Daily Sheet entry', powder: 3, soap: 15, cleaner: 2, total: 20 },
  { id: 'det_b1_2026_06_07', branchId: 'b1', date: '2026-06-07', quantityLiters: 31, remainingLiters: 72, type: 'Use', cost: 0, createdBy: 'Sok Reaksmey', createdAt: '2026-06-07T10:00:00Z', updatedAt: '2026-06-07T10:00:00Z', note: 'Weekend load surge', powder: 5, soap: 22, cleaner: 4, total: 31 },
  { id: 'det2', branchId: 'b1', date: '2026-05-30', quantityLiters: 240, remainingLiters: 240, type: 'Refill', cost: 120.0, createdBy: 'Nguon Piseth', createdAt: '2026-05-30T10:00:00Z', updatedAt: '2026-05-30T10:00:00Z', note: 'Restocked UltraClean Soap packages', powder: 0, soap: 0, cleaner: 0, total: 0 },
  { id: 'det_b2_2026_06_06', branchId: 'b2', date: '2026-06-06', quantityLiters: 15, remainingLiters: 32, type: 'Use', cost: 0, createdBy: 'Chea Voleak', createdAt: '2026-06-06T13:00:00Z', updatedAt: '2026-06-06T13:00:00Z', note: 'Daily Sheet entry', powder: 1, soap: 12, cleaner: 2, total: 15 },
  // July 2026 Daily Sheet entries for Veng Sreng Branch (b2) based on handwritten logs
  { id: 'det_b2_2026_06_30', branchId: 'b2', date: '2026-06-30', quantityLiters: 300, remainingLiters: 300, type: 'Refill', cost: 150.0, createdBy: 'Chan Darith', createdAt: '2026-06-30T10:00:00Z', updatedAt: '2026-06-30T10:00:00Z', note: 'Bulk soap refill', powder: 0, soap: 0, cleaner: 0, total: 0, inQty: 300, outQty: 0 },
  { id: 'det_b2_2026_07_01', branchId: 'b2', date: '2026-07-01', quantityLiters: 13, remainingLiters: 287, type: 'Use', cost: 0, createdBy: 'Chan Darith', createdAt: '2026-07-01T10:00:00Z', updatedAt: '2026-07-01T10:00:00Z', note: 'Daily Sheet entry', powder: 0, soap: 13, cleaner: 0, total: 13, inQty: 0, outQty: 13 },
  { id: 'det_b2_2026_07_02', branchId: 'b2', date: '2026-07-02', quantityLiters: 7, remainingLiters: 280, type: 'Use', cost: 0, createdBy: 'Chan Darith', createdAt: '2026-07-02T10:00:00Z', updatedAt: '2026-07-02T10:00:00Z', note: 'Daily Sheet entry', powder: 0, soap: 7, cleaner: 0, total: 7, inQty: 0, outQty: 7 },
  { id: 'det_b2_2026_07_03', branchId: 'b2', date: '2026-07-03', quantityLiters: 28, remainingLiters: 252, type: 'Use', cost: 0, createdBy: 'Chan Darith', createdAt: '2026-07-03T10:00:00Z', updatedAt: '2026-07-03T10:00:00Z', note: 'Daily Sheet entry', powder: 0, soap: 28, cleaner: 0, total: 28, inQty: 0, outQty: 28 },
  { id: 'det_b2_2026_07_04', branchId: 'b2', date: '2026-07-04', quantityLiters: 12, remainingLiters: 240, type: 'Use', cost: 0, createdBy: 'Chan Darith', createdAt: '2026-07-04T10:00:00Z', updatedAt: '2026-07-04T10:00:00Z', note: 'Daily Sheet entry', powder: 0, soap: 12, cleaner: 0, total: 12, inQty: 0, outQty: 12 },
  { id: 'det_b2_2026_07_05', branchId: 'b2', date: '2026-07-05', quantityLiters: 52, remainingLiters: 188, type: 'Use', cost: 0, createdBy: 'Chan Darith', createdAt: '2026-07-05T10:00:00Z', updatedAt: '2026-07-05T10:00:00Z', note: 'Daily Sheet entry', powder: 0, soap: 52, cleaner: 0, total: 52, inQty: 0, outQty: 52 },
  { id: 'det_b2_2026_07_06', branchId: 'b2', date: '2026-07-06', quantityLiters: 13, remainingLiters: 175, type: 'Use', cost: 0, createdBy: 'Chan Darith', createdAt: '2026-07-06T10:00:00Z', updatedAt: '2026-07-06T10:00:00Z', note: 'Daily Sheet entry', powder: 0, soap: 13, cleaner: 0, total: 13, inQty: 0, outQty: 13 },
  { id: 'det_b2_2026_07_07', branchId: 'b2', date: '2026-07-07', quantityLiters: 1, remainingLiters: 174, type: 'Use', cost: 0, createdBy: 'Chan Darith', createdAt: '2026-07-07T10:00:00Z', updatedAt: '2026-07-07T10:00:00Z', note: 'Daily Sheet entry', powder: 0, soap: 1, cleaner: 0, total: 1, inQty: 0, outQty: 1 },
  { id: 'det_b2_2026_07_08', branchId: 'b2', date: '2026-07-08', quantityLiters: 11, remainingLiters: 163, type: 'Use', cost: 0, createdBy: 'Chan Darith', createdAt: '2026-07-08T10:00:00Z', updatedAt: '2026-07-08T10:00:00Z', note: 'Daily Sheet entry', powder: 0, soap: 11, cleaner: 0, total: 11, inQty: 0, outQty: 11 },
  { id: 'det_b2_2026_07_09', branchId: 'b2', date: '2026-07-09', quantityLiters: 7, remainingLiters: 156, type: 'Use', cost: 0, createdBy: 'Chan Darith', createdAt: '2026-07-09T10:00:00Z', updatedAt: '2026-07-09T10:00:00Z', note: 'Daily Sheet entry', powder: 0, soap: 7, cleaner: 0, total: 7, inQty: 0, outQty: 7 },
  { id: 'det_b2_2026_07_10', branchId: 'b2', date: '2026-07-10', quantityLiters: 19, remainingLiters: 137, type: 'Use', cost: 0, createdBy: 'Chan Darith', createdAt: '2026-07-10T10:00:00Z', updatedAt: '2026-07-10T10:00:00Z', note: 'Daily Sheet entry', powder: 0, soap: 19, cleaner: 0, total: 19, inQty: 0, outQty: 19 },
  { id: 'det_b2_2026_07_11', branchId: 'b2', date: '2026-07-11', quantityLiters: 24, remainingLiters: 113, type: 'Use', cost: 0, createdBy: 'Chan Darith', createdAt: '2026-07-11T10:00:00Z', updatedAt: '2026-07-11T10:00:00Z', note: 'Daily Sheet entry', powder: 0, soap: 24, cleaner: 0, total: 24, inQty: 0, outQty: 24 },
  { id: 'det_b2_2026_07_12', branchId: 'b2', date: '2026-07-12', quantityLiters: 34, remainingLiters: 79, type: 'Use', cost: 0, createdBy: 'Chan Darith', createdAt: '2026-07-12T10:00:00Z', updatedAt: '2026-07-12T10:00:00Z', note: 'Daily Sheet entry', powder: 0, soap: 34, cleaner: 0, total: 34, inQty: 0, outQty: 34 },
  { id: 'det_b2_2026_07_13', branchId: 'b2', date: '2026-07-13', quantityLiters: 8, remainingLiters: 71, type: 'Use', cost: 0, createdBy: 'Chan Darith', createdAt: '2026-07-13T10:00:00Z', updatedAt: '2026-07-13T10:00:00Z', note: 'Daily Sheet entry', powder: 0, soap: 8, cleaner: 0, total: 8, inQty: 0, outQty: 8 }
];

// Initial Sample Softener Records
export const initialSoftenerRecords: SoftenerRecord[] = [
  { id: 'sof_b1_2026_06_01', branchId: 'b1', date: '2026-06-01', quantityLiters: 20, remainingLiters: 48, type: 'Use', cost: 0, createdBy: 'Sok Reaksmey', createdAt: '2026-06-01T10:00:00Z', updatedAt: '2026-06-01T10:00:00Z', note: 'Normal Wash Release', inQty: 0, comfort: 6, ora: 14, total: 20 },
  { id: 'sof_b1_2026_06_02', branchId: 'b1', date: '2026-06-02', quantityLiters: 4, remainingLiters: 48, type: 'Use', cost: 0, createdBy: 'Sok Reaksmey', createdAt: '2026-06-02T10:00:00Z', updatedAt: '2026-06-02T10:00:00Z', note: 'Daily release', inQty: 0, comfort: 2, ora: 2, total: 4 },
  { id: 'sof_b1_2026_06_03', branchId: 'b1', date: '2026-06-03', quantityLiters: 16, remainingLiters: 48, type: 'Use', cost: 0, createdBy: 'Sok Reaksmey', createdAt: '2026-06-03T10:00:00Z', updatedAt: '2026-06-03T10:00:00Z', note: '', inQty: 0, comfort: 10, ora: 6, total: 16 },
  { id: 'sof_b1_2026_06_04', branchId: 'b1', date: '2026-06-04', quantityLiters: 10, remainingLiters: 48, type: 'Use', cost: 0, createdBy: 'Sok Reaksmey', createdAt: '2026-06-04T10:00:00Z', updatedAt: '2026-06-04T10:00:00Z', note: '', inQty: 0, comfort: 4, ora: 6, total: 10 },
  { id: 'sof_b1_2026_06_05', branchId: 'b1', date: '2026-06-05', quantityLiters: 14, remainingLiters: 48, type: 'Use', cost: 0, createdBy: 'Sok Reaksmey', createdAt: '2026-06-05T10:00:00Z', updatedAt: '2026-06-05T10:00:00Z', note: '', inQty: 0, comfort: 8, ora: 6, total: 14 },
  { id: 'sof_b1_2026_06_06', branchId: 'b1', date: '2026-06-06', quantityLiters: 22, remainingLiters: 48, type: 'Use', cost: 0, createdBy: 'Sok Reaksmey', createdAt: '2026-06-06T10:35:00Z', updatedAt: '2026-06-06T10:35:00Z', note: '', inQty: 0, comfort: 12, ora: 10, total: 22 },
  { id: 'sof_b1_2026_06_07', branchId: 'b1', date: '2026-06-07', quantityLiters: 44, remainingLiters: 48, type: 'Use', cost: 0, createdBy: 'Sok Reaksmey', createdAt: '2026-06-07T10:00:00Z', updatedAt: '2026-06-07T10:00:00Z', note: 'Weekend peak traffic release', inQty: 0, comfort: 26, ora: 18, total: 44 },
  { id: 'soft2', branchId: 'b1', date: '2026-05-20', quantityLiters: 120, remainingLiters: 120, type: 'Refill', cost: 108.0, createdBy: 'Nguon Piseth', createdAt: '2026-05-20T14:00:00Z', updatedAt: '2026-05-20T14:00:00Z', note: 'Purchased softener bulk box shipment', inQty: 100, comfort: 0, ora: 0, total: 0 },
  { id: 'soft3', branchId: 'b2', date: '2026-06-06', quantityLiters: 10, remainingLiters: 58, type: 'Use', cost: 0, createdBy: 'Chea Voleak', createdAt: '2026-06-06T13:10:00Z', updatedAt: '2026-06-06T13:10:00Z', note: 'Softener usage', inQty: 0, comfort: 4, ora: 6, total: 10 }
];

// Initial Sample Stock Transactions
export const initialStockTransactions: StockTransaction[] = [
  { id: 'stk1', branchId: 'b1', date: '2026-06-06', itemId: 'inv1', itemName: 'UltraClean Liquid Soap', quantity: 2, currentStock: 45, type: 'Use', cost: 0, createdBy: 'Sok Reaksmey', createdAt: '2026-06-06T13:15:00Z', updatedAt: '2026-06-06T13:15:00Z', note: 'Refill washer chambers' },
  { id: 'stk2', branchId: 'b1', date: '2026-05-20', itemId: 'inv1', itemName: 'UltraClean Liquid Soap', quantity: 25, currentStock: 47, type: 'In', cost: 212.5, createdBy: 'Nguon Piseth', createdAt: '2026-05-20T11:00:00Z', updatedAt: '2026-05-20T11:00:00Z', note: 'Suppliers regular dropoff' },
  { id: 'stk3', branchId: 'b2', date: '2026-06-06', itemId: 'inv5', itemName: 'UltraClean Liquid Soap', quantity: 1, currentStock: 8, type: 'Use', cost: 0, createdBy: 'Chea Voleak', createdAt: '2026-06-06T15:00:00Z', updatedAt: '2026-06-06T15:00:00Z', note: 'Out of stock alert refilled' }
];

// Initial Sample Suppliers
export const initialSuppliers: Supplier[] = [
  {
    id: 'sup1',
    branchId: 'b1',
    name: 'CleanChem Supply Co., Ltd',
    phone: '023 888 777',
    address: 'Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh',
    contactPerson: 'Ouk Sovann',
    goodsSupplied: 'Liquid Soap & Softeners',
    createdBy: 'Seng Sophy',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'sup2',
    branchId: 'b1',
    name: 'Phnom Penh Plastic Wholesale',
    phone: '012 333 444',
    address: 'Sangkat Orussey, Khan Prampir Meakkara, Phnom Penh',
    contactPerson: 'Lim Hour',
    goodsSupplied: 'Laundry & Plastic Bags',
    createdBy: 'Nguon Piseth',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'sup3',
    branchId: 'b2',
    name: 'Lando Supplies Cambodia',
    phone: '098 777 666',
    address: 'Sangkat Boeung Keng Kang III, Khan BKK, Phnom Penh',
    contactPerson: 'Say Sreyneat',
    goodsSupplied: 'Detergents & Industrial Gas',
    createdBy: 'Seng Sophy',
    createdAt: '2026-02-20T10:30:00Z',
    updatedAt: '2026-02-20T10:30:00Z'
  }
];

// Initial Sample Supplier Debts
export const initialDebts: Debt[] = [
  {
    id: 'debt1',
    branchId: 'b1',
    supplierId: 'sup1',
    supplierName: 'CleanChem Supply Co., Ltd',
    amount: 350.00,
    description: 'Soap restock consignment order #CC-9942',
    dueDate: '2026-06-25',
    status: 'Unpaid',
    remainingBalance: 350.00,
    createdBy: 'Nguon Piseth',
    createdAt: '2026-06-01T08:00:00Z',
    updatedAt: '2026-06-01T08:00:00Z'
  },
  {
    id: 'debt2',
    branchId: 'b2',
    supplierId: 'sup3',
    supplierName: 'Lando Supplies Cambodia',
    amount: 180.00,
    description: 'Dryer gas cylinders consignment refilling',
    dueDate: '2026-06-20',
    status: 'Partial',
    remainingBalance: 80.00,
    createdBy: 'Chan Darith',
    createdAt: '2026-06-03T10:15:00Z',
    updatedAt: '2026-06-04T15:20:00Z'
  }
];

// Initial Sample Debt Payments
export const initialDebtPayments: DebtPayment[] = [
  {
    id: 'dp1',
    branchId: 'b2',
    debtId: 'debt2',
    supplierName: 'Lando Supplies Cambodia',
    amountPaid: 100.00,
    paymentDate: '2026-06-04',
    paymentMethod: 'ABA',
    createdBy: 'Chan Darith',
    createdAt: '2026-06-04T15:20:00Z',
    updatedAt: '2026-06-04T15:20:00Z',
    note: 'Initial partial payment for dryer gas invoice'
  }
];

// Initial Sample Cash Drawers
export const initialCashDrawers: CashDrawer[] = [
  {
    id: 'drawer1',
    branchId: 'b1',
    status: 'Open',
    startingCash: 100.00,
    endingCash: 0,
    actualCash: 0,
    difference: 0,
    reconciled: false,
    openedBy: 'Sok Reaksmey',
    closedBy: '',
    openedAt: '2026-06-06T06:00:00Z',
    closedAt: '',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-06T06:00:00Z',
    updatedAt: '2026-06-06T06:00:00Z'
  },
  {
    id: 'drawer2',
    branchId: 'b2',
    status: 'Closed',
    startingCash: 100.00,
    endingCash: 155.00,
    actualCash: 155.00,
    difference: 0,
    reconciled: true,
    openedBy: 'Oung Sreylen',
    closedBy: 'Oung Sreylen',
    openedAt: '2026-06-05T06:00:00Z',
    closedAt: '2026-06-05T22:00:00Z',
    createdBy: 'Oung Sreylen',
    createdAt: '2026-06-05T06:00:00Z',
    updatedAt: '2026-06-05T22:00:00Z'
  }
];

// Initial Sample Cash Drawer Transactions
export const initialCashDrawerTransactions: CashDrawerTransaction[] = [
  {
    id: 'cdt1',
    branchId: 'b1',
    drawerId: 'drawer1',
    type: 'Out',
    amount: 15.00,
    reason: 'Bought direct cleaning supplies package',
    createdBy: 'Sok Reaksmey',
    createdAt: '2026-06-06T10:15:00Z',
    updatedAt: '2026-06-06T10:15:00Z'
  }
];

// Initial Sample Month Closings
export const initialMonthClosings: MonthClosing[] = [
  {
    id: 'close1',
    branchId: 'b1',
    month: '2026-05',
    totalRevenue: 2470.00,
    totalExpenses: 1820.00,
    depreciationSavings: 150.00, // depreciation calculations for washers & dryers
    netIncome: 500.00, // 2470 - 1820 - 150
    coinAuditMatches: true,
    abaAuditMatches: true,
    closedBy: 'Seng Sophy',
    closedAt: '2026-06-01T17:00:00Z',
    createdBy: 'Seng Sophy',
    createdAt: '2026-06-01T17:00:00Z',
    updatedAt: '2026-06-01T17:00:00Z',
    status: 'Locked',
    note: 'May audited month closing verified'
  }
];

// Database local storage persistent helper functions
const STORAGE_PREFIX = "CLEAN24_LAUNDRY_";

function getStored<T>(key: string, initial: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : initial;
  } catch (e) {
    return initial;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {}
}

export const initialSalarySchedules: SalarySchedule[] = [
  { id: 'ss1', branchId: 'b1', paymentFrequency: 'Once', paymentDay1: 30, isActive: true },
  { id: 'ss2', branchId: 'b2', paymentFrequency: 'Twice', paymentDay1: 15, paymentDay2: 30, isActive: true }
];

export const initialSalaryAdvances: SalaryAdvance[] = [
  { id: 'sa1', branchId: 'b1', staffId: 's2', amount: 50, requestDate: '2026-06-02', status: 'Approved', approvedBy: 'Seng Sophy', reason: 'Medical Checkup', notes: 'Urgent request for regular health check', createdAt: '2026-06-02T08:00:00Z' },
  { id: 'sa2', branchId: 'b1', staffId: 's3', amount: 30, requestDate: '2026-06-03', status: 'Pending', reason: 'Electricity bill', notes: '', createdAt: '2026-06-03T10:30:00Z' }
];

export const db = {
  getSalarySchedules: (): SalarySchedule[] => getStored('SALARY_SCHEDULES', initialSalarySchedules),
  saveSalarySchedules: (data: SalarySchedule[]) => setStored('SALARY_SCHEDULES', data),

  getSalaryAdvances: (): SalaryAdvance[] => getStored('SALARY_ADVANCES', initialSalaryAdvances),
  saveSalaryAdvances: (data: SalaryAdvance[]) => setStored('SALARY_ADVANCES', data),

  getBranches: (): Branch[] => getStored('BRANCHES', initialBranches),
  saveBranches: (data: Branch[]) => setStored('BRANCHES', data),
  
  getStaff: (): Staff[] => getStored('STAFF', initialStaff),
  saveStaff: (data: Staff[]) => setStored('STAFF', data),
  
  getSalaries: (): Salary[] => getStored('SALARIES', initialSalaries),
  saveSalaries: (data: Salary[]) => setStored('SALARIES', data),
  
  getAttendance: (): Attendance[] => getStored('ATTENDANCE', initialAttendance),
  saveAttendance: (data: Attendance[]) => setStored('ATTENDANCE', data),
  
  getIncomes: (): Income[] => getStored('INCOMES', initialIncomes),
  saveIncomes: (data: Income[]) => setStored('INCOMES', data),
  
  getExpenses: (): Expense[] => getStored('EXPENSES', initialExpenses),
  saveExpenses: (data: Expense[]) => setStored('EXPENSES', data),
  
  getInventory: (): InventoryItem[] => getStored('INVENTORY', initialInventory),
  saveInventory: (data: InventoryItem[]) => setStored('INVENTORY', data),
  
  getMachines: (): Machine[] => getStored('MACHINES', initialMachines),
  saveMachines: (data: Machine[]) => setStored('MACHINES', data),
  
  getSettings: (): AppSettings => getStored('SETTINGS', initialSettings),
  saveSettings: (data: AppSettings) => setStored('SETTINGS', data),
  
  getUsers: (): User[] => getStored('USERS', initialUsers),
  saveUsers: (data: User[]) => setStored('USERS', data),

  getCoinTransactions: (): CoinTransaction[] => getStored('COIN_TRANSACTIONS', initialCoinTransactions),
  saveCoinTransactions: (data: CoinTransaction[]) => setStored('COIN_TRANSACTIONS', data),

  getRevenueRecords: (): RevenueRecord[] => getStored('REVENUE_RECORDS', initialRevenueRecords),
  saveRevenueRecords: (data: RevenueRecord[]) => setStored('REVENUE_RECORDS', data),

  getGasRecords: (): GasRecord[] => getStored('GAS_RECORDS', initialGasRecords),
  saveGasRecords: (data: GasRecord[]) => setStored('GAS_RECORDS', data),

  getDetergentRecords: (): DetergentRecord[] => getStored('DETERGENT_RECORDS', initialDetergentRecords),
  saveDetergentRecords: (data: DetergentRecord[]) => setStored('DETERGENT_RECORDS', data),

  getSoftenerRecords: (): SoftenerRecord[] => getStored('SOFTENER_RECORDS', initialSoftenerRecords),
  saveSoftenerRecords: (data: SoftenerRecord[]) => setStored('SOFTENER_RECORDS', data),

  getStockTransactions: (): StockTransaction[] => getStored('STOCK_TRANSACTIONS', initialStockTransactions),
  saveStockTransactions: (data: StockTransaction[]) => setStored('STOCK_TRANSACTIONS', data),

  getSuppliers: (): Supplier[] => getStored('SUPPLIERS', initialSuppliers),
  saveSuppliers: (data: Supplier[]) => setStored('SUPPLIERS', data),

  getDebts: (): Debt[] => getStored('DEBTS', initialDebts),
  saveDebts: (data: Debt[]) => setStored('DEBTS', data),

  getDebtPayments: (): DebtPayment[] => getStored('DEBT_PAYMENTS', initialDebtPayments),
  saveDebtPayments: (data: DebtPayment[]) => setStored('DEBT_PAYMENTS', data),

  getCashDrawers: (): CashDrawer[] => getStored('CASH_DRAWERS', initialCashDrawers),
  saveCashDrawers: (data: CashDrawer[]) => setStored('CASH_DRAWERS', data),

  getCashDrawerTransactions: (): CashDrawerTransaction[] => getStored('CASH_DRAWER_TRANSACTIONS', initialCashDrawerTransactions),
  saveCashDrawerTransactions: (data: CashDrawerTransaction[]) => setStored('CASH_DRAWER_TRANSACTIONS', data),

  getMonthClosings: (): MonthClosing[] => getStored('MONTH_CLOSINGS', initialMonthClosings),
  saveMonthClosings: (data: MonthClosing[]) => setStored('MONTH_CLOSINGS', data),
  
  getAuditLogs: (): string[] => getStored('AUDIT_LOGS', [
    `2026-06-06 06:12:00: Owner "Seng Sophy" logged in from Phnom Penh`,
    `2026-06-06 06:15:33: Manager "Nguon Piseth" updated machine W-03 status to Maintenance`,
    `2026-06-06 06:22:12: Staff "Sok Reaksmey" registered daily income $9.5 under Toul Kork`
  ]),
  saveAuditLogs: (logs: string[]) => setStored('AUDIT_LOGS', logs),
  
  addAuditLog: (message: string) => {
    const logs = db.getAuditLogs();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    logs.unshift(`${timestamp}: ${message}`);
    db.saveAuditLogs(logs.slice(0, 100)); // limit 100 most recent
  },

  resetDatabase: () => {
    localStorage.removeItem(STORAGE_PREFIX + 'BRANCHES');
    localStorage.removeItem(STORAGE_PREFIX + 'STAFF');
    localStorage.removeItem(STORAGE_PREFIX + 'SALARIES');
    localStorage.removeItem(STORAGE_PREFIX + 'ATTENDANCE');
    localStorage.removeItem(STORAGE_PREFIX + 'INCOMES');
    localStorage.removeItem(STORAGE_PREFIX + 'EXPENSES');
    localStorage.removeItem(STORAGE_PREFIX + 'INVENTORY');
    localStorage.removeItem(STORAGE_PREFIX + 'MACHINES');
    localStorage.removeItem(STORAGE_PREFIX + 'SETTINGS');
    localStorage.removeItem(STORAGE_PREFIX + 'USERS');
    localStorage.removeItem(STORAGE_PREFIX + 'COIN_TRANSACTIONS');
    localStorage.removeItem(STORAGE_PREFIX + 'REVENUE_RECORDS');
    localStorage.removeItem(STORAGE_PREFIX + 'GAS_RECORDS');
    localStorage.removeItem(STORAGE_PREFIX + 'DETERGENT_RECORDS');
    localStorage.removeItem(STORAGE_PREFIX + 'SOFTENER_RECORDS');
    localStorage.removeItem(STORAGE_PREFIX + 'STOCK_TRANSACTIONS');
    localStorage.removeItem(STORAGE_PREFIX + 'SUPPLIERS');
    localStorage.removeItem(STORAGE_PREFIX + 'DEBTS');
    localStorage.removeItem(STORAGE_PREFIX + 'DEBT_PAYMENTS');
    localStorage.removeItem(STORAGE_PREFIX + 'CASH_DRAWERS');
    localStorage.removeItem(STORAGE_PREFIX + 'CASH_DRAWER_TRANSACTIONS');
    localStorage.removeItem(STORAGE_PREFIX + 'MONTH_CLOSINGS');
    localStorage.removeItem(STORAGE_PREFIX + 'AUDIT_LOGS');
    window.location.reload();
  }
};
