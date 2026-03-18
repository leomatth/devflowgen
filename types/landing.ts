export type LandingGoal = "leads" | "sales" | "appointments";

export type LandingStyle = "modern" | "minimal" | "premium" | "bold";

export type LandingLanguage = string;

export type LandingGenerationInput = {
  business: string;
  audience: string;
  offer: string;
  goal: LandingGoal;
  style: LandingStyle;
  language: LandingLanguage;
};

export type LandingFaqItem = {
  question: string;
  answer: string;
};

export type LandingGenerationOutput = {
  headline: string;
  subheadline: string;
  cta: string;
  benefits: string[];
  features: string[];
  faq: LandingFaqItem[];
};
