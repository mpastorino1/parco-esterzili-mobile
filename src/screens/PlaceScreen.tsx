import { View, ScrollView, Image } from "react-native";
import { List, Text, Divider, Button, useTheme } from "react-native-paper";
import React, { useCallback, useMemo } from "react";
import { useMakeStyle } from "../useStyle";
import * as Speech from "expo-speech";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import { usePlace } from "../constants";
import { hexToRgba, isInsidePark } from "../utils";
import { useAppStore, useLocationStore } from "../store/states";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes";
import { useFocusEffect } from "@react-navigation/native";
import { useI18n } from "../useI18n";

export type PlaceScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Place"
>;

export default function PlaceScreen(props: PlaceScreenProps) {
  const { navigation, route } = props;
  const { placeId } = route.params;

  const styles = useStyles();
  const theme = useTheme();
  const { i18n } = useI18n();

  const place = usePlace(placeId);

  const speak = useSpeak();

  const { location } = useLocationStore();

  const isInside = location && isInsidePark(location);

  if (!place) return null;

  const isImage = place.mediaType?.includes("image");
  const isVideo = place.mediaType?.includes("video");
  const isAudio = place.mediaType?.includes("audio");

  const title = i18n.t(`poi.${place.id}.title`);
  const info = i18n.t(`poi.${place.id}.info`);

  const showVideo = () => {
    // TODO: to implement
  };

  const getDirections = () => {
    navigation.navigate("Navigator", {
      placeId: place.id,
    });
  };

  return (
    <ScrollView style={styles.list} contentInsetAdjustmentBehavior="automatic">
      {place.image && (
        <Image
          style={styles.imageView}
          source={place.image}
          resizeMode="cover"
        />
      )}
      {(isVideo || isAudio) && (
        <View style={styles.buttonContainer}>
          {isVideo && (
            <Button
              icon="movie-play-outline"
              style={styles.sheetButton}
              textColor={theme.colors.primary}
              buttonColor={hexToRgba(theme.colors.primary, 0.08)}
              mode={"contained"}
              onPress={showVideo}
            >
              {i18n.t("place.button.video")}
            </Button>
          )}
          {isAudio && (
            <Button
              accessible={false}
              importantForAccessibility="no-hide-descendants"
              icon="headphones"
              style={styles.sheetButton}
              textColor={theme.colors.primary}
              buttonColor={hexToRgba(theme.colors.primary, 0.08)}
              mode={"contained"}
              onPress={() => speak(info)}
            >
              {i18n.t("place.button.audio")}
            </Button>
          )}
        </View>
      )}
      <Divider />
      <View style={styles.textInfo}>
        <Text style={styles.info}>{i18n.t("place.info")}</Text>
        <Text style={styles.title}>{title}</Text>
        {info && <Text style={styles.description}>{info}</Text>}
      </View>
      {isInside && (
        <View style={styles.endButton}>
          <Button
            icon="arrow-right-top"
            style={styles.sheetButton}
            textColor={theme.colors.secondary}
            buttonColor={hexToRgba(theme.colors.secondary, 0.08)}
            mode={"contained"}
            onPress={getDirections}
          >
            {i18n.t("place.button.route")}
          </Button>
        </View>
      )}
    </ScrollView>
  );
}

const useSpeak = () => {
  const lang = useAppStore((state) => state.lang);
  const speechLanguage = useMemo(() => {
    if (!lang) return undefined;
    if (lang.includes("-")) return lang;

    const normalized = lang.toLowerCase();
    switch (normalized) {
      case "it":
        return "it-IT";
      case "en":
        return "en-US";
      default:
        return normalized;
    }
  }, [lang]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        Speech.isSpeakingAsync().then((isSpeaking) => {
          if (isSpeaking) {
            Speech.stop();
          }
        });
      };
    }, [])
  );

  const speak = useCallback(
    async (description: string) => {
      if (!description) {
        return;
      }

      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        Speech.stop();
      }

      try {
        // Configura la sessione audio per utilizzare l'altoparlante su iOS
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.warn("Errore configurazione audio:", error);
      }

      const options = speechLanguage ? { language: speechLanguage } : undefined;
      Speech.speak(description, options);
    },
    [speechLanguage]
  );

  return speak;
};

const useStyles = () => {
  const theme = useTheme();

  return useMakeStyle({
    subHeader: {
      fontWeight: "bold",
      marginBottom: 15,
      fontSize: 34,
    },
    list: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    imageView: {
      backgroundColor: "grey",
      height: 240,
      width: "100%",
    },
    sheetButton: {
      marginVertical: 8,
      borderRadius: 12,
    },
    buttonContainer: {
      paddingHorizontal: 48,
      paddingVertical: 24,
    },
    textInfo: {
      paddingHorizontal: 20,
      paddingTop: 32,
      paddingBottom: 48,
    },
    info: {
      fontSize: 15,
      marginBottom: 8,
      color: theme.colors.outline,
    },
    title: {
      fontSize: 34,
      fontWeight: "bold",
      marginBottom: 24,
      color: theme.colors.onBackground,
    },
    description: {
      fontSize: 17,
      justifyContent: "flex-start",
      color: theme.colors.onBackground,
    },
    endButton: {
      paddingBottom: 48,
      paddingLeft: 48,
      paddingRight: 48,
    },
  });
};
