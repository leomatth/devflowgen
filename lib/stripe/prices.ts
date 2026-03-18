export const STRIPE_PRICE_IDS = {
  proSubscription: "price_1TC4DGIDdZAJMUcUeTOwiqaz",
  pro30Days: "price_1TC4EIIDdZAJMUcUr3JzuK7o",
  credits50: "price_1TC4GoIDdZAJMUcUefzlkBuh",
  credits120: "price_1TC4IYIDdZAJMUcUHaXmPt2y",
  credits300: "price_1TC4KOIDdZAJMUcUlTlFYYTK",
} as const;

export const CREDIT_PACKS: Record<string, number> = {
  [STRIPE_PRICE_IDS.credits50]: 50,
  [STRIPE_PRICE_IDS.credits120]: 120,
  [STRIPE_PRICE_IDS.credits300]: 300,
};

export const isSubscriptionPrice = (priceId: string) =>
  priceId === STRIPE_PRICE_IDS.proSubscription;

export const isPro30DaysPrice = (priceId: string) =>
  priceId === STRIPE_PRICE_IDS.pro30Days;
