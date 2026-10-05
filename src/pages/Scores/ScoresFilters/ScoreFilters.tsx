import { fields } from ".";
import { config } from "config";
import { change, reset } from "redux-form";
import MyForm from "@core/templates/MyForm";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useTranslation } from "react-i18next";
import { Pagination } from "@mui/material";

export default function ProductFilter({ filters, count, productActions, refreshLoader }: any) {
  const form = "ProductFilterForm";
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const onClickReset = () => {
    const default_page_size = config.PAGE_SIZE;
    dispatch(productActions.resetFilters());
    dispatch(reset(form));
    dispatch(change(form, "page_size", default_page_size));
  };

  const handleSubmit = (values: any) => {
    const default_page_size = config.PAGE_SIZE;
    let data: any = { page: 1, page_size: default_page_size };
    const {
      HNSSProductCategoryID,
    } = values;

    if (HNSSProductCategoryID) data.HNSSProductCategoryID = HNSSProductCategoryID;
    dispatch(productActions.setFilters(data));
  };

  return (
    <div className="filters">
      <MyForm
        form={form}
        myFields={fields(t)}
        onSubmit={handleSubmit}
        onClickReset={onClickReset}
      />
      <div className="pagination-list">
        <p>{count > 0 && `${count} Product${count > 1 ? "s" : ""}`}</p>
        {count > 0 && (
          <Pagination
            variant="outlined"
            color="primary"
            page={filters.page}
            disabled={refreshLoader}
            count={Math.ceil(count / filters.page_size)}
            onChange={(_e, page) => dispatch(productActions.setPage(page))}
          />
        )}
      </div>
    </div>
  );
}
