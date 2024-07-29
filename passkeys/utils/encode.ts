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
