import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "en" | "am";

type Dict = Record<string, string>;

const translations: Record<Language, Dict> = {
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.specialCare": "Special Care",
    "nav.doctors": "Doctors",
    "nav.contact": "Contact",
    "nav.faq": "FAQ",
    "nav.signIn": "Sign In",
    "nav.getStarted": "Get Started",
    "nav.dashboard": "Dashboard",
    "nav.signOut": "Sign Out",
    "nav.emergency": "Emergency? Call",
    "lang.label": "Language",

    // Footer
    "footer.tagline":
      "Your trusted virtual healthcare partner. Quality medical care from the comfort of your home.",
    "footer.quickLinks": "Quick Links",
    "footer.services": "Services",
    "footer.contact": "Contact",
    "footer.findDoctor": "Find a Doctor",
    "footer.patientReg": "Patient Registration",
    "footer.doctorReg": "Doctor Registration",
    "footer.healthBlog": "Health Blog",
    "footer.svc.telemedicine": "Telemedicine",
    "footer.svc.lab": "Lab Requests",
    "footer.svc.eprescriptions": "E-Prescriptions",
    "footer.svc.pharmacy": "Virtual Pharmacy",
    "footer.svc.mental": "Mental Health",
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",

    // Home / Hero
    "home.badge": "Trusted Virtual Healthcare",
    "home.heroTitle1": "Quality Healthcare,",
    "home.heroTitle2": "Anytime, Anywhere",
    "home.heroDesc":
      "Connect with certified doctors through video or chat consultations. Get prescriptions, lab results, and pharmacy services — all from the comfort of your home.",
    "home.bookConsult": "Book Consultation",
    "home.browseDoctors": "Browse Doctors",
    "home.happyPatients": "Happy Patients",
    "home.nextAppt": "Next Appointment",
    "home.today230": "Today, 2:30 PM",

    // Stats
    "stat.patients": "Patients Served",
    "stat.doctors": "Verified Doctors",
    "stat.satisfaction": "Satisfaction Rate",
    "stat.available": "Available",

    // Services section
    "home.ourServices": "Our Services",
    "home.ourServicesDesc":
      "Comprehensive virtual healthcare services designed for your convenience",
    "svc.video.title": "Video Consultation",
    "svc.video.desc": "Face-to-face with doctors from home",
    "svc.chat.title": "Chat Consultation",
    "svc.chat.desc": "Quick text-based medical advice",
    "svc.lab.title": "Lab Test Requests",
    "svc.lab.desc": "Order lab tests online easily",
    "svc.pharm.title": "Virtual Pharmacy",
    "svc.pharm.desc": "E-prescriptions & delivery",
    "svc.mental.title": "Mental Health",
    "svc.mental.desc": "Therapy & counseling sessions",
    "svc.monitor.title": "Health Monitoring",
    "svc.monitor.desc": "Track and manage your health",
    "home.viewAll": "View All Services",

    // Demo + How
    "home.demoTitle": "See How It Works",
    "home.demoDesc": "Watch a quick demo to learn how SmartCare makes healthcare simple",
    "home.howTitle": "How It Works",
    "home.howDesc": "Get started in three simple steps",
    "home.step1": "Create Account",
    "home.step1desc": "Sign up as a patient or doctor in minutes",
    "home.step2": "Book Appointment",
    "home.step2desc": "Choose your doctor, date, and consultation type",
    "home.step3": "Start Consultation",
    "home.step3desc": "Connect via video or chat with your doctor",

    // Testimonials + CTA
    "home.testimonials": "What Patients Say",
    "home.cta.title": "Ready to Get Started?",
    "home.cta.desc": "Join thousands of patients who trust SmartCare for their healthcare needs.",
    "home.cta.create": "Create Free Account",
    "home.cta.contact": "Contact Us",
  },
  am: {
    // Navbar
    "nav.home": "መነሻ",
    "nav.services": "አገልግሎቶች",
    "nav.specialCare": "ልዩ እንክብካቤ",
    "nav.doctors": "ሐኪሞች",
    "nav.contact": "አግኙን",
    "nav.faq": "ጥያቄዎች",
    "nav.signIn": "ግባ",
    "nav.getStarted": "ጀምር",
    "nav.dashboard": "ዳሽቦርድ",
    "nav.signOut": "ውጣ",
    "nav.emergency": "አደጋ? ይደውሉ",
    "lang.label": "ቋንቋ",

    // Footer
    "footer.tagline":
      "የታመነ የቨርቹዋል ጤና አጋርዎ። ጥራት ያለው የህክምና አገልግሎት ከቤትዎ ሆነው ያግኙ።",
    "footer.quickLinks": "ፈጣን አገናኞች",
    "footer.services": "አገልግሎቶች",
    "footer.contact": "አግኙን",
    "footer.findDoctor": "ሐኪም ይፈልጉ",
    "footer.patientReg": "የታካሚ ምዝገባ",
    "footer.doctorReg": "የሐኪም ምዝገባ",
    "footer.healthBlog": "የጤና ብሎግ",
    "footer.svc.telemedicine": "ቴሌሜዲሲን",
    "footer.svc.lab": "የላብራቶሪ ጥያቄዎች",
    "footer.svc.eprescriptions": "ኤሌክትሮኒክ ሐኪም ማዘዣ",
    "footer.svc.pharmacy": "ቨርቹዋል ፋርማሲ",
    "footer.svc.mental": "የአእምሮ ጤና",
    "footer.rights": "ሁሉም መብቶች የተጠበቁ ናቸው።",
    "footer.privacy": "የግላዊነት ፖሊሲ",
    "footer.terms": "የአገልግሎት ውሎች",

    // Home / Hero
    "home.badge": "የታመነ ቨርቹዋል ጤና አገልግሎት",
    "home.heroTitle1": "ጥራት ያለው ጤና፣",
    "home.heroTitle2": "በማንኛውም ጊዜ፣ በማንኛውም ቦታ",
    "home.heroDesc":
      "በቪዲዮ ወይም በቻት ምክክር ከተመሰከረላቸው ሐኪሞች ጋር ይገናኙ። ማዘዣ፣ የላብ ውጤት እና የፋርማሲ አገልግሎቶችን — ሁሉም ከቤትዎ ሆነው ያግኙ።",
    "home.bookConsult": "ምክክር ይያዙ",
    "home.browseDoctors": "ሐኪሞችን ይመልከቱ",
    "home.happyPatients": "ደስተኛ ታካሚዎች",
    "home.nextAppt": "ቀጣይ ቀጠሮ",
    "home.today230": "ዛሬ፣ 2:30 ከሰዓት",

    // Stats
    "stat.patients": "የተገለገሉ ታካሚዎች",
    "stat.doctors": "የተረጋገጡ ሐኪሞች",
    "stat.satisfaction": "የእርካታ መጠን",
    "stat.available": "ይገኛል",

    // Services
    "home.ourServices": "አገልግሎቶቻችን",
    "home.ourServicesDesc": "ለእርስዎ ምቾት የተዘጋጁ የተሟሉ ቨርቹዋል የጤና አገልግሎቶች",
    "svc.video.title": "የቪዲዮ ምክክር",
    "svc.video.desc": "ከቤትዎ ሆነው ከሐኪሞች ጋር ፊት ለፊት",
    "svc.chat.title": "የቻት ምክክር",
    "svc.chat.desc": "ፈጣን የጽሁፍ ምክር",
    "svc.lab.title": "የላብራቶሪ ምርመራ ጥያቄዎች",
    "svc.lab.desc": "የላብ ምርመራዎችን በቀላሉ በመስመር ላይ ያዝዙ",
    "svc.pharm.title": "ቨርቹዋል ፋርማሲ",
    "svc.pharm.desc": "ኤሌክትሮኒክ ማዘዣ እና ማድረስ",
    "svc.mental.title": "የአእምሮ ጤና",
    "svc.mental.desc": "የቴራፒ እና ምክር ክፍለ ጊዜዎች",
    "svc.monitor.title": "የጤና ክትትል",
    "svc.monitor.desc": "ጤናዎን ይከታተሉ እና ያስተዳድሩ",
    "home.viewAll": "ሁሉንም አገልግሎቶች ይመልከቱ",

    // Demo + How
    "home.demoTitle": "እንዴት እንደሚሰራ ይመልከቱ",
    "home.demoDesc": "SmartCare ጤናን እንዴት ቀላል እንደሚያደርግ ለማወቅ ፈጣን ማሳያ ይመልከቱ",
    "home.howTitle": "እንዴት እንደሚሰራ",
    "home.howDesc": "በሶስት ቀላል ደረጃዎች ይጀምሩ",
    "home.step1": "መለያ ይፍጠሩ",
    "home.step1desc": "በደቂቃዎች ውስጥ እንደ ታካሚ ወይም ሐኪም ይመዝገቡ",
    "home.step2": "ቀጠሮ ይያዙ",
    "home.step2desc": "ሐኪምዎን፣ ቀንዎን እና የምክክር ዓይነት ይምረጡ",
    "home.step3": "ምክክር ይጀምሩ",
    "home.step3desc": "ከሐኪምዎ ጋር በቪዲዮ ወይም በቻት ይገናኙ",

    // Testimonials + CTA
    "home.testimonials": "ታካሚዎች ምን ይላሉ",
    "home.cta.title": "ለመጀመር ዝግጁ ነዎት?",
    "home.cta.desc": "በጤናቸው ጉዳይ SmartCare ን ከሚያምኑ በሺዎች ከሚቆጠሩ ታካሚዎች ጋር ይቀላቀሉ።",
    "home.cta.create": "ነጻ መለያ ይፍጠሩ",
    "home.cta.contact": "ያግኙን",
  },
};

type Ctx = {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<Ctx | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    const saved = localStorage.getItem("smartcare-lang");
    return saved === "am" ? "am" : "en";
  });

  useEffect(() => {
    localStorage.setItem("smartcare-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Language) => setLangState(l);
  const t = (key: string) => translations[lang][key] ?? translations.en[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}