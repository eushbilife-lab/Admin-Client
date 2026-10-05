import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";

export default function UpdateIngredientForm() {
  const form = "AddIngredientForm";
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.modal.data);

  useEffect(() => {
    if (!data?.data || Object.keys(data.data).length === 0) return;
    const { en, status } = data.data;
    dispatch(change(form, "status", status === "active"));
    dispatch(change(form, "en.name", en?.name || ""));
  }, [data, dispatch]);

  return null;
}
