import PreferenceTable from "pages/Lifestyle/PreferenceTable";

/** Food type on pack labels — same catalog as Lifestyle → Food Interest. */
export default function FoodType({ type }: { type: any }) {
  return (
    <PreferenceTable
      type={type || "food_concern"}
      addLabel="Add food type"
      emptyMessage="No food types yet."
      blurb="Food types tag products (high protein, organic, low sugar, and more) on Add Food and profiles."
    />
  );
}
