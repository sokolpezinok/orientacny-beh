import { CapacitorConfig } from '@capacitor/cli';

import { appPackageName, appName } from "./src/manifest";

const config: CapacitorConfig = {
  appId: appPackageName,
  appName: appName,
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
