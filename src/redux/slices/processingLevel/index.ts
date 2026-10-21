export {
  default,
  processingLevelActions,
  processingLevelSlice,
} from "./processingLevelSlice";

export interface IProcessingLevelState {
  count: number;
  items: any[];
  options: any[];
  loading: boolean;
  refreshLoader: boolean;
  refresh: number;
  filters: { page: number; page_size: number; name?: string };
}

export interface SetProcessingLevelsPayload {
  items: any[];
  count: number;
}

export interface SetProcessingLevelOptionsPayload {
  options: any[];
}
