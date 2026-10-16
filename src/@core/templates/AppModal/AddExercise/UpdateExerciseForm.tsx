import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";

function asCsv(value: unknown) {
  if (!value) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

function asLines(value: unknown) {
  if (!value) return "";
  if (Array.isArray(value)) return value.join("\n");
  return String(value);
}

export default function UpdateExerciseForm() {
  const form = "AddExerciseForm";
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.modal.data);

  useEffect(() => {
    if (!data?.data || Object.keys(data.data).length === 0) return;
    const row = data.data;
    const levels =
      row.exerciseLevels ||
      (row.exerciseLevelIDs || []).map((id: any) =>
        typeof id === "object"
          ? { value: id.value || id._id, label: id.label || id.name || "" }
          : { value: id, label: String(id) }
      );

    dispatch(change(form, "status", row.status === "active"));
    dispatch(change(form, "en.name", row.name || row.en?.name || ""));
    dispatch(change(form, "description", row.description || ""));
    dispatch(change(form, "exerciseLevelIDs", levels));
    dispatch(
      change(form, "difficulty", {
        value: row.difficulty || "beginner",
        label:
          String(row.difficulty || "beginner").charAt(0).toUpperCase() +
          String(row.difficulty || "beginner").slice(1),
      })
    );
    dispatch(change(form, "durationMinutes", row.durationMinutes ?? ""));
    dispatch(change(form, "videoUrl", row.videoUrl || ""));
    dispatch(change(form, "thumbnailUrl", row.thumbnailUrl || ""));
    dispatch(
      change(form, "caloriesBurnPerMinute", row.caloriesBurnPerMinute ?? "")
    );
    dispatch(change(form, "muscleGroups", asCsv(row.muscleGroups)));
    dispatch(change(form, "equipment", asCsv(row.equipment)));
    dispatch(change(form, "instructions", asLines(row.instructions)));
  }, [data, dispatch]);

  return null;
}
