import { contactActions, ContactType } from "redux/slices/contact";
import { formLoaderActions } from "redux/slices/formLoader";
import { getAppDispatch } from "utils/dispatch.util";
import { modalActions } from "redux/slices/modal";
import Promisable from "./promisable.service";
import { Dispatch } from "@reduxjs/toolkit";
import { change } from "redux-form";
import http from "./http.service";
import moment from "moment";

const contactNumbersUrl = "/contact-numbers/";
const contactUsUrl1 = "/contacts/";

const contactService = {

  setContactNumbers: async (data: any,dispatch:Dispatch) => {
    dispatch?.(formLoaderActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${contactNumbersUrl}`, data)
    );
    dispatch?.(formLoaderActions.setLoading(false));
    return [success, error];
  },
  getContactNumbers: async () => {
    const dispatch = getAppDispatch();
    dispatch?.(formLoaderActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${contactNumbersUrl}`)
    );
    if (success) {
      let contacts: any[] = [];
      const { number } = success.data.data;
      let contact_numbers: any[] = [...number.contacts];
      contact_numbers.forEach(({ number, country_code }) => {
        contacts.push({
          phone: { value: number, data: { dialCode: country_code } },
        });
      });
      dispatch?.(change("AddContactForm", "contacts", contacts));
    }

    dispatch?.(formLoaderActions.setLoading(false));
    return [success, error];
  },
  getAllContacts: async (filters:any,type: ContactType,exportFile:Boolean) => {
    const dispatch = getAppDispatch();
    if (exportFile) dispatch?.(modalActions.setLoading(true));
    else dispatch?.(contactActions.setLoading({ type, loading: true }));

    http.setJWT();
    http.setLanguage()

    const [success, error]: any = await Promisable.asPromise(
      http.post(`${contactUsUrl1}/${type}`,filters)
    );

    if (success) {
      const {requests,count} = success.data.data;
      const contacts=requests
      if(exportFile){
        dispatch?.(
          modalActions.updateData({
            table_data: requests.map((contact: any) => ({
              "Creation Date": moment(contact?.createdAt).format("YYYY-MM-DD hh:mm"),
              "Closed Date":contact.status=="close"&&contact?.resolvedDate?moment(contact?.resolvedDate).format("YYYY-MM-DD hh:mm"):"",
              Status:type,
              "Ticket Number":contact.ticket_number,
              Name:contact.name,
              Email:contact.email,
              Phone:contact.phone,
              Message:contact.message,

            })),
          })
        );
      }
      else dispatch?.(contactActions.setContacts({ type, contacts,count }));
    }
    if (exportFile) dispatch?.(modalActions.setLoading(false));

   else dispatch?.(contactActions.setLoading({ type, loading: false }));
    return [success, error];
  },
  deleteContactRequest: async (type: ContactType, id: any) => {
    const dispatch = getAppDispatch();
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${contactUsUrl1}/update-status/${id}`)
    );
    if (success) {
      const { contact } = success.data.data;
      dispatch?.(modalActions.closeModal());
      dispatch?.(contactActions.deleteContactRequestById({ type, contact }));
    }
    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },

};
export default contactService;
