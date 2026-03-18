import { stripe } from "../../lib/stripe/stripe";
import { handleStripeWebhookEvent } from "../../lib/stripe/handleWebhook";

export const config = {
  api: {
    bodyParser: false,
  },
};

type RequestLike = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
  on?: (event: string, callback: (chunk: Buffer) => void) => void;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (payload: unknown) => void;
  send?: (payload: string) => void;
  setHeader: (name: string, value: string | string[]) => void;
};

const getHeader = (headers: RequestLike["headers"], key: string) => {
  const value = headers?.[key] ?? headers?.[key.toLowerCase()];
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const readRawBody = async (req: RequestLike): Promise<Buffer> => {
  const rawBody = (req as { rawBody?: Buffer | string }).rawBody;

  if (Buffer.isBuffer(rawBody)) {
    return rawBody;
  }

  if (typeof rawBody === "string") {
    return Buffer.from(rawBody);
  }

  if (Buffer.isBuffer(req.body)) {
    return req.body;
  }

  if (typeof req.body === "string") {
    return Buffer.from(req.body);
  }

  if (req.body && typeof req.body === "object") {
    return Buffer.from(JSON.stringify(req.body));
  }

  if (typeof req.on !== "function") {
    return Buffer.from("");
  }

  return await new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on?.("data", (chunk: Buffer) => {
      chunks.push(Buffer.from(chunk));
    });

    req.on?.("end", () => {
      resolve(Buffer.concat(chunks));
    });

    req.on?.("error", (error) => {
      reject(error);
    });
  });
};

export default async function handler(req: RequestLike, res: ResponseLike) {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Stripe-Signature");

  if (req.method === "OPTIONS") {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(500).json({ error: "STRIPE_WEBHOOK_SECRET is missing" });
  }

  const signature = getHeader(req.headers, "stripe-signature");
  if (!signature) {
    return res.status(400).json({ error: "Missing Stripe signature" });
  }

  try {
    const rawBody = await readRawBody(req);
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    await handleStripeWebhookEvent(event);

    if (res.send) {
      res.status(200);
      return res.send("ok");
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook error";
    return res.status(400).json({ error: message });
  }
}
