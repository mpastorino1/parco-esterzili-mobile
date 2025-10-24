import React from "react";
import { View, Text, ViewProps } from "react-native";
import { useTheme } from "react-native-paper";
import { useMakeStyle } from "../useStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useI18n } from "../useI18n";

interface IndicationProps {
  style?: ViewProps["style"];
  description: string;
  distance: number;
}

const Indication = ({ style, description, distance }: IndicationProps) => {
  const styles = useStyle();
  const theme = useTheme();
  const { i18n } = useI18n();

  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        name="play"
        size={24}
        color={theme.colors.onBackground}
      />
      <View style={styles.content}>
        <Text style={styles.description}>{description}</Text>
        {distance > 0 && (
          <Text style={styles.distance}>
            {i18n.t("navigator.distance", {
              value: i18n.numberToRounded(distance, {
                roundMode: "ceil",
                precision: 0,
              }),
            })}
          </Text>
        )}
      </View>
    </View>
  );
};

const useStyle = () => {
  const theme = useTheme();

  return useMakeStyle({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    content: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    description: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: "bold",
      color: theme.colors.onBackground,
      textAlign: "left",
      paddingLeft: 16,
    },
    distance: {
      fontSize: 20,
      color: theme.colors.outline,
      textAlign: "left",
      paddingLeft: 16,
    },
  });
};

export default Indication;
