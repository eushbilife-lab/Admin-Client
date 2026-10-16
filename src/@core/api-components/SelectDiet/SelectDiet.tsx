import healthPreferenceService from "services/healthPreference.service";
import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import ComboBox from "@core/basic-components/ComboBox";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";

type Props = {
  value?: any;
  onChange?: (value: any) => void;
  label?: string;
  multiple?: boolean;
  /** When true, uses redux-form ComboBoxRedux (needs `input` from Field). */
  redux?: boolean;
  [key: string]: any;
};

/** Multi-select for diets (healthPreference type=diet). */
export default function SelectDiet({
  value,
  onChange,
  label = "Diets",
  multiple = true,
  redux,
  ...rest
}: Props) {
  const dispatch = useAppDispatch();
  const options = useAppSelector(
    (state) => state?.healthPreference?.diet?.hpOptions
  );
  const loading = useAppSelector(
    (state) => state?.healthPreference?.diet?.loading
  );
  const list = Array.isArray(options) ? options : [];

  useEffect(() => {
    healthPreferenceService.getOptions(
      { type: "diet", status: "active" },
      dispatch
    );
  }, [dispatch]);

  if (redux) {
    return (
      <ComboBoxRedux
        {...rest}
        label={label}
        options={list}
        ComboBoxProps={{
          multiple,
          disableCloseOnSelect: multiple,
          loading: Boolean(loading) && list.length === 0,
          ...(rest.ComboBoxProps || {}),
          options: undefined,
        }}
      />
    );
  }

  return (
    <ComboBox
      options={list}
      value={value ?? (multiple ? [] : null)}
      onChange={(_e: any, next: any) => onChange?.(next)}
      multiple={multiple}
      disableCloseOnSelect={multiple}
      loading={Boolean(loading) && list.length === 0}
      InputProps={{ label }}
    />
  );
}
