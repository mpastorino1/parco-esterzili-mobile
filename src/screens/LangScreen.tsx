import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { FlatList, FlatListProps, Image, ImageProps } from "react-native";
import { RootStackParamList } from "../routes";
import { Divider, List, useTheme } from "react-native-paper";
import { useMakeStyle } from "../useStyle";
import { useAppStore } from "../store/states";
import { useI18n } from "../useI18n";

type Data = {
  id: string;
  title: string;
  icon: ImageProps["source"];
  value: "it" | "en";
};

export type LangScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Lang"
>;

export default function LangScreen(props: LangScreenProps) {
  const { navigation } = props;

  const styles = useStyles();
  const theme = useTheme();
  const { i18n } = useI18n();
  const lang = useAppStore((state) => state.lang);
  const setLang = useAppStore((state) => state.setLang);

  const data: Data[] = [
    {
      id: "1",
      title: i18n.t("lang.it"),
      icon: require("../assets/Flag_of_Italy.svg.png"),
      value: "it",
    },
    {
      id: "2",
      title: i18n.t("lang.en"),
      icon: require("../assets/Flag_of_the_United_Kingdom_(1-2).svg.png"),
      value: "en",
    },
  ];

  const renderItem: FlatListProps<any>["renderItem"] = (info) => {
    const { item } = info;

    const isSelected = item.value === lang;

    return (
      <List.Item
        left={(props) => (
          <Image
            source={item.icon}
            style={{ width: 34, height: 34, marginLeft: 20 }}
            resizeMode="contain"
          />
        )}
        title={item.title}
        right={
          isSelected
            ? (props) => (
                <List.Icon
                  {...props}
                  color={theme.colors.outline}
                  icon="check"
                />
              )
            : undefined
        }
        onPress={() => {
          const lang = item.value;
          setLang(lang);

          i18n.locale = lang;
        }}
      />
    );
  };

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
      keyExtractor={(item) => item.id}
      data={data}
      renderItem={renderItem}
      ItemSeparatorComponent={Divider}
    />
  );
}

const useStyles = () => {
  const theme = useTheme();

  return useMakeStyle({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
};
