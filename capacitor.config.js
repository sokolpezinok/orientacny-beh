const { appPackageName, appName } = require("./src/manifest");

module.exports = {
  appId: appPackageName,
  appName: appName,
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_notification",
      iconColor: "#F76D22",
    },
  },
};
