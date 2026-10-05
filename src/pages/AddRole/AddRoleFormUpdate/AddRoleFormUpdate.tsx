import { useAppDispatch, useAppSelector } from "redux/hooks";
import { roleActions } from "redux/slices/role";
import roleService from "services/role.service";
import { change } from "redux-form";
import { useEffect } from "react";
import { config } from "config";

export default function AddRoleFormUpdate({ id }: any) {
  const form = "AddRoleForm";
  const dispatch = useAppDispatch();

  // Get role from the Redux store
  const { Role } = useAppSelector((state) => state.role);

  useEffect(() => {
    roleService.getRole(id || "",dispatch);
    return () => {
      dispatch(roleActions.setRole(null));
    };
  }, [id, dispatch]);
  
  useEffect(() => {
    if (!Role || Role.email === config.SUPER_ADMIN_EMAIL) return;

    const { fullName, email, currentStatus, role} = Role;
    dispatch(change(form, "fullName", fullName || ""));
    dispatch(change(form, "email", email || ""));
    dispatch(change(form, "role", role || ""));
    dispatch(change(form, "currentStatus",currentStatus || ""));
  }, [Role, dispatch]);

  return null;
}
