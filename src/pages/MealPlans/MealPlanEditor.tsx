import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, MenuItem, Skeleton, TextField } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import mealPlanService from "services/mealPlan.service";
import Promisable from "services/promisable.service";
import http from "services/http.service";
import ToasterService from "utils/toaster.util";
import "./MealPlans.css";

type RecipeOption = {
  id: string;
  name: string;
  calories?: number;
  tags?: string[];
};

export default function MealPlanEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("weight_loss");
  const [weeks, setWeeks] = useState(4);
  const [status, setStatus] = useState("draft");
  const [picked, setPicked] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<RecipeOption[]>([]);

  const loadRecipes = useCallback(async () => {
    http.setJWT();
    const [success]: any = await Promisable.asPromise(
      http.post("/recipes/get-All", {
        page: 1,
        page_size: 200,
        isDelete: false,
      })
    );
    const rows = success?.data?.data?.recipes || [];
    setRecipes(
      rows.map((r: any) => ({
        id: String(r._id || r.id),
        name: r.title || r.name || "Untitled",
        calories: r.calories,
        tags: r.tags || [],
      }))
    );
  }, []);

  const loadPlan = useCallback(async () => {
    if (isNew || !id) return;
    setLoading(true);
    const [success, error]: any = await mealPlanService.getOne(id);
    setLoading(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Failed to load meal plan"
      );
      navigate("/meal-plans");
      return;
    }
    const plan = success?.data?.data?.plan;
    if (!plan) {
      navigate("/meal-plans");
      return;
    }
    setTitle(plan.title || "");
    setDescription(plan.description || "");
    setGoal(plan.goal || "weight_loss");
    setWeeks(Number(plan.weeks) || 4);
    setStatus(plan.status || "draft");
    setPicked((plan.recipeIds || []).map((x: any) => String(x)));
  }, [id, isNew, navigate]);

  useEffect(() => {
    void loadRecipes();
    void loadPlan();
  }, [loadRecipes, loadPlan]);

  const toggle = (recipeId: string) => {
    setPicked((prev) =>
      prev.includes(recipeId)
        ? prev.filter((x) => x !== recipeId)
        : [...prev, recipeId]
    );
  };

  const save = async () => {
    if (!title.trim()) {
      ToasterService.showError("Title is required");
      return;
    }
    const payload = {
      title: title.trim(),
      description: description.trim(),
      goal,
      weeks,
      status,
      recipeIds: picked,
    };
    setSaving(true);
    const [success, error]: any = isNew
      ? await mealPlanService.create(payload)
      : await mealPlanService.update(String(id), payload);
    setSaving(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Could not save meal plan"
      );
      return;
    }
    ToasterService.showSuccess(
      success?.data?.message || (isNew ? "Meal plan created" : "Meal plan saved")
    );
    navigate("/meal-plans");
  };

  if (loading) {
    return (
      <PageShell title="Meal plan" subtitle="Loading…">
        <Skeleton variant="rounded" height={360} />
      </PageShell>
    );
  }

  return (
    <PageShell
      kicker="Content"
      title={isNew ? "New meal plan" : title || "Edit plan"}
      subtitle="Assign recipes to a weekly cadence. Published plans sync to the mobile app."
      actions={
        <>
          <Button variant="outlined" onClick={() => navigate("/meal-plans")}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => void save()}
            disabled={!title.trim() || saving}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </>
      }
    >
      <div className="meal-plan-editor">
        <div className="meal-plan-editor__fields">
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
          <div className="meal-plan-editor__row">
            <TextField
              select
              label="Goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              fullWidth
            >
              <MenuItem value="weight_loss">Weight loss</MenuItem>
              <MenuItem value="muscle_gain">Muscle gain</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
            </TextField>
            <TextField
              type="number"
              label="Weeks"
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              fullWidth
            />
            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </div>
        </div>

        <section className="meal-plan-editor__recipes">
          <h2>Recipes in plan</h2>
          <p>Select recipes to include. Order becomes the weekly rotation.</p>
          {!recipes.length ? (
            <p>No recipes found. Add recipes first, then attach them here.</p>
          ) : (
            <ul>
              {recipes.map((recipe) => (
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
                        {recipe.calories != null
                          ? `${recipe.calories} kcal`
                          : "—"}
                        {recipe.tags?.length
                          ? ` · ${recipe.tags.join(", ")}`
                          : ""}
                      </em>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageShell>
  );
}
