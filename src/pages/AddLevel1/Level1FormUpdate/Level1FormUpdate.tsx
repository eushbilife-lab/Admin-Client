import { useAppDispatch, useAppSelector } from "redux/hooks";
import { level1Actions } from "redux/slices/level1";
import Level1Service from "services/level1.service";
import { change } from "redux-form";
import { useEffect } from "react";
import { localizedData } from "utils/localizedData.util";

export default function Level1FormUpdate({ id }: any) {
  const form = "Level1Form";
  const dispatch = useAppDispatch();
  
  const { level1 } = useAppSelector((state) => state.level1);

  useEffect(() => {
    Level1Service.get(id || "",dispatch);
    return () => {
      dispatch(level1Actions.setLevel1(null));
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (!level1) return;

    const { en,ar, status } = level1;
    dispatch(change(form, "en.name", localizedData({en:en?.name}) || ""));
    dispatch(change(form, "status", status == "active" ? true : false));
  }, [level1, dispatch]);

  return null;
}
