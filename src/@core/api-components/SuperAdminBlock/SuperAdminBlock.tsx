import BlockComponent, {
  SUPER_ADMIN_ROLES,
} from "@core/api-components/BlockComponent/BlockComponent";

/** Only the top staff role (`admin` / `super_admin`) sees children — use for Delete. */
export default function SuperAdminBlock({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BlockComponent allowedRoles={[...SUPER_ADMIN_ROLES]}>
      {children}
    </BlockComponent>
  );
}
