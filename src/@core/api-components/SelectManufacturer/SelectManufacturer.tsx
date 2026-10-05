import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import dynamicService from "services/dynamic.service";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";

export default function SelectManufacturer(props: any) {
  const dispatch = useAppDispatch();
  const dynamicManufacturer = useAppSelector(
    (state) => state.dynamic.manufacturer.dynamicOptions
  );
  useEffect(() => {
    dynamicService.getOptions(
      { type: "manufacturer", status: "active" },
      dispatch
    );
  }, []);
  return <ComboBoxRedux {...props} options={dynamicManufacturer} />;
}
