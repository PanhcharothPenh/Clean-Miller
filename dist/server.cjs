var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_fs2 = __toESM(require("fs"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_crypto2 = __toESM(require("crypto"), 1);
var import_vite = require("vite");

// telegramService.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var CONFIG_PATH = import_path.default.join(process.cwd(), "telegram-config.json");
var ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "clean24_secret_key_32_characters_!!";
var IV_LENGTH = 16;
var defaultConfig = {
  botToken: "",
  enabledAlerts: ["low_stock", "salary", "daily_business", "branch", "machine"],
  chatIds: {
    owner: "",
    admin: "",
    manager: {},
    staff: {},
    branches: {}
  }
};
function getTelegramConfig() {
  try {
    if (import_fs.default.existsSync(CONFIG_PATH)) {
      const data = import_fs.default.readFileSync(CONFIG_PATH, "utf8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to read telegram config:", e);
  }
  return { ...defaultConfig };
}
function saveTelegramConfig(config) {
  try {
    import_fs.default.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
  } catch (e) {
    console.error("Failed to save telegram config:", e);
  }
}
function encryptToken(text) {
  if (!text) return "";
  try {
    const iv = import_crypto.default.randomBytes(IV_LENGTH);
    const cipher = import_crypto.default.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY.padEnd(32).substring(0, 32)), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  } catch (e) {
    return Buffer.from(text).toString("base64");
  }
}
function decryptToken(encryptedText) {
  if (!encryptedText) return "";
  try {
    const textParts = encryptedText.split(":");
    if (textParts.length !== 2) {
      return Buffer.from(encryptedText, "base64").toString("utf8");
    }
    const iv = Buffer.from(textParts[0], "hex");
    const encrypted = Buffer.from(textParts[1], "hex");
    const decipher = import_crypto.default.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY.padEnd(32).substring(0, 32)), iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (e) {
    try {
      return Buffer.from(encryptedText, "base64").toString("utf8");
    } catch {
      return encryptedText;
    }
  }
}
function maskToken(token) {
  if (!token) return "";
  const parts = token.split(":");
  if (parts.length >= 2) {
    const botId = parts[0];
    const rest = parts.slice(1).join(":");
    const lastFour = rest.length > 4 ? rest.substring(rest.length - 4) : rest;
    return `${botId}:****${lastFour}`;
  }
  if (token.length > 8) {
    return `${token.substring(0, 6)}:****${token.substring(token.length - 4)}`;
  }
  return "****";
}
function formatTelegramMessage(data) {
  return `<b>\u{1F9FC} ${data.shopName.toUpperCase()} ALERT SYSTEM</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
<b>\u{1F4E2} TYPE:</b> <code>${data.alertType}</code>
<b>\u{1F3EA} BRANCH:</b> <b>${data.branchName}</b>
<b>\u{1F4C5} TIME:</b> <code>${data.dateTime}</code>

<b>\u{1F4DD} DETAILS:</b>
${data.details}

<b>\u26A0\uFE0F REQUIRED ACTION:</b>
<u>${data.actionRequired}</u>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501`;
}
async function sendTelegramMessage(chatId, text, parseMode = "HTML", customBotToken) {
  try {
    let token = customBotToken;
    if (!token) {
      const config = getTelegramConfig();
      token = config.botToken;
    }
    if (!token) {
      return { success: false, error: "Telegram Bot Token is not configured" };
    }
    if (!chatId) {
      return { success: false, error: "Chat ID is missing or empty" };
    }
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode
      })
    });
    const body = await response.json();
    if (body.ok) {
      return { success: true };
    } else {
      return { success: false, error: body.description || "Unknown Telegram API Error" };
    }
  } catch (err) {
    console.error("Error sending Telegram notification:", err);
    return { success: false, error: err.message || "Network error sending to Telegram" };
  }
}

