export { default, contactActions, contactSlice } from "./contactSlice";

export enum CONTACT {
  open = "open",
  close = "close",
}

export type ContactType = keyof typeof CONTACT;

export interface ContactLoadingPayload {
  loading: boolean;
  type: ContactType;
}
export interface SetFiltersPayload {
	data: any;
	type: ContactType;
}
export interface SetContactsPayload {
	count: number;
  contacts: any[];
  type: ContactType;
}


export interface SetPagePayload {
	page: number;
	type: ContactType;
}
export interface SetContactPayload {
  contact: any;
  type: ContactType;
}

export interface IContacts {
  contacts: any[];
  loading: boolean;
	filters: any;
	count: number;
	refresh: number;
	current_filters: any;
	refreshLoader: boolean;
}

export interface BasicContactState {
  tab: number;
  contact: any;
  loading: boolean;
	filters: any;
	count: number;
	refresh: number;
	current_filters: any;
	refreshLoader: boolean;
}

export type ContactState = BasicContactState & {
  [key in CONTACT]: IContacts;
};
