import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Chip, Pagination } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import recipeService from "services/recipe.service";
import { recipeActions } from "redux/slices/recipe";
import "./Recipes.css";

const STATUS_TONE: Record<string, "ok" | "warn" | "info"> = {
  published: "ok",
  active: "ok",
  draft: "warn",
  scheduled: "info",
  inactive: "warn",
};

export default function Recipes() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { recipes, loading, refresh, count, filters } = useAppSelector(
    (state) => state.recipe
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | string>("all");

  useEffect(() => {
    const payload: any = {
      page: filters.page || 1,
      page_size: filters.page_size || 24,
      isDelete: false,
    };
    if (status !== "all") payload.status = status;
    if (query.trim()) payload.name = query.trim();
    recipeService.getAll(payload, dispatch);
  }, [dispatch, refresh, filters.page, filters.page_size, status, query]);

  useEffect(() => {
    return () => {
      dispatch(recipeActions.resetPage());
    };
  }, [dispatch]);

  const items = useMemo(() => recipes || [], [recipes]);

  return (
    <PageShell
      kicker="Foods"
      title="Recipes"
      subtitle="Diet-tagged meals with ingredients, steps, and per-serving nutrition. Members see matches for their profile diet."
      actions={
        <Button variant="contained" onClick={() => navigate("/recipes/new")}>
          New recipe
        </Button>
      }
    >
      {loading ? <CircleLoader /> : null}
      <div className="recipes-toolbar">
        <input
          className="recipes-search"
          type="search"
          placeholder="Search recipes…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            dispatch(recipeActions.setPage(1));
          }}
          aria-label="Search recipes"
        />
        <div className="recipes-filters" role="group" aria-label="Status filter">
          {(["all", "published", "draft", "scheduled"] as const).map((key) => (
            <button
              key={key}
              type="button"
              className={`recipes-filters__btn${status === key ? " is-active" : ""}`}
              onClick={() => {
                setStatus(key);
                dispatch(recipeActions.setPage(1));
              }}
            >
              {key === "all" ? "All" : key}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 && !loading ? (
        <div className="recipes-empty">
          <h2>No recipes yet</h2>
          <p>Add a recipe and tag the diets it suits (vegan, keto, Mediterranean…).</p>
          <Button variant="contained" onClick={() => navigate("/recipes/new")}>
            New recipe
          </Button>
        </div>
      ) : (
        <div className="recipes-grid">
          {items.map((recipe: any) => (
            <article key={recipe._id} className="recipe-card">
              {recipe.imageUrl || recipe.thumbnailUrl ? (
                <img
                  className="recipe-card__image"
                  src={recipe.imageUrl || recipe.thumbnailUrl}
                  alt=""
                />
              ) : null}
              <header className="recipe-card__head">
                <h2>{recipe.name}</h2>
                <StatusChip
                  label={recipe.status || "draft"}
                  tone={STATUS_TONE[recipe.status] || "info"}
                />
              </header>
              <p className="recipe-card__macros">
                {recipe.nutrition?.calories ?? recipe.calories ?? 0} kcal · P{" "}
                {recipe.nutrition?.protein ?? recipe.protein ?? 0}g · C{" "}
                {recipe.nutrition?.carbs ?? recipe.carbs ?? 0}g · F{" "}
                {recipe.nutrition?.fat ?? recipe.fat ?? 0}g
              </p>
              <p className="recipe-card__meta">
                {recipe.servings || 1} servings ·{" "}
                {(recipe.prepMinutes || 0) + (recipe.cookMinutes || 0)} min ·{" "}
                {recipe.mealType || "any"}
              </p>
              <div className="chip-row">
                {(recipe.diets || []).map((diet: any) => (
                  <Chip
                    key={diet.value || diet._id}
                    size="small"
                    label={diet.label || diet.name}
                    color="primary"
                    variant="outlined"
                  />
                ))}
                {(recipe.tags || []).slice(0, 4).map((tag: string) => (
                  <Chip key={tag} size="small" label={tag} />
                ))}
              </div>
              <button
                type="button"
                className="recipe-card__open"
                onClick={() => navigate(`/recipes/${recipe._id}`)}
              >
                Open
              </button>
            </article>
          ))}
        </div>
      )}

      {count > (filters.page_size || 24) ? (
        <div className="pagination-list-bottom" style={{ marginTop: 16 }}>
          <Pagination
            page={filters.page || 1}
            count={Math.ceil(count / (filters.page_size || 24)) || 1}
            onChange={(_e, page) => dispatch(recipeActions.setPage(page))}
            color="primary"
          />
        </div>
      ) : null}
    </PageShell>
  );
}
