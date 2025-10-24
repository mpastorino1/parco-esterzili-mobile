const { AndroidConfig, withStringsXml } = require("expo/config-plugins");

// Ensure Android has default (en) strings for the iOS permission keys so
// localization resources stay balanced and lint won't flag the Italian folder.
const LOCATION_PERMISSION_STRINGS = [
  {
    name: "NSLocationAlwaysAndWhenInUseUsageDescription",
    value:
      "Allow location access at all times to receive guidance for points of interest inside Esterzili Park.",
  },
  {
    name: "NSLocationAlwaysUsageDescription",
    value:
      "Allow location access at all times to receive guidance for points of interest inside Esterzili Park.",
  },
  {
    name: "NSLocationWhenInUseUsageDescription",
    value:
      "Enable location access to receive directions inside Esterzili Park.",
  },
  {
    name: "NSMotionUsageDescription",
    value:
      "Allow motion sensor access to improve the location experience in Esterzili Park.",
  },
];

module.exports = function withAndroidLocationStrings(config) {
  return withStringsXml(config, (config) => {
    config.modResults = AndroidConfig.Strings.setStringItem(
      LOCATION_PERMISSION_STRINGS.map(({ name, value }) => ({
        $: { name },
        _: value,
      })),
      config.modResults
    );

    return config;
  });
};
