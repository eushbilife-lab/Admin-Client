import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import dynamicService from "services/dynamic.service";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";

export default function SelectAttribute(props: any) {
  const dispatch=useAppDispatch()

  const dynamicAttributes = useAppSelector((state) =>state.dynamic.attribute.dynamicOptions);
  useEffect(() => {
    dynamicService.getOptions({ type: "attribute",status:"active" },dispatch);
  }, []);
  return <ComboBoxRedux {...props} options={dynamicAttributes} />;
}
