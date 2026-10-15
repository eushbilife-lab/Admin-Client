import { useAppDispatch, useAppSelector } from "redux/hooks";
import { level3Actions } from "redux/slices/level3";
import Level3Service from "services/level3.service";
import { change } from "redux-form";
import { useEffect } from "react";
import { optionId, optionLabel } from "utils/selectOption.util";

export default function Level3FormUpdate({ id }: any) {
  const form = "Level3Form";
  const dispatch = useAppDispatch();
  const { level3 } = useAppSelector((state) => state.level3);

  useEffect(() => {
    Level3Service.get(id || "", dispatch);
    return () => {
      dispatch(level3Actions.setLevel3(null));
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (!level3) return;

    const { status, categoryID } = level3;
    const name = optionLabel(level3, "");

    dispatch(change(form, "en.name", name));
    dispatch(change(form, "status", status === "active"));

    const parentId = optionId(categoryID);
    if (parentId) {
      dispatch(
        change(form, "level2", {
          value: parentId,
          label: optionLabel(categoryID, ""),
        })
      );
    }
  }, [level3, dispatch]);

  return null;
}
