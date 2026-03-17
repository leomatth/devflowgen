import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Content } from "@/lib/i18n";

interface PricingProps {
  t: Content["pricing"];
}

const Pricing = ({ t }: PricingProps) => {
  return (
    <section className="py-24 px-6" id="pricing">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{t.title}</h2>
          <p className="mt-4 text-muted-foreground text-lg">{t.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-card border border-border flex flex-col"
          >
            <h3 className="text-xl font-semibold text-foreground">{t.free.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">{t.free.price}</span>
              <span className="text-muted-foreground">{t.free.period}</span>
            </div>
            <ul className="mt-8 space-y-3 flex-1">
              {t.free.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="hero-outline" size="lg" className="mt-8 w-full">{t.free.cta}</Button>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative p-8 rounded-2xl bg-card border border-primary/40 flex flex-col border-glow"
          >
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
              {t.pro.badge}
            </div>
            <h3 className="text-xl font-semibold text-foreground">{t.pro.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">{t.pro.price}</span>
              <span className="text-muted-foreground">{t.pro.period}</span>
            </div>
            <ul className="mt-8 space-y-3 flex-1">
              {t.pro.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="hero" size="lg" className="mt-8 w-full">{t.pro.cta}</Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
