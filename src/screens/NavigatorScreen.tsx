import { useWindowDimensions } from "react-native";
import { Props as ShapeSourceProps } from "@rnmapbox/maps/src/components/ShapeSource";
import { Card, Divider, IconButton, useTheme } from "react-native-paper";
import React, { useEffect, useRef, useState } from "react";
import { useMakeStyle } from "../useStyle";
import { Camera } from "@rnmapbox/maps";
import BottomSheet from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { PLACES } from "../constants";
import { getDirections } from "../api";
import DirectionsBottomSheet, {
  DirectionsBottomSheetProps,
} from "../components/DirectionsBottomSheet";
import Map from "../components/Map";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes";

export type NavigatorScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Navigator"
>;

export default function NavigatorScreen(props: NavigatorScreenProps) {
  const { placeId } = props.route.params;

  const styles = useStyles();

  const theme = useTheme();

  const place = PLACES.find((poi) => poi.id === placeId)!;

  const [coordinates, setCoordinates] = useState<[number, number][] | null>(
    null
  );

  const [instruction, setInstruction] =
    useState<DirectionsBottomSheetProps["directions"]>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const openSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    if (placeId) {
      refresh();
    }
  }, [placeId]);

  useEffect(() => {
    if (coordinates && cameraRef.current) {
      const latitudes = coordinates.map((coordinate) => coordinate[1]);
      const longitudes = coordinates.map((coordinate) => coordinate[0]);

      let ne = [Math.max(...longitudes), Math.max(...latitudes)];

      let sw = [Math.min(...longitudes), Math.min(...latitudes)];

      cameraRef.current?.setCamera({
        bounds: {
          ne,
          sw,
        },
        padding: {
          paddingTop: 50,
          paddingRight: 50,
          paddingLeft: 50,
          paddingBottom: 150,
        },
      });
    }
  }, [coordinates, cameraRef.current]);

  const refresh = async () => {
    const currentLocation = await Location.getCurrentPositionAsync();

    const data = await getDirections(currentLocation, place);

    const steps = data.routes[0].legs[0].steps;
    const route = data.routes[0].geometry.coordinates;
    const instructions = steps.map((step: any) => ({
      instruction: step.maneuver.instruction,
      distance: step.distance,
    }));
    const allSteps = steps.map((step: any) => step.geometry.coordinates);

    setInstruction(instructions);
    setCoordinates(route);
    openSheet();
  };

  const goToPosition = async () => {
    const position = await Location.getLastKnownPositionAsync();

    if (position) {
      cameraRef.current?.setCamera({
        centerCoordinate: [position.coords.longitude, position.coords.latitude],
        animationDuration: 300,
      });
    }
  };

  const route: ShapeSourceProps["shape"] | null = coordinates
    ? {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: coordinates,
            },
            properties: {},
          },
        ],
      }
    : null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Map ref={cameraRef} route={route} />
      <Card
        style={styles.mapButton}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        <IconButton
          onPress={refresh}
          iconColor={theme.colors.onBackground}
          size={24}
          icon="refresh"
        />
        <Divider />
        <IconButton
          onPress={goToPosition}
          iconColor={theme.colors.onBackground}
          size={24}
          icon="navigation-variant"
        />
      </Card>
      <DirectionsBottomSheet ref={bottomSheetRef} directions={instruction} />
    </SafeAreaView>
  );
}

const useStyles = () => {
  const theme = useTheme();
  const window = useWindowDimensions();

  return useMakeStyle({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    closedMarker: {
      backgroundColor: "#008042",
      borderRadius: 50,
      padding: 4,
    },
    button: {
      marginVertical: 50,
      borderRadius: 12,
      fontWeight: "bold",
    },
    map: {
      width: window.width,
      height: window.height,
    },
    bottomSheetBackground: {
      backgroundColor: theme.colors.background,
    },
    bottomSheetHandleIndicator: {
      backgroundColor: theme.colors.onBackground,
    },
    bottomSheetContainer: {
      paddingHorizontal: 16,
      backgroundColor: theme.colors.background,
    },
    bottomSheetContent: {
      paddingHorizontal: 32,
    },
    sheetButton: {
      width: "100%",
      marginVertical: 8,
      height: 50,
      borderRadius: 12,
      justifyContent: "center",
    },
    mapButton: {
      position: "absolute",
      right: 10,
      top: 70,
    },
    activityIndicator: {
      position: "absolute",
      alignSelf: "center",
    },
    buttonClose: {
      alignSelf: "flex-end",
    },
    marker: {
      width: 40,
      height: 40,
    },
    bottom: {
      width: "100%",
      position: "absolute",
      alignSelf: "center",
      bottom: 0,
    },
  });
};
