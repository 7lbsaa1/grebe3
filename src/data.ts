/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject } from './types';

export const GOVERNORATES = [
  { ar: 'القاهرة', en: 'Cairo' },
  { ar: 'الجيزة', en: 'Giza' },
  { ar: 'الإسكندرية', en: 'Alexandria' },
  { ar: 'القليوبية', en: 'Qalyubia' },
  { ar: 'الدقهلية', en: 'Dakahlia' },
  { ar: 'الغربية', en: 'Gharbia' },
  { ar: 'المنوفية', en: 'Monufia' },
  { ar: 'الشرقية', en: 'Sharqia' },
  { ar: 'البحيرة', en: 'Beheira' },
  { ar: 'دمياط', en: 'Damietta' },
  { ar: 'كفر الشيخ', en: 'Kafr El Sheikh' },
  { ar: 'بورسعيد', en: 'Port Said' },
  { ar: 'الإسماعيلية', en: 'Ismailia' },
  { ar: 'السويس', en: 'Suez' },
  { ar: 'أسيوط', en: 'Asyut' },
  { ar: 'سوهاج', en: 'Sohag' },
  { ar: 'قنا', en: 'Qena' },
  { ar: 'الأقصر', en: 'Luxor' },
  { ar: 'أسوان', en: 'Aswan' },
  { ar: 'الفيوم', en: 'Faiyum' },
  { ar: 'بني سويف', en: 'Beni Suef' },
  { ar: 'المنيا', en: 'Minya' },
  { ar: 'مطروح', en: 'Matrouh' },
  { ar: 'الوادي الجديد', en: 'New Valley' },
  { ar: 'البحر الأحمر', en: 'Red Sea' },
  { ar: 'شمال سيناء', en: 'North Sinai' },
  { ar: 'جنوب سيناء', en: 'South Sinai' },
];

export const WALLETS = [
  { id: 'vodafone', ar: 'فودافون كاش (Vodafone Cash)', en: 'Vodafone Cash' },
  { id: 'instapay', ar: 'إنستاباي (InstaPay)', en: 'InstaPay' },
  { id: 'orange', ar: 'أورنج كاش (Orange Cash)', en: 'Orange Cash' },
  { id: 'etisalat', ar: 'اتصالات كاش (Etisalat Cash)', en: 'Etisalat Cash' },
  { id: 'we', ar: 'وي باي (WE Pay)', en: 'WE Pay' },
  { id: 'fawry', ar: 'محفظة فوري (Fawry)', en: 'Fawry Wallet' },
  { id: 'bank', ar: 'محفظة بنكية (Bank Wallet)', en: 'Bank Electronic Wallet' },
];

