import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import level4Service from "services/level4.service";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";

export default function SelectLevel4(props: any) {
  const dispatch=useAppDispatch()
  const level4Options = useAppSelector((state) => state.level4?.level4Options);
  useEffect(() => {
    level4Service.getOptions({ status: "active" },dispatch);
  }, [dispatch]);

  return <ComboBoxRedux {...props} options={level4Options} />;
}
