import healthPreferenceService from "services/healthPreference.service";
import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";

/** Multi-select for activity levels (healthPreference type=exercise_level). */
export default function SelectExerciseLevel(props: any) {
  const dispatch = useAppDispatch();
  const options = useAppSelector(
    (state) => state?.healthPreference?.exercise_level?.hpOptions
  );
  const loading = useAppSelector(
    (state) => state?.healthPreference?.exercise_level?.loading
  );

  useEffect(() => {
    healthPreferenceService.getOptions(
      { type: "exercise_level", status: "active" },
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
