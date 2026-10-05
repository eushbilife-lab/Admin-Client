import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import level1Service from "services/level1.service";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";

export default function SelectLevel1(props: any) {
  const dispatch = useAppDispatch();
  const level1Options = useAppSelector((state) => state.level1?.level1Options);
  useEffect(() => {
    level1Service.getOptions({ status: "active" }, dispatch);
  }, [dispatch]);
  return <ComboBoxRedux {...props} options={level1Options} />;
}
