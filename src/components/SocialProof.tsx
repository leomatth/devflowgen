import { motion } from "framer-motion";
import type { Content } from "@/lib/i18n";

interface SocialProofProps {
  t: Content["social"];
}

const logos = ["Acme Corp", "Nebula", "Quantum", "Vertex", "Prism"];

const SocialProof = ({ t }: SocialProofProps) => {
  return (
    <section className="py-16 px-6 border-t border-border/50">
      <div className="max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm text-muted-foreground mb-10"
        >
          {t.text}
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {logos.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-muted-foreground/40 font-semibold text-lg tracking-wide"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
