import * as Location from "expo-location";
import { Place } from "./constants";

export const getDirections = async (
  location: Location.LocationObject,
  place: Place
) => {
  const response = await fetch(
    "https://api.mapbox.com/directions/v5/mapbox/walking?access_token=pk.eyJ1IjoiZ3N0bzk4IiwiYSI6ImNsaWlwMjdwODAwY2szZHBha3Bmb2Y3YWwifQ.wa08aiddBkDYVkJyA1hjPg",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        coordinates:
          [location.coords.longitude, location.coords.latitude].join(",") +
          ";" +
          [place.coordinates.longitude, place.coordinates.latitude].join(","),
        steps: "true",
        overview: "full",
        language: "it",
        geometries: "geojson",
        continue_straight: "true",
      }).toString(),
    }
  );

  const data = await response.json();

  return data;
};
