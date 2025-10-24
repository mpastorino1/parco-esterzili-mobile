import type { ConfigContext, ExpoConfig } from "@expo/config";

const APP_VARIANT = process.env.APP_VARIANT || "dev";

const APP_NAME = process.env.APP_NAME || "Esterzili (Dev)";

const IS_PROD = APP_VARIANT === "prod";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  scheme: "esterzili",
  slug: "esterzili",
  version: "1.1.2",
  orientation: "portrait",
  icon: IS_PROD
    ? "./src/assets/icon.png"
    : `./src/assets/icon-${APP_VARIANT}.png`,
  userInterfaceStyle: "automatic",
  splash: {
    image: "./src/assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  locales: {
    it: "src/translations/ios/it.json",
  },
  plugins: [
    [
      "expo-build-properties",
      {
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          buildToolsVersion: "35.0.0",
          kotlinVersion: "2.0.21",
          gradleProperties: {
            newArchEnabled: "true",
            "android.useAndroidX": "true",
            "android.enableJetifier": "true",
            "org.gradle.jvmargs":
              "-Xms1g -Xmx6g -Dfile.encoding=UTF-8 -XX:+UseParallelGC -XX:MaxMetaspaceSize=1g",
          },
        },
      },
    ],
    [
      "@rnmapbox/maps",
      {
        RNMapboxMapsImpl: "mapbox",
        RNMapboxMapsDownloadToken:
          "sk.eyJ1IjoiZ3N0bzk4IiwiYSI6ImNsaGFwbjJzNzBqdmYzY2x0aGdzZXY2cG4ifQ.iayd0wDcphySweDUiuOIbQ",
      },
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Change the location settings to 'Always Allow' to receive directions to points of interest within Esterzili Park.",
        locationWhenInUsePermission:
          "Activate location services to receive directions inside Esterzili Park.",
        isIosBackgroundLocationEnabled: true,
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./src/assets/notification-icon.png",
        color: "#ffffff",
      },
    ],
    [
      "expo-updates",
      {
        username: "green-share",
      },
    ],
    "expo-localization",
    "./plugins/withAndroidLocationStrings.js",
    "./android-manifest.plugin.js",
    "./plugins/withBeaconService.js",
  ],
  assetBundlePatterns: ["**/*"],
  ios: {
    buildNumber: "8",
    userInterfaceStyle: "automatic",
    supportsTablet: false,
    bundleIdentifier: IS_PROD
      ? "it.greenshare.esterzili"
      : `it.greenshare.esterzili.${APP_VARIANT}`,
    infoPlist: {
      UIViewControllerBasedStatusBarAppearance: true,
      UIBackgroundModes: ["location", "fetch", "remote-notification"],
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    versionCode: 8,
    permissions: [
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.FOREGROUND_SERVICE",
      "android.permission.FOREGROUND_SERVICE_LOCATION",
    ],
    package: IS_PROD
      ? "it.greenshare.esterzili"
      : `it.greenshare.esterzili.${APP_VARIANT}`,
  },
  extra: {
    eas: {
      projectId: "427712a9-1ecb-4951-831a-bb3d113c5b3a",
    },
    variant: APP_VARIANT,
  },
  owner: "green-share",
  updates: {
    url: "https://u.expo.dev/427712a9-1ecb-4951-831a-bb3d113c5b3a",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
});
