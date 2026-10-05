import { config } from "config";
import { useEffect } from "react";
import { change } from "redux-form";
import { useAppDispatch } from "redux/hooks";
import InputRedux from "@core/redux-fields/InputRedux";

export default function PageSize({ PageSizeProps, ...rest }: any) {
  const dispatch = useAppDispatch();
  const default_page_size = config.PAGE_SIZE || 30;
  const form = PageSizeProps?.form || "MyForm";

  useEffect(() => {
    dispatch(change(form, "page_size", default_page_size));
  }, [default_page_size, dispatch, form]);

  return (
    <InputRedux
      {...rest}
      handleBlur={(e: any) => {
        if (!e.target.value)
          dispatch(change(form, "page_size", default_page_size));
      }}
    />
  );
}
