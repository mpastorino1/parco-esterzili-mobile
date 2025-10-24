import { create } from "zustand";
import { zustandStorage } from "./storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { Place } from "../constants";
import { LocationObject } from "expo-location";
import { getLocales } from "expo-localization";
import i18n from "../translations/i18n";

export interface AppState {
  onBoardingShown: boolean;
  setOnBoardingShown: (seen: boolean) => void;
  lang: string;
  setLang: (lang: string) => void;
}

export const useAppStore = create<AppState, [["zustand/persist", AppState]]>(
  persist(
    (set) => ({
      onBoardingShown: false,
      lang: getLocales()[0].languageCode,
      setOnBoardingShown: (onBoardingShown) => {
        set({ onBoardingShown });
      },
      setLang: (lang: string) => {
        set({ lang });
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            if (state) {
              i18n.locale = state.lang;
            }
          }
        };
      },
    }
  )
);

export interface BeaconState {
  /**
   * The closest place to the user
   **/
  closestPlace: { id: Place["id"]; timestamp: number } | null;
  setPlace: (place: { id: Place["id"]; timestamp: number }) => void;
  beacons: BeaconReading[];
  setBeacons: (beacons: BeaconReading[]) => void;
  clearBeacons: () => void;
}

export const beaconStore = create<
  BeaconState,
  [["zustand/persist", BeaconState]]
>(
  persist(
    (set) => ({
      closestPlace: null,
      setPlace: (place) => {
        set({ closestPlace: place });
      },
      beacons: [],
      setBeacons: (beacons) => {
        set({ beacons });
      },
      clearBeacons: () => {
        set({ beacons: [] });
      },
    }),
    {
      name: "beacon-storage",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        closestPlace: state.closestPlace,
      }),
    }
  )
);

export type BeaconReading = {
  uuid?: string;
  major?: number;
  minor?: number;
  distance?: number;
  timestamp: number;
};

export interface LocationState {
  location: LocationObject | null;
  setLocation: (location: LocationObject) => void;
}

export const useLocationStore = create<
  LocationState,
  [["zustand/persist", LocationState]]
>((set) => ({
  location: null,
  setLocation: (location) => {
    set({ location });
  },
}));
