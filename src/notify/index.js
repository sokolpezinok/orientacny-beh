import { FCM } from "@capacitor-community/fcm";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";

// await PushNotifications.addListener(
//   "pushNotificationActionPerformed",
//   (notification) => {
//     console.log(
//       "Push notification action performed",
//       notification.actionId,
//       notification.inputValue
//     );
//   }
// );

// export const register = async () => {
//   if (!Capacitor.isNativePlatform()) return; // prevent running notifications on web

//   let permStatus = await PushNotifications.checkPermissions();

//   if (permStatus.receive === "prompt") {
//     permStatus = await PushNotifications.requestPermissions();
//   }

//   if (permStatus.receive !== "granted") {
//     throw new Error("User denied permissions!");
//   }

//   return await PushNotifications.register();
// };

// export const unregister = async () => {
//   if (!Capacitor.isNativePlatform()) return; // prevent running notifications on web

//   return await PushNotifications.unregister();
// };

export const Register = async () => {
  if (!Capacitor.isNativePlatform()) return; // not implemented on web

  await PushNotifications.requestPermissions();
  await PushNotifications.register();
  FCM.setAutoInit({enabled: true}).then(() => alert("Auto init enabled"));
}

export const Unregister = async () => {
  if (!Capacitor.isNativePlatform()) return; // not implemented on web

  await PushNotifications.unregister();
  FCM.setAutoInit({enabled: false}).then(() => alert("Auto init disabled"));
}

export const Subscribe = (topic) => {
  if (!Capacitor.isNativePlatform()) return; // not implemented on web

  return FCM.subscribeTo({topic});
}

export const Unsubscribe = (topic) => {
  if (!Capacitor.isNativePlatform()) return; // not implemented on web
  
  return FCM.unsubscribeFrom({topic});
}