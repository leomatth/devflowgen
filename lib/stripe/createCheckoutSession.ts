import { stripe } from "./stripe";
import { supabaseAdmin } from "../supabase/admin";
import { isSubscriptionPrice } from "./prices";

type CheckoutInput = {
  userId: string;
  priceId: string;
  userEmail?: string | null;
};

const getAppUrl = () => process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:8080";

export async function createCheckoutSession({ userId, priceId, userEmail }: CheckoutInput) {
  if (!priceId) {
    throw new Error("priceId is required");
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .maybeSingle();

  const existingCustomerId = profile?.stripe_customer_id || undefined;

  const mode = isSubscriptionPrice(priceId) ? "subscription" : "payment";

  const session = await stripe.checkout.sessions.create({
    mode,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: existingCustomerId,
    customer_email: existingCustomerId ? undefined : userEmail || undefined,
    metadata: {
      user_id: userId,
      price_id: priceId,
    },
    success_url: `${getAppUrl()}/dashboard?checkout=success`,
    cancel_url: `${getAppUrl()}/?checkout=canceled#pricing`,
    subscription_data: isSubscriptionPrice(priceId)
      ? {
          metadata: {
            user_id: userId,
            price_id: priceId,
          },
        }
      : undefined,
    allow_promotion_codes: true,
  });

  return session;
}
