import React from "react";
import { Text, ScrollView, Image } from "react-native";
import { useTheme } from "react-native-paper";
import { useMakeStyle } from "../useStyle";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes";

export type AboutScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "About"
>;

export default function AboutScreen() {
  const styles = useStyles();
  const theme = useTheme();

  const logo = theme.dark
    ? require("../assets/Logo-200w:ondark.png")
    : require("../assets/Logo-200w.png");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Image style={styles.image} source={logo} />
      <Text style={styles.text}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed dui
        sollicitudin, congue justo et, dapibus orci. Sed vel purus tortor. Nam
        dictum erat justo. Vestibulum congue vel velit nec consectetur. Nunc vel
        odio ullamcorper, venenatis sem vel, maximus eros. Phasellus erat lorem,
        efficitur pretium ornare in, elementum at sem. Suspendisse sed volutpat
        elit, a volutpat sem. Morbi pretium quam vitae feugiat dignissim.
      </Text>
    </ScrollView>
  );
}

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
  });
};
