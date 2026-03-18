import type { GeneratorFormData, LandingPageResult, UserPlanState } from "@/types/generator";
import { supabase } from "@/lib/supabase/client";
import { getUserPlan } from "@/lib/subscriptions/getUserPlan";

const DASHBOARD_DATA_EVENT = "devflow:dashboard-data-updated";
const DEFAULT_FREE_LIMIT = 1;
const PRO_STATUSES = new Set(["active", "trialing"]);

export type RecentProjectItem = {
  id: string;
  name: string;
  createdAt: string;
};

export type ProjectDetail = {
  id: string;
  name: string;
  createdAt: string;
  output: LandingPageResult;
};

export type BillingSummary = {
  plan: "free" | "pro";
  creditsBalance: number;
  isProActive: boolean;
  hasActiveSubscription: boolean;
  planExpiresAt: string | null;
  proExpiredAt: string | null;
  dailyFreeLimit: number;
  dailyFreeUsed: number;
  dailyFreeRemaining: number;
  dailyFreeAvailable: boolean;
};

const getTodayDate = (): string => new Date().toISOString().slice(0, 10);

const emitDashboardDataUpdated = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(DASHBOARD_DATA_EVENT));
  }
};

export const refreshDashboardData = () => {
  emitDashboardDataUpdated();
};

export const onDashboardDataUpdated = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => callback();
  window.addEventListener(DASHBOARD_DATA_EVENT, handler);

  return () => {
    window.removeEventListener(DASHBOARD_DATA_EVENT, handler);
  };
};

export const getCurrentUserId = async (): Promise<string | null> => {
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
};

const ensureProfile = async (userId: string) => {
  if (!supabase) {
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (profile) {
    return;
  }

  await supabase.from("profiles").insert({ id: userId });
};

export const getPlanStateForCurrentUser = async (): Promise<UserPlanState | null> => {
  if (!supabase) {
    return null;
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }

  await ensureProfile(userId);

  const [{ data: profile }, { data: usage }, resolvedPlan] = await Promise.all([
    supabase.from("profiles").select("daily_free_limit").eq("id", userId).maybeSingle(),
    supabase
      .from("usage_daily")
      .select("generation_count")
      .eq("user_id", userId)
      .eq("usage_date", getTodayDate())
      .maybeSingle(),
    getUserPlan(userId),
  ]);

  const plan = resolvedPlan;
  const dailyLimit = plan === "pro" ? Number.MAX_SAFE_INTEGER : (profile?.daily_free_limit ?? DEFAULT_FREE_LIMIT);

  return {
    plan,
    dailyLimit,
    generationsUsedToday: usage?.generation_count ?? 0,
  };
};

export const getBillingSummaryForCurrentUser = async (): Promise<BillingSummary | null> => {
  if (!supabase) {
    return null;
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }

  await ensureProfile(userId);

  const [{ data: profile }, { data: usage }, { data: subscription }, resolvedPlan] = await Promise.all([
    supabase
      .from("profiles")
      .select("plan, plan_expires_at, credits_balance, daily_free_limit")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("usage_daily")
      .select("generation_count")
      .eq("user_id", userId)
      .eq("usage_date", getTodayDate())
      .maybeSingle(),
    supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    getUserPlan(userId),
  ]);

  const dailyFreeLimit = profile?.daily_free_limit ?? DEFAULT_FREE_LIMIT;
  const dailyFreeUsed = usage?.generation_count ?? 0;
  const dailyFreeRemaining = Math.max(dailyFreeLimit - dailyFreeUsed, 0);

  const hasActiveSubscription = Boolean(subscription?.status && PRO_STATUSES.has(subscription.status));
  const planExpiresAt = profile?.plan_expires_at ?? null;
  const isProActive = resolvedPlan === "pro";
  const proExpiredAt =
    !isProActive && planExpiresAt && new Date(planExpiresAt).getTime() <= Date.now()
      ? planExpiresAt
      : null;

  return {
    plan: resolvedPlan,
    creditsBalance: profile?.credits_balance ?? 0,
    isProActive,
    hasActiveSubscription,
    planExpiresAt,
    proExpiredAt,
    dailyFreeLimit,
    dailyFreeUsed,
    dailyFreeRemaining,
    dailyFreeAvailable: dailyFreeRemaining > 0,
  };
};

export const saveGeneratedProject = async (
  input: GeneratorFormData,
  output: LandingPageResult,
): Promise<void> => {
  if (!supabase) {
    return;
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return;
  }

  const { error } = await supabase.from("projects").insert({
    user_id: userId,
    name: output.headline,
    status: "generated",
    business: input.business,
    audience: input.audience,
    offer: input.offer,
    goal: input.goal,
    style: input.style,
    language: "en",
    input_payload: input,
    output_payload: output,
    headline: output.headline,
    subheadline: output.subheadline,
    cta: output.cta,
  });

  if (error) {
    throw error;
  }

  emitDashboardDataUpdated();
};

export const getRecentProjectsForCurrentUser = async (limit = 3): Promise<RecentProjectItem[]> => {
  if (!supabase) {
    return [];
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, headline, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name || row.headline || "Untitled Project",
    createdAt: row.created_at,
  }));
};

export const getProjectDetailForCurrentUser = async (projectId: string): Promise<ProjectDetail | null> => {
  if (!supabase) {
    return null;
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, headline, created_at, output_payload")
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data || !data.output_payload) {
    return null;
  }

  const output = data.output_payload as LandingPageResult;

  return {
    id: data.id,
    name: data.name || data.headline || "Untitled Project",
    createdAt: data.created_at,
    output,
  };
};
