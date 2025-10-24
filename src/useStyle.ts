import { useMemo } from "react";
import { StyleSheet } from "react-native";

export const useMakeStyle = <
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>
>(
  f: ReturnType<typeof StyleSheet.create<T>>
): ReturnType<typeof StyleSheet.create<T>> => {
  const style = useMemo<ReturnType<typeof StyleSheet.create<T>>>(
    () => StyleSheet.create(f),
    []
  );

  return style;
};
