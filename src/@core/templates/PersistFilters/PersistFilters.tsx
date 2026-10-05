import { useEffect } from "react";
import { change } from "redux-form";
import { PersistFiltersProps } from ".";
import useEffectOnce from "hooks/useEffectOnce";

import { useAppDispatch, useAppSelector } from "redux/hooks";
import { level1Actions } from "redux/slices/level1";
import { level2Actions } from "redux/slices/level2";
import { level3Actions } from "redux/slices/level3";
import { level4Actions } from "redux/slices/level4";
import { contactActions } from "redux/slices/contact";

export default function PersistFilters({ form,type = "open"}: PersistFiltersProps) {
  const dispatch = useAppDispatch();
  const formValues = useAppSelector((state) => state.form?.[form]?.values);
  const level1_current_filters = useAppSelector((state) => state.level1.current_filters);
  const level2_current_filters = useAppSelector((state) => state.level2.current_filters);
  const level3_current_filters = useAppSelector((state) => state.level3.current_filters);
  const level4_current_filters = useAppSelector((state) => state.level4.current_filters);
  const contact_current_filters = useAppSelector((state) => state.contact[type].current_filters);



  useEffectOnce(() => {
    let obj: any = {};

    if (form === "level1FiltersForm") obj = level1_current_filters;
    else if (form === "level2FiltersForm")
      obj = level2_current_filters;
    else if (form === "level3FiltersForm")
      obj = level3_current_filters;
    else if (form === "level4FiltersForm")
      obj = level4_current_filters;
    else if (form === "ContactFiltersForm") obj = contact_current_filters;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const element = obj[key];
        dispatch(change(form, key, element));
      }
    }
  });

  useEffect(() => {
    if (!formValues) return;

    if (form === "level1FiltersForm")
      dispatch(level1Actions.setCurrentFilters(formValues));
    else if (form === "level2FiltersForm")
      dispatch(level2Actions.setCurrentFilters(formValues));
    else if (form === "level3FiltersForm")
      dispatch(level3Actions.setCurrentFilters(formValues));
    else if (form === "level4FiltersForm")
      dispatch(level4Actions.setCurrentFilters(formValues));
    else if (form === "ContactFiltersForm")
      dispatch(contactActions.setCurrentFilters({ type: type, data: formValues, }));

  }, [dispatch, form, formValues]);

  return null;
}
