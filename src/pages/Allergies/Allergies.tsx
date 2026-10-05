import PageShell from "@core/templates/PageShell";
import Tabs from "@core/templates/Tabs";
import { useState } from "react";
import MajorAllergy from "./MajorAllergy";
import MinorAllergy from "./MinorAllergy";

export default function Allergies() {
  const [tab, setTabs] = useState(0);

  return (
    <PageShell
      kicker="Safety"
      title="Allergens"
      subtitle="Major allergen groups and the foods mapped under each one."
    >
      <Tabs
        value={tab}
        onChange={(next) => setTabs(next)}
        tabs={[
          { label: "Categories", element: <MajorAllergy /> },
          { label: "Subcategories", element: <MinorAllergy /> },
        ]}
      />
    </PageShell>
  );
}
