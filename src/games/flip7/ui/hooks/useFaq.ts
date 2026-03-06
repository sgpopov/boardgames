"use client";

import { useMemo, useState } from "react";
import { getFlip7FaqItems } from "@games/flip7/composition/faq";

export function useFaq() {
  const [search, setSearch] = useState("");
  const allItems = useMemo(() => getFlip7FaqItems(), []);

  const items = useMemo(() => {
    if (!search) return allItems;

    const lowerSearch = search.toLowerCase();

    return allItems.filter(
      (item) =>
        item.question.toLowerCase().includes(lowerSearch) ||
        item.answer.toLowerCase().includes(lowerSearch),
    );
  }, [allItems, search]);

  return {
    items,
    search,
    setSearch,
  };
}
