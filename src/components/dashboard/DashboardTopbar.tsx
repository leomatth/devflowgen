import { useEffect, useMemo, useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/NavLink";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase/client";
import { getBillingSummaryForCurrentUser, onDashboardDataUpdated } from "@/lib/dashboard/data";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "My Projects", to: "/dashboard#projects" },
  { label: "Pricing", to: "/#pricing" },
];

const DashboardTopbar = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [creditsBalance, setCreditsBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email ?? null);

      const summary = await getBillingSummaryForCurrentUser();
      setCreditsBalance(summary?.creditsBalance ?? null);
    };

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    const disposeDashboardListener = onDashboardDataUpdated(async () => {
      const summary = await getBillingSummaryForCurrentUser();
      setCreditsBalance(summary?.creditsBalance ?? null);
    });

    return () => {
      disposeDashboardListener();
      subscription.unsubscribe();
    };
  }, []);

  const initials = useMemo(() => {
    if (!email) {
      return "DA";
    }

    return email.slice(0, 2).toUpperCase();
  }, [email]);

  const handleLogout = async () => {
    if (!supabase) {
      toast.error("Supabase is not configured.");
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout.");
      return;
    }

    toast.success("Logged out successfully.");
    navigate("/auth", { replace: true });
  };

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
          {typeof creditsBalance === "number" && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Credits: {creditsBalance}
            </Badge>
          )}
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-secondary text-sm font-medium text-foreground">{initials}</AvatarFallback>
          </Avatar>
          <Button variant="hero-outline" size="sm" className="gap-2" onClick={() => void handleLogout()}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;
