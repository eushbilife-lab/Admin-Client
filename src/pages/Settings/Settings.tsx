import { useState } from "react";
import PageShell from "@core/templates/PageShell";
import { MOCK_AUDIT, MOCK_FLAGS, RBAC_MATRIX } from "mocks/nutritionProduct.mock";
import ToasterService from "utils/toaster.util";
import "./Settings.css";

export default function Settings() {
  const [flags, setFlags] = useState(MOCK_FLAGS);

  const toggleFlag = (key: string) => {
    setFlags((prev) =>
      prev.map((flag) => (flag.key === key ? { ...flag, enabled: !flag.enabled } : flag))
    );
    ToasterService.showSuccess("Feature flag updated (mock)");
  };

  return (
    <PageShell
      kicker="System"
      title="Settings"
      subtitle="RBAC matrix, audit trail, and feature flags. RDA lives under Science → Daily values."
    >
      <section className="settings-panel">
        <header>
          <h2>Roles & permissions</h2>
          <p>Matrix for Super Admin, Content, Dietitian, Support, Analyst.</p>
        </header>
        <div className="settings-table-wrap">
          <table className="settings-table">
            <thead>
              <tr>
                <th>Permission</th>
                <th>Admin</th>
                <th>Content</th>
                <th>Dietitian</th>
                <th>Support</th>
                <th>Analyst</th>
              </tr>
            </thead>
            <tbody>
              {RBAC_MATRIX.map((row) => (
                <tr key={row.permission}>
                  <td>
                    <code>{row.permission}</code>
                  </td>
                  <td>{row.admin ? "✓" : "—"}</td>
                  <td>{row.content ? "✓" : "—"}</td>
                  <td>{row.dietitian ? "✓" : "—"}</td>
                  <td>{row.support ? "✓" : "—"}</td>
                  <td>{row.analyst ? "✓" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="settings-split">
        <section className="settings-panel">
          <header>
            <h2>Feature flags</h2>
            <p>Toggle product experiments without a deploy.</p>
          </header>
          <ul className="settings-flags">
            {flags.map((flag) => (
              <li key={flag.key}>
                <div>
                  <strong>{flag.label}</strong>
                  <p>{flag.description}</p>
                </div>
                <button
                  type="button"
                  className={`settings-switch${flag.enabled ? " is-on" : ""}`}
                  role="switch"
                  aria-checked={flag.enabled}
                  aria-label={flag.label}
                  onClick={() => toggleFlag(flag.key)}
                >
                  <span />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="settings-panel">
          <header>
            <h2>Audit log</h2>
            <p>Recent admin actions (mock stream).</p>
          </header>
          <ul className="settings-audit">
            {MOCK_AUDIT.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.action}</strong>
                <span>{entry.target}</span>
                <em>
                  {entry.actor} · {new Date(entry.at).toLocaleString()}
                </em>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
