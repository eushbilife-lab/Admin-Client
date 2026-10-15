import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import Button from "@core/basic-components/Button";
import {
  levelFields,
  productCardFields,
  fields,
  productPreferenceFields,
  ingredientFields,
  nutritionFields,
} from ".";
import { Box, CircularProgress } from "@mui/material";
import { change, reduxForm } from "redux-form";
import BlockComponent from "@core/api-components/BlockComponent";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import MeasurementScaleService from "services/measurementScale.service";
import { FormSection } from "utils/FormSection";
import { field as imageFields } from "../AddProductImage";
import useUnsavedChanges from "hooks/useUnsavedChanges";

function AddProductForm({ handleSubmit, submitting, dirty, pristine }: any) {
  const form = "AddProductForm";
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const userRole = useAppSelector((state) => state.auth?.user?.role);
  const [isDraft, setIsDraft] = useState(false);
  const [searchParams] = useSearchParams();

  useUnsavedChanges(Boolean(dirty && !pristine && !submitting));

  useEffect(() => {
    MeasurementScaleService.getOptions({ type: "uom" }, dispatch);
  }, [dispatch]);

  const submitLabel = (label: string) => (
    <>
      {submitting ? <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} /> : null}
      {t(label)}
    </>
  );

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <ReduxFormFields fields={fields(userRole)} />
        <br />
        <FormSection title={t("Product Categories")} fields={levelFields(isDraft)} />
        <FormSection title={t("Product Card")} fields={productCardFields(t, isDraft)} />
        <FormSection
          title={t("Product Preference and Scoring Element")}
          fields={productPreferenceFields(isDraft)}
        />
        <FormSection
          title={t("Product Ingredients")}
          fields={ingredientFields(isDraft)}
        />
        {!id ? (
          <FormSection title={t("Product images")} fields={imageFields} />
        ) : null}
        <FormSection
          title={t("Product Nutirion Facts Label")}
          fields={nutritionFields(t, isDraft)}
        />
        <br />
        {!id ? (
          <Box sx={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              type="submit"
              sx={{ fontSize: "14px" }}
              disabled={submitting}
            >
              {submitLabel("Submit")}
            </Button>
            <BlockComponent allowedRoles={["admin"]}>
              <Button
                variant="contained"
                type="submit"
                sx={{ fontSize: "14px" }}
                disabled={submitting}
                onClick={() => dispatch(change(form, "status", "pending"))}
              >
                {submitLabel("Submit for Review")}
              </Button>
            </BlockComponent>
            <BlockComponent allowedRoles={["admin"]}>
              <Button
                variant="contained"
                type="submit"
                sx={{ fontSize: "14px" }}
                disabled={submitting}
                onClick={() => {
                  dispatch(change(form, "status", "draft"));
                  setIsDraft(true);
                }}
              >
                {submitLabel("Save as Draft")}
              </Button>
            </BlockComponent>
          </Box>
        ) : (
          <BlockComponent allowedRoles={["admin", "data_author"]}>
            <Box sx={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                type="submit"
                sx={{ fontSize: "14px" }}
                disabled={submitting}
              >
                {submitLabel("Submit")}
              </Button>
              {searchParams.get("isDraft") === "true" && (
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ fontSize: "14px" }}
                  disabled={submitting}
                  onClick={() => {
                    dispatch(change(form, "status", "draft"));
                    setIsDraft(true);
                  }}
                >
                  {submitLabel("Save as Draft")}
                </Button>
              )}
            </Box>
          </BlockComponent>
        )}
      </form>
    </div>
  );
}

export default reduxForm({
  form: "AddProductForm",
  validate: (values: any) => {
    const errors: any = {};
    if (values.status === "draft") return errors;
    if (!values.level1_id) errors.level1_id = "Required";
    if (!values.level2_id) errors.level2_id = "Required";
    if (!values.level3_id) errors.level3_id = "Required";
    if (!values.level4_id) errors.level4_id = "Required";
    if (!values.weightUOM) errors.weightUOM = "Required";
    if (!values.servingUOM) errors.servingUOM = "Required";
    if (!values.HNSSProductCategory) errors.HNSSProductCategory = "Required";
    if (!values.foodType || (Array.isArray(values.foodType) && values.foodType.length === 0)) {
      errors.foodType = "Required";
    }
    if (!values.processingLevel) errors.processingLevel = "Required";
    if (values.nf && Array.isArray(values.nf)) {
      const nfErrors = values.nf.map((item: any) => {
        const itemErrors: any = {};
        if (item.perServing === null || item.perServing === "") {
          itemErrors.perServing = "Required";
        }
        if (!item.uom || !item.uom.value) {
          itemErrors.uom = "Required";
        }
        return Object.keys(itemErrors).length > 0 ? itemErrors : undefined;
      });
      if (nfErrors.some((err: any) => err !== undefined)) {
        errors.nf = nfErrors;
      }
    }
    return errors;
  },
})(AddProductForm);
