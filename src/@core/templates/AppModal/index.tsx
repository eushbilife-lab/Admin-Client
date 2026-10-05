import { lazy } from "react";
import { MODAL } from "redux/slices/modal";
import AddMajorFoodIntolerance from "./AddMajorFoodIntolerance";
import AddMinorFoodIntolerance from "./AddMinorFoodIntolerance";

const ADDFOPLCertificate = lazy(() => import("./AddFOPLCertificate"));
const ADDUOM = lazy(() => import("./AddUOM"));
const ADDFOODTYPE= lazy(() => import("./AddFoodType"));
const ADDBrand = lazy(() => import("./AddBrand"));
const ADDManufacturer = lazy(() => import("./AddManufacturer"));
const ADDIngredient = lazy(() => import("./AddIngredient"));

const ADDIngredientInProduct = lazy(() => import("./AddIngredientInProduct"));
const ADDRdaInProduct = lazy(() => import("./AddRdaInProduct"));
const AddNutrition= lazy(() => import("./AddNutrition"));
const AddMajorAllergy= lazy(() => import("./AddMajorAllergy"));
const AddMinorAllergy= lazy(() => import("./AddMinorAllergy"));
const ConfirmationForm = lazy(() => import("./ConfirmationForm"));
const ExportTableOptions = lazy(() => import("./ExportTableOptions"));


export { default } from "./AppModal";

export type ModalMapper = {
  [key in MODAL]: "" | JSX.Element;
};

export const modalMapper: ModalMapper = {
  ADD_FOPLCERTIFICATE: <ADDFOPLCertificate />,
  ADD_UOM:<ADDUOM />,
  ADD_FOODTYPE:<ADDFOODTYPE />,
  ADD_BRAND: <ADDBrand />,
  ADD_MANUFACTURER: <ADDManufacturer />,
  ADD_INGREDIENT: <ADDIngredient />,
  ADD_INGREDIENT_IN_PRODUCT:<ADDIngredientInProduct />,
  ADD_RDA_IN_PRODUCT:<ADDRdaInProduct />,
  ADD_NUTRITION:< AddNutrition/>,
  ADD_MAJOR_ALLERGY:< AddMajorAllergy/>,
  ADD_MINOR_ALLERGY:< AddMinorAllergy/>,
  ADD_MAJOR_FOOD_INTOLERANCE:< AddMajorFoodIntolerance/>,
  ADD_MINOR_FOOD_INTOLERANCE:< AddMinorFoodIntolerance/>,
  CONFIRMATION_FORM: <ConfirmationForm />,
  EXPORT_TABLE_OPTIONS: <ExportTableOptions />,
};