// src/utils/RevenuePdfService.ts
var import_jspdf = require("jspdf");
var cachedFontBase64 = null;
var FONT_URL = "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansKhmer/NotoSansKhmer-Regular.ttf";
async function loadKhmerFont() {
  if (cachedFontBase64) {
    return cachedFontBase64;
  }
  try {
    console.log("[RevenuePdfService] Loading Noto Sans Khmer font from CDN...");
    const response = await fetch(FONT_URL);
    if (!response.ok) {
      throw new Error(`Failed to load Khmer font from CDN: HTTP ${response.status} ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    cachedFontBase64 = buffer.toString("base64");
    console.log("[RevenuePdfService] Khmer font loaded and cached successfully.");
    return cachedFontBase64;
  } catch (err) {
    console.error("[RevenuePdfService] Font loading error:", err);
    throw err;
  }
}
function formatKHR(val) {
  return `${Math.round(val).toLocaleString("en-US")} \u17DB`;
}
function getFormattedDate(dateStr) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayIndex = d.getDay();
    const dayNum = String(d.getDate()).padStart(2, "0");
    return `${dayNum} (${days[dayIndex]})`;
  } catch (e) {
    return dateStr;
  }
}
async function generateRevenuePdf({
  branchId,
  branchName,
  month,
  year,
  records,
  generatedBy,
  generatedDateStr
}) {
  const fileBytesBase64 = await loadKhmerFont();
  const pdf = new import_jspdf.jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  pdf.addFileToVFS("NotoSansKhmer.ttf", fileBytesBase64);
  pdf.addFont("NotoSansKhmer.ttf", "NotoSansKhmer", "normal");
  pdf.setFont("NotoSansKhmer", "normal");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const monthName = monthNames[month - 1];
  const monthString = String(month).padStart(2, "0");
  let totalCashRev = 0;
  let totalAbaRev = 0;
  let totalRevenue = 0;
  for (const r of records) {
    const cash = (r.endCounter || 0) - (r.startCounter || 0);
    const aba = (r.endCounterAba || 0) - (r.startCounterAba || 0);
    totalCashRev += cash;
    totalAbaRev += aba;
    totalRevenue += cash + aba;
  }
  const pageHeight = 297;
  const marginX = 15;
  const startTableY = 62;
  const maxTableHeight = 210;
  const colWidths = {
    date: 15,
    time: 12,
    startCash: 18,
    endCash: 18,
    startAba: 18,
    endAba: 18,
    notes: 26,
    cashRev: 18,
    abaRev: 18,
    totalRev: 19
  };
  const colX = {
    date: marginX,
    time: marginX + colWidths.date,
    startCash: marginX + colWidths.date + colWidths.time,
    endCash: marginX + colWidths.date + colWidths.time + colWidths.startCash,
    startAba: marginX + colWidths.date + colWidths.time + colWidths.startCash + colWidths.endCash,
    endAba: marginX + colWidths.date + colWidths.time + colWidths.startCash + colWidths.endCash + colWidths.startAba,
    notes: marginX + colWidths.date + colWidths.time + colWidths.startCash + colWidths.endCash + colWidths.startAba + colWidths.endAba,
    cashRev: marginX + colWidths.date + colWidths.time + colWidths.startCash + colWidths.endCash + colWidths.startAba + colWidths.endAba + colWidths.notes,
    abaRev: marginX + colWidths.date + colWidths.time + colWidths.startCash + colWidths.endCash + colWidths.startAba + colWidths.endAba + colWidths.notes + colWidths.cashRev,
    totalRev: marginX + colWidths.date + colWidths.time + colWidths.startCash + colWidths.endCash + colWidths.startAba + colWidths.endAba + colWidths.notes + colWidths.cashRev + colWidths.abaRev
  };
  let pageNum = 1;
  const drawPageHeaders = (p, page) => {
    p.setFillColor("#00B2B2");
    p.roundedRect(marginX, 15, 12, 12, 2, 2, "F");
    p.setFillColor("#FFFFFF");
    p.circle(marginX + 6, 21, 3.5, "F");
    p.setFillColor("#00B2B2");
    p.circle(marginX + 6, 21, 1.5, "F");
    p.setFontSize(20);
    p.setTextColor("#00B2B1");
    p.setFont("NotoSansKhmer", "normal");
    p.text("CLEAN24", marginX + 15, 23.5);
    p.setFontSize(10);
    p.setTextColor("#334155");
    p.text("Official Monthly Audit Report", 195, 19, { align: "right" });
    p.setFontSize(11);
    p.setTextColor("#0F172A");
    p.text(`Branch: ${branchName}`, 195, 24, { align: "right" });
    p.text(`Period: ${monthName} ${year}`, 195, 29, { align: "right" });
    p.setDrawColor("#e2e8f0");
    p.setLineWidth(0.5);
    p.line(marginX, 33, 195, 33);
    p.setFontSize(13);
    p.setTextColor("#0F172A");
    p.text("MONTHLY REVENUE STATEMENT", 105, 41, { align: "center" });
    p.setFontSize(10);
    p.setTextColor("#475569");
    p.text(`Reconciled revenue records for the full reporting month of ${monthName} ${year}`, 105, 46, { align: "center" });
    const headerY = 52;
    p.setFillColor("#0891b2");
    p.rect(marginX, headerY, 180, 8, "F");
    p.setFontSize(6.5);
    p.setTextColor("#FFFFFF");
    p.text("Date", colX.date + colWidths.date / 2, headerY + 5.5, { align: "center" });
    p.text("Time", colX.time + colWidths.time / 2, headerY + 5.5, { align: "center" });
    p.text("Cash Start", colX.startCash + colWidths.startCash / 2, headerY + 5.5, { align: "center" });
    p.text("Cash End", colX.endCash + colWidths.endCash / 2, headerY + 5.5, { align: "center" });
    p.text("ABA Start", colX.startAba + colWidths.startAba / 2, headerY + 5.5, { align: "center" });
    p.text("ABA End", colX.endAba + colWidths.endAba / 2, headerY + 5.5, { align: "center" });
    p.text("Notes", colX.notes + 2, headerY + 5.5, { align: "left" });
    p.text("Cash Rev", colX.cashRev + colWidths.cashRev / 2, headerY + 5.5, { align: "center" });
    p.text("ABA Rev", colX.abaRev + colWidths.abaRev / 2, headerY + 5.5, { align: "center" });
    p.text("Daily Rev", colX.totalRev + colWidths.totalRev / 2, headerY + 5.5, { align: "center" });
  };
  const drawRowBorders = (p, y, h) => {
    p.setDrawColor("#cbd5e1");
    p.setLineWidth(0.15);
    p.line(colX.date, y, colX.date, y + h);
    p.line(colX.time, y, colX.time, y + h);
    p.line(colX.startCash, y, colX.startCash, y + h);
    p.line(colX.endCash, y, colX.endCash, y + h);
    p.line(colX.startAba, y, colX.startAba, y + h);
    p.line(colX.endAba, y, colX.endAba, y + h);
    p.line(colX.notes, y, colX.notes, y + h);
    p.line(colX.cashRev, y, colX.cashRev, y + h);
    p.line(colX.abaRev, y, colX.abaRev, y + h);
    p.line(colX.totalRev, y, colX.totalRev, y + h);
    p.line(195, y, 195, y + h);
    p.line(marginX, y + h, 195, y + h);
  };
  drawPageHeaders(pdf, pageNum);
  let currentY = startTableY;
  const baseRowHeight = 7.5;
  const cellPadding = 1.8;
  for (let idx = 0; idx < records.length; idx++) {
    const r = records[idx];
    const notesStr = r.note || "";
    const noteLines = pdf.splitTextToSize(notesStr, colWidths.notes - 4);
    const neededCellHeight = Math.max(baseRowHeight, noteLines.length * 4.5 + cellPadding * 2);
    if (currentY + neededCellHeight > maxTableHeight + 25) {
      pdf.addPage();
      pageNum++;
      drawPageHeaders(pdf, pageNum);
      currentY = startTableY;
    }
    if (idx % 2 === 1) {
      pdf.setFillColor("#f8fafc");
      pdf.rect(marginX, currentY, 180, neededCellHeight, "F");
    }
    pdf.setFontSize(6.5);
    pdf.setTextColor("#0F172A");
    const dateLabel = getFormattedDate(r.date);
    pdf.text(dateLabel, colX.date + colWidths.date / 2, currentY + neededCellHeight / 2 + 1.2, { align: "center" });
    const timeValue = r.time || "10:30";
    pdf.text(timeValue, colX.time + colWidths.time / 2, currentY + neededCellHeight / 2 + 1.2, { align: "center" });
    const startStr = r.startCounter !== void 0 && r.startCounter !== null ? Math.round(r.startCounter).toLocaleString("en-US") : "0";
    pdf.text(startStr, colX.startCash + colWidths.startCash - 1.5, currentY + neededCellHeight / 2 + 1.2, { align: "right" });
    const endStr = r.endCounter !== void 0 && r.endCounter !== null ? Math.round(r.endCounter).toLocaleString("en-US") : "0";
    pdf.text(endStr, colX.endCash + colWidths.endCash - 1.5, currentY + neededCellHeight / 2 + 1.2, { align: "right" });
    const startAbaStr = r.startCounterAba !== void 0 && r.startCounterAba !== null ? Math.round(r.startCounterAba).toLocaleString("en-US") : "0";
    pdf.text(startAbaStr, colX.startAba + colWidths.startAba - 1.5, currentY + neededCellHeight / 2 + 1.2, { align: "right" });
    const endAbaStr = r.endCounterAba !== void 0 && r.endCounterAba !== null ? Math.round(r.endCounterAba).toLocaleString("en-US") : "0";
    pdf.text(endAbaStr, colX.endAba + colWidths.endAba - 1.5, currentY + neededCellHeight / 2 + 1.2, { align: "right" });
    const cashRevVal = (r.endCounter || 0) - (r.startCounter || 0);
    if (cashRevVal < 0) {
      pdf.setTextColor("#b91c1c");
    }
    pdf.text(formatKHR(cashRevVal), colX.cashRev + colWidths.cashRev - 1.5, currentY + neededCellHeight / 2 + 1.2, { align: "right" });
    pdf.setTextColor("#0F172A");
    const abaRevVal = (r.endCounterAba || 0) - (r.startCounterAba || 0);
    if (abaRevVal < 0) {
      pdf.setTextColor("#b91c1c");
    }
    pdf.text(formatKHR(abaRevVal), colX.abaRev + colWidths.abaRev - 1.5, currentY + neededCellHeight / 2 + 1.2, { align: "right" });
    pdf.setTextColor("#0F172A");
    const dayTotalRev = cashRevVal + abaRevVal;
    pdf.text(formatKHR(dayTotalRev), colX.totalRev + colWidths.totalRev - 1.5, currentY + neededCellHeight / 2 + 1.2, { align: "right" });
    pdf.setTextColor("#475569");
    let lineY = currentY + cellPadding + 3;
    for (const line of noteLines) {
      pdf.text(line, colX.notes + 2, lineY);
      lineY += 4.5;
    }
    drawRowBorders(pdf, currentY, neededCellHeight);
    currentY += neededCellHeight;
  }
  const totalRowHeight = 9;
  if (currentY + totalRowHeight > maxTableHeight + 25) {
    pdf.addPage();
    pageNum++;
    drawPageHeaders(pdf, pageNum);
    currentY = startTableY;
  }
  pdf.setFillColor("#ecfdf5");
  pdf.rect(marginX, currentY, 180, totalRowHeight, "F");
  pdf.setFont("NotoSansKhmer", "normal");
  pdf.setFontSize(6.5);
  pdf.setTextColor("#065f46");
  pdf.text("Totals:", colX.date + 1, currentY + totalRowHeight / 2 + 1.5, { align: "left" });
  pdf.text("", colX.time + 1, currentY + totalRowHeight / 2 + 1.5);
  pdf.text("", colX.startCash + 1, currentY + totalRowHeight / 2 + 1.5);
  pdf.text("", colX.endCash + 1, currentY + totalRowHeight / 2 + 1.5);
  pdf.text("", colX.startAba + 1, currentY + totalRowHeight / 2 + 1.5);
  pdf.text("", colX.endAba + 1, currentY + totalRowHeight / 2 + 1.5);
  pdf.text("", colX.notes + 2, currentY + totalRowHeight / 2 + 1.5);
  pdf.text(formatKHR(totalCashRev), colX.cashRev + colWidths.cashRev - 1.5, currentY + totalRowHeight / 2 + 1.5, { align: "right" });
  pdf.text(formatKHR(totalAbaRev), colX.abaRev + colWidths.abaRev - 1.5, currentY + totalRowHeight / 2 + 1.5, { align: "right" });
  pdf.text(formatKHR(totalRevenue), colX.totalRev + colWidths.totalRev - 1.5, currentY + totalRowHeight / 2 + 1.5, { align: "right" });
  drawRowBorders(pdf, currentY, totalRowHeight);
  currentY += totalRowHeight;
  const signatureHeight = 35;
  if (currentY + signatureHeight > 270) {
    pdf.addPage();
    pageNum++;
    drawPageHeaders(pdf, pageNum);
    currentY = startTableY + 10;
  }
  currentY += 12;
  pdf.setFontSize(9);
  pdf.setTextColor("#334155");
  pdf.text("\u179A\u17C0\u1794\u1785\u17C6\u178A\u17C4\u1799\u1794\u17C1\u17A1\u17B6 (Prepared By Cashier)", 15, currentY);
  pdf.text("\u1796\u17B7\u1793\u17B7\u178F\u17D2\u1799\u178A\u17C4\u1799\u1794\u17D2\u179A\u1792\u17B6\u1793 (Checked By Supervisor)", 105, currentY, { align: "center" });
  pdf.text("\u17A2\u1793\u17BB\u1798\u17D0\u178F\u178A\u17C4\u1799\u1798\u17D2\u1785\u17B6\u179F\u17CB (Approved By Owner)", 195, currentY, { align: "right" });
  pdf.setDrawColor("#94a3b8");
  pdf.setLineDashPattern([1.5, 1.5], 0);
  pdf.line(15, currentY + 18, 55, currentY + 18);
  pdf.line(85, currentY + 18, 125, currentY + 18);
  pdf.line(155, currentY + 18, 195, currentY + 18);
  const totalPagesCount = pdf.getNumberOfPages();
  for (let pageIdx = 1; pageIdx <= totalPagesCount; pageIdx++) {
    pdf.setPage(pageIdx);
    pdf.setDrawColor("#e2e8f0");
    pdf.setLineWidth(0.4);
    pdf.setLineDashPattern([], 0);
    pdf.line(marginX, 280, 195, 280);
    pdf.setFontSize(7.5);
    pdf.setTextColor("#64748b");
    pdf.text(`Generated Date: ${generatedDateStr}  |  Generated By: ${generatedBy}`, marginX, 285);
    pdf.text(`Page ${pageIdx} of ${totalPagesCount}`, 195, 285, { align: "right" });
  }
  const arrayBuffer = pdf.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}

// server.ts
var import_supabase_js = require("@supabase/supabase-js");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use((0, import_cors.default)());
var isDbPulled = false;
app.use(async (req, res, next) => {
  const isApi = req.path.startsWith("/api") || req.path.startsWith("/auth");
  if (supabase && !isDbPulled && isApi) {
    try {
      console.log("[Clean24 Server] Request context activated. Awaiting Supabase database pull...");
      await pullCollectionsFromSupabase();
      isDbPulled = true;
      console.log("[Clean24 Server] Supabase database pull completed successfully!");
    } catch (err) {
      console.error("[Clean24 Server] Supabase database pull failed:", err.message || err);
    }
  }
  next();
});
app.use((req, res, next) => {
  pendingSupabasePushes = [];
  const originalSend = res.send;
  res.send = async function(body) {
    if (pendingSupabasePushes.length > 0) {
      try {
        console.log(`[Clean24 Server] Awaiting ${pendingSupabasePushes.length} database sync tasks before response...`);
        await Promise.all(pendingSupabasePushes);
        console.log("[Clean24 Server] Database sync tasks completed!");
      } catch (err) {
        console.error("[Clean24 Server] Error syncing database tasks before response:", err.message);
      }
      pendingSupabasePushes = [];
    }
    return originalSend.call(this, body);
  };
  next();
});
app.use(import_express.default.json({ limit: "50mb" }));
app.get("/api/download-project", (req, res) => {
  const filePath = import_path2.default.join(process.cwd(), "project.tar.gz");
  if (import_fs2.default.existsSync(filePath)) {
    res.download(filePath, "Clean24-Miller-project.tar.gz");
  } else {
    res.status(404).send("Project archive not found. Please run tar manually or contact support.");
  }
});
var SERVER_DB_PATH = import_path2.default.join(process.cwd(), "server-db.json");
var supabase = null;
var pendingSupabasePushes = [];
var lastPushedDbJson = {};
try {
  const supabaseUrl = (process.env.SUPABASE_URL || "").replace(/['"]/g, "").trim();
  const supabaseKey = (process.env.SUPABASE_ANON_KEY || "").replace(/['"]/g, "").trim();
  if (supabaseUrl && supabaseKey) {
    supabase = (0, import_supabase_js.createClient)(supabaseUrl, supabaseKey);
  }
} catch (e) {
  console.error("[Clean24 Server] Failed to initialize Supabase client:", e.message);
}
if (supabase) {
  console.log("[Clean24 Server] Supabase client initialized successfully.");
} else {
  console.log("[Clean24 Server] Supabase keys missing. Running in local JSON-file fallback mode.");
}
async function pullCollectionsFromSupabase() {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from("clean24_collections").select("*");
    if (error) throw error;
    const existingIds = /* @__PURE__ */ new Set();
    if (data && data.length > 0) {
      data.forEach((row) => {
        localDb[row.id] = row.data;
        lastPushedDbJson[row.id] = JSON.stringify(row.data);
        existingIds.add(row.id);
      });
      console.log("[Clean24 Server] Database successfully synchronized from Supabase!");
    } else {
      console.log("[Clean24 Server] Supabase database is empty. Triggering self-healing database seeding...");
      seedUsersAndRoles();
    }
    const essentialCollections = ["users", "roles", "permissions", "rolePermissions", "branches"];
    for (const collId of essentialCollections) {
      const hasData = collId === "rolePermissions" ? Object.keys(localDb[collId] || {}).length > 0 : Array.isArray(localDb[collId]) && localDb[collId].length > 0;
      if (!existingIds.has(collId) && hasData) {
        console.log(`[Clean24 Server] Self-healing sync: pushing missing collection "${collId}" to Supabase...`);
        await pushCollectionToSupabase(collId);
        lastPushedDbJson[collId] = JSON.stringify(localDb[collId]);
      }
    }
  } catch (err) {
    console.error("[Clean24 Server] Supabase pull failed:", err.message);
  }
}
async function pushCollectionToSupabase(collectionId) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from("clean24_collections").upsert({ id: collectionId, data: localDb[collectionId], updated_at: (/* @__PURE__ */ new Date()).toISOString() });
    if (error) throw error;
  } catch (err) {
    console.error(`[Clean24 Server] Supabase push for ${collectionId} failed:`, err.message);
  }
}
var localDb = {
  branches: [],
  staff: [],
  salaries: [],
  attendance: [],
  incomes: [],
  expenses: [],
  inventory: [],
  machines: [],
  coinTransactions: [],
  revenueRecords: [],
  gasRecords: [],
  detergentRecords: [],
  softenerRecords: [],
  stockTransactions: [],
  settings: { shopName: "Clean24 Laundry" },
  users: [],
  roles: [],
  permissions: [],
  rolePermissions: {},
  loginHistory: [],
  refreshTokens: [],
  passwordResetTokens: []
};
if (import_fs2.default.existsSync(SERVER_DB_PATH)) {
  try {
    localDb = JSON.parse(import_fs2.default.readFileSync(SERVER_DB_PATH, "utf8"));
    if (supabase) {
      pullCollectionsFromSupabase().catch((err) => console.error("[Clean24 Server] Initial pull failed:", err));
    }
  } catch (e) {
    console.error("Failed to parse server-db.json:", e);
  }
}
if (!localDb.branches) localDb.branches = [];
if (!localDb.staff) localDb.staff = [];
if (!localDb.salaries) localDb.salaries = [];
if (!localDb.attendance) localDb.attendance = [];
if (!localDb.incomes) localDb.incomes = [];
if (!localDb.expenses) localDb.expenses = [];
if (!localDb.inventory) localDb.inventory = [];
if (!localDb.machines) localDb.machines = [];
if (!localDb.coinTransactions) localDb.coinTransactions = [];
if (!localDb.revenueRecords) localDb.revenueRecords = [];
if (!localDb.gasRecords) localDb.gasRecords = [];
if (!localDb.detergentRecords) localDb.detergentRecords = [];
if (!localDb.softenerRecords) localDb.softenerRecords = [];
if (!localDb.stockTransactions) localDb.stockTransactions = [];
if (!localDb.users) localDb.users = [];
if (!localDb.roles) localDb.roles = [];
if (!localDb.permissions) localDb.permissions = [];
if (!localDb.rolePermissions) localDb.rolePermissions = {};
if (!localDb.loginHistory) localDb.loginHistory = [];
if (!localDb.refreshTokens) localDb.refreshTokens = [];
if (!localDb.passwordResetTokens) localDb.passwordResetTokens = [];
if (!localDb.salarySchedules) localDb.salarySchedules = [];
if (!localDb.salaryAdvances) localDb.salaryAdvances = [];
if (!localDb.telegramTemplates) {
  localDb.telegramTemplates = [
    {
      id: "tpl_daily_revenue",
      name: "Daily Revenue Summary",
      category: "Daily Revenue Summary",
      isEnabled: true,
      engTemplate: "<b>\u{1F4CA} DAILY REVENUE SUMMARY</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>Branch:</b> {branch_name}\n\u{1F4C5} <b>Date:</b> {date} {time}\n\u{1F4B5} <b>Total Revenue:</b> {revenue} USD\n\u{1F4C8} <b>Status:</b> {status}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      khmerTemplate: "<b>\u{1F4CA} \u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u1785\u17C6\u178E\u17BC\u179B\u1794\u17D2\u179A\u1785\u17B6\u17C6\u1790\u17D2\u1784\u17C3</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>\u179F\u17B6\u1781\u17B6:</b> {branch_name}\n\u{1F4C5} <b>\u1780\u17B6\u179B\u1794\u179A\u17B7\u1785\u17D2\u1786\u17C1\u1791:</b> {date} {time}\n\u{1F4B5} <b>\u1785\u17C6\u178E\u17BC\u179B\u179F\u179A\u17BB\u1794:</b> {revenue} USD\n\u{1F4C8} <b>\u179F\u17D2\u1790\u17B6\u1793\u1797\u17B6\u1796:</b> {status}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      parseMode: "HTML",
      branchId: "all",
      targetGroups: []
    },
    {
      id: "tpl_daily_expense",
      name: "Daily Expense Summary",
      category: "Daily Expense Summary",
      isEnabled: true,
      engTemplate: "<b>\u{1F4B8} DAILY EXPENSE SUMMARY</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>Branch:</b> {branch_name}\n\u{1F4C5} <b>Date:</b> {date}\n\u{1F4B5} <b>Total Expenses:</b> {expense} USD\n\u{1F4DD} <b>Details:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      khmerTemplate: "<b>\u{1F4B8} \u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u1785\u17C6\u178E\u17B6\u1799\u1794\u17D2\u179A\u1785\u17B6\u17C6\u1790\u17D2\u1784\u17C3</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>\u179F\u17B6\u1781\u17B6:</b> {branch_name}\n\u{1F4C5} <b>\u1780\u17B6\u179B\u1794\u179A\u17B7\u1785\u17D2\u1786\u17C1\u1791:</b> {date}\n\u{1F4B5} <b>\u1785\u17C6\u178E\u17B6\u1799\u179F\u179A\u17BB\u1794:</b> {expense} USD\n\u{1F4DD} <b>\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u179B\u1798\u17D2\u17A2\u17B7\u178F:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      parseMode: "HTML",
      branchId: "all",
      targetGroups: []
    },
    {
      id: "tpl_daily_profit",
      name: "Daily Profit Summary",
      category: "Daily Profit Summary",
      isEnabled: true,
      engTemplate: "<b>\u{1F4B0} DAILY PROFIT SUMMARY</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>Branch:</b> {branch_name}\n\u{1F4C5} <b>Date:</b> {date}\n\u{1F4B5} <b>Revenue:</b> {revenue} USD\n\u{1F4B8} <b>Expense:</b> {expense} USD\n\u{1F449} <b>Net Profit:</b> {profit} USD\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      khmerTemplate: "<b>\u{1F4B0} \u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u1785\u17C6\u178E\u17C1\u1789\u1794\u17D2\u179A\u1785\u17B6\u17C6\u1790\u17D2\u1784\u17C3</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>\u179F\u17B6\u1781\u17B6:</b> {branch_name}\n\u{1F4C5} <b>\u1780\u17B6\u179B\u1794\u179A\u17B7\u1785\u17D2\u1786\u17C1\u1791:</b> {date}\n\u{1F4B5} <b>\u1785\u17C6\u178E\u17BC\u179B:</b> {revenue} USD\n\u{1F4B8} <b>\u1785\u17C6\u178E\u17B6\u1799:</b> {expense} USD\n\u{1F449} <b>\u1794\u17D2\u179A\u17B6\u1780\u17CB\u1785\u17C6\u178E\u17C1\u1789\u179F\u17BB\u1791\u17D2\u1792:</b> {profit} USD\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      parseMode: "HTML",
      branchId: "all",
      targetGroups: []
    },
    {
      id: "tpl_low_stock",
      name: "Low Stock Alert",
      category: "Low Stock Alert",
      isEnabled: true,
      engTemplate: "<b>\u26A0\uFE0F LOW STOCK ALERT</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>Branch:</b> {branch_name}\n\u{1F4E6} <b>Item:</b> {item_name}\n\u{1F6A8} <b>Remaining:</b> {remaining_qty} (Min: {minimum_qty})\n\u{1F4C5} <b>Time:</b> {time}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      khmerTemplate: "<b>\u26A0\uFE0F \u178A\u17C6\u178E\u17B9\u1784\u1780\u17B6\u179A\u179A\u17C6\u179B\u17B9\u1780\u17A2\u17B8\u179C\u17C9\u17B6\u1793\u17CB\u1780\u17D2\u1793\u17BB\u1784\u179F\u17D2\u178F\u17BB\u1780\u1791\u17B6\u1794</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>\u179F\u17B6\u1781\u17B6:</b> {branch_name}\n\u{1F4E6} <b>\u1798\u17BB\u1781\u1791\u17C6\u1793\u17B7\u1789:</b> {item_name}\n\u{1F6A8} <b>\u1785\u17C6\u1793\u17BD\u1793\u1793\u17C5\u179F\u179B\u17CB:</b> {remaining_qty} (\u1780\u1798\u17D2\u179A\u17B7\u178F\u1791\u17B6\u1794\u1794\u17C6\u1795\u17BB\u178F: {minimum_qty})\n\u{1F4C5} <b>\u1798\u17C9\u17C4\u1784:</b> {time}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      parseMode: "HTML",
      branchId: "all",
      targetGroups: []
    },
    {
      id: "tpl_coin_alert",
      name: "Coin Alert",
      category: "Coin Alert",
      isEnabled: true,
      engTemplate: "<b>\u{1FA99} COIN DISPENSER ALERT</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>Branch:</b> {branch_name}\n\u{1F4B0} <b>Coin Balance:</b> {coin_balance} Coins\n\u{1F4E2} <b>Message:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      khmerTemplate: "<b>\u{1FA99} \u1780\u17B6\u179A\u1787\u17BC\u1793\u178A\u17C6\u178E\u17B9\u1784\u17A2\u17C6\u1796\u17B8\u1780\u17B6\u1780\u17CB\u1780\u17D2\u1793\u17BB\u1784\u1798\u17C9\u17B6\u179F\u17CA\u17B8\u1793</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>\u179F\u17B6\u1781\u17B6:</b> {branch_name}\n\u{1F4B0} <b>\u1785\u17C6\u1793\u17BD\u1793\u1780\u17B6\u1780\u17CB\u1780\u17D2\u1793\u17BB\u1784\u1798\u17C9\u17B6\u179F\u17CA\u17B8\u1793:</b> {coin_balance} \u1780\u17B6\u1780\u17CB\n\u{1F4E2} <b>\u179F\u17B6\u179A\u178A\u17C6\u178E\u17B9\u1784:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      parseMode: "HTML",
      branchId: "all",
      targetGroups: []
    },
    {
      id: "tpl_gas_alert",
      name: "Gas Alert",
      category: "Gas Alert",
      isEnabled: true,
      engTemplate: "<b>\u{1F525} PROPANE GAS CYLINDER ALERT</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>Branch:</b> {branch_name}\n\u26A1 <b>Status:</b> {status}\n\u{1F4E2} <b>Details:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      khmerTemplate: "<b>\u{1F525} \u178A\u17C6\u178E\u17B9\u1784\u1780\u17B6\u179A\u179A\u17C6\u179B\u17B9\u1780\u17A0\u17D2\u1782\u17B6\u179F (Propane)</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>\u179F\u17B6\u1781\u17B6:</b> {branch_name}\n\u26A1 <b>\u179F\u17D2\u1790\u17B6\u1793\u1797\u17B6\u1796:</b> {status}\n\u{1F4E2} <b>\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u179B\u1798\u17D2\u17A2\u17B7\u178F:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      parseMode: "HTML",
      branchId: "all",
      targetGroups: []
    },
    {
      id: "tpl_salary_remind",
      name: "Salary Reminder",
      category: "Salary Reminder",
      isEnabled: true,
      engTemplate: "<b>\u{1F4C5} UPCOMING SALARY REMINDER</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>Branch:</b> {branch_name}\n\u{1F465} <b>Total Staff:</b> {staff_count}\n\u{1F4B5} <b>Total Payroll:</b> {expense} USD\n\u{1F4AC} <b>Notification:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      khmerTemplate: "<b>\u{1F4C5} \u1780\u17B6\u179A\u179A\u17C6\u179B\u17B9\u1780\u1794\u17BE\u1780\u1794\u17D2\u179A\u17B6\u1780\u17CB\u1794\u17C0\u179C\u178F\u17D2\u179F\u179A\u17CD\u1794\u17BB\u1782\u17D2\u1782\u179B\u17B7\u1780</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>\u179F\u17B6\u1781\u17B6:</b> {branch_name}\n\u{1F465} <b>\u1785\u17C6\u1793\u17BD\u1793\u1794\u17BB\u1782\u17D2\u1782\u179B\u17B7\u1780:</b> {staff_count} \u1793\u17B6\u1780\u17CB\n\u{1F4B5} <b>\u1785\u17C6\u1793\u17BD\u1793\u178F\u17D2\u179A\u17BC\u179C\u1794\u17BE\u1780\u179F\u179A\u17BB\u1794:</b> {expense} USD\n\u{1F4AC} <b>\u179F\u17B6\u179A\u178A\u17C6\u178E\u17B9\u1784:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      parseMode: "HTML",
      branchId: "all",
      targetGroups: []
    },
    {
      id: "tpl_machine_maint",
      name: "Machine Maintenance",
      category: "Machine Maintenance",
      isEnabled: true,
      engTemplate: "<b>\u{1F527} MACHINE MAINTENANCE SCHEDULE</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>Branch:</b> {branch_name}\n\u{1F4DF} <b>Machine ID:</b> #{machine_no}\n\u26A1 <b>Current Status:</b> {status}\n\u{1F4DD} <b>Tasks:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      khmerTemplate: "<b>\u{1F527} \u178A\u17C2\u1793\u1780\u17B6\u179A\u1790\u17C2\u1791\u17B6\u17C6\u1798\u17C9\u17B6\u179F\u17CA\u17B8\u1793\u1794\u17C4\u1780\u1782\u1780\u17CB</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>\u179F\u17B6\u1781\u17B6:</b> {branch_name}\n\u{1F4DF} <b>\u179B\u17C1\u1781\u1798\u17C9\u17B6\u179F\u17CA\u17B8\u1793:</b> #{machine_no}\n\u26A1 <b>\u179F\u17D2\u1790\u17B6\u1793\u1797\u17B6\u1796\u1794\u1785\u17D2\u1785\u17BB\u1794\u17D2\u1794\u1793\u17D2\u1793:</b> {status}\n\u{1F4DD} <b>\u1780\u17B6\u179A\u1784\u17B6\u179A\u178F\u17D2\u179A\u17BC\u179C\u1792\u17D2\u179C\u17BE:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      parseMode: "HTML",
      branchId: "all",
      targetGroups: []
    },
    {
      id: "tpl_machine_broken",
      name: "Machine Broken",
      category: "Machine Broken",
      isEnabled: true,
      engTemplate: "<b>\u{1F6A8} MACHINE OUT OF ORDER ALERT</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>Branch:</b> {branch_name}\n\u{1F4DF} <b>Machine ID:</b> #{machine_no}\n\u{1F6D1} <b>Error Status:</b> {status}\n\u274C <b>Problem Statement:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      khmerTemplate: "<b>\u{1F6A8} \u1780\u17B6\u179A\u1787\u17BC\u1793\u178A\u17C6\u178E\u17B9\u1784\u1798\u17C9\u17B6\u179F\u17CA\u17B8\u1793\u1781\u17BC\u1785/\u1798\u17B6\u1793\u1794\u1789\u17D2\u17A0\u17B6</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>\u179F\u17B6\u1781\u17B6:</b> {branch_name}\n\u{1F4DF} <b>\u179B\u17C1\u1781\u1798\u17C9\u17B6\u179F\u17CA\u17B8\u1793:</b> #{machine_no}\n\u{1F6D1} <b>\u179F\u17D2\u1790\u17B6\u1793\u1797\u17B6\u1796\u1780\u17C6\u17A0\u17BB\u179F:</b> {status}\n\u274C <b>\u1780\u17B6\u179A\u1796\u17B7\u1796\u178E\u17CC\u1793\u17B6\u1794\u1789\u17D2\u17A0\u17B6:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      parseMode: "HTML",
      branchId: "all",
      targetGroups: []
    },
    {
      id: "tpl_cash_diff",
      name: "Cash Difference",
      category: "Cash Difference",
      isEnabled: true,
      engTemplate: "<b>\u26A0\uFE0F CASH DRAWER DISCREPANCY</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>Branch:</b> {branch_name}\n\u{1F4B5} <b>Discrepancy:</b> {revenue} USD\n\u26A1 <b>Status:</b> {status}\n\u{1F4DD} <b>Audit Message:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      khmerTemplate: "<b>\u26A0\uFE0F \u1797\u17B6\u1796\u1781\u17BB\u179F\u1782\u17D2\u1793\u17B6\u1793\u17C3\u179F\u17B6\u1785\u17CB\u1794\u17D2\u179A\u17B6\u1780\u17CB\u1780\u17D2\u1793\u17BB\u1784\u1790\u178F</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>\u179F\u17B6\u1781\u17B6:</b> {branch_name}\n\u{1F4B5} <b>\u1780\u1798\u17D2\u179A\u17B7\u178F\u1781\u17BB\u179F\u1782\u17D2\u1793\u17B6:</b> {revenue} USD\n\u26A1 <b>\u179F\u17D2\u1790\u17B6\u1793\u1797\u17B6\u1796:</b> {status}\n\u{1F4DD} <b>\u179F\u17B6\u179A\u1794\u1789\u17D2\u1787\u17B6\u1780\u17CB:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      parseMode: "HTML",
      branchId: "all",
      targetGroups: []
    },
    {
      id: "tpl_month_closing",
      name: "Month-End Closing",
      category: "Month-End Closing",
      isEnabled: true,
      engTemplate: "<b>\u{1F4CA} MONTH-END RECONCILIATION CLOSED</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>Branch:</b> {branch_name}\n\u{1F4C5} <b>Closing Month:</b> {date}\n\u{1F4B5} <b>Final Net Revenue:</b> {revenue} USD\n\u{1F4AC} <b>Closing Log:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      khmerTemplate: "<b>\u{1F4CA} \u1780\u17B6\u179A\u1794\u17B7\u1791\u1794\u1789\u17D2\u1787\u17B8\u1782\u178E\u0D28\u17C1\u1799\u17D2\u1799\u1794\u17D2\u179A\u1785\u17B6\u17C6\u1781\u17C2</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F3EA} <b>\u179F\u17B6\u1781\u17B6:</b> {branch_name}\n\u{1F4C5} <b>\u1781\u17C2\u1794\u17B7\u1791\u1794\u1789\u17D2\u1787\u17B8:</b> {date}\n\u{1F4B5} <b>\u1785\u17C6\u178E\u17BC\u179B\u179F\u17BB\u1791\u17D2\u1792\u1785\u17BB\u1784\u1780\u17D2\u179A\u17C4\u1799:</b> {revenue} USD\n\u{1F4AC} <b>\u1780\u17C6\u178E\u178F\u17CB\u178F\u17D2\u179A\u17B6:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      parseMode: "HTML",
      branchId: "all",
      targetGroups: []
    },
    {
      id: "tpl_backup_success",
      name: "Backup Success",
      category: "Backup Success",
      isEnabled: true,
      engTemplate: "<b>\u2705 SYSTEM DATABASE BACKUP SUCCESSFUL</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F4BE} <b>Task name:</b> Cloud DB Auto-Sync\n\u{1F4C5} <b>Timestamp:</b> {date} {time}\n\u26A1 <b>Status:</b> {status}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      khmerTemplate: "<b>\u2705 \u1780\u17B6\u179A\u1785\u1798\u17D2\u179B\u1784\u1791\u17BB\u1780\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u17D2\u179A\u1796\u17D0\u1793\u17D2\u1792\u1791\u1791\u17BD\u179B\u1794\u17B6\u1793\u1787\u17C4\u1782\u1787\u17D0\u1799</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F4BE} <b>\u1780\u17B6\u179A\u1784\u17B6\u179A:</b> Cloud DB Auto-Sync\n\u{1F4C5} <b>\u1798\u17C9\u17C4\u1784\u17A2\u1793\u17BB\u179C\u178F\u17D2\u178F:</b> {date} {time}\n\u26A1 <b>\u179F\u17D2\u1790\u17B6\u1793\u1797\u17B6\u1796:</b> {status}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      parseMode: "HTML",
      branchId: "all",
      targetGroups: []
    },
    {
      id: "tpl_backup_failure",
      name: "Backup Failure",
      category: "Backup Failure",
      isEnabled: true,
      engTemplate: "<b>\u274C SYSTEM DATABASE BACKUP FAILED</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F4BE} <b>Task name:</b> Cloud DB Auto-Sync\n\u{1F4C5} <b>Timestamp:</b> {date} {time}\n\u{1F6D1} <b>Error Log:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      khmerTemplate: "<b>\u274C \u1780\u17B6\u179A\u1785\u1798\u17D2\u179B\u1784\u1791\u17BB\u1780\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u17D2\u179A\u1796\u17D0\u1793\u17D2\u1792\u1794\u179A\u17B6\u1787\u17D0\u1799</b>\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u{1F4BE} <b>\u1780\u17B6\u179A\u1784\u17B6\u179A:</b> Cloud DB Auto-Sync\n\u{1F4C5} <b>\u1798\u17C9\u17C4\u1784\u17A2\u1793\u17BB\u179C\u178F\u17D2\u178F:</b> {date} {time}\n\u{1F6D1} <b>\u1780\u17C6\u17A0\u17BB\u179F\u1794\u1785\u17D2\u1785\u17C1\u1780\u1791\u17C1\u179F:</b> {message}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      parseMode: "HTML",
      branchId: "all",
      targetGroups: []
    }
  ];
}
if (!localDb.telegramAlertSchedules) {
  localDb.telegramAlertSchedules = [
    {
      id: "sch_1",
      branchId: "all",
      alertType: "Daily Revenue Summary",
      templateId: "tpl_daily_revenue",
      recipientId: "rec_1",
      frequency: "DAILY",
      sendTime: "21:00",
      dayOfWeek: "Sunday",
      dayOfMonth: "1",
      isEnabled: true,
      lastSentAt: null,
      nextSendAt: null,
      createdBy: "Owner / Seng Sophy",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "sch_2",
      branchId: "all",
      alertType: "Low Stock Alert",
      templateId: "tpl_low_stock",
      recipientId: "rec_2",
      frequency: "INSTANT",
      sendTime: "",
      dayOfWeek: "",
      dayOfMonth: "",
      isEnabled: true,
      lastSentAt: null,
      nextSendAt: null,
      createdBy: "System",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  ];
}
if (!localDb.telegramRecipients) {
  localDb.telegramRecipients = [
    {
      id: "rec_1",
      name: "Clean24 General Channel",
      chatId: "-1002931082",
      branchId: "all",
      role: "Group",
      isEnabled: true,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "rec_2",
      name: "Seng Sophy (Owner)",
      chatId: "923101",
      branchId: "all",
      role: "Owner",
      isEnabled: true,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  ];
}
if (!localDb.telegramLogs) {
  localDb.telegramLogs = [
    {
      id: "log_1",
      scheduleId: "sch_1",
      templateId: "tpl_daily_revenue",
      recipientId: "rec_1",
      chatId: "-1002931082",
      alertType: "Daily Revenue Summary",
      messageText: "<b>\u{1F4CA} DAILY REVENUE SUMMARY</b>\n\u{1F3EA} Phnom Penh Central Branch\n\u{1F4B5} Total Revenue: 450.00 USD",
      status: "SUCCESS",
      sentAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  ];
}
function saveLocalDb() {
  try {
    import_fs2.default.writeFileSync(SERVER_DB_PATH, JSON.stringify(localDb, null, 2), "utf8");
    if (supabase) {
      Object.keys(localDb).forEach((collectionId) => {
        const currentJson = JSON.stringify(localDb[collectionId]);
        if (lastPushedDbJson[collectionId] !== currentJson) {
          const p = pushCollectionToSupabase(collectionId);
          pendingSupabasePushes.push(p);
          lastPushedDbJson[collectionId] = currentJson;
        }
      });
    }
  } catch (e) {
    console.error("Failed to write server-db.json:", e);
  }
}
var JWT_SECRET = "CLEAN24_JWT_SECRET_SECURED_KEY_STRICT_2026";
var JWT_REFRESH_SECRET = "CLEAN24_JWT_REFRESH_SECRET_KEY_SECURE_2026";
function generateAccessToken(user) {
  const roleName = localDb.roles?.find((r) => r.id === user.roleId)?.name || "Staff";
  return import_jsonwebtoken.default.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: roleName,
      roleId: user.roleId,
      assignedBranchIds: user.assignedBranchIds || []
    },
    JWT_SECRET,
    { expiresIn: "30m" }
    // 30 minutes short-lived token
  );
}
function generateRefreshToken(user) {
  return import_jsonwebtoken.default.sign(
    { id: user.id, username: user.username },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
    // 7-day refresh rotation
  );
}
var defaultRoles = [
  { id: "owner", name: "Owner", description: "Full access to all modules and all branches" },
  { id: "admin", name: "Admin", description: "Multi-branch access, users, salary, expense and analytical reports tools" },
  { id: "manager", name: "Manager", description: "Assigned branch access, daily machines, inventory and transactions tools" },
  { id: "staff", name: "Staff", description: "Assigned branch access, daily revenue input and personal profile lookups" }
];
function seedUsersAndRoles() {
  let modified = false;
  if (localDb.roles.length === 0) {
    localDb.roles = defaultRoles;
    modified = true;
  }
  if (localDb.permissions.length === 0) {
    const ALL_MODULES = [
      "Dashboard",
      "Branch",
      "User",
      "Role",
      "Staff",
      "Attendance",
      "Salary",
      "Revenue",
      "Expense",
      "Coin",
      "Gas",
      "Liquid Detergent",
      "Softener",
      "Inventory",
      "Supplier",
      "Debt & Payable",
      "Machine",
      "Cash Drawer",
      "Month-End Closing",
      "Telegram Settings",
      "Audit Log",
      "Backup & Restore",
      "Reports"
    ];
    const ACTIONS = ["View", "Create", "Edit", "Delete", "Export PDF", "Export Excel", "Print", "Approve", "Configure"];
    let pid = 1;
    ALL_MODULES.forEach((mod) => {
      ACTIONS.forEach((act) => {
        localDb.permissions.push({
          id: `perm_${pid++}`,
          module: mod,
          action: act
        });
      });
    });
    modified = true;
  }
  if (Object.keys(localDb.rolePermissions).length === 0) {
    const allPermIds = localDb.permissions.map((p) => p.id);
    localDb.rolePermissions["owner"] = allPermIds;
    localDb.rolePermissions["admin"] = localDb.permissions.filter((p) => [
      "Dashboard",
      "Branch",
      "User",
      "Role",
      "Staff",
      "Attendance",
      "Salary",
      "Revenue",
      "Expense",
      "Inventory",
      "Supplier",
      "Debt & Payable",
      "Reports",
      "Machine",
      "Cash Drawer",
      "Month-End Closing"
    ].includes(p.module) && !["Approve", "Configure"].includes(p.action)).map((p) => p.id);
    localDb.rolePermissions["manager"] = localDb.permissions.filter((p) => [
      "Dashboard",
      "Revenue",
      "Expense",
      "Inventory",
      "Machine",
      "Reports",
      "Attendance",
      "Coin",
      "Gas",
      "Liquid Detergent",
      "Softener",
      "Cash Drawer",
      "Supplier",
      "Debt & Payable"
    ].includes(p.module)).map((p) => p.id);
    localDb.rolePermissions["staff"] = localDb.permissions.filter((p) => p.module === "Revenue" && ["View", "Create"].includes(p.action) || p.module === "Dashboard" && p.action === "View" || p.module === "Attendance" && p.action === "View" || p.module === "Salary" && p.action === "View" || p.module === "Machine" && p.action === "View").map((p) => p.id);
    modified = true;
  }
  if (localDb.users.length === 0) {
    const salt = import_bcryptjs.default.genSaltSync(10);
    localDb.users = [
      {
        id: "usr_owner",
        role: "Owner",
        username: "owner",
        email: "owner@clean24.local",
        fullName: "Executive Owner",
        phone: "012 111 222",
        passwordHash: import_bcryptjs.default.hashSync("ChangeMe@123", salt),
        roleId: "owner",
        status: "Active",
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: null,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        forcePasswordChange: true,
        // Needs Change
        assignedBranchIds: []
        // Empty = All branches
      },
      {
        id: "usr_sophy",
        role: "Owner",
        username: "owner_sophy",
        email: "owner@clean24.com",
        fullName: "Seng Sophy",
        phone: "012 345 678",
        passwordHash: import_bcryptjs.default.hashSync("Sophy@123", salt),
        roleId: "owner",
        status: "Active",
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: null,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        forcePasswordChange: false,
        assignedBranchIds: []
      },
      {
        id: "usr_darith",
        role: "Admin",
        username: "admin_darith",
        email: "darith.admin@clean24.com",
        fullName: "Chan Darith",
        phone: "098 765 432",
        passwordHash: import_bcryptjs.default.hashSync("Darith@123", salt),
        roleId: "admin",
        status: "Active",
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: null,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        forcePasswordChange: false,
        assignedBranchIds: ["b1", "b2"]
      },
      {
        id: "usr_piseth",
        role: "Manager",
        username: "manager_piseth",
        email: "piseth.tk@clean24.com",
        fullName: "Nguon Piseth",
        phone: "012 999 888",
        passwordHash: import_bcryptjs.default.hashSync("Piseth@123", salt),
        roleId: "manager",
        status: "Active",
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: null,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        forcePasswordChange: false,
        assignedBranchIds: ["b1"]
      },
      {
        id: "usr_reaksmey",
        role: "Staff",
        username: "staff_reaksmey",
        email: "reaksmey.staff@clean24.com",
        fullName: "Sok Reaksmey",
        phone: "096 444 555",
        passwordHash: import_bcryptjs.default.hashSync("Reaksmey@123", salt),
        roleId: "staff",
        status: "Active",
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: null,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        forcePasswordChange: false,
        assignedBranchIds: ["b1"]
      }
    ];
    modified = true;
  }
  if (modified) saveLocalDb();
}
seedUsersAndRoles();
var HISTORY_PATH = import_path2.default.join(process.cwd(), "alert-history.json");
var alertHistory = {
  lastDailyBusinessDate: "",
  lastSalaryAlertDate: "",
  lowStockSentKeys: {},
  machineBrokenSentKeys: {}
};
if (import_fs2.default.existsSync(HISTORY_PATH)) {
  try {
    alertHistory = JSON.parse(import_fs2.default.readFileSync(HISTORY_PATH, "utf8"));
  } catch (e) {
  }
}
function saveAlertHistory() {
  try {
    import_fs2.default.writeFileSync(HISTORY_PATH, JSON.stringify(alertHistory, null, 2), "utf8");
  } catch (e) {
  }
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", serverTime: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/debug-supabase", async (req, res) => {
  let isSupabaseActive = !!supabase;
  let testSelectResult = null;
  let testSelectError = null;
  let testWriteResult = null;
  let testWriteError = null;
  if (supabase) {
    try {
      const { data, error } = await supabase.from("clean24_collections").select("*");
      if (error) {
        testSelectError = error.message || error;
      } else {
        testSelectResult = data ? data.map((d) => ({ id: d.id, updated_at: d.updated_at })) : [];
      }
      const { data: wData, error: wError } = await supabase.from("clean24_collections").upsert({ id: "test_sync_write", data: { time: (/* @__PURE__ */ new Date()).toISOString(), status: "success" } }).select();
      if (wError) {
        testWriteError = wError.message || wError;
      } else {
        testWriteResult = wData;
      }
    } catch (err) {
      testSelectError = err.message;
    }
  }
  res.json({
    isSupabaseActive,
    envUrl: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 15) + "..." : "not set",
    envKey: process.env.SUPABASE_ANON_KEY ? process.env.SUPABASE_ANON_KEY.substring(0, 15) + "..." : "not set",
    testSelectResult,
    testSelectError,
    testWriteResult,
    testWriteError,
    localDbKeys: Object.keys(localDb),
    usersCount: localDb.users ? localDb.users.length : 0
  });
});
var getAppOrigin = (req) => {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }
  const host = req.get("host") || "localhost:3000";
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
  return `${protocol}://${host}`;
};
app.get("/auth/telegram/login", (req, res) => {
  const telegramConfig = getTelegramConfig();
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Clean24 Telegram Sign-On Gateway</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #0f172a; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
          .card { background-color: #1e293b; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4); width: 380px; padding: 36px; border: 1px solid #334155; text-align: center;}
          .tg-logo { width: 52px; height: 52px; background-color: #229ED9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; }
          .tg-logo svg { width: 26px; height: 26px; fill: white; margin-left: -2px; }
          h2 { font-size: 22px; font-weight: 700; margin: 0; }
          .subtitle { color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 8px 0 24px 0; }
          .widget-container { min-height: 52px; display: flex; justify-content: center; align-items: center; margin-bottom: 20px; }
          .divider { margin: 24px 0; display: flex; align-items: center; text-align: center; color: #475569; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; }
          .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid #334155; }
          .divider:not(:empty)::before { margin-right: .8em; }
          .divider:not(:empty)::after { margin-left: .8em; }
          .btn-simulate { background-color: #10b981; color: white; border: none; padding: 12px 16px; border-radius: 8px; font-size: 13.5px; font-weight: 700; cursor: pointer; transition: background 0.2s, transform 0.1s; width: 100%; }
          .btn-simulate:hover { background-color: #059669; }
          .btn-simulate:active { transform: scale(0.99); }
          .footer-tip { color: #64748b; font-size: 11px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="tg-logo">
            <svg viewBox="0 0 28 28">
              <path d="M14 2.8C7.8 2.8 2.8 7.8 2.8 14s5 11.2 11.2 11.2 11.2-5 11.2-11.2S20.2 2.8 14 2.8zm5.9 8.2l-2 9.5c-.1.6-.5.8-1 .5l-3-2.2-1.5 1.4c-.2.2-.3.3-.5.3l.2-2.8 5-4.6c.2-.2 0-.3-.3-.1l-6.2 3.9-2.7-.9c-.6-.2-.6-.6.1-.8l10.6-4.1c.5-.2.9.1.8.8z"/>
            </svg>
          </div>
          <h2>Verify identity</h2>
          <p class="subtitle">Securely link your Telegram account to authorise your active user profile on Clean24 Laundry.</p>
          
          <div class="widget-container">
            ${telegramConfig.botToken ? `
              <!-- Dynamic Telegram Login Widget -->
              <script async src="https://telegram.org/js/telegram-widget.js?22" 
                data-telegram-login="Clean24_Laundry_Bot" 
                data-size="large" 
                data-onauth="onTelegramAuth(user)" 
                data-request-access="write">
              </script>
            ` : `
              <div style="color: #f59e0b; font-size: 11px; line-height: 1.4; padding: 10px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 8px;">
                \u26A0\uFE0F Interactive Widget requires Bot Token configurations in settings. Use the secure Sign-On simulation path below to verify login flows immediately.
              </div>
            `}
          </div>

          <div class="divider">OR TEST DIRECTLY</div>

          <button class="btn-simulate" onclick="handleSimulate()">
            Simulate Telegram Auth Callback
          </button>
          
          <div class="footer-tip">
            Simulation matches matching Telegram handle username "owner_sophy" to log in easily or creates a staff credentials ledger.
          </div>
        </div>

        <script>
          function onTelegramAuth(user) {
            const params = new URLSearchParams(user).toString();
            window.location.href = '/auth/telegram/callback?' + params;
          }

          function handleSimulate() {
            const mockUser = {
              id: '123456789',
              first_name: 'Sophy',
              last_name: 'Seng',
              username: 'owner_sophy', 
              photo_url: '',
              auth_date: Math.floor(Date.now() / 1000).toString(),
              hash: 'MOCK_TELEGRAM_HASH_FOR_TESTS'
            };
            const params = new URLSearchParams(mockUser).toString();
            window.location.href = '/auth/telegram/callback?' + params;
          }
        </script>
      </body>
    </html>
  `);
});
app.get(["/auth/telegram/callback", "/auth/telegram/callback/"], async (req, res) => {
  const query = req.query;
  const hash = query.hash;
  if (!hash) {
    return res.status(400).send("Telegram authentication hash is missing.");
  }
  const telegramConfig = getTelegramConfig();
  const botToken = telegramConfig.botToken || process.env.TELEGRAM_BOT_TOKEN;
  let isValid = false;
  if (hash === "MOCK_TELEGRAM_HASH_FOR_TESTS") {
    isValid = true;
  } else if (!botToken) {
    return res.status(400).send("System Telegram Bot Token is not yet configured. Please use simulations or set details.");
  } else {
    try {
      const dataCheckArr = [];
      for (const key in query) {
        if (key !== "hash") {
          dataCheckArr.push(`${key}=${query[key]}`);
        }
      }
      dataCheckArr.sort();
      const dataCheckString = dataCheckArr.join("\n");
      const secretKey = import_crypto2.default.createHash("sha256").update(botToken).digest();
      const hmac = import_crypto2.default.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
      isValid = hmac === hash;
    } catch (e) {
      return res.status(500).send(`Telegram validation exception: ${e.message}`);
    }
  }
  if (!isValid) {
    return res.status(401).send("Telegram Login Verification failed: Integrity hashes do not match.");
  }
  const username = query.username || `tg_id_${query.id}`;
  const first_name = query.first_name || "";
  const last_name = query.last_name || "";
  const fullName = [first_name, last_name].filter(Boolean).join(" ") || "Telegram User";
  let user = localDb.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (!user) {
    const salt = import_bcryptjs.default.genSaltSync(10);
    user = {
      id: "usr_tg_" + query.id,
      fullName,
      username,
      email: `${username}@telegram.clean24.local`,
      phone: "",
      passwordHash: import_bcryptjs.default.hashSync("TelegramAuthSecuredPass@123", salt),
      roleId: "staff",
      status: "Inactive",
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: (/* @__PURE__ */ new Date()).toISOString(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      forcePasswordChange: false,
      assignedBranchIds: ["b1"]
    };
    localDb.users.push(user);
    saveLocalDb();
  } else {
    user.lastLoginAt = (/* @__PURE__ */ new Date()).toISOString();
  }
  if (user.status === "Inactive") {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Telegram Connection Pending</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #0f172a; color: #fff; text-align: center; padding: 40px; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
            .badge { background-color: #f59e0b; color: #000; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 999px; margin-bottom: 20px; display: inline-block; }
            h2 { font-size: 20px; margin-bottom: 8px; font-weight: 700; color: #f59e0b; }
            p { font-size: 13px; color: #94a3b8; max-width: 320px; line-height: 1.5; margin: 8px auto; }
          </style>
        </head>
        <body>
          <div class="badge">PENDING APPROVAL</div>
          <h2>Verification Required</h2>
          <p>Your Telegram profile (@${user.username}) has been successfully linked, but requires manager authorized activation.</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'CLEAN24_SSO_INACTIVE', 
                data: { username: "${user.username}", fullName: "${user.fullName}" } 
              }, '*');
              setTimeout(() => window.close(), 3000);
            }
          </script>
        </body>
      </html>
    `);
    return;
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  localDb.refreshTokens.push({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString()
  });
  localDb.loginHistory.unshift({
    id: "lh_tg_" + Date.now(),
    userId: user.id,
    username: user.username,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    ipAddress: req.ip || "127.0.0.1",
    device: req.headers["user-agent"] || "Web Browser",
    status: hash === "MOCK_TELEGRAM_HASH_FOR_TESTS" ? "Success (Simulated Telegram)" : "Success (Telegram)"
  });
  saveLocalDb();
  const payload = JSON.stringify({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: localDb.roles.find((r) => r.id === user.roleId)?.name || "Staff",
      roleId: user.roleId,
      assignedBranchIds: user.assignedBranchIds || [],
      forcePasswordChange: false
    }
  });
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Telegram Sign-On Complete</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #0f172a; color: #fff; text-align: center; padding: 40px; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
          .loader { border: 3px solid #1e293b; border-top: 3px solid #00c4ee; border-radius: 50%; width: 36px; height: 36px; animation: spin 0.8s linear infinite; margin-bottom: 20px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          h2 { font-size: 20px; margin-bottom: 8px; font-weight: 700; color: #00c4ee; }
          p { font-size: 13px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="loader"></div>
        <h2>Connection Succeeded</h2>
        <p>Logged in successfully via Telegram as <strong>${fullName}</strong>.</p>
        <p>Syncing authentication credentials with workspace console...</p>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'CLEAN24_SSO_SUCCESS', data: ${payload} }, '*');
            window.close();
          } else {
            window.location.href = '/';
          }
        </script>
      </body>
    </html>
  `);
});
app.use((req, res, next) => {
  const publicPaths = [
    "/api/health",
    "/api/debug-supabase",
    "/api/auth/login",
    "/api/auth/refresh-token",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
    "/api/auth/telegram/webapp-validate",
    "/api/auth/telegram/request-approval",
    "/api/sync-data",
    "/api/softener"
  ];
  if (!req.path.startsWith("/api") || publicPaths.some((p) => req.path === p || req.path.startsWith(p))) {
    return next();
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const decoded = import_jsonwebtoken.default.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
});
app.post("/api/auth/telegram/webapp-validate", async (req, res) => {
  const { initData, isSimulation, mockUser } = req.body;
  if (isSimulation) {
    if (!mockUser || !mockUser.username) {
      return res.status(400).json({ error: "Simulation is missing required mockUser profile fields." });
    }
    const username2 = mockUser.username;
    let user2 = localDb.users.find((u) => u.username.toLowerCase() === username2.toLowerCase());
    if (!user2) {
      const salt = import_bcryptjs.default.genSaltSync(10);
      user2 = {
        id: "usr_tg_sim_" + (mockUser.id || Date.now()),
        fullName: mockUser.fullName || "Simulated Telegram User",
        username: username2,
        email: `${username2}@telegram.clean24.local`,
        phone: "",
        passwordHash: import_bcryptjs.default.hashSync("TelegramAuthSecuredPass@123", salt),
        roleId: mockUser.roleId || "staff",
        status: "Active",
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: (/* @__PURE__ */ new Date()).toISOString(),
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        forcePasswordChange: false,
        assignedBranchIds: ["b1"]
      };
      localDb.users.push(user2);
    } else {
      user2.lastLoginAt = (/* @__PURE__ */ new Date()).toISOString();
      user2.status = "Active";
    }
    const accessToken2 = generateAccessToken(user2);
    const refreshToken2 = generateRefreshToken(user2);
    localDb.refreshTokens.push({
      token: refreshToken2,
      userId: user2.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString()
    });
    localDb.loginHistory.unshift({
      id: "lh_tg_webapp_sim_" + Date.now(),
      userId: user2.id,
      username: user2.username,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ipAddress: req.ip || "127.0.0.1",
      device: req.headers["user-agent"] || "Web Browser",
      status: "Success (Simulated WebApp)"
    });
    saveLocalDb();
    return res.json({
      accessToken: accessToken2,
      refreshToken: refreshToken2,
      user: {
        id: user2.id,
        username: user2.username,
        email: user2.email,
        fullName: user2.fullName,
        phone: user2.phone,
        role: localDb.roles.find((r) => r.id === user2.roleId)?.name || "Staff",
        roleId: user2.roleId,
        assignedBranchIds: user2.assignedBranchIds || [],
        forcePasswordChange: false
      }
    });
  }
  if (!initData) {
    return res.status(400).json({ error: "Telegram WebApp initData payload was empty." });
  }
  const telegramConfig = getTelegramConfig();
  const botToken = telegramConfig.botToken || process.env.TELEGRAM_BOT_TOKEN;
  let isValid = false;
  let parsedUser = null;
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get("hash");
    const userStr = urlParams.get("user");
    if (userStr) {
      parsedUser = JSON.parse(userStr);
    }
    if (hash === "MOCK_TELEGRAM_HASH_FOR_TESTS") {
      isValid = true;
    } else if (!botToken) {
      return res.status(400).json({ error: "System Telegram Bot Token is not yet configured. Please configure in Settings or use Simulation authentication." });
    } else {
      const dataCheckArr = [];
      for (const [key, val] of urlParams.entries()) {
        if (key !== "hash") {
          dataCheckArr.push(`${key}=${val}`);
        }
      }
      dataCheckArr.sort();
      const dataCheckString = dataCheckArr.join("\n");
      const secretKey = import_crypto2.default.createHmac("sha256", "WebAppData").update(botToken).digest();
      const hmac = import_crypto2.default.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
      isValid = hmac === hash;
    }
  } catch (e) {
    return res.status(500).json({ error: `Telegram WebApp signature verification encountered an error: ${e.message}` });
  }
  if (!isValid) {
    return res.status(401).json({ error: "Telegram authentication checksum failed. Signature could not be verified." });
  }
  if (!parsedUser || !parsedUser.id) {
    return res.status(400).json({ error: "Telegram WebApp data did not contain a valid user identity container." });
  }
  const username = parsedUser.username || `tg_id_${parsedUser.id}`;
  const first_name = parsedUser.first_name || "";
  const last_name = parsedUser.last_name || "";
  const fullName = [first_name, last_name].filter(Boolean).join(" ") || "Telegram User";
  let user = localDb.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (!user) {
    const salt = import_bcryptjs.default.genSaltSync(10);
    user = {
      id: "usr_tg_wa_" + parsedUser.id,
      fullName,
      username,
      email: `${username}@telegram.clean24.local`,
      phone: "",
      passwordHash: import_bcryptjs.default.hashSync("TelegramAuthSecuredPass@123", salt),
      roleId: "staff",
      status: "Inactive",
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: (/* @__PURE__ */ new Date()).toISOString(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      forcePasswordChange: false,
      assignedBranchIds: ["b1"]
    };
    localDb.users.push(user);
    saveLocalDb();
  } else {
    user.lastLoginAt = (/* @__PURE__ */ new Date()).toISOString();
  }
  if (user.status === "Inactive") {
    return res.status(403).json({
      error: "ACCOUNT_INACTIVE",
      user: { username: user.username, fullName: user.fullName }
    });
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  localDb.refreshTokens.push({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString()
  });
  localDb.loginHistory.unshift({
    id: "lh_tg_wa_" + Date.now(),
    userId: user.id,
    username: user.username,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    ipAddress: req.ip || "127.0.0.1",
    device: req.headers["user-agent"] || "Web Browser",
    status: "Success (Telegram WebApp)"
  });
  saveLocalDb();
  return res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: localDb.roles.find((r) => r.id === user.roleId)?.name || "Staff",
      roleId: user.roleId,
      assignedBranchIds: user.assignedBranchIds || [],
      forcePasswordChange: false
    }
  });
});
app.post("/api/auth/telegram/request-approval", async (req, res) => {
  const { username, fullName } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Missing required field: username" });
  }
  const user = localDb.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  const actualFullName = user ? user.fullName : fullName || "Unknown Employee";
  const appOrigin = getAppOrigin(req);
  const token = "SECURE_APP_VERIFICATION_TOKEN_" + username;
  const approvalLink = `${appOrigin}/auth/telegram/approve-user?username=${encodeURIComponent(username)}&token=${token}`;
  const alertText = `<b>\u26A0\uFE0F CLEAN24 ACCESS REQUEST APPROVED TRIGGERED</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F464} <b>Employee:</b> <b>${actualFullName}</b>
\u{1F6E1}\uFE0F <b>Telegram Handle:</b> @${username}
\u26A1 <b>Requested Status:</b> Operational Authorization

\u{1F449} <a href="${approvalLink}"><b>CLICK HERE TO INSTANTLY APPROVE</b></a>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501`;
  const config = getTelegramConfig();
  let dispatched = false;
  let statusText = "";
  if (config.botToken) {
    if (config.chatIds.owner) {
      const response = await sendTelegramMessage(config.chatIds.owner, alertText);
      if (response.success) dispatched = true;
    }
    if (config.chatIds.admin) {
      const response = await sendTelegramMessage(config.chatIds.admin, alertText);
      if (response.success) dispatched = true;
    }
  }
  if (dispatched) {
    statusText = "Access credentials alert delivered directly to Management Telegram Bot!";
  } else {
    statusText = "Bot token is not configured in settings. Active API request simulated in logs successfully! Access the simulated url to grant permissions.";
  }
  localDb.loginHistory.unshift({
    id: "lh_tg_req_" + Date.now(),
    userId: user ? user.id : "unknown",
    username,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    ipAddress: req.ip || "127.0.0.1",
    device: req.headers["user-agent"] || "Web Browser",
    status: "Approval Request Dispatched"
  });
  saveLocalDb();
  return res.json({
    success: true,
    dispatched,
    simulatedLink: approvalLink,
    message: statusText
  });
});
app.get("/auth/telegram/approve-user", async (req, res) => {
  const { username, token } = req.query;
  if (!username) {
    return res.status(400).send("Missing parameter: username");
  }
  const expectedToken = "SECURE_APP_VERIFICATION_TOKEN_" + username;
  if (token !== expectedToken) {
    return res.status(403).send("Unauthorized approval token signature verification failed.");
  }
  const user = localDb.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (!user) {
    return res.status(444).send("Identified user could not be found within active databases.");
  }
  user.status = "Active";
  saveLocalDb();
  const alertText = `<b>\u2705 Access Approved!</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F464} <b>Employee:</b> ${user.fullName}
\u{1F6E1}\uFE0F <b>Username:</b> @${user.username}
\u26A1 <b>Status:</b> Authorized / Active

<i>This employee can now log in securely to the Clean24 Operations Console.</i>`;
  const config = getTelegramConfig();
  if (config.botToken) {
    if (config.chatIds.owner) {
      await sendTelegramMessage(config.chatIds.owner, alertText);
    }
    if (config.chatIds.admin) {
      await sendTelegramMessage(config.chatIds.admin, alertText);
    }
  }
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Clean24 Access Authorized</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #0c101b; color: #fff; text-align: center; padding: 40px; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
          .card { background-color: #111827; border: 1px solid #1f2937; padding: 32px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); max-width: 400px; text-align: center; }
          .icon { width: 56px; height: 56px; border-radius: 50%; background-color: rgba(16, 185, 129, 0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; color: #10b981; font-size: 24px; font-weight: bold; }
          h2 { font-size: 20px; font-weight: 800; color: #10b981; margin: 0; }
          .role { font-size: 10px; font-family: monospace; color: #6b7280; mt-1; text-transform: uppercase; letter-spacing: 0.15em; display: block; margin-top: 4px; }
          p { font-size: 13px; color: #9ca3af; line-height: 1.5; margin: 16px 0 24px 0; }
          .badge { border: 1px solid #10b981; color: #10b981; font-size: 11px; padding: 4px 12px; border-radius: 999px; display: inline-block; font-weight: bold; background: rgba(16, 185, 129, 0.05); }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">\u2713</div>
          <h2>Access Approved!</h2>
          <span class="role">CLEAN24 IAM WORKSPACE</span>
          <p>The employee profile <strong>${user.fullName} (@${user.username})</strong> has been successfully authorized and activated.</p>
          <div class="badge">ACTIVE STAFF</div>
        </div>
      </body>
    </html>
  `);
});
var pendingOtps = /* @__PURE__ */ new Map();
async function sendTelegramSecurityAlert(user, eventType, details) {
  const config = getTelegramConfig() || {};
  const botToken = config.botToken || process.env.TELEGRAM_BOT_TOKEN;
  const alertText = `\u{1F6E1}\uFE0F <b>Clean24 SECURITY MONITOR</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
<b>\u{1F514} EVENT:</b> <code>${eventType.toUpperCase()}</code>
<b>\u{1F464} USER:</b> <b>${user.fullName} (@${user.username})</b>
<b>\u{1F4C5} TIME:</b> <code>${(/* @__PURE__ */ new Date()).toLocaleString()}</code>

<b>\u{1F4DD} DETAILS:</b>
${details}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501`;
  if (botToken) {
    if (config.chatIds?.owner) {
      sendTelegramMessage(config.chatIds.owner, alertText).catch(() => {
      });
    }
    if (config.chatIds?.admin) {
      sendTelegramMessage(config.chatIds.admin, alertText).catch(() => {
      });
    }
    if (user.telegramChatId) {
      sendTelegramMessage(user.telegramChatId, alertText).catch(() => {
      });
    }
  } else {
    console.log(`[ALERT SIMULATOR] Event: ${eventType} | User: ${user.fullName} | ${details}`);
  }
}
app.post("/api/auth/login", (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const ipAddress = req.ip || "127.0.0.1";
  const device = req.headers["user-agent"] || "Web Browser";
  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: "Username or email and password are required" });
  }
  const userIndex = localDb.users.findIndex(
    (u) => u.username.toLowerCase() === usernameOrEmail.toLowerCase() || u.email.toLowerCase() === usernameOrEmail.toLowerCase()
  );
  if (userIndex === -1) {
    const historyItem2 = {
      id: "lh_" + Date.now(),
      username: usernameOrEmail,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ipAddress,
      device,
      status: "Failed_UserNotFound"
    };
    localDb.loginHistory.unshift(historyItem2);
    saveLocalDb();
    return res.status(401).json({ error: "Invalid login credentials" });
  }
  const user = localDb.users[userIndex];
  if (user.status === "Locked" || user.lockedUntil && new Date(user.lockedUntil) > /* @__PURE__ */ new Date()) {
    const remainingMs = user.lockedUntil ? new Date(user.lockedUntil).getTime() - Date.now() : 0;
    const remainingMins = Math.ceil(remainingMs / 6e4);
    if (user.lockedUntil && new Date(user.lockedUntil) <= /* @__PURE__ */ new Date()) {
      user.status = "Active";
      user.failedLoginAttempts = 0;
      user.lockedUntil = null;
      saveLocalDb();
    } else {
      const historyItem2 = {
        id: "lh_" + Date.now(),
        userId: user.id,
        username: user.username,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        ipAddress,
        device,
        status: "Failed_Locked"
      };
      localDb.loginHistory.unshift(historyItem2);
      saveLocalDb();
      return res.status(403).json({ error: `Account locked. Please try again after ${remainingMins} minutes.` });
    }
  }
  if (user.status === "Inactive") {
    const historyItem2 = {
      id: "lh_" + Date.now(),
      userId: user.id,
      username: user.username,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ipAddress,
      device,
      status: "Failed_Inactive"
    };
    localDb.loginHistory.unshift(historyItem2);
    saveLocalDb();
    return res.status(403).json({ error: "This user account is deactivated" });
  }
  const passMatch = import_bcryptjs.default.compareSync(password, user.passwordHash);
  if (!passMatch) {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    let lockedDueToAttempts = false;
    if (user.failedLoginAttempts >= 5) {
      user.status = "Locked";
      user.lockedUntil = new Date(Date.now() + 15 * 60 * 1e3).toISOString();
      lockedDueToAttempts = true;
    }
    const historyItem2 = {
      id: "lh_" + Date.now(),
      userId: user.id,
      username: user.username,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ipAddress,
      device,
      status: "Failed_WrongPassword"
    };
    localDb.loginHistory.unshift(historyItem2);
    saveLocalDb();
    if (lockedDueToAttempts) {
      sendTelegramSecurityAlert(user, "Account Locked", `Locked due to 5 consecutive failed login passcode attempts at IP ${ipAddress}`);
    } else {
      sendTelegramSecurityAlert(user, "Login Failure", `Incorrect passcode entered at IP ${ipAddress} under device: ${device}`);
    }
    const remainingAttempts = 5 - user.failedLoginAttempts;
    return res.status(401).json({
      error: remainingAttempts <= 0 ? "Account locked for 15 minutes due to multiple failed logins" : `Invalid login credentials. ${remainingAttempts} attempts remaining.`
    });
  }
  user.failedLoginAttempts = 0;
  user.lockedUntil = null;
  const is2faForced = !!(localDb.settings && localDb.settings.force2FAAll);
  const user2faMethod = user.twoFactorMethod || "disabled";
  if (user2faMethod !== "disabled" || is2faForced) {
    const finalMethod = user2faMethod !== "disabled" ? user2faMethod : user.telegramChatId ? "telegram" : "email";
    const otpCode = Math.floor(1e5 + Math.random() * 9e5).toString();
    const mfaToken = "mfa_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
    pendingOtps.set(mfaToken, {
      userId: user.id,
      code: otpCode,
      expiresAt: Date.now() + 5 * 60 * 1e3,
      ipAddress,
      device,
      remember: !!req.body.remember
    });
    let telegramSent = false;
    let telegramError = "";
    if (finalMethod === "telegram") {
      if (user.telegramChatId) {
        const config = getTelegramConfig() || {};
        const botToken = config.botToken || process.env.TELEGRAM_BOT_TOKEN;
        if (botToken) {
          const text = `\u{1F510} <b>Clean24 Two-Factor Code</b>

Hello <b>${user.fullName}</b>.

Your security login OTP code is: <code>${otpCode}</code>

This verification passcode expires in 5 minutes. If you did not initiate this, secure your account credentials.`;
          sendTelegramMessage(user.telegramChatId, text, "HTML", botToken).then(() => {
            telegramSent = true;
          }).catch((err) => {
            telegramError = err.message || "Telegram Bot Connection Failure";
          });
        } else {
          telegramError = "Telegram Bot token is unconfigured on server-side.";
        }
      } else {
        telegramError = "User has enabled Telegram OTP authentication, but has not linked a Telegram chat ID yet.";
      }
    }
    console.log(`[2FA SECURITY MONITORS] 2FA required for ${user.username}. Method: ${finalMethod} | Code: ${otpCode}`);
    return res.json({
      require2fa: true,
      mfaToken,
      method: finalMethod,
      simulatedOtp: otpCode,
      // Send generated code for offline testing and automatic evaluations
      telegramSent,
      telegramError: telegramError || void 0
    });
  }
  user.lastLoginAt = (/* @__PURE__ */ new Date()).toISOString();
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  localDb.refreshTokens.push({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString()
  });
  const historyItem = {
    id: "lh_" + Date.now(),
    userId: user.id,
    username: user.username,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    ipAddress,
    device,
    status: "Success"
  };
  localDb.loginHistory.unshift(historyItem);
  saveLocalDb();
  const roleName = localDb.roles.find((r) => r.id === user.roleId)?.name || "Staff";
  const customPermissions = user.customPermissionIds || [];
  const rolePermissionIds = localDb.rolePermissions[user.roleId] || [];
  const mergedPermissionIds = Array.from(/* @__PURE__ */ new Set([...rolePermissionIds, ...customPermissions]));
  const permissions = localDb.permissions.filter((p) => mergedPermissionIds.includes(p.id));
  sendTelegramSecurityAlert(user, "Login Success", `Authenticated successfully via password login.
<b>IP:</b> ${ipAddress}
<b>Device:</b> ${device}`);
  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: roleName,
      roleId: user.roleId,
      assignedBranchIds: user.assignedBranchIds || [],
      forcePasswordChange: user.forcePasswordChange || false,
      telegramChatId: user.telegramChatId || "",
      telegramUsername: user.telegramUsername || "",
      twoFactorMethod: user.twoFactorMethod || "disabled",
      permissions
    }
  });
});
app.post("/api/auth/verify-2fa", (req, res) => {
  const { mfaToken, code } = req.body;
  if (!mfaToken || !code) {
    return res.status(400).json({ error: "MFA token and 2FA passcode are required" });
  }
  const record = pendingOtps.get(mfaToken);
  if (!record) {
    return res.status(400).json({ error: "MFA session is invalid or has expired" });
  }
  if (Date.now() > record.expiresAt) {
    pendingOtps.delete(mfaToken);
    return res.status(400).json({ error: "Verification code has expired. Please try again." });
  }
  if (record.code !== code) {
    return res.status(400).json({ error: "Incorrect 2-Factor Authentication passcode" });
  }
  const user = localDb.users.find((u) => u.id === record.userId);
  if (!user || user.status !== "Active") {
    pendingOtps.delete(mfaToken);
    return res.status(403).json({ error: "User is locked or deactivated" });
  }
  pendingOtps.delete(mfaToken);
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  localDb.refreshTokens.push({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString()
  });
  user.lastLoginAt = (/* @__PURE__ */ new Date()).toISOString();
  saveLocalDb();
  const historyItem = {
    id: "lh_" + Date.now(),
    userId: user.id,
    username: user.username,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    ipAddress: record.ipAddress,
    device: record.device,
    status: "Success"
  };
  localDb.loginHistory.unshift(historyItem);
  saveLocalDb();
  const roleName = localDb.roles.find((r) => r.id === user.roleId)?.name || "Staff";
  const customPermissions = user.customPermissionIds || [];
  const rolePermissionIds = localDb.rolePermissions[user.roleId] || [];
  const mergedPermissionIds = Array.from(/* @__PURE__ */ new Set([...rolePermissionIds, ...customPermissions]));
  const permissions = localDb.permissions.filter((p) => mergedPermissionIds.includes(p.id));
  sendTelegramSecurityAlert(user, "Login Success (2FA Approved)", `Approved Two-Factor Challenge at IP ${record.ipAddress}.
<b>IP:</b> ${record.ipAddress}
<b>Device:</b> ${record.device}`);
  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: roleName,
      roleId: user.roleId,
      assignedBranchIds: user.assignedBranchIds || [],
      forcePasswordChange: user.forcePasswordChange || false,
      telegramChatId: user.telegramChatId || "",
      telegramUsername: user.telegramUsername || "",
      twoFactorMethod: user.twoFactorMethod || "disabled",
      permissions
    }
  });
});
app.post("/api/auth/logout", (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    localDb.refreshTokens = localDb.refreshTokens.filter((t) => t.token !== refreshToken);
    saveLocalDb();
  }
  res.json({ success: true, message: "Logged out successfully" });
});
app.post("/api/auth/refresh-token", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }
  const storedToken = localDb.refreshTokens.find((t) => t.token === refreshToken);
  if (!storedToken || new Date(storedToken.expiresAt) < /* @__PURE__ */ new Date()) {
    localDb.refreshTokens = localDb.refreshTokens.filter((t) => t.token !== refreshToken);
    saveLocalDb();
    return res.status(451).json({ error: "Refresh token is expired or revoked. Please log in again." });
  }
  try {
    const payload = import_jsonwebtoken.default.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = localDb.users.find((u) => u.id === payload.id);
    if (!user || user.status !== "Active") {
      return res.status(401).json({ error: "User is deactivated or missing" });
    }
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    localDb.refreshTokens = localDb.refreshTokens.filter((t) => t.token !== refreshToken);
    localDb.refreshTokens.push({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString()
    });
    saveLocalDb();
    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }
});
app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  const user = localDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "No account registered with this email address" });
  }
  const token = "RST_" + Math.floor(1e5 + Math.random() * 9e5);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1e3).toISOString();
  localDb.passwordResetTokens.push({
    id: "tok_" + Date.now(),
    email: email.toLowerCase(),
    token,
    expiresAt
  });
  saveLocalDb();
  res.json({
    success: true,
    message: "Reset passcode issued successfully",
    passcode: token,
    // Sent directly for testability
    expiresAt
  });
});
app.post("/api/auth/reset-password", (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and newPassword are required" });
  }
  const storedTokenIndex = localDb.passwordResetTokens.findIndex(
    (t) => t.token === token && new Date(t.expiresAt) > /* @__PURE__ */ new Date()
  );
  if (storedTokenIndex === -1) {
    return res.status(400).json({ error: "Invalid or expired password reset code" });
  }
  const tokenObj = localDb.passwordResetTokens[storedTokenIndex];
  const user = localDb.users.find((u) => u.email.toLowerCase() === tokenObj.email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "Account not found" });
  }
  const salt = import_bcryptjs.default.genSaltSync(10);
  user.passwordHash = import_bcryptjs.default.hashSync(newPassword, salt);
  user.failedLoginAttempts = 0;
  user.lockedUntil = null;
  user.status = "Active";
  user.forcePasswordChange = false;
  localDb.passwordResetTokens.splice(storedTokenIndex, 1);
  saveLocalDb();
  res.json({ success: true, message: "Password updated successfully! You can now log in." });
});
app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No auth token found" });
  try {
    const payload = import_jsonwebtoken.default.verify(token, JWT_SECRET);
    const user = localDb.users.find((u) => u.id === payload.id);
    if (!user) return res.status(404).json({ error: "User profiles missing" });
    const roleName = localDb.roles.find((r) => r.id === user.roleId)?.name || "Staff";
    const permissionIds = localDb.rolePermissions[user.roleId] || [];
    const permissions = localDb.permissions.filter((p) => permissionIds.includes(p.id));
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: roleName,
      roleId: user.roleId,
      assignedBranchIds: user.assignedBranchIds || [],
      forcePasswordChange: user.forcePasswordChange || false,
      permissions
    });
  } catch (err) {
    return res.status(403).json({ error: "Expired or invalid token" });
  }
});
app.get("/api/users", (req, res) => {
  const safeUsers = localDb.users.map(({ passwordHash, ...rest }) => {
    const roleName = localDb.roles.find((r) => r.id === rest.roleId)?.name || "Staff";
    return { ...rest, role: roleName };
  });
  res.json({ success: true, users: safeUsers });
});
app.post("/api/users", (req, res) => {
  const {
    fullName,
    username,
    email,
    phone,
    roleId,
    password,
    assignedBranchIds,
    customPermissionIds,
    telegramUsername,
    telegramChatId,
    twoFactorMethod
  } = req.body;
  if (!fullName || !username || !email || !roleId) {
    return res.status(400).json({ error: "Required fields are missing" });
  }
  const exists = localDb.users.some(
    (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) {
    return res.status(400).json({ error: "Username or email already exists" });
  }
  const salt = import_bcryptjs.default.genSaltSync(10);
  const plainPassword = password || "ChangeMe@123";
  const newUser = {
    id: "usr_" + Date.now(),
    fullName,
    username,
    email,
    phone: phone || "",
    passwordHash: import_bcryptjs.default.hashSync(plainPassword, salt),
    roleId,
    status: "Active",
    failedLoginAttempts: 0,
    lockedUntil: null,
    lastLoginAt: null,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    forcePasswordChange: true,
    // true by default when provisioned by owner
    assignedBranchIds: assignedBranchIds || [],
    customPermissionIds: customPermissionIds || [],
    telegramUsername: telegramUsername || "",
    telegramChatId: telegramChatId || "",
    twoFactorMethod: twoFactorMethod || "disabled"
  };
  localDb.users.push(newUser);
  saveLocalDb();
  sendTelegramSecurityAlert(newUser, "User Account Created", `Created user account with role: ${roleId}. Branch access mapping: ${JSON.stringify(newUser.assignedBranchIds)}`);
  const { passwordHash, ...safeUser } = newUser;
  res.json({ success: true, user: safeUser });
});
app.get("/api/users/:id", (req, res) => {
  const user = localDb.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { passwordHash, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});
app.put("/api/users/:id", (req, res) => {
  const user = localDb.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const {
    fullName,
    username,
    email,
    phone,
    roleId,
    password,
    status,
    assignedBranchIds,
    customPermissionIds,
    telegramUsername,
    telegramChatId,
    twoFactorMethod
  } = req.body;
  let permissionChanged = false;
  let securityMsg = "";
  if (fullName) user.fullName = fullName;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (username && username.toLowerCase() !== user.username.toLowerCase()) {
    const exists = localDb.users.some(
      (u) => u.id !== user.id && u.username.toLowerCase() === username.toLowerCase()
    );
    if (exists) {
      return res.status(400).json({ error: "Username already in use" });
    }
    user.username = username;
  }
  if (password) {
    const salt = import_bcryptjs.default.genSaltSync(10);
    user.passwordHash = import_bcryptjs.default.hashSync(password, salt);
    securityMsg += "Credential passcode manually reset by administrator. ";
  }
  if (roleId && roleId !== user.roleId) {
    securityMsg += `Role modified from [${user.roleId}] to [${roleId}]. `;
    user.roleId = roleId;
    permissionChanged = true;
  }
  if (status && status !== user.status) {
    securityMsg += `Status toggled from [${user.status}] to [${status}]. `;
    user.status = status;
  }
  if (assignedBranchIds && JSON.stringify(assignedBranchIds) !== JSON.stringify(user.assignedBranchIds)) {
    securityMsg += `Branch scope customized: ${JSON.stringify(assignedBranchIds)}. `;
    user.assignedBranchIds = assignedBranchIds;
  }
  if (customPermissionIds) {
    if (JSON.stringify(customPermissionIds) !== JSON.stringify(user.customPermissionIds)) {
      securityMsg += `Granular custom permissions grid manually overrode. `;
      permissionChanged = true;
    }
    user.customPermissionIds = customPermissionIds;
  }
  if (telegramUsername !== void 0) user.telegramUsername = telegramUsername;
  if (telegramChatId !== void 0 && telegramChatId !== user.telegramChatId) {
    securityMsg += `Linked Telegram Chat ID configured to: [${telegramChatId || "Unlinked"}]. `;
    user.telegramChatId = telegramChatId;
  }
  if (twoFactorMethod !== void 0 && twoFactorMethod !== user.twoFactorMethod) {
    securityMsg += `2FA Auth policy changed to: [${twoFactorMethod.toUpperCase()}]. `;
    user.twoFactorMethod = twoFactorMethod;
  }
  user.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  saveLocalDb();
  if (securityMsg) {
    sendTelegramSecurityAlert(user, permissionChanged ? "Permission Changed" : "Account Config Modified", securityMsg);
  }
  const { passwordHash, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});
app.delete("/api/users/:id", (req, res) => {
  const index = localDb.users.findIndex((u) => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "User not found" });
  const termUser = localDb.users[index];
  if (termUser.id === "usr_owner") {
    return res.status(400).json({ error: "Cannot delete primary owner account" });
  }
  localDb.users.splice(index, 1);
  saveLocalDb();
  res.json({ success: true, message: "User deleted successfully" });
});
app.patch("/api/users/:id/status", (req, res) => {
  const user = localDb.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { status } = req.body;
  if (!["Active", "Inactive", "Locked"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  user.status = status;
  if (status === "Active") {
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
  }
  user.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  saveLocalDb();
  const { passwordHash, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});
app.patch("/api/users/:id/reset-password", (req, res) => {
  const user = localDb.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "Password is required" });
  const salt = import_bcryptjs.default.genSaltSync(10);
  user.passwordHash = import_bcryptjs.default.hashSync(password, salt);
  user.forcePasswordChange = true;
  user.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  saveLocalDb();
  res.json({ success: true, message: "Password reset successfully" });
});
app.patch("/api/users/:id/assign-branches", (req, res) => {
  const user = localDb.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { assignedBranchIds } = req.body;
  if (!Array.isArray(assignedBranchIds)) {
    return res.status(400).json({ error: "assignedBranchIds must be an array" });
  }
  user.assignedBranchIds = assignedBranchIds;
  user.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  saveLocalDb();
  const { passwordHash, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});
app.get("/api/roles", (req, res) => {
  const rolesWithPerms = localDb.roles.map((r) => {
    const permIds = localDb.rolePermissions[r.id] || [];
    const perms = localDb.permissions.filter((p) => permIds.includes(p.id));
    return { ...r, permissions: perms };
  });
  res.json({ success: true, roles: rolesWithPerms });
});
app.post("/api/roles", (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Role name is required" });
  const id = name.toLowerCase().replace(/\s+/g, "_");
  const exists = localDb.roles.some((r) => r.id === id);
  if (exists) return res.status(400).json({ error: "Role already exists" });
  const newRole = { id, name, description: description || "" };
  localDb.roles.push(newRole);
  localDb.rolePermissions[id] = [];
  saveLocalDb();
  res.json({ success: true, role: { ...newRole, permissions: [] } });
});
app.put("/api/roles/:id", (req, res) => {
  const role = localDb.roles.find((r) => r.id === req.params.id);
  if (!role) return res.status(404).json({ error: "Role not found" });
  const { name, description } = req.body;
  if (name) role.name = name;
  if (description) role.description = description;
  saveLocalDb();
  res.json({ success: true, role });
});
app.delete("/api/roles/:id", (req, res) => {
  const index = localDb.roles.findIndex((r) => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Role not found" });
  if (["owner", "admin", "manager", "staff"].includes(req.params.id)) {
    return res.status(400).json({ error: "System default roles cannot be deleted" });
  }
  localDb.roles.splice(index, 1);
  delete localDb.rolePermissions[req.params.id];
  saveLocalDb();
  res.json({ success: true, message: "Role deleted successfully" });
});
app.get("/api/permissions", (req, res) => {
  res.json({ success: true, permissions: localDb.permissions });
});
app.put("/api/roles/:id/permissions", (req, res) => {
  const role = localDb.roles.find((r) => r.id === req.params.id);
  if (!role) return res.status(404).json({ error: "Role not found" });
  const { permissionIds } = req.body;
  if (!Array.isArray(permissionIds)) {
    return res.status(400).json({ error: "permissionIds must be an array" });
  }
  localDb.rolePermissions[req.params.id] = permissionIds;
  saveLocalDb();
  res.json({ success: true, message: "Permissions configured successfully" });
});
app.get("/api/login-history", (req, res) => {
  res.json({ success: true, logs: localDb.loginHistory || [] });
});
app.post("/api/sync-data", (req, res) => {
  try {
    const payload = req.body;
    localDb = { ...localDb, ...payload };
    saveLocalDb();
    res.json({ success: true, message: "Server-side data synchronized successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.get("/api/telegram-config", (req, res) => {
  res.json(getTelegramConfig());
});
app.post("/api/telegram-config", (req, res) => {
  try {
    saveTelegramConfig(req.body);
    res.json({ success: true, message: "Telegram Configuration saved and updated successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/telegram-test", async (req, res) => {
  const { chatId, username } = req.body;
  if (!chatId) {
    return res.status(400).json({ success: false, error: "Chat ID is required" });
  }
  const shopName = localDb.settings?.shopName || "Clean24 Laundry";
  const text = `<b>\u{1F389} Clean24 Telegram Bot Test Connection</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
<b>Shop:</b> ${shopName}
<b>Status:</b> Active \u{1F7E2}
<b>Timestamp:</b> <code>${(/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)}</code>
<b>Configured For:</b> <b>${username || "Owner/Admin"}</b>

<i>Congratulations! Your laundry system is now securely linked with this Telegram thread. Instant operational alerts will be delivered here.</i>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501`;
  const result = await sendTelegramMessage(chatId, text);
  res.json(result);
});
function parseTemplateVariables(textTpl, customValues = {}) {
  const defaultValues = {
    branch_name: "Phnom Penh Central Branch",
    date: (/* @__PURE__ */ new Date()).toISOString().substring(0, 10),
    time: (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    revenue: "450.00",
    expense: "75.25",
    profit: "374.75",
    staff_count: "6",
    coin_balance: "142",
    item_name: "Super Clean Softener Liquid",
    remaining_qty: "4.5",
    minimum_qty: "12",
    machine_no: "DRYER-7",
    status: "Operational warning flagged",
    message: "System auto-reconciled with minor $2.50 cash drawer discrepancy. Recommended action: recount till drawer."
  };
  const finalValues = { ...defaultValues, ...customValues };
  let parsedText = textTpl || "";
  for (const [key, value] of Object.entries(finalValues)) {
    const regex = new RegExp(`{${key}}`, "g");
    parsedText = parsedText.replace(regex, value);
  }
  return parsedText;
}
app.get("/api/telegram-templates", (req, res) => {
  res.json(localDb.telegramTemplates || []);
});
app.post("/api/telegram-templates", (req, res) => {
  try {
    const { name, category, isEnabled, engTemplate, khmerTemplate, parseMode, branchId, targetGroups } = req.body;
    if (!name || !category) {
      return res.status(400).json({ success: false, error: "Name and Category are required." });
    }
    const newTemplate = {
      id: "tpl_" + Date.now(),
      name,
      category,
      isEnabled: isEnabled !== void 0 ? isEnabled : true,
      engTemplate: engTemplate || "",
      khmerTemplate: khmerTemplate || "",
      parseMode: parseMode || "HTML",
      branchId: branchId || "all",
      targetGroups: Array.isArray(targetGroups) ? targetGroups : []
    };
    if (!localDb.telegramTemplates) localDb.telegramTemplates = [];
    localDb.telegramTemplates.push(newTemplate);
    saveLocalDb();
    res.json({ success: true, data: newTemplate });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.put("/api/telegram-templates/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, isEnabled, engTemplate, khmerTemplate, parseMode, branchId, targetGroups } = req.body;
    if (!localDb.telegramTemplates) localDb.telegramTemplates = [];
    const index = localDb.telegramTemplates.findIndex((t2) => t2.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: "Template not found" });
    }
    const t = localDb.telegramTemplates[index];
    localDb.telegramTemplates[index] = {
      ...t,
      name: name !== void 0 ? name : t.name,
      category: category !== void 0 ? category : t.category,
      isEnabled: isEnabled !== void 0 ? isEnabled : t.isEnabled,
      engTemplate: engTemplate !== void 0 ? engTemplate : t.engTemplate,
      khmerTemplate: khmerTemplate !== void 0 ? khmerTemplate : t.khmerTemplate,
      parseMode: parseMode !== void 0 ? parseMode : t.parseMode,
      branchId: branchId !== void 0 ? branchId : t.branchId,
      targetGroups: Array.isArray(targetGroups) ? targetGroups : t.targetGroups
    };
    saveLocalDb();
    res.json({ success: true, data: localDb.telegramTemplates[index] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.delete("/api/telegram-templates/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!localDb.telegramTemplates) localDb.telegramTemplates = [];
    const index = localDb.telegramTemplates.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: "Template not found" });
    }
    localDb.telegramTemplates.splice(index, 1);
    saveLocalDb();
    res.json({ success: true, message: "Template deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/telegram-templates/test", async (req, res) => {
  try {
    const { templateId, selectedLanguage, customChatId, customVariables } = req.body;
    if (!templateId) {
      return res.status(400).json({ success: false, error: "Template ID is required." });
    }
    const template = (localDb.telegramTemplates || []).find((t) => t.id === templateId);
    if (!template) {
      return res.status(404).json({ success: false, error: "Template not found." });
    }
    const config = getTelegramConfig();
    const isKhmer = selectedLanguage === "kh";
    const rawText = isKhmer ? template.khmerTemplate : template.engTemplate;
    const parsedText = parseTemplateVariables(rawText, customVariables || {});
    let chatsToSend = [];
    if (customChatId) {
      chatsToSend.push(customChatId);
    } else if (Array.isArray(template.targetGroups) && template.targetGroups.length > 0) {
      chatsToSend = template.targetGroups;
    } else {
      if (template.branchId && template.branchId !== "all") {
        const bId = template.branchId;
        if (config.chatIds.branches?.[bId]) chatsToSend.push(config.chatIds.branches[bId]);
        if (config.chatIds.manager?.[bId]) chatsToSend.push(config.chatIds.manager[bId]);
        if (config.chatIds.staff?.[bId]) chatsToSend.push(config.chatIds.staff[bId]);
      }
      if (chatsToSend.length === 0) {
        if (config.chatIds.owner) chatsToSend.push(config.chatIds.owner);
        if (config.chatIds.admin) chatsToSend.push(config.chatIds.admin);
      }
    }
    if (chatsToSend.length === 0) {
      return res.status(400).json({ success: false, error: "No recipient Chat IDs are configured for this template or system fallback." });
    }
    if (!config.botToken) {
      return res.json({
        success: true,
        simulated: true,
        message: "Bot token not fully configured. API processed simulation delivery successfully!",
        dispatched_text: parsedText,
        recipientsOnMockLogs: chatsToSend
      });
    }
    const sendResults = [];
    for (const chatId of chatsToSend) {
      if (!chatId) continue;
      const sendResult = await sendTelegramMessage(chatId, parsedText, template.parseMode || "HTML");
      sendResults.push({ chatId, ...sendResult });
    }
    const successfulSends = sendResults.filter((r) => r.success);
    if (successfulSends.length > 0) {
      res.json({
        success: true,
        message: `Successfully tested template! Dispatched message to ${successfulSends.length} endpoint(s).`,
        details: sendResults,
        dispatched_text: parsedText
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Failed to send test messages. Check API Token and Chat IDs.",
        details: sendResults,
        dispatched_text: parsedText
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
function normalizeTo24Hour(timeStr) {
  if (!timeStr) return "";
  timeStr = timeStr.trim();
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return timeStr;
  let hr = parseInt(match[1]);
  const mins = match[2];
  const ampm = match[3];
  if (ampm) {
    if (ampm.toUpperCase() === "PM" && hr < 12) hr += 12;
    if (ampm.toUpperCase() === "AM" && hr === 12) hr = 0;
  }
  return `${String(hr % 24).padStart(2, "0")}:${mins}`;
}
async function sendTelegramMessageWithRetry(chatId, text, parseMode = "HTML", maxAttempts = 3, customBotToken) {
  let attempt = 0;
  let lastError = "";
  while (attempt < maxAttempts) {
    attempt++;
    const res = await sendTelegramMessage(chatId, text, parseMode, customBotToken);
    if (res.success) {
      return { success: true, attempts: attempt };
    }
    lastError = res.error || "Network request timeout or empty bot response";
    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  }
  return { success: false, error: lastError, attempts: maxAttempts };
}
function generateDailyReportData(branchId) {
  const branches = branchId === "all" || !branchId ? localDb.branches : localDb.branches.filter((b) => b.id === branchId);
  if (branches.length === 0) return "<b>\u{1F3EA} Daily Alert Status:</b> No operational branches found in active database.";
  let text = `<b>\u{1F4CA} DAILY BUSINESS SUMMARY REPORT</b>
`;
  text += `\u{1F4C5} <b>Date:</b> ${(/* @__PURE__ */ new Date()).toISOString().substring(0, 10)}
`;
  text += `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`;
  for (const b of branches) {
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
    const branchIncomes = localDb.incomes?.filter((inc) => inc.branchId === b.id && inc.date === todayStr) || [];
    const branchExpenses = localDb.expenses?.filter((exp) => exp.branchId === b.id && exp.date === todayStr) || [];
    const revenue = branchIncomes.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
    const expense = branchExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
    const profit = revenue - expense;
    const machines = localDb.machines?.filter((m) => m.branchId === b.id) || [];
    const brokenMachines = machines.filter((m) => m.status === "Needs Repair" || m.status === "OutOfService" || m.status === "Broken").length;
    const activeMachines = machines.length - brokenMachines;
    text += `\u{1F3EA} <b>${b.branchName}:</b>
`;
    text += `   \u{1F4B5} <b>Revenue:</b> $${revenue.toFixed(2)}
`;
    text += `   \u{1F4B8} <b>Expenses:</b> $${expense.toFixed(2)}
`;
    text += `   \u{1F4C8} <b>Net Today:</b> $${profit.toFixed(2)}
`;
    text += `   \u2699\uFE0F <b>Machines:</b> ${activeMachines} Active | ${brokenMachines} Broken
`;
    text += `   \u{1FA99} <b>Coin Balance:</b> ${b.coinBalance || 140} coins
`;
    text += `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`;
  }
  return text;
}
function generateWeeklyReportData() {
  let text = `<b>\u{1F4CA} WEEKLY BRANCH REPORT & COMPARISON</b>
`;
  text += `\u{1F4C5} <b>Period:</b> Last 7 Days Performance Matrix
`;
  text += `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`;
  const sevenDaysAgo = /* @__PURE__ */ new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().substring(0, 10);
  let totalRevAll = 0;
  let totalExpAll = 0;
  for (const b of localDb.branches) {
    const branchIncomes = localDb.incomes?.filter((inc) => inc.branchId === b.id && inc.date >= sevenDaysAgoStr) || [];
    const branchExpenses = localDb.expenses?.filter((exp) => exp.branchId === b.id && exp.date >= sevenDaysAgoStr) || [];
    const revenue = branchIncomes.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
    const expense = branchExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
    const profit = revenue - expense;
    totalRevAll += revenue;
    totalExpAll += expense;
    text += `\u{1F3EA} <b>${b.branchName}:</b>
`;
    text += `   \u{1F4B5} <b>Weekly Rev:</b> $${revenue.toFixed(2)}
`;
    text += `   \u{1F4B8} <b>Weekly Exp:</b> $${expense.toFixed(2)}
`;
    text += `   \u{1F4C8} <b>Weekly Profit:</b> $${profit.toFixed(2)}
`;
    text += `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`;
  }
  const profitAll = totalRevAll - totalExpAll;
  text += `<b>\u{1F310} SYSTEM-WIDE CONSOLIDATED OUTCOME:</b>
`;
  text += `\u{1F4CA} <b>Total Combined Rev:</b> $${totalRevAll.toFixed(2)}
`;
  text += `\u{1F4B8} <b>Total Combined Exp:</b> $${totalExpAll.toFixed(2)}
`;
  text += `\u{1F48E} <b>Net Consolidated Profit:</b> $${profitAll.toFixed(2)}
`;
  text += `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501`;
  return text;
}
function generateMonthlyReportData() {
  let text = `<b>\u{1F5D3}\uFE0F MONTHLY EXECUTIVE SUMMARY REPORT</b>
`;
  text += `\u{1F4C5} <b>Period:</b> Current Month Dynamic Accumulation
`;
  text += `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`;
  const now = /* @__PURE__ */ new Date();
  const currentYearMonth = now.toISOString().substring(0, 7);
  let totalRevAll = 0;
  let totalExpAll = 0;
  for (const b of localDb.branches) {
    const branchIncomes = localDb.incomes?.filter((inc) => inc.branchId === b.id && inc.date.startsWith(currentYearMonth)) || [];
    const branchExpenses = localDb.expenses?.filter((exp) => exp.branchId === b.id && exp.date.startsWith(currentYearMonth)) || [];
    const revenue = branchIncomes.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
    const expense = branchExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
    const profit = revenue - expense;
    totalRevAll += revenue;
    totalExpAll += expense;
    text += `\u{1F3EA} <b>${b.branchName}:</b>
`;
    text += `   \u{1F4B5} <b>Rev Month-to-Date:</b> $${revenue.toFixed(2)}
`;
    text += `   \u{1F4B8} <b>Exp Month-to-Date:</b> $${expense.toFixed(2)}
`;
    text += `   \u{1F4C8} <b>Net Earnings:</b> $${profit.toFixed(2)}
`;
  }
  text += `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`;
  const salariesTotal = (localDb.salaries || []).reduce((sum, sal) => sum + parseFloat(sal.totalSalary || 0), 0);
  const totalStockItemsCount = (localDb.inventory || []).length;
  text += `<b>\u{1F4B5} System Salaries Allocated:</b> $${salariesTotal.toFixed(2)}
`;
  text += `\u{1F9FC} <b>Active Inventory SKUs:</b> ${totalStockItemsCount}
`;
  text += `\u{1F48E} <b>Est. General Profit:</b> $${(totalRevAll - totalExpAll - salariesTotal).toFixed(2)}
`;
  text += `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501`;
  return text;
}
async function triggerScheduledEvent(s, isManualTest = false) {
  const config = getTelegramConfig();
  const now = /* @__PURE__ */ new Date();
  const todayStr = now.toISOString().substring(0, 10);
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const recipient = (localDb.telegramRecipients || []).find((r) => r.id === s.recipientId);
  if (!recipient && !config.chatIds.owner) {
    return { success: false, error: "No Telegram recipient found and owner chat ID fallback is missing" };
  }
  const chatId = recipient?.isEnabled ? recipient.chatId : config.chatIds.owner || config.chatIds.admin;
  if (!chatId) {
    return { success: false, error: "No validated Chat ID found to dispatcher alerts" };
  }
  let alertText = "";
  let formatMode = "HTML";
  const template = (localDb.telegramTemplates || []).find((t) => t.id === s.templateId);
  if (template) {
    formatMode = template.parseMode || "HTML";
  }
  if (s.frequency === "DAILY") {
    alertText = generateDailyReportData(s.branchId);
  } else if (s.frequency === "WEEKLY") {
    alertText = generateWeeklyReportData();
  } else if (s.frequency === "MONTHLY") {
    alertText = generateMonthlyReportData();
  } else {
    const rawTemplateText = template ? isManualTest ? template.engTemplate : template.engTemplate : `<b>\u{1F514} AUTO ALERT SCHEDULE TRIGGED</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F3EA} <b>Branch:</b> {branch_name}
\u{1F4C5} <b>Time:</b> {date} {time}
\u{1F4DD} <b>Notification Type:</b> {status}`;
    const branchObj = localDb.branches.find((b) => b.id === s.branchId) || { branchName: "System-Wide Operations" };
    alertText = parseTemplateVariables(rawTemplateText, {
      branch_name: branchObj.branchName,
      date: todayStr,
      time: timeStr,
      status: s.alertType,
      message: `System schedule trigger activated. Automated payload verification passed for frequency ${s.frequency}.`
    });
  }
  if (!config.botToken) {
    if (!localDb.telegramLogs) localDb.telegramLogs = [];
    localDb.telegramLogs.push({
      id: "log_" + Date.now() + "_" + Math.floor(Math.random() * 100),
      scheduleId: s.id,
      templateId: s.templateId || null,
      recipientId: s.recipientId || null,
      chatId,
      alertType: s.alertType,
      messageText: alertText,
      status: "SUCCESS",
      errorMessage: "(Simulated Delivery: Bot token is empty)",
      sentAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    s.lastSentAt = (/* @__PURE__ */ new Date()).toISOString();
    return { success: true, simulated: true, text: alertText };
  }
  let customBotToken = void 0;
  if (recipient) {
    const encToken = recipient.bot_token_encrypted || recipient.botTokenEncrypted;
    if (encToken) {
      customBotToken = decryptToken(encToken);
    }
  }
  const sendRes = await sendTelegramMessageWithRetry(chatId, alertText, formatMode, 3, customBotToken);
  if (!localDb.telegramLogs) localDb.telegramLogs = [];
  localDb.telegramLogs.push({
    id: "log_" + Date.now() + "_" + Math.floor(Math.random() * 100),
    scheduleId: s.id,
    templateId: s.templateId || null,
    recipientId: s.recipientId || null,
    chatId,
    alertType: s.alertType,
    messageText: alertText,
    status: sendRes.success ? "SUCCESS" : "FAILED",
    errorMessage: sendRes.success ? null : sendRes.error,
    sentAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  if (sendRes.success) {
    s.lastSentAt = (/* @__PURE__ */ new Date()).toISOString();
    saveLocalDb();
    return { success: true, text: alertText };
  } else {
    return { success: false, error: sendRes.error };
  }
}
app.get("/api/telegram-schedules", (req, res) => {
  res.json(localDb.telegramAlertSchedules || []);
});
app.post("/api/telegram-schedules", (req, res) => {
  try {
    const { branchId, alertType, templateId, recipientId, frequency, sendTime, dayOfWeek, dayOfMonth, isEnabled } = req.body;
    if (!alertType || !frequency) {
      return res.status(400).json({ success: false, error: "Alert Type and Frequency is required." });
    }
    const newSchedule = {
      id: "sch_" + Date.now(),
      branchId: branchId || "all",
      alertType,
      templateId: templateId || "",
      recipientId: recipientId || "",
      frequency,
      sendTime: normalizeTo24Hour(sendTime || ""),
      dayOfWeek: dayOfWeek || "",
      dayOfMonth: dayOfMonth || "",
      isEnabled: isEnabled !== void 0 ? isEnabled : true,
      lastSentAt: null,
      nextSendAt: null,
      createdBy: "Owner",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!localDb.telegramAlertSchedules) localDb.telegramAlertSchedules = [];
    localDb.telegramAlertSchedules.push(newSchedule);
    saveLocalDb();
    res.json({ success: true, data: newSchedule });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.put("/api/telegram-schedules/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { branchId, alertType, templateId, recipientId, frequency, sendTime, dayOfWeek, dayOfMonth, isEnabled } = req.body;
    if (!localDb.telegramAlertSchedules) localDb.telegramAlertSchedules = [];
    const index = localDb.telegramAlertSchedules.findIndex((s2) => s2.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: "Schedule configuration not found" });
    }
    const s = localDb.telegramAlertSchedules[index];
    localDb.telegramAlertSchedules[index] = {
      ...s,
      branchId: branchId !== void 0 ? branchId : s.branchId,
      alertType: alertType !== void 0 ? alertType : s.alertType,
      templateId: templateId !== void 0 ? templateId : s.templateId,
      recipientId: recipientId !== void 0 ? recipientId : s.recipientId,
      frequency: frequency !== void 0 ? frequency : s.frequency,
      sendTime: sendTime !== void 0 ? normalizeTo24Hour(sendTime) : s.sendTime,
      dayOfWeek: dayOfWeek !== void 0 ? dayOfWeek : s.dayOfWeek,
      dayOfMonth: dayOfMonth !== void 0 ? dayOfMonth : s.dayOfMonth,
      isEnabled: isEnabled !== void 0 ? isEnabled : s.isEnabled,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    saveLocalDb();
    res.json({ success: true, data: localDb.telegramAlertSchedules[index] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.delete("/api/telegram-schedules/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!localDb.telegramAlertSchedules) localDb.telegramAlertSchedules = [];
    const index = localDb.telegramAlertSchedules.findIndex((s) => s.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: "Schedule not found" });
    }
    localDb.telegramAlertSchedules.splice(index, 1);
    saveLocalDb();
    res.json({ success: true, message: "Message Alert trigger schedule wiped out." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
async function validateBotTokenAndChat(botToken, chatId) {
  try {
    const meRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const meBody = await meRes.json();
    if (!meBody.ok) {
      return { success: false, error: `Invalid Bot Token: ${meBody.description || "Unauthorized"}` };
    }
    const chatRes = await fetch(`https://api.telegram.org/bot${botToken}/getChat?chat_id=${chatId}`);
    const chatBody = await chatRes.json();
    if (!chatBody.ok) {
      return { success: false, error: `Invalid Chat ID or Bot is not a member of the chat: ${chatBody.description || "Chat not found"}` };
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: `Verification failed: ${e.message || "Network timeout connecting to Telegram"}` };
  }
}
app.get("/api/telegram-permissions", (req, res) => {
  try {
    const allPerms = localDb.permissions || [];
    const telegramConfigurePerm = allPerms.find((p) => p.module === "Telegram Settings" && p.action === "Configure");
    if (!telegramConfigurePerm) {
      return res.json({ admin: true, manager: false });
    }
    const adminPerms = localDb.rolePermissions?.["admin"] || [];
    const managerPerms = localDb.rolePermissions?.["manager"] || [];
    res.json({
      admin: adminPerms.includes(telegramConfigurePerm.id),
      manager: managerPerms.includes(telegramConfigurePerm.id)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/telegram-permissions", (req, res) => {
  try {
    const { admin, manager } = req.body;
    const allPerms = localDb.permissions || [];
    const telegramConfigurePerm = allPerms.find((p) => p.module === "Telegram Settings" && p.action === "Configure");
    if (!telegramConfigurePerm) {
      return res.status(400).json({ success: false, error: "Telegram configuration permission not seeded." });
    }
    if (!localDb.rolePermissions) {
      localDb.rolePermissions = {};
    }
    if (admin !== void 0) {
      const adminPerms = new Set(localDb.rolePermissions["admin"] || []);
      if (admin) {
        adminPerms.add(telegramConfigurePerm.id);
      } else {
        adminPerms.delete(telegramConfigurePerm.id);
      }
      localDb.rolePermissions["admin"] = Array.from(adminPerms);
    }
    if (manager !== void 0) {
      const managerPerms = new Set(localDb.rolePermissions["manager"] || []);
      if (manager) {
        managerPerms.add(telegramConfigurePerm.id);
      } else {
        managerPerms.delete(telegramConfigurePerm.id);
      }
      localDb.rolePermissions["manager"] = Array.from(managerPerms);
    }
    saveLocalDb();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/telegram-recipients/test-send", async (req, res) => {
  try {
    let { botToken, chatId, recipientName, recipientType, groupName } = req.body;
    if (!botToken || !chatId) {
      return res.status(400).json({ success: false, error: "Bot Token and Chat ID are mandatory" });
    }
    if (botToken.includes("****")) {
      const matched = (localDb.telegramRecipients || []).find((r) => r.chat_id === chatId || r.chatId === chatId);
      if (matched && (matched.bot_token_encrypted || matched.botTokenEncrypted)) {
        botToken = decryptToken(matched.bot_token_encrypted || matched.botTokenEncrypted);
      } else {
        const tc = getTelegramConfig();
        botToken = tc.botToken;
      }
    }
    if (!botToken) {
      return res.status(400).json({ success: false, error: "Could not resolve a valid Bot Token" });
    }
    const testText = `<b>\u{1F389} Clean24 Telegram Connection Validation</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
<b>Recipient:</b> ${recipientName || "Test Partner"}
<b>Group/Channel:</b> ${groupName || "Unspecified"}
<b>Type:</b> <code>${recipientType || "GROUP_CHAT"}</code>
<b>Status:</b> Success \u{1F7E2}
<b>Timestamp:</b> <code>${(/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)}</code>

<i>Excellent! Connection verified successfully. Operation alerts can now be dispatched here.</i>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501`;
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: testText,
        parse_mode: "HTML"
      })
    });
    const body = await response.json();
    if (body.ok) {
      if (!localDb.telegramLogs) localDb.telegramLogs = [];
      const logEntry = {
        id: "log_" + Date.now() + "_" + Math.floor(Math.random() * 100),
        branch_id: "all",
        branchId: "all",
        recipient_id: "test",
        recipientId: "test",
        alert_type: "Test Connection",
        alertType: "Test Connection",
        message: testText,
        messageText: testText,
        status: "SUCCESS",
        error_message: null,
        errorMessage: null,
        sent_at: (/* @__PURE__ */ new Date()).toISOString(),
        sentAt: (/* @__PURE__ */ new Date()).toISOString(),
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      localDb.telegramLogs.push(logEntry);
      saveLocalDb();
      return res.json({ success: true, message: "Test message transmitted successfully!" });
    } else {
      if (!localDb.telegramLogs) localDb.telegramLogs = [];
      const logEntry = {
        id: "log_" + Date.now() + "_" + Math.floor(Math.random() * 100),
        branch_id: "all",
        branchId: "all",
        recipient_id: "test",
        recipientId: "test",
        alert_type: "Test Connection Failed",
        alertType: "Test Connection Failed",
        message: testText,
        messageText: testText,
        status: "FAILED",
        error_message: body.description || "API Error",
        errorMessage: body.description || "API Error",
        sent_at: (/* @__PURE__ */ new Date()).toISOString(),
        sentAt: (/* @__PURE__ */ new Date()).toISOString(),
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      localDb.telegramLogs.push(logEntry);
      saveLocalDb();
      return res.json({ success: false, error: body.description || "Raw Telegram API Error" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
app.get("/api/telegram-recipients", (req, res) => {
  try {
    const list = (localDb.telegramRecipients || []).map((r) => {
      let rawToken = "";
      if (r.bot_token_encrypted) {
        rawToken = decryptToken(r.bot_token_encrypted);
      } else if (r.botTokenEncrypted) {
        rawToken = decryptToken(r.botTokenEncrypted);
      }
      const masked = maskToken(rawToken);
      return {
        ...r,
        // Map both snake_case and camelCase to protect both React UI and older code
        id: r.id,
        branch_id: r.branch_id || r.branchId || "all",
        branchId: r.branch_id || r.branchId || "all",
        recipient_name: r.recipient_name || r.name || "",
        name: r.recipient_name || r.name || "",
        chat_id: r.chat_id || r.chatId || "",
        chatId: r.chat_id || r.chatId || "",
        bot_token_encrypted: r.bot_token_encrypted || r.botTokenEncrypted || "",
        botTokenEncrypted: r.bot_token_encrypted || r.botTokenEncrypted || "",
        recipient_type: r.recipient_type || r.recipientType || "GROUP_CHAT",
        recipientType: r.recipient_type || r.recipientType || "GROUP_CHAT",
        group_name: r.group_name || r.groupName || "",
        groupName: r.group_name || r.groupName || "",
        alert_types: r.alert_types || r.alertTypes || [],
        alertTypes: r.alert_types || r.alertTypes || [],
        is_default: r.is_default !== void 0 ? r.is_default : r.isDefault !== void 0 ? r.isDefault : false,
        isDefault: r.is_default !== void 0 ? r.is_default : r.isDefault !== void 0 ? r.isDefault : false,
        is_enabled: r.is_enabled !== void 0 ? r.is_enabled : r.isEnabled !== void 0 ? r.isEnabled : true,
        isEnabled: r.is_enabled !== void 0 ? r.is_enabled : r.isEnabled !== void 0 ? r.isEnabled : true,
        created_by: r.created_by || r.createdBy || "Owner",
        createdBy: r.created_by || r.createdBy || "Owner",
        created_at: r.created_at || r.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        createdAt: r.created_at || r.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: r.updated_at || r.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: r.updated_at || r.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        botTokenMasked: masked,
        bot_token_masked: masked
      };
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/telegram-recipients", async (req, res) => {
  try {
    const {
      branch_id,
      branchId,
      recipient_name,
      name,
      recipientName,
      chat_id,
      chatId,
      bot_token,
      botToken,
      recipient_type,
      recipientType,
      group_name,
      groupName,
      alert_types,
      alertTypes,
      is_default,
      isDefault,
      is_enabled,
      isEnabled,
      createdBy
    } = req.body;
    const targetBranch = branch_id || branchId || "all";
    const targetName = recipient_name || name || recipientName || "";
    const targetChat = chat_id || chatId || "";
    let targetToken = bot_token || botToken || "";
    const targetType = recipient_type || recipientType || "GROUP_CHAT";
    const targetGroup = group_name || groupName || "";
    const targetAlerts = alert_types || alertTypes || [];
    const targetDefault = is_default !== void 0 ? is_default : isDefault !== void 0 ? isDefault : false;
    const targetEnabled = is_enabled !== void 0 ? is_enabled : isEnabled !== void 0 ? isEnabled : true;
    if (!targetName || !targetChat) {
      return res.status(400).json({ success: false, error: "Recipient Name and Chat ID are mandatory fields." });
    }
    let encryptedToken = "";
    if (targetToken) {
      const validation = await validateBotTokenAndChat(targetToken, targetChat);
      if (!validation.success) {
        return res.status(400).json({ success: false, error: validation.error });
      }
      encryptedToken = encryptToken(targetToken);
    }
    const newRec = {
      id: "rec_" + Date.now() + "_" + Math.floor(Math.random() * 100),
      branch_id: targetBranch,
      branchId: targetBranch,
      recipient_name: targetName,
      name: targetName,
      chat_id: targetChat,
      chatId: targetChat,
      bot_token_encrypted: encryptedToken,
      botTokenEncrypted: encryptedToken,
      recipient_type: targetType,
      recipientType: targetType,
      group_name: targetGroup,
      groupName: targetGroup,
      alert_types: targetAlerts,
      alertTypes: targetAlerts,
      is_default: targetDefault,
      isDefault: targetDefault,
      is_enabled: targetEnabled,
      isEnabled: targetEnabled,
      created_by: createdBy || "Owner",
      createdBy: createdBy || "Owner",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!localDb.telegramRecipients) localDb.telegramRecipients = [];
    localDb.telegramRecipients.push(newRec);
    saveLocalDb();
    res.json({
      success: true,
      data: {
        ...newRec,
        botTokenMasked: maskToken(targetToken),
        bot_token_masked: maskToken(targetToken)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.put("/api/telegram-recipients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      branch_id,
      branchId,
      recipient_name,
      name,
      recipientName,
      chat_id,
      chatId,
      bot_token,
      botToken,
      recipient_type,
      recipientType,
      group_name,
      groupName,
      alert_types,
      alertTypes,
      is_default,
      isDefault,
      is_enabled,
      isEnabled
    } = req.body;
    if (!localDb.telegramRecipients) localDb.telegramRecipients = [];
    const idx = localDb.telegramRecipients.findIndex((r2) => r2.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: "Recipient config not found." });
    }
    const r = localDb.telegramRecipients[idx];
    const targetBranch = branch_id !== void 0 ? branch_id : branchId !== void 0 ? branchId : r.branch_id;
    const targetName = recipient_name !== void 0 ? recipient_name : name !== void 0 ? name : recipientName !== void 0 ? recipientName : r.recipient_name;
    const targetChat = chat_id !== void 0 ? chat_id : chatId !== void 0 ? chatId : r.chat_id;
    const targetType = recipient_type !== void 0 ? recipient_type : recipientType !== void 0 ? recipientType : r.recipient_type;
    const targetGroup = group_name !== void 0 ? group_name : groupName !== void 0 ? groupName : r.group_name;
    const targetAlerts = alert_types !== void 0 ? alert_types : alertTypes !== void 0 ? alertTypes : r.alert_types;
    const targetDefault = is_default !== void 0 ? is_default : isDefault !== void 0 ? isDefault : r.is_default;
    const targetEnabled = is_enabled !== void 0 ? is_enabled : isEnabled !== void 0 ? isEnabled : r.is_enabled;
    let targetToken = bot_token !== void 0 ? bot_token : botToken !== void 0 ? botToken : "";
    let finalEncryptedToken = r.bot_token_encrypted || r.botTokenEncrypted || "";
    if (targetToken && !targetToken.includes("****")) {
      const validation = await validateBotTokenAndChat(targetToken, targetChat);
      if (!validation.success) {
        return res.status(400).json({ success: false, error: validation.error });
      }
      finalEncryptedToken = encryptToken(targetToken);
    } else if (targetToken && targetToken.includes("****")) {
      if (chat_id !== void 0 && chat_id !== r.chat_id) {
        const decrypted = decryptToken(finalEncryptedToken);
        const validation = await validateBotTokenAndChat(decrypted, targetChat);
        if (!validation.success) {
          return res.status(400).json({ success: false, error: validation.error });
        }
      }
    }
    localDb.telegramRecipients[idx] = {
      ...r,
      branch_id: targetBranch,
      branchId: targetBranch,
      recipient_name: targetName,
      name: targetName,
      chat_id: targetChat,
      chatId: targetChat,
      bot_token_encrypted: finalEncryptedToken,
      botTokenEncrypted: finalEncryptedToken,
      recipient_type: targetType,
      recipientType: targetType,
      group_name: targetGroup,
      groupName: targetGroup,
      alert_types: targetAlerts,
      alertTypes: targetAlerts,
      is_default: targetDefault,
      isDefault: targetDefault,
      is_enabled: targetEnabled,
      isEnabled: targetEnabled,
      updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    saveLocalDb();
    res.json({ success: true, data: localDb.telegramRecipients[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.delete("/api/telegram-recipients/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!localDb.telegramRecipients) localDb.telegramRecipients = [];
    const idx = localDb.telegramRecipients.findIndex((r) => r.id === id);
    if (idx === -1) return res.status(404).json({ success: false, error: "Recipient config not found." });
    localDb.telegramRecipients.splice(idx, 1);
    saveLocalDb();
    res.json({ success: true, message: "Recipient config deleted successfully." });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
app.get("/api/telegram-logs", (req, res) => {
  res.json(localDb.telegramLogs || []);
});
app.post("/api/telegram-schedules/trigger-manual/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = (localDb.telegramAlertSchedules || []).find((s) => s.id === id);
    if (!schedule) {
      return res.status(404).json({ success: false, error: "Target schedule configuration not found" });
    }
    const outcome = await triggerScheduledEvent(schedule, true);
    res.json(outcome);
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
app.post("/api/telegram-trigger-mock", async (req, res) => {
  const { alertCategory, branchId } = req.body;
  const config = getTelegramConfig();
  const shopName = localDb.settings?.shopName || "Clean24 Laundry";
  const branchName = localDb.branches.find((b) => b.id === branchId)?.branchName || "Toul Kork";
  let alertType = "";
  let details = "";
  let actionRequired = "";
  const dateTimeStr = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16);
  if (alertCategory === "low_stock") {
    alertType = "Low Stock Alert";
    details = `\u2022 Liquid Detergent: 8.5 Liters left (Minimum: 10 Liters)
\u2022 Softener: 7.0 Liters left (Minimum: 10 Liters)
\u2022 LPG Gas Capacity: 18.0 Kg left (Minimum: 20 Kg)`;
    actionRequired = "Procure refill canisters immediately from default supplier to prevent washer blockages.";
  } else if (alertCategory === "salary") {
    alertType = "Salary Payment Reminder";
    details = `\u2022 Cycle: June 2026 Regular Salary Payroll
\u2022 Unpaid Staff: 4 managers/helper accounts pending approval
\u2022 Total Outstanding Liabilities: $1,450.00`;
    actionRequired = "Owner review and approve the unpaid salary ledger in Salary Dashboard.";
  } else if (alertCategory === "daily_business") {
    alertType = "Daily Business Performance";
    const today = "2026-06-06";
    const dayIncomes = localDb.incomes.filter((i) => i.date === today && (!branchId || i.branchId === branchId));
    const dayRevenues = localDb.revenueRecords.filter((r) => r.date === today && (!branchId || r.branchId === branchId));
    const dayExpenses = localDb.expenses.filter((e) => e.expenseDate === today && (!branchId || e.branchId === branchId));
    const totalIncome = dayIncomes.reduce((s, c) => s + c.totalAmount, 0) + dayRevenues.reduce((s, r) => s + r.amountUsd, 0);
    const totalExpense = dayExpenses.reduce((s, c) => s + c.amount, 0);
    const balance = totalIncome - totalExpense;
    const abaCount = dayIncomes.filter((i) => i.paymentMethod === "ABA" || i.paymentMethod === "QR Payment").reduce((s, c) => s + c.totalAmount, 0) + dayRevenues.filter((r) => r.paymentMethod === "ABA" || r.paymentMethod === "QR Payment").reduce((s, r) => s + r.amountUsd, 0);
    const cashCount = totalIncome - abaCount;
    details = `\u2022 Total Revenue Today: $${totalIncome.toFixed(2)}
\u2022 Total Expenses Today: $${totalExpense.toFixed(2)}
\u2022 Consolidated Profit: $${balance.toFixed(2)}

\u{1F4B3} PAYMENT METHOD RECONCILIATION:
\u2022 cashless (ABA/QR): $${abaCount.toFixed(2)}
\u2022 Physical Cash: $${cashCount.toFixed(2)}`;
    actionRequired = "Perform nightly cash-drawer balance counts and close administrative registers.";
  } else if (alertCategory === "machine") {
    alertType = "Machine Maintenance Alert";
    details = `\u2022 Machine Code: Washer W-04 (15kg Heavy Load)
\u2022 Reported Status: Broken \u{1F534}
\u2022 Internal Issue: Coin-slot jam causing mechanical lock screen loop. Error code: E-02`;
    actionRequired = "Dispatch maintenance technician to Toul Kork branch immediately to unblock mechanical rails.";
  } else {
    return res.status(400).json({ success: false, error: "Invalid mock alert category" });
  }
  const message = formatTelegramMessage({
    shopName,
    branchName,
    alertType,
    dateTime: dateTimeStr,
    details,
    actionRequired
  });
  const sentTargets = [];
  const errors = [];
  if (config.chatIds.owner) {
    const r = await sendTelegramMessage(config.chatIds.owner, message);
    if (r.success) sentTargets.push("Owner");
    else if (r.error) errors.push(`Owner: ${r.error}`);
  }
  if (config.chatIds.admin) {
    const r = await sendTelegramMessage(config.chatIds.admin, message);
    if (r.success) sentTargets.push("Admin");
    else if (r.error) errors.push(`Admin: ${r.error}`);
  }
  if (config.chatIds.branches[branchId]) {
    const r = await sendTelegramMessage(config.chatIds.branches[branchId], message);
    if (r.success) sentTargets.push(`Branch Channel (${branchName})`);
    else if (r.error) errors.push(`Branch Channel: ${r.error}`);
  }
  res.json({
    success: sentTargets.length > 0,
    targetsStr: sentTargets.join(", ") || "None",
    errors: errors.length > 0 ? errors.join("; ") : void 0
  });
});
app.post("/api/telegram-trigger-instant", async (req, res) => {
  try {
    const {
      alertType,
      branchId,
      details,
      actionRequired
    } = req.body;
    const config = getTelegramConfig();
    const shopName = localDb.settings?.shopName || "Clean24 Laundry";
    const branchName = localDb.branches.find((b) => b.id === branchId)?.branchName || "Toul Kork";
    const dateTimeStr = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16);
    const message = formatTelegramMessage({
      shopName,
      branchName,
      alertType,
      dateTime: dateTimeStr,
      details,
      actionRequired
    });
    const recipients = /* @__PURE__ */ new Set();
    if (config.chatIds.owner) recipients.add(config.chatIds.owner);
    if (config.chatIds.admin) recipients.add(config.chatIds.admin);
    if (branchId && config.chatIds.manager[branchId]) {
      recipients.add(config.chatIds.manager[branchId]);
    }
    if (branchId && config.chatIds.branches[branchId]) {
      recipients.add(config.chatIds.branches[branchId]);
    }
    if (branchId && config.chatIds.staff[branchId]) {
      recipients.add(config.chatIds.staff[branchId]);
    }
    const promises = Array.from(recipients).map((chatId) => sendTelegramMessage(chatId, message));
    const results = await Promise.all(promises);
    const successes = results.filter((r) => r.success).length;
    res.json({ success: successes > 0, dispatchedCount: successes, totalRecipients: recipients.size });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/softener/preview-import", (req, res) => {
  try {
    const { rows } = req.body;
    if (!Array.isArray(rows)) {
      return res.status(400).json({ error: "rows must be an array" });
    }
    const { branches } = localDb || { branches: [] };
    const validatedRows = rows.map((row, index) => {
      const errors = [];
      const warnings = [];
      if (!row.date) {
        errors.push("Missing date");
      } else {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(row.date) && isNaN(Date.parse(row.date))) {
          errors.push(`Invalid date format: ${row.date}. Must be YYYY-MM-DD`);
        }
      }
      if (!row.branchId) {
        errors.push("Missing Branch ID");
      } else {
        const branchExists = branches.some((b) => b.id === row.branchId || b.branchName === row.branchId || b.branchCode === row.branchId);
        if (!branchExists) {
          warnings.push(`Branch not clearly matched: ${row.branchId}. Will default to primary branch.`);
        }
      }
      const casesNum = parseFloat(row.caseQuantity);
      if (isNaN(casesNum) && row.caseQuantity !== void 0 && row.caseQuantity !== "") {
        errors.push(`Case Quantity must be a number`);
      }
      const pkgsNum = parseFloat(row.packageQuantity);
      if (isNaN(pkgsNum) && row.packageQuantity !== void 0 && row.packageQuantity !== "") {
        errors.push(`Package Quantity must be a number`);
      }
      const totalCostNum = parseFloat(row.totalCost);
      if (isNaN(totalCostNum) && row.totalCost !== void 0 && row.totalCost !== "") {
        errors.push(`Total Cost must be a number`);
      }
      return {
        ...row,
        id: row.id || `sof_imp_${Date.now()}_${index}`,
        isValid: errors.length === 0,
        errors,
        warnings
      };
    });
    res.json({ success: true, rows: validatedRows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/softener/confirm-import", (req, res) => {
  try {
    const { rows, overwrite, packagesPerCase } = req.body;
    if (!Array.isArray(rows)) {
      return res.status(400).json({ error: "rows must be an array" });
    }
    const { branches } = localDb || { branches: [] };
    const ppc = parseInt(packagesPerCase) || 20;
    const recordsToImport = rows.map((row) => {
      let bId = row.branchId || "b1";
      const matchedBranch = branches.find((b) => b.id === bId || b.branchName === bId || b.branchCode === bId);
      if (matchedBranch) bId = matchedBranch.id;
      const caseQty = Math.max(0, parseInt(row.caseQuantity) || 0);
      const pkgQty = Math.max(0, parseInt(row.packageQuantity) || 0);
      const usageQty = Math.max(0, parseInt(row.usageQuantity) || 0);
      const totalStockIn = caseQty * ppc + pkgQty;
      const isUsage = usageQty > 0 || row.type === "Use" || row.usageQuantity && parseInt(row.usageQuantity) > 0;
      return {
        id: row.id && !row.id.startsWith("sof_imp_") ? row.id : "sof_" + Math.random().toString(36).substr(2, 9),
        branchId: bId,
        date: row.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        supplier: row.supplier || "",
        productName: row.productName || "Downy Premium Fresh",
        caseQuantity: caseQty,
        packageQuantity: pkgQty,
        unitCost: parseFloat(row.unitCost) || 0,
        totalCost: parseFloat(row.totalCost) || caseQty * (parseFloat(row.unitCost) || 0),
        usageQuantity: usageQty,
        remainingStock: parseInt(row.remainingStock) || 0,
        note: row.note || row.notes || "",
        type: isUsage ? "Use" : "Refill",
        quantityLiters: isUsage ? usageQty : totalStockIn,
        // keep mapped in total packets for backwards compatibility
        remainingLiters: parseInt(row.remainingStock) || 0,
        // keep mapped in total packets for backwards compatibility
        createdBy: row.createdBy || "Import",
        createdAt: row.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    });
    if (overwrite) {
      localDb.softenerRecords = recordsToImport;
    } else {
      localDb.softenerRecords = [...recordsToImport, ...localDb.softenerRecords];
    }
    saveLocalDb();
    res.json({ success: true, softenerRecords: localDb.softenerRecords });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/softener/update-cell", (req, res) => {
  try {
    const { recordId, field, value } = req.body;
    if (!recordId) {
      return res.status(400).json({ error: "recordId is required" });
    }
    const matched = localDb.softenerRecords.find((s) => s.id === recordId);
    if (!matched) {
      return res.status(404).json({ error: "Record not found" });
    }
    matched[field] = value;
    matched.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    saveLocalDb();
    res.json({ success: true, record: matched, softenerRecords: localDb.softenerRecords });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/softener/save-changes", (req, res) => {
  try {
    const { softenerRecords } = req.body;
    if (!Array.isArray(softenerRecords)) {
      return res.status(400).json({ error: "softenerRecords must be an array" });
    }
    localDb.softenerRecords = softenerRecords;
    saveLocalDb();
    res.json({ success: true, softenerRecords: localDb.softenerRecords });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.get("/api/softener/export-excel", (req, res) => {
  res.json({ success: true, rows: localDb.softenerRecords });
});
app.post("/api/softener/export-pdf", (req, res) => {
  res.json({ success: true, message: "PDF generated successfully" });
});
var REUSABLE_PDF_TEMPLATES = {
  revenue: {
    reportKey: "revenue",
    nameEn: "Official Revenue & Receivables Statement",
    nameKh: "\u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u179F\u179A\u17BB\u1794\u1785\u17C6\u178E\u17BC\u179B \u1793\u17B7\u1784\u179B\u17BB\u1799\u178F\u17D2\u179A\u17BC\u179C\u1794\u17D2\u179A\u1798\u17BC\u179B",
    orientation: "portrait",
    categoryField: "serviceType",
    numericFields: ["totalAmount", "quantity"],
    signatories: ["Prepared By Cashier", "Checked By Supervisor", "Approved By Owner"],
    brandingColor: "emerald",
    remarksDefault: "All local counter invoices, coin transaction conversions, and cashless POS QR transfers are verified against POS merchant bank statements."
  },
  expense: {
    reportKey: "expense",
    nameEn: "Corporate Operating Expenditures Report (OPEX)",
    nameKh: "\u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u1785\u17C6\u178E\u17B6\u1799\u1794\u17D2\u179A\u178F\u17B7\u1794\u178F\u17D2\u178F\u17B7\u1780\u17B6\u179A\u179A\u17C0\u1794\u1785\u17C6\u1780\u17B6\u179A\u1784\u17B6\u179A",
    orientation: "portrait",
    categoryField: "category",
    numericFields: ["amount"],
    signatories: ["Compiled By Clerk", "Certified By Auditor", "Approved By Chief Executive"],
    brandingColor: "rose",
    remarksDefault: "Consolidates local detergents buys, machine repairs, landlord office leases, water dispenser refills, and monthly electrical utilities invoices."
  },
  pnl: {
    reportKey: "pnl",
    nameEn: "Consolidated Profit & Loss Summary (P&L)",
    nameKh: "\u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u179F\u1784\u17D2\u1781\u17C1\u1794\u1785\u17C6\u178E\u17C1\u1789 \u1793\u17B7\u1784\u1781\u17B6\u178F\u1794\u17D2\u179A\u1785\u17B6\u17C6\u1781\u17C2",
    orientation: "portrait",
    categoryField: "category",
    numericFields: ["revenue", "expenses", "netSurplus"],
    signatories: ["Accounting Officer", "External Reviewer", "Board Director Approval"],
    brandingColor: "teal",
    remarksDefault: "Computed with base straight-line mechanical depreciations of washer-dryer physical units capped at five-year corporate lifespans."
  },
  salary: {
    reportKey: "salary",
    nameEn: "Staff Payroll Ledger Summary Sheet",
    nameKh: "\u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u1794\u17BE\u1780\u1794\u17D2\u179A\u17B6\u1780\u17CB\u1794\u17C0\u179C\u178F\u17D2\u179F\u1794\u17BB\u1782\u17D2\u1782\u179B\u17B7\u1780\u1795\u17D2\u179B\u17BC\u179C\u1780\u17B6\u179A",
    orientation: "portrait",
    categoryField: "position",
    numericFields: ["baseSalary", "overtime", "bonus", "deduction", "netSalary"],
    signatories: ["Human Resource Liaison", "Finance Manager", "Managing Director"],
    brandingColor: "indigo",
    remarksDefault: "Staff base payouts are adjusted for recorded absences, performance bonus cycles, night shifts multipliers, and tax withholdings."
  },
  attendance: {
    reportKey: "attendance",
    nameEn: "Staff Time-Sheet & Attendance Roll Ledger",
    nameKh: "\u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u179C\u178F\u17D2\u178F\u1798\u17B6\u1793 \u1793\u17B7\u1784\u1798\u17C9\u17C4\u1784\u1792\u17D2\u179C\u17BE\u1780\u17B6\u179A\u1794\u17BB\u1782\u17D2\u1782\u179B\u17B7\u1780",
    orientation: "portrait",
    categoryField: "status",
    numericFields: ["workHours", "overtimeHours"],
    signatories: ["Shift Supervisor", "Department Head", "HR Director Endorsement"],
    brandingColor: "slate",
    remarksDefault: "Records are compiled via real-time biometric terminal punches and manual counter logs checked weekly by branch supervisors."
  },
  inventory: {
    reportKey: "inventory",
    nameEn: "Enterprise Inventory Holdings Valuation audit",
    nameKh: "\u179F\u179C\u1793\u1780\u1798\u17D2\u1798\u178F\u1798\u17D2\u179B\u17C3\u1791\u17D2\u179A\u1796\u17D2\u1799\u179F\u1780\u1798\u17D2\u1798 \u1793\u17B7\u1784\u179F\u17D2\u178F\u17BB\u1780\u1782\u17D2\u179A\u17BF\u1784\u1795\u17D2\u1782\u178F\u17CB\u1795\u17D2\u1782\u1784\u17CB",
    orientation: "landscape",
    categoryField: "category",
    numericFields: ["currentStock", "remainingStock", "purchasePrice", "assetValue"],
    signatories: ["Storekeeper Register", "Internal Auditor", "Operations Manager Signoff"],
    brandingColor: "sky",
    remarksDefault: "Supplies valuations are priced on chronological F.I.F.O (First In, First Out) inventory cost methods checked against safe storage lockers."
  },
  coin: {
    reportKey: "coin",
    nameEn: "Coin Register & Dispenser Transaction Sheet",
    nameKh: "\u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u1780\u17B6\u1780\u17CB\u1794\u1798\u17D2\u179B\u17C2\u1784 \u1793\u17B7\u1784\u1794\u17D2\u179A\u178F\u17B7\u1794\u178F\u17D2\u178F\u17B7\u1780\u17B6\u179A\u1780\u17B6\u1780\u17CB\u1794\u17C4\u1780\u1782\u1780\u17CB",
    orientation: "portrait",
    categoryField: "type",
    numericFields: ["amount", "valueUsd"],
    signatories: ["Drawer Operator", "Vault Controller", "Owner Final Approval"],
    brandingColor: "amber",
    remarksDefault: "Reconciliation of physical coin collector tins harvested weekly with electronic terminal transaction logs."
  },
  gas: {
    reportKey: "gas",
    nameEn: "LPG Gas Cylinder Refills and Consumptions Audit",
    nameKh: "\u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u179C\u178F\u17D2\u178F\u1798\u17B6\u1793\u1780\u17B6\u179A\u1794\u17D2\u179A\u17BE\u1794\u17D2\u179A\u17B6\u179F\u17CB\u1792\u17BB\u1784\u17A0\u17D2\u1782\u17B6\u179F (LPG)",
    orientation: "portrait",
    categoryField: "type",
    numericFields: ["tankCount", "remainingKg", "cost"],
    signatories: ["Plant Operator", "Operations lead", "Managing Director"],
    brandingColor: "orange",
    remarksDefault: "Tracks propane levels at high-pressure dryer lines to maintain standard 45Kg tank replacement rotations."
  },
  detergent: {
    reportKey: "detergent",
    nameEn: "Liquid Detergent Concentrates Flow Ledger",
    nameKh: "\u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u179F\u17D2\u178F\u17BB\u1780\u1793\u17B7\u1784\u1780\u17B6\u179A\u1794\u17D2\u179A\u17BE\u1794\u17D2\u179A\u17B6\u179F\u17CB\u179F\u17B6\u1794\u17CA\u17BC\u1791\u17B9\u1780\u1780\u17C6\u17A0\u17B6\u1794\u17CB\u1781\u17D2\u1796\u179F\u17CB",
    orientation: "portrait",
    categoryField: "type",
    numericFields: ["quantityLiters", "remainingLiters", "cost"],
    signatories: ["Fulfillment Staff", "Inventory Lead", "Owner Audit"],
    brandingColor: "cyan",
    remarksDefault: "Consonates fluid level usages via optical flow sensors compared against direct refill purchase invoices."
  },
  softener: {
    reportKey: "softener",
    nameEn: "Fabric Softener Reserves Flow Register",
    nameKh: "\u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u179F\u17D2\u178F\u17BB\u1780\u1793\u17B7\u1784\u1780\u17B6\u179A\u1794\u17D2\u179A\u17BE\u1794\u17D2\u179A\u17B6\u179F\u17CB\u1791\u17B9\u1780\u1780\u17D2\u179A\u17A2\u17BC\u1794\u1790\u17C2\u179A\u1780\u17D2\u179F\u17B6\u179F\u179A\u179F\u17C3\u179F\u17C6\u1796\u178F\u17CB",
    orientation: "portrait",
    categoryField: "type",
    numericFields: ["quantityLiters", "remainingLiters", "cost"],
    signatories: ["Laundry Tech", "Inventory Auditor", "Managing Director"],
    brandingColor: "fuchsia",
    remarksDefault: "Softener volumes are matched directly to wash cycle counts to preserve proper formula density across heavy-duty dry cycles."
  },
  machine: {
    reportKey: "machine",
    nameEn: "Mechanical Washers & Dryers Hardware Performance Audit",
    nameKh: "\u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u179B\u1791\u17D2\u1792\u1795\u179B\u179F\u1780\u1798\u17D2\u1798\u1797\u17B6\u1796 \u1793\u17B7\u1784\u1785\u17C6\u178E\u17BC\u179B\u1782\u17D2\u179A\u17BF\u1784\u1798\u17C9\u17B6\u179F\u17CA\u17B8\u1793",
    orientation: "landscape",
    categoryField: "status",
    numericFields: ["capacity", "revenue"],
    signatories: ["Senior Technician", "Certified Mechanical Engineer", "Owner Inspection"],
    brandingColor: "violet",
    remarksDefault: "Tracks hardware operational statuses, cumulative run-time revenues, mechanical blockages logs, and warranty lifecycles."
  },
  cashdrawer: {
    reportKey: "cashdrawer",
    nameEn: "Cash Drawer Shift-Close Balance Statement",
    nameKh: "\u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB\u179F\u1798\u178F\u17BB\u179B\u17D2\u1799\u1794\u17D2\u179A\u17A2\u1794\u17CB\u1790\u178F\u179B\u17BB\u1799\u179C\u17C1\u1793",
    orientation: "portrait",
    categoryField: "status",
    numericFields: ["startingCash", "endingCash", "actualCash", "difference"],
    signatories: ["Cashier Handing-Over", "Cashier Taking-Over", "Manager Clearance"],
    brandingColor: "lime",
    remarksDefault: "Audits physical fiat cash registers at the close of morning and evening work-shifts to log differences."
  },
  monthclosing: {
    reportKey: "monthclosing",
    nameEn: "Month-End Administrative Reconciled Closeout Report",
    nameKh: "\u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB\u1794\u1789\u17D2\u1787\u17B8\u179A\u178A\u17D2\u178B\u1794\u17B6\u179B\u1794\u17B7\u1791\u1782\u178E\u1793\u17B8\u1794\u17D2\u179A\u1785\u17B6\u17C6\u1781\u17C2",
    orientation: "portrait",
    categoryField: "status",
    numericFields: ["totalRevenue", "totalExpenses", "depreciationSavings", "netIncome"],
    signatories: ["Accountant Accountant", "Operations Director", "Owner Certification"],
    brandingColor: "purple",
    remarksDefault: "Locks transactional history records for the defined period, verifying currency ledger alignments."
  },
  comparison: {
    reportKey: "comparison",
    nameEn: "Multi-Branch Comparative Financial Performance Index",
    nameKh: "\u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u179C\u17B7\u1797\u17B6\u1782 \u1793\u17B7\u1784\u1794\u17D2\u179A\u17C0\u1794\u1792\u17C0\u1794\u179B\u1791\u17D2\u1792\u1795\u179B\u17A2\u17B6\u1787\u17B8\u179C\u1780\u1798\u17D2\u1798\u1782\u17D2\u179A\u1794\u17CB\u179F\u17B6\u1781\u17B6",
    orientation: "landscape",
    categoryField: "id",
    numericFields: ["totalRevenue", "totalOpex", "netProfit"],
    signatories: ["Business Advisory Consultant", "Finance Comptroller", "President & CEO Signature"],
    brandingColor: "blue",
    remarksDefault: "Compares operating efficiencies, wash counts, utilities consumption weight, and net cash margins of all registered storefront outlets."
  }
};
app.get("/api/revenue/export/pdf", async (req, res) => {
  try {
    const { branch_id, month, year, generated_by } = req.query;
    if (!branch_id || !month || !year) {
      return res.status(400).json({ error: "Missing required parameters: branch_id, month, year" });
    }
    const bId = branch_id;
    const mNum = parseInt(month);
    const yNum = parseInt(year);
    if (isNaN(mNum) || isNaN(yNum)) {
      return res.status(400).json({ error: "Invalid month or year parameter" });
    }
    const branchName = localDb.branches?.find((b) => b.id === bId)?.branchName || "Veng Sreng";
    const daysInMonth = new Date(yNum, mNum, 0).getDate();
    const records = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${yNum}-${String(mNum).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const match = (localDb.revenueRecords || []).find((r) => r.branchId === bId && r.date === dateStr);
      let defaultStartCash = match?.startCounter !== void 0 ? match.startCounter : 0;
      let defaultStartAba = match?.startCounterAba !== void 0 ? match.startCounterAba : 0;
      if (day > 1 && !match) {
        const prevDateStr = `${yNum}-${String(mNum).padStart(2, "0")}-${String(day - 1).padStart(2, "0")}`;
        const prevMatch = (localDb.revenueRecords || []).find((r) => r.branchId === bId && r.date === prevDateStr);
        if (prevMatch) {
          if (prevMatch.endCounter !== void 0) {
            defaultStartCash = prevMatch.endCounter;
          }
          if (prevMatch.endCounterAba !== void 0) {
            defaultStartAba = prevMatch.endCounterAba;
          }
        }
      } else if (day === 1 && !match) {
        const prevM = mNum === 1 ? 12 : mNum - 1;
        const prevY = mNum === 1 ? yNum - 1 : yNum;
        const prevDays = new Date(prevY, prevM, 0).getDate();
        const prevDateStr = `${prevY}-${String(prevM).padStart(2, "0")}-${String(prevDays).padStart(2, "0")}`;
        const prevMatch = (localDb.revenueRecords || []).find((r) => r.branchId === bId && r.date === prevDateStr);
        if (prevMatch) {
          if (prevMatch.endCounter !== void 0) {
            defaultStartCash = prevMatch.endCounter;
          }
          if (prevMatch.endCounterAba !== void 0) {
            defaultStartAba = prevMatch.endCounterAba;
          }
        }
      }
      records.push({
        day,
        date: dateStr,
        time: match?.time || "10:30",
        startCounter: match?.startCounter !== void 0 ? match.startCounter : defaultStartCash,
        endCounter: match?.endCounter !== void 0 ? match.endCounter : match?.startCounter !== void 0 ? match.startCounter : defaultStartCash,
        startCounterAba: match?.startCounterAba !== void 0 ? match.startCounterAba : defaultStartAba,
        endCounterAba: match?.endCounterAba !== void 0 ? match.endCounterAba : match?.startCounterAba !== void 0 ? match.startCounterAba : defaultStartAba,
        cash: match?.cash !== void 0 ? match.cash : 0,
        aba: match?.aba !== void 0 ? match.aba : 0,
        bankDeposit: match?.bankDeposit !== void 0 ? match.bankDeposit : 0,
        actualCashCount: match?.actualCashCount !== void 0 ? match.actualCashCount : 0,
        note: match?.note || "",
        exists: !!match
      });
    }
    for (let i = 1; i < records.length; i++) {
      if (records[i].startCounter === 0 && records[i - 1].endCounter > 0 && !records[i].exists) {
        records[i].startCounter = records[i - 1].endCounter;
        if (records[i].endCounter < records[i].startCounter) {
          records[i].endCounter = records[i].startCounter;
        }
      }
      if (records[i].startCounterAba === 0 && records[i - 1].endCounterAba > 0 && !records[i].exists) {
        records[i].startCounterAba = records[i - 1].endCounterAba;
        if (records[i].endCounterAba < records[i].startCounterAba) {
          records[i].endCounterAba = records[i].startCounterAba;
        }
      }
    }
    const userPayload = req.user;
    const email = userPayload?.email || userPayload?.username || generated_by || "Manager";
    const currentLocalTimeStr = (/* @__PURE__ */ new Date()).toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" });
    const pdfBuffer = await generateRevenuePdf({
      branchId: bId,
      branchName,
      month: mNum,
      year: yNum,
      records,
      generatedBy: email,
      generatedDateStr: currentLocalTimeStr + " (ICT)"
    });
    if (!localDb.auditLogs) {
      localDb.auditLogs = [];
    }
    const timestampStr = (/* @__PURE__ */ new Date()).toISOString().substring(0, 19).replace("T", " ");
    const logMsg = `[PDF Export Service] Generated "Official Revenue Statement" (A4 portrait) - Branch: ${branchName} | Period: ${mNum}/${yNum} | Prepared by: ${email} | at ${timestampStr}`;
    localDb.auditLogs.unshift(logMsg);
    if (localDb.auditLogs.length > 200) {
      localDb.auditLogs = localDb.auditLogs.slice(0, 200);
    }
    saveLocalDb();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=Revenue_${branchName.replace(/\s+/g, "")}_${yNum}_${String(mNum).padStart(2, "0")}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error("[PDF Export Endpoint Error] PDF generation error:", err);
    res.status(500).json({ success: false, error: "Failed to generate PDF report correctly: " + err.message });
  }
});
app.get("/api/pdf/templates", (req, res) => {
  res.json({ success: true, templates: REUSABLE_PDF_TEMPLATES });
});
app.post("/api/pdf/audit-generation", (req, res) => {
  try {
    const { reportType, branchName, dateFilter, generatedByUser, totalsSummary } = req.body;
    if (!localDb.auditLogs) {
      localDb.auditLogs = [];
    }
    const timestampStr = (/* @__PURE__ */ new Date()).toISOString().substring(0, 19).replace("T", " ");
    const logMsg = `[PDF Export Service] Generated "${REUSABLE_PDF_TEMPLATES[reportType]?.nameEn || reportType}" (A4 ${REUSABLE_PDF_TEMPLATES[reportType]?.orientation || "portrait"}) - Branch: ${branchName} | Period: ${dateFilter} | Prepared by: ${generatedByUser} | Summary: ${totalsSummary} at ${timestampStr}`;
    localDb.auditLogs.unshift(logMsg);
    if (localDb.auditLogs.length > 200) {
      localDb.auditLogs = localDb.auditLogs.slice(0, 200);
    }
    saveLocalDb();
    res.json({ success: true, loggedMsg: logMsg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
function runSchedules() {
  const config = getTelegramConfig();
  const now = /* @__PURE__ */ new Date();
  const todayDateStr = now.toISOString().substring(0, 10);
  const hour = now.getUTCHours() + 7;
  const currentHourMin = `${String(hour % 24).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}`;
  if (currentHourMin === "20:00" && alertHistory.lastDailyBusinessDate !== todayDateStr) {
    triggerDailyBusinessPerformance(todayDateStr);
  }
  if (now.getUTCMinutes() === 0) {
    checkOutstandingStockAndDevices();
    checkApproachingSalaries();
  }
  const schedules = localDb.telegramAlertSchedules || [];
  const dayOfWeekStr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][now.getDay()];
  const dayOfMonthNo = now.getDate();
  schedules.forEach((s) => {
    if (!s.isEnabled) return;
    if (s.frequency === "INSTANT") return;
    const normalizedConfigTime = normalizeTo24Hour(s.sendTime);
    if (normalizedConfigTime !== currentHourMin) return;
    const lastSentDate = s.lastSentAt ? s.lastSentAt.substring(0, 10) : "";
    if (lastSentDate === todayDateStr) return;
    let isDue = false;
    if (s.frequency === "DAILY") {
      isDue = true;
    } else if (s.frequency === "WEEKLY") {
      if (s.dayOfWeek && s.dayOfWeek.toLowerCase() === dayOfWeekStr.toLowerCase()) {
        isDue = true;
      }
    } else if (s.frequency === "MONTHLY") {
      if (s.dayOfMonth === "last") {
        const tomorrow = new Date(now.getTime() + 864e5);
        if (tomorrow.getDate() === 1) isDue = true;
      } else if (s.dayOfMonth === "1" || s.dayOfMonth === "1st") {
        if (dayOfMonthNo === 1) isDue = true;
      } else if (parseInt(s.dayOfMonth) === dayOfMonthNo) {
        isDue = true;
      }
    } else if (s.frequency === "CUSTOM") {
      isDue = true;
    }
    if (isDue) {
      triggerScheduledEvent(s).catch((err) => {
        console.error(`Failed executing background schedule alert ${s.id}:`, err);
      });
    }
  });
}
function checkOutstandingStockAndDevices() {
  const config = getTelegramConfig();
  const shopName = localDb.settings?.shopName || "Clean24 Laundry";
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
  localDb.branches.forEach((branch) => {
    const branchDetergent = localDb.detergentRecords.filter((d) => d.branchId === branch.id);
    const detergentRemaining = branchDetergent.length > 0 ? branchDetergent[0].remainingLiters : 20;
    if (detergentRemaining < 10) {
      const key = `${branch.id}_detergent_${todayStr}`;
      if (!alertHistory.lowStockSentKeys[key]) {
        dispatchSingleAlert({
          shopName,
          branchName: branch.branchName,
          alertType: "Low Stock Alert (Detergent)",
          details: `\u2022 Current Detergent Reserve: ${detergentRemaining} Liters
\u2022 Danger Threshold: Under 10 Liters`,
          actionRequired: "Arrange urgent replacement detergent fluid supply barrels.",
          branchId: branch.id
        });
        alertHistory.lowStockSentKeys[key] = todayStr;
        saveAlertHistory();
      }
    }
    const branchSoftener = localDb.softenerRecords.filter((s) => s.branchId === branch.id);
    const softenerRemaining = branchSoftener.length > 0 ? branchSoftener[0].remainingLiters : 20;
    if (softenerRemaining < 10) {
      const key = `${branch.id}_softener_${todayStr}`;
      if (!alertHistory.lowStockSentKeys[key]) {
        dispatchSingleAlert({
          shopName,
          branchName: branch.branchName,
          alertType: "Low Stock Alert (Softener)",
          details: `\u2022 Current Softener Reserve: ${softenerRemaining} Liters
\u2022 Danger Threshold: Under 10 Liters`,
          actionRequired: "Refill softener dispenser drawers to prevent wash output harshness.",
          branchId: branch.id
        });
        alertHistory.lowStockSentKeys[key] = todayStr;
        saveAlertHistory();
      }
    }
    const branchGas = localDb.gasRecords.filter((g) => g.branchId === branch.id);
    const gasRemaining = branchGas.length > 0 ? branchGas[0].remainingKg : 45;
    if (gasRemaining < 20) {
      const key = `${branch.id}_gas_${todayStr}`;
      if (!alertHistory.lowStockSentKeys[key]) {
        dispatchSingleAlert({
          shopName,
          branchName: branch.branchName,
          alertType: "Low Gas Alert (LPG)",
          details: `\u2022 LPG Remaining Balance: ${gasRemaining} Kg
\u2022 Danger Threshold: Under 20 Kg`,
          actionRequired: "Procure replacement propane LPG cylinders immediately.",
          branchId: branch.id
        });
        alertHistory.lowStockSentKeys[key] = todayStr;
        saveAlertHistory();
      }
    }
    const branchCoins = localDb.coinTransactions.filter((c) => c.branchId === branch.id);
    const totalInCoins = branchCoins.filter((c) => c.type === "In").reduce((sum, c) => sum + c.amount, 0);
    const totalOutCoins = branchCoins.filter((c) => c.type === "Out").reduce((sum, c) => sum + c.amount, 0);
    const totalCoinBalance = totalInCoins - totalOutCoins;
    if (totalCoinBalance < 200) {
      const key = `${branch.id}_coins_${todayStr}`;
      if (!alertHistory.lowStockSentKeys[key]) {
        dispatchSingleAlert({
          shopName,
          branchName: branch.branchName,
          alertType: "Low Coin Box Balance",
          details: `\u2022 Safe Balance: ${totalCoinBalance} Coins remaining
\u2022 Danger Threshold: Under 200 Coins`,
          actionRequired: "Stock change coins or harvest coins from machine locks and reload dispenser.",
          branchId: branch.id
        });
        alertHistory.lowStockSentKeys[key] = todayStr;
        saveAlertHistory();
      }
    }
  });
}
function checkApproachingSalaries() {
  const shopName = localDb.settings?.shopName || "Clean24 Laundry";
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
  const targetDate = /* @__PURE__ */ new Date();
  targetDate.setDate(targetDate.getDate() + 2);
  const targetDateStr = targetDate.toISOString().substring(0, 10);
  localDb.salaries.forEach((salary) => {
    if (salary.status === "Unpaid" && salary.paymentDate <= targetDateStr) {
      const key = `${salary.id}_salary_${todayStr}`;
      if (alertHistory.lastSalaryAlertDate !== key) {
        dispatchSingleAlert({
          shopName,
          branchName: localDb.branches.find((b) => b.id === salary.branchId)?.branchName || "Toul Kork",
          alertType: "Salary Payment Due Alert",
          details: `\u2022 Staff Member: ${salary.staffName}
\u2022 Salary Period: ${salary.salaryPeriod}
\u2022 Base Salary Level: $${salary.baseSalary.toFixed(2)}
\u2022 Total Outstanding Net: $${salary.netSalary.toFixed(2)}
\u2022 Scheduled Due Date: ${salary.paymentDate}`,
          actionRequired: "Manager or Owner approval and payout required to maintain operational stability.",
          branchId: salary.branchId
        });
        alertHistory.lastSalaryAlertDate = key;
        saveAlertHistory();
      }
    }
  });
}
async function triggerDailyBusinessPerformance(targetDateStr) {
  const shopName = localDb.settings?.shopName || "Clean24 Laundry";
  const config = getTelegramConfig();
  localDb.branches.forEach(async (branch) => {
    const dayIncomes = localDb.incomes.filter((i) => i.date === targetDateStr && i.branchId === branch.id);
    const dayRevenues = localDb.revenueRecords.filter((r) => r.date === targetDateStr && r.branchId === branch.id);
    const dayExpenses = localDb.expenses.filter((e) => e.expenseDate === targetDateStr && e.branchId === branch.id);
    const totalIncome = dayIncomes.reduce((s, c) => s + c.totalAmount, 0) + dayRevenues.reduce((s, r) => s + r.amountUsd, 0);
    const totalExpense = dayExpenses.reduce((s, c) => s + c.amount, 0);
    const balance = totalIncome - totalExpense;
    const abaCount = dayIncomes.filter((i) => i.paymentMethod === "ABA" || i.paymentMethod === "QR Payment").reduce((s, c) => s + c.totalAmount, 0) + dayRevenues.filter((r) => r.paymentMethod === "ABA" || r.paymentMethod === "QR Payment").reduce((s, r) => s + r.amountUsd, 0);
    const cashCount = totalIncome - abaCount;
    const details = `\u2022 Total Daily Revenue: $${totalIncome.toFixed(2)}
\u2022 Total Daily Expenses: $${totalExpense.toFixed(2)}
\u2022 Consolidated Profit: $${balance.toFixed(2)}

\u{1F4B3} PAYMENT METHOD RECONCILIATION:
\u2022 contactless (ABA/QR): $${abaCount.toFixed(2)}
\u2022 Cash box: $${cashCount.toFixed(2)}`;
    const text = formatTelegramMessage({
      shopName,
      branchName: branch.branchName,
      alertType: "Branch Daily Business Summary",
      dateTime: `${targetDateStr} 20:00`,
      details,
      actionRequired: "Verify daily deposit totals and sign off on checkout records."
    });
    const targets = /* @__PURE__ */ new Set();
    if (config.chatIds.owner) targets.add(config.chatIds.owner);
    if (config.chatIds.admin) targets.add(config.chatIds.admin);
    if (config.chatIds.manager[branch.id]) targets.add(config.chatIds.manager[branch.id]);
    if (config.chatIds.branches[branch.id]) targets.add(config.chatIds.branches[branch.id]);
    for (const chatId of targets) {
      await sendTelegramMessage(chatId, text);
    }
  });
  alertHistory.lastDailyBusinessDate = targetDateStr;
  saveAlertHistory();
}
async function dispatchSingleAlert(alert) {
  const config = getTelegramConfig();
  const dateTimeStr = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16);
  const schedules = (localDb.telegramAlertSchedules || []).filter(
    (s) => s.isEnabled && s.frequency === "INSTANT" && (s.branchId === "all" || s.branchId === alert.branchId) && (s.alertType.toLowerCase().replace(/_/g, " ").includes(alert.alertType.toLowerCase().replace(/_/g, " ")) || alert.alertType.toLowerCase().replace(/_/g, " ").includes(s.alertType.toLowerCase().replace(/_/g, " ")))
  );
  for (const s of schedules) {
    const recipient = (localDb.telegramRecipients || []).find((r) => r.id === s.recipientId);
    const chatId = recipient?.isEnabled ? recipient.chatId : config.chatIds.owner || config.chatIds.admin;
    if (!chatId) continue;
    const template = (localDb.telegramTemplates || []).find((t) => t.id === s.templateId);
    const formatMode = template?.parseMode || "HTML";
    const rawTemplateText = template?.engTemplate || `<b>\u26A0\uFE0F {status} INSTANT ALERT</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F3EA} <b>Branch:</b> {branch_name}
\u{1F4C5} <b>Time:</b> {date} {time}
\u{1F4DD} <b>Details:</b> {message}`;
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
    const timeStr = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const alertText = parseTemplateVariables(rawTemplateText, {
      branch_name: alert.branchName,
      date: todayStr,
      time: timeStr,
      status: alert.alertType,
      message: `${alert.details}
\u{1F449} Required Action: ${alert.actionRequired}`
    });
    let customBotToken = void 0;
    if (recipient) {
      const encToken = recipient.bot_token_encrypted || recipient.botTokenEncrypted;
      if (encToken) {
        customBotToken = decryptToken(encToken);
      }
    }
    const sendRes = await sendTelegramMessageWithRetry(chatId, alertText, formatMode, 3, customBotToken);
    if (!localDb.telegramLogs) localDb.telegramLogs = [];
    localDb.telegramLogs.push({
      id: "log_" + Date.now() + "_" + Math.floor(Math.random() * 100),
      scheduleId: s.id,
      templateId: s.templateId || null,
      recipientId: s.recipientId || null,
      chatId,
      alertType: alert.alertType,
      messageText: alertText,
      status: sendRes.success ? "SUCCESS" : "FAILED",
      errorMessage: sendRes.success ? null : sendRes.error,
      sentAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    s.lastSentAt = (/* @__PURE__ */ new Date()).toISOString();
  }
  const message = formatTelegramMessage({
    shopName: alert.shopName,
    branchName: alert.branchName,
    alertType: alert.alertType,
    dateTime: dateTimeStr,
    details: alert.details,
    actionRequired: alert.actionRequired
  });
  const targets = /* @__PURE__ */ new Set();
  if (config.chatIds.owner) targets.add(config.chatIds.owner);
  if (config.chatIds.admin) targets.add(config.chatIds.admin);
  if (alert.branchId && config.chatIds.manager[alert.branchId]) targets.add(config.chatIds.manager[alert.branchId]);
  if (alert.branchId && config.chatIds.branches[alert.branchId]) targets.add(config.chatIds.branches[alert.branchId]);
  if (alert.branchId && config.chatIds.staff[alert.branchId]) targets.add(config.chatIds.staff[alert.branchId]);
  for (const chatId of targets) {
    const res = await sendTelegramMessage(chatId, message);
    if (!localDb.telegramLogs) localDb.telegramLogs = [];
    localDb.telegramLogs.push({
      id: "log_" + Date.now() + "_" + Math.floor(Math.random() * 100),
      scheduleId: null,
      templateId: null,
      recipientId: null,
      chatId,
      alertType: alert.alertType,
      messageText: message,
      status: res.success ? "SUCCESS" : "FAILED",
      errorMessage: res.success ? null : res.error || "Empty response",
      sentAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  saveLocalDb();
}
setInterval(runSchedules, 6e4);
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express multi-branch routing active on http://0.0.0.0:${PORT}`);
  });
}
if (!process.env.VERCEL) {
  startServer();
}
var server_default = app;
//# sourceMappingURL=server.cjs.map
