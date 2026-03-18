import type { UserPlanState } from "@/types/generator";

const PLAN_STORAGE_KEY = "devflow:user-plan-state";
const PLAN_STATE_UPDATED_EVENT = "devflow:plan-state-updated";
const FREE_DAILY_LIMIT = 1;
const PRO_DAILY_LIMIT = Number.MAX_SAFE_INTEGER;

type StoredPlanState = {
  plan: UserPlanState["plan"];
  generationsUsedToday: number;
  dailyLimit: number;
  usageDate: string;
};

const getTodayKey = (): string => new Date().toISOString().slice(0, 10);

const getDefaultState = (): StoredPlanState => ({
  plan: "free",
  generationsUsedToday: 0,
  dailyLimit: FREE_DAILY_LIMIT,
  usageDate: getTodayKey(),
});

const normalizeState = (state: StoredPlanState): StoredPlanState => {
  const isNewDay = state.usageDate !== getTodayKey();
  const limit = state.plan === "pro" ? PRO_DAILY_LIMIT : FREE_DAILY_LIMIT;

  return {
    plan: state.plan,
    dailyLimit: limit,
    generationsUsedToday: isNewDay ? 0 : state.generationsUsedToday,
    usageDate: getTodayKey(),
  };
};

const readStoredState = (): StoredPlanState => {
  const fallback = getDefaultState();

  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(PLAN_STORAGE_KEY);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredPlanState>;
    const merged: StoredPlanState = {
      ...fallback,
      ...parsed,
    };

    return normalizeState(merged);
  } catch {
    return fallback;
  }
};

const persistState = (state: StoredPlanState) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(PLAN_STATE_UPDATED_EVENT));
};

const toUserPlanState = (state: StoredPlanState): UserPlanState => ({
  plan: state.plan,
  generationsUsedToday: state.generationsUsedToday,
  dailyLimit: state.dailyLimit,
});

export const getUserPlanState = (): UserPlanState => {
  const state = readStoredState();
  persistState(state);
  return toUserPlanState(state);
};

export const canGenerateLandingPage = (state: UserPlanState): boolean => {
  if (state.plan === "pro") {
    return true;
  }

  return state.generationsUsedToday < state.dailyLimit;
};

export const registerGeneration = (): UserPlanState => {
  const state = readStoredState();

  if (state.plan === "free") {
    state.generationsUsedToday += 1;
  }

  persistState(state);
  return toUserPlanState(state);
};

export const onPlanStateUpdated = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => callback();
  window.addEventListener(PLAN_STATE_UPDATED_EVENT, handler);

  return () => {
    window.removeEventListener(PLAN_STATE_UPDATED_EVENT, handler);
  };
};
