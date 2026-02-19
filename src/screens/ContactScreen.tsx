import React from "react";
import { Text, ScrollView, Image, View, ImageProps } from "react-native";
import { Divider, List, useTheme } from "react-native-paper";
import { useMakeStyle } from "../useStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes";
import { useI18n } from "../useI18n";

export type ContactScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Contact"
>;

export default function ContactScreen() {
  const styles = useStyles();
  const { i18n } = useI18n();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      contentInsetAdjustmentBehavior="automatic"
    >
      <InfoCell
        title="Comune di Esterzili (dati in aggiornamento)"
        phone="+39 000 000 0000"
        mail="contatti in aggiornamento"
      />
      <InfoCell
        icon={require("../assets/logo-comunita-montana.png")}
        title="Comunità Montana Sarcidano Barbagia di Seulo"
        phone="+39 347 123 4567"
        mail="segreteria@cm13.it"
      />
      <InfoCell
        icon={require("../assets/logo-sardegna-foreste.png")}
        title="Sardegna Foreste"
        phone="+39 0782 802 231"
        mail="lorem@gmail.com"
      />
      <InfoCell title={i18n.t("contact.sanitaryEmergency")} phone="118" />
      <InfoCell title={i18n.t("contact.carabinieri")} phone="112" />
      <InfoCell title={i18n.t("contact.statePolice")} phone="113" />
      <InfoCell title={i18n.t("contact.fireFighters")} phone="115" />
      <InfoCell title={i18n.t("contact.localPolice")} phone="0782 269 579" />
    </ScrollView>
  );
}

type InfoCellProps = {
  icon?: ImageProps["source"];
  title: string;
  phone: string;
  mail?: string;
};

const InfoCell = (props: InfoCellProps) => {
  const { icon, title, phone, mail } = props;

  const { i18n } = useI18n();

  const styles = useStyles();

  if (!mail) {
    return (
      <View>
        <List.Item
          titleStyle={styles.infoCellTitle}
          titleNumberOfLines={2}
          title={title}
          right={() => {
            return (
              <Text
                style={styles.infoCellValue}
                accessibilityLabel={`${i18n.t("contact.phoneLabel")} ${phone}`}
              >
                <MaterialCommunityIcons name="phone" />
                <Text> {phone}</Text>
              </Text>
            );
          }}
        />
        <Divider />
      </View>
    );
  }

  return (
    <View>
      <List.Item
        titleStyle={styles.infoCellTitle}
        titleNumberOfLines={2}
        left={
          icon
            ? () => {
                return <Image style={styles.infoCellIcon} source={icon} />;
              }
            : undefined
        }
        title={title}
        description={() => {
          return (
            <View>
              <Text
                style={styles.infoCellValue}
                accessibilityLabel={`${i18n.t("contact.phoneLabel")} ${phone}`}
              >
                <MaterialCommunityIcons name="phone" />
                <Text> {phone}</Text>
              </Text>
              <Text
                style={styles.infoCellValue}
                accessibilityLabel={`${i18n.t("contact.mailLabel")} ${mail}`}
              >
                <MaterialCommunityIcons name="email" />
                <Text> {mail}</Text>
              </Text>
            </View>
          );
        }}
      />
      <Divider />
    </View>
  );
};

const useStyles = () => {
  const theme = useTheme();

  return useMakeStyle({
    container: {
      flex: 1,
    },
    contentContainer: {
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    infoCellIcon: {
      width: 48,
      height: 48,
    },
    infoCellTitle: {
      color: theme.colors.onBackground,
      fontWeight: "bold",
    },
    infoCellValue: {
      color: theme.colors.outline,
    },
  });
};
