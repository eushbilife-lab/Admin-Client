import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import UserService from "services/user.service";
import { userActions } from "redux/slices/user";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import ToasterService from "utils/toaster.util";
import SuperAdminBlock from "@core/api-components/SuperAdminBlock";
import ConfirmDeleteButton from "@core/api-components/ConfirmDeleteButton";
import { MODAL, modalActions } from "redux/slices/modal";
import "pages/Users/Users.css";

function MacroRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="macro-bar">
      <span>{label}</span>
      <div className="macro-bar__track">
        <div
          className="macro-bar__fill"
          style={{ width: `${Math.min(value, 100)}%`, background: color }}
        />
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
  const profiles = user?.profiles || (nutrition ? [nutrition] : []);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (id) UserService.getUser(id, dispatch);
    return () => {
      dispatch(userActions.setUser(null));
    };
  }, [id, dispatch]);

  const name = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "User";

  const exportData = () => {
    if (!user) return;
    setBusy(true);
    const payload = {
      exportedAt: new Date().toISOString(),
      account: {
        id: user._id || id,
        email: user.email,
        name,
        phone: user.phone,
        status: user.currentStatus,
      },
      profiles,
      nutrition,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eushbi-user-${id}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
    ToasterService.showSuccess("User data exported");
    setBusy(false);
  };

  const suspend = () => {
    if (!id) return;
    dispatch(
      modalActions.openModal({
        type: MODAL.CONFIRMATION_FORM,
        data: {
          heading: "Suspend user",
          message: "Suspend this user’s access? They will not be able to sign in.",
          confirmAction: async () => {
            setBusy(true);
            const [, error]: any = await UserService.suspendUser(id, dispatch);
            setBusy(false);
            if (error) {
              ToasterService.showError(
                error?.response?.data?.message || "Suspend failed"
              );
              return;
            }
            ToasterService.showSuccess("User suspended");
          },
        },
        width: "500px",
      })
    );
  };

  return (
    <PageShell
      kicker="Users"
      title={name || "User"}
      subtitle={
        user?.email ||
        "BMI, calorie targets, macros, allergies, and diet from the live app."
      }
      actions={
        <div className="users-section-nav">
          <Button variant="outlined" onClick={() => navigate("/users")}>
            All users
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(`/update-users/${id}`)}
          >
            Edit
          </Button>
        </div>
      }
    >
      {loading && <CircleLoader />}
      {!user && !loading ? <p>User not found.</p> : null}
      {user ? (
        <>
          <div className="member-stat-grid">
            <article className="member-panel">
              <p className="page-shell__kicker">BMI</p>
              <h2>
                {nutrition?.bmi?.value
                  ? Number(nutrition.bmi.value).toFixed(1)
                  : "—"}
              </h2>
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
              <h2>{user.totalProfiles || profiles.length || 0}</h2>
              <p>{user.phone?.number || "No phone"}</p>
            </article>
          </div>

          <div className="member-hero">
            <section className="member-panel">
              <h2>Lifestyle</h2>
              <div className="chip-row">
                {nutrition?.diet ? (
                  <StatusChip label={`Diet · ${nutrition.diet}`} tone="ok" />
                ) : (
                  <StatusChip label="No diet set" tone="warn" />
                )}
                {nutrition?.target ? (
                  <StatusChip label={`Goal · ${nutrition.target}`} tone="info" />
                ) : null}
                {nutrition?.exerciseLevel ? (
                  <StatusChip label={nutrition.exerciseLevel} tone="info" />
                ) : null}
                <StatusChip
                  label={user.currentStatus || "active"}
                  tone={user.currentStatus === "inactive" ? "warn" : "ok"}
                />
              </div>
              <p style={{ marginTop: "0.85rem" }}>
                {nutrition?.weight?.value
                  ? `${nutrition.weight.value} ${nutrition.weight.unit} · ${
                      nutrition.height?.value || "—"
                    } ${nutrition.height?.unit || ""} · age ${
                      nutrition.age || "—"
                    }`
                  : "This household has not finished onboarding body metrics."}
              </p>
            </section>
            <section className="member-panel">
              <h2>Macro split</h2>
              <MacroRow
                label="Protein"
                value={nutrition?.macros?.protein || 0}
                color="#0068F7"
              />
              <MacroRow
                label="Carbs"
                value={nutrition?.macros?.carbs || 0}
                color="#945AF8"
              />
              <MacroRow
                label="Fat"
                value={nutrition?.macros?.fat || 0}
                color="#EAB308"
              />
            </section>
          </div>

          <section className="member-panel">
            <h2>Profiles in this household</h2>
            {profiles.length ? (
              <div className="chip-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 10 }}>
                {profiles.map((profile: any) => (
                  <div
                    key={profile._id || profile.firstName}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderTop: "1px solid var(--border-color, #e5e7eb)",
                      paddingTop: 10,
                    }}
                  >
                    <div>
                      <strong>
                        {`${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
                          name}
                      </strong>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                        {[profile.gender, profile.age ? `age ${profile.age}` : null, profile.diet]
                          .filter(Boolean)
                          .join(" · ") || "No details"}
                      </div>
                    </div>
                    <StatusChip
                      label={
                        profile.bmi?.value
                          ? `BMI ${Number(profile.bmi.value).toFixed(1)}`
                          : "No BMI"
                      }
                      tone="info"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <StatusChip label="No profiles linked" tone="warn" />
            )}
          </section>

          <section className="member-panel member-privacy">
            <h2>Privacy & account actions</h2>
            <p>
              Export downloads a local GDPR pack. Suspend and delete are
              restricted to super admin.
            </p>
            <div className="member-privacy__actions">
              <Button variant="outlined" disabled={busy} onClick={exportData}>
                Export data
              </Button>
              <Button
                variant="outlined"
                disabled={busy}
                onClick={() => navigate(`/update-users/${id}`)}
              >
                Edit account
              </Button>
              <SuperAdminBlock>
                <Button
                  color="warning"
                  variant="outlined"
                  disabled={busy || user.currentStatus === "inactive"}
                  onClick={suspend}
                >
                  Suspend
                </Button>
              </SuperAdminBlock>
              <ConfirmDeleteButton
                variant="text"
                title="Delete user"
                message="Permanently delete / anonymize this user per GDPR? This cannot be undone."
                label="Delete (GDPR)"
                disabled={busy}
                onConfirm={async () => {
                  if (!id) return;
                  setBusy(true);
                  const [, error]: any = await UserService.removeUser(
                    id,
                    dispatch
                  );
                  setBusy(false);
                  if (error) {
                    ToasterService.showError(
                      error?.response?.data?.message || "Delete failed"
                    );
                    return;
                  }
                  ToasterService.showSuccess("User deleted");
                  navigate("/users");
                }}
              />
            </div>
          </section>

          <div className="member-hero">
            <section className="member-panel">
              <h2>Allergies & safety</h2>
              <div className="chip-row">
                {(nutrition?.allergies || []).length ? (
                  nutrition.allergies.map((item: string) => (
                    <StatusChip key={item} label={item} tone="danger" />
                  ))
                ) : (
                  <StatusChip label="No allergies on file" tone="ok" />
                )}
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
                {(nutrition?.nutrientGoals?.vitamins || [])
                  .slice(0, 8)
                  .map((item: any) => (
                    <StatusChip
                      key={item.key || item.name}
                      label={item.name || item.key}
                      tone="info"
                    />
                  ))}
                {(nutrition?.nutrientGoals?.minerals || [])
                  .slice(0, 6)
                  .map((item: any) => (
                    <StatusChip
                      key={item.key || item.name}
                      label={item.name || item.key}
                      tone="ok"
                    />
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
