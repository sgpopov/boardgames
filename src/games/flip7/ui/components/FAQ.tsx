"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFaq } from "../hooks/useFaq";
import { useCallback } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

export function FAQ() {
  const { items, setSearch } = useFaq();

  const search = useCallback(
    (term: string) => {
      setSearch(term);
    },
    [setSearch],
  );

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">FAQ</h2>
      </div>

      <InputGroup className="px-0">
        <InputGroupInput
          placeholder="Search..."
          onChange={(e) => search(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      <Accordion type="single" collapsible>
        {items.map((item, idx) => {
          return (
            <AccordionItem key={`question${idx}`} value={`question${idx}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
}
