import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Linking } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes";
import { useMakeStyle } from "../useStyle";
import { useTheme } from "react-native-paper";
import { useI18n } from "../useI18n";

export type CreditsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Credits"
>;

export default function CreditsScreen(props: CreditsScreenProps) {
  const styles = useStyles();
  const { i18n } = useI18n();

  const openLink = (link: string) => {
    Linking.openURL(link);
  };


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Image
            accessibilityLabel="Studio di Archittetura Roberto Virdis"
            accessibilityRole="text"
            style={styles.targa}
            source={require("../assets/targa-crediti.png")}
          />
      <Text style={styles.sectionTitle}>
        {i18n.t("credits.inCollaborationWith")}
      </Text>
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => openLink("http://www.cm-sarcidanobarbagiaseulo.it/hh/index.php?jvs=0&acc=1")}>
          <Image
            accessibilityLabel="Comunità Montana Sarcidano Barbagia di Seulo"
            accessibilityRole="text"
            style={styles.logo}
            source={require("../assets/logo-comunita-montana.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink("https://www.sardegnaforeste.it/")}>
          <Image
            accessibilityLabel="Sardegna Foreste"
            accessibilityRole="text"
            style={styles.logo}
            source={require("../assets/logo-sardegna-foreste.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink("https://www.comune.laconi.or.it/")}>
          <Image
            accessibilityLabel="Comune di Laconi"
            accessibilityRole="text"
            style={styles.logo}
            source={require("../assets/logo-comune-laconi.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink("https://www.menhirmuseum.it/")}>
          <Image
            accessibilityLabel="Museo di Laconi (Menhir Museum)"
            accessibilityRole="text"
            style={styles.logo}
            source={require("../assets/logo-museo-laconi.png")}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>{i18n.t("credits.realizationBy")}</Text>
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => openLink("http://greenshare.it/")}>
          <Image
            accessibilityLabel="GreenShare"
            accessibilityRole="text"
            style={styles.logo}
            source={require("../assets/logo-greenshare.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink("http://www.robertovirdis.com/")}>
          <Image
            accessibilityLabel="Studio di Archittetura Roberto Virdis"
            accessibilityRole="text"
            style={styles.logo}
            source={require("../assets/logo-virdis.png")}
          />
        </TouchableOpacity>
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
      alignItems: "center",
      paddingTop: 32,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontWeight: "bold",
      color: theme.colors.onBackground,
    },
    logoContainer: {
      flexDirection: "row",
      marginTop: 16,
      marginBottom: 32,
    },
    logo: {
      width: 80,
      height: 80,
    },
    targa: {
      width: 350,
      height: 250,
      marginBottom: 32,
    },
  });
};
