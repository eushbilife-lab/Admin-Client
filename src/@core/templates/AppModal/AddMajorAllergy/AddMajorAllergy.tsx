import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import allergyService from "services/allergy.service";
import { change } from "redux-form";
import { useEffect } from "react";
import AddMajorAllergyForm from "./AddMajorAllergyForm";
import UpdateMajorAllergyForm from "./UpdateMajorAllergyForm";
import { useTranslation } from "react-i18next";
import ToasterService from "utils/toaster.util";

export default function AddMajorAllergy() {
  const form = "AddMajorAllergy";
  const { id } = useAppSelector((state) => state.modal.data);
  const { loading } = useAppSelector((state) => state.allergy);
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
      allergyService.updateMajor(id, data,dispatch);
    } else {
      allergyService.createMajor(data,dispatch);
    }
  };

  return (
    <div>
      {loading && <CircleLoader />}
      <h3>{!id ? t("Add Category") : t("Update Category")}</h3>
      <AddMajorAllergyForm onSubmit={handleSubmit} />
      {id && <UpdateMajorAllergyForm />}
    </div>
  );
}
