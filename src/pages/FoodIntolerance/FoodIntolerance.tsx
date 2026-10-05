import PageShell from "@core/templates/PageShell";
import Tabs from "@core/templates/Tabs";
import { useState } from "react";
import MajorFoodIntolerance from "./MajorFoodIntolerance";
import MinorFoodIntolerance from "./MinorFoodIntolerance";

export default function FoodIntolerance() {
  const [tab, setTabs] = useState(0);

  return (
    <PageShell
      kicker="Safety"
      title="Intolerance"
      subtitle="Intolerance groups and the ingredients mapped to each one."
    >
      <Tabs
        value={tab}
        onChange={(next) => setTabs(next)}
        tabs={[
          { label: "Categories", element: <MajorFoodIntolerance /> },
          { label: "Subcategories", element: <MinorFoodIntolerance /> },
        ]}
      />
    </PageShell>
  );
}
