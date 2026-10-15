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
import { CircularProgress } from "@mui/material";
import { change, reduxForm } from "redux-form";
import BlockComponent from "@core/api-components/BlockComponent";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import MeasurementScaleService from "services/measurementScale.service";
import { FormSection } from "utils/FormSection";
import { field as imageFields } from "../AddProductImage";
import useUnsavedChanges from "hooks/useUnsavedChanges";
import "../AddProduct.css";

function AddProductForm({ handleSubmit, submitting, dirty, pristine }: any) {
  const form = "AddProductForm";
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const userRole = useAppSelector((state) => state.auth?.user?.role);
  const [isDraft, setIsDraft] = useState(false);
  const [searchParams] = useSearchParams();
  const showStatus = userRole !== "data_entry";

  useUnsavedChanges(Boolean(dirty && !pristine && !submitting));

  useEffect(() => {
    MeasurementScaleService.getOptions({ type: "uom" }, dispatch);
  }, [dispatch]);

  const label = (text: string) => (
    <>
      {submitting ? (
        <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
      ) : null}
      {t(text)}
    </>
  );

  return (
    <div className="add-food">
      <form onSubmit={handleSubmit} noValidate>
        {showStatus ? (
          <div className="add-food__intro">
            <p className="add-food__intro-copy">
              {id
                ? "Update the label details below. Categories cascade — pick Level 1 first."
                : "Fill the sections in order. Required fields are marked when you submit."}
            </p>
            <div className="add-food__status">
              <ReduxFormFields fields={fields(userRole)} />
            </div>
          </div>
        ) : (
          <div className="add-food__intro">
            <p className="add-food__intro-copy">
              Fill the sections in order. Categories cascade — pick Level 1 first.
            </p>
          </div>
        )}

        <FormSection
          step={1}
          title="Category"
          hint="Choose aisle → category → sub-category → nest. Each level unlocks the next."
          fields={levelFields(isDraft)}
        />

        <FormSection
          step={2}
          title="Product details"
          hint="Barcode, brand, name, weight, and serving size as printed on pack."
          fields={productCardFields(t, isDraft)}
        />

        <FormSection
          step={3}
          title="Scoring"
          hint="Food type, processing level, and HSN / ENLI. HSN auto-fills from Level 4 when available."
          fields={productPreferenceFields(isDraft)}
        />

        <FormSection
          step={4}
          title="Ingredients"
          hint="Search the dictionary, add chips, and set content % where needed."
          fields={ingredientFields(isDraft)}
        />

        {!id ? (
          <FormSection
            step={5}
            title="Photos"
            hint="Drop clear pack shots here. Up to 5 images — you can add more on the Media tab after saving."
            fields={imageFields}
          />
        ) : null}

        <FormSection
          step={id ? 5 : 6}
          title="Nutrition facts"
          hint="Per-serving values from the label. Calories and key macros are pre-listed."
          fields={nutritionFields(t, isDraft)}
        />

        <div className="add-food__actions">
          {!id ? (
            <>
              <Button
                variant="contained"
                type="submit"
                disabled={submitting}
              >
                {label("Save food")}
              </Button>
              <BlockComponent allowedRoles={["admin"]}>
                <Button
                  variant="outlined"
                  type="submit"
                  disabled={submitting}
                  onClick={() => dispatch(change(form, "status", "pending"))}
                >
                  {label("Submit for review")}
                </Button>
              </BlockComponent>
              <span className="add-food__actions-spacer" />
              <BlockComponent allowedRoles={["admin"]}>
                <Button
                  variant="text"
                  type="submit"
                  disabled={submitting}
                  onClick={() => {
                    dispatch(change(form, "status", "draft"));
                    setIsDraft(true);
                  }}
                >
                  {label("Save draft")}
                </Button>
              </BlockComponent>
            </>
          ) : (
            <BlockComponent allowedRoles={["admin", "data_author"]}>
              <Button variant="contained" type="submit" disabled={submitting}>
                {label("Save changes")}
              </Button>
              {searchParams.get("isDraft") === "true" ? (
                <Button
                  variant="text"
                  type="submit"
                  disabled={submitting}
                  onClick={() => {
                    dispatch(change(form, "status", "draft"));
                    setIsDraft(true);
                  }}
                >
                  {label("Save draft")}
                </Button>
              ) : null}
            </BlockComponent>
          )}
        </div>
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
    if (
      !values.foodType ||
      (Array.isArray(values.foodType) && values.foodType.length === 0)
    ) {
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
