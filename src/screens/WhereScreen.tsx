import React from "react";
import { Text, ScrollView, Image, Linking } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { useMakeStyle } from "../useStyle";
import { PLACES } from "../constants";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes";
import { useI18n } from "../useI18n";

export type WhereScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Where"
>;

export default function WhereScreen() {
  const styles = useStyles();
  const { i18n } = useI18n();
  const theme = useTheme();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Image style={styles.image} source={require("../assets/onb1/onb1.png")} />
      <Text style={styles.text}>
        {i18n.t("where.info")}
      </Text>
      <Button
        style={styles.button}
        mode="contained"
        onPress={openGoogleMaps}
        textColor={theme.colors.secondary}
        buttonColor={hexToRgba(theme.colors.secondary, 0.1)}
        icon="arrow-right-top"
      >
        {i18n.t("where.button")}
      </Button>
    </ScrollView>
  );
}

const openGoogleMaps = async () => {
  const {
    coordinates: { latitude, longitude },
  } = PLACES.find((poi) => poi.id === "ingresso_san_martino")!;

  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  if (await Linking.canOpenURL(url)) {
    Linking.openURL(url);
  }
};

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const useStyles = () => {
  const theme = useTheme();

  return useMakeStyle({
    container: {
      flex: 1,
    },
    contentContainer: {
      paddingTop: 10,
      backgroundColor: theme.colors.background,
      padding: 48,
      alignItems: "center",
    },
    image: {
      width: 200,
      height: 200,
      marginBottom: 48,
    },
    text: {
      fontSize: 17,
      color: theme.colors.onBackground,
      marginBottom: 48,
    },
    button: {
      width: "100%",
      borderRadius: 12,
    },
  });
};
