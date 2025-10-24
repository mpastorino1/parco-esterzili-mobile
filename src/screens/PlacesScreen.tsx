import { StyleSheet, View, FlatList, FlatListProps } from "react-native";
import { Divider, Button, useTheme } from "react-native-paper";
import ListItem from "../components/ListItem";
import React from "react";
import { useMakeStyle } from "../useStyle";
import { POI, Place } from "../constants";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes";
import { useI18n } from "../useI18n";

export type PlacesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Places"
>;

export default function PlacesScreen(props: PlacesScreenProps) {
  const { navigation } = props;

  const styles = useStyles();
  const theme = useTheme();
  const { i18n } = useI18n();

  const showMap = () => {
    navigation.navigate("Home");
  };

  const showPlace = (place: Place) => {
    navigation.navigate("Place", {
      placeId: place.id,
    });
  };

  const renderItem: FlatListProps<Place>["renderItem"] = (info) => {
    const { item } = info;

    return <ListItem poi={item} onPress={() => showPlace(item)} />;
  };

  return (
    <>
      <View style={styles.container}>
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          style={styles.listContainer}
          contentContainerStyle={styles.list}
          keyExtractor={(item) => item.id}
          data={POI}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
        />
        <View style={styles.buttonContainer}>
          <Button
            accessible={false}
            importantForAccessibility="no-hide-descendants"
            onPress={showMap}
            textColor={"#fff"}
            buttonColor={theme.colors.primary}
            style={styles.button}
          >
            {i18n.t("places.backButton")}
          </Button>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});

const useStyles = () => {
  const theme = useTheme();

  return useMakeStyle({
    container: {
      flex: 1,
    },
    listContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    list: {
      paddingBottom: 132,
    },
    buttonContainer: {
      position: "absolute",
      bottom: 50,
      width: "100%",
    },
    button: {
      marginHorizontal: 48,
      borderRadius: 12,
      fontWeight: "bold",
    },
  });
};
