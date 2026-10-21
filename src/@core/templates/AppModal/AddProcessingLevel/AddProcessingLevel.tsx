import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";
import { change, initialize } from "redux-form";
import processingLevelService from "services/processingLevel.service";
import AddProcessingLevelForm from "./AddProcessingLevelForm";

export default function AddProcessingLevel() {
  const form = "AddProcessingLevelForm";
  const { id, data } = useAppSelector((state) => state.modal.data) || {};
  const loading = useAppSelector((state) => state.processingLevel.loading);
  const filters = useAppSelector((state) => state.processingLevel.filters);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id && data) {
      dispatch(
        initialize(form, {
          status: data.status !== "inactive",
          name: data.name || "",
          levelValue: data.levelValue ?? "",
          description: data.description || "",
        })
      );
    } else {
      dispatch(change(form, "status", true));
    }
  }, [id, data, dispatch]);

  const handleSubmit = (values: any) => {
    const payload = {
      name: String(values.name || "").trim(),
      levelValue: Number(values.levelValue),
      description: String(values.description || "").trim(),
      status: values.status === true || values.status === "active"
        ? "active"
        : "inactive",
    };
    if (id) processingLevelService.update(id, payload, filters, dispatch);
    else processingLevelService.create(payload, filters, dispatch);
  };

  return (
    <div>
      {loading && <CircleLoader />}
      <h3>{id ? "Update processing level" : "Add processing level"}</h3>
      <AddProcessingLevelForm onSubmit={handleSubmit} />
    </div>
  );
}
