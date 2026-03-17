import { Progress } from "@/components/ui/progress";

const UsageCard = () => {
  const used = 4;
  const total = 5;
  const progress = (used / total) * 100;

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Plan</p>
          <h3 className="mt-1 text-xl font-semibold text-foreground">Free</h3>
        </div>
        <div className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          1 left today
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Generations used</span>
          <span className="font-mono text-foreground">{used}/{total}</span>
        </div>
        <Progress value={progress} className="h-2 bg-secondary" />
      </div>
    </section>
  );
};

export default UsageCard;
