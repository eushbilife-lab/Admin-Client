import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import allergyService from "services/allergy.service";
import AddMinorAllergyForm from "./AddMinorAllergyForm";
import UpdateMinorAllergyForm from "./UpdateMinorAllergyForm";
import { useTranslation } from "react-i18next";
import ToasterService from "utils/toaster.util";

export default function AddMinorFoodIntolerance() {
  const form = "AddMinorAllergyForm";
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
    data.majorAllergyID=data?.majorAllergyID?.value
    if (id) {
      allergyService.updateMinor(id, data,dispatch);
    } else {
      allergyService.createMinor(data,dispatch);
    }
  };

  return (
    <div>
      {/* {loading && <CircleLoader />} */}
      <h3>{!id ? t("Add Sub Category") : t("Update Sub Category")}</h3>
      <AddMinorAllergyForm onSubmit={handleSubmit} />
      {id && <UpdateMinorAllergyForm />}
    </div>
  );
}
