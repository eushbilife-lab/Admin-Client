import { useAppDispatch, useAppSelector } from "redux/hooks";
import PageShell from "@core/templates/PageShell";
import { contactActions } from "redux/slices/contact";
import Tabs from "@core/templates/Tabs";
import ContactsList from "./ContactsList";
import AddContact from "./AddContact/AddContact";

export default function AddContactUs() {
  const dispatch = useAppDispatch();
  const tab = useAppSelector((state) => state.contact.tab);

  return (
    <PageShell
      kicker="Support"
      title="Help & Support"
      subtitle="Open tickets from the live app. Reply emails the member with a branded Eushbi Live message and closes the ticket."
    >
      <AddContact />
      <Tabs
        value={tab}
        onChange={(next) => dispatch(contactActions.setTab(next))}
        tabs={[
          { label: "Open", element: <ContactsList type="open" /> },
          { label: "Closed", element: <ContactsList type="close" /> },
        ]}
      />
    </PageShell>
  );
}
