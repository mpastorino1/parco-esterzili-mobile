import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import BottomSheet, {
  BottomSheetProps,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { useMakeStyle } from "../useStyle";
import { Button, IconButton, useTheme } from "react-native-paper";
import { View } from "react-native";
import ListItem from "./ListItem";
import { Place } from "../constants";
import { isInsidePark } from "../utils";
import { useLocationStore } from "../store/states";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../screens/HomeScreen";
import { useI18n } from "../useI18n";

const snapPoints = ["CONTENT_HEIGHT"];

type MarkerBottomSheetProps = {
  poi: Place | null;
  onClose?: BottomSheetProps["onClose"];
};

const MarkerBottomSheet = forwardRef<BottomSheet, MarkerBottomSheetProps>(
  (props, ref) => {
    const { poi, onClose } = props;

    const styles = useStyles();
    const theme = useTheme();
    const { i18n } = useI18n();

    const navigation = useNavigation<HomeScreenProps["navigation"]>();

    const { location } = useLocationStore();

    const bottomSheetRef = useRef<BottomSheet>(null);

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

    const {
      animatedHandleHeight,
      animatedSnapPoints,
      animatedContentHeight,
      handleContentLayout,
    } = useBottomSheetDynamicSnapPoints(snapPoints);

    const closeSheet = useCallback(() => {
      bottomSheetRef.current?.close();
    }, []);

    const openDirectionsScreen = useCallback(() => {
      if (!poi) return;
      navigation.navigate("Navigator", {
        placeId: poi.id,
      });
    }, [poi]);

    const showPlace = () => {
      if (!poi) return;
      navigation.navigate("Place", {
        placeId: poi.id,
      });
    };

    const isInside = !location || isInsidePark(location);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetHandleIndicator}
        onClose={onClose}
      >
        <BottomSheetView
          onLayout={handleContentLayout}
          style={styles.bottomSheetContainer}
        >
          <IconButton
            style={styles.buttonClose}
            icon="close"
            mode="contained"
            iconColor={theme.colors.onBackground}
            size={16}
            onPress={closeSheet}
          />
          <View style={styles.bottomSheetContent}>
            {poi && <ListItem poi={poi} />}
            <View>
              <Button
                style={styles.sheetButton}
                textColor={theme.colors.primary}
                buttonColor={hexToRgba(theme.colors.primary, 0.1)}
                mode={"contained"}
                onPress={() => {
                  showPlace();
                }}
              >
                {i18n.t("home.bottomSheet.detailsButton")}
              </Button>
              {isInside && (
                <Button
                  icon="arrow-right-top"
                  style={styles.sheetButton}
                  textColor={theme.colors.secondary}
                  buttonColor={hexToRgba(theme.colors.secondary, 0.1)}
                  mode={"contained"}
                  onPress={openDirectionsScreen}
                >
                  {i18n.t("home.bottomSheet.getDirectionButton")}
                </Button>
              )}
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const useStyles = () => {
  const theme = useTheme();

  return useMakeStyle({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      position: "absolute",
      height: 50,
      width: "70%",
      justifyContent: "center",
      alignSelf: "center",
      bottom: 50,
      borderRadius: 12,
      fontWeight: "bold",
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
      paddingBottom: 40,
    },
    bottomSheetContent: {
      paddingHorizontal: 32,
    },
    sheetButton: {
      width: "100%",
      marginVertical: 8,
      borderRadius: 12,
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
  });
};

export default MarkerBottomSheet;
