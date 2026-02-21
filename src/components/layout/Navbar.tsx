import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";
import { useAppSettings } from "@/hooks/use-app-settings";
import {
  Menu,
  X,
  Phone,
  Stethoscope,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/special-care", label: "Special Care" },
  { href: "/doctors", label: "Doctors" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const emergencyPhone = settings.emergency_phone || "1-800-123-4567";

  const dashboardPath =
    role === "admin" ? "/admin" : role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard";

  return (
    <>
      {/* Emergency bar */}
      <div className="bg-destructive text-destructive-foreground text-center text-sm py-1.5 font-medium flex items-center justify-center gap-2">
        <Phone className="h-3.5 w-3.5" />
        Emergency? Call{" "}
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
            {user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate(dashboardPath)}>
                  <LayoutDashboard className="h-4 w-4 mr-1" /> Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-1" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate("/auth?tab=register")}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
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
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setOpen(false);
                      }}
                      className="px-4 py-3 text-sm font-medium text-left rounded-lg hover:bg-muted text-destructive"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/auth?tab=register"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 text-sm font-medium rounded-lg bg-primary text-primary-foreground text-center"
                    >
                      Get Started
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
