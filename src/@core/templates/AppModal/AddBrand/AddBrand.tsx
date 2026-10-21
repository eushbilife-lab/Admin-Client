import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import dynamicService from "services/dynamic.service";
import UpdateBrandForm from "./UpdateBrandForm";
import AddBrandForm from "./AddBrandForm";
import { useEffect } from "react";
import { change, initialize } from "redux-form";
import { englishName } from "utils/localizedData.util";

export default function Brand() {
  const form = "AddBrandForm";
  const modalData = useAppSelector((state) => state.modal.data) || {};
  const { id, type = "brand", selectIntoForm, selectField } = modalData;
  const { loading } = useAppSelector((state) => state.dynamic.brand);
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
      type: type || "brand",
      status: values.status === true || values.status === "active"
        ? "active"
        : "inactive",
    };
    const [success]: any = id
      ? await dynamicService.updateDynamic(id, data, dispatch)
      : await dynamicService.create(data, dispatch);

    const created = success?.data?.data?.dynamic || success?.data?.data?.dynamics;
    if (
      !id &&
      created &&
      selectIntoForm &&
      selectField
    ) {
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
      <h3>{id ? "Update brand" : "Add brand"}</h3>
      <p style={{ marginTop: 0, marginBottom: 16, color: "#667066", fontSize: 14 }}>
        New brands show up in Add Food immediately after you save.
      </p>
      <AddBrandForm onSubmit={handleSubmit} />
      {id ? <UpdateBrandForm /> : null}
    </div>
  );
}
