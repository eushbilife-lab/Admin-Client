import PageShell from "@core/templates/PageShell";
import UOM from "pages/AddDynamic/UOM/UOM";

export default function Servings() {
  return (
    <PageShell
      kicker="Labels"
      title="Serving sizes"
      subtitle="Grams, millilitres, cups, and the units that convert per-serving facts into % daily value."
    >
      <UOM type="uom" />
    </PageShell>
  );
}
