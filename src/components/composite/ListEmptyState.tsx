"use client";

import Link from "next/link";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

export type ListEmptyStateProps = {
  title: string;
  description: string;
  link?: {
    label: string;
    href: string;
  };
  icon?: React.ReactNode;
  className?: string;
};

export function ListEmptyState({
  title,
  description,
  link,
  icon,
  className,
}: ListEmptyStateProps) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        {icon && <EmptyMedia variant="icon">{icon}</EmptyMedia>}
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {link && (
        <EmptyContent>
          <Link href={link.href} className="text-sm self-center no-underline">
            <Button>{link.label}</Button>
          </Link>
        </EmptyContent>
      )}
    </Empty>
  );
}
