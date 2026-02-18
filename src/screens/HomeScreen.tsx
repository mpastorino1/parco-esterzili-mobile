import { View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Divider,
  IconButton,
  useTheme,
} from "react-native-paper";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import BottomSheet from "@gorhom/bottom-sheet";
import { useMakeStyle } from "../useStyle";
import Map from "../components/Map";
import { POI_BOUNDS, Place } from "../constants";
import MarkerBottomSheet from "../components/MarkerBottomSheet";
import { useLocationStore } from "../store/states";
import { Camera } from "@rnmapbox/maps";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes";
import { useI18n } from "../useI18n";
import { isInsidePark } from "../utils";
import Constants from "expo-constants";

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;

export default function HomeScreen(props: HomeScreenProps) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <MapContainer {...props} />
    </View>
  );
}

const MapContainer = (props: HomeScreenProps) => {
  const { navigation } = props;

  const [placeSelected, setPlaceSelected] = useState<Place | null>(null);

  const styles = useStyles();

  const theme = useTheme();

  const { i18n } = useI18n();

  const { location } = useLocationStore();

  const [mapReady, setMapReady] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const cameraRef = useRef<Camera>(null);
  const variant =
    (Constants.expoConfig?.extra as { variant?: string } | undefined)
      ?.variant;
  const showDebug = true;

  useEffect(() => {
    if (cameraRef.current) {
      setTimeout(() => {
        cameraRef.current?.setCamera({
          bounds: POI_BOUNDS,
          padding: {
            paddingBottom: 50,
            paddingLeft: 50,
            paddingRight: 50,
            paddingTop: 50,
          },
          animationDuration: 0,
        });
        setMapReady(true);
      }, 1000);
    }
  }, [cameraRef.current]);

  useLayoutEffect(() => {
    if (placeSelected) {
      bottomSheetRef.current?.expand();
    }
  }, [placeSelected]);

  const openSheetWithCoordinates = (poi: Place) => {
    setPlaceSelected(poi);
  };

  const showPlaces = () => {
    navigation.navigate("Places");
  };

  const showInfo = () => {
    navigation.navigate("Info");
  };

  const openDebugBeacons = () => {
    navigation.navigate("DebugBeacons");
  };

  const centerUserLocation = async () => {
    const position = await Location.getLastKnownPositionAsync();

    if (position) {
      cameraRef.current?.setCamera({
        centerCoordinate: [position.coords.longitude, position.coords.latitude],
        animationDuration: 300,
      });
    }
  };

  const onClose = () => {
    setPlaceSelected(null);
  };

  const isInside = location && isInsidePark(location);

  return (
    <View style={styles.container}>
      <Map ref={cameraRef} markerOnPress={openSheetWithCoordinates} />
      {!mapReady && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: theme.colors.background,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
      <Card style={styles.mapButton}>
        <IconButton
          onPress={showInfo}
          iconColor={theme.colors.onBackground}
          size={24}
          icon="help-circle"
          accessibilityLabel={i18n.t("home.infoButton")}
        />
        <Divider />
        {!showDebug ? (
          <View>
            <IconButton
              onPress={openDebugBeacons}
              iconColor={theme.colors.onBackground}
              size={24}
              icon="bug-outline"
              accessibilityLabel="Apri debug beacon"
            />
            <Divider />
          </View>
        ) : null}
        <IconButton
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          onPress={centerUserLocation}
          iconColor={theme.colors.onBackground}
          size={24}
          icon="navigation-variant"
          accessibilityLabel="Posizione corrente"
          disabled={!isInside}
        />
      </Card>
      <Button
        onPress={showPlaces}
        textColor={theme.colors.onBackground}
        buttonColor={theme.colors.background}
        style={styles.button}
      >
        {i18n.t("home.showPlacesButton")}
      </Button>
      <MarkerBottomSheet
        ref={bottomSheetRef}
        poi={placeSelected}
        onClose={onClose}
      />
    </View>
  );
};

const useStyles = () => {
  const theme = useTheme();

  return useMakeStyle({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    button: {
      position: "absolute",
      width: "70%",
      justifyContent: "center",
      alignSelf: "center",
      bottom: 50,
      borderRadius: 12,
      fontWeight: "bold",
    },
    closedMarker: {
      backgroundColor: "#008042",
      borderRadius: 50,
      padding: 4,
    },
    map: {
      width: "100%",
      height: "100%",
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
  });
};
