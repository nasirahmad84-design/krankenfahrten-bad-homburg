import type { ReactNode } from "react";

import { classNames } from "@/lib/class-names";

type NoticeVariant = "information" | "billing" | "warning" | "error";

type NoticeBoxProps = {
  title: string;
  children: ReactNode;
  variant?: NoticeVariant;
  className?: string;
};

const variants: Record<
  NoticeVariant,
  { label: string; className: string; icon: ReactNode }
> = {
  information: {
    label: "Information",
    className: "border-blue-700/25 bg-blue-50 text-blue-950",
    icon: <InformationIcon />,
  },
  billing: {
    label: "Abrechnungshinweis",
    className: "border-green/35 bg-green/10 text-navy",
    icon: <BillingIcon />,
  },
  warning: {
    label: "Warnhinweis",
    className: "border-amber-700/30 bg-amber-50 text-amber-950",
    icon: <WarningIcon />,
  },
  error: {
    label: "Fehlerhinweis",
    className: "border-red-700/30 bg-red-50 text-red-950",
    icon: <ErrorIcon />,
  },
};

export function NoticeBox({
  title,
  children,
  variant = "information",
  className,
}: NoticeBoxProps) {
  const style = variants[variant];
  const isUrgent = variant === "warning" || variant === "error";

  return (
    <section
      className={classNames(
        "rounded-card border p-5 sm:p-6",
        style.className,
        className,
      )}
      role={isUrgent ? "alert" : "note"}
      aria-label={style.label}
    >
      <div className="flex items-start gap-4">
        <span className="mt-0.5 shrink-0" aria-hidden="true">
          {style.icon}
        </span>
        <div className="min-w-0">
          <h2 className="text-lg leading-snug font-bold">{title}</h2>
          <div className="mt-2 leading-relaxed">{children}</div>
        </div>
      </div>
    </section>
  );
}

const iconClassName = "size-6";

function InformationIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClassName} fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 11v6M12 7.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BillingIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClassName} fill="none">
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClassName} fill="none">
      <path d="M12 3 2.5 20h19L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 9v5M12 17.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClassName} fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="m9 9 6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
