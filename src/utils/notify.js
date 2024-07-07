import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Storage } from "./storage";

export class Notifications {
  static isSupported = () => Capacitor.isNativePlatform();

  static register = async () => {
    if (!this.isSupported()) throw "Funkcia nie je podporovaná pre tento typ zariadenia.";

    let status = await FirebaseMessaging.checkPermissions();

    if (status.receive === "prompt") {
      status = await FirebaseMessaging.requestPermissions();
    }

    if (status.receive !== "granted") {
      throw "Povolenie bolo zrušené používateľom.";
    }

    alert("Subscribing: " + Storage.pull().club.clubname);

    await FirebaseMessaging.subscribeToTopic({ topic: Storage.pull().club.clubname });
  }

  static unregister = async () => {
    if (!this.isSupported()) return;

    alert("Unsubscribing: " + Storage.pull().club.clubname);
    await FirebaseMessaging.unsubscribeFromTopic({ topic: Storage.pull().club.clubname });
  }

  static getToken = FirebaseMessaging.getToken;

  static notify = ({ id, data, title, body, ...options }) => LocalNotifications.schedule({
    notifications: [{
      // 32-bit int, the value should be between -2147483648 and 2147483647 inclusive
      id: id ?? Math.floor(Math.random() * 4294967295) - 2147483648,
      title,
      largeBody: body,
      ...options,
    }],
  });
}

export class NotifyEvents {
  static BASIC = 0;
  static RACE = 1;
}