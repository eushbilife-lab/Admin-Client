import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import GoBack from "@core/basic-components/GoBack";
import { useNavigate, useParams } from "react-router-dom";
import PageShell from "@core/templates/PageShell";
import UserFormUpdate from "./UserFormUpdate";
import AddUserForm from "./AddUserForm/AddUserForm";
import UserService from "services/user.service";
import ToasterService from "utils/toaster.util";
import ConfirmDeleteButton from "@core/api-components/ConfirmDeleteButton";
import "./AddUser.css";

function buildPhonePayload(phone: any) {
  const dialCode = String(
    phone?.data?.dialCode || phone?.dialingCode || "92"
  ).replace(/\D/g, "");
  const countryCode = String(
    phone?.data?.countryCode || phone?.countryCode || "pk"
  ).toUpperCase();
  const raw = String(phone?.value || phone?.number || "").replace(/\D/g, "");
  const number = raw.startsWith(dialCode) ? raw.slice(dialCode.length) : raw;
  return {
    number: number || raw,
    countryCode,
    dialingCode: `+${dialCode}`,
  };
}

export default function AddUser() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, user } = useAppSelector((state) => state.user);
  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
    : "User";

  const handleSubmit = async (values: any) => {
    if (!id) return;
    const statusRaw = String(values.currentStatus || "active").toLowerCase();
    const data = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      currentStatus: statusRaw.includes("inactive") ? "inactive" : "active",
      phone: buildPhonePayload(values.phone),
    };
    const [, error]: any = await UserService.updateUser(
      id,
      data,
      navigate,
      dispatch
    );
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Could not save user"
      );
      return;
    }
    ToasterService.showSuccess("User updated");
  };

  return (
    <PageShell
      kicker="Users"
      title={id ? `Edit · ${displayName}` : "Edit user"}
      subtitle="Update account status, name, email, and phone. Destructive actions are super-admin only."
      actions={
        <div className="add-user-actions">
          <GoBack path="/users" title="Back to users" />
          {id ? (
            <ConfirmDeleteButton
              variant="text"
              title="Delete user"
              label="Delete user"
              message={`Permanently delete “${displayName}”? This anonymizes the account and cannot be undone.`}
              onConfirm={async () => {
                const [, error]: any = await UserService.removeUser(
                  id,
                  dispatch
                );
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
          ) : null}
        </div>
      }
    >
      {loading ? <CircleLoader /> : null}
      <div className="add-user-card">
        <AddUserForm onSubmit={handleSubmit} />
      </div>
      {id ? <UserFormUpdate id={id} /> : null}
    </PageShell>
  );
}
