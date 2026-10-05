import { config } from "config";
import OneSignal from "react-onesignal";
import { log } from "../utils/logger.util";
import Notification from "assets/audio/Notification.mp3";

const url = config.APP_URL;
const audio = new Audio(Notification);
const appId = config.ONE_SIGNAL_APP_ID;

const OneSignalService = {
  init: async () => {
    if (config.NODE_ENV !== "production") return;

    await OneSignal.init({ appId });
    await OneSignal.setDefaultNotificationUrl(url);
    log("one signal init");

    OneSignal.on("notificationDisplay", () => {
      OneSignalService.playSound();
      log("one signal notificationDisplay");
    });
  },

  connect: async (id: string, uberIds?: any) => {
    if (config.NODE_ENV !== "production") return;
    await OneSignal.setExternalUserId(id);
    log("one signal connected");
    if (uberIds?.length > 0) {
      let tags: any = {
        uberId1: null,
        uberId2: null,
        uberId3: null,
        uberId4: null,
        uberId5: null,
      };
      uberIds?.forEach((id: any, index: number) => {
        tags[`uberId${index + 1}`] = id;
      });
      await OneSignal.sendTags(tags);
      log("one signal connected with uber id");
    }
  },

  disconnect: async () => {
    if (config.NODE_ENV !== "production") return;

    await OneSignal.removeExternalUserId();
    log("one signal disconnected");
  },

  playSound: () => {
    try {
      log("playing sound");
      audio.play();
      log("sound played");
    } catch (err) {
      log({ err });
    }
  },
};

export default OneSignalService;
