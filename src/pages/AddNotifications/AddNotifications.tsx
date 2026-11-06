import CircleLoader from "@core/basic-components/CircleLoader";
import GoBack from "@core/basic-components/GoBack";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import PageShell from "@core/templates/PageShell";
import AddNotificationsForm from "./AddNotificationsForm";
import UpdateNotificationsForm from "./AddNotificationsFormUpdate";
import NotificationService from "services/notification.service";

export default function AddNotifications() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.role);

  const handleSubmit = async (values: any) => {
    const data = { ...values };
    if (id) {
      // Broadcasts are immutable — send a new one instead of editing.
      await NotificationService.updateNotification();
      return;
    }
    await NotificationService.addNotification(data, navigate, dispatch);
  };

  return (
    <PageShell
      title={`${id ? "Update" : "Add"} notification`}
      actions={<GoBack path="/notifications" title="Back to notifications" />}
    >
      {loading && <CircleLoader />}
      <AddNotificationsForm onSubmit={handleSubmit} />
      {id && <UpdateNotificationsForm id={id} />}
    </PageShell>
  );
}
