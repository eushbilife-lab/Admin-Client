import CircleLoader from "@core/basic-components/CircleLoader";
import UpdateManufacturerForm from "./UpdateManufacturerForm";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import AddManufacturerForm from "./AddManufacturerForm";
import dynamicService from "services/dynamic.service";
import { useEffect } from "react";
import { change, initialize } from "redux-form";
import { englishName } from "utils/localizedData.util";

export default function AddManufacturer() {
  const form = "AddManufacturerForm";
  const modalData = useAppSelector((state) => state.modal.data) || {};
  const { id, type = "manufacturer", selectIntoForm, selectField } = modalData;
  const { loading } = useAppSelector((state) => state.dynamic.manufacturer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id && modalData.data) {
      const row = modalData.data;
      dispatch(
        initialize(form, {
          status: row.status !== "inactive",
          "en.name": englishName(row) || row.name || "",
        })
      );
    } else {
      dispatch(initialize(form, { status: true, "en.name": "" }));
    }
  }, [id, modalData.data, dispatch]);

  const handleSubmit = async (values: any) => {
    const data = {
      ...values,
      type: type || "manufacturer",
      status: values.status === true || values.status === "active"
        ? "active"
        : "inactive",
    };
    const [success]: any = id
      ? await dynamicService.updateDynamic(id, data, dispatch)
      : await dynamicService.create(data, dispatch);

    const created = success?.data?.data?.dynamic || success?.data?.data?.dynamics;
    if (!id && created && selectIntoForm && selectField) {
      dispatch(
        change(selectIntoForm, selectField, {
          value: created._id,
          label: englishName(created) || created.name || values?.en?.name,
        })
      );
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {loading && <CircleLoader inline />}
      <h3>{id ? "Update manufacturer" : "Add manufacturer"}</h3>
      <p style={{ marginTop: 0, marginBottom: 16, color: "#667066", fontSize: 14 }}>
        New makers show up in Add Food immediately after you save.
      </p>
      <AddManufacturerForm onSubmit={handleSubmit} />
      {id ? <UpdateManufacturerForm /> : null}
    </div>
  );
}
