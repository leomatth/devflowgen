import OpenAI from "openai";
import { buildLandingGenerationPrompt } from "./prompts";
import type { LandingGenerationInput, LandingGenerationOutput } from "../../types/landing";

const model = "gpt-4.1-mini";

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const cleanJson = (text: string): string => {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```") || !trimmed.endsWith("```")) {
    return trimmed;
  }

  return trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
};

const isValidOutput = (value: unknown): value is LandingGenerationOutput => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<LandingGenerationOutput>;

  return Boolean(
    typeof candidate.headline === "string" &&
      typeof candidate.subheadline === "string" &&
      typeof candidate.cta === "string" &&
      Array.isArray(candidate.benefits) &&
      candidate.benefits.every((item) => typeof item === "string") &&
      Array.isArray(candidate.features) &&
      candidate.features.every((item) => typeof item === "string") &&
      Array.isArray(candidate.faq) &&
      candidate.faq.every((item) => item && typeof item.question === "string" && typeof item.answer === "string"),
  );
};

export async function generateLandingPageWithAI(data: LandingGenerationInput): Promise<LandingGenerationOutput> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured on the server.");
  }

  const response = await openaiClient.responses.create({
    model,
    input: buildLandingGenerationPrompt(data),
    text: {
      format: {
        type: "json_schema",
        name: "landing_generation_output",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["headline", "subheadline", "cta", "benefits", "features", "faq"],
          properties: {
            headline: { type: "string" },
            subheadline: { type: "string" },
            cta: { type: "string" },
            benefits: {
              type: "array",
              items: { type: "string" },
              minItems: 3,
              maxItems: 3,
            },
            features: {
              type: "array",
              items: { type: "string" },
              minItems: 4,
              maxItems: 4,
            },
            faq: {
              type: "array",
              minItems: 3,
              maxItems: 3,
              items: {
                type: "object",
                additionalProperties: false,
                required: ["question", "answer"],
                properties: {
                  question: { type: "string" },
                  answer: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  });

  const text = response.output_text;
  if (!text) {
    throw new Error("OpenAI returned an empty response.");
  }

  const parsed = JSON.parse(cleanJson(text)) as unknown;
  if (!isValidOutput(parsed)) {
    throw new Error("OpenAI returned invalid JSON structure.");
  }

  return parsed;
}
