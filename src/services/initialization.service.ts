import OneSignalService from "services/onesignal.service";
import ErrorService from "services/error.service";

const InitializationService = {
  init: () => {
    ErrorService.init();
    OneSignalService.init();
  },
};

export default InitializationService;
