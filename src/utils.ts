import * as Location from "expo-location";
import { AYMERICH_BOUNDS } from "./constants";

export function isInsidePark(location: Location.LocationObject): boolean {
  const { latitude, longitude } = location.coords;

  const [swLongitude, swLatitude] = AYMERICH_BOUNDS.sw;
  const [neLongitude, neLatitude] = AYMERICH_BOUNDS.ne;

  if (latitude < swLatitude || latitude > neLatitude) {
    return false;
  }
  if (longitude < swLongitude || longitude > neLongitude) {
    return false;
  }
  return true;
}

export function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
