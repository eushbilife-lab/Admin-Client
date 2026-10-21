import AddNutritionForm from "./AddNutritionForm";
import { useAppDispatch } from "redux/hooks";
import PageShell from "@core/templates/PageShell";
import nutritionService from "services/nutrition.service";
import "./Nutrition.css";

export default function Nutrition() {
  const dispatch = useAppDispatch();

  const handleSubmit = async (values: any[]) => {
    const data = {
      nutritions: (values || [])
        .map((item: any) => ({
          _id: item?._id || undefined,
          name: String(item?.name || "").trim(),
        }))
        .filter((item: { name: string }) => item.name),
    };
    await nutritionService.update(data, dispatch);
  };

  return (
    <PageShell
      kicker="Science"
      title="Nutrients"
      subtitle="Vitamins, minerals, energy, and macros used on labels, RDAs, and health scores."
    >
      <AddNutritionForm onSubmit={handleSubmit} />
    </PageShell>
  );
}
