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
    blurb:
      "How active a member is day to day (sedentary → athlete). Used to set calorie burn and plan intensity.",
  },
  {
    path: "/goals",
    type: "target",
    label: "Goal",
    addLabel: "Add goal",
    emptyMessage: "No goals yet.",
    blurb:
      "What the member wants to achieve — lose, maintain, or gain. Drives calorie and macro targets.",
  },
  {
    path: "/food-interest",
    type: "food_concern",
    label: "Food Interest",
    addLabel: "Add food interest",
    emptyMessage: "No food interests yet.",
    blurb:
      "Food preferences and product tags such as high protein, organic, or low sugar. Shared with Food type on pack labels.",
  },
  {
    path: "/diets",
    type: "diet",
    label: "Diet",
    addLabel: "Add diet",
    emptyMessage: "No diets yet.",
    blurb:
      "Long-term eating patterns (vegan, keto, Mediterranean, and more) used on profiles and meal guidance.",
  },
  {
    path: "/temporary-concerns",
    type: "temporary_concerns",
    label: "Temporary concern",
    addLabel: "Add temporary concern",
    emptyMessage: "No temporary concerns yet.",
    blurb:
      "Short-term states like pregnancy, fasting, or recovery that temporarily change advice.",
  },
  {
    path: "/health-issues",
    type: "health_issue",
    label: "Health issue",
    addLabel: "Add health issue",
    emptyMessage: "No health issues yet.",
    blurb:
      "Ongoing conditions (diabetes, hypertension, etc.) that inform safer food recommendations.",
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
                blurb={section.blurb}
              />
            ) : (
              <></>
            ),
        }))}
      />
    </PageShell>
  );
}
