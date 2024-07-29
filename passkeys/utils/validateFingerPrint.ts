import "react-native-get-random-values";
import { Buffer } from "buffer";

const fingerprint =
  "FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C";

export const convertFingerprintToBase64UrlSafe = () => {
  // Remove colons from the fingerprint
  const cleanedFingerprint = fingerprint.replace(/:/g, "");

  // Convert hex to binary
  const binaryFingerprint = Buffer.from(cleanedFingerprint, "hex");

  // Encode the binary data to Base64 and make it URL safe
  let base64Encoded = binaryFingerprint.toString("base64");
  base64Encoded = base64Encoded
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return "android:apk-key-hash:" + base64Encoded;
};
