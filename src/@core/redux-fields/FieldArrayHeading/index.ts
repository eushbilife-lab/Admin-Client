export { default } from "./FieldArrayHeading";
export interface FieldArrayHeadingProps {
  index: number;
  heading: string;
  onClick: () => void;
  fieldsLength: number;
  addMore?: boolean;
  disabled?:boolean
}
