import * as Location from "expo-location";
import { MAP_BOUNDS } from "./constants";

export function isInsidePark(location: Location.LocationObject): boolean {
  const { latitude, longitude } = location.coords;

  const [swLongitude, swLatitude] = MAP_BOUNDS.sw;
  const [neLongitude, neLatitude] = MAP_BOUNDS.ne;

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

export function getDistance(
  coord1: { latitude: number; longitude: number },
  coord2: { latitude: number; longitude: number }
) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371e3; // metres
  const φ1 = toRad(coord1.latitude);
  const φ2 = toRad(coord2.latitude);
  const Δφ = toRad(coord2.latitude - coord1.latitude);
  const Δλ = toRad(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
