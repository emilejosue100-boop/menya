import { type InputHTMLAttributes, type ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  labelExtra?: ReactNode;
  leadingIcon?: ReactNode;
  trailing?: ReactNode;
};

export function Input({ label, labelExtra, leadingIcon, trailing, className = "", id, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {(label || labelExtra) && (
        <div className="flex items-center justify-between">
          {label ? (
            <label htmlFor={id} className="font-label-md text-label-md text-text">
              {label}
            </label>
          ) : (
            <span />
          )}
          {labelExtra}
        </div>
      )}
      <div className="relative flex items-center">
        {leadingIcon ? (
          <span className="absolute left-4 inset-y-0 flex items-center text-muted pointer-events-none">{leadingIcon}</span>
        ) : null}
        <input
          id={id}
          className={`w-full h-12 ${leadingIcon ? "pl-12" : "pl-4"} ${trailing ? "pr-12" : "pr-4"} bg-surface rounded-xl text-text placeholder:text-muted font-body-md text-body-md border border-border duration-200 ease-out focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary ${className}`}
          {...rest}
        />
        {trailing ? <span className="absolute right-3 flex items-center">{trailing}</span> : null}
      </div>
    </div>
  );
}
