import SelectNutrientInProduct from "@core/api-components/SelectNutrientInProduct";
import type { ReduxFormField } from "@core/redux-fields/ReduxFormFields/index";
import SelectRdaInProduct from "@core/api-components/SelectRdaInProduct";
import ReduxFieldArray from "@core/redux-fields/ReduxFieldArray";
import CheckBoxRedux from "@core/redux-fields/CheckboxRedux";
import SelectLevel1 from "@core/api-components/SelectLevel1";
import SelectLevel2 from "@core/api-components/SelectLevel2";
import SelectLevel3 from "@core/api-components/SelectLevel3";
import SelectLevel4 from "@core/api-components/SelectLevel4";
import InputRedux from "@core/redux-fields/InputRedux";
import { required } from "utils/validate.util";
import { digitOrFloat, digits } from "utils/normalize.util";
import SelectFoodConcern from "@core/api-components/SelectFoodConcern/SelectFoodConcern";
import SelectCertificate from "@core/api-components/SelectCertificate";
import SelectProcessingLevel from "@core/api-components/SelectProcessingLevel";
import SelectUOM from "@core/api-components/SelectUOM";
import SelectHNSSProductCategory from "@core/api-components/SelectHNSSProductCategory";
import ProductIngredientsField from "@core/api-components/ProductIngredientsField";
export { default } from "./AddProductForm";



export const fields = (userRole: string): ReduxFormField[] => {
  return [
    ...(userRole !== "data_entry"
      ? [
          {
            name: "status",
            label: "Is Active",
            component: CheckBoxRedux,
            cellProps: { md: 12 },
            InputProps: { type: "checkbox" },
            normalize: (value: boolean) => Boolean(value),
          },
        ]
      : []),
  ];
};
const levelCell = { xs: 12, sm: 6, md: 3 };

export const levelFields = (isDraft: boolean): ReduxFormField[] => {
  const requiredFields = [
    {
      name: "level1_id",
      label: "Level 1",
      component: SelectLevel1,
      validate: [required],
      cellProps: levelCell,
    },
    {
      name: "level2_id",
      label: "Level 2",
      component: SelectLevel2,
      cascadeParent: "level1_id",
      validate: [required],
      cellProps: levelCell,
    },
    {
      name: "level3_id",
      label: "Level 3",
      component: SelectLevel3,
      cascadeParent: "level2_id",
      validate: [required],
      cellProps: levelCell,
    },
    {
      name: "level4_id",
      label: "Level 4",
      component: SelectLevel4,
      cascadeParent: "level3_id",
      validate: [required],
      cellProps: levelCell,
    },
  ];

  const simpleFields = [
    {
      name: "level1_id",
      label: "Level 1",
      component: SelectLevel1,
      cellProps: levelCell,
    },
    {
      name: "level2_id",
      label: "Level 2",
      component: SelectLevel2,
      cascadeParent: "level1_id",
      cellProps: levelCell,
    },
    {
      name: "level3_id",
      label: "Level 3",
      component: SelectLevel3,
      cascadeParent: "level2_id",
      cellProps: levelCell,
    },
    {
      name: "level4_id",
      label: "Level 4",
      component: SelectLevel4,
      cascadeParent: "level3_id",
      cellProps: levelCell,
    },
  ];

  return isDraft === true ? simpleFields : requiredFields;
};
const detailCell = { xs: 12, sm: 6, md: 4, lg: 3 };

export const productCardFields = (
  t: (key: string) => string,
  isDraft: boolean
): ReduxFormField[] => {
  const requiredFields = [
    {
      name: "barcode",
      label: "Barcode",
      validate: [required],
      component: InputRedux,
      cellProps: detailCell,
    },
    {
      name: "brand",
      label: "Brand",
      component: InputRedux,
      validate: [required],
      cellProps: detailCell,
    },
    {
      name: "productName",
      label: "Product Name",
      validate: [required],
      component: InputRedux,
      cellProps: detailCell,
    },
    {
      name: "attribute_01_Flavour",
      label: "Flavour",
      component: InputRedux,
      validate: [required],
      cellProps: detailCell,
    },
    {
      name: "attribute_02_Other",
      label: "Other attribute",
      component: InputRedux,
      cellProps: detailCell,
    },
    {
      name: "netWeight",
      label: "Net weight",
      validate: [required],
      component: InputRedux,
      normalize: digitOrFloat,
      cellProps: detailCell,
    },
    {
      name: "weightUOM",
      label: "Weight unit",
      component: SelectUOM,
      validate: [required],
      cellProps: detailCell,
    },
    {
      name: "servingSize",
      label: "Serving size",
      validate: [required],
      component: InputRedux,
      normalize: digitOrFloat,
      cellProps: detailCell,
    },
    {
      name: "servingUOM",
      label: "Serving unit",
      component: SelectUOM,
      validate: [required],
      cellProps: detailCell,
    },
    {
      name: "servingsPerContainer",
      label: "Servings per pack",
      component: InputRedux,
      validate: [required],
      normalize: digits,
      cellProps: detailCell,
    },
    {
      name: "manufacturer",
      label: "Manufacturer",
      component: InputRedux,
      validate: [required],
      cellProps: detailCell,
    },
    {
      name: "productionCountry",
      label: "Country of origin",
      validate: [required],
      component: InputRedux,
      cellProps: detailCell,
    },
    {
      name: "FOPLcertificates",
      label: "FOPL certificates",
      component: SelectCertificate,
      cellProps: { xs: 12, sm: 12, md: 6 },
      ComboBoxProps: {
        multiple: true,
        options: [],
      },
    },
  ];

  const simpleFields = requiredFields.map(({ validate, ...field }) => field);

  return isDraft ? simpleFields : requiredFields;
};
const scoreCell = { xs: 12, sm: 6, md: 4 };

