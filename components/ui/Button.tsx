import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "coral" | "teal" | "surface" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-surface hover:opacity-90 font-label-lg text-label-lg",
  coral: "bg-coral text-surface font-label-lg text-label-lg hover:opacity-90",
  teal: "bg-teal text-surface font-label-lg text-label-lg hover:opacity-90",
  surface: "bg-surface hover:bg-primary-soft text-text font-label-lg text-label-lg border border-border",
  ghost: "bg-primary-soft text-primary font-label-lg text-label-lg hover:bg-lavender/40",
};

type BaseProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps & {
  href: string;
  target?: string;
  rel?: string;
};

const shell =
  "inline-flex h-12 rounded-xl duration-200 ease-out items-center justify-center gap-2 font-bold cursor-pointer active:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

export function Button({
  variant = "primary",
  className = "",
  children,
  href,
  ...rest
}: ButtonAsButton | ButtonAsLink) {
  const classes = `${shell} ${variantClasses[variant]} ${className}`;

  if (href) {
    const linkRest = rest as ButtonAsLink;
    return (
      <Link
        href={href}
        target={linkRest.target}
        rel={linkRest.target === "_blank" ? (linkRest.rel ?? "noopener noreferrer") : linkRest.rel}
        className={`w-full ${classes}`}
      >
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type={type} className={`w-full ${classes}`} {...buttonRest}>
      {children}
    </button>
  );
}
