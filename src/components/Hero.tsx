import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Content } from "@/lib/i18n";
import dashboardMock from "@/assets/dashboard-mock.png";

interface HeroProps {
  t: Content["hero"];
}

const Hero = ({ t }: HeroProps) => {
  return (
    <section className="relative pt-[18vh] pb-[10vh] px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-balance font-extrabold tracking-tighter text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-gradient leading-[1.05]"
        >
          {t.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-muted-foreground text-base md:text-xl max-w-2xl mx-auto text-pretty"
        >
          {t.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild variant="hero" size="xl"><Link to="/dashboard">{t.cta}</Link></Button>
          <Button asChild variant="hero-outline" size="xl"><Link to="/dashboard">{t.demo}</Link></Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-20 relative max-w-5xl mx-auto group"
      >
        <div className="absolute -inset-1 bg-gradient-glow rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition duration-1000" />
        <div className="relative bg-card border border-border rounded-xl overflow-hidden shadow-card">
          <div className="h-8 border-b border-border bg-secondary/50 flex items-center px-4 gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
          </div>
          <img src={dashboardMock} alt="DevFlow AI Editor" className="w-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
