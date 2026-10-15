import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import level4Service from "services/level4.service";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect, useMemo, useRef } from "react";
import { change } from "redux-form";
import { optionId, optionLabel, parentRefId } from "utils/selectOption.util";

function hnssOption(raw: any) {
  if (!raw) return null;
  const id = optionId(raw);
  if (!id) return null;
  const label = optionLabel(raw.en ? raw : raw.label, raw.code || "");
  return {
    value: id,
    label: raw.code ? `${raw.code} — ${label}` : label,
    code: raw.code,
  };
}

export default function SelectLevel4(props: any) {
  const dispatch = useAppDispatch();
  const formName = props.meta?.form as string | undefined;
  const cascadeParent = props.cascadeParent as string | undefined;
  const allOptions = useAppSelector((state) => state.level4?.level4Options) || [];
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
    level4Service.getOptions({ status: "active" }, dispatch);
  }, [dispatch]);

  const options = useMemo(() => {
    if (!cascadeParent) return allOptions;
    if (!parentId) return [];
    return allOptions.filter(
      (item: any) => parentRefId(item.subCategoryID) === parentId
    );
  }, [allOptions, cascadeParent, parentId]);

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
      options.find((item: any) => optionId(item) === level4Id) ||
      allOptions.find((item: any) => optionId(item) === level4Id) ||
      selectedLevel4;
    const hnss = hnssOption(
      match?.HNSSProductCategoryID || selectedLevel4?.HNSSProductCategoryID
    );
    if (hnss) dispatch(change(formName, "HNSSProductCategory", hnss));
  }, [selectedLevel4, options, allOptions, formName, dispatch]);

  return (
    <ComboBoxRedux
      {...props}
      options={options}
      disabled={Boolean(cascadeParent) && !parentId}
    />
  );
}
