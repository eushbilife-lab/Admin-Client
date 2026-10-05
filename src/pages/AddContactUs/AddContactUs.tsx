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
      title="Contacts"
      subtitle="Inbound messages from the live app, plus the public contact details you publish."
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
