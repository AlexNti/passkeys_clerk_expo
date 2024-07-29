import "react-native-get-random-values";

import { db } from "./db";
import { decodeBase64Url, encodeBase64Url } from "./encode";
import { verifyAssertion } from "./passkey";
import { hello, create, get } from "@/modules/clerk-expo-passkeys";
import { hexToBase64Url } from "./challenge";
type User = {
  userId: string;
  username: string;
};

export async function signUp(username: string): Promise<User> {
  // should be handled in server - start
  const userExists = !!db.getByUsername(username);
  if (userExists) throw new Error("Username already used");
  // recommend minimum 16 bytes
  const challenge = hexToBase64Url("4A4AEF32B685");
  // should be handled in server - end

  try {
    const publicKeyCredential = await create({
      // publicKey = Web Authentication API

      rp: { name: "Passkey Demo", id: "menu.ble-papagalos.gr" },
      user: {
        id: "def456",
        name: username + "123",
        displayName: username,
      },
      pubKeyCredParams: [
        {
          type: "public-key",
          // use ECDSA with the secp256k1 curve and the SHA-256 (aka. ES256K)
          // based on IANA COSE Algorithms registry id
          alg: -7,
        },
      ],
      challenge,
      authenticatorSelection: {
        userVerification: "required",
      },
    });

    if (!(publicKeyCredential instanceof PublicKeyCredential)) {
      throw new TypeError();
    }
    if (
      !(
        publicKeyCredential.response instanceof AuthenticatorAttestationResponse
      )
    ) {
      throw new TypeError("Unexpected attestation response");
    }

    // should be handled in server from here
    const userId = generateId(8);
    const publicKey = publicKeyCredential.response.getPublicKey();
    if (!publicKey) {
      throw new Error("Could not retrieve public key");
    }
    db.insert({
      id: userId,
      credential_id: publicKeyCredential.id, // base64url encoded
      username,
      public_key: encodeBase64Url(publicKey),
    });

    return { userId, username };
  } catch (e) {
    console.log(e);
  }
}

export async function signIn(): Promise<User> {
  // should be generated in server
  // recommend minimum 16 bytes
  const challenge = hexToBase64Url("4A4AEF32B685");

  const publicKeyCredential = await get({
    rpId: "menu.ble-papagalos.gr",
    challenge,
  });
  if (!(publicKeyCredential instanceof PublicKeyCredential)) {
    throw new TypeError();
  }
  // should be handled in server - start
  const databaseUser = db.getByCredentialId(publicKeyCredential.id);
  if (!databaseUser) {
    throw new Error("User does not exist");
  }
  await verifyAssertion(publicKeyCredential, {
    publicKey: decodeBase64Url(databaseUser.public_key),
    challenge,
  });
  // should be handled in server - end
  return {
    userId: databaseUser.id,
    username: databaseUser.username,
  };
}

// the most inefficient random id generator
// possible characters: 0-9, a-z
export function generateId(length: number) {
  let result = "";
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  while (result.length !== length) {
    const index = Math.floor(crypto.getRandomValues(new Uint8Array(1))[0] / 4);
    if (index >= alphabet.length) continue;
    result += alphabet[index];
  }
  return result;
}
