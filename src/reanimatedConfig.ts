import { configureReanimatedLogger } from "react-native-reanimated";

if (__DEV__) {
  configureReanimatedLogger({
    level: "warn",
    strict: false,
  });
}
