import healthPreferenceService from "services/healthPreference.service";
import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";

/** Controlled multi-select for product Food Type (healthPreference type=food_concern). */
export default function SelectFoodConcern(props: any) {
  const dispatch = useAppDispatch();
  const options = useAppSelector(
    (state) => state?.healthPreference?.food_concern?.hpOptions
  );
  const loading = useAppSelector(
    (state) => state?.healthPreference?.food_concern?.loading
  );

  useEffect(() => {
    healthPreferenceService.getOptions(
      { type: "food_concern", status: "active" },
      dispatch
    );
  }, [dispatch]);

  const list = Array.isArray(options) ? options : [];
  const { ComboBoxProps, ...rest } = props;

  return (
    <ComboBoxRedux
      {...rest}
      options={list}
      ComboBoxProps={{
        multiple: true,
        disableCloseOnSelect: true,
        loading: Boolean(loading) && list.length === 0,
        ...(ComboBoxProps || {}),
        options: undefined,
      }}
    />
  );
}
