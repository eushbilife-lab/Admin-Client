import { useAppDispatch, useAppSelector } from "redux/hooks";
import { level2Actions } from "redux/slices/level2";
import Level2Service from "services/level2.service";
import { change } from "redux-form";
import { useEffect } from "react";
import { localizedData } from "utils/localizedData.util";

export default function Level2FormUpdate({ id }: any) {
  const form = "Level2Form";
  const dispatch = useAppDispatch();

  const { level2 } = useAppSelector((state) => state.level2);

  useEffect(() => {
    Level2Service.get(id || "",dispatch);
    return () => {
      dispatch(level2Actions.setLevel2(null));
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (!level2) return;

    const { en,ar, status, mainCategoryID } = level2;

    dispatch(change(form, "en.name", localizedData({en:en?.name}) || ""));
    dispatch(change(form, "status", status === "active" ? true : false));
    if (mainCategoryID)
      dispatch(
        change(form, "level1", {
          value: mainCategoryID?._id,
          label: `${localizedData({en:mainCategoryID?.en?.name,ar:mainCategoryID?.ar?.name}) || ""}`,
        })
      );
  }, [level2, dispatch]);

  return null;
}
