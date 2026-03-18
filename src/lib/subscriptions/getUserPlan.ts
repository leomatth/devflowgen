import { supabase } from "@/lib/supabase/client";

const PRO_STATUSES = new Set(["active", "trialing"]);

export type ResolvedPlan = "free" | "pro";

export const isProSubscriptionStatus = (status: string | null | undefined) =>
  Boolean(status && PRO_STATUSES.has(status));

export const getUserPlan = async (userId: string): Promise<ResolvedPlan> => {
  if (!supabase) {
    return "free";
  }

  const [{ data: subscription }, { data: profile }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("plan, plan_expires_at")
      .eq("id", userId)
      .maybeSingle(),
  ]);

  const hasActiveSubscription = isProSubscriptionStatus(subscription?.status);
  const hasValidProWindow =
    profile?.plan === "pro" &&
    Boolean(profile.plan_expires_at && new Date(profile.plan_expires_at).getTime() > Date.now());

  return hasActiveSubscription || hasValidProWindow ? "pro" : "free";
};
