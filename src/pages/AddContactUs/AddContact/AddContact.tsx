import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import AddContactForm from "./AddContactForm";
import ContactService from "services/contact.service";
import CircleLoader from "@core/basic-components/CircleLoader";

export default function AddContact() {
  const loading = useAppSelector((state) => state.formLoader.loading);
  const dispatch = useAppDispatch();
  useEffect(() => {
    ContactService.getContactNumbers();
  }, []);

  const handleSubmit = async (values: any) => {
    let contacts: any = [];
    let data = { ...values };
    data.contacts.forEach(({ phone }: any) => {
      if (phone?.data)
        contacts.push({
          number: `+${phone.value}`,
          country_code: `+${phone.data.dialCode}`,
        });
    });
    data.contacts = contacts;
    ContactService.setContactNumbers(data, dispatch);
  };

  return (
    <div>
      <div className="form">
        {loading && <CircleLoader />}
        <AddContactForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
