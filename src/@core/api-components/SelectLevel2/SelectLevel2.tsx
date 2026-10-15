import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import level2Service from "services/level2.service";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect, useMemo, useRef } from "react";
import { change } from "redux-form";
import { optionId, parentRefId } from "utils/selectOption.util";

export default function SelectLevel2(props: any) {
  const dispatch = useAppDispatch();
  const formName = props.meta?.form as string | undefined;
  const cascadeParent = props.cascadeParent as string | undefined;
  const allOptions = useAppSelector((state) => state?.level2?.level2Options) || [];
  const parentValue = useAppSelector((state) =>
    cascadeParent && formName
      ? state.form?.[formName]?.values?.[cascadeParent]
      : null
  );
  const parentId = optionId(parentValue);
  const prevParentId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    level2Service.getOptions({ status: "active" }, dispatch);
  }, [dispatch]);

  const options = useMemo(() => {
    if (!cascadeParent) return allOptions;
    if (!parentId) return [];
    return allOptions.filter(
      (item: any) => parentRefId(item.mainCategoryID) === parentId
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
    dispatch(change(formName, props.input?.name || "level2_id", null));
    dispatch(change(formName, "level3_id", null));
    dispatch(change(formName, "level4_id", null));
    dispatch(change(formName, "HNSSProductCategory", null));
  }, [cascadeParent, formName, parentId, dispatch, props.input?.name]);

  return (
    <ComboBoxRedux
      {...props}
      options={options}
      disabled={Boolean(cascadeParent) && !parentId}
    />
  );
}
