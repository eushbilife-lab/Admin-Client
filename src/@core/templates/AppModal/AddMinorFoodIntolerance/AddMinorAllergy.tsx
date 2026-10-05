import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ToasterService from "utils/toaster.util";
import AddMinorFoodIntoleranceForm from "./AddMinorFoodIntoleranceForm";
import UpdateMinorFoodIntoleranceForm from "./UpdateMinorFoodIntoleranceForm";
import foodIntoleranceService from "services/foodIntolerance.service";

export default function AddMinorFoodIntolerance() {
  const form = "AddMinorFoodIntoleranceForm";
  const { id } = useAppSelector((state) => state.modal.data);
  const dispatch = useAppDispatch();
  const {t}=useTranslation()

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
    data.majorFoodIntoleranceID=data?.majorFoodIntoleranceID?.value
    if (id) {
      foodIntoleranceService.updateMinor(id, data,dispatch);
    } else {
      foodIntoleranceService.createMinor(data,dispatch);
    }
  };

  return (
    <div>
      {/* {loading && <CircleLoader />} */}
      <h3>{!id ? t("Add Sub Category") : t("Update Sub Category")}</h3>
      <AddMinorFoodIntoleranceForm onSubmit={handleSubmit} />
      {id && <UpdateMinorFoodIntoleranceForm />}
    </div>
  );
}
