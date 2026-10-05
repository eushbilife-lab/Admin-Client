import ComboBoxReduxWithButton from "@core/redux-fields/ComboBoxReduxWithButton";
import { useAppSelector } from "redux/hooks";

export default function SelectNutrientInProduct(props: any) {
  const { nutritionsOptions } = useAppSelector((state) => state.nutrition);
  return <ComboBoxReduxWithButton {...props} options={nutritionsOptions} />;
}
