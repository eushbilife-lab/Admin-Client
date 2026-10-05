import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import dynamicService from "services/dynamic.service";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";

export default function SelectBrand(props: any) {
  const dispatch=useAppDispatch()

  const dynamicBrands = useAppSelector((state) =>state.dynamic.brand.dynamicOptions);
  useEffect(() => {
    dynamicService.getOptions({ type: "brand", status:"active" },dispatch);
  }, []);

  return <ComboBoxRedux {...props} options={dynamicBrands} />;
}

