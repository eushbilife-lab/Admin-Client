import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import CheckboxRedux from "@core/redux-fields/CheckboxRedux";
import InputRedux from "@core/redux-fields/InputRedux";
import SelectExerciseLevel from "@core/api-components/SelectExerciseLevel";
import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import Button from "@core/basic-components/Button";
import { modalActions } from "redux/slices/modal";
import { useAppDispatch } from "redux/hooks";
import { reduxForm } from "redux-form";
import { Stack } from "@mui/material";
import { required } from "utils/validate.util";
import type { ReduxFormField } from "@core/redux-fields/ReduxFormFields";

const difficultyOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const fields: ReduxFormField[] = [
  {
    name: "status",
    label: "Active (shown in the app)",
    component: CheckboxRedux,
    cellProps: { md: 12 },
  },
  {
    name: "en.name",
    label: "Exercise name",
    component: InputRedux,
    validate: [required],
    hint: "e.g. Walking intervals, Bodyweight squats",
    cellProps: { md: 12 },
    InputProps: { type: "text", placeholder: "Exercise name" },
  },
  {
    name: "description",
    label: "Description",
    component: InputRedux,
    hint: "What this exercise is and who it suits.",
    cellProps: { md: 12 },
    InputProps: {
      type: "text",
      multiline: true,
      minRows: 3,
      placeholder: "Short coaching copy for members",
    },
  },
  {
    name: "exerciseLevelIDs",
    label: "Activity levels",
    component: SelectExerciseLevel,
    validate: [required],
    hint: "Members with these activity levels will see this exercise.",
    cellProps: { md: 12 },
  },
  {
    name: "difficulty",
    label: "Difficulty",
    component: ComboBoxRedux,
    validate: [required],
    cellProps: { md: 6 },
    ComboBoxProps: {
      options: difficultyOptions,
    },
  },
  {
    name: "durationMinutes",
    label: "Duration (minutes)",
    component: InputRedux,
    cellProps: { md: 6 },
    InputProps: { type: "number", placeholder: "15" },
  },
  {
    name: "videoUrl",
    label: "Video URL",
    component: InputRedux,
    validate: [required],
    hint: "YouTube, Vimeo, or hosted MP4 link",
    cellProps: { md: 12 },
    InputProps: { type: "url", placeholder: "https://" },
  },
  {
    name: "thumbnailUrl",
    label: "Thumbnail URL",
    component: InputRedux,
    cellProps: { md: 12 },
    InputProps: { type: "url", placeholder: "https://" },
  },
  {
    name: "caloriesBurnPerMinute",
    label: "Calories / minute",
    component: InputRedux,
    cellProps: { md: 6 },
    InputProps: { type: "number", placeholder: "5" },
  },
  {
    name: "muscleGroups",
    label: "Muscle groups",
    component: InputRedux,
    hint: "Comma-separated, e.g. legs, core",
    cellProps: { md: 6 },
    InputProps: { type: "text", placeholder: "legs, core" },
  },
  {
    name: "equipment",
    label: "Equipment",
    component: InputRedux,
    hint: "Comma-separated, e.g. none, mat, dumbbells",
    cellProps: { md: 12 },
    InputProps: { type: "text", placeholder: "none, mat" },
  },
  {
    name: "instructions",
    label: "Instructions",
    component: InputRedux,
    hint: "One step per line",
    cellProps: { md: 12 },
    InputProps: {
      type: "text",
      multiline: true,
      minRows: 4,
      placeholder: "1. Warm up\n2. Main set\n3. Cool down",
    },
  },
];

function AddExerciseForm({ handleSubmit }: any) {
  const dispatch = useAppDispatch();
  return (
    <form onSubmit={handleSubmit}>
      <ReduxFormFields fields={fields} />
      <br />
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={() => dispatch(modalActions.closeModal())}>
          Cancel
        </Button>
        <Button type="submit" disableElevation variant="contained">
          Save
        </Button>
      </Stack>
    </form>
  );
}

export default reduxForm({ form: "AddExerciseForm" })(AddExerciseForm);
