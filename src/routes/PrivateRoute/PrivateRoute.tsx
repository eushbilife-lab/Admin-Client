import { Navigate } from "react-router-dom";
import { useAppSelector } from "redux/hooks";
import AdminLayout from "@core/templates/AdminLayout";
import useEffectOnce from "hooks/useEffectOnce";
import ToasterService from "utils/toaster.util";
import LocalStorage from "utils/localstorage.service";
import { PrivateRouteProps } from ".";

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const user = useAppSelector((state) => state.auth.user);
  const token = LocalStorage.getItem("token");

  useEffectOnce(() => {
    if (!user || !token) {
      setTimeout(() => ToasterService.showError("Please Login First"), 0);
    }
  });

  if (!user || !token) return <Navigate to="/" />;

  return <AdminLayout>{children}</AdminLayout>;
}
