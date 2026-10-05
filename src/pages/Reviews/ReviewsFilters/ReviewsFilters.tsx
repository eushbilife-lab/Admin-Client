import { fields } from ".";
import { config } from "config";
import { change, reset } from "redux-form";
import MyForm from "@core/templates/MyForm";
import { useAppDispatch } from "redux/hooks";
import { useTranslation } from "react-i18next";
import { Pagination } from "@mui/material";
import { format } from "date-fns";

export default function ReviewsFilters({ filters, count, reviewsActions, refreshLoader }: any) {
  const form = "ReviewsFiltersForm";
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const onClickReset = () => {
    const default_page_size = config.PAGE_SIZE;
    dispatch(reviewsActions.resetFilters());
    dispatch(reset(form));
    dispatch(change(form, "page_size", default_page_size));
  };
  const handleSubmit = (values: any) => {
    const default_page_size = config.PAGE_SIZE;
    let data: any = { page: 1, page_size: default_page_size };
    const {
      doc_number,
      createdAt,
      productID,
      userID,
      page_size
    } = values;

    if (page_size) data.page_size=page_size
    if (doc_number) data.doc_number = doc_number;
    if (createdAt && createdAt.date[0] && createdAt.date[1]) {
			data.end_date = format(new Date(createdAt.date[1]), "yyyy-MM-dd");
			data.start_date = format(new Date(createdAt.date[0]), "yyyy-MM-dd");
		}    
    if (productID) data.productID = productID;
    if (userID) data.productID = userID;

    // if (User) data.User = User;
    dispatch(reviewsActions.setFilters(data));
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
            onChange={(_e, page) => dispatch(reviewsActions.setPage(page))}
          />
        )}
      </div>
    </div>
  );
}
