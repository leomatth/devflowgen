import { STRIPE_PRICE_IDS } from "@/lib/stripe/prices";

export const GENERATION_CREDIT_COST = 10;

export const CREDIT_PACK_OPTIONS = [
  { label: "50 Credits", value: 50, priceLabel: "€10", priceId: STRIPE_PRICE_IDS.credits50, mostPopular: false },
  { label: "120 Credits", value: 120, priceLabel: "€20", priceId: STRIPE_PRICE_IDS.credits120, mostPopular: true },
  { label: "300 Credits", value: 300, priceLabel: "€45", priceId: STRIPE_PRICE_IDS.credits300, mostPopular: false },
] as const;

export const PRO_OPTIONS = [
  {
    label: "Pro Monthly",
    detail: "€20/month recurring",
    priceId: STRIPE_PRICE_IDS.proSubscription,
  },
  {
    label: "Pro 30 Days",
    detail: "€25 one-time",
    priceId: STRIPE_PRICE_IDS.pro30Days,
  },
] as const;
