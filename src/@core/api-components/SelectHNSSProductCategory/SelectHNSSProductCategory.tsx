import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";
import hnssProductCategoryService from "services/hnssProductCategory.service";

export default function SelectHNSSProductCategory(props: any) {
  const dispatch = useAppDispatch();
  const HNSSOptions = useAppSelector(
    (state) => state.hnssProductCategory.hnssProductCategoryOptions
  );
  useEffect(() => {
    hnssProductCategoryService.getOptions({ status: "active" }, dispatch);
  }, [dispatch]);

  return <ComboBoxRedux {...props} options={HNSSOptions} />;
}
