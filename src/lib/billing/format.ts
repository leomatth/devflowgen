export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export const formatProStatus = (params: {
  isPro: boolean;
  hasActiveSubscription: boolean;
  planExpiresAt: string | null;
}) => {
  const { isPro, hasActiveSubscription, planExpiresAt } = params;

  if (!isPro) {
    return "Not active";
  }

  if (hasActiveSubscription) {
    return "Unlimited while subscribed";
  }

  if (planExpiresAt) {
    return `Active until ${formatDate(planExpiresAt)}`;
  }

  return "Active";
};
