import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import UserService from "services/user.service";
import { userActions } from "redux/slices/user";

function toPhoneFieldValue(phone: any) {
  if (!phone || typeof phone !== "object") return phone || "";
  const dial = String(phone.dialingCode || phone.dialCode || "").replace(
    /\D/g,
    ""
  );
  const local = String(phone.number || "")
    .replace(/\D/g, "")
    .replace(/^0+/, "");
  const value = dial ? `${dial}${local}` : local;
  const countryCode = String(phone.countryCode || "pk").toLowerCase();
  return {
    value,
    data: {
      countryCode,
      dialCode: dial || "92",
      name: "",
    },
    formattedValue: phone.number || value,
  };
}

export default function UserFormUpdate({ id }: any) {
  const form = "AddUserForm";
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    UserService.getUser(id || "", dispatch);
    return () => {
      dispatch(userActions.setUser(null));
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (!user) return;
    const { firstName, lastName, email, phone, currentStatus } = user;
    dispatch(
      change(
        form,
        "currentStatus",
        currentStatus === "inactive" ? "inactive" : "active"
      )
    );
    dispatch(change(form, "firstName", firstName || ""));
    dispatch(change(form, "lastName", lastName || ""));
    dispatch(change(form, "email", email || ""));
    dispatch(change(form, "phone", toPhoneFieldValue(phone)));
  }, [user, dispatch]);

  return null;
}
