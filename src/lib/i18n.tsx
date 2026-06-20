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

    // Services page
    "services.heroTitle": "Our Services",
    "services.heroDesc": "Comprehensive virtual healthcare services to meet all your medical needs.",
    "services.telemedicine.title": "Telemedicine",
    "services.telemedicine.desc": "Connect with certified doctors via high-quality video calls. Get diagnosed, treated, and prescribed without leaving home.",
    "services.telemedicine.f1": "HD Video Calls",
    "services.telemedicine.f2": "Screen Sharing",
    "services.telemedicine.f3": "Recording Available",
    "services.chat.title": "Chat Consultation",
    "services.chat.desc": "Quick text-based consultations for non-urgent medical questions. Share images and documents instantly.",
    "services.chat.f1": "Real-time Messaging",
    "services.chat.f2": "File Sharing",
    "services.chat.f3": "Message History",
    "services.lab.title": "Lab Test Requests",
    "services.lab.desc": "Order lab tests online. Visit partner labs or request home sample collection.",
    "services.lab.f1": "100+ Test Types",
    "services.lab.f2": "Home Collection",
    "services.lab.f3": "Digital Results",
    "services.pharm.title": "Virtual Pharmacy",
    "services.pharm.desc": "Get your prescriptions filled and delivered to your doorstep with our pharmacy partners.",
    "services.pharm.f1": "Same-day Delivery",
    "services.pharm.f2": "Auto Refills",
    "services.pharm.f3": "Price Comparison",
    "services.mental.title": "Mental Health",
    "services.mental.desc": "Access licensed therapists and counselors for therapy sessions, stress management, and mental wellness.",
    "services.mental.f1": "Licensed Therapists",
    "services.mental.f2": "CBT & DBT",
    "services.mental.f3": "Group Sessions",
    "services.eprescription.title": "E-Prescriptions",
    "services.eprescription.desc": "Receive digital prescriptions directly from your doctor, shareable with any pharmacy.",
    "services.eprescription.f1": "Digital Format",
    "services.eprescription.f2": "Pharmacy Integration",
    "services.eprescription.f3": "Refill Requests",
    "services.monitor.title": "Health Monitoring",
    "services.monitor.desc": "Track vital signs, manage chronic conditions, and get personalized health insights.",
    "services.monitor.f1": "Vitals Tracking",
    "services.monitor.f2": "Alerts & Reminders",
    "services.monitor.f3": "Reports",
    "services.delivery.title": "Medicine Delivery",
    "services.delivery.desc": "Order medicines online and get them delivered fast through our trusted logistics partners.",
    "services.delivery.f1": "Express Delivery",
    "services.delivery.f2": "Order Tracking",
    "services.delivery.f3": "Secure Packaging",
    "services.ctaTitle": "Need a Consultation?",
    "services.ctaDesc": "Book an appointment with a specialist today and get the care you deserve.",
    "services.ctaBtn": "Find a Doctor",

    // Doctors page
    "doctors.heroTitle": "Our Doctors",
    "doctors.heroDesc": "Find and book appointments with certified healthcare professionals.",
    "doctors.searchPlaceholder": "Search by name or specialty...",
    "doctors.allSpecialties": "All Specialties",
    "doctors.noResults": "No doctors found matching your criteria.",
    "doctors.adjustSearch": "Try adjusting your search or filter.",
    "doctors.yrExp": "yr exp",
    "doctors.defaultBio": "Experienced healthcare professional dedicated to patient care.",
    "doctors.book": "Book Appointment",
    "doctors.general": "General",

    // Book Appointment page
    "book.heroTitle": "Book Appointment",
    "book.heroDesc": "Schedule your consultation with a healthcare professional",
    "book.back": "Back",
    "book.title": "Book Appointment",
    "book.loading": "Loading doctor information...",
    "book.paymentInfo": "Payment Information",
    "book.bank": "Bank:",
    "book.account": "Account:",
    "book.transferNote": "Transfer the consultation fee and upload the screenshot below before booking.",
    "book.date": "Date",
    "book.time": "Time",
    "book.consultationType": "Consultation Type",
    "book.videoCall": "Video Call",
    "book.chat": "Chat",
    "book.notes": "Notes (optional)",
    "book.notesPlaceholder": "Describe your symptoms or reason for visit...",
    "book.screenshot": "Payment Screenshot *",
    "book.screenshotAttached": "Screenshot attached",
    "book.change": "Change",
    "book.uploadPrompt": "Click to upload payment screenshot",
    "book.booking": "Booking...",
    "book.confirm": "Confirm Booking & Submit Payment",
    "book.signInRequired": "Please sign in to book",
    "book.uploadRequired": "Please upload your payment screenshot before booking",
    "book.success": "Appointment booked with payment! Admin will verify and send your consultation code.",
    "book.failed": "Booking failed",
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

    // Services page
    "services.heroTitle": "አገልግሎቶቻችን",
    "services.heroDesc": "ሁሉንም የጤና ፍላጎቶችዎን ለማሟላት የተሟሉ ቨርቹዋል የጤና አገልግሎቶች።",
    "services.telemedicine.title": "ቴሌሜዲሲን",
    "services.telemedicine.desc": "በከፍተኛ ጥራት የቪዲዮ ጥሪ ከተመሰከረላቸው ሐኪሞች ጋር ይገናኙ። ከቤት ሳይወጡ ምርመራ፣ ህክምና እና ማዘዣ ያግኙ።",
    "services.telemedicine.f1": "HD የቪዲዮ ጥሪዎች",
    "services.telemedicine.f2": "የስክሪን ማጋራት",
    "services.telemedicine.f3": "መቅዳት ይገኛል",
    "services.chat.title": "የቻት ምክክር",
    "services.chat.desc": "ለአስቸኳይ ላልሆኑ የህክምና ጥያቄዎች ፈጣን የጽሁፍ ምክክር። ምስሎችን እና ሰነዶችን በፍጥነት ያጋሩ።",
    "services.chat.f1": "በቅጽበት መልዕክት መለዋወጥ",
    "services.chat.f2": "ፋይል ማጋራት",
    "services.chat.f3": "የመልዕክት ታሪክ",
    "services.lab.title": "የላብራቶሪ ምርመራ ጥያቄዎች",
    "services.lab.desc": "የላብ ምርመራዎችን በመስመር ላይ ያዝዙ። አጋር ላቦራቶሪዎችን ይጎብኙ ወይም የቤት ናሙና አሰባሰብ ይጠይቁ።",
    "services.lab.f1": "ከ100 በላይ የምርመራ ዓይነቶች",
    "services.lab.f2": "የቤት ናሙና አሰባሰብ",
    "services.lab.f3": "ዲጂታል ውጤቶች",
    "services.pharm.title": "ቨርቹዋል ፋርማሲ",
    "services.pharm.desc": "ማዘዣዎችዎን ከፋርማሲ አጋሮቻችን ጋር ወደ ቤትዎ ያድርሱ።",
    "services.pharm.f1": "በተመሳሳይ ቀን ማድረስ",
    "services.pharm.f2": "ራስ ሰር መሙላት",
    "services.pharm.f3": "የዋጋ ንፅፅር",
    "services.mental.title": "የአእምሮ ጤና",
    "services.mental.desc": "ለቴራፒ ክፍለ ጊዜዎች፣ ለጭንቀት አስተዳደር እና ለአእምሮ ጤንነት የተፈቀደላቸውን ቴራፒስቶች እና አማካሪዎች ያግኙ።",
    "services.mental.f1": "የተፈቀደላቸው ቴራፒስቶች",
    "services.mental.f2": "CBT እና DBT",
    "services.mental.f3": "የቡድን ክፍለ ጊዜዎች",
    "services.eprescription.title": "ኤሌክትሮኒክ ማዘዣ",
    "services.eprescription.desc": "ከሐኪምዎ በቀጥታ ዲጂታል ማዘዣ ይቀበሉ፣ ለማንኛውም ፋርማሲ የሚጋራ።",
    "services.eprescription.f1": "ዲጂታል ቅርጸት",
    "services.eprescription.f2": "የፋርማሲ ውህደት",
    "services.eprescription.f3": "የመሙላት ጥያቄዎች",
    "services.monitor.title": "የጤና ክትትል",
    "services.monitor.desc": "ወሳኝ የሰውነት ምልክቶችን ይከታተሉ፣ ሥር የሰደደ በሽታዎችን ያስተዳድሩ እና ግላዊ የጤና ግንዛቤዎችን ያግኙ።",
    "services.monitor.f1": "ወሳኝ ምልክቶች ክትትል",
    "services.monitor.f2": "ማንቂያ እና ማስታወሻዎች",
    "services.monitor.f3": "ሪፖርቶች",
    "services.delivery.title": "የመድሃኒት ማድረስ",
    "services.delivery.desc": "መድሃኒቶችን በመስመር ላይ ያዝዙ እና በታመኑ የሎጂስቲክስ አጋሮቻችን በፍጥነት ይደርስዎታል።",
    "services.delivery.f1": "ፈጣን ማድረስ",
    "services.delivery.f2": "የትዕዛዝ ክትትል",
    "services.delivery.f3": "ደህንነቱ የተጠበቀ ማሸግ",
    "services.ctaTitle": "ምክክር ይፈልጋሉ?",
    "services.ctaDesc": "ዛሬ ከባለሙያ ጋር ቀጠሮ ይያዙ እና የሚገባዎትን እንክብካቤ ያግኙ።",
    "services.ctaBtn": "ሐኪም ይፈልጉ",

    // Doctors page
    "doctors.heroTitle": "ሐኪሞቻችን",
    "doctors.heroDesc": "ከተመሰከረላቸው የጤና ባለሙያዎች ጋር ቀጠሮ ይያዙ።",
    "doctors.searchPlaceholder": "በስም ወይም በልዩ ሙያ ይፈልጉ...",
    "doctors.allSpecialties": "ሁሉም ልዩ ሙያዎች",
    "doctors.noResults": "ከመስፈርትዎ ጋር የሚዛመድ ሐኪም አልተገኘም።",
    "doctors.adjustSearch": "ፍለጋዎን ወይም ማጣሪያዎን ይቀይሩ።",
    "doctors.yrExp": "ዓመት ልምድ",
    "doctors.defaultBio": "ለታካሚ እንክብካቤ የተወሰነ ልምድ ያለው የጤና ባለሙያ።",
    "doctors.book": "ቀጠሮ ይያዙ",
    "doctors.general": "ጠቅላላ",

    // Book Appointment page
    "book.heroTitle": "ቀጠሮ ይያዙ",
    "book.heroDesc": "ከጤና ባለሙያ ጋር ምክክርዎን ይዘጋጁ",
    "book.back": "ተመለስ",
    "book.title": "ቀጠሮ ይያዙ",
    "book.loading": "የሐኪም መረጃ በመጫን ላይ...",
    "book.paymentInfo": "የክፍያ መረጃ",
    "book.bank": "ባንክ፡",
    "book.account": "ሂሳብ፡",
    "book.transferNote": "የምክክር ክፍያውን ያስተላልፉ እና ቀጠሮ ከመያዝዎ በፊት ስክሪንሾቱን ከታች ይስቀሉ።",
    "book.date": "ቀን",
    "book.time": "ሰዓት",
    "book.consultationType": "የምክክር ዓይነት",
    "book.videoCall": "የቪዲዮ ጥሪ",
    "book.chat": "ቻት",
    "book.notes": "ማስታወሻዎች (አማራጭ)",
    "book.notesPlaceholder": "የበሽታ ምልክቶችዎን ወይም የጉብኝት ምክንያትዎን ይግለጹ...",
    "book.screenshot": "የክፍያ ስክሪንሾት *",
    "book.screenshotAttached": "ስክሪንሾት ተያይዟል",
    "book.change": "ቀይር",
    "book.uploadPrompt": "የክፍያ ስክሪንሾት ለመስቀል ጠቅ ያድርጉ",
    "book.booking": "በመያዝ ላይ...",
    "book.confirm": "ቀጠሮ አረጋግጥ እና ክፍያ አስገባ",
    "book.signInRequired": "ቀጠሮ ለመያዝ እባክዎ ይግቡ",
    "book.uploadRequired": "ቀጠሮ ከመያዝዎ በፊት እባክዎ የክፍያ ስክሪንሾትዎን ይስቀሉ",
    "book.success": "ቀጠሮ ከክፍያ ጋር ተይዟል! አስተዳዳሪ ያረጋግጥና የምክክር ኮድዎን ይልክልዎታል።",
    "book.failed": "ቀጠሮ መያዝ አልተሳካም",
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