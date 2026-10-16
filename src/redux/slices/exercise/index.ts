export { default, exerciseActions, exerciseSlice } from "./exerciseSlice";

export interface IExerciseState {
  count: number;
  exercise: Record<string, unknown>;
  exercises: any[];
  loading: boolean;
  refresh: number;
  refreshLoader: boolean;
  current_filters: any;
  filters: any;
  exerciseOptions: any[];
}

export interface SetExercisesPayload {
  exercises: any[];
  count: number;
}

export interface SetExerciseOptionsPayload {
  exercises: any[];
}

export interface SetExercisePayload {
  data: {
    _id: any;
  };
}
