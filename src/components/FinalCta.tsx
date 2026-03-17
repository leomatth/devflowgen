import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Content } from "@/lib/i18n";

interface FinalCtaProps {
  t: Content["finalCta"];
}

const FinalCta = ({ t }: FinalCtaProps) => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow opacity-20 blur-[100px] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{t.title}</h2>
        <p className="mt-4 text-muted-foreground text-lg">{t.subtitle}</p>
        <Button variant="hero" size="xl" className="mt-10">{t.cta}</Button>
      </motion.div>
    </section>
  );
};

export default FinalCta;
