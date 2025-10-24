import { AppState, Linking } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { useTheme } from "react-native-paper";
import Beacon from "react-native-beacon";
import { POI_MAP_BY_BEACON_MINOR, Place } from "./constants";
import {
  BeaconReading,
  beaconStore,
  useAppStore,
} from "./store/states";
import { useI18n } from "./useI18n";

export function useBeacons() {
  const theme = useTheme();
  const { i18n } = useI18n();
  const onBoardingShown = useAppStore((state) => state.onBoardingShown);

  const toastIdRef = useRef<string | null>(null);
  const setPlace = beaconStore((state) => state.setPlace);
  const setBeacons = beaconStore((state) => state.setBeacons);
  const clearBeacons = beaconStore((state) => state.clearBeacons);

  useEffect(() => {
    async function prepare() {
      const permissionsGranted = await Beacon.requestPermissions();
      if (!permissionsGranted) {
        console.warn("Beacon permissions not granted");
        return;
      }

      Beacon.enableBluetooth();

      Beacon.watchBeacons(async (beacons) => {
        if (beacons.length === 0) {
          setBeacons([]);
          return;
        }

        const timestamp = Date.now();

        const normalizedBeacons: BeaconReading[] = beacons
          .map((beacon) => ({
            uuid: beacon.uuid ?? undefined,
            major: beacon.major,
            minor: beacon.minor,
            distance: beacon.distance,
            timestamp,
          }))
          .sort((a, b) => {
            const aDistance = a.distance ?? Number.POSITIVE_INFINITY;
            const bDistance = b.distance ?? Number.POSITIVE_INFINITY;
            return aDistance - bDistance;
          });

        setBeacons(normalizedBeacons);

        const closestBeacon = normalizedBeacons[0];

        if (!closestBeacon || closestBeacon.distance === undefined) {
          console.log("no beacons around");
          return;
        }

        let place: Place | null = null;
        if (
          closestBeacon.minor != undefined &&
          closestBeacon.distance !== undefined
        ) {
          const candidatePlace =
            POI_MAP_BY_BEACON_MINOR[closestBeacon.minor];
          if (
            candidatePlace &&
            closestBeacon.distance < candidatePlace.beacon.triggerDistance
          ) {
            place = candidatePlace;
          }
        }
        const { closestPlace: previousPlace } = beaconStore.getState();
        // everytime the closest place changes, we update the state
        if (place) {
          setPlace({
            id: place.id,
            timestamp: Date.now(),
          });
        }
        // if the closest place is different from the previous one, we show a notification
        if (
          place &&
          (previousPlace?.id !== place.id ||
            previousPlace?.timestamp < Date.now() - 60 * 1000 * 5) // 5 minutes
        ) {
          const url = "esterzili://place/" + place.id;
          const canOpenPlaceScreen = await Linking.canOpenURL(url);
          if (AppState.currentState === "active") {
            if (toastIdRef.current) {
              toast.update(
                toastIdRef.current,
                `${i18n.t(`poi.${place.id}.title`)}\n${i18n.t(
                  "notification.body"
                )}`,
                {
                  data: place,
                  icon: (
                    <MaterialCommunityIcons
                      name={place.icon}
                      size={48}
                      color={theme.colors.onBackground}
                    />
                  ),
                  onPress() {
                    if (canOpenPlaceScreen) {
                      Linking.openURL(url);
                      toast.hide(toastIdRef.current!);
                    }
                  },
                }
              );
            } else {
              toastIdRef.current = toast.show(
                `${i18n.t(`poi.${place.id}.title`)}\n${i18n.t(
                  "notification.body"
                )}`,
                {
                  type: "normal",
                  duration: 60 * 1000, // 1 minute
                  icon: (
                    <MaterialCommunityIcons
                      name={place.icon}
                      size={48}
                      color={theme.colors.onBackground}
                    />
                  ),
                  onClose() {
                    toastIdRef.current = null;
                  },
                  onPress() {
                    if (canOpenPlaceScreen) {
                      Linking.openURL(url);
                      toast.hide(toastIdRef.current!);
                    }
                  },
                  data: place,
                }
              );
            }
          } else {
            Notifications.scheduleNotificationAsync({
              identifier: "beacon",
              content: {
                title: i18n.t(`poi.${place.id}.title`),
                body: i18n.t("notification.body"),
                data: {
                  url,
                },
              },
              trigger: null,
            });
          }
        }
      });
      Beacon.startBeaconScan([
        {
          id: "all",
        },
      ]);
    }

    if (onBoardingShown) {
      prepare();
    }

    return () => {
      Beacon.stopBeaconScan().catch((error) => {
        console.warn("Failed to stop beacon scan", error);
      });
      clearBeacons();
    };
  }, [clearBeacons, onBoardingShown, setBeacons, setPlace]);
}
