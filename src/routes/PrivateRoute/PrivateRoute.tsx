import { Navigate } from "react-router-dom";
import { useAppSelector } from "redux/hooks";
import AdminLayout from "@core/templates/AdminLayout";
import useEffectOnce from "hooks/useEffectOnce";
import ToasterService from "utils/toaster.util";
import { PrivateRouteProps } from ".";

export default function PrivateRoute({
  children,
}: PrivateRouteProps) {
  const user = useAppSelector((state) => state.auth.user);

  useEffectOnce(() => {
    if (!user) setTimeout(() => ToasterService.showError("Please Login First"), 0);
  });

  if (!user) return <Navigate to="/" />;

  return <AdminLayout>{children}</AdminLayout>;
}
