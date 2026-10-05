import { fields } from ".";
import { config } from "config";
import { change, reset } from "redux-form";
import MyForm from "@core/templates/MyForm";
import { useAppDispatch } from "redux/hooks";
import { useTranslation } from "react-i18next";
import { Pagination } from "@mui/material";

export default function UsersFilters({ filters, count, userActions, refreshLoader }: any) {
  const form = "UsersFiltersForm";
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const onClickReset = () => {
    const default_page_size = config.PAGE_SIZE;
    dispatch(userActions.resetFilters());
    dispatch(reset(form));
    dispatch(change(form, "page_size", default_page_size));
  };

  const handleSubmit = (values: any) => {
    const default_page_size = config.PAGE_SIZE;
    let data: any = { page: 1, page_size: default_page_size };
    const {
      currentStatus,
      firstName,
      lastName,
      email,
      phone,
      page_size
    } = values;
    
    if (currentStatus) data.currentStatus = currentStatus === "active" ? "active" : "inactive";
    if (firstName) data.firstName = firstName;
    if (lastName) data.lastName = lastName;
    if (email) data.email = email;
    if (page_size) data.page_size=page_size
    
    let addSign="+"
    const numberWithSIgn = addSign +=values.phone.value
    if (phone) data.phone = {number:numberWithSIgn};
    
    dispatch(userActions.setFilters(data));
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
            onChange={(_e, page) => dispatch(userActions.setPage(page))}
          />
        )}
      </div>
    </div>
  );
}
