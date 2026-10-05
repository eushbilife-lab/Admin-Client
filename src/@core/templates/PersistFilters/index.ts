import { ContactType } from "redux/slices/contact";

export { default } from "./PersistFilters";

export interface PersistFiltersProps {
  type?: ContactType;
  form:
    | "level1FiltersForm"
    | "level2FiltersForm"
    | "level3FiltersForm"
    | "level4FiltersForm"
    | "ContactFiltersForm"
}
