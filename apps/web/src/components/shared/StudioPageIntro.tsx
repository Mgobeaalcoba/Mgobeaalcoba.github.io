import type { ReactNode } from "react";

/** Shared page hierarchy for the studio, editorial and tool entry points. */
export default function StudioPageIntro({
  eyebrow,
  title,
  description,
  aside,
  children,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`mga-page-intro mga-container ${className}`}>
      <span className="mga-kicker">{eyebrow}</span>
      <div className="mga-page-intro__grid">
        <div>
          <h1>{title}</h1>
          <div className="mga-page-intro__description">{description}</div>
          {children && (
            <div className="mga-page-intro__actions">{children}</div>
          )}
        </div>
        {aside && <aside className="mga-page-intro__aside">{aside}</aside>}
      </div>
    </header>
  );
}
