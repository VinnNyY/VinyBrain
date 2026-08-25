import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
}: SectionProps) {
  return (
    <section id={id} className={`section scroll-mt-24 py-16 sm:py-20 lg:py-24 ${className}`}>
      <Container>
        <div className="mb-8 max-w-3xl lg:mb-10">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-8 text-slate-400 sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </Container>
    </section>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  return (
    <a href={href} className={`button button-${variant} ${className}`}>
      {children}
    </a>
  );
}

export function Badge({ children, tone = "blue" }: { children: ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function IconShell({
  icon: Icon,
}: {
  icon: LucideIcon;
}) {
  return (
    <span className="icon-shell" aria-hidden="true">
      <Icon size={18} strokeWidth={1.8} />
    </span>
  );
}
