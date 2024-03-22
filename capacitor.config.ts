import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.church.hive',
  appName: 'Church Hive',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
};

export default config;
