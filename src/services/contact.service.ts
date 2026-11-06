import { contactApi } from "redux/api/contact/contactApi";
import { contactActions, ContactType } from "redux/slices/contact";
import { formLoaderActions } from "redux/slices/formLoader";
import { getAppDispatch } from "utils/dispatch.util";
import { modalActions } from "redux/slices/modal";
import { change } from "redux-form";
import moment from "moment";
import ToasterService from "utils/toaster.util";
import { AppDispatch } from "redux/store";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const contactService = {
  getOverview: async () => {
    const d = getAppDispatch();
    if (!d) return null;
    try {
      return await d(
        contactApi.endpoints.getContactOverview.initiate(undefined, {
          forceRefetch: true,
        })
      ).unwrap();
    } catch {
      return null;
    }
  },

  setContactNumbers: async (data: any, dispatch: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(formLoaderActions.setLoading(true));
    try {
      const result = await d(
        contactApi.endpoints.setContactNumbers.initiate(data)
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(formLoaderActions.setLoading(false));
    }
  },

  getContactNumbers: async () => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    d(formLoaderActions.setLoading(true));
    try {
      const payload = await d(
        contactApi.endpoints.getContactNumbers.initiate(undefined, {
          forceRefetch: true,
        })
      ).unwrap();
      const contacts: any[] = [];
      const { number } = (payload as { number?: { contacts?: any[] } }) || {};
      const contact_numbers: any[] = [...(number?.contacts || [])];
      contact_numbers.forEach(({ number, country_code }) => {
        const dial = String(country_code || "").replace(/^\+/, "");
        const raw = String(number || "").replace(/^\+/, "");
        const national =
          dial && raw.startsWith(dial) ? raw.slice(dial.length) : raw;
        contacts.push({
          phone: {
            value: national || raw,
            data: { dialCode: dial || "966" },
          },
        });
      });
      d(
        change("AddContactForm", "contacts", contacts.length ? contacts : [{}])
      );
      return [{ data: { data: payload } }, null];
    } catch (error) {
      d(change("AddContactForm", "contacts", [{}]));
      return [null, error];
    } finally {
      d(formLoaderActions.setLoading(false));
    }
  },

  getAllContacts: async (
    filters: any,
    type: ContactType,
    exportFile: Boolean
  ) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    if (exportFile) d(modalActions.setLoading(true));
    else d(contactActions.setLoading({ type, loading: true }));

    try {
      const { requests, count } = await d(
        contactApi.endpoints.getAllContacts.initiate(
          { filters, type },
          { forceRefetch: true }
        )
      ).unwrap();
      const contacts = requests || [];
      if (exportFile) {
        d(
          modalActions.updateData({
            table_data: contacts.map((contact: any) => ({
              "Creation Date": moment(contact?.createdAt).format(
                "YYYY-MM-DD hh:mm"
              ),
              "Closed Date":
                contact.status == "close" && contact?.resolvedDate
                  ? moment(contact?.resolvedDate).format("YYYY-MM-DD hh:mm")
                  : "",
              Status: contact.status,
              "Ticket Number": contact.ticket_number,
              Name: contact.fullName || contact.name,
              Email: contact.email,
              Reason: contact.reason,
              Comments: contact.comments || contact.message,
              "Admin Reply": contact.adminResponse || "",
            })),
          })
        );
      } else {
        d(contactActions.setContacts({ type, contacts, count }));
      }
      return [{ data: { data: { requests: contacts, count } } }, null];
    } catch (error) {
      if (!exportFile) {
        d(contactActions.setContacts({ type, contacts: [], count: 0 }));
        const err = error as {
          data?: { message?: string };
          message?: string;
        };
        ToasterService.showError(
          err?.data?.message ||
            err?.message ||
            "Could not load support tickets"
        );
      }
      return [null, error];
    } finally {
      if (exportFile) d(modalActions.setLoading(false));
      else d(contactActions.setLoading({ type, loading: false }));
    }
  },

  deleteContactRequest: async (type: ContactType, id: any) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const updated = await d(
        contactApi.endpoints.deleteContactRequest.initiate({ type, id })
      ).unwrap();
      const contact = updated || { _id: id };
      d(modalActions.closeModal());
      d(contactActions.deleteContactRequestById({ type, contact }));
      ToasterService.showSuccess("Ticket closed");
      return [{ data: { data: { contact } } }, null];
    } catch (error) {
      const err = error as { data?: { message?: string } };
      ToasterService.showError(
        err?.data?.message || "Could not close ticket"
      );
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  replyToTicket: async (
    type: ContactType,
    id: string,
    response: string,
    options: { close?: boolean } = {}
  ) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const { ticket, emailSent, message } = await d(
        contactApi.endpoints.replyToContactTicket.initiate({
          type,
          id,
          response,
          close: options.close,
        })
      ).unwrap();
      const resolvedTicket = ticket || { _id: id };
      d(modalActions.closeModal());
      if (options.close !== false) {
        d(
          contactActions.deleteContactRequestById({
            type,
            contact: resolvedTicket,
          })
        );
        d(contactActions.resetFilters("close" as ContactType));
      } else {
        d(contactActions.resetFilters(type));
      }
      if (emailSent) {
        ToasterService.showSuccess(message || "Reply emailed to the member");
      } else {
        ToasterService.showError(
          message || "Reply saved, but email failed — check RESEND_API_KEY"
        );
      }
      return [
        {
          data: {
            data: { ticket: resolvedTicket, emailSent },
            message,
          },
        },
        null,
      ];
    } catch (error) {
      const err = error as { data?: { message?: string } };
      ToasterService.showError(err?.data?.message || "Could not send reply");
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },
};

export default contactService;
