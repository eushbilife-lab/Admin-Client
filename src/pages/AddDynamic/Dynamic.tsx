import PageShell from "@core/templates/PageShell";
import Tabs from "@core/templates/Tabs";
import { useState } from "react";
import FOPLCertificates from "./FOPLCertificates";
import UOM from "./UOM";
import FoodType from "./FoodType";

export default function Dynamics() {
  const [tab, setTabs] = useState(0);

  return (
    <PageShell
      kicker="Science"
      title="Pack labels"
      subtitle="Front-of-pack certificates, food types, and units printed on the label."
    >
      <Tabs
        value={tab}
        onChange={(next) => setTabs(next)}
        tabs={[
          { label: "FOPL certificates", element: <FOPLCertificates type="product_certificate" /> },
          { label: "Food type", element: <FoodType type="food_concern" /> },
          { label: "UOM", element: <UOM type="uom" /> },
        ]}
      />
    </PageShell>
  );
}
