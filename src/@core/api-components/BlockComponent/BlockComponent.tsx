import { useMemo } from "react";
import { useAppSelector } from "redux/hooks";

export default function BlockComponent({ allowedRoles, children }: any) {
  const userRole = useAppSelector((state) => state.auth?.user?.role) || "";
  const hasPermission = useMemo(() => allowedRoles?.includes(userRole), [userRole, allowedRoles]);
  if (!hasPermission) return null; 
  return <>{children}</>;
}
