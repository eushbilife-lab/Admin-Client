import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";

export default function UpdateManufacturerForm() {
  const form = "AddManufacturerForm";
  const dispatch = useAppDispatch();

  // Get dynamic from the Redux store
  const data=useAppSelector((state)=>state.modal.data);

  useEffect(() => {
    if (!data?.data || Object.keys(data?.data).length === 0) return;
    const { en, status, ar } = data?.data;
    dispatch(change(form, "status", status == "active" ? true : false));
    dispatch(change(form, "en.name", en?.name || ""));
  }, [data, dispatch]);

  return null;
}
