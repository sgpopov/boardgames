import faq from "@games/flip7/infrastructure/data/faq.json";

export type FaqItem = {
  question: string;
  answer: string;
};

export function getFlip7FaqItems(): FaqItem[] {
  return faq as FaqItem[];
}
