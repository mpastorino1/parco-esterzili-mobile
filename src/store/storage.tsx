import { StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

const hasJSI =
  typeof globalThis === "object" &&
  "nativeCallSyncHook" in globalThis &&
  typeof (globalThis as any).nativeCallSyncHook === "function";
let mmkv: MMKV | null = null;

if (hasJSI) {
  try {
    mmkv = new MMKV();
  } catch (error) {
    console.warn(
      "[storage] MMKV initialization failed, falling back to in-memory storage.",
      error
    );
  }
} else {
  console.warn(
    "[storage] MMKV unavailable because JSI is not active (remote debugging?). Falling back to in-memory storage."
  );
}

const memoryStorage = new Map<string, string>();

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    if (mmkv) {
      return mmkv.set(name, value);
    }
    memoryStorage.set(name, value);
    return true;
  },
  getItem: (name) => {
    if (mmkv) {
      const value = mmkv.getString(name);
      return value ?? null;
    }
    return memoryStorage.get(name) ?? null;
  },
  removeItem: (name) => {
    if (mmkv) {
      return mmkv.delete(name);
    }
    memoryStorage.delete(name);
    return true;
  },
};
