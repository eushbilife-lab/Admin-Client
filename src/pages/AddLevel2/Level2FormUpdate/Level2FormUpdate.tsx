import { useAppDispatch, useAppSelector } from "redux/hooks";
import { level2Actions } from "redux/slices/level2";
import Level2Service from "services/level2.service";
import { change } from "redux-form";
import { useEffect } from "react";
import { optionId, optionLabel } from "utils/selectOption.util";

export default function Level2FormUpdate({ id }: any) {
  const form = "Level2Form";
  const dispatch = useAppDispatch();
  const { level2 } = useAppSelector((state) => state.level2);

  useEffect(() => {
    Level2Service.get(id || "", dispatch);
    return () => {
      dispatch(level2Actions.setLevel2(null));
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (!level2) return;

    const { status, mainCategoryID } = level2;
    const name = optionLabel(level2, "");

    dispatch(change(form, "en.name", name));
    dispatch(change(form, "status", status === "active"));

    const parentId = optionId(mainCategoryID);
    if (parentId) {
      dispatch(
        change(form, "level1", {
          value: parentId,
          label: optionLabel(mainCategoryID, ""),
        })
      );
    }
  }, [level2, dispatch]);

  return null;
}
