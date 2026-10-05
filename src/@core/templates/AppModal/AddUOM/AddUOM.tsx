import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import AddUOCForm from "./AddUOMForm";
import UpdateUOCForm from "./UpdateUOMForm";
import MeasurementScaleService from "services/measurementScale.service";
import { useTranslation } from "react-i18next";
import ToasterService from "utils/toaster.util";

export default function AddUOM() {
  const form = "AddUOMForm";
  const { id, type } = useAppSelector((state) => state.modal.data);
  const { loading } = useAppSelector((state) => state.measurementScale.uom);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  if (!id) {
    useEffect(() => {
      dispatch(change(form, "status", true));
    });
  }
  const handleSubmit = async (values: any) => {
    const enName = values?.en?.name;
    if (!enName) {
     return  ToasterService.showError("Name is required");
    }
    values = { ...values, ar: { ...(values.ar || {}), name: enName } };
    let data = { ...values, type };
    data.status = data.status === true ? "active" : "inactive";
    if (id) {
      MeasurementScaleService.update(id, data, dispatch);
    } else {
      MeasurementScaleService.create(data, dispatch);
    }
  };

  return (
    <div>
      {loading && <CircleLoader />}
      <h3>{!id ? t("Add UOM") : t("Update UOM")}</h3>
      <AddUOCForm onSubmit={handleSubmit} />
      {id && <UpdateUOCForm />}
    </div>
  );
}
