import AddAttributeForm from "./AddAttributeForm/AddAttributeForm";
import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import UpdateAttributeForm from "./UpdateAttributeForm";
import dynamicService from "services/dynamic.service";
import { useEffect } from "react";
import { change } from "redux-form";

export default function AddAttribute() {
  const form = "AddAttributeForm";

  const { id, type } = useAppSelector((state) => state.modal.data);
  const { loading } = useAppSelector((state) => state.dynamic.attribute);
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
      <h3>{!id ? "Add Attribute" : "Update Attribute"}</h3>
      <AddAttributeForm onSubmit={handleSubmit} />
      {id && <UpdateAttributeForm />}
    </div>
  );
}
