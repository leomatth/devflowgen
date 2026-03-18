import { Button } from "@/components/ui/button";
import type { GeneratorFormData, LandingPageResult } from "@/types/generator";
import { goalLabelMap, styleLabelMap } from "@/lib/generator/wizardConfig";
import { generatorText } from "@/lib/generator/content";

type LandingPagePreviewProps = {
  formData: GeneratorFormData;
  result: LandingPageResult | null;
};

const LandingPagePreview = ({ formData, result }: LandingPagePreviewProps) => {
  const styleLabel = styleLabelMap[formData.style];

  return (
    <div className="rounded-3xl border border-border bg-background/60 p-6 shadow-card">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Preview</p>
          <h3 className="mt-1 text-xl font-semibold text-foreground">Landing page draft</h3>
        </div>
        <div className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          {styleLabel}
        </div>
      </div>

      {!result ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
          <p className="text-base font-semibold text-foreground">{generatorText.emptyPreviewTitle}</p>
          <p className="mt-2 text-sm text-muted-foreground">{generatorText.emptyPreviewDescription}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
            <span className="text-sm font-semibold text-foreground">DevFlow AI</span>
            <span className="text-xs text-muted-foreground">{goalLabelMap[formData.goal]}</span>
          </div>

          <h4 className="max-w-md text-2xl font-bold tracking-tight text-foreground">{result.headline}</h4>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{result.subheadline}</p>
          <Button variant="hero" size="sm" className="mt-5">{result.cta}</Button>

          <div className="mt-8 grid gap-5">
            <div>
              <p className="text-sm font-semibold text-foreground">Benefits</p>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                {result.benefits.map((item) => (
                  <li key={item} className="rounded-xl border border-border bg-secondary/35 px-4 py-3">{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">Features</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
                {result.features.map((item) => (
                  <span key={item} className="rounded-full border border-border bg-secondary px-3 py-1.5">{item}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">FAQ</p>
              <div className="mt-3 grid gap-2">
                {result.faq.map((item) => (
                  <div key={item.question} className="rounded-xl border border-border bg-secondary/35 px-4 py-3 text-sm">
                    <p className="font-medium text-foreground">{item.question}</p>
                    <p className="mt-1 text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPagePreview;
