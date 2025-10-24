import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ImageProps } from "react-native";

export const AYMERICH_BOUNDS = {
  ne: [9.066, 39.8578],
  sw: [9.0531, 39.8487],
};

export type Place = {
  id: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  image?: ImageProps["source"];
  videoUrl?: string;
  type: "poi" | "cross";
  mediaType?: ("image" | "audio" | "video")[];
  beacon: {
    id: string;
    uuid: string;
    major?: number;
    minor?: number;
    triggerDistance: number;
  };
};

export const PLACES: Place[] = [
  {
    id: "cascata_maggiore",
    // title: "Cascata maggiore",
    coordinates: {
      longitude: 9.055413558138836,
      latitude: 39.856904798140334,
    },
    image: require("./assets/cascata.jpg"),
    mediaType: ["image", "audio"],
    icon: "waterfall",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 1,
      triggerDistance: 3,
    },
  },
  {
    id: "grotte_maimone",
    // title: "Grotte",
    coordinates: {
      longitude: 9.05553,
      latitude: 39.8553,
    },
    image: require("./assets/grotteMaimone.jpg"),
    mediaType: ["image", "audio"],
    icon: "image-filter-hdr",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 2,
      triggerDistance: 3,
    },
  },
  {
    id: "cedro_libano",
    // title: "Cedro del Libano",
    coordinates: {
      longitude: 9.055846429815787,
      latitude: 39.85432438898091,
    },
    image: require("./assets/cedro_libano.jpg"),
    mediaType: ["image", "audio"],
    icon: "tree",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 3,
      triggerDistance: 3,
    },
  },
  {
    id: "castello_aymerich",
    // title: "Castello Aymerich",
    coordinates: {
      longitude: 9.055051009318756,
      latitude: 39.855351894779425,
    },
    image: require("./assets/castello.jpg"),
    mediaType: ["image", "audio"],
    icon: "castle",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 4,
      triggerDistance: 3,
    },
  },
  {
    id: "servizi_igienici",
    // title: "Bagni",
    coordinates: {
      longitude: 9.05467,
      latitude: 39.8565,
    },
    image: require("./assets/servizi-igienici.jpg"),
    mediaType: [],
    icon: "toilet",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 5,
      triggerDistance: 3,
    },
  },
  {
    id: "giardino_aymerich",
    // title: "Giardino Aymerich",
    coordinates: {
      longitude: 9.05452532786776,
      latitude: 39.8542795419876,
    },
    image: require("./assets/giardino_aymerich.jpg"),
    mediaType: ["image", "audio"],
    icon: "grass",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 6,
      triggerDistance: 3,
    },
  },
  {
    id: "percorso_belvedere",
    // title: "Percorso Panoramico",
    coordinates: {
      longitude: 9.055476,
      latitude: 39.855953,
    },
    image: require("./assets/marchesu.jpg"),
    mediaType: ["image", "audio"],
    icon: "routes",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 7,
      triggerDistance: 3,
    },
  },
  {
    id: "pino_laricio",
    // title: "Pino Laricio",
    coordinates: {
      longitude: 9.05525,
      latitude: 39.856,
    },
    image: require("./assets/pino_laricio.jpg"),
    mediaType: ["image", "audio"],
    icon: "tree",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 8,
      triggerDistance: 3,
    },
  },
  {
    id: "percorso_tranquillo",
    // title: "Percorso Tranquillo",
    coordinates: {
      longitude: 9.05519,
      latitude: 39.8559,
    },
    image: require("./assets/camminu-e-mesu.jpg"),
    mediaType: ["image", "audio"],
    icon: "routes",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 9,
      triggerDistance: 3,
    },
  },
  {
    id: "ingresso_san_martino",
    coordinates: {
      longitude: 9.0543219,
      latitude: 39.8546121,
    },
    image: require("./assets/IngressoSanMartino.jpg"),
    mediaType: [],
    icon: "gate",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 10,
      triggerDistance: 3,
    },
  },
  {
    id: "fontana_1899",
    // title: "Fontana 1899",
    coordinates: {
      longitude: 9.054567,
      latitude: 39.8548,
    },
    image: require("./assets/fontana.jpg"),
    mediaType: ["image", "audio"],
    icon: "fountain",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 11,
      triggerDistance: 3,
    },
  },
  {
    id: "cedro_atlantico",
    // title: "Cedro Atlantico",
    coordinates: {
      longitude: 9.05669,
      latitude: 39.8534,
    },
    image: require("./assets/CedroAtlantico.jpg"),
    mediaType: ["image", "audio"],
    icon: "tree",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 12,
      triggerDistance: 3,
    },
  },
  {
    id: "ingresso_su_acili",
    coordinates: {
      longitude: 9.05413,
      latitude: 39.856,
    },
    image: require("./assets/IngressoSuAcili.jpg"),
    mediaType: [],
    icon: "gate",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 13,
      triggerDistance: 3,
    },
  },
  {
    id: "piazzale",
    coordinates: {
      longitude: 9.05505,
      latitude: 39.85586,
    },
    image: require("./assets/PiazzaleAreapicnic.jpg"),
    mediaType: [],
    icon: "information",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 14,
      triggerDistance: 3,
    },
  },
  // Cross intersections
  {
    id: "cross1",
    coordinates: {
      longitude: 9.0550163,
      latitude: 39.8557498,
    },
    icon: "axis-arrow",
    type: "cross",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 101,
      triggerDistance: 3,
    },
  },
  {
    id: "cross2",
    coordinates: {
      longitude: 9.0552524,
      latitude: 39.8559722,
    },
    icon: "axis-arrow",
    type: "cross",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 102,
      triggerDistance: 3,
    },
  },
  {
    id: "cross3",
    coordinates: {
      longitude: 9.0551156,
      latitude: 39.8566516,
    },
    icon: "axis-arrow",
    type: "cross",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 103,
      triggerDistance: 3,
    },
  },
  {
    id: "cross4",
    coordinates: {
      longitude: 9.0545741,
      latitude: 39.8570619,
    },
    icon: "axis-arrow",
    type: "cross",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 104,
      triggerDistance: 3,
    },
  },
  {
    id: "cross5",
    coordinates: {
      longitude: 9.0564484,
      latitude: 39.8549804,
    },
    icon: "axis-arrow",
    type: "cross",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 105,
      triggerDistance: 3,
    },
  },
  {
    id: "cross6",
    coordinates: {
      longitude: 9.0568714,
      latitude: 39.8539987,
    },
    icon: "axis-arrow",
    type: "cross",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 106,
      triggerDistance: 3,
    },
  },
  {
    id: "cross7",
    coordinates: {
      longitude: 9.0574437,
      latitude: 39.8535397,
    },
    icon: "axis-arrow",
    type: "cross",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 107,
      triggerDistance: 3,
    },
  },
  {
    id: "cross8",
    coordinates: {
      longitude: 9.0572001,
      latitude: 39.8529744,
    },
    icon: "axis-arrow",
    type: "cross",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 108,
      triggerDistance: 3,
    },
  },
  {
    id: "cross9",
    coordinates: {
      longitude: 9.0563684,
      latitude: 39.8541266,
    },
    icon: "axis-arrow",
    type: "cross",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 109,
      triggerDistance: 3,
    },
  },
  {
    id: "cross10",
    coordinates: {
      longitude: 9.0561229,
      latitude: 39.8543623,
    },
    icon: "axis-arrow",
    type: "cross",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 110,
      triggerDistance: 3,
    },
  },
  {
    id: "cross11",
    coordinates: {
      longitude: 9.0552526,
      latitude: 39.8550692,
    },
    icon: "axis-arrow",
    type: "cross",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 111,
      triggerDistance: 3,
    },
  },
  {
    id: "cross12",
    coordinates: {
      longitude: 9.0547878,
      latitude: 39.8550254,
    },
    icon: "axis-arrow",
    type: "cross",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 112,
      triggerDistance: 3,
    },
  },
  {
    id: "cross13",
    coordinates: {
      longitude: 9.0542119,
      latitude: 39.8551817,
    },
    icon: "axis-arrow",
    type: "cross",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 1,
      minor: 113,
      triggerDistance: 3,
    },
  },
];

export const POI = PLACES.filter((p) => p.type === "poi");

// this is a map of beacon id to place, for quick lookup
export const POI_MAP_BY_BEACON_MINOR = POI.reduce((acc, poi) => {
  if (poi.beacon.minor) {
    acc[poi.beacon.minor] = poi;
  }
  return acc;
}, {} as Record<string, Place>);

const latitudes = POI.map((poi) => poi.coordinates.latitude);
const longitudes = POI.map((poi) => poi.coordinates.longitude);

let ne = [Math.max(...longitudes), Math.max(...latitudes)];

let sw = [Math.min(...longitudes), Math.min(...latitudes)];

export const POI_BOUNDS = {
  ne,
  sw,
};

export function usePlace(placeId?: Place["id"]) {
  const [place, setPlace] = useState<Place | null>(null);

  useEffect(() => {
    if (!placeId) return;
    const place = PLACES.find((p) => p.id === placeId);
    setPlace(place || null);
  }, [placeId]);

  return place;
}
