import { CapacitorConfig } from '@capacitor/cli';

import { appPackageName, appName } from "./src/manifest";

const config: CapacitorConfig = {
  appId: appPackageName,
  appName: appName,
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_notification",
      iconColor: "#F76D22",
    }
  }
};

export default config;
