import { Link } from "react-router-dom";
import { Stethoscope, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
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
              Your trusted virtual healthcare partner. Quality medical care from the comfort of your home.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-background mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/services", label: "Services" },
                { to: "/doctors", label: "Find a Doctor" },
                { to: "/auth?tab=register", label: "Patient Registration" },
                { to: "/auth?tab=register&role=doctor", label: "Doctor Registration" },
                { to: "/blog", label: "Health Blog" },
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
            <h4 className="font-display font-semibold text-background mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              {["Telemedicine", "Lab Requests", "E-Prescriptions", "Virtual Pharmacy", "Mental Health"].map((s) => (
                <li key={s}>
                  <Link to="/services" className="hover:text-primary transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-background mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> 1-800-123-4567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> support@smartcare.com
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>123 Healthcare Ave, Medical City, MC 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-background/50">
          <p>&copy; {new Date().getFullYear()} SmartCare. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
