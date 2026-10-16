import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = { label: string } & (
  | ({ multiline?: false } & InputHTMLAttributes<HTMLInputElement>)
  | ({ multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>)
);

/** Labelled input/textarea (prototype `.field`). The label wraps the control. */
export function Field(props: FieldProps) {
  const { label, multiline, ...rest } = props;
  return (
    <label className="field">
      {label}
      {multiline ? (
        <textarea rows={4} {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input type="text" {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      )}
    </label>
  );
}
