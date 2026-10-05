import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import dynamicService from "services/dynamic.service";
import UpdateBrandForm from "./UpdateBrandForm";
import AddBrandForm from "./AddBrandForm";
import { useEffect } from "react";
import { change } from "redux-form";

export default function Brand() {
  const form = "AddBrandForm";

  const { id, type } = useAppSelector((state) => state.modal.data);
  const { loading } = useAppSelector((state) => state.dynamic.brand);
  const dispatch = useAppDispatch();

  if (!id) {
    useEffect(() => {
      dispatch(change(form, "status", true));
    });
  }
  const handleSubmit = (values: any) => {
    let data = { ...values, type };
    data.status = data.status === true ? "active" : "inactive";
    if (id) dynamicService.updateDynamic(id, data,dispatch);
    else dynamicService.create(data,dispatch);
  };

  return (
    <div>
      {loading && <CircleLoader />}
      <h3>{!id ? "Add Brand" : "Update Brand"}</h3>
      <AddBrandForm onSubmit={handleSubmit} />
      {id && <UpdateBrandForm />}
    </div>
  );
}
