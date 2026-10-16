import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PageShell from "@core/templates/PageShell";
import CircleLoader from "@core/basic-components/CircleLoader";
import SelectDiet from "@core/api-components/SelectDiet";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import recipeService from "services/recipe.service";
import { recipeActions } from "redux/slices/recipe";
import { optionId, optionLabel } from "utils/selectOption.util";
import ToasterService from "utils/toaster.util";
import "./Recipes.css";

type IngredientRow = {
  name: string;
  quantity: string;
  unit: string;
  note: string;
};

const emptyIngredient = (): IngredientRow => ({
  name: "",
  quantity: "",
  unit: "",
  note: "",
});

const TAG_OPTIONS = [
  "high-protein",
  "meal-prep",
  "gluten-free",
  "dairy-free",
  "quick",
  "family",
  "low-carb",
];

export default function RecipeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { recipe, loading } = useAppSelector((state) => state.recipe);
  const isNew = !id || id === "new";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [servings, setServings] = useState(2);
  const [prepMinutes, setPrepMinutes] = useState(10);
  const [cookMinutes, setCookMinutes] = useState(20);
  const [difficulty, setDifficulty] = useState("easy");
  const [mealType, setMealType] = useState("any");
  const [imageUrl, setImageUrl] = useState("");
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [fiber, setFiber] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [diets, setDiets] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    emptyIngredient(),
  ]);
  const [stepsText, setStepsText] = useState("");
  const [tipsText, setTipsText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) recipeService.get(id, dispatch);
    return () => {
      dispatch(recipeActions.setRecipe(null));
    };
  }, [dispatch, id, isNew]);

  useEffect(() => {
    if (isNew || !recipe?._id) return;
    setName(recipe.name || "");
    setDescription(recipe.description || "");
    setStatus(recipe.status || "draft");
    setServings(recipe.servings || 1);
    setPrepMinutes(recipe.prepMinutes || 0);
    setCookMinutes(recipe.cookMinutes || 0);
    setDifficulty(recipe.difficulty || "easy");
    setMealType(recipe.mealType || "any");
    setImageUrl(recipe.imageUrl || recipe.thumbnailUrl || "");
    setCalories(recipe.nutrition?.calories ?? recipe.calories ?? 0);
    setProtein(recipe.nutrition?.protein ?? recipe.protein ?? 0);
    setCarbs(recipe.nutrition?.carbs ?? recipe.carbs ?? 0);
    setFat(recipe.nutrition?.fat ?? recipe.fat ?? 0);
    setFiber(recipe.nutrition?.fiber ?? 0);
    setTags(recipe.tags || []);
    setDiets(
      (recipe.diets || []).map((d: any) => ({
        value: d.value || d._id,
        label: d.label || d.name,
      }))
    );
    setIngredients(
      (recipe.ingredients || []).length
        ? recipe.ingredients.map((row: any) => ({
            name: row.name || "",
            quantity:
              row.quantity == null || row.quantity === ""
                ? ""
                : String(row.quantity),
            unit: row.unit || "",
            note: row.note || "",
          }))
        : [emptyIngredient()]
    );
    setStepsText((recipe.steps || []).join("\n"));
    setTipsText((recipe.tips || []).join("\n"));
  }, [recipe, isNew]);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const updateIngredient = (
    index: number,
    field: keyof IngredientRow,
    value: string
  ) => {
    setIngredients((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const buildPayload = () => {
    const dietIDs = (diets || [])
      .map((d) => optionId(d) || d?.value)
      .filter(Boolean);
    return {
      name: name.trim(),
      description: description.trim(),
      status,
      servings,
      prepMinutes,
      cookMinutes,
      difficulty,
      mealType,
      imageUrl: imageUrl.trim(),
      thumbnailUrl: imageUrl.trim(),
      dietIDs,
      tags,
      ingredients: ingredients
        .filter((row) => row.name.trim())
        .map((row) => ({
          name: row.name.trim(),
          quantity: row.quantity === "" ? null : Number(row.quantity),
          unit: row.unit.trim(),
          note: row.note.trim(),
        })),
      steps: stepsText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
      tips: tipsText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
      nutrition: {
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        fiber: Number(fiber) || 0,
      },
    };
  };

  const save = async () => {
    if (!name.trim()) {
      ToasterService.showError("Name is required");
      return;
    }
    if (!diets?.length) {
      ToasterService.showError("Select at least one diet");
      return;
    }
    const payload = buildPayload();
    if (!payload.ingredients.length) {
      ToasterService.showError("Add at least one ingredient");
      return;
    }
    if (!payload.steps.length) {
      ToasterService.showError("Add at least one recipe step");
      return;
    }

    setSaving(true);
    const [success] = isNew
      ? await recipeService.create(payload, dispatch)
      : await recipeService.update(id!, payload, dispatch);
    setSaving(false);
    if (success) {
      ToasterService.showSuccess(isNew ? "Recipe created" : "Recipe saved");
      navigate("/recipes");
    }
  };

  return (
    <PageShell
      kicker="Foods"
      title={isNew ? "New recipe" : recipe?.name || "Edit recipe"}
      subtitle="Tag diets so members with that profile diet see this meal. Publish when ready for the app."
      actions={
        <>
          <Button variant="outlined" onClick={() => navigate("/recipes")}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={save}
            disabled={!name.trim() || saving}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </>
      }
    >
      {(loading || saving) && <CircleLoader />}
      <form
        className="recipe-form"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          placeholder="Short story for the member app"
        />
        <TextField
          label="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          fullWidth
          placeholder="https://"
        />

        <div className="recipe-form__row">
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
          </TextField>
          <TextField
            select
            label="Meal type"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            fullWidth
          >
            <MenuItem value="any">Any</MenuItem>
            <MenuItem value="breakfast">Breakfast</MenuItem>
            <MenuItem value="lunch">Lunch</MenuItem>
            <MenuItem value="dinner">Dinner</MenuItem>
            <MenuItem value="snack">Snack</MenuItem>
          </TextField>
          <TextField
            select
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            fullWidth
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </TextField>
        </div>

        <div className="recipe-form__row">
          <TextField
            type="number"
            label="Servings"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            fullWidth
            inputProps={{ min: 1 }}
          />
          <TextField
            type="number"
            label="Prep minutes"
            value={prepMinutes}
            onChange={(e) => setPrepMinutes(Number(e.target.value))}
            fullWidth
            inputProps={{ min: 0 }}
          />
          <TextField
            type="number"
            label="Cook minutes"
            value={cookMinutes}
            onChange={(e) => setCookMinutes(Number(e.target.value))}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </div>

        <SelectDiet
          label="Diets (who should see this)"
          multiple
          value={diets}
          onChange={setDiets}
        />
        {diets?.length ? (
          <Typography variant="body2" color="text.secondary">
            Selected: {diets.map((d) => optionLabel(d, "")).join(", ")}
          </Typography>
        ) : null}

        <div className="recipe-form__row">
          <TextField
            type="number"
            label="Calories / serving"
            value={calories}
            onChange={(e) => setCalories(Number(e.target.value))}
            fullWidth
          />
          <TextField
            type="number"
            label="Protein (g)"
            value={protein}
            onChange={(e) => setProtein(Number(e.target.value))}
            fullWidth
          />
          <TextField
            type="number"
            label="Carbs (g)"
            value={carbs}
            onChange={(e) => setCarbs(Number(e.target.value))}
            fullWidth
          />
          <TextField
            type="number"
            label="Fat (g)"
            value={fat}
            onChange={(e) => setFat(Number(e.target.value))}
            fullWidth
          />
          <TextField
            type="number"
            label="Fiber (g)"
            value={fiber}
            onChange={(e) => setFiber(Number(e.target.value))}
            fullWidth
          />
        </div>

        <fieldset className="recipe-form__tags">
          <legend>Tags</legend>
          <div className="chip-row">
            {TAG_OPTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`recipe-tag${tags.includes(tag) ? " is-on" : ""}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </fieldset>

        <section className="recipe-ingredients">
          <div className="recipe-section-head">
            <Typography variant="h6">Ingredients</Typography>
            <Button
              size="small"
              onClick={() => setIngredients((prev) => [...prev, emptyIngredient()])}
            >
              Add line
            </Button>
          </div>
          {ingredients.map((row, index) => (
            <div className="recipe-form__row recipe-ingredient-row" key={index}>
              <TextField
                label="Ingredient"
                value={row.name}
                onChange={(e) => updateIngredient(index, "name", e.target.value)}
                fullWidth
              />
              <TextField
                label="Qty"
                value={row.quantity}
                onChange={(e) =>
                  updateIngredient(index, "quantity", e.target.value)
                }
                sx={{ maxWidth: 100 }}
              />
              <TextField
                label="Unit"
                value={row.unit}
                onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                sx={{ maxWidth: 120 }}
                placeholder="g, cup…"
              />
              <TextField
                label="Note"
                value={row.note}
                onChange={(e) => updateIngredient(index, "note", e.target.value)}
                fullWidth
              />
              <IconButton
                aria-label="Remove ingredient"
                onClick={() =>
                  setIngredients((prev) =>
                    prev.length === 1
                      ? [emptyIngredient()]
                      : prev.filter((_, i) => i !== index)
                  )
                }
              >
                <DeleteOutlineIcon />
              </IconButton>
            </div>
          ))}
        </section>

        <TextField
          label="Steps (one per line)"
          value={stepsText}
          onChange={(e) => setStepsText(e.target.value)}
          fullWidth
          multiline
          minRows={5}
          placeholder={"1. Prep vegetables\n2. Cook base\n3. Finish and serve"}
        />
        <TextField
          label="Tips (one per line)"
          value={tipsText}
          onChange={(e) => setTipsText(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          placeholder="Make ahead · Swap quinoa for rice"
        />
      </form>
    </PageShell>
  );
}
