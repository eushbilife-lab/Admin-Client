import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, MenuItem, TextField } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import { MOCK_RECIPES } from "mocks/nutritionProduct.mock";
import ToasterService from "utils/toaster.util";
import "./Recipes.css";

const TAG_OPTIONS = ["vegan", "keto", "halal", "gluten-free", "high-protein", "vegetarian", "meal-prep"];

export default function RecipeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = useMemo(() => MOCK_RECIPES.find((item) => item.id === id), [id]);
  const isNew = !id || id === "new";

  const [name, setName] = useState(existing?.name || "");
  const [status, setStatus] = useState(existing?.status || "draft");
  const [servings, setServings] = useState(existing?.servings || 2);
  const [cookMins, setCookMins] = useState(existing?.cookMins || 20);
  const [calories, setCalories] = useState(existing?.calories || 0);
  const [protein, setProtein] = useState(existing?.protein || 0);
  const [carbs, setCarbs] = useState(existing?.carbs || 0);
  const [fat, setFat] = useState(existing?.fat || 0);
  const [tags, setTags] = useState<string[]>(existing?.tags || []);

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const save = () => {
    if (!name.trim()) return;
    ToasterService.showSuccess(isNew ? "Recipe created (mock)" : "Recipe saved (mock)");
    navigate("/recipes");
  };

  return (
    <PageShell
      kicker="Content"
      title={isNew ? "New recipe" : existing?.name || "Edit recipe"}
      subtitle="Nutrition is entered per serving for now. Live builder will pull from catalog foods."
      actions={
        <>
          <Button variant="outlined" onClick={() => navigate("/recipes")}>
            Cancel
          </Button>
          <Button variant="contained" onClick={save} disabled={!name.trim()}>
            Save
          </Button>
        </>
      }
    >
      <form
        className="recipe-form"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
        <div className="recipe-form__row">
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            fullWidth
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="scheduled">Scheduled</MenuItem>
          </TextField>
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
            label="Cook minutes"
            value={cookMins}
            onChange={(e) => setCookMins(Number(e.target.value))}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </div>
        <div className="recipe-form__row">
          <TextField type="number" label="Calories" value={calories} onChange={(e) => setCalories(Number(e.target.value))} fullWidth />
          <TextField type="number" label="Protein (g)" value={protein} onChange={(e) => setProtein(Number(e.target.value))} fullWidth />
          <TextField type="number" label="Carbs (g)" value={carbs} onChange={(e) => setCarbs(Number(e.target.value))} fullWidth />
          <TextField type="number" label="Fat (g)" value={fat} onChange={(e) => setFat(Number(e.target.value))} fullWidth />
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
      </form>
    </PageShell>
  );
}
