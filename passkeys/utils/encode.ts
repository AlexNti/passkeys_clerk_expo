import { Buffer } from "buffer";

export function encodeBase64(data: ArrayLike<number> | ArrayBufferLike) {
  return btoa(String.fromCharCode(...new Uint8Array(data)));
}

export function encodeBase64Url(data: ArrayLike<number> | ArrayBufferLike) {
  return encodeBase64(data)
    .replaceAll("=", "")
    .replaceAll("+", "-")
    .replaceAll("/", "_");
}

export function decodeBase64Url(data: string) {
  return decodeBase64(data.replaceAll("-", "+").replaceAll("_", "/"));
}

export function decodeToken(data: string) {
  const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

export function decodeBase64(data: string) {
  return Uint8Array.from(atob(data).split(""), (x) => x.charCodeAt(0));
}

export function utf8Decode(buffer: BufferSource) {
  const textDecoder = new TextDecoder();
  return textDecoder.decode(buffer);
}

export function toArrayBuffer(bufferSource: BufferSource) {
  if (bufferSource instanceof ArrayBuffer) {
    return bufferSource; // It's already an ArrayBuffer
  } else if (ArrayBuffer.isView(bufferSource)) {
    return bufferSource.buffer; // Extract the ArrayBuffer from the typed array
  } else {
    throw new TypeError(
      "Expected a BufferSource, but received an incompatible type."
    );
  }
}

export function base64urlToArrayBuffer(base64url) {
  // Replace URL-safe characters with standard Base64 characters
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");

  // Decode Base64 string to binary string
  const binaryString = Buffer.from(base64, "base64").toString("binary");

  // Create ArrayBuffer
  const len = binaryString.length;
  const buffer = new ArrayBuffer(len);
  const uintArray = new Uint8Array(buffer);

  // Write the binary string to the ArrayBuffer
  for (let i = 0; i < len; i++) {
    uintArray[i] = binaryString.charCodeAt(i);
  }

  return buffer;
}
