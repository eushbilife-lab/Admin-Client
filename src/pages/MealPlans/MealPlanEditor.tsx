import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, MenuItem, TextField } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import { MOCK_MEAL_PLANS, MOCK_RECIPES } from "mocks/nutritionProduct.mock";
import ToasterService from "utils/toaster.util";
import "./MealPlans.css";

export default function MealPlanEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = useMemo(() => MOCK_MEAL_PLANS.find((item) => item.id === id), [id]);
  const isNew = !id || id === "new";

  const [title, setTitle] = useState(existing?.title || "");
  const [goal, setGoal] = useState(existing?.goal || "weight_loss");
  const [weeks, setWeeks] = useState(existing?.weeks || 4);
  const [status, setStatus] = useState(existing?.status || "draft");
  const [picked, setPicked] = useState<string[]>(MOCK_RECIPES.slice(0, 3).map((r) => r.id));

  const toggle = (recipeId: string) => {
    setPicked((prev) => (prev.includes(recipeId) ? prev.filter((x) => x !== recipeId) : [...prev, recipeId]));
  };

  const save = () => {
    if (!title.trim()) return;
    ToasterService.showSuccess(isNew ? "Meal plan created (mock)" : "Meal plan saved (mock)");
    navigate("/meal-plans");
  };

  return (
    <PageShell
      kicker="Content"
      title={isNew ? "New meal plan" : existing?.title || "Edit plan"}
      subtitle="Assign recipes to a weekly cadence. Full drag-and-drop calendar is next."
      actions={
        <>
          <Button variant="outlined" onClick={() => navigate("/meal-plans")}>
            Cancel
          </Button>
          <Button variant="contained" onClick={save} disabled={!title.trim()}>
            Save
          </Button>
        </>
      }
    >
      <div className="meal-plan-editor">
        <div className="meal-plan-editor__fields">
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required />
          <div className="meal-plan-editor__row">
            <TextField select label="Goal" value={goal} onChange={(e) => setGoal(e.target.value as typeof goal)} fullWidth>
              <MenuItem value="weight_loss">Weight loss</MenuItem>
              <MenuItem value="muscle_gain">Muscle gain</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
            </TextField>
            <TextField type="number" label="Weeks" value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} fullWidth />
            <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} fullWidth>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
            </TextField>
          </div>
        </div>

        <section className="meal-plan-editor__recipes">
          <h2>Recipes in plan</h2>
          <p>Select recipes to include. Order becomes the weekly rotation.</p>
          <ul>
            {MOCK_RECIPES.map((recipe) => (
              <li key={recipe.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={picked.includes(recipe.id)}
                    onChange={() => toggle(recipe.id)}
                  />
                  <span>
                    <strong>{recipe.name}</strong>
                    <em>
                      {recipe.calories} kcal · {recipe.tags.join(", ")}
                    </em>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
