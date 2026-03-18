import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import type { GeneratorFormData } from "@/types/generator";
import { generateLandingPage } from "@/lib/generator/generateLandingPage";
import { generatorText } from "@/lib/generator/content";
import {
  canGenerateLandingPage,
  getUserPlanState,
  registerGeneration,
} from "@/lib/plans/userPlan";
import {
  getCurrentUserId,
  getPlanStateForCurrentUser,
  refreshDashboardData,
  saveGeneratedProject,
} from "@/lib/dashboard/data";
import {
  generatorGoals,
  generatorStyles,
  goalLabelMap,
  styleLabelMap,
} from "@/lib/generator/wizardConfig";
import LandingPagePreview from "@/components/generator/LandingPagePreview";
import UpgradeModal from "@/components/generator/UpgradeModal";

type WizardField = keyof GeneratorFormData | "review";

type WizardStep = {
  title: string;
  description: string;
  field: WizardField;
  placeholder?: string;
};

const steps = [
  {
    title: "What is your business?",
    description: "Describe the type of business you want to generate a page for.",
    field: "business",
    placeholder: "Example: Fitness coaching, restaurant, SaaS...",
  },
  {
    title: "Who is your target audience?",
    description: "Define who should instantly connect with the page.",
    field: "audience",
    placeholder: "Example: Busy founders, local families, ecommerce brands...",
  },
  {
    title: "What are you offering?",
    description: "Summarize your core offer in a few words.",
    field: "offer",
    placeholder: "Example: Weekly coaching, premium skincare, AI analytics...",
  },
  {
    title: "What is the main goal?",
    description: "Choose the primary conversion action for the page.",
    field: "goal",
  },
  {
    title: "Choose a style",
    description: "Select the design direction to shape the generated page.",
    field: "style",
  },
  {
    title: "Generate Landing Page",
    description: "Review your choices and create a mock landing page preview.",
    field: "review",
  },
] as const satisfies WizardStep[];

const initialData: GeneratorFormData = {
  business: "",
  audience: "",
  offer: "",
  goal: "leads",
  style: "modern",
};

