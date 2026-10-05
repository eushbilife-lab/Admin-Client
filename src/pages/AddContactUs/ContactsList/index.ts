import { ContactType } from "./../../../redux/slices/contact/index";
export { default } from "./ContactsList";

export interface ContactListProps {
  type: ContactType;
}
