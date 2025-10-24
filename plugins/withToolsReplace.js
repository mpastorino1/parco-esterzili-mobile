// plugins/withToolsReplace.js
const { withAndroidManifest, AndroidConfig } = require("expo/config-plugins");

module.exports = function withToolsReplace(config) {
  return withAndroidManifest(config, (c) => {
    const manifest = c.modResults;

    // aggiungi namespace tools se manca
    if (!manifest.manifest.$["xmlns:tools"]) {
      manifest.manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";
    }

    const app = AndroidConfig.Manifest.getMainApplication(manifest);
    if (app) {
      // forza CoreComponentFactory AndroidX
      app.$["android:appComponentFactory"] =
        "androidx.core.app.CoreComponentFactory";
      // aggiungi tools:replace="android:appComponentFactory"
      const prev = app.$["tools:replace"] || "";
      const set = new Set(
        prev
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
      set.add("android:appComponentFactory");
      app.$["tools:replace"] = Array.from(set).join(",");
    }

    return c;
  });
};
