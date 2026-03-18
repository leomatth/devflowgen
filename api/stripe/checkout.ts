import { createCheckoutSession } from "../../lib/stripe/createCheckoutSession";
import { supabaseAdmin } from "../../lib/supabase/admin";
import { z } from "zod";

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

const getHeader = (headers: RequestLike["headers"], key: string) => {
  const value = headers?.[key] ?? headers?.[key.toLowerCase()];
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const bodySchema = z.object({
  priceId: z.string().min(1),
  userId: z.string().uuid(),
});

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

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  if (parsed.data.userId !== user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const session = await createCheckoutSession({
      userId: user.id,
      priceId: parsed.data.priceId,
      userEmail: user.email,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    return res.status(500).json({ error: message });
  }
}
