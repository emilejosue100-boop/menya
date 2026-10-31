import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  dotClassName?: string;
  children: ReactNode;
};

export function Chip({ dotClassName, children, className = "", ...rest }: ChipProps) {
  return (
    <button
      type="button"
      className={`px-4 py-1.5 min-h-11 rounded-full bg-surface hover:bg-primary-soft text-muted font-label-sm text-label-sm border border-border duration-200 ease-out flex items-center gap-2 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
      {...rest}
    >
      {dotClassName ? <span className={`w-1.5 h-1.5 rounded-full ${dotClassName}`} /> : null}
      {children}
    </button>
  );
}
