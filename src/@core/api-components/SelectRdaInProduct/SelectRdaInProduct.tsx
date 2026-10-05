import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import { useAppSelector } from "redux/hooks";

export default function SelectRdaInProduct(props: any) {
  const RDAOptions = useAppSelector((state) => state.rda?.RDAOptions);
  return <ComboBoxRedux {...props} options={RDAOptions} />;
}
