import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import healthPreferenceService from "services/healthPreference.service";
import AddFoodTypeForm from "./AddFoodTypeForm";
import UpdateFoodTypeForm from "./UpdateFoodTypeForm";
import ToasterService from "utils/toaster.util";

export default function AddFoodType() {
  const form = "AddFoodTypeForm";
  const { id, type } = useAppSelector((state) => state.modal.data);
  const { loading } = useAppSelector((state) => {
    const bucket = type && type in state.healthPreference ? (state.healthPreference as any)[type] : null;
    return bucket || state.healthPreference.food_concern;
  });
  const dispatch = useAppDispatch();
  const titles: Record<string, [string, string]> = {
    food_concern: ["Add food interest", "Update food interest"],
    diet: ["Add diet", "Update diet"],
    target: ["Add goal", "Update goal"],
    exercise_level: ["Add activity level", "Update activity level"],
    health_issue: ["Add health issue", "Update health issue"],
    temporary_concerns: ["Add temporary concern", "Update temporary concern"],
  };
  const heading = (titles[type] || titles.food_concern)[id ? 1 : 0];

  useEffect(() => {
    if (!id) dispatch(change(form, "status", true));
  }, [id, dispatch]);
  const handleSubmit = async (values: any) => {
    const enName = values?.en?.name;
    if (!enName) {
     return  ToasterService.showError("Name is required");
    }
    values = { ...values, ar: { ...(values.ar || {}), name: enName } };
    let data = { ...values, type };
    data.status = data.status === true ? "active" : "inactive";
    if (id) {
      healthPreferenceService.update(id, data, dispatch);
    } else {
      healthPreferenceService.create(data, dispatch);
    }
  };

  return (
    <div>
      {loading && <CircleLoader />}
      <h3>{heading}</h3>
      <AddFoodTypeForm onSubmit={handleSubmit} />
      {id && <UpdateFoodTypeForm />}
    </div>
  );
}
