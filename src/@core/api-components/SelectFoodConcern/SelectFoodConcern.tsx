import healthPreferenceService from "services/healthPreference.service";
import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";

export default function SelectFoodConcern(props: any) {
  const dispatch=useAppDispatch()
  const foodConcerns = useAppSelector((state) => {
    return state?.healthPreference?.food_concern?.hpOptions
  })
  useEffect(() => {
    healthPreferenceService.getOptions({ type: "food_concern"},dispatch);
  }, []);
  return <ComboBoxRedux {...props} options={foodConcerns} />;
}
