import { contactActions, ContactType } from "redux/slices/contact";
import { formLoaderActions } from "redux/slices/formLoader";
import { getAppDispatch } from "utils/dispatch.util";
import { modalActions } from "redux/slices/modal";
import Promisable from "./promisable.service";
import { Dispatch } from "@reduxjs/toolkit";
import { change } from "redux-form";
import http from "./http.service";
import moment from "moment";
import ToasterService from "utils/toaster.util";

const contactNumbersUrl = "/contact-numbers";
const contactsUrl = "/contacts";

const contactService = {
  setContactNumbers: async (data: any, dispatch: Dispatch) => {
    dispatch?.(formLoaderActions.setLoading(true));
    http.setJWT();
    http.setLanguage();
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
    http.setLanguage();
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${contactNumbersUrl}`)
    );
    if (success) {
      const contacts: any[] = [];
      const { number } = success.data.data;
      const contact_numbers: any[] = [...(number?.contacts || [])];
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

  getAllContacts: async (
    filters: any,
    type: ContactType,
    exportFile: Boolean
  ) => {
    const dispatch = getAppDispatch();
    if (exportFile) dispatch?.(modalActions.setLoading(true));
    else dispatch?.(contactActions.setLoading({ type, loading: true }));

    http.setJWT();
    http.setLanguage();

    const [success, error]: any = await Promisable.asPromise(
      http.post(`${contactsUrl}/${type}`, filters)
    );

    if (success) {
      const { requests, count } = success.data.data;
      const contacts = requests || [];
      if (exportFile) {
        dispatch?.(
          modalActions.updateData({
            table_data: contacts.map((contact: any) => ({
              "Creation Date": moment(contact?.createdAt).format(
                "YYYY-MM-DD hh:mm"
              ),
              "Closed Date":
                contact.status == "close" && contact?.resolvedDate
                  ? moment(contact?.resolvedDate).format("YYYY-MM-DD hh:mm")
                  : "",
              Status: type,
              "Ticket Number": contact.ticket_number,
              Name: contact.fullName || contact.name,
              Email: contact.email,
              Phone: contact.phone,
              Reason: contact.reason,
              Comments: contact.comments || contact.message,
              "Admin Reply": contact.adminResponse || "",
            })),
          })
        );
      } else {
        dispatch?.(contactActions.setContacts({ type, contacts, count }));
      }
    } else if (!exportFile) {
      dispatch?.(
        contactActions.setContacts({ type, contacts: [], count: 0 })
      );
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not load support tickets";
      ToasterService.showError(message);
    }

    if (exportFile) dispatch?.(modalActions.setLoading(false));
    else dispatch?.(contactActions.setLoading({ type, loading: false }));
    return [success, error];
  },

  deleteContactRequest: async (type: ContactType, id: any) => {
    const dispatch = getAppDispatch();
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    http.setLanguage();
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${contactsUrl}/update-status/${id}`)
    );
    if (success) {
      const contact =
        success.data.data.contact ||
        success.data.data.updatedContact ||
        { _id: id };
      dispatch?.(modalActions.closeModal());
      dispatch?.(contactActions.deleteContactRequestById({ type, contact }));
      ToasterService.showSuccess("Ticket closed");
    } else {
      ToasterService.showError(
        error?.response?.data?.message || "Could not close ticket"
      );
    }
    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },

  /** Reply to Help & Support — emails the user and closes the ticket. */
  replyToTicket: async (type: ContactType, id: string, response: string) => {
    const dispatch = getAppDispatch();
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    http.setLanguage();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${contactsUrl}/reply/${id}`, { response, close: true })
    );
    if (success) {
      const ticket = success.data?.data?.ticket || { _id: id };
      const emailSent = Boolean(success.data?.data?.emailSent);
      dispatch?.(modalActions.closeModal());
      dispatch?.(
        contactActions.deleteContactRequestById({ type, contact: ticket })
      );
      dispatch?.(contactActions.resetFilters("close" as ContactType));
      if (emailSent) {
        ToasterService.showSuccess("Reply emailed to the member");
      } else {
        ToasterService.showError(
          success.data?.message ||
            "Reply saved, but email failed — check Resend API key on Admin Server"
        );
      }
    } else {
      ToasterService.showError(
        error?.response?.data?.message || "Could not send reply"
      );
    }
    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },
};

export default contactService;
