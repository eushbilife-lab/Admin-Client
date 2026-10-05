import CircleLoader from "@core/basic-components/CircleLoader";
import AddNutritionForm from "./AddNutritionForm";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import PageShell from "@core/templates/PageShell";
import nutritionService from "services/nutrition.service";

export default function Nutrition() {
  const { loading } = useAppSelector((state) => state.nutrition);
  const dispatch = useAppDispatch();

  const handleSubmit = async (values: any) => {
    const data = {
      nutritions: values?.map((item: any) => ({
        _id: item?._id || undefined,
        name: item?.name || "",
      })),
    };
    await nutritionService.update(data, dispatch);
  };

  return (
    <PageShell
      kicker="Science"
      title="Nutrients"
      subtitle="Vitamins, minerals, energy, and macros used on labels and daily values."
    >
      {loading && <CircleLoader />}
      {/* @ts-ignore */}
      <AddNutritionForm handleSubmit={handleSubmit} />
    </PageShell>
  );
}
