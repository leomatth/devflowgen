import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import type { Content } from "@/lib/i18n";
import { createStripeCheckoutSession } from "@/lib/stripe/createCheckoutSession";
import { CREDIT_PACK_OPTIONS, GENERATION_CREDIT_COST, PRO_OPTIONS } from "@/lib/billing/pricingOptions";

interface PricingProps {
  t: Content["pricing"];
}

const Pricing = ({ t }: PricingProps) => {
  const navigate = useNavigate();

  const startCheckout = async (priceId: string) => {
    try {
      const checkoutUrl = await createStripeCheckoutSession(priceId);
      window.location.assign(checkoutUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start checkout.";

      if (message.toLowerCase().includes("logged in")) {
        navigate("/auth?mode=signin");
        return;
      }

      toast.error(message);
    }
  };

  return (
    <section className="py-24 px-6" id="pricing">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-card border border-border flex flex-col"
          >
            <h3 className="text-xl font-semibold text-foreground">Free</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">€0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mt-8 space-y-3 flex-1">
              {[
                "1 generation per day",
                "Basic access",
                `1 generation = ${GENERATION_CREDIT_COST} credits`,
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant="hero-outline"
              size="lg"
              className="mt-8 w-full"
              onClick={() => navigate("/auth?mode=signup")}
            >
              Start Free
            </Button>
          </motion.div>

          {/* Credit Packs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative p-8 rounded-2xl bg-card border border-primary/40 flex flex-col border-glow"
          >
            <h3 className="text-xl font-semibold text-foreground">Credit Packs</h3>
            <p className="mt-2 text-sm text-muted-foreground">Credits never expire · 1 generation = {GENERATION_CREDIT_COST} credits</p>

            <div className="mt-6 grid gap-3">
              {CREDIT_PACK_OPTIONS.map((option) => (
                <div
                  key={option.priceId}
                  className={`rounded-xl border p-4 ${option.mostPopular ? "border-primary/40 bg-secondary/30" : "border-border bg-secondary/20"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.priceLabel} one-time</p>
                    </div>
                    {option.mostPopular && <Badge>Most Popular</Badge>}
                  </div>
                  <Button
                    variant={option.mostPopular ? "hero" : "hero-outline"}
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => void startCheckout(option.priceId)}
                  >
                    Buy {option.value} Credits
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="p-8 rounded-2xl bg-card border border-border flex flex-col"
          >
            <h3 className="text-xl font-semibold text-foreground">Pro</h3>
            <p className="mt-2 text-sm text-muted-foreground">Unlimited generations · Full access</p>

            <div className="mt-6 grid gap-3">
              {PRO_OPTIONS.map((option) => (
                <div key={option.priceId} className="rounded-xl border border-border bg-secondary/20 p-4">
                  <p className="font-semibold text-foreground">{option.label}</p>
                  <p className="text-sm text-muted-foreground">{option.detail}</p>
                  <Button
                    variant="hero-outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => void startCheckout(option.priceId)}
                  >
                    {option.label === "Pro Monthly" ? "Start Pro Monthly" : "Get Pro 30 Days"}
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="hero"
              size="lg"
              className="mt-6 w-full"
              onClick={() => {
                void startCheckout(PRO_OPTIONS[0].priceId).catch(() => {
                  toast.error("Unable to start checkout.");
                });
              }}
            >
              Upgrade to Pro
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
