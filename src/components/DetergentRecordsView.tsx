/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Printer, 
  Download, 
  FileSpreadsheet, 
  Save, 
  Check, 
  Eye, 
  FileText,
  Calendar,
  Layers,
  Info
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { DetergentRecord, Role, Branch, InventoryItem, StockTransaction } from '../types';

interface DetergentRecordsViewProps {
  currentRole: Role;
  activeBranchId: string;
  branches: Branch[];
  detergentRecords: DetergentRecord[];
  setDetergentRecords: React.Dispatch<React.SetStateAction<DetergentRecord[]>>;
  lang: 'en' | 'kh';
  onAddLog: (msg: string) => void;
  exchangeRate: number;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  stockTransactions: StockTransaction[];
  setStockTransactions: React.Dispatch<React.SetStateAction<StockTransaction[]>>;
}

export default function DetergentRecordsView({
  currentRole,
  activeBranchId,
  branches,
  detergentRecords,
  setDetergentRecords,
  lang,
  onAddLog,
  exchangeRate,
  inventory,
  setInventory,
  stockTransactions,
  setStockTransactions
}: DetergentRecordsViewProps) {
  const isOwner = currentRole === 'Owner';
  const isManager = currentRole === 'Manager';
  const isStaff = currentRole === 'Staff';

  // ----------------------------------------------------
  // FILTER STATES (Month, Year, Branch)
  // ----------------------------------------------------
  const [selectedBranchId, setSelectedBranchId] = useState<string>('b1');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(6); // Default: June

  // Active view tabs: 'sheet' | 'reports'
  const [activeTab, setActiveTab] = useState<'sheet' | 'reports'>('sheet');
  // Reports sub-tabs: 'daily' | 'monthly' | 'branch'
  const [reportSubTab, setReportSubTab] = useState<'daily' | 'monthly' | 'branch'>('daily');

  // Print Preview Dialog
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Opening Balance state (Customizable starter)
  const [openingBalance, setOpeningBalance] = useState<number>(20);

  // Status message state
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [savedRowIndex, setSavedRowIndex] = useState<number | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'dirty' | 'error'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>(new Date().toLocaleTimeString());

  // Sync state with active branch from global layout
  useEffect(() => {
    if (activeBranchId && activeBranchId !== 'all') {
      setSelectedBranchId(activeBranchId);
    } else if (branches.length > 0) {
      setSelectedBranchId(branches[0].id);
    }
  }, [activeBranchId, branches]);

  // Translate Branch Name to Khmer automatically
  const getBranchKhmerName = (branchName: string) => {
    if (branchName.toLowerCase().includes('veng sreng')) return 'សាខា វេងស្រេង';
    if (branchName.toLowerCase().includes('toul kork')) return 'សាខា ទួលគោក';
    if (branchName.toLowerCase().includes('sen sok')) return 'សាខា សែនសុខ';
    if (branchName.toLowerCase().includes('chbar ampov')) return 'សាខា ច្បារអំពៅ';
    return `សាខា ${branchName}`;
  };

  // Months List
  const months = useMemo(() => [
    { value: 1, en: 'January', kh: 'មករា', abbr: 'Jan' },
    { value: 2, en: 'February', kh: 'កុម្ភៈ', abbr: 'Feb' },
    { value: 3, en: 'March', kh: 'មីនា', abbr: 'Mar' },
    { value: 4, en: 'April', kh: 'មេសា', abbr: 'Apr' },
    { value: 5, en: 'May', kh: 'ឧសភា', abbr: 'May' },
    { value: 6, en: 'June', kh: 'មិថុនា', abbr: 'Jun' },
    { value: 7, en: 'July', kh: 'កក្កដា', abbr: 'Jul' },
    { value: 8, en: 'August', kh: 'សីហា', abbr: 'Aug' },
    { value: 9, en: 'September', kh: 'កញ្ញា', abbr: 'Sep' },
    { value: 10, en: 'October', kh: 'តុលា', abbr: 'Oct' },
    { value: 11, en: 'November', kh: 'វិច្ឆិកា', abbr: 'Nov' },
    { value: 12, en: 'December', kh: 'ធ្នូ', abbr: 'Dec' },
  ], []);

  const years = [2025, 2026, 2027, 2028];

  // Selected Branch Name
  const selectedBranchName = useMemo(() => {
    const br = branches.find(b => b.id === selectedBranchId);
    return br ? br.branchName : 'Unknown Branch';
  }, [branches, selectedBranchId]);

  // Selected Branch Address
  const selectedBranchAddress = useMemo(() => {
    const br = branches.find(b => b.id === selectedBranchId);
    return br ? (br.address || 'Phnom Penh, Cambodia') : 'Phnom Penh, Cambodia';
  }, [branches, selectedBranchId]);

  // Get days count
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth, 0).getDate();
  }, [selectedYear, selectedMonth]);

  // Convert month name to shorthand
  const getMonthAbbr = (monthVal: number) => {
    const found = months.find(m => m.value === monthVal);
    return found ? found.abbr : '';
  };

  const getMonthKhmer = (monthVal: number) => {
    const found = months.find(m => m.value === monthVal);
    return found ? found.kh : '';
  };

  const getMonthEnglish = (monthVal: number) => {
    const found = months.find(m => m.value === monthVal);
    return found ? found.en : '';
  };

  const getPrintedDateTime = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hrStr = String(hours).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hrStr}:${minutes}:${seconds} ${ampm}`;
  };

  // Helper: Format Date string for displaying (e.g. 1-Jun-2026)
  const formatDayLabel = (dayNum: number) => {
    const mStr = getMonthAbbr(selectedMonth);
    return `${dayNum < 10 ? '0' + dayNum : dayNum}-${mStr}-${selectedYear}`;
  };

  // Helper: YYYY-MM-DD
  const formatYYYYMMDD = (dayNum: number) => {
    const mm = String(selectedMonth).padStart(2, '0');
    const dd = String(dayNum).padStart(2, '0');
    return `${selectedYear}-${mm}-${dd}`;
  };

  // ----------------------------------------------------
  // GRID DATA STATE
  // ----------------------------------------------------
  // Local state for the editable monthly sheet
  const [localRows, setLocalRows] = useState<any[]>([]);

  // Automatically estimate/calculate previous month's ending balance as opening balance
  useEffect(() => {
    let prevMonth = selectedMonth - 1;
    let prevYear = selectedYear;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = selectedYear - 1;
    }
    
    const prevMonthPrefix = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
    const prevMonthRecs = detergentRecords
      .filter(r => r.branchId === selectedBranchId && r.date.startsWith(prevMonthPrefix))
      .sort((a,b) => a.date.localeCompare(b.date));
      
    if (prevMonthRecs.length > 0) {
      let calculatedPrevEndingBal = 20; // Default base opening of the chain
      prevMonthRecs.forEach(r => {
        calculatedPrevEndingBal += (r.inQty || 0) - (r.outQty || 0);
      });
      setOpeningBalance(calculatedPrevEndingBal);
    } else {
      setOpeningBalance(20); // Default placeholder
    }
  }, [selectedBranchId, selectedMonth, selectedYear, detergentRecords]);

  // Build local visual state based on month selection and stored detergent records
  useEffect(() => {
    const rows = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatYYYYMMDD(day);
      const match = detergentRecords.find(
        r => r.branchId === selectedBranchId && r.date === dateStr
      );

      rows.push({
        day,
        date: dateStr,
        label: formatDayLabel(day),
        inQty: match?.inQty !== undefined ? match.inQty : 0,
        outQty: match?.outQty !== undefined ? match.outQty : 0,
        note: match?.note || '',
        exists: !!match,
        recordId: match?.id || null,
        isDirty: false
      });
    }
    setLocalRows(rows);
    setAutoSaveStatus('saved');
  }, [selectedBranchId, selectedYear, selectedMonth, daysInMonth, detergentRecords]);

  // Cumulatively compute running balance "សរុប = Previous Balance + ចូល - ចេញ"
  const localRowsWithBalance = useMemo(() => {
    let currentBal = openingBalance;
    return localRows.map(row => {
      const balance = currentBal + (row.inQty || 0) - (row.outQty || 0);
      currentBal = balance;
      return {
        ...row,
        balance
      };
    });
  }, [localRows, openingBalance]);

  // ----------------------------------------------------
  // RECALCULATIONS & CELL EDITING
  // ----------------------------------------------------
  const handleCellChange = (dayIndex: number, field: 'inQty' | 'outQty' | 'note', value: any) => {
    setAutoSaveStatus('dirty');
    const updated = [...localRows];
    const target = { ...updated[dayIndex] };

    if (field === 'note') {
      target[field] = value;
    } else {
      const num = value === '' ? 0 : Math.max(0, parseInt(value) || 0);
      target[field] = num;
    }

    target.isDirty = true;
    updated[dayIndex] = target;
    setLocalRows(updated);
  };

  // Real-time aggregates
  const sumInQty = useMemo(() => localRows.reduce((a, b) => a + (b.inQty || 0), 0), [localRows]);
  const sumOutQty = useMemo(() => localRows.reduce((a, b) => a + (b.outQty || 0), 0), [localRows]);
  
  // Final running balance at the end of the month
  const finalBalance = useMemo(() => {
    if (localRowsWithBalance.length === 0) return openingBalance;
    return localRowsWithBalance[localRowsWithBalance.length - 1].balance;
  }, [localRowsWithBalance, openingBalance]);

  // Initialize/adjust inventory levels when detergent ledger is saved
  const syncInventoryOnSave = (dirtyRowsList: any[]) => {
    let updatedInventory = [...inventory];
    let updatedStockTx = [...stockTransactions];

    let totalInQtyChange = 0;
    let totalOutQtyChange = 0;

    dirtyRowsList.forEach(row => {
      const originalRecord = detergentRecords.find(r => r.id === row.recordId);
      const prevIn = originalRecord?.inQty || 0;
      const prevOut = originalRecord?.outQty || 0;

      totalInQtyChange += (row.inQty - prevIn);
      totalOutQtyChange += (row.outQty - prevOut);
    });

    if (totalInQtyChange === 0 && totalOutQtyChange === 0) return;

    // Find Soap Stock item in inventory
    let itemIdx = updatedInventory.findIndex(item => 
      item.branchId === selectedBranchId && 
      (item.itemName.toLowerCase().includes('soap') || item.category === 'Soap')
    );

    if (itemIdx < 0) {
      // Create Liquid Soap item if none exists
      const newItem: InventoryItem = {
        id: 'inv_soap_' + selectedBranchId,
        branchId: selectedBranchId,
        itemName: 'Liquid Soap Stock',
        category: 'Soap',
        unit: 'pcs',
        currentStock: 250,
        minimumStockAlert: 20,
        purchasePrice: 4.8,
        supplier: 'CleanChem Supply Co., Ltd',
        purchaseDate: new Date().toISOString().split('T')[0],
        usedQuantity: 0,
        remainingStock: 250
      };
      updatedInventory.push(newItem);
      itemIdx = updatedInventory.length - 1;
    }

    const currentItem = updatedInventory[itemIdx];
    
    // Add refills and subtract stock outs
    const newUsedQuantity = currentItem.usedQuantity + totalOutQtyChange;
    const newCurrentStock = currentItem.currentStock + totalInQtyChange;
    const newRemainingStock = Math.max(0, newCurrentStock - newUsedQuantity);

    updatedInventory[itemIdx] = {
      ...currentItem,
      currentStock: newCurrentStock,
      usedQuantity: newUsedQuantity,
      remainingStock: newRemainingStock
    };

    // Add Audit stock logs
    if (totalInQtyChange !== 0) {
      const txIn: StockTransaction = {
        id: 'stk_det_in_' + Date.now().toString().slice(-6),
        branchId: selectedBranchId,
        date: new Date().toISOString().split('T')[0],
        itemId: currentItem.id,
        itemName: currentItem.itemName,
        quantity: Math.abs(totalInQtyChange),
        currentStock: newRemainingStock,
        type: totalInQtyChange > 0 ? 'In' : 'Out',
        cost: 0,
        createdBy: currentRole,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        note: totalInQtyChange > 0 
          ? `Added ${totalInQtyChange} pcs Soap In via Daily Tracking form`
          : `Removed ${Math.abs(totalInQtyChange)} pcs Soap In via daily corrections`
      };
      updatedStockTx = [txIn, ...updatedStockTx];
    }

    if (totalOutQtyChange !== 0) {
      const txOut: StockTransaction = {
        id: 'stk_det_out_' + Date.now().toString().slice(-6),
        branchId: selectedBranchId,
        date: new Date().toISOString().split('T')[0],
        itemId: currentItem.id,
        itemName: currentItem.itemName,
        quantity: Math.abs(totalOutQtyChange),
        currentStock: newRemainingStock,
        type: totalOutQtyChange > 0 ? 'Use' : 'In',
        cost: 0,
        createdBy: currentRole,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        note: totalOutQtyChange > 0 
          ? `Subtracted ${totalOutQtyChange} pcs Soap out via Daily Tracking usage`
          : `Returned ${Math.abs(totalOutQtyChange)} pcs Soap to stock via adjustments`
      };
      updatedStockTx = [txOut, ...updatedStockTx];
    }

    setInventory(updatedInventory);
    setStockTransactions(updatedStockTx);

    // Trigger Telegram Instant Alert if remaining stock is low
    if (newRemainingStock < currentItem.minimumStockAlert) {
      fetch('/api/telegram-trigger-instant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertType: 'Low Stock Alert (Detergent)',
          branchId: selectedBranchId,
          details: `• Product: ${currentItem.itemName}\n• Current Inventory Level: ${newRemainingStock} pcs\n• Safe Minimum Level: ${currentItem.minimumStockAlert} pcs\n• Urgent stock replenishment required.`,
          actionRequired: 'Order/deliver new detergent fluid containers immediately.'
        })
      }).catch(err => console.error('Failed to trigger stock alert Telegram config notification:', err));
    }
  };

  // ----------------------------------------------------
  // DATA SAVING
  // ----------------------------------------------------
  // Save single row to global detergent records
  const saveRow = (index: number) => {
    const row = localRowsWithBalance[index];
    const matchId = row.recordId || `det_${selectedBranchId}_${row.date}`;

    // Sync inventory values first
    syncInventoryOnSave([row]);

    // Create target DetergentRecord
    const savedRecord: DetergentRecord = {
      id: matchId,
      branchId: selectedBranchId,
      date: row.date,
      // For legacy components compatibility
      quantityLiters: row.outQty,
      remainingLiters: row.balance, // running balance as remaining
      type: 'Use',
      cost: 0,
      createdBy: currentRole,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      note: row.note,
      // Our paper shape additions
      inQty: row.inQty,
      outQty: row.outQty,
      total: row.outQty,
      // Powder/soap/cleaner compatibility values set to 0
      powder: 0,
      soap: row.outQty,
      cleaner: 0
    };

    // Replace or insert
    setDetergentRecords(prev => {
      const idx = prev.findIndex(p => p.id === matchId);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = savedRecord;
        return copy;
      } else {
        return [...prev, savedRecord];
      }
    });

    // Mark as clean locally
    setLocalRows(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], exists: true, recordId: matchId, isDirty: false };
      return copy;
    });

    setSavedRowIndex(index);
    setTimeout(() => setSavedRowIndex(null), 1500);

    onAddLog(`Saved daily Soap usage record for ${selectedBranchName} on ${row.label} (Stock In: ${row.inQty}, Usage: ${row.outQty}, Balance: ${row.balance})`);
  };

  // Save the whole month's sheet
  const saveAllRows = () => {
    const dirtyRows = localRowsWithBalance.filter(r => r.isDirty);
    if (dirtyRows.length === 0) {
      setSaveStatus(lang === 'en' ? 'All records are already up to date.' : 'កំណត់ត្រាទាំងអស់បានរក្សាទុកថ្មីៗរួចរាល់ហើយ។');
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    // Sync physical stock levels in inventory
    syncInventoryOnSave(dirtyRows);

    setDetergentRecords(prev => {
      let nextList = [...prev];

      dirtyRows.forEach(row => {
        const matchId = row.recordId || `det_${selectedBranchId}_${row.date}`;
        const newRec: DetergentRecord = {
          id: matchId,
          branchId: selectedBranchId,
          date: row.date,
          quantityLiters: row.outQty,
          remainingLiters: row.balance,
          type: 'Use',
          cost: 0,
          createdBy: currentRole,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          note: row.note,
          inQty: row.inQty,
          outQty: row.outQty,
          total: row.outQty,
          powder: 0,
          soap: row.outQty,
          cleaner: 0
        };

        const existingIdx = nextList.findIndex(x => x.id === matchId);
        if (existingIdx > -1) {
          nextList[existingIdx] = newRec;
        } else {
          nextList.push(newRec);
        }
      });

      return nextList;
    });

    // Reset local rows dirty markers
    setLocalRows(prev => prev.map(r => ({ 
      ...r, 
      isDirty: false, 
      exists: true, 
      recordId: r.recordId || `det_${selectedBranchId}_${r.date}` 
    })));
    
    setSaveStatus(lang === 'en' ? `Successfully saved ${dirtyRows.length} daily entries` : `រក្សាទុកទិន្នន័យចំនួន ${dirtyRows.length} ថ្ងៃបានជោគជ័យ`);
    setTimeout(() => setSaveStatus(null), 3500);

    onAddLog(`Batch saved ${dirtyRows.length} daily Soap usage sheet rows for Branch ID: ${selectedBranchId} of month #${selectedMonth}/${selectedYear}`);
  };

  // ----------------------------------------------------
  // DEBOUNCED AUTO-SAVE FOR SEAMLESS OFF-PAPER METAPHOR
  // ----------------------------------------------------
  useEffect(() => {
    const hasDirty = localRows.some(r => r.isDirty);
    if (!hasDirty) return;

    setAutoSaveStatus('dirty');
    const timer = setTimeout(() => {
      setAutoSaveStatus('saving');
      
      const dirtyRows = localRowsWithBalance.filter(r => r.isDirty);
      syncInventoryOnSave(dirtyRows);

      setDetergentRecords(prev => {
        let nextList = [...prev];
        
        dirtyRows.forEach(row => {
          const matchId = row.recordId || `det_${selectedBranchId}_${row.date}`;
          const newRec: DetergentRecord = {
            id: matchId,
            branchId: selectedBranchId,
            date: row.date,
            quantityLiters: row.outQty,
            remainingLiters: row.balance,
            type: 'Use',
            cost: 0,
            createdBy: currentRole,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            note: row.note,
            inQty: row.inQty,
            outQty: row.outQty,
            total: row.outQty,
            powder: 0,
            soap: row.outQty,
            cleaner: 0
          };

          const existingIdx = nextList.findIndex(x => x.id === matchId);
          if (existingIdx > -1) {
            nextList[existingIdx] = newRec;
          } else {
            nextList.push(newRec);
          }
        });

        return nextList;
      });

      setLocalRows(prev => 
        prev.map(r => {
          if (r.isDirty) {
            return {
              ...r,
              isDirty: false,
              exists: true,
              recordId: r.recordId || `det_${selectedBranchId}_${r.date}`
            };
          }
          return r;
        })
      );
      
      setAutoSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString());
    }, 1500);

    return () => clearTimeout(timer);
  }, [localRows]);

  // ----------------------------------------------------
  // EXPORTS & PRINTS WITH MERGED HEADERS INTACT
  // ----------------------------------------------------
  const handleExportExcel = () => {
    // Exact merged header structure represented inside standard 2D spreadsheet layout
    const headers = [
      [selectedBranchName + ' - Soap Daily Tracking Sheet (' + getMonthEnglish(selectedMonth) + ' ' + selectedYear + ')'],
      [lang === 'en' ? 'Date' : 'ថ្ងៃ', lang === 'en' ? 'Stock In (ចូល)' : 'ចូល (In)', lang === 'en' ? 'Usage (ចេញ)' : 'ចេញ (Out)', lang === 'en' ? 'Remark (ចំណាំ)' : 'ចំណាំ', lang === 'en' ? 'Balance (សរុប)' : 'សរុប (Balance)']
    ];

    const rows = localRowsWithBalance.map(r => [
      r.label,
      r.inQty || 0,
      r.outQty || 0,
      r.note || '',
      r.balance
    ]);

    // Bottom totals line
    rows.push([
      lang === 'en' ? 'Total / Final Balance' : 'សរុប / សមតុល្យចុងក្រោយ',
      sumInQty,
      sumOutQty,
      '',
      finalBalance
    ]);

    // Create Worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...rows]);
    
    // Merge title top row
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Soap Tracker");

    const safeBranchStr = selectedBranchName.replace(/\s+/g, '_');
    XLSX.writeFile(workbook, `Soap_Tracking_${safeBranchStr}_${getMonthAbbr(selectedMonth)}_${selectedYear}.xlsx`);
    onAddLog(`Exported Monthly Soap Tracking Sheet to Excel for branch ${selectedBranchName}, month #${selectedMonth}`);
  };

  const handlePrint = () => {
    window.print();
  };

  // ----------------------------------------------------
  // REPORTS VIEW GENERATORS (Daily, Monthly, Branch)
  // ----------------------------------------------------
  const dailyReportData = useMemo(() => {
    return localRowsWithBalance.filter(r => r.inQty > 0 || r.outQty > 0);
  }, [localRowsWithBalance]);

  const monthlyReportData = useMemo(() => {
    const report = [];
    for (let m = 1; m <= 12; m++) {
      const monthPrefix = `${selectedYear}-${String(m).padStart(2, '0')}`;
      const branchRecords = detergentRecords
        .filter(r => r.branchId === selectedBranchId && r.date.startsWith(monthPrefix))
        .sort((a,b) => a.date.localeCompare(b.date));

      const tIn = branchRecords.reduce((sum, r) => sum + (r.inQty || 0), 0);
      const tOut = branchRecords.reduce((sum, r) => sum + (r.outQty || 0), 0);
      
      // Calculate month ending balance dynamically
      let endingBal = 20; 
      const priorAndCurrentRecs = detergentRecords
        .filter(r => r.branchId === selectedBranchId && r.date.startsWith(`${selectedYear}-`) && parseInt(r.date.substring(5,7)) <= m)
        .sort((a,b) => a.date.localeCompare(b.date));
        
      priorAndCurrentRecs.forEach(r => {
        endingBal += (r.inQty || 0) - (r.outQty || 0);
      });

      report.push({
        monthNum: m,
        monthNameEn: getMonthEnglish(m),
        monthNameKh: getMonthKhmer(m),
        inQty: tIn,
        outQty: tOut,
        balance: endingBal
      });
    }
    return report;
  }, [detergentRecords, selectedBranchId, selectedYear]);

  const branchReportData = useMemo(() => {
    return branches.map(br => {
      const monthPrefix = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
      const brRecords = detergentRecords.filter(r => r.branchId === br.id && r.date.startsWith(monthPrefix));

      const tIn = brRecords.reduce((sum, r) => sum + (r.inQty || 0), 0);
      const tOut = brRecords.reduce((sum, r) => sum + (r.outQty || 0), 0);

      let endingBal = 20;
      const priorAndCurrentRecs = detergentRecords
        .filter(r => r.branchId === br.id && r.date.startsWith(`${selectedYear}-`) && parseInt(r.date.substring(5,7)) <= selectedMonth)
        .sort((a,b) => a.date.localeCompare(b.date));
        
      priorAndCurrentRecs.forEach(r => {
        endingBal += (r.inQty || 0) - (r.outQty || 0);
      });

      return {
        branchId: br.id,
        branchName: br.branchName,
        inQty: tIn,
        outQty: tOut,
        balance: endingBal
      };
    });
  }, [detergentRecords, branches, selectedMonth, selectedYear]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6" id="soap-records-module">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 mb-6 gap-4 print:hidden">
        <div>
          <span className="text-pink-500 font-bold font-sans text-xs tracking-wider uppercase block">
            💎 {lang === 'en' ? 'Daily Worksheets' : 'សន្លឹកកិច្ចការប្រចាំថ្ងៃ'}
          </span>
          <h1 className="text-2xl font-extrabold font-sans text-slate-800 tracking-tight mt-1 flex items-center gap-2">
            🧼 {lang === 'en' ? 'Soap Daily Tracking' : 'ការតាមដានសាប៊ូប្រចាំថ្ងៃ'}
          </h1>
          <p className="text-slate-500 text-xs mt-0.5 font-sans">
            {lang === 'en' ? 'Paper-form style daily soap checking sheet, designed identically to current branch ledger binders.' 
                          : 'សន្លឹកតាមដានការប្រើប្រាស់សាប៊ូប្រចាំថ្ងៃតាមបែបបទក្រដាស សមស្របគ្នាទៅនឹងទម្រង់សៀវភៅបច្ចុប្បន្ននៅសាខា។'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Main Tabs switcher */}
          <button
            onClick={() => setActiveTab('sheet')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'sheet' 
                ? 'bg-pink-600 text-white shadow-xs' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            📋 {lang === 'en' ? 'Daily Sheet Form' : 'ទម្រង់សន្លឹកការងារ'}
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'reports' 
                ? 'bg-pink-600 text-white shadow-xs' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            📊 {lang === 'en' ? 'Reports Center' : 'មជ្ឈមណ្ឌលរបាយការណ៍'}
          </button>
        </div>
      </div>

      {/* FILTER BAR (Print-hidden) */}
      <div className="bg-white border border-slate-100 shadow-xs rounded-2xl p-5 mb-6 print:hidden flex flex-col md:flex-row flex-wrap items-center justify-between gap-5">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Branch Select */}
          {activeBranchId === 'all' && (
            <div className="flex flex-col gap-1 min-w-[150px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'en' ? 'Select Branch' : 'ជ្រើសរើសសាខា'}</span>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-500"
              >
                {branches.map(br => (
                  <option key={br.id} value={br.id}>{br.branchName}</option>
                ))}
              </select>
            </div>
          )}

          {/* Month Select */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'en' ? 'Working Month' : 'ខែបំពេញការងារ'}</span>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full pl-7 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-500 appearance-none"
              >
                {months.map(m => (
                  <option key={m.value} value={m.value}>
                    {lang === 'en' ? m.en : m.kh}
                  </option>
                ))}
              </select>
              <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Year Select */}
          <div className="flex flex-col gap-1 min-w-[100px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'en' ? 'Working Year' : 'ឆ្នាំបំពេញការងារ'}</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-500"
            >
              {years.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          {/* Opening Balance (Customizable startup) */}
          <div className="flex flex-col gap-1 min-w-[120px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'en' ? 'Opening Balance' : 'សមតុល្យដើមគ្រា'}</span>
            <input
              type="number"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(Math.max(0, parseInt(e.target.value) || 0))}
              className="px-3 py-1.5 bg-sky-50/50 hover:bg-sky-50 border border-sky-100 rounded-xl text-slate-800 text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* Sync panel indicators & Action Buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {activeTab === 'sheet' && (
            <>
              {/* Auto Save sync status text */}
              <div className="text-right flex flex-col mr-2">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Auto-Save</span>
                {autoSaveStatus === 'saved' && <span className="text-[10px] text-emerald-600 font-bold">✓ Connected</span>}
                {autoSaveStatus === 'saving' && <span className="text-[10px] text-sky-600 font-semibold animate-pulse">Syncing...</span>}
                {autoSaveStatus === 'dirty' && <span className="text-[10px] text-amber-500 font-medium">Pending...</span>}
              </div>

              <button
                onClick={saveAllRows}
                className="px-3 py-2 bg-pink-600 hover:bg-pink-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                title="Save all changes of current month"
              >
                <Save className="w-3.5 h-3.5" />
                {lang === 'en' ? 'Save Month Data' : 'រក្សាទុកទិន្នន័យខែនេះ'}
              </button>

              <button
                onClick={() => setIsPreviewOpen(true)}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                {lang === 'en' ? 'Paper Preview / Print' : 'មើលជាក្រដាស / បោះពុម្ព'}
              </button>
            </>
          )}

          <button
            onClick={handleExportExcel}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export Excel spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            {lang === 'en' ? 'Export Excel' : 'នាំចេញ Excel'}
          </button>
        </div>
      </div>

      {/* Save alerts banners */}
      {saveStatus && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-6 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-bounce print:hidden">
          <Check className="w-4 h-4 text-emerald-600" />
          {saveStatus}
        </div>
      )}

      {/* ====================================================
          TAB 1: DAILY SHEET FORM (THE PAPER COPY REPLICA)
          ==================================================== */}
      {activeTab === 'sheet' && (
        <div className="space-y-6">
          {/* Quick Real-Time Month-End Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4.5">
              <span className="text-[10px] text-emerald-600 font-bold uppercase block">{lang === 'en' ? 'Total Stock In (ចូល)' : 'សរុបនាំចូល (In)'}</span>
              <span className="text-2xl font-extrabold text-emerald-700 block mt-1">{sumInQty} {lang === 'en' ? 'pcs' : 'កញ្ចប់'}</span>
              <span className="text-[9px] text-emerald-500 block mt-0.5">{lang === 'en' ? 'Detergents refilled to secondary reserves' : 'សាប៊ូទឹកបន្ថែមក្នុងស្តុកធុង'}</span>
            </div>
            <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4.5">
              <span className="text-[10px] text-pink-600 font-bold uppercase block">{lang === 'en' ? 'Total Usage (ចេញ)' : 'ការប្រើប្រាស់សរុប (Usage / Out)'}</span>
              <span className="text-2xl font-extrabold text-pink-600 block mt-1">{sumOutQty} {lang === 'en' ? 'pcs' : 'កញ្ចប់'}</span>
              <span className="text-[9px] text-pink-400 block mt-0.5">{lang === 'en' ? 'From current month daily consumption lines' : 'គិតតាមទិន្នន័យប្រចាំថ្ងៃ'}</span>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4.5">
              <span className="text-[10px] text-amber-600 font-bold uppercase block">{lang === 'en' ? 'Current Safe Balance' : 'សមតុល្យសុវត្ថិភាពបច្ចុប្បន្ន'}</span>
              <span className="text-2xl font-extrabold text-amber-700 block mt-1">{finalBalance} {lang === 'en' ? 'pcs' : 'កញ្ចប់'}</span>
              <span className="text-[9px] text-amber-500 font-semibold block mt-0.5">Opening + In - Out = {finalBalance}</span>
            </div>
          </div>

          {/* MAIN FORM GRID */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center print:hidden">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-pink-500" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                  {selectedBranchName} - {lang === 'en' ? `DAILY TRACKING FOR ${getMonthEnglish(selectedMonth).toUpperCase()} ${selectedYear}` : `សន្លឹកកិច្ចការប្រចាំថ្ងៃសម្រាប់ខែ ${getMonthKhmer(selectedMonth)} ឆ្នាំ ${selectedYear}`}
                </h2>
              </div>
              <div className="text-[9px] text-slate-400 font-mono">
                {lang === 'en' ? 'Running balance auto-computes using Khmer physical ledger formula.' : 'សមតុល្យសរុបចុងគ្រាគណនាដោយស្វ័យប្រវត្តិតាមរូបមន្តសៀវភៅ Cambodia។'}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-sky-600 text-white border-b border-sky-700">
                    <th rowSpan={2} className="py-2.5 px-4 font-black text-xs text-center border-r border-sky-500 min-w-[130px]">{lang === 'en' ? 'Date' : 'ថ្ងៃ'}</th>
                    <th colSpan={2} className="py-1.5 px-4 font-black text-xs text-center border-r border-sky-500">{lang === 'en' ? 'Quantity' : 'ចំនួន'}</th>
                    <th rowSpan={2} className="py-2.5 px-4 font-black text-xs border-r border-sky-500 min-w-[200px]">{lang === 'en' ? 'Note (Remark)' : 'ចំណាំ (Note)'}</th>
                    <th rowSpan={2} className="py-2.5 px-4 font-black text-xs text-center border-r border-sky-500 min-w-[110px]">{lang === 'en' ? 'Total (Balance)' : 'សរុប (Balance)'}</th>
                    <th rowSpan={2} className="py-2.5 px-4 font-black text-xs text-center min-w-[95px] print:hidden">{lang === 'en' ? 'Action' : 'សកម្មភាព'}</th>
                  </tr>
                  <tr className="bg-sky-500 text-white border-b border-sky-600">
                    <th className="py-1 px-3 font-bold text-[11px] text-center border-r border-sky-400 min-w-[100px]">{lang === 'en' ? 'In (ចូល)' : 'ចូល (In)'}</th>
                    <th className="py-1 px-3 font-bold text-[11px] text-center border-r border-sky-400 min-w-[100px]">{lang === 'en' ? 'Out (ចេញ)' : 'ចេញ (Out)'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-sans text-xs">
                  {localRowsWithBalance.map((row, index) => {
                    const isDirty = row.isDirty;
                    const isSavedNow = savedRowIndex === index;

                    return (
                      <tr 
                        key={row.day} 
                        className={`hover:bg-slate-50 transition-colors odd:bg-white even:bg-slate-50/50 ${
                          isDirty ? 'bg-amber-50/50' : ''
                        } ${isSavedNow ? 'bg-emerald-50' : ''}`}
                      >
                        {/* Day / Date label */}
                        <td className="py-2 px-4 font-bold text-slate-700 border-r border-slate-300 text-center font-mono select-none">
                          {row.label}
                        </td>

                        {/* ចូល Stock In Input */}
                        <td className="py-1.5 px-2 border-r border-slate-300 bg-emerald-50/10 text-center">
                          <input
                            type="number"
                            value={row.inQty === 0 ? '' : row.inQty}
                            onChange={(e) => handleCellChange(index, 'inQty', e.target.value)}
                            min="0"
                            placeholder="0"
                            className="w-full max-w-[85px] mx-auto text-center font-bold font-mono text-emerald-800 bg-white border border-slate-300 rounded-lg px-1.5 py-1 focus:ring-1 focus:ring-emerald-500 focus:outline-none focus:border-emerald-500"
                          />
                        </td>

                        {/* ចេញ Usage / Out Input */}
                        <td className="py-1.5 px-2 border-r border-slate-300 bg-pink-50/10 text-center">
                          <input
                            type="number"
                            value={row.outQty === 0 ? '' : row.outQty}
                            onChange={(e) => handleCellChange(index, 'outQty', e.target.value)}
                            min="0"
                            placeholder="0"
                            className="w-full max-w-[85px] mx-auto text-center font-bold font-mono text-pink-700 bg-white border border-slate-300 rounded-lg px-1.5 py-1 focus:ring-1 focus:ring-pink-500 focus:outline-none focus:border-pink-500"
                          />
                        </td>

                        {/* ចំណាំ Notes Input */}
                        <td className="py-1.5 px-3 border-r border-slate-300 text-left">
                          <input
                            type="text"
                            value={row.note}
                            onChange={(e) => handleCellChange(index, 'note', e.target.value)}
                            placeholder={lang === 'en' ? 'Remark details...' : 'ចំណាំផ្សេងៗ...'}
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-slate-400 focus:outline-none text-slate-700"
                          />
                        </td>

                        {/* សរុប Cumulative Balance display */}
                        <td className="py-2 px-4 text-center border-r border-slate-300 bg-slate-50">
                          <span className={`font-black font-sans tracking-tight text-sm ${row.balance !== openingBalance ? 'text-slate-800' : 'text-slate-400'}`}>
                            {row.balance}
                          </span>
                        </td>

                        {/* Actions buttons */}
                        <td className="py-1.5 px-3 text-center border-r border-slate-300 print:hidden">
                          <div className="flex items-center justify-center gap-2.5">
                            {isDirty ? (
                              <button
                                onClick={() => saveRow(index)}
                                className="p-1 px-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                                title="Save this day row"
                              >
                                <Save className="w-3 h-3" />
                                {lang === 'en' ? 'Save' : 'រក្សាទុក'}
                              </button>
                            ) : (
                              <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5 select-none">
                                <Check className="w-3.5 h-3.5" />
                                {lang === 'en' ? 'Saved' : 'រក្សាទុកហើយ'}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* BOTTOM FOOTER SUMMARY ROW */}
                  <tr className="bg-sky-600 text-white font-extrabold text-sm border-t border-sky-700">
                    <td className="py-3 px-4 text-center border-r border-sky-500 font-sans">
                      {lang === 'en' ? 'Total:' : 'សរុប (Total):'}
                    </td>
                    <td className="py-3 px-3 text-center border-r border-sky-500 bg-sky-700 text-white font-mono">
                      {sumInQty}
                    </td>
                    <td className="py-3 px-3 text-center border-r border-sky-500 bg-sky-700 text-white font-mono">
                      {sumOutQty}
                    </td>
                    <td className="py-3 px-3 border-r border-sky-500 bg-sky-600 text-sky-100 font-normal italic text-xs">
                      {lang === 'en' ? 'Ending Balance' : 'សមតុល្យចុងគ្រាទីនេះ'}
                    </td>
                    <td className="py-3 px-4 text-center bg-sky-800 text-white font-serif text-base border-r border-sky-500 font-bold">
                      {finalBalance}
                    </td>
                    <td className="py-2 px-3 print:hidden bg-sky-600"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom action panel helpful hints */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
              <span className="text-xs text-slate-500 font-sans">
                💡 <strong className="text-slate-600">Tip:</strong> {lang === 'en' ? 'Values are automatically synchronised to cloud. Click "Save Month Data" to force a manual ledger locks check.' : 'តម្លៃសរុបត្រូវបានទូទាត់ភ្លាមៗទៅសន្និធិស្តុក។ ចុច "រក្សាទុកទិន្នន័យខែនេះ" សម្រាប់ធានាការផ្ទៀងផ្ទាត់។'}
              </span>
              <button
                onClick={saveAllRows}
                className="w-full sm:w-auto px-5 py-2.5 bg-pink-600 hover:bg-pink-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {lang === 'en' ? 'Save All Monthly Changes' : 'រក្សាទុកការផ្លាស់ប្តូរទាំងអស់ក្នុងខែនេះ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          TAB 2: REPORTS CENTER
          ==================================================== */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Inner submenu tabs */}
          <div className="flex border-b border-slate-200 gap-1 print:hidden">
            <button
              onClick={() => setReportSubTab('daily')}
              className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
                reportSubTab === 'daily' 
                  ? 'text-pink-600 border-b-2 border-pink-600' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              📝 {lang === 'en' ? 'Daily Report' : 'របាយការណ៍ប្រចាំថ្ងៃ'}
            </button>
            <button
              onClick={() => setReportSubTab('monthly')}
              className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
                reportSubTab === 'monthly' 
                  ? 'text-pink-600 border-b-2 border-pink-600' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              📅 {lang === 'en' ? 'Monthly Report' : 'របាយការណ៍ប្រចាំខែ'}
            </button>
            <button
              onClick={() => setReportSubTab('branch')}
              className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
                reportSubTab === 'branch' 
                  ? 'text-pink-600 border-b-2 border-pink-600' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🏢 {lang === 'en' ? 'Branch Report' : 'របាយការណ៍តាមសាខា'}
            </button>
          </div>

          {/* Report 1: Daily Usage List */}
          {reportSubTab === 'daily' && (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {lang === 'en' ? 'Active Daily Usage Report' : 'របាយការណ៍ការប្រើប្រាស់សកម្មប្រចាំថ្ងៃ'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'en' ? `Showing only days with entered actions for ${getMonthEnglish(selectedMonth)} ${selectedYear} inside ` : `បង្ហាញតែថ្ងៃដែលមានប្រតិបត្តិការក្នុងខែ ${getMonthKhmer(selectedMonth)} ឆ្នាំ ${selectedYear} `}
                    <strong>{selectedBranchName}</strong>
                  </p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-650 px-2.5 py-1 rounded-lg font-mono font-bold select-none">
                  {dailyReportData.length} {lang === 'en' ? 'Active Days' : 'ថ្ងៃសកម្ម'}
                </span>
              </div>

              {dailyReportData.length === 0 ? (
                <div className="text-center py-10 text-slate-400 italic text-xs">
                  {lang === 'en' ? 'No operational usages entered yet for this branch month.' : 'មិនទាន់មានកំណត់ត្រាប្រើប្រាស់សកម្មក្នុងខែនេះនៅឡើយទេ។'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <th className="py-2.5 px-3 font-semibold">{lang === 'en' ? 'Date' : 'កាលបរិច្ឆេទ'}</th>
                        <th className="py-2.5 px-3 font-semibold text-center">{lang === 'en' ? 'Refilled (In)' : 'ចូល'}</th>
                        <th className="py-2.5 px-3 font-semibold text-center">{lang === 'en' ? 'Usage (Out)' : 'ចេញ'}</th>
                        <th className="py-2.5 px-3 font-semibold text-center">{lang === 'en' ? 'Balance' : 'សមតុល្យ'}</th>
                        <th className="py-2.5 px-3 font-semibold">{lang === 'en' ? 'Note' : 'ចំណាំ'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {dailyReportData.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-sans font-bold text-slate-700">{r.label}</td>
                          <td className="py-2 px-3 text-center text-emerald-700 font-bold">{r.inQty}</td>
                          <td className="py-2 px-3 text-center text-pink-600 font-bold">{r.outQty}</td>
                          <td className="py-2 px-3 text-center text-rose-700 font-extrabold">{r.balance}</td>
                          <td className="py-2 px-3 font-sans text-slate-500 italic max-w-[220px] truncate">{r.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-bold border-t border-slate-200">
                        <td className="py-2 px-3 font-sans">{lang === 'en' ? 'Total Active' : 'សរុបសកម្ម'}</td>
                        <td className="py-2 px-3 text-center text-emerald-800">{sumInQty}</td>
                        <td className="py-2 px-3 text-center text-pink-700">{sumOutQty}</td>
                        <td className="py-2 px-3 text-center text-red-700">{finalBalance}</td>
                        <td className="py-2 px-3"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Report 2: Monthly Summary Cross-Compare */}
          {reportSubTab === 'monthly' && (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-5">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800">
                  {lang === 'en' ? `Full Year Cumulative Soap Usage Sheet (${selectedYear})` : `សន្លឹកសង្ខេបការប្រើប្រាស់ប្រចាំឆ្នាំ (${selectedYear})`}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {lang === 'en' ? `Aggregated month-by-month soap consumption overview for branch ` : `ទម្រង់ទិដ្ឋភាពទូទៅនៃកម្រិតប្រើប្រាស់សាប៊ូប្រចាំខែនីមួយៗសម្រាប់សាខា `}
                  <strong>{selectedBranchName}</strong>
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <th className="py-2.5 px-3 font-semibold">{lang === 'en' ? 'Month' : 'ខែ'}</th>
                      <th className="py-2.5 px-3 font-semibold text-center">{lang === 'en' ? 'Purchased (In)' : 'នាំចូល'}</th>
                      <th className="py-2.5 px-3 font-semibold text-center">{lang === 'en' ? 'Usage (Out)' : 'ចេញសរុប'}</th>
                      <th className="py-2.5 px-3 font-semibold text-center">{lang === 'en' ? 'Ending Balance' : 'សមតុល្យចុងខែ'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {monthlyReportData.map((m, i) => (
                      <tr 
                        key={i} 
                        className={`hover:bg-slate-50 ${
                          m.monthNum === selectedMonth ? 'bg-pink-50/40 font-bold' : ''
                        }`}
                      >
                        <td className="py-2 px-3 font-sans text-slate-700">
                          {lang === 'en' ? m.monthNameEn : m.monthNameKh}
                          {m.monthNum === selectedMonth && <span className="text-[9px] bg-pink-100 text-pink-700 font-semibold px-2 py-0.5 rounded ml-1.5">{lang === 'en' ? 'Active' : 'បច្ចុប្បន្ន'}</span>}
                        </td>
                        <td className="py-2 px-3 text-center text-teal-700 font-semibold">{m.inQty}</td>
                        <td className="py-2 px-3 text-center text-pink-650">{m.outQty}</td>
                        <td className="py-2 px-3 text-center text-rose-700 font-bold">{m.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Report 3: Branch Report Comparison */}
          {reportSubTab === 'branch' && (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-5">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800">
                  {lang === 'en' ? `Multi-Branch Soap Comparison (${getMonthEnglish(selectedMonth)} ${selectedYear})` : `ការប្រៀបធៀបកម្រិតប្រើប្រាស់សាប៊ូតាមសាខា (${getMonthKhmer(selectedMonth)} ឆ្នាំ ${selectedYear})`}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {lang === 'en' ? 'Active branch stock and usage overview for comparative operations audits.' : 'ទិដ្ឋភាពទូទៅនៃការប្រើប្រាស់និងសមតុល្យសាប៊ូខុសគ្នារវាងទីតាំងសាខានានាសម្រាប់ការផ្ទៀងផ្ទាត់។'}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <th className="py-2.5 px-3 font-semibold">{lang === 'en' ? 'Branch / Station' : 'ទីតាំងសាខា'}</th>
                      <th className="py-2.5 px-3 font-semibold text-center">{lang === 'en' ? 'Stock In (ចូល)' : 'ចូល'}</th>
                      <th className="py-2.5 px-3 font-semibold text-center">{lang === 'en' ? 'Usage (ចេញ)' : 'ចេញ'}</th>
                      <th className="py-2.5 px-3 font-semibold text-center">{lang === 'en' ? 'Remaining Balance' : 'សមតុល្យចុងគ្រា'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                                        {branchReportData.map((b, i) => (
                      <tr 
                        key={i} 
                        className={`hover:bg-slate-50 ${
                          b.branchId === selectedBranchId ? 'bg-pink-50/40 font-bold' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-sans text-slate-700">
                          {b.branchName}
                          {b.branchId === selectedBranchId && <span className="text-[9px] bg-sky-100 text-sky-700 font-bold px-2 py-0.5 rounded ml-1.5">Selected</span>}
                        </td>
                        <td className="py-2 px-3 text-center text-teal-700 font-medium">{b.inQty}</td>
                        <td className="py-2 px-3 text-center text-pink-650">{b.outQty}</td>
                        <td className="py-2 px-3 text-center text-rose-700 font-bold">{b.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================
                     PRINT PREVIEW DIALOG MODAL
         ========================================= */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white animate-fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl print:shadow-none print:max-h-full print:rounded-none">
            
            {/* Modal Control Header (Print Hidden) */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-pink-600" />
                <span className="font-bold text-slate-800 text-sm">
                  {lang === 'en' ? 'Physical Paper Copy Print Preview' : 'ប្រព័ន្ធទម្រង់បោះពុម្ភក្រដាសផ្លូវការ'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  {lang === 'en' ? 'Print / PDF' : 'បោះពុម្ភ / រក្សាក្រដាស PDF'}
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {lang === 'en' ? 'Close' : 'បិទ'}
                </button>
              </div>
            </div>

            {/* Printable Container Body */}
            <div className="flex-1 overflow-y-auto p-8 print:p-0" id="paper-form-printing-container">
              <div className="w-full bg-white text-[#111827] mx-auto relative antialiased border-[6px] border-double border-sky-600 rounded-3xl p-8 max-w-[800px] print:border-none print:p-3 overflow-hidden">
                {/* Blue corner wave decorations */}
                <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none opacity-10">
                  <svg viewBox="0 0 100 100" fill="none" className="text-sky-600 w-full h-full">
                    <path d="M0 0 C 40 10, 60 40, 100 100 L 0 100 Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-10">
                  <svg viewBox="0 0 100 100" fill="none" className="text-sky-600 w-full h-full">
                    <path d="M100 0 C 60 10, 40 40, 0 100 L 100 100 Z" fill="currentColor" />
                  </svg>
                </div>
                
                {/* Photo Header block */}
                <div className="text-center font-sans relative z-10">
                  <h1 className="text-3xl font-black text-sky-800 tracking-wider font-sans mb-1">
                    {lang === 'en' ? 'LIQUID SOAP / DETERGENT' : 'សាប៊ូ'}
                  </h1>
                  <div className="flex items-center justify-center gap-4 max-w-[280px] mx-auto">
                    <div className="h-[1.5px] bg-sky-600 flex-1" />
                    <span className="text-sky-600 text-xs">❖</span>
                    <div className="h-[1.5px] bg-sky-600 flex-1" />
                  </div>
                </div>

                {/* Sub-Header Period labels in matching pill layout */}
                <div className="flex flex-wrap justify-between items-center mt-6 text-[11px] font-bold text-sky-950 px-2 relative z-10 gap-3">
                  <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>{lang === 'en' ? 'Month:' : 'ខែ:'} <span className="text-sky-850 uppercase font-extrabold">{getMonthEnglish(selectedMonth)} ( {getMonthKhmer(selectedMonth)} )</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 px-4 py-1 rounded-full">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>{lang === 'en' ? 'Year:' : 'ឆ្នាំ:'} <span className="text-sky-850 font-extrabold">{selectedYear}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[9px] font-normal">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{lang === 'en' ? 'Observed:' : 'កាលបរិច្ឆេទអង្កេត:'} {getPrintedDateTime()}</span>
                  </div>
                </div>

                {/* Exact replication grid */}
                <div className="mt-5 relative z-10 overflow-hidden rounded-xl border border-slate-355 shadow-xs">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-sky-600 text-white text-[11px] font-bold border-b border-sky-700">
                        <th rowSpan={2} className="py-2.5 px-2 border-r border-sky-500 text-center w-[110px] font-black">
                          <span className="flex items-center justify-center gap-1">📅 {lang === 'en' ? 'Date' : 'ថ្ងៃ'}</span>
                        </th>
                        <th colSpan={2} className="py-1.5 px-2 border-r border-sky-500 border-b border-sky-500 text-center font-black">
                          {lang === 'en' ? 'Quantity' : 'ចំនួន'}
                        </th>
                        <th rowSpan={2} className="py-2.5 px-2 border-r border-sky-500 text-left min-w-[150px] font-black">
                          <span className="flex items-center gap-1">💰 {lang === 'en' ? 'Note' : 'ចំណាំ'}</span>
                        </th>
                        <th rowSpan={2} className="py-2.5 px-2 text-center w-[95px] font-black">
                          <span className="flex items-center justify-center gap-1">📊 {lang === 'en' ? 'Total' : 'សរុប'}</span>
                        </th>
                      </tr>
                      <tr className="bg-sky-500 text-white text-[10px] font-bold border-b border-sky-600">
                        <th className="py-1.5 px-1 border-r border-sky-400 text-center w-[90px] font-bold">
                          <span className="flex items-center justify-center gap-0.5">🛢️ {lang === 'en' ? 'In' : 'ចូល'}</span>
                        </th>
                        <th className="py-1.5 px-1 border-r border-sky-400 text-center w-[90px] font-bold">
                          <span className="flex items-center justify-center gap-0.5">🧼 {lang === 'en' ? 'Soap' : 'សាប៊ូ'}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[10px] text-slate-800 font-mono divide-y divide-slate-350">
                      {localRowsWithBalance.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 odd:bg-white even:bg-slate-50/20" style={{ height: '24px' }}>
                          <td className="py-1.5 px-2 text-center border-r border-slate-355 font-bold text-slate-700">{r.label}</td>
                          <td className="py-1.5 px-1 text-center border-r border-slate-355 font-extrabold text-teal-850 bg-emerald-50/10">
                            {r.inQty > 0 ? r.inQty : ''}
                          </td>
                          <td className="py-1.5 px-1 text-center border-r border-slate-355 font-bold text-slate-800">
                            {r.outQty > 0 ? r.outQty : ''}
                          </td>
                          <td className="py-1.5 px-3 text-left border-r border-slate-355 font-sans text-slate-600 text-[9px] truncate max-w-[180px]">
                            {r.note || ''}
                          </td>
                          <td className="py-1.5 px-2 text-center font-black text-red-700 bg-red-50/10 text-[11px]">
                            {r.balance}
                          </td>
                        </tr>
                      ))}

                      {/* Cumulative Total Row matching the physical document */}
                      <tr className="bg-sky-600 text-white font-extrabold text-[11px] border-t-2 border-sky-700">
                        <td className="py-2.5 px-2 text-center border-r border-sky-500 font-black">
                          <span className="flex items-center justify-center gap-1">🧮 TOTAL:</span>
                        </td>
                        <td className="py-2.5 px-1 text-center border-r border-sky-500 bg-sky-700 font-extrabold">{sumInQty}</td>
                        <td className="py-2.5 px-1 text-center border-r border-sky-500 bg-sky-700 font-extrabold">{sumOutQty}</td>
                        <td className="py-2.5 px-3 text-left border-r border-sky-500 font-sans font-bold text-[9.5px] bg-sky-50 text-sky-950">
                          <span className="flex items-center gap-1">📍 {getBranchKhmerName(selectedBranchName)} ({selectedBranchName})</span>
                        </td>
                        <td className="py-2.5 px-2 text-center font-black text-red-800 text-[13px] bg-red-100 border-l border-sky-500 rounded-br-lg">{finalBalance}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer signoff lines exactly matching fine print layout */}
                <div className="mt-8 flex justify-between text-[11px] text-sky-950 font-bold px-3 relative z-10">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1 italic">✍️ {lang === 'en' ? 'Prepared by checker:' : 'អ្នកកត់ត្រានិងពិនិត្យផ្ទាល់៖'}</span>
                    <div className="w-[180px] border-b border-dashed border-sky-400 mt-8" />
                    <span className="block mt-1 font-mono text-[9px] text-slate-400 font-normal">Signature & Date</span>
                  </div>
                  <div>
                    {/* Leaf shield crest logo */}
                    <div className="flex flex-col items-center justify-center mt-2">
                      <div className="relative">
                        <svg className="w-12 h-12 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.15"/>
                          <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="absolute -inset-1 border border-dashed border-sky-500 rounded-full animate-spin-slow opacity-25" />
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="flex items-center justify-end gap-1 italic">✍️ {lang === 'en' ? 'Approved by supervisor:' : 'ពិនិត្យនិងអនុម័តដោយប្រធានសាខា៖'}</span>
                    <div className="w-[180px] border-b border-dashed border-sky-400 mt-8" />
                    <span className="block mt-1 font-mono text-[9px] text-slate-400 font-normal">Signature & Date</span>
                  </div>
                </div>

                {/* Bottom wave decoration */}
                <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-r from-sky-400 via-blue-600 to-sky-400 print:h-3" />
              </div>
            </div>

            {/* Footer Buttons print-hidden */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 print:hidden rounded-b-2xl">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                {lang === 'en' ? 'Exit Print Dialog' : 'ចាកចេញ'}
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2 bg-pink-600 hover:bg-pink-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                {lang === 'en' ? 'Print Sheet' : 'បោះពុម្ភ'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Embedded Stylesheet override for exact paper form-printing container rendering */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0.3cm;
          }
          body * {
            visibility: hidden;
          }
          #paper-form-printing-container, #paper-form-printing-container * {
            visibility: visible;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #paper-form-printing-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            margin: 0 !important;
          }
          #paper-form-printing-container .border-double {
            border-width: 4px !important;
            padding: 16px !important;
            border-radius: 16px !important;
          }
          #paper-form-printing-container tr {
            height: 18px !important;
          }
          #paper-form-printing-container th, 
          #paper-form-printing-container td {
            padding-top: 1px !important;
            padding-bottom: 1px !important;
            font-size: 8.5px !important;
          }
          #paper-form-printing-container h1 {
            font-size: 22px !important;
            margin-bottom: 2px !important;
          }
          #paper-form-printing-container .mt-5 {
            margin-top: 8px !important;
          }
          #paper-form-printing-container .mt-6 {
            margin-top: 8px !important;
          }
          #paper-form-printing-container .mt-8 {
            margin-top: 10px !important;
          }
          #paper-form-printing-container .border-dashed {
            margin-top: 20px !important;
          }
          #paper-form-printing-container svg {
            width: 32px !important;
            height: 32px !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
