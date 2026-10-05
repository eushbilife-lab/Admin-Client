export {
	default,
	notificationActions,
	notificationSlice,
} from "./notificationSlice";

export interface NotificationState {
	count: number;
	loading: boolean;
	notification: any;
	notifications: any[];
	refresh: number;
	refreshLoader: boolean;
	filters: any;
	current_filters: any;
}
