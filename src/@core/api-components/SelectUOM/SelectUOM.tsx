import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import { useAppSelector } from "redux/hooks";

export default function SelectUOM(props: any) {
  const UOM = useAppSelector((state) => {
    return state?.measurementScale.uom.measurementScaleOptions;
  });
  return <ComboBoxRedux {...props} options={UOM} />;
}
