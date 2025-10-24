import React from "react";
import { View, Text, ViewProps, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "react-native-paper";
import distance from "@turf/distance";
import { useMakeStyle } from "../useStyle";
import { Place } from "../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { isInsidePark } from "../utils";
import { useLocationStore } from "../store/states";
import { useI18n } from "../useI18n";

interface ListItemProps {
  style?: ViewProps["style"];
  poi: Place;
  onPress?: () => void;
}

const mediaTypeIcons: {
  [key: string]: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
} = {
  image: "image-outline",
  video: "movie-outline",
  audio: "headphones",
};

const ListItem = (props: ListItemProps) => {
  const { style, poi, onPress } = props;

  const styles = useStyle();

  const theme = useTheme();

  const { i18n } = useI18n();

  /*
  const distanceFromCurrentLocation = useDistance(poi);

  const distanceFormatted = i18n.t("listItem.distance", {
    value: i18n.numberToRounded(distanceFromCurrentLocation || 0, {
      precision: 0,
    }),
  });
  */

  return (
    <TouchableOpacity style={style} onPress={onPress} disabled={!onPress}>
      <View style={styles.container}>
        {poi.image && <Image source={poi.image} style={styles.image} />}

        <View style={styles.textContainer}>
          <View style={{ flexDirection: "row" }}>
            {poi.mediaType?.map((type) => (
              <MaterialCommunityIcons
                key={type}
                color={theme.colors.outline}
                size={20}
                name={mediaTypeIcons[type]}
                style={styles.icon}
              />
            ))}
          </View>
          <Text style={styles.title}>{i18n.t(`poi.${poi.id}.title`)}</Text>
          {/*distanceFromCurrentLocation && (
            <Text style={styles.description}>{distanceFormatted}</Text>
          )*/}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const useDistance = (poi: Place): number | null => {
  const { location } = useLocationStore();

  if (!location || !isInsidePark(location)) return null;

  return distance(
    [location.coords.longitude, location.coords.latitude],
    [poi.coordinates.longitude, poi.coordinates.latitude],
    {
      units: "meters",
    }
  );
};

const useStyle = () => {
  const theme = useTheme();

  return useMakeStyle({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
    },
    image: {
      width: 66,
      height: 66,
      borderRadius: 8,
      marginRight: 20,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 17,
      lineHeight: 22,
      paddingVertical: 3,
      fontWeight: "bold",
      color: theme.colors.onBackground,
    },
    description: {
      fontSize: 14,
      color: theme.colors.outline,
    },
    icon: {
      width: 20,
      height: 20,
    },
  });
};

export default ListItem;
