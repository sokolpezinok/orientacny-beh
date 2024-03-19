import { FCM } from "@capacitor-community/fcm";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";
import Store from "./store";

export class Notifications {
  static register = async () => {
    if (!Capacitor.isNativePlatform()) return;

    let status = await PushNotifications.checkPermissions();

    if (status.receive === "prompt") {
      status = await PushNotifications.requestPermissions();
    }

    if (status.receive !== "granted") {
      throw "Notifications are denied by user.";
    }

    await PushNotifications.register();
    await FCM.setAutoInit({ enabled: true });
    await FCM.subscribeTo({ topic: Store.getRawState().club.clubname });

    Store.update(s => {
      s.allow_notify = true;
    });
  }

  static unregister = async () => {
    if (!Capacitor.isNativePlatform()) return;

    await FCM.setAutoInit({ enabled: false });
    await PushNotifications.unregister();

    Store.update(s => {
      s.allow_notify = false;
    });
  }

  static getToken = async () => {
    return await FCM.getToken();
  }
}

export class NotificantionsContent {
  static EVENT_BASIC = 1;
  static EVENT_RACE_CHANGED = 2;
}