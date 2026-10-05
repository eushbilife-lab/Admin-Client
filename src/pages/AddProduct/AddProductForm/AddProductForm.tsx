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
import { Box } from "@mui/material";
import { change, reduxForm } from "redux-form";
import BlockComponent from "@core/api-components/BlockComponent";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import MeasurementScaleService from "services/measurementScale.service";
import { FormSection } from "utils/FormSection";

function AddProductForm({ handleSubmit }: any) {
  const form = "AddProductForm";
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // const { notFounded } = useAppSelector((state) => state.nutrition);
  const userRole = useAppSelector((state) => state.auth?.user?.role);
  const [isDraft, setIsDraft] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    MeasurementScaleService.getOptions({ type: "uom" }, dispatch);
  }, [dispatch]);


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
         {/* <Button
          variant="outlined"
          onClick={() =>
            dispatch(
              modalActions.openModal({
                type: MODAL.ADD_INGREDIENT_IN_PRODUCT,
                data: {},
                width: "700px",
              })
            )
          }
        >
          {ingredientSection ? "Edit Ingredients" : "Add Ingredients"}
        </Button> */}
        {/* <Typography variant="h6" display="flex" justifyContent="space-between"> */}
        {/* Nutrition Facts */}
        {/* <Button
            variant="outlined"
            onClick={() =>
              dispatch(
                modalActions.openModal({
                  type: MODAL.ADD_RDA_IN_PRODUCT,
                  data: {},
                  width: "700px",
                })
              )
            }
          >
            Add Nutrition Fact
          </Button> */}
        {/* </Typography> */}

        {/* {notFounded && (
          <Button
            onClick={() =>
              dispatch(
                modalActions.openModal({
                  type: MODAL.ADD_NUTRITION,
                  data: {},
                  width: "700px",
                })
              )
            }
          >
            {t("Add New")}
          </Button>
        )} */}
        <FormSection
          title={t("Product Nutirion Facts Label")}
          fields={nutritionFields(t, isDraft)}
        />
        <br />
        {!id ? (
          <Box sx={{ display: "flex", gap: "15px" }}>
            <Button variant="contained" type="submit" sx={{ fontSize: "14px" }}>
              {t("Submit")}
            </Button>
            <BlockComponent allowedRoles={["admin"]}>
              <Button
                variant="contained"
                type="submit"
                sx={{ fontSize: "14px" }}
                onClick={() => dispatch(change(form, "status", "pending"))}
              >
                {t("Submit for Review")}
              </Button>
            </BlockComponent>
            <BlockComponent allowedRoles={["admin"]}>
              <Button
                variant="contained"
                type="submit"
                sx={{ fontSize: "14px" }}
                onClick={() => {
                  dispatch(change(form, "status", "draft"));
                  setIsDraft(true);
                }}
              >
                {t("Save as Draft")}
              </Button>
            </BlockComponent>
          </Box>
        ) : (
          <BlockComponent allowedRoles={["admin", "data_author"]}>
            <Box sx={{ display: "flex", gap: "15px" }}>
            <Button variant="contained" type="submit" sx={{ fontSize: "14px"}}>
              {t("Submit")}
            </Button>
            {searchParams.get("isDraft") === "true" && (
              <Button variant="contained" type="submit" sx={{ fontSize: "14px" }}
              onClick={() => {
                dispatch(change(form, "status", "draft"));
                setIsDraft(true);
              }}>
            {t("Save as Draft")}
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
  if (values.status === "draft") {
    return errors;
  }
  if (!values.level1_id) errors.level1_id = "Required";
  if (!values.level2_id) errors.level2_id = "Required";
  if (!values.level3_id) errors.level3_id = "Required";
  if (!values.level4_id) errors.level4_id = "Required";
  if (!values.weightUOM) errors.weightUOM = "Required";
  if (!values.servingUOM) errors.servingUOM = "Required";
  if (!values.HNSSProductCategory) errors.HNSSProductCategory = "Required";
  if (!values.foodType) errors.foodType = "Required";
  if (!values.processingLevel) errors.processingLevel = "Required";
  if (values.nf && Array.isArray(values.nf)) {
    const nfErrors = values.nf.map((item: any, index: number) => {
      const itemErrors: any = {};
      if (item.perServing === null || item.perServing === "") {
        itemErrors.perServing = "Required";
      }
      if (!item.uom || !item.uom.value) {
        itemErrors.uom = "Required";
      }
      return Object.keys(itemErrors).length > 0 ? itemErrors : undefined;
    });
    if (nfErrors.some((err:any) => err !== undefined)) {
      errors.nf = nfErrors;
    }
  }
  return errors;
}

})(AddProductForm);