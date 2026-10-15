import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";
import hnssProductCategoryService from "services/hnssProductCategory.service";

export default function SelectHNSSProductCategory(props: any) {
  const dispatch = useAppDispatch();
  const options = useAppSelector(
    (state) => state.hnssProductCategory.hnssProductCategoryOptions
  );

  useEffect(() => {
    hnssProductCategoryService.getOptions({ status: "active" }, dispatch);
  }, [dispatch]);

  const { ComboBoxProps, ...rest } = props;

  return (
    <ComboBoxRedux
      {...rest}
      options={Array.isArray(options) ? options : []}
      ComboBoxProps={{
        ...(ComboBoxProps || {}),
        options: undefined,
        disabled: false,
      }}
    />
  );
}
