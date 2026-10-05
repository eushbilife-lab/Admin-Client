import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import GoBack from "@core/basic-components/GoBack";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import PageShell from "@core/templates/PageShell";
import UserFormUpdate from "./UserFormUpdate";
import AddUserForm from "./AddUserForm/AddUserForm";
import UserService from "services/user.service";

export default function AddUser() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.user);

  const handleSubmit = async (values: any) => {
    const data = {
      ...values,
      phone: {
        number: values.phone.formattedValue.number,
        countryCode: values.phone.data.countryCode,
        dialingCode: values.phone.data.dialingCode,
      },
    };
    if (id) {
      await UserService.updateUser(id, data, navigate, dispatch);
    }
  };

  return (
    <PageShell
      title="Update member"
      actions={<GoBack path="/users" title="Back to members" />}
    >
      {loading && <CircleLoader />}
      <AddUserForm onSubmit={handleSubmit} />
      {id && <UserFormUpdate id={id} />}
    </PageShell>
  );
}