export const productPreferenceFields = (isDraft: boolean): ReduxFormField[] => {
  const requiredFields = [
    {
      name: "foodType",
      label: "Food type",
      validate: [required],
      component: SelectFoodConcern,
      cellProps: { xs: 12, sm: 12, md: 6 },
      InputProps: {
        helperText: "Product tags such as high protein, organic, or low sugar.",
      },
    },
    {
      name: "processingLevel",
      label: "Processing level",
      validate: [required],
      component: SelectProcessingLevel,
      cellProps: scoreCell,
      InputProps: {
        helperText: "NOVA-style processing class for scoring.",
      },
    },
    {
      name: "HNSSProductCategory",
      label: "HSN / ENLI",
      component: SelectHNSSProductCategory,
      validate: [required],
      cellProps: scoreCell,
      InputProps: {
        helperText: "Usually filled from Level 4; override only if needed.",
      },
    },
    {
      name: "fruitsVegNutsPercent",
      label: "Fruit / veg / nuts %",
      component: InputRedux,
      hint: "Auto-calculated from ingredients when available.",
      InputProps: { readOnly: true },
      cellProps: scoreCell,
    },
    {
      name: "carbsCount",
      label: "Carbs count",
      component: InputRedux,
      hint: "Derived from nutrition facts for scoring.",
      InputProps: { readOnly: true },
      normalize: digitOrFloat,
      cellProps: scoreCell,
    },
  ];

  const simpleFields = requiredFields.map(({ validate, ...field }) => field);

  return isDraft ? simpleFields : requiredFields;
};
export const ingredientFields = (isDraft: boolean): ReduxFormField[] => {
  return [
    {
      name: "ingredients",
      label: "Ingredients",
      component: ProductIngredientsField,
      validate: isDraft
        ? undefined
        : [
            (value: any) =>
              Array.isArray(value) && value.length > 0
                ? undefined
                : "Add at least one ingredient",
          ],
      cellProps: { md: 12 },
    } as ReduxFormField,
  ];
};

export const nutritionFields = (
  t: (key: string) => string,
  isDraft: boolean
): ReduxFormField[] => {
  const requiredFieldsArray = [
    {
      name: "nutritionId",
      label: t("Nutrition (NF)"),
      component: SelectNutrientInProduct,
      validate: [required],
      cellProps: { md: 2 },
    },
    {
      name: "perServing",
      label: t("NF value per Serving"),
      validate: [required],
      component: InputRedux,
      normalize: digitOrFloat,
      cellProps: { md: 2 },
    },
    {
      name: "uom",
      label: t("NF UOM"),
      component: SelectUOM,
      validate: required,
      cellProps: { md: 2 },
    },
    {
      name: "nFDv",
      label: t("NF (%) DV"),
      component: InputRedux,
      normalize: digitOrFloat,
      cellProps: { md: 2 },
    },
    {
      name: "rda",
      label: t("RDA"),
      component: SelectRdaInProduct,
      cellProps: { md: 2 },
    },
    {
      name: "dv",
      label: t("Calculated (%) DV"),
      component: InputRedux,
      cellProps: { md: 2 },
      normalize: digitOrFloat,
    },
  ];

  const simpleFieldsArray = [
    {
      name: "nutritionId",
      label: t("Nutrition (NF)"),
      component: SelectNutrientInProduct,
      cellProps: { md: 2 },
    },
    {
      name: "perServing",
      label: t("NF value per Serving"),
      component: InputRedux,
      normalize: digitOrFloat,
      cellProps: { md: 2 },
    },
    {
      name: "uom",
      label: t("NF UOM"),
      component: SelectUOM,
      cellProps: { md: 2 },
    },
    {
      name: "nFDv",
      label: t("NF (%) DV"),
      component: InputRedux,
      cellProps: { md: 2 },
    },
    {
      name: "rda",
      label: t("RDA"),
      component: SelectRdaInProduct,
      cellProps: { md: 2 },
    },
    {
      name: "dv",
      label: t("Calculated (%) DV"),
      component: InputRedux,
      cellProps: { md: 2 },
      normalize: digits,
    },
  ];

  return [
    {
      name: "nf",
      label: "",
      component: ReduxFieldArray,
      reduxFormComponent: "FieldArray" as const,
      upperLayout: false,
      fieldsArray: isDraft ? simpleFieldsArray : requiredFieldsArray,
    },
  ];
};

