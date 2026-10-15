import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import level4Service from "services/level4.service";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect, useRef } from "react";
import { change } from "redux-form";
import { level4Actions } from "redux/slices/level4";

function optionId(value: any): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value.value || value._id || null;
}

function hnssOption(raw: any) {
  if (!raw) return null;
  const id = raw._id || raw.value;
  if (!id) return null;
  const label =
    raw.en?.name ||
    raw.label?.en?.name ||
    (typeof raw.label === "string" ? raw.label : null) ||
    raw.code ||
    "";
  return { value: id, label, code: raw.code };
}

export default function SelectLevel4(props: any) {
  const dispatch = useAppDispatch();
  const formName = props.meta?.form as string | undefined;
  const cascadeParent = props.cascadeParent as string | undefined;
  const level4Options = useAppSelector((state) => state.level4?.level4Options);
  const parentValue = useAppSelector((state) =>
    cascadeParent && formName
      ? state.form?.[formName]?.values?.[cascadeParent]
      : null
  );
  const parentId = optionId(parentValue);
  const prevParentId = useRef<string | null | undefined>(undefined);
  const selectedLevel4 = props.input?.value;
  const prevLevel4Id = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (cascadeParent && !parentId) {
      dispatch(level4Actions.setOptions({ levels4: [] }));
      return;
    }
    const payload: Record<string, string> = { status: "active" };
    if (parentId) payload.subCategoryID = parentId;
    level4Service.getOptions(payload, dispatch);
  }, [dispatch, cascadeParent, parentId]);

  useEffect(() => {
    if (!cascadeParent || !formName) return;
    if (prevParentId.current === undefined) {
      prevParentId.current = parentId;
      return;
    }
    if (prevParentId.current === parentId) return;
    const hadParent = Boolean(prevParentId.current);
    prevParentId.current = parentId;
    if (!hadParent) return;
    dispatch(change(formName, props.input?.name || "level4_id", null));
    dispatch(change(formName, "HNSSProductCategory", null));
  }, [cascadeParent, formName, parentId, dispatch, props.input?.name]);

  // Auto-fill HSN / ENLI when user picks/changes L4 (skip initial mount so edit hydrate keeps saved HSN)
  useEffect(() => {
    if (!formName) return;
    const level4Id = optionId(selectedLevel4);
    if (prevLevel4Id.current === undefined) {
      prevLevel4Id.current = level4Id;
      return;
    }
    if (prevLevel4Id.current === level4Id) return;
    prevLevel4Id.current = level4Id;

    if (!level4Id) {
      dispatch(change(formName, "HNSSProductCategory", null));
      return;
    }

    const match =
      level4Options?.find((item: any) => item.value === level4Id) ||
      selectedLevel4;
    const hnss = hnssOption(
      match?.HNSSProductCategoryID || selectedLevel4?.HNSSProductCategoryID
    );
    if (hnss) dispatch(change(formName, "HNSSProductCategory", hnss));
  }, [selectedLevel4, level4Options, formName, dispatch]);

  return (
    <ComboBoxRedux
      {...props}
      options={level4Options}
      disabled={Boolean(cascadeParent) && !parentId}
    />
  );
}
