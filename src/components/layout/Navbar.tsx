import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useLanguage } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  Menu,
  X,
  Phone,
  Stethoscope,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const { t } = useLanguage();
  const emergencyPhone = settings.emergency_phone || "1-800-123-4567";

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/services", label: t("nav.services") },
    { href: "/special-care", label: t("nav.specialCare") },
    { href: "/doctors", label: t("nav.doctors") },
    { href: "/contact", label: t("nav.contact") },
    { href: "/faq", label: t("nav.faq") },
  ];

  const dashboardPath =
    role === "admin" ? "/admin" : role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard";

  return (
    <>
      {/* Emergency bar */}
      <div className="bg-destructive text-destructive-foreground text-center text-sm py-1.5 font-medium flex items-center justify-center gap-2">
        <Phone className="h-3.5 w-3.5" />
        {t("nav.emergency")}{" "}
        <a href={`tel:${emergencyPhone}`} className="underline font-bold">
          {emergencyPhone}
        </a>
      </div>

      <header className="sticky top-0 z-50 glass shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              Smart<span className="text-primary">Care</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            {user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate(dashboardPath)}>
                  <LayoutDashboard className="h-4 w-4 mr-1" /> {t("nav.dashboard")}
                </Button>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-1" /> {t("nav.signOut")}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                  {t("nav.signIn")}
                </Button>
                <Button size="sm" onClick={() => navigate("/auth?tab=register")}>
                  {t("nav.getStarted")}
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <div className="flex items-center gap-1 md:hidden">
              <LanguageSwitcher compact />
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
            </div>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-2 mt-8">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    to={l.href}
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="border-t my-2" />
                {user ? (
                  <>
                    <Link
                      to={dashboardPath}
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted"
                    >
                      {t("nav.dashboard")}
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setOpen(false);
                      }}
                      className="px-4 py-3 text-sm font-medium text-left rounded-lg hover:bg-muted text-destructive"
                    >
                      {t("nav.signOut")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted"
                    >
                      {t("nav.signIn")}
                    </Link>
                    <Link
                      to="/auth?tab=register"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 text-sm font-medium rounded-lg bg-primary text-primary-foreground text-center"
                    >
                      {t("nav.getStarted")}
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
