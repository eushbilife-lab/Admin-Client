import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Chip } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import { MOCK_RECIPES, type Recipe } from "mocks/nutritionProduct.mock";
import "./Recipes.css";

const STATUS_TONE: Record<Recipe["status"], "ok" | "warn" | "info"> = {
  published: "ok",
  draft: "warn",
  scheduled: "info",
};

export default function Recipes() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Recipe["status"]>("all");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_RECIPES.filter((item) => {
      if (status !== "all" && item.status !== status) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [query, status]);

  return (
    <PageShell
      kicker="Content"
      title="Recipes"
      subtitle="Builder with auto-calculated nutrition per serving. Mock data until the recipes API ships."
      actions={
        <Button variant="contained" onClick={() => navigate("/recipes/new")}>
          New recipe
        </Button>
      }
    >
      <div className="recipes-toolbar">
        <input
          className="recipes-search"
          type="search"
          placeholder="Search recipes or tags…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search recipes"
        />
        <div className="recipes-filters" role="group" aria-label="Status filter">
          {(["all", "published", "draft", "scheduled"] as const).map((key) => (
            <button
              key={key}
              type="button"
              className={`recipes-filters__btn${status === key ? " is-active" : ""}`}
              onClick={() => setStatus(key)}
            >
              {key === "all" ? "All" : key}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="recipes-empty">
          <h2>No recipes match</h2>
          <p>Try another search or clear filters.</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {items.map((recipe) => (
            <article key={recipe.id} className="recipe-card">
              <header className="recipe-card__head">
                <h2>{recipe.name}</h2>
                <StatusChip label={recipe.status} tone={STATUS_TONE[recipe.status]} />
              </header>
              <p className="recipe-card__macros">
                {recipe.calories} kcal · P {recipe.protein}g · C {recipe.carbs}g · F {recipe.fat}g
              </p>
              <p className="recipe-card__meta">
                {recipe.servings} servings · {recipe.cookMins} min
              </p>
              <div className="chip-row">
                {recipe.tags.map((tag) => (
                  <Chip key={tag} size="small" label={tag} />
                ))}
              </div>
              <button type="button" className="recipe-card__open" onClick={() => navigate(`/recipes/${recipe.id}`)}>
                Open
              </button>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}
