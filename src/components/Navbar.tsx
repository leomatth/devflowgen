import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { content } from "@/lib/i18n";

interface NavbarProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const localeLabels: Record<Locale, string> = { en: "EN", es: "ES", pt: "PT" };

const Navbar = ({ locale, onLocaleChange }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const t = content[locale].nav;

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

        {/* Desktop */}
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
          <Button variant="hero" size="sm">{t.start}</Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
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
          <Button variant="hero" size="sm" className="w-full">{t.start}</Button>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
