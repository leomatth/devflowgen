import { CalendarDays, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  { name: "FitLaunch Pro", date: "Mar 16, 2026" },
  { name: "Nimbus CRM", date: "Mar 14, 2026" },
  { name: "Solaris Studio", date: "Mar 11, 2026" },
];

const RecentProjects = () => {
  return (
    <section id="projects" className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Recent Projects</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Your latest generated pages</h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {projects.map((project) => (
          <article key={project.name} className="beam-hover rounded-2xl border border-border bg-secondary/35 p-5 transition-colors hover:border-primary/30">
            <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>{project.date}</span>
            </div>
            <Button variant="hero-outline" size="sm" className="mt-5 w-full justify-between">
              View
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RecentProjects;
