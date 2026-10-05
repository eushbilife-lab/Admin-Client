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
export const levelFields = (isDraft: boolean): ReduxFormField[] => {
  const requiredFields = [
    {
      name: "level1_id",
      label: "Level 1",
      component: SelectLevel1,
      validate: [required],
      cellProps: { md: 3 },
    },
    {
      name: "level2_id",
      label: "Level 2",
      component: SelectLevel2,
      validate: [required],
      cellProps: { md: 3 },
    },
    {
      name: "level3_id",
      label: "Level 3",
      component: SelectLevel3,
      validate: [required],
      cellProps: { md: 3 },
    },
    {
      name: "level4_id",
      label: "Level 4",
      component: SelectLevel4,
      validate: [required],
      cellProps: { md: 3 }, 
    },
  ];

  const simpleFields = [
    {
      name: "level1_id",
      label: "Level 1",
      component: SelectLevel1,
      cellProps: { md: 3 },
    },
    {
      name: "level2_id",
      label: "Level 2",
      component: SelectLevel2,
      cellProps: { md: 3 },
    },
    {
      name: "level3_id",
      label: "Level 3",
      component: SelectLevel3,
      cellProps: { md: 3 },
    },
    {
      name: "level4_id",
      label: "Level 4",
      component: SelectLevel4,
      cellProps: { md: 3 },
    },
  ];

  return isDraft === true ? simpleFields : requiredFields;
};
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
      cellProps: { md: 3 },
    },
    {
      name: "brand",
      label: "Brand",
      component: InputRedux,
      validate: [required],
      cellProps: { md: 3 },
    },
    {
      name: "productName",
      label: "Product Name",
      validate: [required],
      component: InputRedux,
      cellProps: { md: 3 },
    },
    {
      name: "attribute_01_Flavour",
      label: "Attribute 01 Flavour",
      component: InputRedux,
      validate: [required],
      cellProps: { md: 3 },
    },
    {
      name: "attribute_02_Other",
      label: "Attribute 02 Other",
      component: InputRedux,
      cellProps: { md: 3 },
    },
    {
      name: "netWeight",
      label: "Net Wt",
      validate: [required],
      component: InputRedux,
      normalize: digitOrFloat,
      cellProps: { md: 3 },
    },
    {
      name: "weightUOM",
      label: "Wt.UOM",
      component: SelectUOM,
      validate: [required],
      cellProps: { md: 3 },
    },
    {
      name: "servingSize",
      label: "Serving Size",
      validate: [required],
      component: InputRedux,
      normalize: digitOrFloat,
      cellProps: { md: 3 },
    },
    {
      name: "servingUOM",
      label: "Serving Size UOM",
      component: SelectUOM,
      validate: [required],
      cellProps: { md: 3 },
    },
    {
      name: "servingsPerContainer",
      label: "Serving Container",
      component: InputRedux,
      validate: [required],
      normalize: digits,
      cellProps: { md: 3 },
    },
    {
      name: "manufacturer",
      label: "Manufacturer",
      component: InputRedux,
      validate: [required],
      cellProps: { md: 3 },
    },
    {
      name: "productionCountry",
      label: "Production Country",
      validate: [required],
      component: InputRedux,
      cellProps: { md: 3 },
    },
    {
      name: "FOPLcertificates",
      label: "FOPL Certificate",
      component: SelectCertificate,
      cellProps: { md: 3 },
      ComboBoxProps: {
        multiple: true,
        options: [],
      },
    },
  ];

  const simpleFields = [
    {
      name: "barcode",
      label: "Barcode",
      component: InputRedux,
      cellProps: { md: 3 },
    },
    {
      name: "brand",
      label: "Brand",
      component: InputRedux,
      cellProps: { md: 3 },
    },
    {
      name: "productName",
      label: "Product Name",
      component: InputRedux,
      cellProps: { md: 3 },
    },
    {
      name: "attribute_01_Flavour",
      label: "Attribute 01 Flavour",
      component: InputRedux,
      cellProps: { md: 3 },
    },
    {
      name: "attribute_02_Other",
      label: "Attribute 02 Other",
      component: InputRedux,
      cellProps: { md: 3 },
    },
    {
      name: "netWeight",
      label: "Net Wt",
      component: InputRedux,
      normalize: digitOrFloat,
      cellProps: { md: 3 },
    },
    {
      name: "weightUOM",
      label: "Wt.UOM",
      component: SelectUOM,
      cellProps: { md: 3 },
    },
    {
      name: "servingSize",
      label: "Serving Size",
      component: InputRedux,
      normalize: digitOrFloat,
      cellProps: { md: 3 },
    },
    {
      name: "servingUOM",
      label: "Serving Size UOM",
      component: SelectUOM,
      cellProps: { md: 3 },
    },
    {
      name: "servingsPerContainer",
      label: "Serving Container",
      component: InputRedux,
      normalize: digits,
      cellProps: { md: 3 },
    },
    {
      name: "manufacturer",
      label: "Manufacturer",
      component: InputRedux,
      cellProps: { md: 3 },
    },
    {
      name: "productionCountry",
      label: "Production Country",
      component: InputRedux,
      cellProps: { md: 3 },
    },
    {
      name: "productionCountry",
      label: "Production Country",
      component: InputRedux,
      cellProps: { md: 3 },
    },
  ];

  return isDraft ? simpleFields : requiredFields;
};
export const productPreferenceFields = (isDraft: boolean): ReduxFormField[] => {
  const requiredFields = [
    {
      name: "foodType",
      label: "Food Type",
      validate: [required],
      component: SelectFoodConcern,
      cellProps: { md: 2.4 },
      ComboBoxProps: {
        multiple: true,
        options: [],
      },
    },
    {
      name: "processingLevel",
      label: "Processing Level",
      validate: [required],
      component: SelectProcessingLevel,
      cellProps: { md: 2.4 },
    },
    {
      name: "fruitsVegNutsPercent",
      label: "Fruits Vegetable and Nuts",
      component: InputRedux,
      InputProps: { readOnly: true },
      cellProps: { md: 2.4 },
    },
    {
      name: "HNSSProductCategory",
      label: "HNSS Product Category",
      component: SelectHNSSProductCategory,
      ComboBoxProps: {
        multiple: false,
        options:[],
        disabled:true
      },
      cellProps: { md: 2.4 },
    },
    {
      name: "carbsCount",
      label: "Carbs Count",
      component: InputRedux,
      InputProps: { readOnly: true },
      normalize: digitOrFloat,
      cellProps: { md: 2.4 },
    },
  ];

  const simpleFields = [
    {
      name: "foodType",
      label: "Food Type",
      component: SelectFoodConcern,
      cellProps: { md: 2.4 },
      ComboBoxProps: {
        multiple: true,
        options: [],
      },
    },
    {
      name: "processingLevel",
      label: "Processing Level",
      component: SelectProcessingLevel,
      cellProps: { md: 2.4 },
    },
    {
      name: "fruitsVegNutsPercent",
      label: "Fruits Vegetable and Nuts",
      component: InputRedux,
      InputProps: { readOnly: true },
      cellProps: { md: 2.4 },
    },
    {
      name: "HNSSProductCategory",
      label: "HNSS Product Category",
      component: SelectHNSSProductCategory,
      ComboBoxProps: {
        multiple: false,
        options:[],
        disabled:true
      },
      cellProps: { md: 2.4 },
    },
    {
      name: "carbsCount",
      label: "Carbs Count",
      component: InputRedux,
      InputProps: { readOnly: true },
      normalize: digitOrFloat,
      cellProps: { md: 2.4 },
    },
  ];

  return isDraft ? simpleFields : requiredFields;
};
export const ingredientFields = (isDraft: boolean): ReduxFormField[] => {
  const requiredFieldsArray = [
    {
      name: "ingredientDescription",
      label: "Ingredient Description",
      component: InputRedux,
      validate: [required],
      cellProps: { md: 4 },
    },
    {
      name: "ingredientContent",
      label: "Ingredient Content (%)",
      component: InputRedux,
      cellProps: { md: 4 },
    },
    {
      name: "ingredientCode",
      label: "Ingredient Code",
      component: InputRedux,
      cellProps: { md: 4 },
    },
  ];

  const simpleFieldsArray = [
    {
      name: "ingredientDescription",
      label: "Ingredient Description",
      component: InputRedux,
      cellProps: { md: 4 },
    },
    {
      name: "ingredientContent",
      label: "Ingredient Content (%)",
      component: InputRedux,
      cellProps: { md: 4 },
    },
    {
      name: "ingredientCode",
      label: "Ingredient Code",
      component: InputRedux,
      cellProps: { md: 4 },
    },
  ];

  return [
    {
      name: "ingredients",
      label: "",
      component: ReduxFieldArray,
      reduxFormComponent: "FieldArray" as const,
      upperLayout: false,
      fieldsArray: isDraft ? simpleFieldsArray : requiredFieldsArray,
    },
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

