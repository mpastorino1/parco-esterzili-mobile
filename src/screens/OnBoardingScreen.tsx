import React, { useRef } from "react";
import { View, Text, Image, ImageProps } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { useMakeStyle } from "../useStyle";
import { useAppStore } from "../store/states";
import { SafeAreaView } from "react-native-safe-area-context";
import PagerView from "react-native-pager-view";
// import Beacon from "react-native-beacon";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes";
import { useI18n } from "../useI18n";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

type Page = {
  image: ImageProps["source"];
  title: string;
  subtitle: string;
  goNext: () => Promise<void>;
  next: string;
};

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "OnBoarding"
>;

export default function OnBoardingScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const { i18n } = useI18n();

  const setSeen = useAppStore((state) => state.setOnBoardingShown);

  const pagerRef = useRef<PagerView>(null);

  const currentPageRef = useRef(0);

  const goNext = async () => {
    currentPageRef.current += 1;
    pagerRef.current?.setPage(currentPageRef.current);
  };

  const handleLocationClick = async () => {
    goNext();
  };

  const handleBeaconClick = async () => {
    //await Beacon.requestPermissions();
    goNext();
  };

  const goHome = async () => {
    if (Device.isDevice) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    }

    setSeen(true);
  };

  const pages: Page[] = [
    {
      image: require("../assets/onb1/onb1.png"),
      title: i18n.t("onBoardingPage.one.title"),
      subtitle: i18n.t("onBoardingPage.one.subtitle"),
      goNext,
      next: i18n.t("onBoardingPage.one.next"),
    },
    {
      image: require("../assets/onb3/onb3.png"),
      title: i18n.t("onBoardingPage.three.title"),
      subtitle: i18n.t("onBoardingPage.three.subtitle"),
      goNext: handleLocationClick,
      next: i18n.t("onBoardingPage.three.next"),
    },
    {
      image: require("../assets/onb2/onb2.png"),
      title: i18n.t("onBoardingPage.two.title"),
      subtitle: i18n.t("onBoardingPage.two.subtitle"),
      goNext: handleBeaconClick,
      next: i18n.t("onBoardingPage.two.next"),
    },
    {
      image: require("../assets/onb4/onb4.png"),
      title: i18n.t("onBoardingPage.four.title"),
      subtitle: i18n.t("onBoardingPage.four.subtitle"),
      goNext: goHome,
      next: i18n.t("onBoardingPage.four.next"),
    },
  ];

  return (
    <SafeAreaView style={styles.main}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        scrollEnabled={false}
      >
        {pages.map((page) => (
          <View
            key={page.title}
            style={{ flex: 1, justifyContent: "space-evenly" }}
          >
            <View
              style={{
                marginHorizontal: 48,
              }}
            >
              <Image style={styles.image} source={page.image} />
              <Text style={styles.title}>{page.title}</Text>
              <Text style={styles.subtitle}>{page.subtitle}</Text>
            </View>
            <Button
              buttonColor={theme.colors.onBackground}
              textColor={theme.colors.background}
              style={styles.button}
              onPress={page.goNext}
              accessibilityLabel={"Continua"}
            >
              {page.next}
            </Button>
          </View>
        ))}
      </PagerView>
    </SafeAreaView>
  );
}

const useStyles = () => {
  const theme = useTheme();

  return useMakeStyle({
    main: {
      flex: 1,
    },
    title: {
      fontSize: 34,
      marginBottom: 16,
      marginTop: 48,
      fontWeight: "bold",
      color: theme.colors.onBackground,
    },
    button: {
      marginTop: 48,
      marginHorizontal: 48,
      borderRadius: 12,
    },
    subtitle: {
      fontSize: 17,
      color: theme.colors.onBackground,
    },
    image: {
      height: 200,
      width: 200,
      alignSelf: "flex-start",
    },
  });
};
