import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect, useMemo } from "react";
import hnssProductCategoryService from "services/hnssProductCategory.service";
import { optionId, optionLabel } from "utils/selectOption.util";

export default function SelectHNSSProductCategory(props: any) {
  const dispatch = useAppDispatch();
  const raw = useAppSelector(
    (state) => state.hnssProductCategory.hnssProductCategoryOptions
  );

  useEffect(() => {
    hnssProductCategoryService.getOptions({ status: "active" }, dispatch);
  }, [dispatch]);

  const options = useMemo(() => {
    const list = Array.isArray(raw) ? raw : [];
    return list
      .map((item: any) => {
        const value = optionId(item);
        const name = optionLabel(item.label, "HNSS");
        // Slice may already format as "code — name"
        const label =
          item.code && name && !String(name).includes(String(item.code))
            ? `${item.code} — ${name}`
            : name;
        return value ? { value, label, code: item.code } : null;
      })
      .filter(Boolean) as { value: string; label: string; code?: string }[];
  }, [raw]);

  const { ComboBoxProps, ...rest } = props;

  return (
    <ComboBoxRedux
      {...rest}
      options={options}
      ComboBoxProps={{
        ...(ComboBoxProps || {}),
        options: undefined,
        disabled: false,
      }}
    />
  );
}
