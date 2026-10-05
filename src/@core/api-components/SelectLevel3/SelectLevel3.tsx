import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import level3Service from "services/level3.service";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";

export default function SelectLevel3(props: any) {
  const dispatch=useAppDispatch()
  const level3Options = useAppSelector((state) => state.level3?.level3Options);
  useEffect(() => {
    level3Service.getOptions({ status: "active" },dispatch);
  }, [dispatch]);

  return <ComboBoxRedux {...props} options={level3Options} />;
}
