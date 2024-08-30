import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Storage } from "./storage";

export class Notifications {
  static checkSupport = () => {
    if (!Capacitor.isNativePlatform()) {
      throw "Funkcia nie je podporovaná pre tento typ zariadenia.";
    }
  };

  static requestPermissions = async () => {
    let status = await FirebaseMessaging.checkPermissions();

    if (status.receive === "prompt") {
      status = await FirebaseMessaging.requestPermissions();
    }

    if (status.receive !== "granted") {
      throw "Povolenie bolo zrušené používateľom.";
    }
  };

  static register = async (state) => {
    if (state === Storage.pull().preferences.allowNotify) {
      return;
    }

    this.checkSupport();

    if (state) {
      await this.requestPermissions();

      await FirebaseMessaging.subscribeToTopic({ topic: Storage.pull().club.clubname });
      await Storage.push((s) => {
        s.preferences.allowNotify = true;
      });
    } else {
      await FirebaseMessaging.unsubscribeFromTopic({ topic: Storage.pull().club.clubname });
      await Storage.push((s) => {
        s.preferences.allowNotify = false;
      });
    }
  };

  static getToken = FirebaseMessaging.getToken;

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
  static BASIC = 0;
  static RACE = 1;
}
