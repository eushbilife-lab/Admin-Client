import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import level2Service from "services/level2.service";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect, useRef } from "react";
import { change } from "redux-form";
import { mongoOptionId } from "utils/selectOption.util";
import { level2Actions } from "redux/slices/level2";

export default function SelectLevel2(props: any) {
  const dispatch = useAppDispatch();
  const formName = (props.meta?.form as string | undefined) || "AddProductForm";
  const cascadeParent = props.cascadeParent as string | undefined;
  const options = useAppSelector((state) => state?.level2?.level2Options) || [];
  const parentValue = useAppSelector((state) =>
    cascadeParent ? state.form?.[formName]?.values?.[cascadeParent] : null
  );
  const parentId = mongoOptionId(parentValue);
  const prevParentId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (cascadeParent && !parentId) {
      dispatch(level2Actions.setOptions({ levels2: [] }));
      return;
    }
    // Only filter by a real ObjectId — never send a label string to the API
    const payload: Record<string, string> = { status: "active" };
    if (parentId) payload.mainCategoryID = parentId;
    else if (cascadeParent) return;
    level2Service.getOptions(payload, dispatch);
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
