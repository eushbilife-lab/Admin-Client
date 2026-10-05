import VerficationIdentityService from "./verfication.identity.service";

export default class Promisable {
  static asPromise(promise: Promise<unknown>) {
    return new Promise((resolve) =>
      promise.then(
        (res: any) => resolve([res, null]),
        (err: any) => {
          const { config, message: msg, response } = err;
          const message = response?.data?.message;
          if (response?.data?.code == 402) {
            VerficationIdentityService.openVerficationModel(resolve, message);
          } else {
            resolve([null, err]);
          }
        }
      )
    );
  }
}
