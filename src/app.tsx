/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Globe,
  Dna,
  Calculator,
  FlaskConical,
  Atom,
  Sun,
  Moon,
  Eye,
  EyeOff,
  User,
  Wallet,
  MapPin,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  Play,
  Check,
  Image as ImageIcon,
  LockKeyhole,
  MessageCircle,
  Video,
  LogOut,
  ExternalLink,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

import { StudentProfile, ViewType, LanguageType, StageType, Subject, Video as VideoType } from './types';
import { GOVERNORATES, WALLETS, PRESET_AVATARS, SUBJECTS, DICTIONARY } from './data';

// Helper to safely load initially from localStorage
const loadAccounts = (): Record<string, StudentProfile & { passwordHash: string }> => {
  const data = localStorage.getItem('al_jarabee_accounts');
  return data ? JSON.parse(data) : {};
};

// Helper to save accounts
const saveAccounts = (accounts: Record<string, StudentProfile & { passwordHash: string }>) => {
  localStorage.setItem('al_jarabee_accounts', JSON.stringify(accounts));
};

export default function App() {
  // --- UI States ---
  const [lang, setLang] = useState<LanguageType>('ar');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [view, setView] = useState<ViewType>('home');
  const [history, setHistory] = useState<ViewType[]>(['home']); // Simple custom back stack
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // --- Auth & Profile States ---
  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem('al_jarabee_logged_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Toggle eye icons for password inputs
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);
  const [showResetPassword1, setShowResetPassword1] = useState<boolean>(false);
  const [showResetPassword2, setShowResetPassword2] = useState<boolean>(false);

  // Form Inputs: Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Form Inputs: Register
  const [regFirstName, setRegFirstName] = useState('');
  const [regThirdName, setRegThirdName] = useState('');
  const [regStudentPhone, setRegStudentPhone] = useState('');
  const [regGuardianPhone, setRegGuardianPhone] = useState('');
  const [regWallet, setRegWallet] = useState(WALLETS[0].id);
  const [regGov, setRegGov] = useState(GOVERNORATES[0].ar);
  const [regStage, setRegStage] = useState<StageType>('first');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Form Inputs: Forgot / Reset
  const [resetEmail, setResetEmail] = useState('');
  const [resetPass1, setResetPass1] = useState('');
  const [resetPass2, setResetPass2] = useState('');

  // Educational States
  const [selectedStage, setSelectedStage] = useState<StageType>('first');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoType | null>(null);

  // Profile Edit Avatar States
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // Toast Helper
  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setShowToast({ message, type });
    setTimeout(() => {
      setShowToast(null);
    }, 5500);
  };

  // --- Sync with localStorage and Sync Views ---
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('al_jarabee_logged_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('al_jarabee_logged_user');
    }
  }, [currentUser]);

  // --- Browser Back Interception to enforce SPA stability ("does not close page, Everything is saved") ---
  useEffect(() => {
    // Intercept hardware or browser back buttons
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      // Prevent browser default back exiting
      window.history.pushState(null, '', window.location.href);

      // Perform a custom back action inside the application state
      navigateBack();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [history, view]);

  // Handle virtual navigation
  const navigateTo = (nextView: ViewType) => {
    setHistory((prev) => [...prev, view]);
    setView(nextView);
  };

  const navigateBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((prevStack) => prevStack.slice(0, -1));
      setView(prev);
    } else {
      // If stack is dry, fallback to Home
      setView('home');
    }
  };

  // --- Translate Utilities ---
  const t = (key: keyof typeof DICTIONARY.ar) => {
    return DICTIONARY[lang][key] || DICTIONARY.ar[key] || '';
  };

  // Switch Stage helper
  const handleStageSelection = (stage: StageType) => {
    setSelectedStage(stage);
    navigateTo('stage-detail');
  };

  // --- Auth Handlers ---
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !regFirstName.trim() ||
      !regThirdName.trim() ||
      !regStudentPhone.trim() ||
      !regGuardianPhone.trim() ||
      !regEmail.trim() ||
      !regPassword.trim()
    ) {
      triggerToast(t('fillAllFields'), 'error');
      return;
    }

    const accounts = loadAccounts();
    const normalizedEmail = regEmail.toLowerCase().trim();

    if (accounts[normalizedEmail]) {
      triggerToast(
        lang === 'ar'
          ? 'عذراً، هذا البريد الإلكتروني مسجل بالفعل!'
          : 'Sorry, this email is already registered!',
        'error'
      );
      return;
    }

    // Create student record with default initial 500 EGP as a bonus
    const newStudent: StudentProfile = {
      firstName: regFirstName,
      thirdName: regThirdName,
      studentPhone: regStudentPhone,
      guardianPhone: regGuardianPhone,
      walletType: regWallet,
      governorate: regGov,
      secondaryStage: regStage,
      email: normalizedEmail,
      avatarUrl: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)].url,
      balance: 500, // Starts at 500 EGP on registration
    };

    accounts[normalizedEmail] = {
      ...newStudent,
      passwordHash: regPassword, // Simple hash/storage for demo client security
    };

    saveAccounts(accounts);
    triggerToast(t('earnedRewardMessage'), 'success');

    // Reset fields
    setRegFirstName('');
    setRegThirdName('');
    setRegStudentPhone('');
    setRegGuardianPhone('');
    setRegEmail('');
    setRegPassword('');

    // Dynamically auto returns to logical page
    navigateTo('login');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = loginEmail.toLowerCase().trim();
    const accounts = loadAccounts();

    if (!accounts[normalizedEmail]) {
      triggerToast(t('invalidLogin'), 'error');
      return;
    }

    const account = accounts[normalizedEmail];
    if (account.passwordHash !== loginPassword) {
      triggerToast(t('invalidLogin'), 'error');
      return;
    }

    // Success Authentication
    const loggedProfile: StudentProfile = {
      firstName: account.firstName,
      thirdName: account.thirdName,
      studentPhone: account.studentPhone,
      guardianPhone: account.guardianPhone,
      walletType: account.walletType,
      governorate: account.governorate,
      secondaryStage: account.secondaryStage,
      email: account.email,
      avatarUrl: account.avatarUrl || PRESET_AVATARS[0].url,
      balance: account.balance ?? 500,
    };

    setCurrentUser(loggedProfile);
    triggerToast(
      lang === 'ar'
        ? `مرحباً بك مجدداً يا ${loggedProfile.firstName}! تم تفعيل رصيدك: ٥٠٠ ج.م`
        : `Welcome back, ${loggedProfile.firstName}! Active balance: 500 EGP`,
      'success'
    );
    navigateTo('home');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = resetEmail.toLowerCase().trim();
    const accounts = loadAccounts();

    if (!accounts[normalizedEmail]) {
      triggerToast(
        lang === 'ar'
          ? 'البريد الإلكتروني هذا غير مسجل لدينا!'
          : 'This email is not registered in our records!',
        'error'
      );
      return;
    }

    if (resetPass1 !== resetPass2) {
      triggerToast(t('mismatchPassword'), 'error');
      return;
    }

    if (resetPass1.length < 4) {
      triggerToast(
        lang === 'ar'
          ? 'يجب أن تتكون كلمة المرور الجديدة من ٤ رموز على الأكثر!'
          : 'New password must have at least 4 characters!',
        'error'
      );
      return;
    }

    // Update password
    accounts[normalizedEmail].passwordHash = resetPass1;
    saveAccounts(accounts);

    triggerToast(t('successReset'), 'success');
    setResetEmail('');
    setResetPass1('');
    setResetPass2('');
    navigateTo('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    triggerToast(
      lang === 'ar'
        ? 'تم تسجيل خروجك بنجاح. ننتظر عودتك الشغوفة قريباً!'
        : 'Logged out successfully. See you soon!',
      'info'
    );
    navigateTo('home');
  };

  // --- Dynamic Avatar Changer ---
  const handleSelectPresetAvatar = (url: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, avatarUrl: url };
    setCurrentUser(updated);

    // Sync back in saved accounts too
    const accounts = loadAccounts();
    if (accounts[currentUser.email]) {
      accounts[currentUser.email].avatarUrl = url;
      saveAccounts(accounts);
    }
    triggerToast(
      lang === 'ar' ? 'تم تحديث الصورة الشخصية بنجاح!' : 'Profile picture updated successfully!',
      'success'
    );
    setShowAvatarSelector(false);
  };

  const handleSaveCustomAvatar = () => {
    if (!currentUser || !customAvatarUrl) return;
    const updated = { ...currentUser, avatarUrl: customAvatarUrl };
    setCurrentUser(updated);

    const accounts = loadAccounts();
    if (accounts[currentUser.email]) {
      accounts[currentUser.email].avatarUrl = customAvatarUrl;
      saveAccounts(accounts);
    }
    triggerToast(
      lang === 'ar' ? 'تم تطبيق صورتك المخصصة بنجاح!' : 'Custom image URL applied successfully!',
      'success'
    );
    setCustomAvatarUrl('');
    setShowAvatarSelector(false);
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen text-slate-100 font-sans transition-colors duration-500 overflow-x-hidden ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Decorative Blur Spheres - Soft, Ambient, Premium Glass effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-[30%] right-[-10%] w-[40vw] h-[40vw] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none animate-spin-slow"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[35vw] h-[35vw] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 border-white/10 bg-slate-950/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Logo Name / Brand Home Link */}
          <div 
            onClick={() => {
              // Click platform-name returns to the Home Page
              navigateTo('home');
            }} 
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            id="platform-logo"
          >
            <div className="p-2.5 bg-indigo-600/25 rounded-2xl border border-indigo-500/40 text-indigo-400 font-bold group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                {lang === 'ar' ? 'منصة الجربعي' : 'Al-Jarabee'}
              </h1>
              <p className="text-[10px] opacity-70 tracking-wider">
                {lang === 'ar' ? 'البوابة التعليمية المتميزة' : 'Elite Digital Learning'}
              </p>
            </div>
          </div>

          {/* Social Profiles Center (Only logos for Facebook and Youtube) */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs opacity-60 font-medium">الروابط الرسمية للأستاذ عمر أشرف:</span>
            <a 
              href="https://www.facebook.com/omar.ashraf.960403" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/20 hover:border-blue-500/40 rounded-xl transition-all"
              title="صفحة الفيسبوك للأستاذ عمر أشرف"
              id="social-facebook"
            >
              <span className="font-bold text-sm tracking-wide px-1">Facebook</span>
            </a>
            <a 
              href="https://www.youtube.com/@OmarAshraf7lbsaa" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all"
              title="قناة اليوتيوب للأستاذ عمر أشرف"
              id="social-youtube"
            >
              <span className="font-extrabold text-sm tracking-wide px-1">YouTube</span>
            </a>
          </div>

          {/* Header Actions Buttons (RTL flipped logically) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Dynamic Dark / Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 bg-white/5 border border-white/10 text-indigo-400 hover:bg-white/10 hover:text-indigo-300 rounded-xl transition-all shadow-sm"
              title={darkMode ? t('lightMode') : t('darkMode')}
              id="theme-toggle-btn"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Language Switch */}
            <button
              onClick={() => {
                setLang(lang === 'ar' ? 'en' : 'ar');
                triggerToast(lang === 'ar' ? 'Language switched to English' : 'تم تفعيل اللغة العربية', 'info');
              }}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold rounded-xl transition-all"
              id="language-toggle-btn"
            >
              {lang === 'ar' ? 'English (🇺🇸)' : 'العربية (🇪🇬)'}
            </button>

            {/* Profile Avatar / Auth trigger */}
            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Balance pill widget in Header */}
                <div 
                  onClick={() => navigateTo('student-profile')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold cursor-pointer hover:bg-emerald-500/20 transition-all"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>{currentUser.balance} {t('currency')}</span>
                </div>

                {/* Profile Pic Link to Student File */}
                <button
                  onClick={() => navigateTo('student-profile')}
                  className="relative group p-0.5 rounded-full border-2 border-indigo-400/40 hover:border-indigo-400 cursor-pointer overflow-hidden transition-all"
                  id="student-profile-trigger"
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={currentUser.avatarUrl}
                    alt={currentUser.firstName}
                    className="w-8 h-8 rounded-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRESET_AVATARS[0].url;
                    }}
                  />
                  {/* Plus active badge indicator */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/20 text-white rounded-xl text-xs font-semibold transition-all shadow-md focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                id="login-header-btn"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('login')}</span>
              </button>
            )}

          </div>
        </div>

        {/* Small screen Social links */}
        <div className="flex md:hidden items-center justify-around bg-slate-900/60 border-t border-white/5 py-2 px-4 text-xs opacity-90">
          <span className="opacity-60">{lang === 'ar' ? 'تابع الأستاذ:' : 'Follow Us:'}</span>
          <a href="https://www.facebook.com/omar.ashraf.960403" target="_blank" rel="noopener noreferrer" className="text-blue-400 font-semibold hover:underline">
            Facebook
          </a>
          <a href="https://www.youtube.com/@OmarAshraf7lbsaa" target="_blank" rel="noopener noreferrer" className="text-red-400 font-semibold hover:underline">
            YouTube
          </a>
        </div>
      </header>

      {/* MAIN APPLICATION CONTAINER WITH ANIMATIONS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-32">
        <AnimatePresence mode="wait">
          
          {/* TOAST NOTIFIER */}
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              className={`fixed bottom-24 ${lang === 'ar' ? 'left-6' : 'right-6'} z-50 p-4 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm border flex items-start gap-3 glass-card`}
              id="toast-box"
            >
              {showToast.type === 'success' ? (
                <CheckCircle className="w-5.5 h-5.5 text-emerald-400 shrink-0 mt-0.5" />
              ) : showToast.type === 'error' ? (
                <AlertCircle className="w-5.5 h-5.5 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <Sparkles className="w-5.5 h-5.5 text-indigo-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{showToast.message}</p>
              </div>
            </motion.div>
          )}

          {/* VIEW 1: HOME PAGE */}
          {view === 'home' && (
            <motion.section
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* PLATFORM PRESENTATION BANNER */}
              <div className="relative overflow-hidden rounded-3xl p-8 md:p-14 bg-gradient-to-br from-indigo-900/40 via-purple-950/20 to-slate-900/60 border border-white/10 text-center space-y-6 shadow-2xl glass-card">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
                
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold tracking-wider select-none transform hover:scale-105 transition-all">
                  <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                  {lang === 'ar' ? 'رقم ١ في المنهج الأكاديمي' : 'No.1 Rated Secondary Educator'}
                </span>

                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                  {t('title')}{' '}
                  <span className="bg-gradient-to-r from-emerald-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                    {lang === 'ar' ? 'عمر أشرف' : 'Omar Ashraf'}
                  </span>
                </h1>
                
                <p className="max-w-2xl mx-auto text-sm md:text-base opacity-75 font-normal leading-relaxed">
                  {t('subtitle')}. {lang === 'ar' ? 'نهتم بتبسيط الكيمياء والفيزياء وباقي المواد لطلاب الثانوية العامة.' : 'Simplifying complex courses with dynamic materials.'}
                </p>

                {/* Promotional Wallet banner */}
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between gap-3 text-start">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-normal">
                        {lang === 'ar' ? 'هدية انضمام فورية!' : 'Instant Sign up Gift!'}
                      </p>
                      <p className="text-[11px] opacity-75 leading-relaxed">
                        {lang === 'ar' ? 'احصل على ٥٠٠ ج.م فوراً عند إنشاء حساب لأول مرة.' : 'Get 500 EGP credited instantly upon registration.'}
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20">
                    +500 EGP
                  </div>
                </div>

                {!currentUser && (
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    <button
                      onClick={() => navigateTo('register')}
                      className="cursor-pointer px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      id="hero-register-btn"
                    >
                      {t('register')}
                    </button>
                    <button
                      onClick={() => navigateTo('login')}
                      className="cursor-pointer px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-sm font-bold hover:border-white/20 transition-all"
                      id="hero-login-btn"
                    >
                      {t('login')}
                    </button>
                  </div>
                )}
              </div>

              {/* THREE INTERACTIVE BLOCKS (THE THREE SECONDARY STAGES) */}
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">{t('stagesHeader')}</h2>
                  <p className="text-xs opacity-70 max-w-xl mx-auto">{t('stagesSub')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* FIRST SECONDARY */}
                  <div
                    onClick={() => handleStageSelection('first')}
                    className="cursor-pointer group relative overflow-hidden rounded-2xl p-6 bg-slate-900 border border-white/10 hover:border-indigo-500/40 hover:bg-indigo-950/20 hover:shadow-2xl transition-all duration-300"
                    id="stage-card-first"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
                    <div className="text-xs opacity-50 font-bold mb-3">01 / FIRST YEAR</div>
                    <h3 className="text-lg font-bold group-hover:text-indigo-400 transition-colors">{t('firstSecondary')}</h3>
                    <p className="text-xs opacity-75 mt-2 line-clamp-2">
                      {lang === 'ar' ? 'اللبنة الأولى لطلاب الثانوية، تهيئة وفهم أسس المواد الكيميائية والأدبية واللغوية.' : 'The foundations of secondary curriculum, languages, and scientific structures.'}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1 text-xs text-indigo-400 group-hover:translate-x-1 transition-transform">
                      <span>{lang === 'ar' ? 'استعراض المرحلة' : 'Explore stage'}</span>
                      {lang === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* SECOND SECONDARY */}
                  <div
                    onClick={() => handleStageSelection('second')}
                    className="cursor-pointer group relative overflow-hidden rounded-2xl p-6 bg-slate-900 border border-white/10 hover:border-indigo-500/40 hover:bg-indigo-950/20 hover:shadow-2xl transition-all duration-300"
                    id="stage-card-second"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
                    <div className="text-xs opacity-50 font-bold mb-3">02 / SECOND YEAR</div>
                    <h3 className="text-lg font-bold group-hover:text-indigo-400 transition-colors">{t('secondSecondary')}</h3>
                    <p className="text-xs opacity-75 mt-2 line-clamp-2">
                      {lang === 'ar' ? 'التخصص والاستعداد العالي للثانوية العامة مع متابعة أدق الفصول التطبيقية والمناهج.' : 'Diving deeper into your specialization with focused learning pathways.'}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1 text-xs text-indigo-400 group-hover:translate-x-1 transition-transform">
                      <span>{lang === 'ar' ? 'استعراض المرحلة' : 'Explore stage'}</span>
                      {lang === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* THIRD SECONDARY */}
                  <div
                    onClick={() => handleStageSelection('third')}
                    className="cursor-pointer group relative overflow-hidden rounded-2xl p-6 bg-slate-900 border border-white/10 hover:border-indigo-500/40 hover:bg-indigo-950/20 hover:shadow-2xl transition-all duration-300"
                    id="stage-card-third"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
                    <div className="text-xs opacity-50 font-bold mb-3">03 / SENIOR YEAR</div>
                    <h3 className="text-lg font-bold group-hover:text-indigo-400 transition-colors">{t('thirdSecondary')}</h3>
                    <p className="text-xs opacity-75 mt-2 line-clamp-2">
                      {lang === 'ar' ? 'بوابتك الحقيقية لكليات القمة ومرحلة الحصاد الكبرى. فيديوهات مخصصة لأهم ٦ مواد دراسية.' : 'The critical senior grade. Full interactive modules covering Mathematics, Sciences and Languages.'}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1 text-xs text-indigo-400 group-hover:translate-x-1 transition-transform">
                      <span>{lang === 'ar' ? 'تصفح المواد والدروس' : 'Browse Subjects & Lessons'}</span>
                      {lang === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* VIEW 2: LOGIN */}
          {view === 'login' && (
            <motion.section
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto"
            >
              <div className="p-8 rounded-3xl bg-slate-900 border border-white/10 glass-card space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black">{t('login')}</h2>
                  <p className="text-xs opacity-70">
                    {lang === 'ar' ? 'ادخل بريدك الإلكتروني والرصيد المحفوظ مسبقاً' : 'Sign in to access your registered digital profile'}
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-xs font-semibold opacity-85 block">{t('email')}</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 opacity-50">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="student@aljarabee.com"
                        className={`w-full py-3 ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} rounded-xl text-sm glass-input text-white`}
                        id="login-email-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold opacity-85">{t('password')}</label>
                      <button
                        type="button"
                        onClick={() => navigateTo('forgot-password')}
                        className="text-xs text-indigo-400 hover:underline"
                        id="forgot-password-link"
                      >
                        {t('forgotPassword')}
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 opacity-50">
                        <LockKeyhole className="w-4 h-4" />
                      </span>
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full py-3 ${lang === 'ar' ? 'pr-10 pl-12' : 'pl-10 pr-12'} rounded-xl text-sm glass-input text-white`}
                        id="login-password-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className={`absolute inset-y-0 ${lang === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center opacity-70 text-indigo-400`}
                        title="كشف كلمة المرور"
                        id="login-password-toggle"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="cursor-pointer w-full py-3.5 mt-2 bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/20 text-white font-bold rounded-xl text-sm transition-all shadow-lg"
                    id="login-submit-btn"
                  >
                    {t('login')}
                  </button>
                </form>

                <div className="relative flex py-2 items-center text-xs opacity-50">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="mx-4">{lang === 'ar' ? 'أو' : 'OR'}</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <div className="text-center">
                  <p className="text-xs">
                    {lang === 'ar' ? 'ليس لديك حساب مسبق؟' : 'New student?'}
                    <button
                      onClick={() => navigateTo('register')}
                      className="text-indigo-400 font-bold hover:underline ml-1.5 mr-1.5 focus:outline-none"
                      id="signup-link"
                    >
                      {t('register')}
                    </button>
                  </p>
                </div>
              </div>
            </motion.section>
          )}

          {/* VIEW 3: REGISTER */}
          {view === 'register' && (
            <motion.section
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-white/10 glass-card space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black">{t('register')}</h2>
                  <p className="text-xs opacity-75">
                    {lang === 'ar' ? 'سجل بياناتك المعتمدة لتجهيز ملفك وبطاقة رصيدك للتطبيقات والمجموعات' : 'Fill in the official student record form to instantly secure 500 EGP'}
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold opacity-90 block">{t('firstNamePlaceholder')} *</label>
                      <input
                        type="text"
                        required
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        placeholder={lang === 'ar' ? 'على سبيل المثال: زياد' : 'e.g., Ziad'}
                        className="w-full px-4 py-2.5 rounded-xl text-sm glass-input text-white"
                        id="reg-first-name"
                      />
                    </div>
                    {/* Third Name (Grandfather name) */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold opacity-90 block">{t('thirdNamePlaceholder')} *</label>
                      <input
                        type="text"
                        required
                        value={regThirdName}
                        onChange={(e) => setRegThirdName(e.target.value)}
                        placeholder={lang === 'ar' ? 'على سبيل المثال: الشافعي' : 'e.g., El-Shafei'}
                        className="w-full px-4 py-2.5 rounded-xl text-sm glass-input text-white"
                        id="reg-third-name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Student Phone */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold opacity-90 block">{t('studentPhone')} *</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 opacity-60">
                          <Phone className="w-4 h-4 text-indigo-400" />
                        </span>
                        <input
                          type="tel"
                          required
                          value={regStudentPhone}
                          onChange={(e) => setRegStudentPhone(e.target.value)}
                          placeholder="01012345678"
                          className={`w-full py-2.5 ${lang === 'ar' ? 'pr-9 pl-4' : 'pl-9 pr-4'} rounded-xl text-sm glass-input text-white`}
                          id="reg-student-phone"
                        />
                      </div>
                    </div>
                    {/* Guardian Phone */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold opacity-90 block">{t('guardianPhone')} *</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 opacity-60">
                          <Phone className="w-4 h-4 text-rose-400" />
                        </span>
                        <input
                          type="tel"
                          required
                          value={regGuardianPhone}
                          onChange={(e) => setRegGuardianPhone(e.target.value)}
                          placeholder="01187654321"
                          className={`w-full py-2.5 ${lang === 'ar' ? 'pr-9 pl-4' : 'pl-9 pr-4'} rounded-xl text-sm glass-input text-white`}
                          id="reg-guardian-phone"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Choose Wallet */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold opacity-90 block">{t('chooseWallet')} *</label>
                      <div className="relative">
                        <select
                          value={regWallet}
                          onChange={(e) => setRegWallet(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl text-sm glass-input text-white bg-slate-900 focus:bg-slate-950 appearance-none"
                          id="reg-wallet-select"
                        >
                          {WALLETS.map((w) => (
                            <option key={w.id} value={w.id}>
                              {lang === 'ar' ? w.ar : w.en}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Choose Governorate in Egypt */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold opacity-90 block">{t('chooseGovernorate')} *</label>
                      <div className="relative">
                        <select
                          value={regGov}
                          onChange={(e) => setRegGov(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl text-sm glass-input text-white bg-slate-900 focus:bg-slate-950"
                          id="reg-gov-select"
                        >
                          {GOVERNORATES.map((gov) => (
                            <option key={gov.en} value={gov.ar}>
                              {lang === 'ar' ? gov.ar : gov.en}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Stage Switch Box */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold opacity-90 block">{t('chooseStage')} *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['first', 'second', 'third'] as StageType[]).map((stageKey) => (
                        <button
                          key={stageKey}
                          type="button"
                          onClick={() => setRegStage(stageKey)}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${
                            regStage === stageKey
                              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-400 font-extrabold scale-105'
                              : 'bg-white/5 border-white/5 text-stone-300 hover:bg-white/10'
                          }`}
                          id={`reg-stage-btn-${stageKey}`}
                        >
                          {stageKey === 'first' ? t('firstSecondary') : stageKey === 'second' ? t('secondSecondary') : t('thirdSecondary')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email & Password */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold opacity-90 block">{t('email')} *</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="Ziad@mail.com"
                        className="w-full px-4 py-2.5 rounded-xl text-sm glass-input text-white"
                        id="reg-email"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold opacity-90 block">{t('password')} *</label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 rounded-xl text-sm glass-input text-white pr-12"
                          id="reg-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute inset-y-0 left-0 pl-3 flex items-center opacity-75 text-indigo-400"
                          id="reg-password-toggle"
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Credit Reward notification badge */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                    <p className="text-[11px] text-emerald-300 leading-normal">
                      {lang === 'ar'
                        ? 'تنبيه: بمجرد تخزين الحساب، ستحتسب قيمة الهدية البالغة ٥٠٠ ج.م في رصيد الطالب تلقائياً لتستمتع بها عند الدخول!'
                        : 'Notice: On store verification, an EGP 500 reward is activated on your identity balance automatically!'}
                    </p>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="cursor-pointer w-full sm:flex-1 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl text-sm shadow-lg transition-transform hover:scale-[1.01]"
                      id="reg-submit-btn"
                    >
                      {t('createAccount')}
                    </button>
                    <button
                      type="button"
                      onClick={navigateBack}
                      className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-all text-center border border-white/5"
                      id="reg-cancel-btn"
                    >
                      {t('back')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.section>
          )}

          {/* VIEW 4: FORGOT PASSWORD */}
          {view === 'forgot-password' && (
            <motion.section
              key="forgot-password"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto"
            >
              <div className="p-8 rounded-3xl bg-slate-900 border border-white/10 glass-card space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black">{t('forgotPasswordTitle')}</h2>
                  <p className="text-xs opacity-70">{t('forgotPasswordSub')}</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  {/* Target Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold opacity-85 block">{t('enterEmailReset')}</label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="student@mail.com"
                      className="w-full px-4 py-2.5 rounded-xl text-sm glass-input text-white"
                      id="reset-email-input"
                    />
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold opacity-85 block">{t('enterNewPasswordReset')}</label>
                    <div className="relative">
                      <input
                        type={showResetPassword1 ? 'text' : 'password'}
                        required
                        value={resetPass1}
                        onChange={(e) => setResetPass1(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl text-sm glass-input text-white pr-12"
                        id="reset-pass-1"
                      />
                      <button
                        type="button"
                        onClick={() => setShowResetPassword1(!showResetPassword1)}
                        className="absolute inset-y-0 left-0 pl-3 flex items-center opacity-70 text-indigo-400"
                        id="reset-pass-toggle-1"
                      >
                        {showResetPassword1 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold opacity-85 block">{t('enterNewPasswordConfirmReset')}</label>
                    <div className="relative">
                      <input
                        type={showResetPassword2 ? 'text' : 'password'}
                        required
                        value={resetPass2}
                        onChange={(e) => setResetPass2(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl text-sm glass-input text-white pr-12"
                        id="reset-pass-2"
                      />
                      <button
                        type="button"
                        onClick={() => setShowResetPassword2(!showResetPassword2)}
                        className="absolute inset-y-0 left-0 pl-3 flex items-center opacity-70 text-indigo-400"
                        id="reset-pass-toggle-2"
                      >
                        {showResetPassword2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="submit"
                      className="cursor-pointer flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-md transition-all"
                      id="reset-submit-btn"
                    >
                      {t('saveNewPassword')}
                    </button>
                    <button
                      type="button"
                      onClick={navigateBack}
                      className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-all"
                      id="reset-cancel-btn"
                    >
                      {t('back')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.section>
          )}

          {/* VIEW 5: STAGE DETAILS */}
          {view === 'stage-detail' && (
            <motion.section
              key="stage-detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* STAGE HEADER BANNER */}
              <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-white/10 glass-card flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <button
                    onClick={navigateBack}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-indigo-300 text-xs font-bold rounded-xl border border-white/10 mb-4 transition-all"
                    id="stage-back-btn"
                  >
                    {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                    <span>{t('back')}</span>
                  </button>

                  <h2 className="text-2xl sm:text-3xl font-black mt-2">
                    {selectedStage === 'first'
                      ? t('firstSecondary')
                      : selectedStage === 'second'
                      ? t('secondSecondary')
                      : t('thirdSecondary')}
                  </h2>
                  <p className="text-xs opacity-75 mt-1">
                    {selectedStage === 'third'
                      ? t('thirdStageDetailHeader')
                      : lang === 'ar'
                      ? 'الوصول لقائمة الحصص والتحديثات للمرحلة الحالية'
                      : 'Stage summary and course details'}
                  </p>
                </div>

                {/* Info balance badge */}
                {currentUser && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-start">
                    <p className="text-[10px] opacity-75">{t('balance')}</p>
                    <p className="text-xl font-black text-emerald-400">
                      {currentUser.balance} {t('currency')}
                    </p>
                    <p className="text-[9px] opacity-65 mt-1">{t('everythingSaved')}</p>
                  </div>
                )}
              </div>

              {/* STAGE MAIN INTERACTIVE BODY */}
              {selectedStage === 'first' || selectedStage === 'second' ? (
                <div 
                  className="max-w-2xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-slate-900 border border-white/10 glass-card space-y-6"
                  id="lectures-not-started-box"
                >
                  <div className="inline-flex p-4 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
                    <Video className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{t('notStartedTitle')}</h3>
                    <p className="text-xs opacity-75 leading-relaxed max-w-lg mx-auto">
                      {t('notStartedDesc')}
                    </p>
                  </div>
                  {/* Static WhatsApp action shortcut */}
                  <a
                    href="https://wa.me/201200000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all"
                    id="stage-whatsapp-contact"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{t('contactSupport')}</span>
                  </a>
                </div>
              ) : (
                /* THIRD SECONDARY - MAIN 6 SUBJECT BLOCKS: Arabic, English, Biology, Math, Chemistry, Physics */
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="text-lg font-black text-white">{t('subjectsCount')}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SUBJECTS.map((subject) => {
                      // Dynamically render customized icon mapping safely
                      const IconComponent = () => {
                        switch (subject.iconName) {
                          case 'BookOpen': return <BookOpen className="w-6 h-6 shrink-0" />;
                          case 'Globe': return <Globe className="w-6 h-6 shrink-0" />;
                          case 'Dna': return <Dna className="w-6 h-6 shrink-0" />;
                          case 'Calculator': return <Calculator className="w-6 h-6 shrink-0" />;
                          case 'FlaskConical': return <FlaskConical className="w-6 h-6 shrink-0" />;
                          case 'Atom': return <Atom className="w-6 h-6 shrink-0" />;
                          default: return <BookOpen className="w-6 h-6 shrink-0" />;
                        }
                      };

                      return (
                        <div
                          key={subject.id}
                          onClick={() => {
                            setSelectedSubject(subject);
                            setActiveVideo(subject.videos[0] || null);
                            navigateTo('subject-detail');
                          }}
                          className={`cursor-pointer group relative overflow-hidden p-6 rounded-2xl bg-slate-900 border transition-all hover:scale-[1.02] hover:shadow-xl bg-gradient-to-br ${subject.color}`}
                          id={`subject-card-${subject.id}`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="p-3 bg-white/5 rounded-xl text-white">
                              <IconComponent />
                            </div>
                            <span className="text-[10px] opacity-75 font-semibold bg-white/5 px-2.5 py-1 rounded-lg">
                              {subject.videos.length} {lang === 'ar' ? 'دروس متوفرة' : 'Lessons'}
                            </span>
                          </div>

                          <div className="mt-6 space-y-1">
                            <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                              {lang === 'ar' ? subject.nameAr : subject.nameEn}
                            </h4>
                            <p className="text-[11px] opacity-75">
                              {lang === 'ar' ? `منهج تجريبي تفاعلي مخصص` : `Official digital review materials`}
                            </p>
                          </div>

                          <div className="mt-5 flex items-center gap-1.5 text-xs text-white/90">
                            <span>{lang === 'ar' ? 'عرض الفيديوهات والمحاضرات' : 'Play lectures'}</span>
                            {lang === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.section>
          )}

          {/* VIEW 6: SUBJECT DETAILS & VIDEOS */}
          {view === 'subject-detail' && selectedSubject && (
            <motion.section
              key="subject-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* SUBJECT ROADBAR HEADER */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-white/10 glass-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={navigateBack}
                    className="cursor-pointer p-2 bg-white/5 hover:bg-white/10 text-stone-300 rounded-xl transition-all"
                    id="subject-back-header"
                  >
                    {lang === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                  </button>
                  <div>
                    <h2 className="text-2xl font-black text-white">
                      {lang === 'ar' ? selectedSubject.nameAr : selectedSubject.nameEn}
                    </h2>
                    <p className="text-xs opacity-75 mt-0.5">
                      {t('subjectVideosTitle')} — {t('thirdSecondary')}
                    </p>
                  </div>
                </div>
                {currentUser && (
                  <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 rounded-xl" id="subject-balance-badge">
                    {t('balance')}: {currentUser.balance} {t('currency')} 🏅
                  </div>
                )}
              </div>

              {/* MAIN RECTANGLE TWO-COLUMN GRID: VIDEO PLAYER & PLAYLIST */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Video player container */}
                <div className="lg:col-span-2 space-y-4">
                  {activeVideo ? (
                    <div className="rounded-3xl overflow-hidden bg-slate-900 border border-white/10 glass-card shadow-2xl relative">
                      {/* Interactive Demo Video Player */}
                      <video
                        key={activeVideo.id}
                        src={activeVideo.url}
                        controls
                        poster={activeVideo.thumbnail}
                        className="w-full aspect-video select-none bg-black object-cover"
                        referrerPolicy="no-referrer"
                        id="video-player-frame"
                      >
                        {lang === 'ar' ? 'المتصفح لا يدعم هذا الفيديو.' : 'Your browser doesn\'t support this video.'}
                      </video>
                      
                      <div className="p-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-[10px] text-indigo-300 font-extrabold">
                            {lang === 'ar' ? 'فيديو للشرح' : 'Review Recording'}
                          </span>
                          <span className="text-[10px] opacity-60">
                            ⏱ {lang === 'ar' ? activeVideo.durationAr : activeVideo.durationEn}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          {lang === 'ar' ? activeVideo.titleAr : activeVideo.titleEn}
                        </h3>
                        <p className="text-xs opacity-75 leading-relaxed">
                          {lang === 'ar'
                            ? 'هذا مقطع تجريبي من محاضرات منصة الجربعي، يشمل شرح ميسر وتفصيلي للمقررات الأساسية الموجهة لأعلى درجات الفهم.'
                            : 'An educational video recording explaining core concepts and equations cleanly.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center rounded-3xl bg-slate-900 border border-white/10 glass-card">
                      <p className="text-stone-400">{t('subjectNoVideos')}</p>
                    </div>
                  )}
                </div>

                {/* Playlist controller side-block */}
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900 rounded-2xl border border-white/10 glass-card-dark">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                      <Video className="w-4 h-4 text-indigo-400" />
                      <span>{lang === 'ar' ? 'قائمة الفيديوهات المتاحة' : 'Subject Playlist'}</span>
                    </h3>

                    <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                      {selectedSubject.videos.map((vid) => {
                        const isCurrent = activeVideo?.id === vid.id;
                        return (
                          <div
                            key={vid.id}
                            onClick={() => setActiveVideo(vid)}
                            className={`cursor-pointer group flex items-start gap-3 p-3 rounded-xl border transition-all ${
                              isCurrent
                                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                                : 'bg-white/5 border-white/5 hover:bg-white/10 text-white'
                            }`}
                            id={`playlist-item-${vid.id}`}
                          >
                            <div className="relative w-16 h-10 rounded overflow-hidden bg-black/40 shrink-0">
                              <img
                                referrerPolicy="no-referrer"
                                src={vid.thumbnail}
                                alt="thumb"
                                className="w-full h-full object-cover opacity-80"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=150&q=80';
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Play className="w-3.5 h-3.5 text-white fill-white" />
                              </div>
                            </div>

                            <div className="space-y-0.5 text-start overflow-hidden">
                              <h4 className="text-xs font-bold leading-tight group-hover:text-indigo-300 transition-colors line-clamp-2">
                                {lang === 'ar' ? vid.titleAr : vid.titleEn}
                              </h4>
                              <p className="text-[10px] opacity-75">
                                {lang === 'ar' ? vid.durationAr : vid.durationEn}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Alert block */}
                  <div className="p-4 bg-lime-500/10 border border-lime-500/20 rounded-2xl text-[11px] leading-relaxed text-lime-300">
                    💡 {lang === 'ar'
                      ? 'يمكنك دائماً الرجوع للمرحلة السابقة ومتابعة باقي الأرصدة عبر الضغط على سهم الرجوع أو نقر اسم المنصة فوق.'
                      : 'You can navigate freely using the top title or the left-arrow buttons with state maintained.'}
                  </div>
                </div>

              </div>
            </motion.section>
          )}

          {/* VIEW 7: STUDENT PROFILE FILE DETAIL SCREEN */}
          {view === 'student-profile' && currentUser ? (
            <motion.section
              key="student-profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              {/* Back navigation */}
              <button
                onClick={navigateBack}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-indigo-300 text-xs font-bold rounded-xl border border-white/10 transition-all"
                id="profile-back-btn"
              >
                {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{t('back')}</span>
              </button>

              <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-white/10 glass-card space-y-8">
                
                {/* Title & subtitle */}
                <div className="text-center space-y-1 border-b border-white/5 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-white">{t('studentProfileTitle')}</h2>
                  <p className="text-xs opacity-75">{t('studentProfileSubtitle')}</p>
                </div>

                {/* Primary Student Avatar Editor banner */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="relative group shrink-0">
                    <img
                      referrerPolicy="no-referrer"
                      src={currentUser.avatarUrl}
                      alt={currentUser.firstName}
                      className="w-24 h-24 rounded-full border-4 border-indigo-400/40 object-cover shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PRESET_AVATARS[0].url;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 text-center sm:text-start">
                    <h3 className="text-lg font-bold text-white">
                      {currentUser.firstName} {currentUser.thirdName}
                    </h3>
                    <p className="text-xs text-indigo-400 font-semibold">
                      {t('stageLabel')} {currentUser.secondaryStage === 'first' ? t('firstSecondary') : currentUser.secondaryStage === 'second' ? t('secondSecondary') : t('thirdSecondary')}
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <button
                        onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                        className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-bold rounded-lg transition-all cursor-pointer"
                        id="toggle-avatar-selector"
                      >
                        {t('selectAvatar')}
                      </button>
                    </div>
                  </div>

                  {/* Floating Account Wallet Balance */}
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center min-w-[140px]">
                    <span className="text-[10px] opacity-75">{t('balance')}</span>
                    <p className="text-2xl font-black text-emerald-400 mt-1">{currentUser.balance} {t('currency')}</p>
                    <span className="text-[9px] text-emerald-300/80 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mt-1">
                      {lang === 'ar' ? 'هدية مفعلة' : 'Bonus Active'}
                    </span>
                  </div>
                </div>

                {/* Grid Preset Avatar selectors */}
                {showAvatarSelector && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-4"
                    id="avatar-selector-section"
                  >
                    <p className="text-xs font-bold text-white mb-2">{t('selectAvatar')}:</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {PRESET_AVATARS.map((av) => (
                        <div
                          key={av.id}
                          onClick={() => handleSelectPresetAvatar(av.url)}
                          className="cursor-pointer p-1 rounded-xl border border-white/5 hover:border-indigo-500 hover:scale-105 transition-all text-center space-y-1 bg-white/5"
                        >
                          <img
                            referrerPolicy="no-referrer"
                            src={av.url}
                            alt={av.name}
                            className="w-12 h-12 rounded-full object-cover mx-auto"
                          />
                          <p className="text-[9px] opacity-70">{av.name}</p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/5 pt-3 space-y-2">
                      <label className="text-xs opacity-75 block">{t('uploadCustomAvatar')}:</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={customAvatarUrl}
                          onChange={(e) => setCustomAvatarUrl(e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                          className="flex-1 px-3 py-1.5 rounded-lg text-xs glass-input"
                          id="custom-avatar-url"
                        />
                        <button
                          onClick={handleSaveCustomAvatar}
                          className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold transition-all"
                          id="save-custom-avatar-url"
                        >
                          {lang === 'ar' ? 'تطبيق' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Profile credentials Grid values info sheet */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4 text-start">
                  <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2">
                    {lang === 'ar' ? 'ملخص بطاقة الحساب الأكاديمي' : 'Academic Credentials Sheet'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="opacity-60 block">{lang === 'ar' ? 'الاسم بالكامل:' : 'Full Student Name:'}</span>
                      <p className="font-bold text-white">{currentUser.firstName} {currentUser.thirdName}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="opacity-60 block">{lang === 'ar' ? 'البريد الرقمي المعتمد:' : 'Registered Learning Email:'}</span>
                      <p className="font-bold text-indigo-400 break-all">{currentUser.email}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="opacity-60 block">{t('studentPhone')}:</span>
                      <p className="font-bold text-white">{currentUser.studentPhone}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="opacity-60 block">{t('guardianPhone')}:</span>
                      <p className="font-bold text-white">{currentUser.guardianPhone}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="opacity-60 block">{t('governorateLabel')}</span>
                      <p className="font-bold text-white flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{currentUser.governorate}</span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="opacity-60 block">{t('walletTypeLabel')}</span>
                      <p className="font-bold text-emerald-400 flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5" />
                        <span>
                          {WALLETS.find((w) => w.id === currentUser.walletType)?.ar || currentUser.walletType}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form interactions & Logouts */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-6">
                  <div className="text-xs opacity-60">
                    ⭐ {lang === 'ar' ? 'رقم العضوية فريد ويخضع للحفظ الآلي.' : 'UID verified and subject to active secure updates.'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer w-full sm:w-auto px-5 py-2 bg-rose-600/20 hover:bg-rose-600 hover:text-white border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                    id="profile-logout-btn"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout')}</span>
                  </button>
                </div>

              </div>
            </motion.section>
          ) : null}

        </AnimatePresence>
      </main>

      {/* FIXED "EVERYTHING IS SAVED" FLOATING BAR AND WHATSAPP SUPPORT CHAT */}
      <div className={`fixed bottom-5 ${lang === 'ar' ? 'left-5' : 'right-5'} z-40 flex items-center gap-3 select-none`} id="safeguard-banner-group">
        
        {/* Everything is saved pill - translucent glassy */}
        <div 
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-xs font-medium shadow-xl hover:scale-105 transition-all group pointer-events-auto"
          title={t('everythingSavedTooltip')}
          id="everything-saved-pill"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{t('everythingSaved')}</span>
        </div>

        {/* WhatsApp pulsing button widget */}
        <a
          href="https://wa.me/201200000000" // Connect to custom WhatsApp safely
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95 border border-emerald-500/40 relative group pointer-events-auto"
          title={t('contactSupport')}
          id="whatsapp-floater-link"
        >
          {/* Pulsing glow around the logo */}
          <span className="absolute -inset-0.5 rounded-full bg-emerald-500 opacity-30 blur group-hover:opacity-50 transition-all animate-pulse"></span>
          <MessageCircle className="w-5 h-5 relative z-10 fill-white text-emerald-600" />
        </a>
      </div>

      {/* FOOTER SECTION */}
      <footer className="border-t border-white/5 bg-slate-950/40 py-6 text-center text-xs opacity-60 space-y-2 mt-auto">
        <p>© {new Date().getFullYear()} {lang === 'ar' ? 'جميع الحقوق محفوظة لمنصة الجربعي التعليمية والأستاذ عمر أشرف' : 'All rights reserved - Al-Jarabee Platform & Instructor Omar Ashraf'}</p>
        <p className="flex justify-center gap-2">
          <span>{lang === 'ar' ? 'منهج آمن ومحفوظ' : 'Secure localized data store enabled'}</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">{t('everythingSaved')} ✓</span>
        </p>
      </footer>
    </div>
  );
}
