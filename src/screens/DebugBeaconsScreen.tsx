import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Divider, List, Text, useTheme } from "react-native-paper";
import Constants from "expo-constants";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes";
import { useMakeStyle } from "../useStyle";
import {
  POI_MAP_BY_BEACON_MINOR,
  Place,
} from "../constants";
import { beaconStore } from "../store/states";
import { useI18n } from "../useI18n";

type DebugBeaconsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "DebugBeacons"
>;

const formatDistance = (value?: number) => {
  if (value === undefined) return "N/A";
  return `${value.toFixed(2)} m`;
};

const formatTimestamp = (timestamp?: number) => {
  if (!timestamp) return "--";
  try {
    return new Date(timestamp).toLocaleTimeString();
  } catch {
    return "--";
  }
};

const getDebugVariant = () => {
  // Useful to show which build variant is running alongside the scan
  const variant = Constants.expoConfig?.extra?.variant;
  if (typeof variant === "string") {
    return variant;
  }
  return "unknown";
};

export default function DebugBeaconsScreen(_: DebugBeaconsScreenProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { i18n } = useI18n();

  const beacons = beaconStore((state) => state.beacons);
  const closestPlace = beaconStore((state) => state.closestPlace);

  const sortedBeacons = useMemo(() => {
    return [...beacons].sort((a, b) => {
      const aDistance = a.distance ?? Number.POSITIVE_INFINITY;
      const bDistance = b.distance ?? Number.POSITIVE_INFINITY;
      return aDistance - bDistance;
    });
  }, [beacons]);

  const lastUpdate = sortedBeacons[0]?.timestamp;

  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.section}>
        <Text style={styles.heading}>Debug Variant</Text>
        <Text style={styles.value}>{getDebugVariant()}</Text>
      </View>
      <Divider />
      <View style={styles.section}>
        <Text style={styles.heading}>Closest POI</Text>
        {closestPlace ? (
          <>
            <Text style={styles.value}>
              {i18n.t(`poi.${closestPlace.id}.title`)}
            </Text>
            <Text style={styles.meta}>
              Last change: {formatTimestamp(closestPlace.timestamp)}
            </Text>
          </>
        ) : (
          <Text style={styles.meta}>No POI selected</Text>
        )}
      </View>
      <Divider />
      <List.Section>
        <List.Subheader>
          Detected beacons ({sortedBeacons.length})
        </List.Subheader>
        {sortedBeacons.length === 0 ? (
          <List.Item
            title="No beacons in range"
            description="Enable Bluetooth, grant beacon permissions, and approach a configured beacon."
            left={(props) => <List.Icon {...props} icon="access-point-off" />}
          />
        ) : (
          sortedBeacons.map((beacon, index) => {
            const uuidLabel = beacon.uuid ?? "unknown";
            const place: Place | undefined =
              beacon.minor !== undefined
                ? POI_MAP_BY_BEACON_MINOR[beacon.minor]
                : undefined;
            const key = `${uuidLabel}-${beacon.major ?? "x"}-${
              beacon.minor ?? "x"
            }-${index}`;
            const isClosest =
              place && closestPlace && place.id === closestPlace.id;
            const title = place
              ? i18n.t(`poi.${place.id}.title`)
              : `Beacon ${uuidLabel}`;
            const descriptionLines = [
              `UUID: ${uuidLabel}`,
              `Major: ${beacon.major ?? "?"} · Minor: ${
                beacon.minor ?? "?"
              }`,
              `Last seen: ${formatTimestamp(beacon.timestamp)}`,
            ];
            return (
              <List.Item
                key={key}
                title={title}
                description={descriptionLines.join("\n")}
                descriptionNumberOfLines={4}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={isClosest ? "crosshairs-gps" : "access-point"}
                    color={
                      isClosest ? theme.colors.primary : props.color
                    }
                  />
                )}
                right={() => (
                  <Text style={styles.distance}>{formatDistance(beacon.distance)}</Text>
                )}
              />
            );
          })
        )}
      </List.Section>
      <Divider />
      <View style={styles.section}>
        <Text style={styles.meta}>
          Last update: {formatTimestamp(lastUpdate)}
        </Text>
      </View>
    </ScrollView>
  );
}

const useStyles = () => {
  const theme = useTheme();

  return useMakeStyle({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: 16,
    },
    section: {
      paddingVertical: 12,
    },
    heading: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.onBackground,
      marginBottom: 4,
    },
    value: {
      fontSize: 16,
      color: theme.colors.onBackground,
    },
    meta: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
    distance: {
      alignSelf: "center",
      fontWeight: "600",
      color: theme.colors.onBackground,
      minWidth: 72,
      textAlign: "right",
    },
  });
};
