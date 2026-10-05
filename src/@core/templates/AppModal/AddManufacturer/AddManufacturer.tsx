import CircleLoader from "@core/basic-components/CircleLoader";
import UpdateManufacturerForm from "./UpdateManufacturerForm";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import AddManufacturerForm from "./AddManufacturerForm";
import dynamicService from "services/dynamic.service";
import { useEffect } from "react";
import { change } from "redux-form";

export default function AddManufacturer() {
  const form = "AddManufacturerForm";
  const { id, type } = useAppSelector((state) => state.modal.data);
  const { loading } = useAppSelector((state) => state.dynamic.manufacturer);
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
      <h3>{!id ? "Add Manufacturer" : "Update Manufacturer"}</h3>
      <AddManufacturerForm onSubmit={handleSubmit} />
      {id && <UpdateManufacturerForm />}
    </div>
  );
}
