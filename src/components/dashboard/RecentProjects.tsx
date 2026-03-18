import { useEffect, useState } from "react";
import { CalendarDays, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getProjectDetailForCurrentUser,
  getRecentProjectsForCurrentUser,
  onDashboardDataUpdated,
  type ProjectDetail,
  type RecentProjectItem,
} from "@/lib/dashboard/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const RecentProjects = () => {
  const [projects, setProjects] = useState<RecentProjectItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      const rows = await getRecentProjectsForCurrentUser(3);
      setProjects(rows);
    };

    void loadProjects();

    return onDashboardDataUpdated(() => {
      void loadProjects();
    });
  }, []);

  return (
    <section id="projects" className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Recent Projects</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Your latest generated pages</h2>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-secondary/20 p-6 text-sm text-muted-foreground">
          No saved projects yet. Generate your first landing page to see it here.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} className="beam-hover rounded-2xl border border-border bg-secondary/35 p-5 transition-colors hover:border-primary/30">
              <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(project.createdAt)}</span>
              </div>
              <Button
                variant="hero-outline"
                size="sm"
                className="mt-5 w-full justify-between"
                onClick={async () => {
                  const detail = await getProjectDetailForCurrentUser(project.id);
                  if (!detail) {
                    return;
                  }

                  setSelectedProject(detail);
                  setPreviewOpen(true);
                }}
              >
                View
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </article>
          ))}
        </div>
      )}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl rounded-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle>{selectedProject?.name ?? "Project preview"}</DialogTitle>
            <DialogDescription>
              Generated on {selectedProject ? formatDate(selectedProject.createdAt) : "-"}
            </DialogDescription>
          </DialogHeader>

          {selectedProject?.output && (
            <div className="max-h-[65vh] overflow-y-auto rounded-xl border border-border bg-secondary/20 p-4">
              <h3 className="text-xl font-semibold text-foreground">{selectedProject.output.headline}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{selectedProject.output.subheadline}</p>

              <div className="mt-4 inline-flex rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-foreground">
                {selectedProject.output.cta}
              </div>

              <div className="mt-6 grid gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Benefits</p>
                  <ul className="mt-2 grid gap-2 text-sm text-muted-foreground">
                    {selectedProject.output.benefits.map((item) => (
                      <li key={item} className="rounded-lg border border-border bg-card px-3 py-2">{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">Features</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {selectedProject.output.features.map((item) => (
                      <span key={item} className="rounded-full border border-border bg-card px-3 py-1.5">{item}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">FAQ</p>
                  <div className="mt-2 grid gap-2">
                    {selectedProject.output.faq.map((item) => (
                      <div key={item.question} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
                        <p className="font-medium text-foreground">{item.question}</p>
                        <p className="mt-1 text-muted-foreground">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default RecentProjects;
