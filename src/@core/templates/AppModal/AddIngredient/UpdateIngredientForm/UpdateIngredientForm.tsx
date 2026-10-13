import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";

export default function UpdateIngredientForm() {
  const form = "AddIngredientForm";
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.modal.data);

  useEffect(() => {
    if (!data?.data || Object.keys(data.data).length === 0) return;
    const { en, name, status, code, content } = data.data;
    dispatch(change(form, "status", status === "active"));
    dispatch(change(form, "en.name", name || en?.name || ""));
    dispatch(change(form, "code", code || ""));
    dispatch(change(form, "content", content || ""));
  }, [data, dispatch]);

  return null;
}
