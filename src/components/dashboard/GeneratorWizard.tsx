import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WizardData {
  business: string;
  audience: string;
  offer: string;
  goal: string;
  style: string;
}

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
    options: ["Get leads", "Sell product", "Book appointments"],
  },
  {
    title: "Choose a style",
    description: "Select the design direction to shape the generated page.",
    field: "style",
    options: ["Modern", "Minimal", "Premium", "Bold"],
  },
  {
    title: "Generate Landing Page",
    description: "Review your choices and create a mock landing page preview.",
    field: "generate",
  },
] as const;

const initialData: WizardData = {
  business: "",
  audience: "",
  offer: "",
  goal: "Get leads",
  style: "Modern",
};

const slideTransition = { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

const GeneratorWizard = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<WizardData>(initialData);

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const generated = useMemo(() => {
    const business = data.business || "Your Business";
    const audience = data.audience || "your ideal customers";
    const offer = data.offer || "a high-value offer";

    return {
      headline: `${business} for ${audience}`,
      subheadline: `Present ${offer} with a ${data.style.toLowerCase()} landing page optimized to ${data.goal.toLowerCase()}.`,
      cta: data.goal === "Sell product" ? "Buy Now" : data.goal === "Book appointments" ? "Book a Call" : "Get Started",
      benefits: [
        `Built to speak directly to ${audience}`,
        `Highlights ${offer} with clear conversion paths`,
        `Optimized layout for a ${data.style.toLowerCase()} brand feel`,
      ],
      features: ["Hero section", "Benefits grid", "Feature highlights", "FAQ block"],
      faq: [
        "How fast can I launch this page?",
        "Can I edit the generated copy later?",
        "Will future AI versions save projects automatically?",
      ],
    };
  }, [data]);

  const canGoNext =
    step >= 3 ||
    (currentStep.field === "business" && data.business.trim().length > 1) ||
    (currentStep.field === "audience" && data.audience.trim().length > 1) ||
    (currentStep.field === "offer" && data.offer.trim().length > 1);

  const resetWizard = () => {
    setOpen(false);
    setStep(0);
    setSubmitted(false);
    setData(initialData);
  };

  const handleNext = () => {
    if (step === steps.length - 1) {
      setSubmitted(true);
      return;
    }

    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
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
              Guided landing page generation
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">Generate a New Landing Page</h1>
            <p className="mt-4 text-lg text-muted-foreground">Answer a few questions and let AI build your page</p>
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
                          <p className="text-sm font-medium text-primary">Landing Page Generator</p>
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

                          {currentStep.field === "goal" && (
                            <Select value={data.goal} onValueChange={(value) => setData((prev) => ({ ...prev, goal: value }))}>
                              <SelectTrigger className="h-12 rounded-xl border-border bg-secondary/50">
                                <SelectValue placeholder="Choose goal" />
                              </SelectTrigger>
                              <SelectContent>
                                {currentStep.options?.map((option) => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          {currentStep.field === "style" && (
                            <Select value={data.style} onValueChange={(value) => setData((prev) => ({ ...prev, style: value }))}>
                              <SelectTrigger className="h-12 rounded-xl border-border bg-secondary/50">
                                <SelectValue placeholder="Choose style" />
                              </SelectTrigger>
                              <SelectContent>
                                {currentStep.options?.map((option) => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          {currentStep.field === "generate" && (
                            <div className="rounded-2xl border border-border bg-secondary/35 p-5">
                              <p className="text-sm text-muted-foreground">Ready to generate</p>
                              <div className="mt-4 grid gap-3 text-sm text-foreground sm:grid-cols-2">
                                <div><span className="text-muted-foreground">Business:</span> {data.business || "—"}</div>
                                <div><span className="text-muted-foreground">Audience:</span> {data.audience || "—"}</div>
                                <div><span className="text-muted-foreground">Offer:</span> {data.offer || "—"}</div>
                                <div><span className="text-muted-foreground">Goal:</span> {data.goal}</div>
                                <div><span className="text-muted-foreground">Style:</span> {data.style}</div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-8 flex items-center justify-between gap-3">
                          <Button variant="hero-outline" size="lg" onClick={handleBack} className="gap-2">
                            <ChevronLeft className="h-4 w-4" />
                            Back
                          </Button>
                          <Button variant="hero" size="lg" onClick={handleNext} disabled={!canGoNext} className="gap-2">
                            {step === steps.length - 1 ? "Generate Landing Page" : "Next"}
                            {step === steps.length - 1 ? <Wand2 className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
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
                      <p className="text-sm font-medium text-primary">Mock Generated Result</p>
                      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Your landing page draft is ready</h2>
                      <p className="mt-3 text-muted-foreground">This is placeholder generated content, structured for future AI integration and project saving.</p>

                      <div className="mt-8 flex items-center gap-3">
                        <Button variant="hero-outline" size="lg" onClick={() => setSubmitted(false)}>Back to wizard</Button>
                        <Button variant="hero" size="lg" onClick={resetWizard}>Done</Button>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="bg-secondary/20 p-6 lg:p-8">
                  <div className="rounded-3xl border border-border bg-background/60 p-6 shadow-card">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Preview</p>
                        <h3 className="mt-1 text-xl font-semibold text-foreground">Landing page draft</h3>
                      </div>
                      <div className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                        {data.style}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                      <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
                        <span className="text-sm font-semibold text-foreground">DevFlow AI</span>
                        <span className="text-xs text-muted-foreground">{data.goal}</span>
                      </div>

                      <h4 className="max-w-md text-2xl font-bold tracking-tight text-foreground">{generated.headline}</h4>
                      <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{generated.subheadline}</p>
                      <Button variant="hero" size="sm" className="mt-5">{generated.cta}</Button>

                      <div className="mt-8 grid gap-5">
                        <div>
                          <p className="text-sm font-semibold text-foreground">Benefits</p>
                          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                            {generated.benefits.map((item) => (
                              <li key={item} className="rounded-xl border border-border bg-secondary/35 px-4 py-3">{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-foreground">Features</p>
                          <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
                            {generated.features.map((item) => (
                              <span key={item} className="rounded-full border border-border bg-secondary px-3 py-1.5">{item}</span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-foreground">FAQ</p>
                          <div className="mt-3 grid gap-2">
                            {generated.faq.map((item) => (
                              <div key={item} className="rounded-xl border border-border bg-secondary/35 px-4 py-3 text-sm text-muted-foreground">{item}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GeneratorWizard;
