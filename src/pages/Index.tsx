import { useState } from "react";
import { content, type Locale } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Benefits from "@/components/Benefits";
import Pricing from "@/components/Pricing";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";

const Index = () => {
  const [locale, setLocale] = useState<Locale>("en");
  const t = content[locale];

  return (
    <div className="min-h-screen bg-background">
      <Navbar locale={locale} onLocaleChange={setLocale} />
      <Hero t={t.hero} />
      <SocialProof t={t.social} />
      <HowItWorks t={t.steps} />
      <Features t={t.features} />
      <Benefits t={t.benefits} />
      <Pricing t={t.pricing} />
      <FinalCta t={t.finalCta} />
      <Footer t={t.footer} />
    </div>
  );
};

export default Index;
