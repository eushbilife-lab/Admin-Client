import ComboBoxReduxWithButton from "@core/redux-fields/ComboBoxReduxWithButton";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import foodIntoleranceService from "services/foodIntolerance.service";

export default function SelectFooIntolerance(props: any) {
const dispatch=useAppDispatch()
  const { foodIntoleranceOptions } = useAppSelector((state) => state.foodIntolerance);
  useEffect(() => {
    foodIntoleranceService.getOptions({ status: "active" },dispatch);
  }, []);
  return <ComboBoxReduxWithButton {...props} options={foodIntoleranceOptions} />;
}
