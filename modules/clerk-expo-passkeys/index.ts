import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to ClerkExpoPasskeys.web.ts
// and on native platforms to ClerkExpoPasskeys.ts
import ClerkExpoPasskeysModule from "./src/ClerkExpoPasskeysModule";
import ClerkExpoPasskeysView from "./src/ClerkExpoPasskeysView";
import {
  ChangeEventPayload,
  ClerkExpoPasskeysViewProps,
  PublicKeyCredentialCreationOptionsJSON,
} from "./src/ClerkExpoPasskeys.types";
import { Platform } from "react-native";
import { AndroidPasskeys } from "./src/AndroidPasskeys";

// Get the native constant value.
export const PI = ClerkExpoPasskeysModule.PI;

export function hello(): string {
  return ClerkExpoPasskeysModule.hello();
}

export async function setValueAsync(value: string) {
  return await ClerkExpoPasskeysModule.setValueAsync(value);
}

const emitter = new EventEmitter(
  ClerkExpoPasskeysModule ?? NativeModulesProxy.ClerkExpoPasskeys
);

export function addChangeListener(
  listener: (event: ChangeEventPayload) => void
): Subscription {
  return emitter.addListener<ChangeEventPayload>("onChange", listener);
}

export async function create(
  credentials: PublicKeyCredentialCreationOptionsJSON
) {
  if (Platform.OS === "android") {
    return AndroidPasskeys.create(credentials);
  } else if (Platform.OS === "ios") {
    throw new Error("Not supoorted");
  } else {
    throw new Error("Not supoorted");
  }
}

export {
  ClerkExpoPasskeysView,
  ClerkExpoPasskeysViewProps,
  ChangeEventPayload,
};
