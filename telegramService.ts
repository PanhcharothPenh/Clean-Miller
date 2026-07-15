import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface FeatureConfig {
  chatId: string;
  isEnabled: boolean;
}

export interface TelegramConfig {
  botToken: string;
  enabledAlerts: string[]; // e.g., ['low_stock', 'salary', 'daily_business', 'branch', 'machine']
  chatIds: {
    owner: string;
    admin: string;
    manager: Record<string, string>; // branchId -> chatId
    staff: Record<string, string>;   // branchId -> chatId
    branches: Record<string, string>; // branchId -> chatId
  };
  features?: {
    lowStock?: FeatureConfig;
    machineAlert?: FeatureConfig;
    payrollAlert?: FeatureConfig;
    dailySummary?: FeatureConfig;
  };
}

const CONFIG_PATH = path.join(process.cwd(), 'telegram-config.json');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'clean24_secret_key_32_characters_!!'; // 32 characters
const IV_LENGTH = 16;

const defaultConfig: TelegramConfig = {
  botToken: '',
  enabledAlerts: ['low_stock', 'salary', 'daily_business', 'branch', 'machine'],
  chatIds: {
    owner: '',
    admin: '',
    manager: {},
    staff: {},
    branches: {}
  }
};

export function getTelegramConfig(): TelegramConfig {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read telegram config:', e);
  }
  return { ...defaultConfig };
}

export function saveTelegramConfig(config: TelegramConfig): void {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save telegram config:', e);
  }
}

// Security: AES-256 Token Encryption & Decryption
export function encryptToken(text: string): string {
  if (!text) return '';
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).substring(0, 32)), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (e) {
    // Fallback obfuscation if anything fails
    return Buffer.from(text).toString('base64');
  }
}

export function decryptToken(encryptedText: string): string {
  if (!encryptedText) return '';
  try {
    const textParts = encryptedText.split(':');
    if (textParts.length !== 2) {
      return Buffer.from(encryptedText, 'base64').toString('utf8');
    }
    const iv = Buffer.from(textParts[0], 'hex');
    const encrypted = Buffer.from(textParts[1], 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).substring(0, 32)), iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (e) {
    try {
      return Buffer.from(encryptedText, 'base64').toString('utf8');
    } catch {
      return encryptedText;
    }
  }
}

// Token Masking, example: 123456:****abcd
export function maskToken(token: string): string {
  if (!token) return '';
  const parts = token.split(':');
  if (parts.length >= 2) {
    const botId = parts[0];
    const rest = parts.slice(1).join(':');
    const lastFour = rest.length > 4 ? rest.substring(rest.length - 4) : rest;
    return `${botId}:****${lastFour}`;
  }
  if (token.length > 8) {
    return `${token.substring(0, 6)}:****${token.substring(token.length - 4)}`;
  }
  return '****';
}

export interface AlertData {
  shopName: string;
  branchName: string;
  alertType: string;
  dateTime: string;
  details: string;
  actionRequired: string;
}

export function formatTelegramMessage(data: AlertData): string {
  return `<b>🧼 ${data.shopName.toUpperCase()} ALERT SYSTEM</b>
━━━━━━━━━━━━━━━━━
<b>📢 TYPE:</b> <code>${data.alertType}</code>
<b>🏪 BRANCH:</b> <b>${data.branchName}</b>
<b>📅 TIME:</b> <code>${data.dateTime}</code>

<b>📝 DETAILS:</b>
${data.details}

<b>⚠️ REQUIRED ACTION:</b>
<u>${data.actionRequired}</u>
━━━━━━━━━━━━━━━━━`;
}

export async function sendTelegramMessage(
  chatId: string, 
  text: string, 
  parseMode: 'HTML' | 'Markdown' = 'HTML', 
  customBotToken?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    let token = customBotToken;
    if (!token) {
      const config = getTelegramConfig();
      token = config.botToken;
    }
    
    if (!token) {
      return { success: false, error: 'Telegram Bot Token is not configured' };
    }
    if (!chatId) {
      return { success: false, error: 'Chat ID is missing or empty' };
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: parseMode
      })
    });

    const body = await response.json() as any;
    if (body.ok) {
      return { success: true };
    } else {
      return { success: false, error: body.description || 'Unknown Telegram API Error' };
    }
  } catch (err: any) {
    console.error('Error sending Telegram notification:', err);
    return { success: false, error: err.message || 'Network error sending to Telegram' };
  }
}
