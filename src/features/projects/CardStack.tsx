import { Chip, Chips } from "@/shared/components";
import { useT } from "@/features/settings/hooks";
import type { Project } from "@/content/types";

/** Max technologies on a project card, so every card has the same height; the detail view lists them all. */
export const CARD_STACK_MAX = 4;

export function cardStack(p: Pick<Project, "stack" | "cardStack">) {
  const shown = (p.cardStack ?? p.stack).slice(0, CARD_STACK_MAX);
  return { shown, more: p.stack.length - shown.length };
}

export function CardStack({ p }: { p: Pick<Project, "stack" | "cardStack"> }) {
  const t = useT();
  const { shown, more } = cardStack(p);
  return (
    <Chips>
      {shown.map((s) => (
        <Chip key={s}>{s}</Chip>
      ))}
      {more > 0 && (
        <Chip aria-label={`${more} ${t.proj_more}`} title={`${more} ${t.proj_more}`}>
          +{more}
        </Chip>
      )}
    </Chips>
  );
}
