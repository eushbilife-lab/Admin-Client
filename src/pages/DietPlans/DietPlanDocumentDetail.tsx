import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Skeleton } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import dietPlanService from "services/dietPlan.service";
import ToasterService from "utils/toaster.util";

const GOAL_LABEL: Record<string, string> = {
  weight_loss: "Lose weight",
  maintenance: "Maintain",
  muscle_gain: "Gain / muscle",
};

export default function DietPlanDocumentDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [doc, setDoc] = useState<any>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [success, error]: any = await dietPlanService.getDocument(id);
    setLoading(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Document not found"
      );
      return;
    }
    setDoc(success?.data?.data?.document || null);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const snap = doc?.planSnapshot || {};
  const meals = Array.isArray(snap.meals) ? snap.meals : [];
  const guidelines = Array.isArray(snap.guidelines) ? snap.guidelines : [];
  const portionGuide = Array.isArray(snap.portionGuide) ? snap.portionGuide : [];
  const profile = snap.profileSnapshot || doc?.profile || {};
  const user = doc?.user || {};

  return (
    <PageShell
      kicker="Diet plans"
      title={doc?.title || "Generated plan"}
      subtitle="Personalized day plan document with PDF"
      actions={
        <>
          <Button variant="outlined" onClick={() => navigate("/diet-plans?tab=documents")}>
            Back
          </Button>
          {doc?.pdfUrl ? (
            <Button
              variant="contained"
              href={doc.pdfUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open PDF
            </Button>
          ) : null}
        </>
      }
    >
      {loading ? <Skeleton height={320} sx={{ borderRadius: 2 }} /> : null}
      {!loading && !doc ? (
        <p className="store-empty">Document not found.</p>
      ) : null}

      {!loading && doc ? (
        <div className="diet-detail">
          <section className="diet-detail__card">
            <header>
              <h3>Summary</h3>
              <StatusChip label={doc.source || "api"} tone="info" />
            </header>
            <dl className="diet-dl">
              <div>
                <dt>Member</dt>
                <dd>
                  {[user.firstName, user.lastName].filter(Boolean).join(" ") ||
                    "—"}
                  {user.email ? ` · ${user.email}` : ""}
                </dd>
              </div>
              <div>
                <dt>Goal</dt>
                <dd>{GOAL_LABEL[doc.goal] || doc.goal || "—"}</dd>
              </div>
              <div>
                <dt>Template</dt>
                <dd>
                  <code>{doc.templateId}</code>
                </dd>
              </div>
              <div>
                <dt>Calories</dt>
                <dd>{doc.calorieTarget ? `~${doc.calorieTarget} kcal` : "—"}</dd>
              </div>
              <div>
                <dt>Profile snapshot</dt>
                <dd>
                  {[profile.firstName, profile.target || profile.diet]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>
                  {doc.createdAt
                    ? new Date(doc.createdAt).toLocaleString()
                    : "—"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="diet-detail__card">
            <h3>Meals</h3>
            {!meals.length ? <p className="diet-muted">No meal snapshot.</p> : null}
            {meals.map((meal: any, idx: number) => (
              <div key={meal.key || idx} className="diet-meal">
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
          </section>

          {guidelines.length ? (
            <section className="diet-detail__card">
              <h3>Guidelines</h3>
              <ul>
                {guidelines.map((g: string, i: number) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {portionGuide.length ? (
            <section className="diet-detail__card">
              <h3>Portion guide</h3>
              <ul>
                {portionGuide.map((g: string, i: number) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {snap.productTip?.name ? (
            <section className="diet-detail__card">
              <h3>{snap.productTip.name}</h3>
              <p>{snap.productTip.howToUse}</p>
              {(snap.productTip.warnings || []).map((w: string, i: number) => (
                <p key={i} className="diet-muted">
                  ⚠ {w}
                </p>
              ))}
            </section>
          ) : null}
        </div>
      ) : null}
    </PageShell>
  );
}
