import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import UserService from "services/user.service";
import { userActions } from "redux/slices/user";

export default function UserFormUpdate({ id }: any) {
  const form = "AddUserForm";
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
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
        currentStatus === "active" ? t("active") : t("isactive")
      )
    );
    dispatch(change(form, "firstName", firstName) || "");
    dispatch(change(form, "lastName", lastName) || "");
    dispatch(change(form, "email", email) || "");
    const formattedPhone =
      typeof phone === "object"
        ? {
            formattedValue: phone,
            value: phone?.number?.replace(/\D/g, ""),
            data: {
              countryCode: phone?.countryCode,
              dialingCode: phone?.dialingCode,
            },
          }
        : phone;

    dispatch(change(form, "phone", formattedPhone));
  }, [user, dispatch]);

  return null;
}
