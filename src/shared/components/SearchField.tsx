import type { InputHTMLAttributes } from "react";
import { Icon } from "../icons/Icon";

export function SearchField({
  label,
  ...rest
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="search">
      <Icon name="search" />
      <input type="text" aria-label={label} placeholder={label} {...rest} />
    </label>
  );
}
