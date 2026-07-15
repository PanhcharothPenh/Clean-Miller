/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Income, Expense, Salary } from './types';

// Currency Formatting helper supporting USD and Khmer Riel (KHR)
export function formatCurrency(amount: number, currency: 'USD' | 'KHR' = 'USD', exchangeRate = 4100): string {
  if (currency === 'USD') {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(amount);
  } else {
    // KHR
    const rielAmount = Math.round(amount * exchangeRate);
    const formatter = new Intl.NumberFormat('kh-KH', {
      style: 'currency',
      currency: 'KHR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(rielAmount);
  }
}

// Dual Currency display e.g. "$12.00 / 49,200 ៛"
export function formatDualCurrency(amount: number, exchangeRate = 4100): string {
  const usd = formatCurrency(amount, 'USD');
  const khrVal = Math.round(amount * exchangeRate);
  const khr = new Intl.NumberFormat('en-US').format(khrVal) + ' ៛';
  return `${usd} (${khr})`;
}

// Convert packet counts into Cases and Packets display string
export function formatCasesAndPackets(totalPackets: number, lang: 'en' | 'kh' = 'en'): string {
  const PACKETS_PER_CASE = 24;
  const cases = Math.floor(Math.abs(totalPackets) / PACKETS_PER_CASE);
  const packets = Math.round((Math.abs(totalPackets) % PACKETS_PER_CASE) * 10) / 10;
  const sign = totalPackets < 0 ? '-' : '';

  if (lang === 'en') {
    if (cases === 0) return `${sign}${packets} pcs`;
    if (packets === 0) return `${sign}${cases} cs`;
    return `${sign}${cases} cs & ${packets} pcs`;
  } else {
    if (cases === 0) return `${sign}${packets} កញ្ចប់`;
    if (packets === 0) return `${sign}${cases} កេស`;
    return `${sign}${cases} កេស ${packets} កញ្ចប់`;
  }
}

// Calculate salary totals for a staff list
export function calculateNetSalary(base: number, ot: number, bonus: number, ded: number, advance: number): number {
  return base + ot + bonus - ded - advance;
}

// Function to generate and export structured CSV client-side (mocking Excel download)
export function exportToCSV(filename: string, headers: string[], rows: any[][]) {
  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" // Add BOM for Excel Khmer font rendering
    + [headers.join(","), ...rows.map(e => e.map(val => {
        // Escape quotes
        const str = typeof val === 'string' ? val.replace(/"/g, '""') : String(val);
        return `"${str}"`;
      }).join(","))].join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename + ".csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Helper to trigger browser printing of a specific element id
export function printElement(elementId: string, title: string) {
  const printContents = document.getElementById(elementId)?.innerHTML;
  if (!printContents) return;
  
  const originalContents = document.body.innerHTML;
  
  // Create printing window layout
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&display=swap">
          <style>
            body {
              font-family: 'Kantumruy Pro', system-ui, sans-serif;
              padding: 40px;
              line-height: 1.5;
              color: #1e293b;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #e2e8f0;
              padding: 10px;
              text-align: left;
              font-size: 13px;
            }
            th {
              background-color: #f1f5f9;
            }
            h1 { font-size: 24px; color: #0f172a; margin-bottom: 5px; }
            h2 { font-size: 16px; color: #475569; margin-top: 0; }
            .totals {
              margin-top: 30px;
              text-align: right;
              font-weight: bold;
              font-size: 16px;
            }
            .header-info {
              display: flex;
              justify-content: space-between;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body onload="window.print();window.close()">
          <div class="header-info">
            <div>
              <h1>Clean24 Laundry</h1>
              <h2>${title}</h2>
            </div>
            <div style="text-align: right; font-size: 12px; color: #64748b;">
              <strong>Printed On:</strong> ${new Date().toLocaleString()}<br>
              <strong>Status:</strong> Valid / Official Report
            </div>
          </div>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}

/**
 * Calculates prorated worked days and salary based on start/resignation date and payroll period
 */
export function getProratedDaysAndSalary(
  monthlySalary: number,
  startDateStr: string,
  resignationDateStr: string | undefined | null,
  year: number,
  month: number, // 1-12
  periodType: 'full' | 'first-half' | 'second-half' = 'full'
): { workedDays: number; totalDays: number; dailyRate: number; dueSalary: number } {
  // Safe date parsing fallbacks
  if (!startDateStr) startDateStr = '2026-01-01';
  
  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyRate = Math.round((monthlySalary / daysInMonth) * 100) / 100;

  let startDay = 1;
  let endDay = daysInMonth;

  if (periodType === 'first-half') {
    endDay = 15;
  } else if (periodType === 'second-half') {
    startDay = 16;
  }

  let workedDays = 0;

  const startParsed = new Date(startDateStr);
  const resignationParsed = resignationDateStr ? new Date(resignationDateStr) : null;

  // Clear times for accurate day comparisons
  startParsed.setHours(0, 0, 0, 0);
  if (resignationParsed) {
    resignationParsed.setHours(0, 0, 0, 0);
  }

  for (let d = startDay; d <= endDay; d++) {
    const currentDayDate = new Date(year, month - 1, d);
    currentDayDate.setHours(0, 0, 0, 0);

    const afterStarted = currentDayDate.getTime() >= startParsed.getTime();
    const beforeResigned = resignationParsed ? currentDayDate.getTime() <= resignationParsed.getTime() : true;

    if (afterStarted && beforeResigned) {
      workedDays++;
    }
  }

  const dueSalary = Math.round((dailyRate * workedDays) * 100) / 100;

  return {
    workedDays,
    totalDays: endDay - startDay + 1,
    dailyRate,
    dueSalary
  };
}
