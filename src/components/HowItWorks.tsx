import { motion } from "framer-motion";
import type { Content } from "@/lib/i18n";

interface HowItWorksProps {
  t: Content["steps"];
}

const HowItWorks = ({ t }: HowItWorksProps) => {
  return (
    <section className="py-24 px-6" id="how-it-works">
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

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12">
            {t.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex gap-6 md:gap-8 items-start"
              >
                <div className="relative z-10 flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-xl bg-card border border-border flex items-center justify-center font-mono text-sm md:text-base font-bold text-gradient-primary">
                  {item.step}
                </div>
                <div className="pt-1 md:pt-3">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
