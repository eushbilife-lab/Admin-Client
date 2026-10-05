import ComboBoxReduxWithButton from "@core/redux-fields/ComboBoxReduxWithButton";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import allergyService from "services/allergy.service";

export default function SelectCategoriesInAllergies(props: any) {
const dispatch=useAppDispatch()
  const { allergyOptions } = useAppSelector((state) => state.allergy);
  useEffect(() => {
    allergyService.getOptions({ status: "active" },dispatch);
  }, []);
  return <ComboBoxReduxWithButton {...props} options={allergyOptions} />;
}
