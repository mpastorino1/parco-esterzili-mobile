"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
const LINKING_ERROR = `The package 'react-native-beacon' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const Beacon = _reactNative.NativeModules.Beacon ? _reactNative.NativeModules.Beacon : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
let listener = null;
let myModuleEvt;
if (_reactNative.Platform.OS === 'android') {
  _reactNative.AppRegistry.registerHeadlessTask('Beacons', () => async data => {
    const {
      beacons
    } = data.data;
    listener && listener(beacons);
    return Promise.resolve();
  });
} else {
  myModuleEvt = new _reactNative.NativeEventEmitter(_reactNative.NativeModules.MyEventEmitter);
  myModuleEvt.addListener('watchBeacons', event => {
    listener && listener(event);
  });
}
var _default = {
  watchBeacons(callback) {
    listener = callback;
  },
  setOptions(options) {
    Beacon.setOptions(options);
  },
  requestPermissions() {
    return Beacon.requestPermissions();
  },
  enableBluetooth() {
    Beacon.enableBluetooth();
  },
  async startBeaconScan(beacons) {
    await Beacon.startService();
    Beacon.startBeaconScan(beacons);
  },
  async stopBeaconScan() {
    Beacon.stopBeaconScan();
    await Beacon.stopService();
  }
};
exports.default = _default;
//# sourceMappingURL=index.js.map