import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { DashListItem } from "./DashListCard";

function WorkBoard({
  pending,
  drafts,
  missing,
  onQueue,
}: {
  pending: number;
  drafts: number;
  missing: DashListItem[];
  onQueue: () => void;
}) {
  const navigate = useNavigate();
  const chores = [
    { id: "review", label: "Awaiting dietitian sign-off", count: pending, href: "/queue" },
    { id: "drafts", label: "Unpublished drafts", count: drafts, href: "/queue" },
    { id: "facts", label: "Missing nutrition facts", count: missing.length, href: "/products" },
  ];

  return (
    <section className="work-board">
      <header className="work-board__head">
        <div>
          <h2>Review queue</h2>
          <p>Nothing goes live until facts, allergens, and scores are ready.</p>
        </div>
        <button type="button" className="dash-list-card__view-all-btn" onClick={onQueue}>
          Open queue
        </button>
      </header>

      <ul className="work-board__chores">
        {chores.map((chore) => (
          <li key={chore.id}>
            <button type="button" onClick={() => navigate(chore.href)}>
              <strong>{chore.count.toLocaleString()}</strong>
              <span>{chore.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {missing.length ? (
        <ul className="dash-list work-board__list">
          {missing.slice(0, 4).map((item) => (
            <li
              key={item.id}
              className="dash-list__row is-clickable"
              onClick={() => item.href && navigate(item.href)}
            >
              {item.image ? (
                <img src={item.image} alt="" className="dash-list__media" />
              ) : (
                <span className="dash-list__media is-avatar" />
              )}
              <div className="dash-list__meta">
                <strong className="dash-list__name">{item.name}</strong>
                {item.email ? <span className="dash-list__subtitle">{item.email}</span> : null}
              </div>
              <em className="status-chip is-warn">No facts panel</em>
            </li>
          ))}
        </ul>
      ) : (
        <p className="dash-list__empty">Sampled foods all carry a nutrition facts panel.</p>
      )}
    </section>
  );
}

export default memo(WorkBoard);
