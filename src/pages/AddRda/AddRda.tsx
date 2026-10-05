import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import PageShell from "@core/templates/PageShell";
import rdaService from "services/rda.service";
import AddRdaForm from "./AddRdaForm";
import AddRdaFormUpdate from "./AddRdaFormUpdate";
import { useEffect } from "react";
import nutritionService from "services/nutrition.service";
import { nutritionActions } from "redux/slices/nutrition";

export default function AddRda() {
  const { loading } = useAppSelector((state) => state.rda);
  const { nutritions } = useAppSelector((state) => state.nutrition);
  const dispatch = useAppDispatch();

  useEffect(() => {
    nutritionService.getAll(dispatch);
    return () => {
      dispatch(nutritionActions.setNutrition(null));
    };
  }, [dispatch]);

  const handleSubmit = async (values: any) => {
    const data = values?.rda?.map((item: any) => {
      const existingItem = nutritions.find(
        (nuti: any) => nuti.value === item.nutrition_id.value
      );
      return {
        _id: existingItem?._id || item?._id,
        nutrition_id: item?.nutrition_id?.value,
        uom: item?.uom,
        dailyValue: item?.dailyValue,
      };
    });
    await rdaService.update({ rda: data }, dispatch);
  };

  return (
    <PageShell
      kicker="Science"
      title="Daily values"
      subtitle="RDA and units for each nutrient on the nutrition facts panel."
    >
      {loading && <CircleLoader />}
      <AddRdaForm onSubmit={handleSubmit} />
      <AddRdaFormUpdate />
    </PageShell>
  );
}
