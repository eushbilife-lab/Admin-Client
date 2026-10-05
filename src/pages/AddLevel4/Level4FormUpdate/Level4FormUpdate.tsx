import { useAppDispatch, useAppSelector } from "redux/hooks";
import { level4Actions } from "redux/slices/level4";
import Level4Service from "services/level4.service";
import { change } from "redux-form";
import { useEffect } from "react";
import { localizedData } from "utils/localizedData.util";

export default function Level4FormUpdate({ id }: any) {
  const form = "Level4Form";
  const dispatch = useAppDispatch();
  const { level4 } = useAppSelector((state) => state.level4);

  useEffect(() => {
    Level4Service.get(id || "",dispatch);
    return () => {
      dispatch(level4Actions.setLevel4(null));
    };
  }, [id, dispatch]);
  useEffect(() => {
    if (!level4) return;
    const { en, status, subCategoryID, HNSSProductCategoryID } = level4;
    dispatch(change(form, "en.name", localizedData({en:en?.name}) || ""));
    dispatch(change(form, "status", status === "active" ? true : false));
    if (subCategoryID)
      dispatch(
        change(form, "level3", {
          value: subCategoryID._id,
          label: `${localizedData({en:subCategoryID?.en?.name,ar:subCategoryID?.ar?.name}) || ""}`,
        })
      );
      if (HNSSProductCategoryID)
        dispatch(
          change(form, "HNSSProductCategoryID", {
            value: HNSSProductCategoryID._id,
            label: `${localizedData({en:HNSSProductCategoryID?.en?.name,ar:HNSSProductCategoryID?.ar?.name}) || ""}`,
          })
        );
  }, [level4, dispatch]);

  return null;
}
