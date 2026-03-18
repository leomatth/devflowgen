import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  getBillingSummaryForCurrentUser,
  onDashboardDataUpdated,
  type BillingSummary,
} from "@/lib/dashboard/data";
import { formatDate, formatProStatus } from "@/lib/billing/format";

const BillingSummaryCard = () => {
  const [summary, setSummary] = useState<BillingSummary | null>(null);

  useEffect(() => {
    const loadSummary = async () => {
      const data = await getBillingSummaryForCurrentUser();
      setSummary(data);
    };

    void loadSummary();

    return onDashboardDataUpdated(() => {
      void loadSummary();
    });
  }, []);

  if (!summary) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <p className="text-sm text-muted-foreground">Loading billing summary...</p>
      </section>
    );
  }

  const proStatusLabel = formatProStatus({
    isPro: summary.isProActive,
    hasActiveSubscription: summary.hasActiveSubscription,
    planExpiresAt: summary.planExpiresAt,
  });

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">Billing Summary</h3>
        <Badge variant={summary.isProActive ? "default" : "secondary"}>
          {summary.isProActive ? "Pro" : "Free"}
        </Badge>
      </div>

      <div className="mt-5 grid gap-3 text-sm">
        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-3 py-2">
          <span className="text-muted-foreground">Current plan</span>
          <span className="font-medium text-foreground">{summary.isProActive ? "Pro" : "Free"}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-3 py-2">
          <span className="text-muted-foreground">Credits</span>
          <span className="font-medium text-foreground">{summary.creditsBalance}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-3 py-2">
          <span className="text-muted-foreground">Pro status</span>
          <span className="font-medium text-foreground">{proStatusLabel}</span>
        </div>

        {!summary.isProActive && summary.proExpiredAt && (
          <div className="rounded-lg border border-border bg-secondary/20 px-3 py-2 text-muted-foreground">
            Pro 30-day access expired on {formatDate(summary.proExpiredAt)}.
          </div>
        )}

        {!summary.isProActive && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-3 py-2">
            <span className="text-muted-foreground">Daily free generation</span>
            <span className="font-medium text-foreground">
              {summary.dailyFreeAvailable
                ? `Available (${summary.dailyFreeRemaining} left today)`
                : "Used for today"}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default BillingSummaryCard;
