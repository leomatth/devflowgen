import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generatorText } from "@/lib/generator/content";
import { createStripeCheckoutSession } from "@/lib/stripe/createCheckoutSession";
import { STRIPE_PRICE_IDS } from "@/lib/stripe/prices";
import { Badge } from "@/components/ui/badge";

type UpgradeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const UpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (priceId: string) => {
    setLoading(true);

    try {
      const checkoutUrl = await createStripeCheckoutSession(priceId);
      window.location.assign(checkoutUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start checkout.";
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-border bg-card">
        <DialogHeader>
          <DialogTitle>{generatorText.modalTitle}</DialogTitle>
          <DialogDescription>{generatorText.modalDescription}</DialogDescription>
        </DialogHeader>

        <ul className="grid gap-2 text-sm text-muted-foreground">
          {generatorText.upgradeFeatures.map((feature) => (
            <li key={feature} className="flex items-center gap-2 rounded-lg border border-border bg-secondary/35 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="grid gap-2 rounded-xl border border-border bg-secondary/20 p-3 text-sm">
          <Button variant="hero" onClick={() => void handleUpgrade(STRIPE_PRICE_IDS.proSubscription)} disabled={loading}>
            Pro Monthly - €20/month
          </Button>
          <Button variant="hero-outline" onClick={() => void handleUpgrade(STRIPE_PRICE_IDS.pro30Days)} disabled={loading}>
            Pro 30 Days - €25 one-time
          </Button>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" onClick={() => void handleUpgrade(STRIPE_PRICE_IDS.credits50)} disabled={loading}>
              50 Credits
            </Button>
            <div className="relative">
              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px]">Popular</Badge>
              <Button variant="outline" onClick={() => void handleUpgrade(STRIPE_PRICE_IDS.credits120)} disabled={loading} className="w-full">
                120 Credits
              </Button>
            </div>
            <Button variant="outline" onClick={() => void handleUpgrade(STRIPE_PRICE_IDS.credits300)} disabled={loading}>
              300 Credits
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="hero-outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Maybe later
          </Button>
          <Button variant="hero" onClick={() => void handleUpgrade(STRIPE_PRICE_IDS.proSubscription)} disabled={loading}>
            {loading ? "Redirecting..." : "Upgrade to Pro Monthly"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
