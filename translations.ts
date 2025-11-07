export type Language = "fa" | "ar" | "en";

export const translations = {
  fa: {
    // Header
    title: "تحلیل پوست و صورت",
    subtitle: "Dr.PAL AI - دکتر عباس دشتی",
    
    // Language selector
    selectLanguage: "انتخاب زبان",
    
    // Home page
    uploadPhoto: "آپلود عکس صورت",
    uploadDescription: "برای تحلیل دقیق، لطفاً یک عکس روبه‌رو با نور یکنواخت و بدون فیلتر آپلود کنید",
    clickOrDrag: "کلیک کنید یا عکس را بکشید",
    fileSize: "10MB تا PNG, JPG",
    
    // Questionnaire
    questionnaire: "پرسشنامه پیش از تحلیل",
    skinType: "نوع پوست شما:",
    concerns: "نگرانی‌های اصلی:",
    treatments: "روش‌های کلینیکی قبلی:",
    routine: "روتین مراقبت:",
    sunscreen: "استفاده از ضدآفتاب:",
    
    // Results
    analysisResults: "نتایج تحلیل",
    skinHealthScore: "امتیاز سلامت پوست",
    regionAnalysis: "تحلیل نواحی صورت",
    agingIndicators: "شاخص‌های پیری",
    recommendations: "توصیه‌های شخصی",
    leaderboard: "مقایسه با افراد هم‌سن",
    
    // Referral
    referralCode: "کد معرفی",
    referralReward: "هر معرفی = ۱ تحلیل رایگان",
    shareCode: "کد خود را اشتراک بگذارید",
    
    // Buttons
    continue: "ادامه",
    analyze: "تحلیل کنید",
    share: "اشتراک",
    download: "دانلود",
    back: "بازگشت",
    
    // Payment
    paymentTitle: "پرداخت",
    price: "رایگان",
    payNow: "پرداخت کنید",
    applyCode: "اعمال کد",
    
    // DrPal
    drpalDownload: "دانلود DrPal",
    appStore: "دانلود از App Store",
    googlePlay: "دانلود از Google Play",
  },
  
  ar: {
    // Header
    title: "تحليل البشرة والوجه",
    subtitle: "Dr.PAL AI - د. عباس الدشتي",
    
    // Language selector
    selectLanguage: "اختر اللغة",
    
    // Home page
    uploadPhoto: "تحميل صورة الوجه",
    uploadDescription: "يرجى تحميل صورة أمامية بإضاءة موحدة وبدون مرشحات للحصول على تحليل دقيق",
    clickOrDrag: "انقر أو اسحب الصورة",
    fileSize: "حتى 10 ميجابايت PNG أو JPG",
    
    // Questionnaire
    questionnaire: "استبيان ما قبل التحليل",
    skinType: "نوع بشرتك:",
    concerns: "المخاوف الرئيسية:",
    treatments: "العلاجات السريرية السابقة:",
    routine: "روتين العناية:",
    sunscreen: "استخدام واقي الشمس:",
    
    // Results
    analysisResults: "نتائج التحليل",
    skinHealthScore: "درجة صحة البشرة",
    regionAnalysis: "تحليل مناطق الوجه",
    agingIndicators: "مؤشرات الشيخوخة",
    recommendations: "التوصيات الشخصية",
    leaderboard: "المقارنة مع الأقران",
    
    // Referral
    referralCode: "كود الإحالة",
    referralReward: "كل إحالة = تحليل مجاني واحد",
    shareCode: "شارك الكود الخاص بك",
    
    // Buttons
    continue: "متابعة",
    analyze: "حلل",
    share: "مشاركة",
    download: "تحميل",
    back: "رجوع",
    
    // Payment
    paymentTitle: "الدفع",
    price: "20 د.إ",
    payNow: "ادفع الآن",
    applyCode: "تطبيق الرمز",
    
    // DrPal
    drpalDownload: "تحميل DrPal",
    appStore: "التحميل من App Store",
    googlePlay: "التحميل من Google Play",
  },
  
  en: {
    // Header
    title: "Face & Skin Analysis",
    subtitle: "Dr.PAL AI - Dr. Abbas Deshti",
    
    // Language selector
    selectLanguage: "Select Language",
    
    // Home page
    uploadPhoto: "Upload Face Photo",
    uploadDescription: "Please upload a front-facing photo with even lighting and no filters for accurate analysis",
    clickOrDrag: "Click or drag image",
    fileSize: "Up to 10MB PNG, JPG",
    
    // Questionnaire
    questionnaire: "Pre-Analysis Questionnaire",
    skinType: "Your skin type:",
    concerns: "Main concerns:",
    treatments: "Previous clinical treatments:",
    routine: "Care routine:",
    sunscreen: "Sunscreen usage:",
    
    // Results
    analysisResults: "Analysis Results",
    skinHealthScore: "Skin Health Score",
    regionAnalysis: "Facial Region Analysis",
    agingIndicators: "Aging Indicators",
    recommendations: "Personal Recommendations",
    leaderboard: "Comparison with Peers",
    
    // Referral
    referralCode: "Referral Code",
    referralReward: "Each referral = 1 free analysis",
    shareCode: "Share your code",
    
    // Buttons
    continue: "Continue",
    analyze: "Analyze",
    share: "Share",
    download: "Download",
    back: "Back",
    
    // Payment
    paymentTitle: "Payment",
    price: "6 USD",
    payNow: "Pay Now",
    applyCode: "Apply Code",
    
    // DrPal
    drpalDownload: "Download DrPal",
    appStore: "Download from App Store",
    googlePlay: "Download from Google Play",
  },
};

export function getTranslation(language: Language, key: keyof typeof translations.fa): string {
  return translations[language][key] || translations.fa[key];
}