export const PRESET_AVATARS = [
  { id: 'm1', name: 'Ziad', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'f1', name: 'Malak', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'm2', name: 'Omar', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'f2', name: 'Farida', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'm3', name: 'Kareem', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'f3', name: 'Nour', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80' },
];

export const SUBJECTS: Subject[] = [
  {
    id: 'arabic',
    nameAr: 'اللغة العربية',
    nameEn: 'Arabic Language',
    iconName: 'BookOpen',
    color: 'from-amber-500/20 to-orange-500/20 border-orange-500/30 text-orange-400',
    videos: [
      {
        id: 'ar1',
        titleAr: 'مقدمة في البلاغة وعلم البديع',
        titleEn: 'Introduction to Arabic Rhetoric (Balaagha)',
        durationAr: '٣٥ دقيقة',
        durationEn: '35 mins',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'ar2',
        titleAr: 'مدرسة الإحياء والبعث - الأدب الحديث',
        titleEn: 'Al-Ihyaa wa Al-Ba\'th School - Modern Literature',
        durationAr: '٤٨ دقيقة',
        durationEn: '48 mins',
        url: 'https://www.w3schools.com/html/movie.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'ar3',
        titleAr: 'المشتقات العاملة - النحو الميسر',
        titleEn: 'Active Derivatives in Arabic Grammar (Nahw)',
        durationAr: '٤٢ دقيقة',
        durationEn: '42 mins',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'english',
    nameAr: 'اللغة الإنجليزية',
    nameEn: 'English Language',
    iconName: 'Globe',
    color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
    videos: [
      {
        id: 'en1',
        titleAr: 'قواعد الأزمنة التامة والمستمرة',
        titleEn: 'Grammar: Perfect and Continuous Tenses Masterclass',
        durationAr: '٢٩ دقيقة',
        durationEn: '29 mins',
        url: 'https://www.w3schools.com/html/movie.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'en2',
        titleAr: 'تحليل رواية آمال عظيمة - الفصل الأول والثاني',
        titleEn: 'Great Expectations Novel Analysis - Chapters 1 & 2',
        durationAr: '٥٢ دقيقة',
        durationEn: '52 mins',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'biology',
    nameAr: 'الأحياء',
    nameEn: 'Biology',
    iconName: 'Dna',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    videos: [
      {
        id: 'bio1',
        titleAr: 'الدعامة والحركة في الكائنات الحية',
        titleEn: 'Support and Locomotion in Living Organisms',
        durationAr: '٤٥ دقيقة',
        durationEn: '45 mins',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'bio2',
        titleAr: 'آلية انقباض العضلات - نموذج الخيوط المنزلقة',
        titleEn: 'Mechanism of Muscle Contraction - Sliding Filament Model',
        durationAr: '٣٨ دقيقة',
        durationEn: '38 mins',
        url: 'https://www.w3schools.com/html/movie.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'mathematics',
    nameAr: 'الرياضيات',
    nameEn: 'Mathematics',
    iconName: 'Calculator',
    color: 'from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400',
    videos: [
      {
        id: 'math1',
        titleAr: 'أسس التفاضل والتكامل ونهاية الدوال',
        titleEn: 'Calculus Fundamentals: Limits & Continuity',
        durationAr: '٥٠ دقيقة',
        durationEn: '50 mins',
        url: 'https://www.w3schools.com/html/movie.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'math2',
        titleAr: 'الجبر الاستدلالي والمصفوفات المعقدة',
        titleEn: 'Advanced Linear Algebra & Matrix Operators',
        durationAr: '٤٠ دقيقة',
        durationEn: '40 mins',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'chemistry',
    nameAr: 'الكيمياء',
    nameEn: 'Chemistry',
    iconName: 'FlaskConical',
    color: 'from-purple-500/20 to-fuchsia-500/20 border-purple-500/30 text-purple-400',
    videos: [
      {
        id: 'chem1',
        titleAr: 'العناصر الانتقالية وترتيب المستويات الفرعية',
        titleEn: 'Transition Elements and d-orbital Electron Configurations',
        durationAr: '٥٥ دقيقة',
        durationEn: '55 mins',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1617155093730-a8bf47be792d?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'physics',
    nameAr: 'الفيزياء',
    nameEn: 'Physics',
    iconName: 'Atom',
    color: 'from-cyan-500/20 to-sky-500/20 border-cyan-500/30 text-cyan-400',
    videos: [
      {
        id: 'phys1',
        titleAr: 'قانون أوم للدائرة المغلقة وقوانين كيرشوف',
        titleEn: 'Ohm\'s Law for Closed Circuits & Kirchhoff\'s Rules',
        durationAr: '٦٢ دقيقة',
        durationEn: '62 mins',
        url: 'https://www.w3schools.com/html/movie.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80'
      }
    ]
  }
];

export const DICTIONARY = {
  ar: {
    title: 'منصة الجربعي التعليمية',
    subtitle: 'بوابتك للتفوق والنجاح الأكاديمي',
    darkMode: 'المظهر الداكن',
    lightMode: 'المظهر المضيء',
    welcome: 'مرحباً بك',
    home: 'الرئيسية',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب جديد',
    createAccount: 'إنشاء الحساب ويُحفظ تلقائياً',
    firstNamePlaceholder: 'الاسم الأول للطالب',
    thirdNamePlaceholder: 'الاسم الثالث (اسم الجد)',
    studentPhone: 'رقم هاتف الطالب (واتساب متاح)',
    guardianPhone: 'رقم هاتف ولي الأمر',
    chooseWallet: 'اختر المحفظة الإلكترونية للاشتراك/الاستلام',
    chooseGovernorate: 'اختر محافظة الإقامة في مصر',
    chooseStage: 'اختر المرحلة الثانوية الدراسية',
    email: 'البريد الإلكتروني للتعلم الرقمي',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    forgotPassword: 'هل نسيت كلمة المرور؟',
    saveNewPassword: 'حفظ واسترجاع كلمة المرور الجديدة',
    stagesHeader: 'اختر مرحلتك الثانوية',
    stagesSub: 'تصفح المواد والدروس والمحاضرات المصورة المتميزة',
    firstSecondary: 'الصف الأول الثانوي',
    secondSecondary: 'الصف الثاني الثانوي',
    thirdSecondary: 'الصف الثالث الثانوي',
    notStartedTitle: 'المحاضرات لم تبدأ بعد',
    notStartedDesc: 'جاري إعداد المنهج الدراسي ومخطط الدروس لهذا العام من قبل الهيئة المعلمة المرموقة. الرجاء المتابعة قريباً، شكراً لطاقتكم وصبركم الجميل.',
    thirdStageDetailHeader: 'منهج الصف الثالث الثانوي الموجه للمستقبل',
    subjectsCount: '٦ مواد دراسية متكاملة مغطاة علمياً',
    subjectVideosTitle: 'المقاطع التعليمية والمحاضرات المفصلة',
    subjectNoVideos: 'سيتم توجيه المحاضرات الحية وبث الفيديوهات إليك مباشرة هنا بمجرد توفر جدول الحصة.',
    currency: 'جنيه مصري',
    balance: 'الرصيد الحالي',
    everythingSaved: 'تم حفظ كل شيء',
    contactSupport: 'تواصل معنا واتساب',
    studentProfileTitle: 'الملف الأكاديمي للطالب',
    studentProfileSubtitle: 'جميع بياناتك مسجلة وموثقة بصورة كاملة لمتابعة مسار الامتحانات',
    selectAvatar: 'تخصيص صورة الرمز التعبيري للطالب',
    uploadCustomAvatar: 'أو صلة رابط مخصصة لصورتك',
    saveProfile: 'تأكيد وحفظ التغييرات',
    logout: 'تسجيل الخروج',
    back: 'الرجوع للخلف',
    earnedRewardMessage: 'تهانينا الحارة! لقد ربحت مكافأة ترحيبية فورية بقيمة ٥٠٠ جنيه مصري في محفظتك بمناسبة انضمامك لمنصة الجربعي!',
    loginToAccess: 'يرجى تسجيل الدخول للوصول للمحاضرات والأرصدة التفاعلية',
    invalidLogin: 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى المحاولة ثانية!',
    mismatchPassword: 'كلتا كلمتا المرور المدخلتان غير متطابقتين!',
    fillAllFields: 'الرجاء ملء جميع الحقول المطلوبة بما في ذلك المحافظ والمحافظات بدقة لإنشاء حساب معتمد!',
    everythingSavedTooltip: 'بياناتك الأكاديمية والمالية يتم تشفيرها محلياً بأمان تام. لن تفقد معلوماتك أبداً بفضل الحفظ التلقائي الزجاجي.',
    forgotPasswordTitle: 'استعادة وتعديل كلمة المرور المنسية',
    forgotPasswordSub: 'ستقوم بتحديث كلمة المرور على الفور وتجريب الدخول الإلكتروني الميسر.',
    enterEmailReset: 'أدخل البريد الإلكتروني المسجل لدينا',
    enterNewPasswordReset: 'أدخل كلمة مرور قوية وجديدة',
    enterNewPasswordConfirmReset: 'يرجى إعادة تأكيد كلمة المرور الجديدة',
    successReset: 'تم تغيير كلمة المرور بنجاح تام! يرجى تسجيل الدخول باستخدام البيانات المحدثة.',
    walletTypeLabel: 'نوع المحفظة:',
    governorateLabel: 'المحافظة الحالية:',
    stageLabel: 'المرحلة الدراسية:'
  },
  en: {
    title: 'Al-Jarabee Educational Platform',
    subtitle: 'Your Gateway to Academic Precision & Success',
    darkMode: 'Dark Theme',
    lightMode: 'Light Theme',
    welcome: 'Welcome',
    home: 'Home',
    login: 'Log In',
    register: 'Create New Account',
    createAccount: 'Register Account & Autosave',
    firstNamePlaceholder: 'Student\'s First Name',
    thirdNamePlaceholder: 'Third Name (Grandfather\'s Name)',
    studentPhone: 'Student\'s Phone Number (WhatsApp preferred)',
    guardianPhone: 'Guardian\'s Phone Number',
    chooseWallet: 'Choose Mobile Wallet for Subscription',
    chooseGovernorate: 'Choose Egyptian Governorate',
    chooseStage: 'Choose Secondary School Stage',
    email: 'Digital Education Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    saveNewPassword: 'Save & Apply New Password',
    stagesHeader: 'Explore Your Academic Stage',
    stagesSub: 'Browse professional courses, curriculum details, and lectures',
    firstSecondary: 'First Secondary Grade',
    secondSecondary: 'Second Secondary Grade',
    thirdSecondary: 'Third Secondary Grade',
    notStartedTitle: 'Lectures Have Not Started Yet',
    notStartedDesc: 'The curriculum structure and video lectures are being assembled by our elite academic staff. Please tune in shortly. Thank you for your patience and aspiration.',
    thirdStageDetailHeader: 'Third Secondary Stage Future-Proof Curriculum',
    subjectsCount: '6 integrated academic subjects professionally covered',
    subjectVideosTitle: 'Educational Chapters & Screened Lectures',
    subjectNoVideos: 'Lectures and live review videos will show up directly here according to the schedule.',
    currency: 'EGP',
    balance: 'Current Balance',
    everythingSaved: 'Everything is Saved',
    contactSupport: 'WhatsApp Support Chat',
    studentProfileTitle: 'Student Academic File',
    studentProfileSubtitle: 'Your verified personal and billing credentials are fully maintained',
    selectAvatar: 'Choose Representative Student Avatar',
    uploadCustomAvatar: 'Or paste custom image web URL link',
    saveProfile: 'Save & Update Details',
    logout: 'Sign Out',
    back: 'Return Back',
    earnedRewardMessage: 'Huge congratulations! You earned an instant signup welcome bonus of 500 EGP deposited into your digital wallet!',
    loginToAccess: 'Please sign in to access courses, track lectures and spend interactive credits',
    invalidLogin: 'Incorrect email or password. Please verify and try again!',
    mismatchPassword: 'The entered passwords do not match each other!',
    fillAllFields: 'Please safely fill out all requested data, wallet and governorates to deploy your profile!',
    everythingSavedTooltip: 'All academic details and wallet balances are safely encrypted in real-time. Autosave protects your current state.',
    forgotPasswordTitle: 'Recover & Reset Account Password',
    forgotPasswordSub: 'Update your account credentials immediately to prevent learning disruptions.',
    enterEmailReset: 'Enter Registered Account Email',
    enterNewPasswordReset: 'Enter Strong New Password',
    enterNewPasswordConfirmReset: 'Re-enter & Confirm New Password',
    successReset: 'Password reset successfully! Please log in with your updated credentials.',
    walletTypeLabel: 'Wallet Type:',
    governorateLabel: 'Current Governorate:',
    stageLabel: 'Academic Grade:'
  }
};
