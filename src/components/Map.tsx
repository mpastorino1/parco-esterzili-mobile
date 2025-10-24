import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { useTheme } from "react-native-paper";
import { useMakeStyle } from "../useStyle";
import {
  Camera,
  CameraStop,
  LineLayer,
  MapView,
  MarkerView,
  ShapeSource,
  UserLocation,
} from "@rnmapbox/maps";
import { AYMERICH_BOUNDS, POI, POI_BOUNDS, Place } from "../constants";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useI18n } from "../useI18n";
import { CameraStops } from "@rnmapbox/maps/lib/typescript/src/components/Camera";

export type MapProps = {
  route?: any;
  markerOnPress?: (poi: Place) => void;
};

const Map = forwardRef<Camera, MapProps>((props: MapProps, ref) => {
  const { route, markerOnPress } = props;

  const styles = useStyles();

  const theme = useTheme();

  const cameraRef = useRef<Camera>(null);

  useImperativeHandle<Camera, any>(
    ref,
    () => {
      return {
        setCamera: (config: CameraStop | CameraStops) => {
          cameraRef.current?.setCamera(config);
        },
      };
    },
    []
  );

  return (
    <MapView
      styleURL={"mapbox://styles/gsto98/clhepuw2a017401pgd8i9ekkp"}
      compassEnabled={false}
      scaleBarEnabled={false}
      attributionEnabled={false}
      logoEnabled={false}
      importantForAccessibility="no-hide-descendants"
      accessible={false}
      style={styles.map}
    >
      <Camera
        zoomLevel={15}
        maxBounds={AYMERICH_BOUNDS}
        ref={cameraRef}
        bounds={POI_BOUNDS}
        animationDuration={0}
      />
      {POI.map((poi) => (
        <Marker key={poi.id} poi={poi} onPress={markerOnPress} />
      ))}
      {route && (
        <ShapeSource id="route" shape={route}>
          <LineLayer
            id="routeFill"
            style={{ lineColor: theme.colors.error, lineWidth: 3 }}
          />
        </ShapeSource>
      )}
      <UserLocation showsUserHeadingIndicator animated />
    </MapView>
  );
});

type MarkerProps = {
  poi: Place;
  onPress?: (poi: Place) => void;
};

function Marker(props: MarkerProps) {
  const { poi: place, onPress } = props;

  const styles = useStyles();
  const theme = useTheme();
  const { i18n } = useI18n();

  return (
    <MarkerView
      accessibilityLabel={i18n.t(`poi.${place.id}.title`)}
      coordinate={[place.coordinates.longitude, place.coordinates.latitude]}
      allowOverlap
    >
      <TouchableOpacity
        disabled={!onPress}
        onPress={() => {
          onPress && onPress(place);
        }}
      >
        <View
          style={styles.closedMarker}
          importantForAccessibility="no-hide-descendants"
        >
          <MaterialCommunityIcons
            name={place.icon}
            size={18}
            color={theme.colors.onPrimary}
          />
        </View>
      </TouchableOpacity>
    </MarkerView>
  );
}

const useStyles = () => {
  const theme = useTheme();
  const window = useWindowDimensions();

  return useMakeStyle({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    button: {
      position: "absolute",
      height: 50,
      width: "70%",
      justifyContent: "center",
      alignSelf: "center",
      bottom: 50,
      borderRadius: 12,
      fontWeight: "bold",
    },
    closedMarker: {
      backgroundColor: theme.colors.primary,
      borderRadius: 38,
      width: 38,
      height: 38,
      padding: 10,
    },
    map: {
      width: window.width,
      height: window.height,
      overflow: "hidden",
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
  });
};

export default Map;
