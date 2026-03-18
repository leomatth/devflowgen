import { supabaseAdmin } from "../lib/supabase/admin";
import { consumeUsage } from "../lib/subscriptions/consumeUsage";
import {
  generateLandingFromPayload,
  landingGenerationSchema,
} from "../lib/ai/generation";

type RequestLike = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (payload: unknown) => void;
  setHeader: (name: string, value: string | string[]) => void;
};

const getHeader = (headers: Record<string, string | string[] | undefined> | undefined, key: string) => {
  const value = headers?.[key] ?? headers?.[key.toLowerCase()];
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export default async function handler(req: RequestLike, res: ResponseLike) {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = getHeader(req.headers, "authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: "Invalid session" });
  }

  const parsed = landingGenerationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  try {
    const usage = await consumeUsage(user.id);
    if (!usage.allowed) {
      return res.status(402).json({ error: "Usage limit reached. Upgrade or buy credits to continue." });
    }

    const result = await generateLandingFromPayload(parsed.data);
    return res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed";
    return res.status(500).json({ error: message });
  }
}
