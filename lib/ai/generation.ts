import { z } from "zod";
import { generateLandingPageWithAI } from "./openai";
import type { LandingGenerationInput, LandingGenerationOutput } from "../../types/landing";

export const landingGenerationSchema = z.object({
  business: z.string().min(2),
  audience: z.string().min(2),
  offer: z.string().min(2),
  goal: z.enum(["leads", "sales", "appointments"]),
  style: z.enum(["modern", "minimal", "premium", "bold"]),
  language: z.string().min(2),
});

export type LandingGenerationPayload = z.infer<typeof landingGenerationSchema>;

export const generateLandingFromPayload = async (
  payload: LandingGenerationPayload,
): Promise<LandingGenerationOutput> => {
  return generateLandingPageWithAI(payload as LandingGenerationInput);
};
