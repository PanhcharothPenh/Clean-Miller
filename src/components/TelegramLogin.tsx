/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Languages, Loader2, User, Shield, Check, Info, ArrowLeft, Send, ExternalLink } from 'lucide-react';
import { saveSession, authApi } from '../utils/api';
import Clean24Logo from './Clean24Logo';

interface TelegramLoginProps {
  onLoginSuccess: (user: any) => void;
  lang: 'en' | 'kh';
  setLang: (lang: 'en' | 'kh') => void;
}

export default function TelegramLogin({ onLoginSuccess, lang, setLang }: TelegramLoginProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isInsideTelegram, setIsInsideTelegram] = useState<boolean>(false);
  const [tgInitData, setTgInitData] = useState<string>('');
  
  // Custom navigation between credentials and Telegram Approval request (Simulator removed for Production)
  const [activeTab, setActiveTab] = useState<'credentials' | 'sso'>('credentials');
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);

  // Telegram Bot Login Approval States
  const [tgApprovalUsername, setTgApprovalUsername] = useState<string>('');
  const [loginSessionId, setLoginSessionId] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<'idle' | 'pending' | 'approved' | 'denied' | 'expired'>('idle');

  // Two-Factor states
  const [mfaRequired, setMfaRequired] = useState<boolean>(false);
  const [mfaToken, setMfaToken] = useState<string>('');
  const [mfaMethod, setMfaMethod] = useState<'telegram' | 'email' | 'authenticator_app'>('telegram');
  const [otpCode, setOtpCode] = useState<string>('');
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [telegramMfaError, setTelegramMfaError] = useState<string | null>(null);

  // Retrieve remembered username on mount
  useEffect(() => {
    const remembered = authApi.getRememberedUser();
    if (remembered) {
      setUsernameOrEmail(remembered);
      setRemember(true);
    }
  }, []);

  // Dynamically set body background
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#dbeafe'; // soft background color
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  // Poll login approval status
  useEffect(() => {
    let active = true;
    let interval: any = null;

    if (approvalStatus === 'pending' && loginSessionId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/auth/telegram/login-status/${loginSessionId}`);
          if (!res.ok) return;
          const data = await res.json();
          if (active) {
            if (data.status === 'approved') {
              setApprovalStatus('approved');
              setSuccess(lang === 'en' ? 'Login approved! Opening workspace...' : 'ការចូលត្រូវបានអនុញ្ញាត! កំពុងបើកដំណើរការ...');
              if (interval) clearInterval(interval);
              
              // save session
              saveSession(data.accessToken, data.refreshToken, data.user);
              setTimeout(() => {
                onLoginSuccess(data.user);
              }, 800);
            } else if (data.status === 'denied') {
              setApprovalStatus('denied');
              setError(lang === 'en' ? 'Login request denied by Owner/Admin.' : 'សំណើចូលប្រើប្រាស់ត្រូវបានបដិសេធដោយម្ចាស់ហាង។');
              if (interval) clearInterval(interval);
            } else if (data.status === 'expired') {
              setApprovalStatus('expired');
              setError(lang === 'en' ? 'Request session has expired. Please try again.' : 'សំណើបានហួសពេលកំណត់។ សូមព្យាយាមម្តងទៀត។');
              if (interval) clearInterval(interval);
            }
          }
        } catch (e) {
          // ignore network errors
        }
      }, 2000);
    }

    return () => {
      active = false;
      if (interval) clearInterval(interval);
    };
  }, [approvalStatus, loginSessionId, lang]);

  const handleTelegramApprovalLoginRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tgApprovalUsername) {
      setError(lang === 'en' ? 'Please enter your Telegram username' : 'សូមបញ្ចូលឈ្មោះគណនី Telegram របស់អ្នក');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setApprovalStatus('pending');

    try {
      const cleanUsername = tgApprovalUsername.replace('@', '').trim();
      const res = await fetch('/api/auth/telegram/login-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch login request');
      }

      setLoginSessionId(data.sessionId);
      setSuccess(lang === 'en' ? 'Approval request successfully sent to Owner/Admin Telegram!' : 'សំណើត្រូវបានបញ្ជូនទៅតេឡេក្រាមម្ចាស់ហាងរួចរាល់!');
    } catch (err: any) {
      setError(err.message || 'Failed to connect to authentication gateway.');
      setApprovalStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setError(lang === 'en' ? 'Username/email and password are required' : 'ឈ្មោះអ្នកប្រើប្រាស់/អ៊ីមែល និងលេខកូដសម្ងាត់ គឺពុំអាចទទេបានឡើយ');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setSimulatedOtp(null);
    setTelegramMfaError(null);

    try {
      const result = await authApi.login(usernameOrEmail, password, remember);
      
      if (result && result.require2fa) {
        setMfaToken(result.mfaToken);
        setMfaMethod(result.method);
        setMfaRequired(true);
        if (result.simulatedOtp) {
          setSimulatedOtp(result.simulatedOtp);
        }
        if (result.telegramError) {
          setTelegramMfaError(result.telegramError);
        }
        setSuccess(lang === 'en' ? 'Two-Factor challenge initiated successfully.' : 'ការផ្ទៀងផ្ទាត់ពីរជំហានត្រូវបានកេះឡើងដោយជោគជ័យ។');
      } else {
        setSuccess(t.connectedSuccessfully);
        setTimeout(() => {
          onLoginSuccess(result);
        }, 700);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Invalid credentials or network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setError(lang === 'en' ? 'Please enter a valid 6-digit OTP code' : 'សូមបញ្ចូលលេខកូដសម្ងាត់ ៦ ខ្ទង់ឱ្យបានត្រឹមត្រូវ');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const user = await authApi.verify2fa(mfaToken, otpCode);
      setSuccess(t.connectedSuccessfully);
      setTimeout(() => {
        onLoginSuccess(user);
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Incorrect OTP code or expired session. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Detect and initialize Telegram WebApp SDK context on mount
  useEffect(() => {
    const webApp = (window as any).Telegram?.WebApp;
    if (webApp && webApp.initData) {
      setIsInsideTelegram(true);
      setTgInitData(webApp.initData);
      
      if (webApp.ready) webApp.ready();
      if (webApp.expand) webApp.expand();

      // Trigger automatic background authentication if inside Telegram
      autoAuthenticateLive(webApp.initData);
    }
  }, []);

  // Dispatch live WebApp validation handshake to server
  const autoAuthenticateLive = async (initDataStr: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/telegram/webapp-validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: initDataStr })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Telegram handshake failed signature validation check.");
      }

      const { accessToken, refreshToken, user } = await response.json();
      saveSession(accessToken, refreshToken, user);
      
      setSuccess(t.connectedSuccessfully);
      setTimeout(() => {
        onLoginSuccess(user);
      }, 800);
    } catch (err: any) {
      setError(err.message || "An unexpected network error interrupted the validation.");
    } finally {
      setLoading(false);
    }
  };
  
  // Pending activation states
  const [pendingUser, setPendingUser] = useState<{ username: string; fullName: string } | null>(null);
  const [approvalSent, setApprovalSent] = useState<boolean>(false);
  const [simulateApprovalLink, setSimulateApprovalLink] = useState<string | null>(null);

  const handleRequestApproval = async () => {
    if (!pendingUser) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/telegram/request-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: pendingUser.username,
          fullName: pendingUser.fullName
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to dispatch Telegram request.');
      }

      const data = await response.json();
      setApprovalSent(true);
      if (data.simulatedLink) {
        setSimulateApprovalLink(data.simulatedLink);
      }
    } catch (err: any) {
      setError(err.message || 'Approval relay network error.');
    } finally {
      setLoading(false);
    }
  };

  const t = {
    en: {
      title: "Clean24 Laundry",
      tagline: "Log in or sign up",
      telegramMode: "Telegram WebApp Mode",
      onlyAuthorized: "Authenticated Telegram identity required.",
      connectingTelegram: "Securing Telegram connection...",
      connectedSuccessfully: "Authorized successfully!",
      retryBtn: "Retry WebApp Handshake",
      submitBtn: "Log in",
      alertMode: "Bilingual Authentication Portal",
      tabCredentials: "Password",
      tabSSO: "Telegram Approval",
      usernameOrEmailLabel: "Email address or Username",
      passwordLabel: "Password",
      rememberMeLabel: "Remember this device",
      pendingTitle: "Activation Pending",
      pendingDesc: "Your account is verified, but administrative approval is required.",
      btnRequestApproval: "Connect to Bot & Request Approval",
      requestSentSuccess: "Verification alarm successfully dispatched to Telegram!",
      simulationTitle: "Approval Link Preview",
      simulationNotice: "Bypass verification by clicking this link:",
      clickToApprove: "Approve account automatically",
      btnGoBack: "Go back to Sign-In"
    },
    kh: {
      title: "ប្រព័ន្ធគ្រប់គ្រង Clean24",
      tagline: "ចូលប្រើប្រាស់គណនី",
      telegramMode: "ប្រព័ន្ធ Telegram WebApp",
      onlyAuthorized: "តម្រូវឱ្យមានការអនុញ្ញាតពីគណនី Telegram។",
      connectingTelegram: "កំពុងផ្ទៀងផ្ទាត់ជាមួយ Telegram...",
      connectedSuccessfully: "ចូលប្រើប្រាស់ដោយជោគជ័យ!",
      retryBtn: "ព្យាយាមម្តងទៀត",
      submitBtn: "ចូលប្រព័ន្ធ",
      alertMode: "ច្រកទ្វារសុវត្ថិភាព Clean24",
      tabCredentials: "លេខកូដសម្ងាត់",
      tabSSO: "អនុញ្ញាតតាម Telegram",
      usernameOrEmailLabel: "អ៊ីមែល ឬ ឈ្មោះអ្នកប្រើប្រាស់",
      passwordLabel: "លេខកូដសម្ងាត់",
      rememberMeLabel: "ចងចាំឧបករណ៍នេះ",
      pendingTitle: "រង់ចាំការអនុញ្ញាតសិទ្ធិ",
      pendingDesc: "គណនីរបស់អ្នកត្រូវបានផ្ទៀងផ្ទាត់រួចរាល់ ប៉ុន្តែត្រូវការការអនុញ្ញាតពីប្រធានគ្រប់គ្រងជាមុនសិន។",
      btnRequestApproval: "ស្នើសុំការអនុញ្ញាតសិទ្ធិតាម Telegram",
      requestSentSuccess: "សារស្នើសុំសិទ្ធិត្រូវបានបញ្ជូនទៅកាន់ Telegram រួចរាល់ហើយ!",
      simulationTitle: "តំណភ្ជាប់អនុញ្ញាតសិទ្ធិ",
      simulationNotice: "ចុចទីនេះដើម្បីធ្វើការអនុញ្ញាតសិទ្ធិភ្លាមៗ៖",
      clickToApprove: "យល់ព្រមអនុញ្ញាតគណនី",
      btnGoBack: "ត្រឡប់ទៅទំព័រចូលប្រព័ន្ធ"
    }
  }[lang];

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-[#e0f2fe] via-[#f5f3ff] to-[#c7d2fe] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans select-none relative overflow-hidden">
      
      {/* Decorative Floating Mesh Orbs & Badges just like GEIST page */}
      <div className="absolute top-1/6 left-1/10 w-96 h-96 rounded-full bg-blue-300/20 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/5 right-1/10 w-[450px] h-[450px] rounded-full bg-purple-300/20 blur-[130px] pointer-events-none"></div>
      
      {/* Floating glassmorphic badges in the backdrop mimicking the Geist screenshot */}
      <div className="absolute top-20 left-10 hidden lg:block bg-white/20 border border-white/30 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] text-slate-500 font-bold tracking-wider shadow-sm transform -rotate-6">
        Miller
      </div>
      <div className="absolute bottom-20 left-20 hidden lg:block bg-white/20 border border-white/30 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] text-slate-500 font-bold tracking-wider shadow-sm">
        EST. 2026 MAY
      </div>

      {/* Absolute Language Switcher */}
      <div className="absolute top-6 right-6 flex items-center bg-white border border-slate-200/80 rounded-xl p-1.5 shadow-sm z-30">
        <Languages size={14} className="text-blue-600 mr-1" />
        <button
          onClick={() => setLang(lang === 'en' ? 'kh' : 'en')}
          className="text-xs text-slate-700 hover:text-blue-600 font-bold transition-colors px-2 py-0.5 cursor-pointer"
          id="login_lang_toggle"
        >
          {lang === 'en' ? 'ភាសាខ្មែរ 🇰🇭' : 'English 🇺🇸'}
        </button>
      </div>

      {/* Main floating white glass card */}
      <div className="w-full max-w-[430px] bg-white border border-slate-200/60 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-sm transition-all duration-300 hover:shadow-3xl">

        {/* Brand Heading */}
        <div className="mb-6 pt-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            {lang === 'en' ? 'Digital Operations Center' : 'មជ្ឈមណ្ឌលប្រតិបត្តិការឌីជីថល'}
          </h2>
        </div>

        {/* Display Status Messages */}
        {error && (
          <div className="mb-5 bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-xs text-left flex items-start gap-2.5" id="login_error_alert">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 flex-shrink-0"></span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-5 bg-emerald-50 border border-emerald-250 rounded-xl p-3 text-emerald-700 text-xs text-left" id="login_success_alert">
            <div className="flex items-start gap-2">
              <Check size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* SUBVIEWS CONDITIONAL ROUTER */}
        {pendingUser ? (
          <div className="space-y-4" id="profile_activation_pending_view">
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 font-extrabold mb-3">
                !
              </div>
              <h3 className="text-sm font-bold text-slate-900">{t.pendingTitle}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold mt-2">
                {t.pendingDesc}
              </p>
              <div className="mt-3 px-3 py-1 bg-white rounded-lg border border-slate-150">
                <span className="text-[10px] text-slate-700 font-mono">
                  @{pendingUser.username} ({pendingUser.fullName})
                </span>
              </div>
            </div>

            {!approvalSent ? (
              <button
                onClick={handleRequestApproval}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                <span>{t.btnRequestApproval}</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-xs text-emerald-850 font-semibold flex items-center justify-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span>{t.requestSentSuccess}</span>
                </div>
                {simulateApprovalLink && (
                  <div className="bg-slate-55 border border-slate-200 p-3 rounded-xl text-left space-y-1.5">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                      {t.simulationTitle}
                    </span>
                    <a
                      href={simulateApprovalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-blue-600 hover:underline"
                    >
                      <span>{t.clickToApprove}</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setPendingUser(null);
                setApprovalSent(false);
                setSimulateApprovalLink(null);
                setError(null);
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
            >
              <ArrowLeft size={12} />
              <span>{t.btnGoBack}</span>
            </button>
          </div>
        ) : isInsideTelegram ? (
          <div className="space-y-6 text-center" id="tg_web_app_connected_view">
            <div className="py-4 flex flex-col items-center">
              <div className="w-12 h-12 bg-[#229ED9]/10 rounded-full flex items-center justify-center text-[#229ED9] mb-3">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.62.15-.15 2.7l2.46-2.25c.14-.14.17-.5.1-.6-.07-.12-.24-.08-.34-.05l-3.4 2.15-3.3-1.1c-.7-.22-.73-.7.15-.1.04-1.1 5.9-4.25 5.9-4.25 2.2-.82 4.14-.15 4.14-.15.48.1.66.45.62.9z"/>
                </svg>
              </div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">{t.telegramMode}</h3>
              <p className="text-[11px] text-slate-450 mt-1 max-w-xs">{t.onlyAuthorized}</p>
            </div>
            <div className="bg-slate-55 border border-slate-200 rounded-xl p-3 flex items-center justify-center gap-2">
              <Loader2 size={15} className="text-sky-500 animate-spin" />
              <span className="text-xs text-slate-600 font-semibold">{t.connectingTelegram}</span>
            </div>
            <button
              onClick={() => autoAuthenticateLive(tgInitData)}
              disabled={loading}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-200 transition-all cursor-pointer"
            >
              {t.retryBtn}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            
            {activeTab === 'credentials' && (
              <form onSubmit={handleCredentialsLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {t.usernameOrEmailLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-sans"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {t.passwordLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setError(lang === 'en' ? 'Please request resetting permissions from branch administrator.' : 'សូមទាក់ទងអ្នកគ្រប់គ្រងដើម្បីស្នើសុំកំណត់លេខសម្ងាត់ឡើងវិញ។');
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      {lang === 'en' ? 'Reset password' : 'កំណត់ឡើងវិញ'}
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-mono"
                  />
                </div>

                <div className="pt-1">
                  <div className="flex items-start">
                    <input
                      id="remember_check"
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="mt-0.5 h-4.5 w-4.5 rounded border-slate-350 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                    />
                    <label htmlFor="remember_check" className="ml-2 block text-[11px] font-bold text-slate-500 leading-normal cursor-pointer">
                      {t.rememberMeLabel}
                    </label>
                  </div>
                </div>

                {/* Primary blue Log in and secondary tab togglers */}
                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    {loading ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
                    <span>{t.submitBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('sso');
                      setError(null);
                      setSuccess(null);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer border border-slate-200/50"
                  >
                    <span>{lang === 'en' ? 'Bot SSO Login' : 'ចូលតាមតេឡេក្រាម'}</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'sso' && (
              <div className="space-y-4">
                {approvalStatus === 'pending' ? (
                  <div className="bg-slate-55 border border-slate-200 rounded-2xl p-5 text-center space-y-4">
                    <div className="relative flex items-center justify-center">
                      <Loader2 size={32} className="animate-spin text-sky-600" />
                      <svg className="w-5 h-5 fill-current text-sky-500 absolute" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.62.15-.15 2.7l2.46-2.25c.14-.14.17-.5.1-.6-.07-.12-.24-.08-.34-.05l-3.4 2.15-3.3-1.1c-.7-.22-.73-.7.15-.1.04-1.1 5.9-4.25 5.9-4.25 2.2-.82 4.14-.15 4.14-.15.48.1.66.45.62.9z"/>
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800">
                        {lang === 'kh' ? 'រង់ចាំការអនុញ្ញាត...' : 'Waiting for Approval...'}
                      </h4>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        {lang === 'kh' 
                          ? 'សំណើចូលប្រើប្រាស់ត្រូវបានផ្ញើទៅកាន់ម្ចាស់ហាងរួចហើយ។ សូមពិនិត្យមើលកម្មវិធី Telegram ដើម្បីអនុញ្ញាត (Approve) ការចូលនេះ។'
                          : 'A login approval request has been sent to the Owner/Admin. Please approve it on Telegram to sign in automatically.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setApprovalStatus('idle');
                        setLoginSessionId(null);
                        setError(null);
                      }}
                      className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold transition cursor-pointer"
                    >
                      {lang === 'kh' ? 'បោះបង់ (Cancel)' : 'Cancel Request'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTelegramApprovalLoginRequest} className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Shield size={15} />
                        <h4 className="text-xs font-black uppercase tracking-wider">
                          {t.tabSSO}
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                        {lang === 'kh' 
                          ? 'បញ្ចូលឈ្មោះគណនី Telegram របស់អ្នក ដើម្បីផ្ញើសំណើចូលប្រព័ន្ធទៅកាន់ម្ចាស់ហាងដើម្បីអនុញ្ញាត។'
                          : 'Enter your Telegram username to request immediate sign-in authorization from Owner/Admin.'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        {lang === 'kh' ? 'ឈ្មោះគណនី Telegram (Username)' : 'Telegram Username'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                          @
                        </div>
                        <input
                          type="text"
                          value={tgApprovalUsername}
                          onChange={(e) => setTgApprovalUsername(e.target.value)}
                          placeholder="username"
                          className="w-full bg-slate-55 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-7 pr-3 py-2.5 text-slate-800 text-xs font-semibold transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                      >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={13} />}
                        <span>
                          {loading 
                            ? (lang === 'kh' ? 'កំពុងផ្ញើសំណើ...' : 'Sending Request...') 
                            : (lang === 'kh' ? 'ផ្ញើសំណើចូលប្រព័ន្ធ' : 'Request Access')}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('credentials');
                          setError(null);
                          setSuccess(null);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer border border-slate-200/50"
                      >
                        <span>{lang === 'en' ? 'Password Login' : 'ចូលតាមលេខកូដ'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer info link */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold tracking-wide">
          <span>{t.alertMode}</span>
          <button 
            onClick={() => setError(lang === 'en' ? 'Support hotline: +855 23 888 224' : 'លេខទូរស័ព្ទគាំទ្រ៖ +855 23 888 224')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            {lang === 'en' ? 'Help Center' : 'ទាក់ទងគាំទ្រ'}
          </button>
        </div>

      </div>
    </div>
  );
}
