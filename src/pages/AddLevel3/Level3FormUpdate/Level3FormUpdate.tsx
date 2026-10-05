import { useAppDispatch, useAppSelector } from "redux/hooks";
import { level3Actions } from "redux/slices/level3";
import Level3Service from "services/level3.service";
import { change } from "redux-form";
import { useEffect } from "react";
import { localizedData } from "utils/localizedData.util";

export default function Level3FormUpdate({ id }: any) {
  const form = "Level3Form";
  const dispatch = useAppDispatch();
  const { level3 } = useAppSelector((state) => state.level3);

  useEffect(() => {
    Level3Service.get(id || "",dispatch);
    return () => {
      dispatch(level3Actions.setLevel3(null));
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (!level3) return;

    const { en,ar,status, categoryID } = level3;

    dispatch(change(form, "en.name", localizedData({en:en?.name}) || ""));
    dispatch(change(form, "status", status === "active" ? true : false));
    if (categoryID)
      dispatch(
        change(form, "level2", {
          value: categoryID?._id,
          label: `${localizedData({en:categoryID?.en?.name,ar:categoryID?.ar?.name}) || ""}`,
        })
      );
  }, [level3, dispatch]);

  return null;
}
