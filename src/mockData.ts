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
export const initialIncomes: Income[] = [];

// Initial Expenses
export const initialExpenses: Expense[] = [];

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
export const initialCoinTransactions: CoinTransaction[] = [];

// Initial Sample Revenue Records
export const initialRevenueRecords: RevenueRecord[] = [];

// Initial Sample Gas Records
export const initialGasRecords: GasRecord[] = [];

// Initial Sample Detergent Records
export const initialDetergentRecords: DetergentRecord[] = [];

// Initial Sample Softener Records
export const initialSoftenerRecords: SoftenerRecord[] = [];

// Initial Sample Stock Transactions
export const initialStockTransactions: StockTransaction[] = [];

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
export const initialDebts: Debt[] = [];

// Initial Sample Debt Payments
export const initialDebtPayments: DebtPayment[] = [];

// Initial Sample Cash Drawers
export const initialCashDrawers: CashDrawer[] = [];

// Initial Sample Cash Drawer Transactions
export const initialCashDrawerTransactions: CashDrawerTransaction[] = [];

// Initial Sample Month Closings
export const initialMonthClosings: MonthClosing[] = [];

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
