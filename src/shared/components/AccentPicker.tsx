import { ACCENTS, type Accent } from "../theme/options";
import { cn } from "@/lib/cn";

/** Accent color swatches (prototype Settings popover). `labels` supplies translated names. */
export function AccentPicker({
  value,
  onChange,
  labels,
  label,
}: {
  value: Accent;
  onChange: (value: Accent) => void;
  labels: Record<Accent, string>;
  label: string;
}) {
  return (
    <div className="swatches" role="group" aria-label={label}>
      {ACCENTS.map((a) => (
        <button
          key={a}
          type="button"
          className={cn("sw", `a-${a}`, a === value && "on")}
          aria-label={labels[a]}
          title={labels[a]}
          aria-pressed={a === value}
          onClick={() => onChange(a)}
        />
      ))}
    </div>
  );
}
