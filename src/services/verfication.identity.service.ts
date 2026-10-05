import { modalActions } from "redux/slices/modal";
import { getAppDispatch } from "utils/dispatch.util";
import http from "./http.service";
import Promisable from "./promisable.service";
const url = "/verify";
class VerficationIdentityService {
  static currentCallBack: any;
  static requestToken: any;

  static pluckRequestToken(message: any) {
    const match = message.match(/\((.*?)\)/);
    if (!match) {
      return "";
    }
    // Step 2: Extracted data inside the brackets
    const extractedData = match[1];
    return extractedData;
  }
  static openVerficationModel(successCallBack: any, message: any) {
    VerficationIdentityService.requestToken =
      VerficationIdentityService.pluckRequestToken(message);
    VerficationIdentityService.currentCallBack = successCallBack;
    const dispatch = getAppDispatch();
    dispatch?.(modalActions.setLoading(false));

    // dispatch?.(
    //   modalActions.openModal({
    //     type: MODAL.CONFIRM_REFUND,
    //     data: "remove",
    //     width: "500px",
    //   })
    // );
  }
  static async makeVerficationCall(data: any) {
    const dispatch = getAppDispatch();
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    const [success]: any = await Promisable.asPromise(
      http.post(`${url}`, data)
    );
    dispatch?.(modalActions.setLoading(false));
    if (success) {
      VerficationIdentityService.currentCallBack([success, null]);
    }
  }
}
export default VerficationIdentityService;
