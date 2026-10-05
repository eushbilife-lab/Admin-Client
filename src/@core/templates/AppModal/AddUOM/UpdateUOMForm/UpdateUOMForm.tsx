import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import { localizedData } from "utils/localizedData.util";

export default function UpdateUOMForm() {
  const form = "AddUOMForm";
  const dispatch = useAppDispatch();
  const data=useAppSelector((state)=>state.modal.data);
  useEffect(() => {
    if (!data?.data || Object.keys(data?.data).length === 0) return;
    const { en, status, ar,sign } = data?.data;
    dispatch(change(form, "status", status == "active" ? true : false));
    dispatch(change(form, "sign", sign || ""));
    dispatch(change(form, "en.name", localizedData({ en: en?.name }) || ""));
  }, [data, dispatch]);

  return null;
}
