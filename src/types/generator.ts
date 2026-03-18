export type GeneratorGoal = "leads" | "sales" | "appointments";

export type GeneratorStyle = "modern" | "minimal" | "premium" | "bold";

export type GeneratorFormData = {
  business: string;
  audience: string;
  offer: string;
  goal: GeneratorGoal;
  style: GeneratorStyle;
};

export type LandingPageResult = {
  headline: string;
  subheadline: string;
  cta: string;
  benefits: string[];
  features: string[];
  faq: { question: string; answer: string }[];
};

export type UserPlanState = {
  plan: "free" | "pro";
  generationsUsedToday: number;
  dailyLimit: number;
};
