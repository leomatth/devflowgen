import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getUserPlanState, onPlanStateUpdated } from "@/lib/plans/userPlan";
import { getPlanStateForCurrentUser, onDashboardDataUpdated } from "@/lib/dashboard/data";

type UsageCardProps = {
  onUpgradeClick?: () => void;
};

const UsageCard = ({ onUpgradeClick }: UsageCardProps) => {
  const [planState, setPlanState] = useState(() => getUserPlanState());

  useEffect(() => {
    const syncPlanState = async () => {
      const remotePlanState = await getPlanStateForCurrentUser();
      setPlanState(remotePlanState ?? getUserPlanState());
    };

    void syncPlanState();

    const disposeLocal = onPlanStateUpdated(() => {
      void syncPlanState();
    });

    const disposeRemote = onDashboardDataUpdated(() => {
      void syncPlanState();
    });

    return () => {
      disposeLocal();
      disposeRemote();
    };
  }, []);

  const used = planState.generationsUsedToday;
  const total = planState.dailyLimit;
  const remaining = Math.max(total - used, 0);
  const progress = useMemo(() => {
    if (planState.plan === "pro") {
      return 0;
    }

    return total > 0 ? (used / total) * 100 : 0;
  }, [planState.plan, total, used]);

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Plan</p>
          <h3 className="mt-1 text-xl font-semibold text-foreground">{planState.plan === "pro" ? "Pro" : "Free"}</h3>
        </div>
        <div className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          {planState.plan === "pro" ? "Unlimited today" : `${remaining} left today`}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Generations used</span>
          <span className="font-mono text-foreground">{planState.plan === "pro" ? `${used}/∞` : `${used}/${total}`}</span>
        </div>
        <Progress value={progress} className="h-2 bg-secondary" />
      </div>

      {planState.plan === "free" && (
        <Button
          variant="hero-outline"
          className="mt-5 w-full"
          onClick={() => onUpgradeClick?.()}
        >
          Upgrade to Pro
        </Button>
      )}
    </section>
  );
};

export default UsageCard;
