import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import GeneratorWizard from "@/components/dashboard/GeneratorWizard";
import UsageCard from "@/components/dashboard/UsageCard";
import RecentProjects from "@/components/dashboard/RecentProjects";
import BillingSummaryCard from "@/components/dashboard/BillingSummaryCard";
import UpgradeModal from "@/components/generator/UpgradeModal";
import { toast } from "@/components/ui/sonner";
import { refreshDashboardData } from "@/lib/dashboard/data";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    const checkoutState = searchParams.get("checkout");
    if (!checkoutState) {
      return;
    }

    if (checkoutState === "success") {
      toast.success("Checkout completed. Your plan is being updated.");
      refreshDashboardData();
    }

    navigate("/dashboard", { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.16),transparent_36%),radial-gradient(circle_at_80%_20%,hsl(var(--accent)/0.12),transparent_24%)]" />
      <DashboardTopbar />

      <main className="relative mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <GeneratorWizard />
          <div className="grid gap-6">
            <UsageCard onUpgradeClick={() => setUpgradeOpen(true)} />
            <BillingSummaryCard />
          </div>
        </div>

        <div className="mt-6">
          <RecentProjects />
        </div>

        <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
      </main>
    </div>
  );
};

export default Dashboard;
