import { Link } from "react-router-dom";
import { Stethoscope, Mail, Phone, MapPin } from "lucide-react";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { settings } = useAppSettings();
  const { t } = useLanguage();
  const contactPhone = settings.contact_phone || "1-800-123-4567";
  const contactEmail = settings.contact_email || "support@smartcare.com";

  return (
    <footer className="bg-foreground text-background/80">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-background">
                Smart<span className="text-primary">Care</span>
              </span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-background mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/services", label: t("footer.services") },
                { to: "/doctors", label: t("footer.findDoctor") },
                { to: "/auth?tab=register", label: t("footer.patientReg") },
                { to: "/auth?tab=register&role=doctor", label: t("footer.doctorReg") },
                { to: "/blog", label: t("footer.healthBlog") },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-background mb-4">{t("footer.services")}</h4>
            <ul className="space-y-2 text-sm">
              {[
                t("footer.svc.telemedicine"),
                t("footer.svc.lab"),
                t("footer.svc.eprescriptions"),
                t("footer.svc.pharmacy"),
                t("footer.svc.mental"),
              ].map((s) => (
                <li key={s}>
                  <Link to="/services" className="hover:text-primary transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-background mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> {contactPhone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> {contactEmail}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>123 Healthcare Ave, Medical City, MC 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-background/50">
          <p>&copy; {new Date().getFullYear()} SmartCare. {t("footer.rights")}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-primary transition-colors">{t("footer.privacy")}</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
