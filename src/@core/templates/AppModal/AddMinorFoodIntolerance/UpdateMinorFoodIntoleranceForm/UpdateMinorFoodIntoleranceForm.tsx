import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import { localizedData } from "utils/localizedData.util";

export default function UpdateMinorFoodIntoleranceForm() {
  const form = "AddMinorFoodIntoleranceForm";
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.modal.data);
  useEffect(() => {
    if (!data?.data || Object.keys(data?.data).length === 0) return;
    const { en, status, ar, majorFoodIntoleranceID } = data?.data;
    dispatch(
      change(form, "majorFoodIntoleranceID", {
        label: `${
          localizedData({
            en: majorFoodIntoleranceID?.en?.name,
            ar: majorFoodIntoleranceID?.ar?.name,
          }) || ""
        }`,
        value: majorFoodIntoleranceID?._id,
      })
    );
    dispatch(change(form, "status", status == "active" ? true : false));
    dispatch(change(form, "en.name", localizedData({ en: en?.name }) || ""));
  }, [data, dispatch]);

  return null;
}
