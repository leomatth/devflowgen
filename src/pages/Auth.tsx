import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "signin" ? "signin" : "signup";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as LocationState | null)?.from?.pathname || "/dashboard";
  const fullName = useMemo(() => `${firstName} ${lastName}`.trim(), [firstName, lastName]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate(from, { replace: true });
      }
    };

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate(from, { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [from, navigate]);

  const upsertProfile = async (params: { userId: string; emailValue: string; fullNameValue?: string }) => {
    if (!supabase) {
      return;
    }

    const payload = {
      id: params.userId,
      email: params.emailValue,
      full_name: params.fullNameValue || null,
      updated_at: new Date().toISOString(),
    };

    await supabase.from("profiles").upsert(payload, { onConflict: "id" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSupabaseConfigured || !supabase) {
      toast.error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      return;
    }

    if (!email.trim()) {
      toast.error("Enter your email address.");
      return;
    }

    if (!password || password.length < 6) {
      toast.error("Password must have at least 6 characters.");
      return;
    }

    if (mode === "signup" && !firstName.trim()) {
      toast.error("Enter your first name.");
      return;
    }

    setSubmitting(true);

    if (mode === "signin") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message);
        setSubmitting(false);
        return;
      }

      if (data.user?.id) {
        await upsertProfile({
          userId: data.user.id,
          emailValue: data.user.email || email.trim(),
        });
      }

      toast.success("Signed in successfully.");
      setSubmitting(false);
      navigate(from, { replace: true });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: fullName,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    if (data.user?.id) {
      await upsertProfile({
        userId: data.user.id,
        emailValue: data.user.email || email.trim(),
        fullNameValue: fullName,
      });
    }

    if (data.session) {
      toast.success("Account created successfully.");
      setSubmitting(false);
      navigate(from, { replace: true });
      return;
    }

    toast.success("Account created. Check your email to verify and continue.");
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-card">
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-secondary/20 p-1">
          <Button
            type="button"
            variant={mode === "signup" ? "hero" : "ghost"}
            onClick={() => setSearchParams({ mode: "signup" })}
          >
            Create account
          </Button>
          <Button
            type="button"
            variant={mode === "signin" ? "hero" : "ghost"}
            onClick={() => setSearchParams({ mode: "signin" })}
          >
            Sign in
          </Button>
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
          {mode === "signup" ? "Create your DevFlow AI account" : "Sign in to DevFlow AI"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Use your name, email, and password to create your account."
            : "Use your email and password to access your dashboard."}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          No password field is required in `profiles` — Supabase handles authentication in `auth.users`.
        </p>

        <form className="mt-6 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="h-11"
                required
              />
              <Input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="h-11"
              />
            </div>
          )}

          <Input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11"
            required
          />

          <Input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11"
            required
          />

          <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === "signup" ? "Creating account..." : "Signing in..."}
              </span>
            ) : (
              mode === "signup" ? "Create account" : "Sign in"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
