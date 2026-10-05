import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import UserService from "services/user.service";
import { userActions } from "redux/slices/user";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";

function MacroRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="macro-bar">
      <span>{label}</span>
      <div className="macro-bar__track">
        <div className="macro-bar__fill" style={{ width: `${Math.min(value, 100)}%`, background: color }} />
      </div>
      <strong>{Math.round(value)}%</strong>
    </div>
  );
}

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.user);
  const nutrition = user?.nutrition || user?.profiles?.[0];

  useEffect(() => {
    if (id) UserService.getUser(id, dispatch);
    return () => {
      dispatch(userActions.setUser(null));
    };
  }, [id, dispatch]);

  const name = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Member";

  return (
    <PageShell
      kicker="Nutrition file"
      title={name || "Member"}
      subtitle={user?.email || "BMI, calorie targets, macros, allergies, and diet from the live app."}
      actions={
        <>
          <Button variant="outlined" onClick={() => navigate("/users")}>
            All members
          </Button>
          <Button variant="contained" onClick={() => navigate(`/update-users/${id}`)}>
            Edit account
          </Button>
        </>
      }
    >
      {loading && <CircleLoader />}
      {!user && !loading ? <p>Member not found.</p> : null}
      {user ? (
        <>
          <div className="member-stat-grid">
            <article className="member-panel">
              <p className="page-shell__kicker">BMI</p>
              <h2>{nutrition?.bmi?.value ? Number(nutrition.bmi.value).toFixed(1) : "—"}</h2>
              <p>{nutrition?.bmi?.category || "No measurement yet"}</p>
            </article>
            <article className="member-panel">
              <p className="page-shell__kicker">Daily energy</p>
              <h2>
                {nutrition?.dailyCalories?.max
                  ? `${nutrition.dailyCalories.min}–${nutrition.dailyCalories.max}`
                  : "—"}
              </h2>
              <p>kcal target from the app</p>
            </article>
            <article className="member-panel">
              <p className="page-shell__kicker">Logged today</p>
              <h2>{nutrition?.consumedCalories || 0}</h2>
              <p>kcal consumed</p>
            </article>
            <article className="member-panel">
              <p className="page-shell__kicker">Profiles</p>
              <h2>{user.totalProfiles || user.profiles?.length || 0}</h2>
              <p>{user.phone?.number || "No phone"}</p>
            </article>
          </div>

          <div className="member-hero">
            <section className="member-panel">
              <h2>Lifestyle</h2>
              <div className="chip-row">
                {nutrition?.diet ? <StatusChip label={`Diet · ${nutrition.diet}`} tone="ok" /> : <StatusChip label="No diet set" tone="warn" />}
                {nutrition?.target ? <StatusChip label={`Goal · ${nutrition.target}`} tone="info" /> : null}
                {nutrition?.exerciseLevel ? <StatusChip label={nutrition.exerciseLevel} tone="info" /> : null}
                <StatusChip label={user.currentStatus || "active"} tone="ok" />
              </div>
              <p style={{ marginTop: "0.85rem" }}>
                {nutrition?.weight?.value
                  ? `${nutrition.weight.value} ${nutrition.weight.unit} · ${nutrition.height?.value || "—"} ${nutrition.height?.unit || ""} · age ${nutrition.age || "—"}`
                  : "This household has not finished onboarding body metrics."}
              </p>
            </section>
            <section className="member-panel">
              <h2>Macro split</h2>
              <MacroRow label="Protein" value={nutrition?.macros?.protein || 0} color="#0068F7" />
              <MacroRow label="Carbs" value={nutrition?.macros?.carbs || 0} color="#945AF8" />
              <MacroRow label="Fat" value={nutrition?.macros?.fat || 0} color="#EAB308" />
            </section>
          </div>

          <div className="member-hero">
            <section className="member-panel">
              <h2>Allergies & safety</h2>
              <div className="chip-row">
                {(nutrition?.allergies || []).length
                  ? nutrition.allergies.map((item: string) => <StatusChip key={item} label={item} tone="danger" />)
                  : <StatusChip label="No allergies on file" tone="ok" />}
              </div>
              {(nutrition?.healthIssues || []).length ? (
                <div className="chip-row" style={{ marginTop: "0.65rem" }}>
                  {nutrition.healthIssues.map((item: string) => (
                    <StatusChip key={item} label={item} tone="warn" />
                  ))}
                </div>
              ) : null}
            </section>
            <section className="member-panel">
              <h2>Micronutrient goals</h2>
              <div className="chip-row">
                {(nutrition?.nutrientGoals?.vitamins || []).slice(0, 8).map((item: any) => (
                  <StatusChip key={item.key || item.name} label={item.name || item.key} tone="info" />
                ))}
                {(nutrition?.nutrientGoals?.minerals || []).slice(0, 6).map((item: any) => (
                  <StatusChip key={item.key || item.name} label={item.name || item.key} tone="ok" />
                ))}
                {!(nutrition?.nutrientGoals?.vitamins || []).length &&
                !(nutrition?.nutrientGoals?.minerals || []).length ? (
                  <StatusChip label="No micronutrient goals yet" tone="warn" />
                ) : null}
              </div>
            </section>
          </div>
        </>
      ) : null}
    </PageShell>
  );
}
