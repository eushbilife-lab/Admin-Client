import { useLocation, useNavigate } from "react-router-dom";
import PageShell from "@core/templates/PageShell";
import Tabs from "@core/templates/Tabs";
import PreferenceTable from "./PreferenceTable";
import type { healthPrefernceType } from "redux/slices/healthPrefernce";

const SECTIONS: {
  path: string;
  type: healthPrefernceType;
  label: string;
  addLabel: string;
  emptyMessage: string;
  blurb: string;
}[] = [
  {
    path: "/activity-level",
    type: "exercise_level",
    label: "Activity level",
    addLabel: "Add activity level",
    emptyMessage: "No activity levels yet.",
    blurb: "Sedentary to athlete — used on user profiles.",
  },
  {
    path: "/goals",
    type: "target",
    label: "Goal",
    addLabel: "Add goal",
    emptyMessage: "No goals yet.",
    blurb: "Lose, maintain, or gain weight.",
  },
  {
    path: "/food-interest",
    type: "food_concern",
    label: "Food Interest",
    addLabel: "Add food interest",
    emptyMessage: "No food interests yet.",
    blurb: "Organic, high protein, low sugar, and similar interests.",
  },
  {
    path: "/diets",
    type: "diet",
    label: "Diet",
    addLabel: "Add diet",
    emptyMessage: "No diets yet.",
    blurb: "Vegan, keto, Mediterranean, and other diet types.",
  },
  {
    path: "/temporary-concerns",
    type: "temporary_concerns",
    label: "Temporary concern",
    addLabel: "Add temporary concern",
    emptyMessage: "No temporary concerns yet.",
    blurb: "Pregnancy, fasting, rehab, and other short-term states.",
  },
];

export default function Lifestyle() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tab = Math.max(
    0,
    SECTIONS.findIndex((section) => section.path === pathname)
  );
  const active = SECTIONS[tab] || SECTIONS[0];

  return (
    <PageShell
      kicker="Profile catalogs"
      title={active.label}
      subtitle={active.blurb}
    >
      <Tabs
        value={tab}
        onChange={(next) => navigate(SECTIONS[next].path)}
        tabs={SECTIONS.map((section, index) => ({
          label: section.label,
          element:
            tab === index ? (
              <PreferenceTable
                key={section.type}
                type={section.type}
                addLabel={section.addLabel}
                emptyMessage={section.emptyMessage}
              />
            ) : (
              <></>
            ),
        }))}
      />
    </PageShell>
  );
}
