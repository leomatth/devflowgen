import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { content } from "@/lib/i18n";
import { supabase } from "@/lib/supabase/client";
import { toast } from "@/components/ui/sonner";

interface NavbarProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const localeLabels: Record<Locale, string> = { en: "EN", es: "ES", pt: "PT" };

const Navbar = ({ locale, onLocaleChange }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const t = content[locale].nav;

  useEffect(() => {
    if (!supabase) {
      setIsAuthenticated(false);
      return;
    }

    const syncSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsAuthenticated(Boolean(session));
    };

    void syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    if (!supabase) {
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout.");
      return;
    }

    toast.success("Logged out successfully.");
  };

  const nextLocale = (): Locale => {
    const locales: Locale[] = ["en", "es", "pt"];
    const idx = locales.indexOf(locale);
    return locales[(idx + 1) % locales.length];
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        <span className="text-lg font-bold tracking-tight text-foreground">
          DevFlow <span className="text-gradient-primary">AI</span>
        </span>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.product}</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.pricing}</a>
          <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.contact}</a>
          <button
            onClick={() => onLocaleChange(nextLocale())}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Globe className="w-4 h-4" />
            {localeLabels[locale]}
          </button>
          {isAuthenticated ? (
            <>
              <Button asChild variant="hero-outline" size="sm"><Link to="/dashboard">Dashboard</Link></Button>
              <Button variant="hero" size="sm" onClick={() => void handleLogout()}>Logout</Button>
            </>
          ) : (
            <>
              <Button asChild variant="hero-outline" size="sm"><Link to="/auth?mode=signin">{t.login}</Link></Button>
              <Button asChild variant="hero" size="sm"><Link to="/auth?mode=signup">{t.start}</Link></Button>
            </>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-border bg-background px-6 pb-6 space-y-4"
        >
          <a href="#features" className="block text-sm text-muted-foreground">{t.product}</a>
          <a href="#pricing" className="block text-sm text-muted-foreground">{t.pricing}</a>
          <a href="#contact" className="block text-sm text-muted-foreground">{t.contact}</a>
          <button onClick={() => onLocaleChange(nextLocale())} className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Globe className="w-4 h-4" /> {localeLabels[locale]}
          </button>
          {isAuthenticated ? (
            <>
              <Button asChild variant="hero-outline" size="sm" className="w-full"><Link to="/dashboard">Dashboard</Link></Button>
              <Button variant="hero" size="sm" className="w-full" onClick={() => void handleLogout()}>Logout</Button>
            </>
          ) : (
            <>
              <Button asChild variant="hero-outline" size="sm" className="w-full"><Link to="/auth?mode=signin">{t.login}</Link></Button>
              <Button asChild variant="hero" size="sm" className="w-full"><Link to="/auth?mode=signup">{t.start}</Link></Button>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
