import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import OptionService from "utils/option.util";

export default function SelectProcessingLevel(props: any) {
  return <ComboBoxRedux {...props} options={OptionService.getProcessingLevel()} />;
}
