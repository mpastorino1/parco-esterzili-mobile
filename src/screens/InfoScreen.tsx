import { FlatList, FlatListProps } from "react-native";
import { List, Divider, ListIconProps, useTheme } from "react-native-paper";
import React from "react";
import { useMakeStyle } from "../useStyle";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes";
import { useI18n } from "../useI18n";

export type InfoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Info"
>;

type Data = {
  id: string;
  title: string;
  icon: ListIconProps["icon"];
  href: keyof RootStackParamList;
};

export default function InfoScreen(props: InfoScreenProps) {
  const { navigation } = props;

  const styles = useStyles();
  const theme = useTheme();
  const { i18n } = useI18n();

  const data: Data[] = [
    {
      id: "1",
      title: i18n.t("info.items.direction"),
      icon: "directions",
      href: "Where",
    },
    /*
    {
      id: "2",
      title: i18n.t("info.items.about"),
      icon: "information",
      href: "About",
    },
    */
    {
      id: "3",
      title: i18n.t("info.items.credits"),
      icon: "star",
      href: "Credits",
    },
    {
      id: "4",
      title: i18n.t("info.items.contact"),
      icon: "phone",
      href: "Contact",
    },
    {
      id: "5",
      title: i18n.t("info.items.lang"),
      icon: "earth",
      href: "Lang",
    },
  ];

  const renderItem: FlatListProps<Data>["renderItem"] = (info) => {
    const { item } = info;

    return (
      <List.Item
        left={(props) => (
          <List.Icon {...props} color="green" icon={item.icon} />
        )}
        title={item.title}
        right={(props) => (
          <List.Icon
            {...props}
            color={theme.colors.outline}
            icon="chevron-right"
          />
        )}
        onPress={() => {
          // why is type assertion needed here?
          navigation.navigate(
            item.href as keyof InfoScreenProps["navigation"]["navigate"]
          );
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
