import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import exerciseService from "services/exercise.service";
import AddExerciseForm from "./AddExerciseForm";
import UpdateExerciseForm from "./UpdateExerciseForm";
import { useEffect } from "react";
import { change } from "redux-form";
import { optionId } from "utils/selectOption.util";

function splitList(value: unknown, byNewline = false) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  const text = String(value);
  const parts = byNewline
    ? text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    : text.split(",").map((part) => part.trim()).filter(Boolean);
  return parts;
}

export default function AddExercise() {
  const form = "AddExerciseForm";
  const { id } = useAppSelector((state) => state.modal.data);
  const { loading, filters } = useAppSelector((state) => state.exercise);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!id) {
      dispatch(change(form, "status", true));
      dispatch(
        change(form, "difficulty", { value: "beginner", label: "Beginner" })
      );
    }
  }, [dispatch, id]);

  const handleSubmit = (values: any) => {
    const enName = values?.en?.name || values?.name;
    const levelIds = (values.exerciseLevelIDs || [])
      .map((item: any) => optionId(item) || item?.value || item)
      .filter(Boolean);
    const difficulty =
      values?.difficulty?.value || values?.difficulty || "beginner";

    const data = {
      name: enName,
      en: { name: enName },
      ar: { name: enName },
      description: String(values.description || "").trim(),
      exerciseLevelIDs: levelIds,
      difficulty,
      durationMinutes: Number(values.durationMinutes) || 0,
      videoUrl: String(values.videoUrl || "").trim(),
      thumbnailUrl: String(values.thumbnailUrl || "").trim(),
      caloriesBurnPerMinute: Number(values.caloriesBurnPerMinute) || 0,
      muscleGroups: splitList(values.muscleGroups),
      equipment: splitList(values.equipment),
      instructions: splitList(values.instructions, true),
      status: values.status === true || values.status === "active" ? "active" : "inactive",
    };

    if (id) exerciseService.update(id, data, dispatch);
    else exerciseService.create(data, filters, dispatch);
  };

  return (
    <div>
      {loading && <CircleLoader />}
      <h3>{id ? "Update exercise" : "Add exercise"}</h3>
      <AddExerciseForm onSubmit={handleSubmit} />
      {id ? <UpdateExerciseForm /> : null}
    </div>
  );
}
