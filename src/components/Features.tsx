import { motion } from "framer-motion";
import { Sparkles, LayoutGrid, Copy, Layers, Download, Smartphone } from "lucide-react";
import type { Content } from "@/lib/i18n";

interface FeaturesProps {
  t: Content["features"];
}

const icons = [Sparkles, LayoutGrid, Copy, Layers, Download, Smartphone];

const Features = ({ t }: FeaturesProps) => {
  return (
    <section className="py-24 px-6" id="features">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{t.title}</h2>
          <p className="mt-4 text-muted-foreground text-lg">{t.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="beam-hover p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors duration-500"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
