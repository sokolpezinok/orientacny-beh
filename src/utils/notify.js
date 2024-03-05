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

export const register = async () => {
  if (!Capacitor.isNativePlatform()) return; // not implemented on web

  await PushNotifications.requestPermissions();
  await PushNotifications.register();
  await FCM.setAutoInit({enabled: true});
}

export const unregister = async () => {
  if (!Capacitor.isNativePlatform()) return; // not implemented on web

  await PushNotifications.unregister();
  await FCM.setAutoInit({enabled: false});
}

export const subscribe = (topic) => {
  if (!Capacitor.isNativePlatform()) return; // not implemented on web

  return FCM.subscribeTo({topic});
}

export const unsubscribe = (topic) => {
  if (!Capacitor.isNativePlatform()) return; // not implemented on web
  
  return FCM.unsubscribeFrom({topic});
}

export const getToken = () => {
  if (!Capacitor.isNativePlatform()) return; // not implemented on web

  return FCM.getToken();
}