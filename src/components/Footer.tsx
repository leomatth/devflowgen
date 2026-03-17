import type { Content } from "@/lib/i18n";

interface FooterProps {
  t: Content["footer"];
}

const Footer = ({ t }: FooterProps) => {
  return (
    <footer className="border-t border-border py-12 px-6" id="contact">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} DevFlow AI. {t.rights}
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.product}</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.pricing}</a>
          <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.contact}</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.terms}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
