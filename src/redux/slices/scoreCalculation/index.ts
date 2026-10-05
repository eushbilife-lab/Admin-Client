export {
  default,
  scoreCalculationActions,
  scoreCalculationSlice,
} from "./scoreCalculationSlice";

export interface scoreCalculationState {
  count: number;
  loading: boolean;
  refresh: number;
  refreshLoader: boolean;
  scoreCalculations: any[];
  scoreCalculation: any;
  score:any;
  scoreCalculationOptions: any[];
  filters: any;
  current_filters: any;
}

export interface SetScoreCalculationsPayload {
  scoreCalculations: any[];
  count:number
}
