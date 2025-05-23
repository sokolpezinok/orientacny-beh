import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { SystemApi } from "./api";
import { Storage } from "./storage";

export class Notifications {
  static requestPermissions = async () => {
    let status = await FirebaseMessaging.checkPermissions();

    if (status.receive === "prompt") {
      status = await FirebaseMessaging.requestPermissions();
    }

    if (status.receive !== "granted") {
      throw "Povolenie bolo zrušené používateľom. Notifikácie môžeš povoliť v systémových nastaveniach.";
    }
  };

  static register = async () => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    await this.requestPermissions();

    const { token } = await FirebaseMessaging.getToken();
    await FirebaseMessaging.subscribeToTopic({ topic: Storage.pull().club.clubname });
    await SystemApi.fcm_token_update(token);
    await Storage.push((s) => {
      s.preferences.activeNotify = true;
    });
  };

  static unregister = async () => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    await FirebaseMessaging.unsubscribeFromTopic({ topic: Storage.pull().club.clubname });
    await SystemApi.fcm_token_delete();
    await Storage.push((s) => {
      s.preferences.activeNotify = false;
    });
  };

  static destroy = async () => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    await FirebaseMessaging.deleteToken();
  };

  static notify = ({ id, data, title, body, ...options }) =>
    LocalNotifications.schedule({
      notifications: [
        {
          // 32-bit int, the value should be between -2147483648 and 2147483647 inclusive
          id: id ?? Math.floor(Math.random() * 4294967295) - 2147483648,
          title,
          largeBody: body,
          ...options,
        },
      ],
    });
}

export class NotifyEvents {
  static BASIC = "0";
  static RACE = "1";
}
