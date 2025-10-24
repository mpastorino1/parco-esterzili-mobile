// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// https://github.com/fnando/i18n#im-getting-an-error-like-unable-to-resolve-make-plural-from-node-modulesi18n-jsdistimportpluralizationjs
config.resolver.sourceExts.push(
  'mjs'
);

module.exports = config;
