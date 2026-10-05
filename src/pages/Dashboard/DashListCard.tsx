import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight, MdReport, MdSupportAgent, MdWarningAmber, MdEco } from "react-icons/md";

const TONE_ICONS = {
  red: MdReport,
  pink: MdReport,
  green: MdEco,
  blue: MdSupportAgent,
  orange: MdWarningAmber,
};

export type DashListItem = {
  id: string;
  name: string;
  email?: string;
  trailing?: string | number;
  image?: string;
  iconTone?: keyof typeof TONE_ICONS;
  href?: string;
  badge?: "ok" | "warn" | "danger" | "info";
};

function DashListCard({
  title,
  items = [],
  empty = "Nothing in this tray yet.",
  onViewAll,
}: {
  title: string;
  items?: DashListItem[];
  empty?: string;
  onViewAll?: () => void;
}) {
  const navigate = useNavigate();

  return (
    <section className="panel-card dash-list-card">
      <header className="dash-list-card__head">
        <h2 className="panel-card__title">{title}</h2>
        {onViewAll ? (
          <button type="button" onClick={onViewAll} className="dash-list-card__view-all-btn">
            View all
            <MdKeyboardArrowRight />
          </button>
        ) : null}
      </header>
      {items.length === 0 ? (
        <p className="dash-list__empty">{empty}</p>
      ) : (
        <ul className="dash-list">
          {items.slice(0, 5).map((item) => {
            const Icon = item.iconTone ? TONE_ICONS[item.iconTone] : null;
            return (
              <li
                key={item.id}
                className={`dash-list__row${item.href ? " is-clickable" : ""}`}
                onClick={item.href ? () => navigate(item.href!) : undefined}
              >
                {Icon ? (
                  <span className={`dash-list__icon is-${item.iconTone}`}>
                    <Icon />
                  </span>
                ) : item.image ? (
                  <img src={item.image} alt="" className="dash-list__media" />
                ) : (
                  <span className="dash-list__media is-avatar" />
                )}
                <div className="dash-list__meta">
                  <strong className="dash-list__name">{item.name}</strong>
                  {item.email ? <span className="dash-list__subtitle">{item.email}</span> : null}
                </div>
                {item.badge ? (
                  <em className={`status-chip is-${item.badge}`}>{item.trailing}</em>
                ) : item.trailing !== undefined && item.trailing !== "" ? (
                  <em className="dash-list__trailing">{item.trailing}</em>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default memo(DashListCard);
