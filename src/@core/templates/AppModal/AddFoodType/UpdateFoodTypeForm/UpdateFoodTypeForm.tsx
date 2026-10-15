import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import { optionLabel } from "utils/selectOption.util";

export default function UpdateFoodTypeForm() {
  const form = "AddFoodTypeForm";
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.modal.data);

  useEffect(() => {
    const row = data?.data;
    if (!row || Object.keys(row).length === 0) return;

    dispatch(change(form, "status", row.status === "active"));
    dispatch(change(form, "en.name", optionLabel(row, "")));
    dispatch(
      change(
        form,
        "description",
        row.description || row.en?.description || row.ar?.description || ""
      )
    );
  }, [data, dispatch]);

  return null;
}
