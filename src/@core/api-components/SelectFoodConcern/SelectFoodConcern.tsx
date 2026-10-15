import healthPreferenceService from "services/healthPreference.service";
import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect, useMemo } from "react";

/** Controlled multi-select for product Food Type (healthPreference type=food_concern). */
export default function SelectFoodConcern(props: any) {
  const dispatch = useAppDispatch();
  const foodConcerns = useAppSelector(
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

  const options = useMemo(() => {
    const list = Array.isArray(foodConcerns) ? foodConcerns : [];
    return list
      .map((item: any) => ({
        value: item.value || item._id,
        label:
          (typeof item.label === "string" && item.label) ||
          item.label?.en?.name ||
          item.name ||
          item.en?.name ||
          "",
      }))
      .filter((item: any) => item.value && item.label);
  }, [foodConcerns]);

  return (
    <ComboBoxRedux
      {...props}
      options={options}
      ComboBoxProps={{
        multiple: true,
        disableCloseOnSelect: true,
        loading: Boolean(loading) && options.length === 0,
        ...(props.ComboBoxProps || {}),
      }}
    />
  );
}
