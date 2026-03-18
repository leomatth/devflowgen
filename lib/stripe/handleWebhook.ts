import type Stripe from "stripe";
import { supabaseAdmin } from "../supabase/admin";
import { CREDIT_PACKS, isPro30DaysPrice, STRIPE_PRICE_IDS } from "./prices";

const PRO_STATUSES = new Set(["active", "trialing"]);

const toIsoDate = (value?: number | null) => (value ? new Date(value * 1000).toISOString() : null);

const getSubscriptionPeriod = (subscription: Stripe.Subscription) => {
  const fallback = subscription.items.data[0];
  const source = subscription as Stripe.Subscription & {
    current_period_start?: number;
    current_period_end?: number;
  };

  return {
    currentPeriodStart: source.current_period_start ?? fallback?.current_period_start ?? null,
    currentPeriodEnd: source.current_period_end ?? fallback?.current_period_end ?? null,
  };
};

const syncProfilePlan = async (userId: string) => {
  const [{ data: subscription }, { data: profile }] = await Promise.all([
    supabaseAdmin
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabaseAdmin
      .from("profiles")
      .select("plan, plan_expires_at")
      .eq("id", userId)
      .maybeSingle(),
  ]);

  const hasActiveSubscription = Boolean(subscription?.status && PRO_STATUSES.has(subscription.status));
  const hasValidProWindow =
    profile?.plan === "pro" &&
    Boolean(profile.plan_expires_at && new Date(profile.plan_expires_at).getTime() > Date.now());

  const plan = hasActiveSubscription || hasValidProWindow ? "pro" : "free";

  await supabaseAdmin
    .from("profiles")
    .update({ plan, updated_at: new Date().toISOString() })
    .eq("id", userId);
};

const upsertSubscriptionByUser = async (params: {
  userId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId: string;
  stripePriceId?: string | null;
  status: string;
  currentPeriodStart?: number | null;
  currentPeriodEnd?: number | null;
  cancelAtPeriodEnd?: boolean;
}) => {
  const {
    userId,
    stripeCustomerId,
    stripeSubscriptionId,
    stripePriceId,
    status,
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd,
  } = params;

  await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      provider: "stripe",
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      stripe_price_id: stripePriceId,
      status,
      current_period_start: toIsoDate(currentPeriodStart),
      current_period_end: toIsoDate(currentPeriodEnd),
      cancel_at_period_end: Boolean(cancelAtPeriodEnd),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );

  await syncProfilePlan(userId);
};

const findUserIdByCustomerId = async (customerId?: string | null): Promise<string | null> => {
  if (!customerId) {
    return null;
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (profile?.id) {
    return profile.id;
  }

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return subscription?.user_id || null;
};

const addCreditsToProfile = async (userId: string, amount: number) => {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("credits_balance")
    .eq("id", userId)
    .maybeSingle();

  const currentCredits = profile?.credits_balance ?? 0;

  await supabaseAdmin
    .from("profiles")
    .update({
      credits_balance: currentCredits + amount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
};

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const priceId = session.metadata?.price_id;
      const customerId = typeof session.customer === "string" ? session.customer : null;

      if (!userId || !priceId) {
        return;
      }

      if (customerId) {
        await supabaseAdmin
          .from("profiles")
          .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
          .eq("id", userId)
          .or("stripe_customer_id.is.null,stripe_customer_id.eq.''");
      }

      if (priceId === STRIPE_PRICE_IDS.proSubscription) {
        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "pro",
            plan_expires_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;
        if (subscriptionId) {
          await supabaseAdmin.from("subscriptions").upsert(
            {
              user_id: userId,
              provider: "stripe",
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              stripe_price_id: priceId,
              status: "active",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "stripe_subscription_id" },
          );
        }
      } else if (isPro30DaysPrice(priceId)) {
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "pro",
            plan_expires_at: expiresAt,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
      } else if (CREDIT_PACKS[priceId]) {
        await addCreditsToProfile(userId, CREDIT_PACKS[priceId]);
      }

      await syncProfilePlan(userId);
      return;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === "string" ? subscription.customer : null;
      const userIdFromMetadata = subscription.metadata?.user_id || null;
      const userId = userIdFromMetadata || (await findUserIdByCustomerId(customerId));

      if (!userId) {
        return;
      }

      if (customerId) {
        await supabaseAdmin
          .from("profiles")
          .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
          .eq("id", userId);
      }

      const period = getSubscriptionPeriod(subscription);

      await upsertSubscriptionByUser({
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0]?.price?.id || null,
        status: subscription.status,
        currentPeriodStart: period.currentPeriodStart,
        currentPeriodEnd: period.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      });
      return;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === "string" ? subscription.customer : null;
      const userIdFromMetadata = subscription.metadata?.user_id || null;
      const userId = userIdFromMetadata || (await findUserIdByCustomerId(customerId));

      if (!userId) {
        return;
      }

      const period = getSubscriptionPeriod(subscription);

      await upsertSubscriptionByUser({
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0]?.price?.id || null,
        status: "canceled",
        currentPeriodStart: period.currentPeriodStart,
        currentPeriodEnd: period.currentPeriodEnd,
        cancelAtPeriodEnd: true,
      });
      return;
    }

    default:
      return;
  }
}
