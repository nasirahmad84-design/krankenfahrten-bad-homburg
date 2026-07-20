import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  ReactNode,
} from "react";

import { classNames } from "@/lib/class-names";

type ButtonVariant = "primary" | "secondary" | "outline" | "link";
type ButtonSize = "default" | "large" | "icon";

type SharedProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type NativeButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedProps | "href"> & {
    href?: never;
  };

type LinkButtonProps = SharedProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof SharedProps | "href"> & {
    href: ComponentPropsWithoutRef<typeof Link>["href"];
    disabled?: never;
  };

export type ButtonProps = NativeButtonProps | LinkButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-green text-navy hover:bg-green-light active:bg-green-light disabled:bg-navy/25",
  secondary:
    "bg-navy text-white hover:bg-navy-light active:bg-navy-light disabled:bg-navy/25",
  outline:
    "border border-navy/30 bg-transparent text-navy hover:bg-navy/5 active:bg-navy/10 disabled:border-navy/15 disabled:text-navy/35",
  link: "min-h-0 text-navy underline decoration-green decoration-2 underline-offset-4 hover:text-green-dark active:text-green-dark disabled:text-navy/35",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "min-h-11 px-5 py-2.5",
  large: "min-h-12 px-6 py-3 text-base",
  icon: "size-11 p-0",
};

export function Button({
  variant = "primary",
  size = "default",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = classNames(
    "inline-flex items-center justify-center gap-2 rounded-lg text-[15px] font-semibold transition-colors disabled:cursor-not-allowed",
    variantClasses[variant],
    variant === "link" ? undefined : sizeClasses[size],
    className,
  );

  if ("href" in props && props.href !== undefined) {
    return (
      <Link {...props} href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" {...props} className={classes}>
      {children}
    </button>
  );
}
