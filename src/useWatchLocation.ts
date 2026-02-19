import { useEffect } from "react";
import { useAppStore, useLocationStore } from "./store/states";
import * as Location from "expo-location";

export function useWatchLocation() {
  const setLocation = useLocationStore((state) => state.setLocation);
  const onBoardingShown = useAppStore((state) => state.onBoardingShown);

  useEffect(() => {
    let listener: Location.LocationSubscription | null = null;

    const watchLocation = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== "granted") {
          return;
        }

        listener = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
          },
          (location) => {
            setLocation(location);
          }
        );
      } catch (error) {
        console.warn("Unable to watch location", error);
      }
    };

    if (onBoardingShown) {
      watchLocation();
    }

    return () => {
      listener?.remove();
    };
  }, [onBoardingShown, setLocation]);
}
