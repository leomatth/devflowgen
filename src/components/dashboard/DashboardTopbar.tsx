import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "My Projects", to: "/dashboard#projects" },
  { label: "Pricing", to: "/#pricing" },
];

const DashboardTopbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="text-lg font-bold tracking-tight text-foreground">
            DevFlow <span className="text-gradient-primary">AI</span>
          </NavLink>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === "/dashboard"}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeClassName="bg-secondary text-foreground"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-secondary text-sm font-medium text-foreground">DA</AvatarFallback>
          </Avatar>
          <Button variant="hero-outline" size="sm" className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;
