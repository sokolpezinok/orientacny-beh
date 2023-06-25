import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'sk.orienteering.app',
  appName: 'Orientačný beh',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
