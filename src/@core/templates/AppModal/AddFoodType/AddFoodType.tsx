import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import healthPreferenceService from "services/healthPreference.service";
import AddFoodTypeForm from "./AddFoodTypeForm";
import UpdateFoodTypeForm from "./UpdateFoodTypeForm";
import ToasterService from "utils/toaster.util";

const TITLES: Record<string, [string, string]> = {
  food_concern: ["Add food type / interest", "Update food type / interest"],
  diet: ["Add diet", "Update diet"],
  target: ["Add goal", "Update goal"],
  exercise_level: ["Add activity level", "Update activity level"],
  health_issue: ["Add health issue", "Update health issue"],
  temporary_concerns: ["Add temporary concern", "Update temporary concern"],
};

export default function AddFoodType() {
  const form = "AddFoodTypeForm";
  const { id, type } = useAppSelector((state) => state.modal.data);
  const { loading } = useAppSelector((state) => {
    const bucket =
      type && type in state.healthPreference
        ? (state.healthPreference as any)[type]
        : null;
    return bucket || state.healthPreference.food_concern;
  });
  const dispatch = useAppDispatch();
  const heading = (TITLES[type] || TITLES.food_concern)[id ? 1 : 0];

  useEffect(() => {
    if (!id) dispatch(change(form, "status", true));
  }, [id, dispatch]);

  const handleSubmit = async (values: any) => {
    const name = String(values?.en?.name || values?.name || "").trim();
    if (!name) return ToasterService.showError("Name is required");

    const description = String(values?.description || "").trim();
    const data = {
      name,
      description,
      type,
      status: values.status === true ? "active" : "inactive",
      en: { ...(values.en || {}), name },
      ar: { ...(values.ar || {}), name },
    };

    if (id) {
      healthPreferenceService.update(id, data, dispatch);
    } else {
      healthPreferenceService.create(data, dispatch);
    }
  };

  return (
    <div>
      {loading && <CircleLoader />}
      <h3 style={{ margin: "0 0 0.35rem", fontSize: "1.15rem" }}>{heading}</h3>
      <AddFoodTypeForm onSubmit={handleSubmit} />
      {id && <UpdateFoodTypeForm />}
    </div>
  );
}
