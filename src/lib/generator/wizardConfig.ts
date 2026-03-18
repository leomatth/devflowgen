import type { GeneratorFormData } from "@/types/generator";

export const generatorGoals: Array<{ value: GeneratorFormData["goal"]; label: string }> = [
  { value: "leads", label: "Get leads" },
  { value: "sales", label: "Sell product" },
  { value: "appointments", label: "Book appointments" },
];

export const generatorStyles: Array<{ value: GeneratorFormData["style"]; label: string }> = [
  { value: "modern", label: "Modern" },
  { value: "minimal", label: "Minimal" },
  { value: "premium", label: "Premium" },
  { value: "bold", label: "Bold" },
];

export const goalLabelMap = Object.fromEntries(generatorGoals.map((goal) => [goal.value, goal.label])) as Record<
  GeneratorFormData["goal"],
  string
>;

export const styleLabelMap = Object.fromEntries(generatorStyles.map((style) => [style.value, style.label])) as Record<
  GeneratorFormData["style"],
  string
>;
