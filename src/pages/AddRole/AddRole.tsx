import CircleLoader from "@core/basic-components/CircleLoader";
import GoBack from "@core/basic-components/GoBack";
import RoleFormUpdate from "./AddRoleFormUpdate";
import RoleService from "services/role.service";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import PageShell from "@core/templates/PageShell";
import RoleForm from "./AddRoleForm";

export default function AddRole() {
  const { id } = useParams();
  const dispatch=useAppDispatch()
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.role);

  const handleSubmit = async (values: any) => {
    let data = { ...values };
    if (id) {
      await RoleService.updateRole(`${id}`, data, navigate,dispatch);
    } else {
      await RoleService.createRole(data, navigate,dispatch);
    }
  };

  return (
    <PageShell
      title={`${id ? "Update" : "Add"} staff`}
      actions={<GoBack path="/roles" title="Back to staff" />}
    >
      {loading && <CircleLoader />}
      <RoleForm onSubmit={handleSubmit} />
      {id && <RoleFormUpdate id={id} />}
    </PageShell>
  );
}
