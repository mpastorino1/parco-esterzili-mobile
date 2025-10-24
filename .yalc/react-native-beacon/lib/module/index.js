import { AppRegistry, NativeEventEmitter, NativeModules, Platform } from 'react-native';
const LINKING_ERROR = `The package 'react-native-beacon' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const Beacon = NativeModules.Beacon ? NativeModules.Beacon : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
let listener = null;
let myModuleEvt;
if (Platform.OS === 'android') {
  AppRegistry.registerHeadlessTask('Beacons', () => async data => {
    const {
      beacons
    } = data.data;
    listener && listener(beacons);
    return Promise.resolve();
  });
} else {
  myModuleEvt = new NativeEventEmitter(NativeModules.MyEventEmitter);
  myModuleEvt.addListener('watchBeacons', event => {
    listener && listener(event);
  });
}
export default {
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
//# sourceMappingURL=index.js.map