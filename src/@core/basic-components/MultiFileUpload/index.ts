export { default } from "./MultiFileUpload";
export interface FileUploadOwnProps {
  maxSize?: number;
  maxCount?: number;
  accept?: string[];
  width?: string;
  height?: string;
  setNull?: boolean;
  multiple?: boolean;
  sx?: any;
  defaultImage?: any;
  uploadIcon?: boolean;
  capture?: "environment";
  title?: string;
  previews?: any;
  setPreviews?: any;
}
