import type { ReactNode } from "react";
import "./PageShell.css";

type PageShellProps = {
  kicker?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function PageShell({ kicker, title, subtitle, actions, children }: PageShellProps) {
  return (
    <div className="page-shell">
      <header className="page-shell__header">
        <div>
          {kicker ? <p className="page-shell__kicker">{kicker}</p> : null}
          <h1 className="page-shell__title">{title}</h1>
          {subtitle ? <p className="page-shell__subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="page-shell__actions">{actions}</div> : null}
      </header>
      {children}
    </div>
  );
}
