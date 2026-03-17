import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import GeneratorWizard from "@/components/dashboard/GeneratorWizard";
import UsageCard from "@/components/dashboard/UsageCard";
import RecentProjects from "@/components/dashboard/RecentProjects";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.16),transparent_36%),radial-gradient(circle_at_80%_20%,hsl(var(--accent)/0.12),transparent_24%)]" />
      <DashboardTopbar />

      <main className="relative mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <GeneratorWizard />
          <UsageCard />
        </div>

        <div className="mt-6">
          <RecentProjects />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
