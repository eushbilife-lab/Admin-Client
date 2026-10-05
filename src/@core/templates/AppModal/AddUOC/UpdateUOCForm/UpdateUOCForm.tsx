import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";

export default function UpdateUOCForm() {
  const form = "AddUOCForm";
  const dispatch = useAppDispatch();
  const data=useAppSelector((state)=>state.modal.data);
  useEffect(() => {
    if (!data?.data || Object.keys(data?.data).length === 0) return;
    const { en, status, ar } = data?.data;
    dispatch(change(form, "status", status == "active" ? true : false));
    dispatch(change(form, "en.name", en?.name || ""));
  }, [data, dispatch]);

  return null;
}
