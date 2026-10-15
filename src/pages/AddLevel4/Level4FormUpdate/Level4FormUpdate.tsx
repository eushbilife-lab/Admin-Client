import { useAppDispatch, useAppSelector } from "redux/hooks";
import { level4Actions } from "redux/slices/level4";
import Level4Service from "services/level4.service";
import { change } from "redux-form";
import { useEffect } from "react";
import { optionId, optionLabel } from "utils/selectOption.util";

export default function Level4FormUpdate({ id }: any) {
  const form = "Level4Form";
  const dispatch = useAppDispatch();
  const { level4 } = useAppSelector((state) => state.level4);

  useEffect(() => {
    Level4Service.get(id || "", dispatch);
    return () => {
      dispatch(level4Actions.setLevel4(null));
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (!level4) return;

    const { status, subCategoryID, HNSSProductCategoryID } = level4;
    dispatch(change(form, "en.name", optionLabel(level4, "")));
    dispatch(change(form, "status", status === "active"));

    const level3Id = optionId(subCategoryID);
    if (level3Id) {
      dispatch(
        change(form, "level3", {
          value: level3Id,
          label: optionLabel(subCategoryID, ""),
        })
      );
    }

    const hnssId = optionId(HNSSProductCategoryID);
    if (hnssId) {
      const name = optionLabel(HNSSProductCategoryID, "");
      const code = HNSSProductCategoryID?.code;
      dispatch(
        change(form, "HNSSProductCategoryID", {
          value: hnssId,
          label:
            code && name && !String(name).includes(String(code))
              ? `${code} — ${name}`
              : name,
          code,
        })
      );
    }
  }, [level4, dispatch]);

  return null;
}
