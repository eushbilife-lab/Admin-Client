import { useCallback, useEffect, useState } from "react";
import { Button, Skeleton } from "@mui/material";
import StatusChip from "@core/templates/PageShell/StatusChip";
import dietPlanService from "services/dietPlan.service";
import ToasterService from "utils/toaster.util";

const GOAL_LABEL: Record<string, string> = {
  weight_loss: "Lose weight",
  maintenance: "Maintain",
  muscle_gain: "Gain / muscle",
};

export default function DietPlanTemplates() {
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [success, error]: any = await dietPlanService.getTemplates();
    setLoading(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Failed to load templates"
      );
      return;
    }
    const list = success?.data?.data?.templates || [];
    setSummaries(list);
    if (list[0]?.id) {
      void openTemplate(list[0].id);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openTemplate = async (id: string) => {
    setActiveId(id);
    setDetailLoading(true);
    const [success, error]: any = await dietPlanService.getTemplate(id);
    setDetailLoading(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Template not found"
      );
      return;
    }
    setDetail(success?.data?.data?.template || null);
  };

  return (
    <div className="diet-tab">
      <p className="diet-tab__intro">
        Read-only catalog of personalized day templates used by the User API
        (loss / maintain / gain / PCOS). Syncs with code on the User server.
      </p>

      {loading ? <Skeleton height={200} sx={{ borderRadius: 2 }} /> : null}

      <div className="diet-templates">
        <aside className="diet-templates__list">
          {summaries.map((t) => (
            <button
              key={t.id}
              type="button"
              className={
                activeId === t.id
                  ? "diet-templates__item is-active"
                  : "diet-templates__item"
              }
              onClick={() => void openTemplate(t.id)}
            >
              <strong>{t.title}</strong>
              <span>{GOAL_LABEL[t.goal] || t.goal}</span>
              <small>
                ~{t.calorieTarget} kcal · {t.mealCount} meals
              </small>
            </button>
          ))}
        </aside>

        <section className="diet-templates__detail diet-detail__card">
          {detailLoading ? (
            <Skeleton height={240} sx={{ borderRadius: 2 }} />
          ) : null}
          {!detailLoading && detail ? (
            <>
              <header className="diet-templates__head">
                <div>
                  <h3>{detail.title}</h3>
                  <p>{detail.subtitle}</p>
                </div>
                <StatusChip
                  label={GOAL_LABEL[detail.goal] || detail.goal}
                  tone="ok"
                />
              </header>
              <p className="diet-muted">
                ID <code>{detail.id}</code>
                {detail.flyerAsset ? ` · Flyer: ${detail.flyerAsset}` : ""}
                {detail.calorieNote ? ` · ${detail.calorieNote}` : ""}
              </p>
              <div className="diet-tags">
                {(detail.tags || []).map((tag: string) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              {(detail.meals || []).map((meal: any) => (
                <div key={meal.key} className="diet-meal">
                  <strong>
                    {meal.title}
                    {meal.timeHint ? ` · ${meal.timeHint}` : ""}
                    {meal.approxCalories
                      ? ` · ~${meal.approxCalories} kcal`
                      : ""}
                  </strong>
                  <ul>
                    {(meal.items || []).map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {detail.guidelines?.length ? (
                <>
                  <h4>Guidelines</h4>
                  <ul>
                    {detail.guidelines.map((g: string, i: number) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              {detail.portionGuide?.length ? (
                <>
                  <h4>Portion guide</h4>
                  <ul>
                    {detail.portionGuide.map((g: string, i: number) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              {detail.productTip?.name ? (
                <>
                  <h4>{detail.productTip.name}</h4>
                  <p>{detail.productTip.howToUse}</p>
                </>
              ) : null}
            </>
          ) : null}
          {!detailLoading && !detail ? (
            <p className="store-empty">Select a template.</p>
          ) : null}
        </section>
      </div>

      <div className="diet-toolbar" style={{ marginTop: 12 }}>
        <Button size="small" variant="outlined" onClick={() => void load()}>
          Refresh catalog
        </Button>
      </div>
    </div>
  );
}
