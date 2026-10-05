export { default, modalActions, modalSlice } from "./modalSlice";

export enum MODAL {
  ADD_FOPLCERTIFICATE = "ADD_FOPLCERTIFICATE",
  ADD_UOM = "ADD_UOM",
  ADD_FOODTYPE = "ADD_FOODTYPE",
  ADD_MANUFACTURER = "ADD_MANUFACTURER",
  ADD_BRAND = "ADD_BRAND",
  ADD_INGREDIENT = "ADD_INGREDIENT",
  ADD_INGREDIENT_IN_PRODUCT = "ADD_INGREDIENT_IN_PRODUCT",
  ADD_RDA_IN_PRODUCT = "ADD_RDA_IN_PRODUCT",
  ADD_NUTRITION = "ADD_NUTRITION",
    ADD_MAJOR_ALLERGY = "ADD_MAJOR_ALLERGY",
  ADD_MINOR_ALLERGY = "ADD_MINOR_ALLERGY",
  ADD_MAJOR_FOOD_INTOLERANCE = "ADD_MAJOR_FOOD_INTOLERANCE",
  ADD_MINOR_FOOD_INTOLERANCE = "ADD_MINOR_FOOD_INTOLERANCE",
  CONFIRMATION_FORM = "CONFIRMATION_FORM",
  EXPORT_TABLE_OPTIONS = "EXPORT_TABLE_OPTIONS",
}

export type ModalType = "" | keyof typeof MODAL;

export interface OpenModalState {
  data: any;
  width: any;
  type: ModalType;
  loading?: boolean;
  closeBackdropClick?: boolean;
}

export type ModalState = OpenModalState & {
  open: boolean;
};
