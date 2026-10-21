export { default } from "./TableLoader";

export interface TableLoaderProps {
  rows?: number;
  coloumns?: number;
  /** Render a header skeleton row (default true). */
  showHeader?: boolean;
}
