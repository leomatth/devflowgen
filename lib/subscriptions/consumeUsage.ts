import { supabaseAdmin } from "../supabase/admin";

type ConsumeUsageResult = {
  allowed: boolean;
  reason: "pro" | "credits" | "free" | "blocked";
  creditsRemaining?: number;
};

const nowIso = () => new Date().toISOString();

const isActivePro = (plan: string | null | undefined, planExpiresAt: string | null | undefined) => {
  if (plan !== "pro") {
    return false;
  }

  if (!planExpiresAt) {
    return true;
  }

  return new Date(planExpiresAt).getTime() > Date.now();
};

export async function consumeUsage(userId: string): Promise<ConsumeUsageResult> {
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id, plan, plan_expires_at, credits_balance")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("Unable to load user profile for usage consumption");
  }

  if (isActivePro(profile.plan, profile.plan_expires_at)) {
    return { allowed: true, reason: "pro" };
  }

  const creditsBalance = profile.credits_balance ?? 0;

  if (creditsBalance >= 10) {
    const newBalance = creditsBalance - 10;

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        credits_balance: newBalance,
        updated_at: nowIso(),
      })
      .eq("id", userId)
      .gte("credits_balance", 10);

    if (updateError) {
      throw new Error("Unable to consume credits");
    }

    return {
      allowed: true,
      reason: "credits",
      creditsRemaining: newBalance,
    };
  }

  const { data, error } = await supabaseAdmin.rpc("register_daily_generation", {
    p_user_id: userId,
  });

  if (error) {
    throw new Error("Unable to register daily free usage");
  }

  const row = (Array.isArray(data) ? data[0] : data) as
    | { exceeded_limit?: boolean }
    | undefined;

  if (row?.exceeded_limit) {
    return {
      allowed: false,
      reason: "blocked",
    };
  }

  return {
    allowed: true,
    reason: "free",
  };
}
