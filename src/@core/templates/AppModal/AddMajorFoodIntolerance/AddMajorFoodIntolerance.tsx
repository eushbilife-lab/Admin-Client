import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import AddMajorFoodIntoleranceForm from "./AddMajorFoodIntoleranceForm";
import UpdateMajorFoodIntoleranceForm from "./UpdateMajorFoodIntoleranceForm";
import { useTranslation } from "react-i18next";
import ToasterService from "utils/toaster.util";
import foodIntoleranceService from "services/foodIntolerance.service";

export default function AddMajorFoodIntolerance() {
  const form = "AddMajorAllergy";
  const { id } = useAppSelector((state) => state.modal.data);
  const { loading } = useAppSelector((state) => state.foodIntolerance);
  const {t}=useTranslation()
  const dispatch = useAppDispatch();

  if (!id) {
    useEffect(() => {
      dispatch(change(form, "status", true));
    });
  }
  const handleSubmit = (values: any) => {
    const enName = values?.en?.name;
    if (!enName) {
     return  ToasterService.showError("Name is required");
    }
    values = { ...values, ar: { ...(values.ar || {}), name: enName } };
    let data = { ...values };
    data.status = data.status === true ? "active" : "inactive";
    if (id) {
      foodIntoleranceService.updateMajor(id, data,dispatch);
    } else {
      foodIntoleranceService.createMajor(data,dispatch);
    }
  };

  return (
    <div>
      {loading && <CircleLoader />}
      <h3>{!id ? t("Add Category") : t("Update Category")}</h3>
      <AddMajorFoodIntoleranceForm onSubmit={handleSubmit} />
      {id && <UpdateMajorFoodIntoleranceForm />}
    </div>
  );
}
