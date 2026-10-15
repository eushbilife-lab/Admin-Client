import healthPreferenceService from "services/healthPreference.service";
import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect, useMemo } from "react";
import { optionId, optionLabel } from "utils/selectOption.util";

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
      .map((item: any) => {
        const value = optionId(item);
        const label = optionLabel(item.label, item.name || "Food type");
        return value ? { value, label } : null;
      })
      .filter(Boolean) as { value: string; label: string }[];
  }, [foodConcerns]);

  const { ComboBoxProps, ...rest } = props;

  return (
    <ComboBoxRedux
      {...rest}
      options={options}
      ComboBoxProps={{
        multiple: true,
        disableCloseOnSelect: true,
        loading: Boolean(loading) && options.length === 0,
        ...(ComboBoxProps || {}),
        // Never let field config wipe loaded options
        options: undefined,
      }}
    />
  );
}
