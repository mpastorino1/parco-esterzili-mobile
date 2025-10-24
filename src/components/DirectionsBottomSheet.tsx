import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {
  Button,
  Dialog,
  Divider,
  Portal,
  useTheme,
  Text,
  ActivityIndicator,
} from "react-native-paper";
import { useMakeStyle } from "../useStyle";
import { FlatListProps, View } from "react-native";
import Indication from "./Indication";
import { useNavigation } from "@react-navigation/native";
import { useI18n } from "../useI18n";

const snapPoints = ["25%", "90%"];

export type DirectionsBottomSheetProps = {
  directions: { instruction: string; distance: number }[] | null;
};

const DirectionsBottomSheet = forwardRef<
  BottomSheet,
  DirectionsBottomSheetProps
>((props, ref) => {
  const { directions } = props;

  const [visible, setVisible] = React.useState(false);

  const theme = useTheme();

  const styles = useStyles();

  const { i18n } = useI18n();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const navigation = useNavigation();

  useImperativeHandle<BottomSheet, any>(
    ref,
    () => {
      return {
        expand() {
          bottomSheetRef.current?.expand();
        },
        close() {
          bottomSheetRef.current?.close();
        },
      };
    },
    []
  );

  const showDialog = () => {
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const renderHeader = () => {
    return (
      <View style={{ padding: 50, backgroundColor: theme.colors.background }}>
        <Button
          onPress={showDialog}
          textColor={theme.colors.onError}
          buttonColor={theme.colors.error}
        >
          {i18n.t("navigator.button")}
        </Button>
      </View>
    );
  };

  const renderItem: FlatListProps<{
    instruction: string;
    distance: number;
  }>["renderItem"] = (info) => {
    const { item } = info;

    return (
      <Indication description={item.instruction} distance={item.distance} />
    );
  };

  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  };

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetHandleIndicator}
      >
        <View style={styles.content}>
          <BottomSheetFlatList
            contentContainerStyle={styles.bottomSheetContainer}
            data={directions}
            renderItem={renderItem}
            ItemSeparatorComponent={Divider}
            ListEmptyComponent={renderLoading}
          />
          <View>{renderHeader()}</View>
        </View>
      </BottomSheet>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>{i18n.t("navigator.dialog.title")}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {i18n.t("navigator.dialog.description")}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>
              {i18n.t("navigator.dialog.negative")}
            </Button>
            <Button onPress={navigation.goBack}>
              {i18n.t("navigator.dialog.positive")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
});

const useStyles = () => {
  const theme = useTheme();

  return useMakeStyle({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.colors.background,
    },
    closedMarker: {
      backgroundColor: "#008042",
      borderRadius: 50,
      padding: 4,
    },
    map: {
      width: "100%",
      height: "100%",
    },
    bottomSheetBackground: {
      backgroundColor: theme.colors.background,
    },
    bottomSheetHandleIndicator: {
      backgroundColor: theme.colors.onBackground,
    },
    bottomSheetContainer: {
      paddingHorizontal: 16,
      backgroundColor: theme.colors.background,
    },
    bottomSheetContent: {
      paddingHorizontal: 32,
    },
    sheetButton: {
      width: "100%",
      marginVertical: 8,
      height: 50,
      borderRadius: 12,
      justifyContent: "center",
    },
    mapButton: {
      position: "absolute",
      right: 10,
      top: 70,
    },
    activityIndicator: {
      position: "absolute",
      alignSelf: "center",
    },
    buttonClose: {
      alignSelf: "flex-end",
    },
    marker: {
      width: 40,
      height: 40,
    },
    bottom: {
      width: "100%",
      position: "absolute",
      alignSelf: "center",
      bottom: 0,
    },
    loadingContainer: {
      paddingTop: "15%",
      justifyContent: "center",
      alignItems: "center",
    },
  });
};

export default DirectionsBottomSheet;
