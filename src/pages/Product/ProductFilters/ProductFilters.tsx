import { fields } from ".";
import { config } from "config";
import { change, reset } from "redux-form";
import MyForm from "@core/templates/MyForm";
import { useAppDispatch } from "redux/hooks";
import { useTranslation } from "react-i18next";

export default function ProductFilter({
  filters,
  productActions,
  activeTab,
}: any) {
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
    const default_page_size = Number(config.PAGE_SIZE) || 25;
    const data: any = {
      page: 1,
      page_size: Number(values?.page_size) || default_page_size,
    };
    const {
      productName,
      doc_number,
      barcode,
      status,
      level1_id,
      level2_id,
      level3_id,
      level4_id,
      HNSSProductCategory,
    } = values || {};

    if (productName) data.productName = productName;
    if (doc_number) data.doc_number = doc_number;
    if (barcode) data.barcode = barcode;
    if (level1_id) data.level1_id = level1_id.value;
    if (level2_id) data.level2_id = level2_id.value;
    if (level3_id) data.level3_id = level3_id.value;
    if (level4_id) data.level4_id = level4_id.value;
    if (HNSSProductCategory) data.HNSSProductCategory = HNSSProductCategory.value;

    if (activeTab === 0 || status === "active" || status === "inactive") {
      data.status = status;
    } else if (activeTab === 1) {
      data.status = "pending";
    }

    dispatch(productActions.setFilters(data));
  };

  return (
    <div className="filters">
      <MyForm
        form={form}
        myFields={fields(
          {
            statusDisabled: activeTab === 1 || activeTab === 2,
          },
          t
        )}
        onSubmit={handleSubmit}
        onClickReset={onClickReset}
      />
    </div>
  );
}
