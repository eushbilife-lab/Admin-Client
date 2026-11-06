import { useMemo } from "react";
import { useAppSelector } from "redux/hooks";

/**
 * Gate UI by staff role.
 *
 * `super_admin` is the product name for the top staff role. In the DB/API
 * that role is stored as `admin`. Listing `super_admin` in `allowedRoles`
 * therefore also allows `admin`.
 */
export function roleIsAllowed(
  userRole: string,
  allowedRoles?: string[]
): boolean {
  if (!allowedRoles?.length) return false;
  if (allowedRoles.includes(userRole)) return true;
  if (allowedRoles.includes("super_admin") && userRole === "admin") return true;
  return false;
}

/** Roles that may destroy data (delete / GDPR). */
export const SUPER_ADMIN_ROLES = ["super_admin", "admin"] as const;

export default function BlockComponent({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const userRole = useAppSelector((state) => state.auth?.user?.role) || "";
  const hasPermission = useMemo(
    () => roleIsAllowed(userRole, allowedRoles),
    [userRole, allowedRoles]
  );
  if (!hasPermission) return null;
  return <>{children}</>;
}
