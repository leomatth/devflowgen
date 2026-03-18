import type { GeneratorFormData, LandingPageResult } from "@/types/generator";
import { supabase } from "@/lib/supabase/client";

const isLandingPageResult = (value: unknown): value is LandingPageResult => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<LandingPageResult>;

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

export async function generateLandingPage(data: GeneratorFormData): Promise<LandingPageResult> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token;
  if (!accessToken) {
    throw new Error("You need to be logged in to generate.");
  }

  const response = await fetch("/api/generate-landing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      ...data,
      language: typeof navigator !== "undefined" ? navigator.language || "en" : "en",
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error || "API request failed");
  }

  const json = (await response.json()) as unknown;

  if (!isLandingPageResult(json)) {
    throw new Error("Invalid API response format");
  }

  return json;
}
