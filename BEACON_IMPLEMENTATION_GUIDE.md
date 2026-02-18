# Guida Implementazione Beacon Scanning in React Native con Expo

Questa guida spiega come implementare lo scanning di beacon BLE (Bluetooth Low Energy) in un'app React Native con Expo, basata sull'implementazione del progetto Parco Esterzili.

## Indice

1. [Panoramica](#panoramica)
2. [Dipendenze](#dipendenze)
3. [Configurazione Android](#configurazione-android)
4. [Configurazione iOS](#configurazione-ios)
5. [Struttura Dati](#struttura-dati)
6. [Implementazione Hook useBeacons](#implementazione-hook-usebeacons)
7. [Gestione Notifiche](#gestione-notifiche)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Panoramica

Il sistema di beacon scanning permette di:
- Rilevare beacon BLE nelle vicinanze (iBeacon protocol)
- Calcolare la distanza approssimativa dai beacon
- Mostrare notifiche quando l'utente si avvicina a punti di interesse
- Tracciare quale POI (Point of Interest) è più vicino all'utente

**Tecnologie utilizzate:**
- `react-native-beacon` per lo scanning dei beacon
- `expo-notifications` per le notifiche push locali
- `zustand` per lo state management
- `expo-location` per i permessi di localizzazione

---

## Dipendenze

### 1. Installare i package necessari

```bash
# Package per beacon scanning
yarn add react-native-beacon

# Package Expo necessari
npx expo install expo-notifications expo-location expo-task-manager

# State management
yarn add zustand

# Utility per date/time se necessario
yarn add date-fns
```

### 2. Package.json - Versioni di riferimento

```json
{
  "dependencies": {
    "react-native-beacon": "file:.yalc/react-native-beacon",
    "expo-notifications": "~0.31.4",
    "expo-location": "~18.1.6",
    "expo-task-manager": "~13.1.6",
    "zustand": "^4.3.8"
  }
}
```

**Nota:** Il package `react-native-beacon` potrebbe richiedere una versione custom o un fork. Verifica su npm o GitHub per la versione più aggiornata.

---

## Configurazione Android

### 1. Config Plugin per Android Manifest

Creare il file `plugins/withBeaconService.js`:

```javascript
const { withAndroidManifest } = require("expo/config-plugins");

const REQUIRED_PERMISSIONS = [
  "android.permission.ACCESS_COARSE_LOCATION",
  "android.permission.ACCESS_FINE_LOCATION",
  "android.permission.FOREGROUND_SERVICE",
  "android.permission.FOREGROUND_SERVICE_LOCATION",
];

const ALTBEACON_SERVICE = "org.altbeacon.beacon.service.BeaconService";

function ensurePermissions(manifest) {
  manifest["uses-permission"] = manifest["uses-permission"] ?? [];

  REQUIRED_PERMISSIONS.forEach((permission) => {
    const alreadyPresent = manifest["uses-permission"].some(
      (entry) => entry.$["android:name"] === permission
    );

    if (!alreadyPresent) {
      manifest["uses-permission"].push({
        $: { "android:name": permission },
      });
    }
  });
}

function ensureAltBeaconService(manifest) {
  const application = manifest.application?.[0];
  if (!application) return;

  application.service = application.service ?? [];

  const serviceConfig = {
    $: {
      "android:name": ALTBEACON_SERVICE,
      "android:exported": "false",
      "android:foregroundServiceType": "location",
      "tools:node": "replace",
    },
  };

  const existingServiceIndex = application.service.findIndex(
    (service) => service.$["android:name"] === ALTBEACON_SERVICE
  );

  if (existingServiceIndex >= 0) {
    application.service[existingServiceIndex].$ = {
      ...application.service[existingServiceIndex].$,
      ...serviceConfig.$,
    };
  } else {
    application.service.push(serviceConfig);
  }
}

const withBeaconService = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    manifest.$ = manifest.$ ?? {};

    if (!manifest.$["xmlns:tools"]) {
      manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";
    }

    ensurePermissions(manifest);
    ensureAltBeaconService(manifest);

    return config;
  });
};

module.exports = withBeaconService;
```

### 2. Aggiornare app.config.ts

```typescript
export default ({ config }: ConfigContext): ExpoConfig => ({
  // ... altre configurazioni
  
  plugins: [
    // ... altri plugin
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Attiva i servizi di localizzazione per ricevere indicazioni sui punti di interesse.",
        locationWhenInUsePermission:
          "Attiva i servizi di localizzazione per ricevere indicazioni.",
        isIosBackgroundLocationEnabled: true,
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/notification-icon.png",
        color: "#ffffff",
      },
    ],
    "./plugins/withBeaconService.js", // Plugin beacon per Android
  ],
  
  android: {
    permissions: [
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.FOREGROUND_SERVICE",
      "android.permission.FOREGROUND_SERVICE_LOCATION",
    ],
    // ... altre configurazioni Android
  },
});
```

---

## Configurazione iOS

### 1. Permessi nel Info.plist

Assicurarsi che l'Info.plist contenga:

```xml
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Cambia le impostazioni di localizzazione su 'Consenti sempre' per ricevere indicazioni sui punti di interesse.</string>

<key>NSLocationAlwaysUsageDescription</key>
<string>Consenti a $(PRODUCT_NAME) di accedere alla tua posizione</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>Attiva i servizi di localizzazione per ricevere indicazioni.</string>

<key>UIBackgroundModes</key>
<array>
  <string>location</string>
  <string>fetch</string>
  <string>remote-notification</string>
</array>
```

### 2. Permessi Bluetooth (iOS 13+)

iOS richiede anche la descrizione per il Bluetooth:

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>Utilizziamo il Bluetooth per rilevare i beacon nelle vicinanze e fornirti informazioni sui punti di interesse.</string>

<key>NSBluetoothPeripheralUsageDescription</key>
<string>Utilizziamo il Bluetooth per rilevare i beacon nelle vicinanze.</string>
```

---

## Struttura Dati

### 1. Definire i tipi dei Beacon e dei Places

Creare `src/types/beacon.ts`:

```typescript
export type Place = {
  id: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  icon: string;
  image?: any; // ImageProps["source"]
  videoUrl?: string;
  type: "poi" | "cross" | "info";
  mediaType?: ("image" | "audio" | "video")[];
  beacon: {
    id: string;
    uuid: string;
    major?: number;
    minor?: number;
    triggerDistance: number; // distanza in metri per trigger notifica
  };
};

export type BeaconReading = {
  uuid?: string;
  major?: number;
  minor?: number;
  distance?: number; // distanza in metri
  timestamp: number;
};

export type BeaconRegionConfig = {
  id: string;
  uuid: string;
  major?: number;
  minor?: number;
};
```

### 2. Configurare i Places e Beacon Regions

Creare `src/constants/places.ts`:

```typescript
import { Place, BeaconRegionConfig } from '../types/beacon';

// Definire i punti di interesse con i loro beacon
export const PLACES: Place[] = [
  {
    id: "cascata",
    coordinates: {
      longitude: 9.097738936348684,
      latitude: 39.297275921677354,
    },
    icon: "waterfall",
    type: "poi",
    mediaType: ["image", "audio"],
    beacon: {
      id: "cascata-beacon",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB", // UUID del tuo beacon
      major: 4,
      minor: 8143,
      triggerDistance: 3, // 3 metri
    },
  },
  {
    id: "grotta",
    coordinates: {
      longitude: 9.097324281082722,
      latitude: 39.29620687437821,
    },
    icon: "cave",
    type: "poi",
    mediaType: ["image", "audio"],
    beacon: {
      id: "grotta-beacon",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 4,
      minor: 8147,
      triggerDistance: 3,
    },
  },
  // Aggiungi altri POI...
];

// Filtrare solo i POI (escludere eventuali marker diversi)
export const POI = PLACES.filter((p) => p.type === "poi");

// Mappa per lookup veloce dei POI tramite minor ID del beacon
export const POI_MAP_BY_BEACON_MINOR = POI.reduce((acc, poi) => {
  if (poi.beacon.minor !== undefined) {
    acc[poi.beacon.minor] = poi;
  }
  return acc;
}, {} as Record<number, Place>);

// Generare le regioni beacon da monitorare
// Rimuove duplicati se più POI condividono lo stesso beacon
export const BEACON_REGIONS: BeaconRegionConfig[] = Array.from(
  new Map(
    PLACES.map((place) => {
      const { beacon } = place;
      const key = [
        beacon.uuid,
        beacon.major ?? "all",
        beacon.minor ?? "all",
      ].join("-");
      
      return [
        key,
        {
          id: `region-${place.id}`,
          uuid: beacon.uuid,
          ...(beacon.major !== undefined ? { major: beacon.major } : {}),
          ...(beacon.minor !== undefined ? { minor: beacon.minor } : {}),
        } as BeaconRegionConfig,
      ];
    })
  ).values()
);
```

### 3. Store Zustand per lo stato dei Beacon

Creare `src/store/beaconStore.ts`:

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { BeaconReading, Place } from "../types/beacon";

export interface BeaconState {
  /**
   * Il POI più vicino all'utente
   */
  closestPlace: { id: Place["id"]; timestamp: number } | null;
  
  /**
   * Lista di tutti i beacon rilevati nell'ultimo scan
   */
  beacons: BeaconReading[];
  
  /**
   * Imposta il POI più vicino
   */
  setPlace: (place: { id: Place["id"]; timestamp: number }) => void;
  
  /**
   * Aggiorna la lista dei beacon rilevati
   */
  setBeacons: (beacons: BeaconReading[]) => void;
  
  /**
   * Cancella tutti i beacon rilevati
   */
  clearBeacons: () => void;
}

export const beaconStore = create<BeaconState>()(
  persist(
    (set) => ({
      closestPlace: null,
      beacons: [],
      
      setPlace: (place) => {
        set({ closestPlace: place });
      },
      
      setBeacons: (beacons) => {
        set({ beacons });
      },
      
      clearBeacons: () => {
        set({ beacons: [], closestPlace: null });
      },
    }),
    {
      name: "beacon-storage",
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          // Implementazione storage (AsyncStorage, MMKV, ecc.)
          return null;
        },
        setItem: async (name, value) => {
          // Implementazione storage
        },
        removeItem: async (name) => {
          // Implementazione storage
        },
      })),
      // Persisti solo il closestPlace, non tutti i beacon
      partialize: (state) => ({
        closestPlace: state.closestPlace,
      }),
    }
  )
);
```

---

## Implementazione Hook useBeacons

Creare `src/hooks/useBeacons.ts`:

```typescript
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import Beacon from "react-native-beacon";
import { 
  BEACON_REGIONS, 
  POI_MAP_BY_BEACON_MINOR, 
  Place 
} from "../constants/places";
import { BeaconReading, beaconStore } from "../store/beaconStore";

// Tempo minimo tra notifiche dello stesso POI (in millisecondi)
const NOTIFICATION_COOLDOWN = 5 * 60 * 1000; // 5 minuti

export function useBeacons() {
  const setPlace = beaconStore((state) => state.setPlace);
  const setBeacons = beaconStore((state) => state.setBeacons);
  const clearBeacons = beaconStore((state) => state.clearBeacons);

  useEffect(() => {
    let isActive = true;

    async function prepare() {
      try {
        // 1. Richiedere i permessi per beacon/location
        const permissionsGranted = await Beacon.requestPermissions();
        if (!permissionsGranted) {
          console.warn("Beacon permissions not granted");
          return;
        }

        // 2. Abilitare Bluetooth (se disabilitato)
        await Beacon.enableBluetooth();

        // 3. Configurare il listener per i beacon rilevati
        Beacon.watchBeacons(async (beacons) => {
          if (!isActive) return;

          // Se non ci sono beacon nelle vicinanze, resetta lo stato
          if (beacons.length === 0) {
            setBeacons([]);
            return;
          }

          const timestamp = Date.now();

          // 4. Normalizzare i dati dei beacon e ordinarli per distanza
          const normalizedBeacons: BeaconReading[] = beacons
            .map((beacon) => ({
              uuid: beacon.uuid ?? undefined,
              major: beacon.major,
              minor: beacon.minor,
              distance: beacon.distance,
              timestamp,
            }))
            .sort((a, b) => {
              const aDistance = a.distance ?? Number.POSITIVE_INFINITY;
              const bDistance = b.distance ?? Number.POSITIVE_INFINITY;
              return aDistance - bDistance;
            });

          // 5. Aggiornare lo store con i beacon rilevati
          setBeacons(normalizedBeacons);

          // 6. Trovare il beacon più vicino
          const closestBeacon = normalizedBeacons[0];

          if (!closestBeacon || closestBeacon.distance === undefined) {
            console.log("No valid beacon found");
            return;
          }

          // 7. Verificare se il beacon più vicino corrisponde a un POI
          let place: Place | null = null;
          
          if (
            closestBeacon.minor !== undefined &&
            closestBeacon.distance !== undefined
          ) {
            const candidatePlace = POI_MAP_BY_BEACON_MINOR[closestBeacon.minor];
            
            // Verificare che la distanza sia entro il trigger distance
            if (
              candidatePlace &&
              closestBeacon.distance < candidatePlace.beacon.triggerDistance
            ) {
              place = candidatePlace;
            }
          }

          // 8. Gestire il cambio di POI più vicino
          const { closestPlace: previousPlace } = beaconStore.getState();
          
          if (place) {
            // Aggiornare sempre lo stato del POI più vicino
            setPlace({
              id: place.id,
              timestamp: Date.now(),
            });

            // 9. Mostrare notifica solo se:
            // - È un POI diverso dal precedente, OPPURE
            // - È passato il cooldown time dal precedente
            const shouldNotify =
              previousPlace?.id !== place.id ||
              (previousPlace?.timestamp || 0) < Date.now() - NOTIFICATION_COOLDOWN;

            if (shouldNotify) {
              await showNotification(place);
            }
          }
        });

        // 10. Avviare lo scan delle regioni beacon
        await Beacon.startBeaconScan(
          BEACON_REGIONS.map((region) => ({
            id: region.id,
            uuid: region.uuid,
            ...(region.major !== undefined ? { major: region.major } : {}),
            ...(region.minor !== undefined ? { minor: region.minor } : {}),
          }))
        );

        console.log("Beacon scanning started");
      } catch (error) {
        console.error("Error starting beacon scan:", error);
      }
    }

    prepare();

    // Cleanup: fermare lo scan quando il componente viene unmounted
    return () => {
      isActive = false;
      Beacon.stopBeaconScan().catch((error) => {
        console.warn("Failed to stop beacon scan:", error);
      });
      clearBeacons();
    };
  }, [clearBeacons, setBeacons, setPlace]);
}

/**
 * Mostra una notifica per un POI
 */
async function showNotification(place: Place) {
  try {
    const url = `myapp://place/${place.id}`; // Deep link alla schermata del POI
    const notificationIdentifier = `beacon-${place.id}`;

    // Cancellare eventuali notifiche precedenti dello stesso POI
    await Notifications.dismissNotificationAsync(notificationIdentifier).catch(() => {});
    await Notifications.cancelScheduledNotificationAsync(notificationIdentifier).catch(() => {});

    // Schedulare la nuova notifica
    await Notifications.scheduleNotificationAsync({
      identifier: notificationIdentifier,
      content: {
        title: `Sei vicino a: ${place.id}`, // Personalizza con i18n
        body: "Tocca per scoprire di più",
        data: {
          url,
          placeId: place.id,
        },
        sound: true,
      },
      trigger: null, // Notifica immediata
    });

    console.log(`Notification shown for place: ${place.id}`);
  } catch (error) {
    console.error("Error showing notification:", error);
  }
}
```

---

## Gestione Notifiche

### 1. Configurare il handler delle notifiche

Creare `src/notifications/handler.ts`:

```typescript
import * as Notifications from "expo-notifications";
import { Linking } from "react-native";

// Configurare come mostrare le notifiche quando l'app è in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Setup listeners per le notifiche
 */
export function setupNotificationListeners() {
  // Listener per quando l'utente tocca la notifica
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const data = response.notification.request.content.data;
      
      if (data.url) {
        // Navigare al deep link
        Linking.openURL(data.url as string);
      }
    }
  );

  return () => {
    subscription.remove();
  };
}

/**
 * Richiedere i permessi per le notifiche
 */
export async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Notification permissions not granted");
    return false;
  }

  return true;
}
```

### 2. Inizializzare le notifiche nell'App.tsx

```typescript
import { useEffect } from "react";
import { setupNotificationListeners, requestNotificationPermissions } from "./notifications/handler";
import { useBeacons } from "./hooks/useBeacons";

export default function App() {
  // Inizializzare i beacon
  useBeacons();

  useEffect(() => {
    // Richiedere permessi notifiche
    requestNotificationPermissions();

    // Setup listener notifiche
    const cleanup = setupNotificationListeners();

    return cleanup;
  }, []);

  return (
    // ... resto dell'app
  );
}
```

---

## Best Practices

### 1. Gestione Batteria

Lo scanning dei beacon consuma batteria. Considera:

- **Scan interval**: Configura intervalli di scan appropriati (es. ogni 1-2 secondi)
- **Regioni limitate**: Monitora solo le regioni beacon necessarie
- **Stop quando non necessario**: Ferma lo scan quando l'app è in background o non serve

```typescript
// Esempio: stop scan quando app va in background
import { AppState } from 'react-native';

useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'background') {
      Beacon.stopBeaconScan();
    } else if (nextAppState === 'active') {
      Beacon.startBeaconScan(BEACON_REGIONS);
    }
  });

  return () => subscription.remove();
}, []);
```

### 2. Gestione Errori

Implementa sempre try-catch per operazioni beacon:

```typescript
try {
  await Beacon.startBeaconScan(regions);
} catch (error) {
  console.error("Failed to start beacon scan:", error);
  // Mostrare messaggio all'utente
}
```

### 3. Testing

**Distanze beacon:**
- **Immediate**: < 0.5 metri
- **Near**: 0.5 - 3 metri
- **Far**: 3 - 30+ metri

Le distanze sono approssimative e dipendono da:
- Potenza di trasmissione del beacon
- Interferenze ambientali
- Materiali (muri, metallo, ecc.)

**Suggerimento**: Testa con distanze trigger di 2-5 metri per evitare falsi positivi.

### 4. Privacy e Permessi

- Spiega chiaramente perché servono i permessi di localizzazione
- Gestisci il caso in cui l'utente rifiuta i permessi
- Permetti all'utente di disabilitare le notifiche beacon

```typescript
if (!permissionsGranted) {
  // Mostrare dialog educativo
  Alert.alert(
    "Permessi necessari",
    "I permessi di localizzazione sono necessari per rilevare i punti di interesse nelle vicinanze.",
    [{ text: "OK" }]
  );
  return;
}
```

### 5. Debug

Aggiungi logging dettagliato durante lo sviluppo:

```typescript
Beacon.watchBeacons(async (beacons) => {
  console.log(`[Beacon] Detected ${beacons.length} beacons:`);
  beacons.forEach((b, i) => {
    console.log(`  [${i}] UUID: ${b.uuid}, Major: ${b.major}, Minor: ${b.minor}, Distance: ${b.distance?.toFixed(2)}m`);
  });
});
```

---

## Troubleshooting

### Problema: Beacon non rilevati su Android

**Soluzioni:**
1. Verificare che Bluetooth sia abilitato
2. Verificare permessi di localizzazione (necessari per BLE su Android)
3. Verificare che il servizio AltBeacon sia configurato correttamente nell'AndroidManifest
4. Provare a riavviare l'app dopo aver dato i permessi

```typescript
// Check Bluetooth status
const isBluetoothEnabled = await Beacon.checkBluetoothEnabled();
if (!isBluetoothEnabled) {
  await Beacon.enableBluetooth();
}
```

### Problema: Beacon non rilevati su iOS

**Soluzioni:**
1. Verificare che tutti i permessi siano richiesti nel Info.plist
2. Su iOS 13+, serve anche il permesso Bluetooth
3. Verificare che l'app abbia il permesso "Always" per la localizzazione (necessario per background)
4. Verificare che UIBackgroundModes includa "location"

### Problema: Notifiche non mostrate

**Soluzioni:**
1. Verificare che i permessi notifiche siano garantiti
2. Su iOS, verificare che le notifiche non siano silenziate nelle impostazioni
3. Verificare che `Notifications.setNotificationHandler` sia configurato
4. Controllare i log per errori durante la schedulazione

```typescript
// Test notification
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Test",
    body: "This is a test notification",
  },
  trigger: null,
});
```

### Problema: Distanze beacon inaccurate

Le distanze dei beacon sono **sempre approssimative**. Fattori che influenzano:
- Orientamento del dispositivo
- Ostacoli fisici
- Interferenze wireless
- Calibrazione del beacon

**Soluzione**: Usa soglie di distanza generose (es. 3-5 metri) e testa in ambiente reale.

### Problema: App consuma troppa batteria

**Soluzioni:**
1. Ridurre la frequenza di scan
2. Limitare il numero di regioni monitorate
3. Fermare lo scan quando non necessario (es. in background)
4. Usare il ranging solo quando necessario, non continuamente

---

## Checklist Implementazione

- [ ] Installare dipendenze (`react-native-beacon`, `expo-notifications`, `zustand`)
- [ ] Creare config plugin per Android (`plugins/withBeaconService.js`)
- [ ] Aggiungere plugin a `app.config.ts`
- [ ] Configurare permessi Android in `app.config.ts`
- [ ] Configurare permessi iOS nel Info.plist
- [ ] Definire tipi TypeScript (`BeaconReading`, `Place`, `BeaconRegionConfig`)
- [ ] Creare file constants con `PLACES` e `BEACON_REGIONS`
- [ ] Creare Zustand store per stato beacon
- [ ] Implementare hook `useBeacons`
- [ ] Configurare handler notifiche
- [ ] Richiedere permessi notifiche nell'app
- [ ] Testare su device fisico Android
- [ ] Testare su device fisico iOS
- [ ] Testare notifiche in foreground/background
- [ ] Ottimizzare per batteria
- [ ] Aggiungere error handling
- [ ] Documentare UUIDs beacon e configurazione

---

## Risorse Aggiuntive

- [react-native-beacon GitHub](https://github.com/yourusername/react-native-beacon)
- [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo Location Docs](https://docs.expo.dev/versions/latest/sdk/location/)
- [iBeacon Specification](https://developer.apple.com/ibeacon/)
- [AltBeacon Specification](https://altbeacon.org/)

---

## Note Finali

Questa implementazione è basata sul progetto **Parco Esterzili Mobile** e rappresenta un pattern robusto e testato per lo scanning di beacon in ambiente React Native/Expo.

**Punti chiave:**
- Usa sempre device fisici per testare (i simulatori non supportano BLE)
- Le distanze beacon sono approssimative, configura trigger distance appropriate
- Gestisci sempre i permessi in modo user-friendly
- Ottimizza per il consumo batteria
- Implementa logging dettagliato durante lo sviluppo

Buona implementazione! 🚀
