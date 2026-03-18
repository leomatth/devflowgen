import type { LandingGenerationInput } from "../../types/landing";

const GOAL_HINTS: Record<LandingGenerationInput["goal"], string> = {
  leads: "maximize qualified lead capture",
  sales: "maximize direct conversions and purchases",
  appointments: "maximize high-intent appointment bookings",
};

const STYLE_HINTS: Record<LandingGenerationInput["style"], string> = {
  modern: "clean, contemporary, confidence-building",
  minimal: "simple, clear, low-friction, no fluff",
  premium: "elevated, polished, authority-driven",
  bold: "high-energy, punchy, attention-grabbing",
};

export const buildLandingGenerationPrompt = (input: LandingGenerationInput) => {
  const goalHint = GOAL_HINTS[input.goal];
  const styleHint = STYLE_HINTS[input.style];

  return [
    "You are an elite direct-response landing page copywriter.",
    "Return only valid JSON.",
    `Write all copy in this language: ${input.language}.`,
    `Primary conversion objective: ${goalHint}.`,
    `Brand tone/style direction: ${styleHint}.`,
    "Output rules:",
    "- headline: <= 12 words",
    "- subheadline: 1-2 short sentences",
    "- cta: short, action-oriented",
    "- benefits: exactly 3 concise items",
    "- features: exactly 4 concise items",
    "- faq: exactly 3 question/answer pairs",
    "Business context:",
    `- business: ${input.business}`,
    `- audience: ${input.audience}`,
    `- offer: ${input.offer}`,
    `- goal: ${input.goal}`,
    `- style: ${input.style}`,
  ].join("\n");
};
