import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import level2Service from "services/level2.service";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";

export default function SelectLevel2(props: any) {
  const dispatch=useAppDispatch()
  const level2Options = useAppSelector((state) => state?.level2?.level2Options);
  useEffect(() => {
    level2Service.getOptions({ status: "active" },dispatch);
  }, [dispatch]);

  return <ComboBoxRedux {...props} options={level2Options} />;
}
