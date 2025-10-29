import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { Platform, useColorScheme } from "react-native";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { PaperProvider, useTheme } from "react-native-paper";
import { CombinedDarkTheme, CombinedDefaultTheme } from "./theme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Mapbox from "@rnmapbox/maps";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import { useAppStore } from "./store/states";
import Toast from "react-native-toast-message";
import { RootStackParamList } from "./routes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";

import PlacesScreen from "./screens/PlacesScreen";
import HomeScreen from "./screens/HomeScreen";
import OnBoardingScreen from "./screens/OnBoardingScreen";
import PlaceScreen from "./screens/PlaceScreen";
import InfoScreen from "./screens/InfoScreen";
import WhereScreen from "./screens/WhereScreen";
import AboutScreen from "./screens/AboutScreen";
import ContactScreen from "./screens/ContactScreen";
import NavigatorScreen from "./screens/NavigatorScreen";
import { useBeacons } from "./useBeacons";
import LangScreen from "./screens/LangScreen";
import { useI18n } from "./useI18n";
import CreditsScreen from "./screens/CreditsScreen";
import { useWatchLocation } from "./useWatchLocation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DebugBeaconsScreen from "./screens/DebugBeaconsScreen";

// Inizializza il toast globale
(global as any).toast = Toast;

const prefix = Linking.createURL("/");

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/*Beacon.setOptions({
  android: {
    notification: {
      contentTitle: "Esterzili",
      contentText: "Stai visitando il parco!",
      smallIcon: "notification_icon",
    },
  },
});*/

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const colorScheme = useColorScheme();

  const [appIsReady, setAppReady] = useState(false);

  const theme =
    colorScheme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme;

  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [prefix],
    config: {
      initialRouteName: "Home",
      screens: {
        Place: "place/:placeId",
      },
    },
    async getInitialURL() {
      const url = await Linking.getInitialURL();
      if (url !== null) {
        return url;
      }
      const response = await Notifications.getLastNotificationResponseAsync();
      return response?.notification.request.content.data.url;
    },
    subscribe(listener) {
      const onReceiveURL = ({ url }: { url: string }) => listener(url);
      const eventListenerSubscription = Linking.addEventListener(
        "url",
        onReceiveURL
      );
      const subscription =
        Notifications.addNotificationResponseReceivedListener((response) => {
          const url = response.notification.request.content.data.url;
          listener(url);
        });

      return () => {
        eventListenerSubscription.remove();
        subscription.remove();
      };
    },
  };

  useEffect(() => {
    async function prepare() {
      try {
        Mapbox.setAccessToken(
          "pk.eyJ1IjoiZ3N0bzk4IiwiYSI6ImNsaWlwMjdwODAwY2szZHBha3Bmb2Y3YWwifQ.wa08aiddBkDYVkJyA1hjPg"
        );

        Mapbox.setTelemetryEnabled(false);

        await registerForPushNotificationsAsync();
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  const onReady = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer onReady={onReady} theme={theme} linking={linking}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Container />
        </GestureHandlerRootView>
      </NavigationContainer>
    </PaperProvider>
  );
}

const Container = () => {
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <>
      <Toast topOffset={safeAreaInsets.top} />
      <Navigator />
    </>
  );
};

const Navigator = () => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const { i18n } = useI18n();
  const variant =
    (Constants.expoConfig?.extra as { variant?: string } | undefined)
      ?.variant;
  const showDebugScreen = true;

  const onBoardingShown = useAppStore((state) => state.onBoardingShown);

  useBeacons();
  useWatchLocation();

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          statusBarStyle: colorScheme === "dark" ? "light" : "dark",
          statusBarColor: theme.colors.background,
          headerBackTitleVisible: false,
          headerBackTitle: "",
          headerTintColor: theme.colors.onBackground,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerLargeTitle: true,
        }}
      >
        {onBoardingShown ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Places"
              component={PlacesScreen}
              options={{
                title: i18n.t("places.headerTitle"),
              }}
            />
            <Stack.Screen
              name="Place"
              component={PlaceScreen}
              options={(props) => ({
                title: i18n.t(`poi.${props.route.params.placeId}.title`),
              })}
            />
            <Stack.Screen
              name="Info"
              component={InfoScreen}
              options={{
                title: i18n.t("info.headerTitle"),
              }}
            />
            <Stack.Screen
              name="Where"
              component={WhereScreen}
              options={{
                title: i18n.t("where.headerTitle"),
              }}
            />
            <Stack.Screen
              name="About"
              component={AboutScreen}
              options={{
                title: i18n.t("about.headerTitle"),
              }}
            />
            <Stack.Screen
              name="Contact"
              component={ContactScreen}
              options={{
                title: i18n.t("contact.headerTitle"),
              }}
            />
            <Stack.Screen
              name="Navigator"
              component={NavigatorScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Lang"
              component={LangScreen}
              options={{
                title: i18n.t("lang.headerTitle"),
              }}
            />
            <Stack.Screen
              name="Credits"
              component={CreditsScreen}
              options={{
                title: i18n.t("credits.headerTitle"),
              }}
            />
            {showDebugScreen && (
              <Stack.Screen
                name="DebugBeacons"
                component={DebugBeaconsScreen}
                options={{
                  title: "Beacon Debug",
                }}
              />
            )}
          </>
        ) : (
          <Stack.Screen
            name="OnBoarding"
            component={OnBoardingScreen}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </>
  );
};

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.warn("Notification permissions not granted");
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
}
