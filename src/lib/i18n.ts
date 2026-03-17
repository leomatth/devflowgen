export type Locale = "en" | "es" | "pt";

interface StepItem { step: string; title: string; desc: string; }
interface FeatureItem { title: string; desc: string; }
interface BenefitItem { title: string; desc: string; }
interface PlanInfo { name: string; price: string; period: string; features: string[]; cta: string; badge?: string; }

export interface Content {
  nav: { product: string; pricing: string; contact: string; start: string; };
  hero: { title: string; subtitle: string; cta: string; demo: string; };
  social: { text: string; };
  steps: { title: string; subtitle: string; items: StepItem[]; };
  features: { title: string; subtitle: string; items: FeatureItem[]; };
  benefits: { title: string; subtitle: string; items: BenefitItem[]; };
  pricing: { title: string; subtitle: string; free: PlanInfo; pro: PlanInfo; };
  finalCta: { title: string; subtitle: string; cta: string; };
  footer: { product: string; pricing: string; contact: string; terms: string; rights: string; };
}

export const content: Record<Locale, Content> = {
  en: {
    nav: { product: "Product", pricing: "Pricing", contact: "Contact", start: "Start Free" },
    hero: {
      title: "Create High-Converting Landing Pages in Seconds with AI",
      subtitle: "Turn your idea into a ready-to-use landing page with copy, structure, and design powered by AI.",
      cta: "Start Free",
      demo: "See Demo",
    },
    social: {
      text: "Trusted by creators, freelancers, and startups worldwide",
    },
    steps: {
      title: "How It Works",
      subtitle: "Three simple steps to your perfect landing page.",
      items: [
        { step: "01", title: "Describe Your Business", desc: "Tell us about your product, audience, and goals in a few sentences." },
        { step: "02", title: "Choose Your Goal & Style", desc: "Select your conversion goal and visual style from curated templates." },
        { step: "03", title: "Get Your Landing Page", desc: "Receive a complete, conversion-optimized landing page in seconds." },
      ],
    },
    features: {
      title: "Everything You Need",
      subtitle: "Powerful features to build landing pages that convert.",
      items: [
        { title: "AI-Generated Copy", desc: "Headlines, CTAs, and full sections written by AI trained on high-converting pages." },
        { title: "Smart Structure", desc: "Layouts optimized for conversion based on proven design patterns." },
        { title: "Multiple Variations", desc: "Generate several versions and A/B test to find your best performer." },
        { title: "Ready-to-Use Sections", desc: "FAQ, benefits, testimonials, and more — all pre-built and customizable." },
        { title: "Export-Ready", desc: "Download clean code or integrate directly with your favorite tools." },
        { title: "Responsive Design", desc: "Every page looks perfect on desktop, tablet, and mobile." },
      ],
    },
    benefits: {
      title: "Why DevFlow AI?",
      subtitle: "Stop wasting time. Start converting.",
      items: [
        { title: "Save Hours of Work", desc: "What used to take days now takes seconds." },
        { title: "No Design Skills Needed", desc: "Beautiful pages without touching a design tool." },
        { title: "Increase Conversion Rates", desc: "AI-optimized layouts and copy that actually convert." },
        { title: "Perfect for Freelancers", desc: "Deliver client projects faster and more profitably." },
      ],
    },
    pricing: {
      title: "Simple Pricing",
      subtitle: "Start free. Upgrade when you're ready.",
      free: {
        name: "Free",
        price: "$0",
        period: "/month",
        features: ["5 page generations", "Basic templates", "Standard copy", "Community support"],
        cta: "Get Started",
      },
      pro: {
        name: "Pro",
        price: "$29",
        period: "/month",
        badge: "Most Popular",
        features: ["Unlimited generations", "Advanced AI copy", "Multiple variations", "Priority support", "Custom branding", "Export to code"],
        cta: "Upgrade to Pro",
      },
    },
    finalCta: {
      title: "Start building your landing page today",
      subtitle: "No coding. No design skills. Just results.",
      cta: "Start Free",
    },
    footer: {
      product: "Product",
      pricing: "Pricing",
      contact: "Contact",
      terms: "Terms",
      rights: "All rights reserved.",
    },
  },
  es: {
    nav: { product: "Producto", pricing: "Precios", contact: "Contacto", start: "Empezar Gratis" },
    hero: {
      title: "Crea Landing Pages de Alta Conversión en Segundos con IA",
      subtitle: "Convierte tu idea en una landing page lista para usar con textos, estructura y diseño impulsados por IA.",
      cta: "Empezar Gratis",
      demo: "Ver Demo",
    },
    social: { text: "Utilizado por creadores, freelancers y startups en todo el mundo" },
    steps: {
      title: "Cómo Funciona",
      subtitle: "Tres simples pasos para tu landing page perfecta.",
      items: [
        { step: "01", title: "Describe Tu Negocio", desc: "Cuéntanos sobre tu producto, audiencia y objetivos en pocas oraciones." },
        { step: "02", title: "Elige Tu Objetivo y Estilo", desc: "Selecciona tu objetivo de conversión y estilo visual." },
        { step: "03", title: "Obtén Tu Landing Page", desc: "Recibe una landing page completa y optimizada en segundos." },
      ],
    },
    features: {
      title: "Todo Lo Que Necesitas",
      subtitle: "Funciones potentes para construir páginas que convierten.",
      items: [
        { title: "Textos con IA", desc: "Titulares, CTAs y secciones completas escritas por IA." },
        { title: "Estructura Inteligente", desc: "Diseños optimizados para conversión." },
        { title: "Múltiples Variaciones", desc: "Genera varias versiones y prueba A/B." },
        { title: "Secciones Listas", desc: "FAQ, beneficios, testimonios y más." },
        { title: "Listo para Exportar", desc: "Descarga código limpio o integra con tus herramientas." },
        { title: "Diseño Responsivo", desc: "Perfecto en escritorio, tablet y móvil." },
      ],
    },
    benefits: {
      title: "¿Por Qué DevFlow AI?",
      subtitle: "Deja de perder tiempo. Empieza a convertir.",
      items: [
        { title: "Ahorra Horas", desc: "Lo que antes tomaba días, ahora toma segundos." },
        { title: "Sin Habilidades de Diseño", desc: "Páginas hermosas sin tocar una herramienta de diseño." },
        { title: "Aumenta Conversiones", desc: "Diseños y textos optimizados por IA que convierten." },
        { title: "Perfecto para Freelancers", desc: "Entrega proyectos más rápido y con más rentabilidad." },
      ],
    },
    pricing: {
      title: "Precios Simples",
      subtitle: "Empieza gratis. Mejora cuando estés listo.",
      free: { name: "Gratis", price: "$0", period: "/mes", features: ["5 generaciones", "Plantillas básicas", "Texto estándar", "Soporte comunitario"], cta: "Empezar" },
      pro: { name: "Pro", price: "$29", period: "/mes", badge: "Más Popular", features: ["Generaciones ilimitadas", "Texto avanzado con IA", "Múltiples variaciones", "Soporte prioritario", "Marca personalizada", "Exportar a código"], cta: "Mejorar a Pro" },
    },
    finalCta: { title: "Empieza a construir tu landing page hoy", subtitle: "Sin código. Sin diseño. Solo resultados.", cta: "Empezar Gratis" },
    footer: { product: "Producto", pricing: "Precios", contact: "Contacto", terms: "Términos", rights: "Todos los derechos reservados." },
  },
  pt: {
    nav: { product: "Produto", pricing: "Preços", contact: "Contato", start: "Começar Grátis" },
    hero: {
      title: "Crie Landing Pages de Alta Conversão em Segundos com IA",
      subtitle: "Transforme sua ideia em uma landing page pronta para uso com textos, estrutura e design gerados por IA.",
      cta: "Começar Grátis",
      demo: "Ver Demo",
    },
    social: { text: "Usado por criadores, freelancers e startups no mundo todo" },
    steps: {
      title: "Como Funciona",
      subtitle: "Três passos simples para sua landing page perfeita.",
      items: [
        { step: "01", title: "Descreva Seu Negócio", desc: "Conte-nos sobre seu produto, público e objetivos." },
        { step: "02", title: "Escolha Objetivo e Estilo", desc: "Selecione seu objetivo de conversão e estilo visual." },
        { step: "03", title: "Receba Sua Landing Page", desc: "Receba uma landing page completa e otimizada em segundos." },
      ],
    },
    features: {
      title: "Tudo Que Você Precisa",
      subtitle: "Recursos poderosos para criar páginas que convertem.",
      items: [
        { title: "Textos com IA", desc: "Títulos, CTAs e seções completas escritas por IA." },
        { title: "Estrutura Inteligente", desc: "Layouts otimizados para conversão." },
        { title: "Múltiplas Variações", desc: "Gere várias versões e faça testes A/B." },
        { title: "Seções Prontas", desc: "FAQ, benefícios, depoimentos e mais." },
        { title: "Pronto para Exportar", desc: "Baixe código limpo ou integre com suas ferramentas." },
        { title: "Design Responsivo", desc: "Perfeito em desktop, tablet e celular." },
      ],
    },
    benefits: {
      title: "Por Que DevFlow AI?",
      subtitle: "Pare de perder tempo. Comece a converter.",
      items: [
        { title: "Economize Horas", desc: "O que levava dias agora leva segundos." },
        { title: "Sem Habilidades de Design", desc: "Páginas lindas sem tocar em ferramentas de design." },
        { title: "Aumente Conversões", desc: "Layouts e textos otimizados por IA que convertem." },
        { title: "Perfeito para Freelancers", desc: "Entregue projetos mais rápido e com mais lucro." },
      ],
    },
    pricing: {
      title: "Preços Simples",
      subtitle: "Comece grátis. Faça upgrade quando quiser.",
      free: { name: "Grátis", price: "$0", period: "/mês", features: ["5 gerações", "Templates básicos", "Texto padrão", "Suporte comunitário"], cta: "Começar" },
      pro: { name: "Pro", price: "$29", period: "/mês", badge: "Mais Popular", features: ["Gerações ilimitadas", "Texto avançado com IA", "Múltiplas variações", "Suporte prioritário", "Marca personalizada", "Exportar para código"], cta: "Fazer Upgrade" },
    },
    finalCta: { title: "Comece a criar sua landing page hoje", subtitle: "Sem código. Sem design. Apenas resultados.", cta: "Começar Grátis" },
    footer: { product: "Produto", pricing: "Preços", contact: "Contato", terms: "Termos", rights: "Todos os direitos reservados." },
  },
} as const;

export type Content = typeof content.en;
