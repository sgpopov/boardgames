"use client";

import { useMemo, useState } from "react";
import faq from "../../infrastructure/data/faq.json";

type FAQ = {
  question: string;
  answer: string;
};

export function useFaq() {
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    if (!search) return faq as FAQ[];

    const lowerSearch = search.toLowerCase();

    return (faq as FAQ[]).filter(
      (item) =>
        item.question.toLowerCase().includes(lowerSearch) ||
        item.answer.toLowerCase().includes(lowerSearch),
    );
  }, [search]);

  return {
    items,
    search,
    setSearch,
  };
}
