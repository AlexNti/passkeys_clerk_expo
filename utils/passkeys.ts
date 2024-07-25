import base64 from "@hexagon/base64";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Base64URLString,
  PublicKeyCredentialUserEntityJSON,
} from "@simplewebauthn/typescript-types";

import * as Application from "expo-application";

export function bufferToBase64URLString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = "";

  for (const charCode of bytes) {
    str += String.fromCharCode(charCode);
  }

  const base64String = btoa(str);

  return base64String.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function utf8StringToBuffer(value: string): ArrayBuffer {
  return new TextEncoder().encode(value);
}

export function base64UrlToString(base64urlString: Base64URLString): string {
  return base64.toString(base64urlString, true);
}

const rp = {
  id: Platform.select({
    web: undefined,
    native: `${Application.applicationId?.split(".").reverse().join(".")}`,
  }),
  name: "ReactNativePasskeys",
} satisfies PublicKeyCredentialRpEntity;

// Don't do this in production!
export const challenge = bufferToBase64URLString(utf8StringToBuffer("fizz"));

export const user = {
  id: bufferToBase64URLString(utf8StringToBuffer("290283490")),
  displayName: "username",
  name: "username",
} satisfies PublicKeyCredentialUserEntityJSON;

const authenticatorSelection = {
  userVerification: "required",
  residentKey: "required",
} satisfies AuthenticatorSelectionCriteria;
