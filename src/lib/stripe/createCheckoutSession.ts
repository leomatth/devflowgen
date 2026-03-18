import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { STRIPE_PRICE_IDS } from "@/lib/stripe/prices";

export async function createStripeCheckoutSession(priceId: string = STRIPE_PRICE_IDS.proSubscription): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  let {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    const refreshed = await supabase.auth.refreshSession();
    session = refreshed.data.session ?? null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const accessToken = session?.access_token;
  if (!accessToken || !user?.id) {
    throw new Error("You need to be logged in to upgrade.");
  }

  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      priceId,
      userId: user.id,
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (response.status === 404) {
      throw new Error("Checkout API not found. Run the app with `vercel dev` so /api routes are available.");
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error("Invalid session. Please sign in again.");
    }

    throw new Error(payload.error || "Unable to start checkout.");
  }

  const data = (await response.json()) as { url?: string };
  if (!data.url) {
    throw new Error("Missing checkout URL.");
  }

  return data.url;
}
