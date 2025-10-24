const { withAndroidManifest } = require("expo/config-plugins");

const REQUIRED_PERMISSIONS = [
  "android.permission.ACCESS_COARSE_LOCATION",
  "android.permission.ACCESS_FINE_LOCATION",
  "android.permission.FOREGROUND_SERVICE",
  "android.permission.FOREGROUND_SERVICE_LOCATION",
];

const ALTBEACON_SERVICE = "org.altbeacon.beacon.service.BeaconService";

function ensurePermissions(manifest) {
  manifest["uses-permission"] = manifest["uses-permission"] ?? [];

  REQUIRED_PERMISSIONS.forEach((permission) => {
    const alreadyPresent = manifest["uses-permission"].some(
      (entry) => entry.$["android:name"] === permission
    );

    if (!alreadyPresent) {
      manifest["uses-permission"].push({
        $: { "android:name": permission },
      });
    }
  });
}

function ensureAltBeaconService(manifest) {
  const application = manifest.application?.[0];
  if (!application) return;

  application.service = application.service ?? [];

  const serviceConfig = {
    $: {
      "android:name": ALTBEACON_SERVICE,
      "android:exported": "false",
      "android:foregroundServiceType": "location",
      "tools:node": "replace",
    },
  };

  const existingServiceIndex = application.service.findIndex(
    (service) => service.$["android:name"] === ALTBEACON_SERVICE
  );

  if (existingServiceIndex >= 0) {
    application.service[existingServiceIndex].$ = {
      ...application.service[existingServiceIndex].$,
      ...serviceConfig.$,
    };
  } else {
    application.service.push(serviceConfig);
  }
}

const withBeaconService = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    manifest.$ = manifest.$ ?? {};

    if (!manifest.$["xmlns:tools"]) {
      manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";
    }

    ensurePermissions(manifest);
    ensureAltBeaconService(manifest);

    return config;
  });
};

module.exports = withBeaconService;
