import { useAppDispatch, useAppSelector } from "redux/hooks";
import PersistFilters from "@core/templates/PersistFilters";
import MyForm from "@core/templates/MyForm";
import { change, reset } from "redux-form";
import { Pagination } from "@mui/material";
import { config } from "config";
import { fields } from ".";
import { useTranslation } from "react-i18next";

export default function Level2Filters({
  filters,
  count,
  level2Actions,
  refreshLoader,
}: any) {
  const form = "level2FiltersForm";
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const onClickReset = () => {
    const default_page_size = config.PAGE_SIZE;
    dispatch(level2Actions.resetFilters());
    dispatch(reset(form));
    dispatch(change(form, "page_size", default_page_size));
  };

  const handleSubmit = (values: any) => {
    const page_size= values.page_size
    let data: any = { page: 1, page_size: page_size };
    const { level1, ...otherValues } = values;
    data = { ...data, mainCategoryID: level1?.value, ...otherValues };
    dispatch(level2Actions.setFilters(data));
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
      <p>  {count > 0 && `${count} ${count > 1 ? t("Counts") : t("Count")}`}</p>
      {count > 0 && (
          <Pagination
            variant="outlined"
            color="primary"
            page={filters.page}
            disabled={refreshLoader}
            count={Math.ceil(count / filters.page_size)}
            onChange={(_e, page) => dispatch(level2Actions.setPage(page))}
          />
        )}
      </div>
      <PersistFilters form={form} />
    </div>
  );
}
