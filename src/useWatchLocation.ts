import { useEffect } from "react";
import { useAppStore, useLocationStore } from "./store/states";
import * as Location from "expo-location";

export async function useWatchLocation() {
  const locationStore = useLocationStore();
  const onBoardingShown = useAppStore((state) => state.onBoardingShown);

  useEffect(() => {
    let listener: Location.LocationSubscription | null = null;

    const watchLocation = async () => {
      listener = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
        },
        (location) => {
          locationStore.setLocation(location);
        }
      );
    };

    if (onBoardingShown) {
      watchLocation();
    }

    return () => {
      listener?.remove();
    };
  }, [onBoardingShown]);
}