const slideTransition = { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

const GeneratorWizard = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<GeneratorFormData>(initialData);
  const [result, setResult] = useState<Awaited<ReturnType<typeof generateLandingPage>> | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof GeneratorFormData, string>>>({});
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [planState, setPlanState] = useState(() => getUserPlanState());

  const refreshPlanState = async () => {
    const userId = await getCurrentUserId();
    if (!userId) {
      setPlanState(getUserPlanState());
      return;
    }

    const state = await getPlanStateForCurrentUser();
    if (state) {
      setPlanState(state);
    }
  };

  useEffect(() => {
    if (open) {
      void refreshPlanState();
    }
  }, [open]);

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const isCurrentStepValid = useMemo(() => {
    switch (currentStep.field) {
      case "business":
        return data.business.trim().length >= 2;
      case "audience":
        return data.audience.trim().length >= 2;
      case "offer":
        return data.offer.trim().length >= 2;
      case "goal":
        return generatorGoals.some((item) => item.value === data.goal);
      case "style":
        return generatorStyles.some((item) => item.value === data.style);
      case "review":
        return true;
    }
  }, [currentStep.field, data]);

  const validateField = (field: keyof GeneratorFormData): string => {
    const value = data[field];

    if (field === "business" || field === "audience" || field === "offer") {
      if (value.trim().length < 2) {
        return "Please add at least 2 characters.";
      }
    }

    if (field === "goal" && !generatorGoals.some((item) => item.value === value)) {
      return "Please choose a valid goal.";
    }

    if (field === "style" && !generatorStyles.some((item) => item.value === value)) {
      return "Please choose a valid style.";
    }

    return "";
  };

  const validateCurrentStep = () => {
    if (currentStep.field === "review") {
      return true;
    }

    const error = validateField(currentStep.field);
    setFieldErrors((prev) => ({ ...prev, [currentStep.field]: error || undefined }));
    return !error;
  };

  const resetWizard = () => {
    setOpen(false);
    setStep(0);
    setSubmitted(false);
    setIsGenerating(false);
    setResult(null);
    setFieldErrors({});
    setLimitMessage(null);
    setData(initialData);
    void refreshPlanState();
  };

  const handleGenerate = async () => {
    const userId = await getCurrentUserId();
    const latestPlanState = userId
      ? (await getPlanStateForCurrentUser()) ?? planState
      : getUserPlanState();

    setPlanState(latestPlanState);

    if (!canGenerateLandingPage(latestPlanState)) {
      setLimitMessage("Daily limit reached for Free plan. Upgrade to generate more pages today.");
      setUpgradeOpen(true);
      return;
    }

    setLimitMessage(null);
    setIsGenerating(true);

    try {
      const generated = await generateLandingPage(data);
      setResult(generated);

      if (userId) {
        const refreshedState = await getPlanStateForCurrentUser();
        if (refreshedState) {
          setPlanState(refreshedState);
        }

        try {
          await saveGeneratedProject(data, generated);
          refreshDashboardData();
        } catch {
          toast.error("Landing page generated, but saving the project failed.");
        }
      } else {
        const updatedPlanState = registerGeneration();
        setPlanState(updatedPlanState);
      }

      setSubmitted(true);
      setStep(steps.length - 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong while generating your page. Please try again.";

      if (message.toLowerCase().includes("usage limit reached")) {
        setLimitMessage("Daily limit reached for Free plan. Upgrade to generate more pages today.");
        setUpgradeOpen(true);
      }

      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (step === steps.length - 1) {
      void handleGenerate();
      return;
    }

    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    if (submitted) {
      setSubmitted(false);
      return;
    }

    if (step === 0) {
      setOpen(false);
      return;
    }

    setStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <>
      <section className="rounded-3xl border border-border bg-card p-8 shadow-card md:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {generatorText.badge}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">{generatorText.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{generatorText.subtitle}</p>
          </div>

          <Button variant="hero" size="xl" onClick={() => setOpen(true)}>
            Start Generator
          </Button>
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={slideTransition}
              className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-card"
            >
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div>
                  <p className="text-sm text-muted-foreground">Step {submitted ? steps.length : step + 1} of {steps.length}</p>
                  <div className="mt-2 h-2 w-56 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-gradient-primary transition-all duration-300" style={{ width: `${submitted ? 100 : progress}%` }} />
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={resetWizard}>Close</Button>
              </div>

              <div className="grid min-h-[560px] lg:grid-cols-[1.05fr_0.95fr]">
                <div className="border-b border-border p-6 lg:border-b-0 lg:border-r lg:p-8">
                  {!submitted ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -18 }}
                        transition={slideTransition}
                        className="flex h-full flex-col"
                      >
                        <div>
                          <p className="text-sm font-medium text-primary">{generatorText.flowLabel}</p>
                          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{currentStep.title}</h2>
                          <p className="mt-3 max-w-lg text-muted-foreground">{currentStep.description}</p>
                        </div>

                        <div className="mt-10 flex-1">
                          {(currentStep.field === "business" || currentStep.field === "audience" || currentStep.field === "offer") && (
                            <Input
                              value={data[currentStep.field]}
                              onChange={(event) =>
                                setData((prev) => ({ ...prev, [currentStep.field]: event.target.value }))
                              }
                              placeholder={currentStep.placeholder}
                              className="h-12 rounded-xl border-border bg-secondary/50"
                            />
                          )}

                          {(currentStep.field === "business" || currentStep.field === "audience" || currentStep.field === "offer") && fieldErrors[currentStep.field] && (
                            <p className="mt-2 text-sm text-destructive">{fieldErrors[currentStep.field]}</p>
                          )}

                          {currentStep.field === "goal" && (
                            <Select value={data.goal} onValueChange={(value: GeneratorFormData["goal"]) => setData((prev) => ({ ...prev, goal: value }))}>
                              <SelectTrigger className="h-12 rounded-xl border-border bg-secondary/50">
                                <SelectValue placeholder="Choose goal" />
                              </SelectTrigger>
                              <SelectContent>
                                {generatorGoals.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          {currentStep.field === "style" && (
                            <Select value={data.style} onValueChange={(value: GeneratorFormData["style"]) => setData((prev) => ({ ...prev, style: value }))}>
                              <SelectTrigger className="h-12 rounded-xl border-border bg-secondary/50">
                                <SelectValue placeholder="Choose style" />
                              </SelectTrigger>
                              <SelectContent>
                                {generatorStyles.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          {currentStep.field === "review" && (
                            <div className="rounded-2xl border border-border bg-secondary/35 p-5">
                              <p className="text-sm text-muted-foreground">{generatorText.readyLabel}</p>
                              <div className="mt-4 grid gap-3 text-sm text-foreground sm:grid-cols-2">
                                <div><span className="text-muted-foreground">Business:</span> {data.business || "—"}</div>
                                <div><span className="text-muted-foreground">Audience:</span> {data.audience || "—"}</div>
                                <div><span className="text-muted-foreground">Offer:</span> {data.offer || "—"}</div>
                                <div><span className="text-muted-foreground">Goal:</span> {goalLabelMap[data.goal]}</div>
                                <div><span className="text-muted-foreground">Style:</span> {styleLabelMap[data.style]}</div>
                              </div>

                              <div className="mt-4 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Plan:</span> {planState.plan === "pro" ? "Pro" : "Free"} · {planState.plan === "pro" ? "Unlimited generations" : `${Math.max(planState.dailyLimit - planState.generationsUsedToday, 0)} generation left today`}
                              </div>

                              {limitMessage && <p className="mt-3 text-sm text-destructive">{limitMessage}</p>}
                            </div>
                          )}
                        </div>

                        <div className="mt-8 flex items-center justify-between gap-3">
                          <Button variant="hero-outline" size="lg" onClick={handleBack} className="gap-2">
                            <ChevronLeft className="h-4 w-4" />
                            Back
                          </Button>
                          <Button variant="hero" size="lg" onClick={handleNext} disabled={!isCurrentStepValid || isGenerating} className="gap-2">
                            {step === steps.length - 1 ? (isGenerating ? generatorText.loadingMessage : "Generate Landing Page") : "Next"}
                            {step === steps.length - 1 ? (isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />) : <ChevronRight className="h-4 w-4" />}
                          </Button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={slideTransition}
                      className="flex h-full flex-col"
                    >
                      <p className="text-sm font-medium text-primary">Generated Result</p>
                      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{generatorText.resultTitle}</h2>
                      <p className="mt-3 text-muted-foreground">{generatorText.resultDescription}</p>

                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Button variant="hero-outline" size="lg" onClick={() => void handleGenerate()} disabled={isGenerating}>Regenerate</Button>
                        <Button
                          variant="hero-outline"
                          size="lg"
                          onClick={() => {
                            toast.success("Saved as draft for later editing.");
                            resetWizard();
                          }}
                        >
                          Edit later
                        </Button>
                        <Button variant="hero" size="lg" onClick={() => setUpgradeOpen(true)}>Upgrade to Pro</Button>
                      </div>

                      {limitMessage && <p className="mt-4 text-sm text-destructive">{limitMessage}</p>}
                    </motion.div>
                  )}
                </div>

                <div className="bg-secondary/20 p-6 lg:p-8">
                  <LandingPagePreview formData={data} result={result} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </>
  );
};

export default GeneratorWizard;
