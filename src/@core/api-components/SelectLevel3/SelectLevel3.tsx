import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import level3Service from "services/level3.service";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect, useRef } from "react";
import { change } from "redux-form";
import { level3Actions } from "redux/slices/level3";

function optionId(value: any): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value.value || value._id || null;
}

export default function SelectLevel3(props: any) {
  const dispatch = useAppDispatch();
  const formName = props.meta?.form as string | undefined;
  const cascadeParent = props.cascadeParent as string | undefined;
  const level3Options = useAppSelector((state) => state.level3?.level3Options);
  const parentValue = useAppSelector((state) =>
    cascadeParent && formName
      ? state.form?.[formName]?.values?.[cascadeParent]
      : null
  );
  const parentId = optionId(parentValue);
  const prevParentId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (cascadeParent && !parentId) {
      dispatch(level3Actions.setOptions({ levels3: [] }));
      return;
    }
    const payload: Record<string, string> = { status: "active" };
    if (parentId) payload.categoryID = parentId;
    level3Service.getOptions(payload, dispatch);
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
    dispatch(change(formName, props.input?.name || "level3_id", null));
    dispatch(change(formName, "level4_id", null));
    dispatch(change(formName, "HNSSProductCategory", null));
  }, [cascadeParent, formName, parentId, dispatch, props.input?.name]);

  return (
    <ComboBoxRedux
      {...props}
      options={level3Options}
      disabled={Boolean(cascadeParent) && !parentId}
    />
  );
}
