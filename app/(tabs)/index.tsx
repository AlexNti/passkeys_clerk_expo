import "@bacons/text-decoder/install";

import {
  Image,
  StyleSheet,
  Pressable,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { signIn, createPasskey, User } from "@/passkeys/utils/auth";
import React from "react";

import { useAuth, useClerk, useSignIn, useUser } from "@clerk/clerk-expo";
`amused-bream-24.clerk.accountsstage.dev/wellknows/assets.json`;
import {
  create,
  PublicKeyCredentialCreationOptionsJSON,
} from "@/modules/clerk-expo-passkeys";

import { Buffer } from "buffer";
import { encodeBase64Url, toArrayBuffer } from "@/passkeys/utils/encode";
import {
  ExperimentalPublicKeyCredentialWithAuthenticatorAttestationResponse,
  PublicKeyCredentialWithAuthenticatorAttestationResponse,
} from "@clerk/types";

export default function HomeScreen() {
  const { user: clerkUser, isLoaded } = useUser();
  const auth = useAuth();
  const clerk = useClerk();

  const { signIn } = useSignIn();

  if (!isLoaded || !clerkUser) {
    return null;
  }

  const _createPasskey = async () => {
    try {
      const passkey = await clerkUser.__experimentalCreatePassKey();
      const publicKey = passkey.verification?.publicKey;

      if (!publicKey) {
        throw new Error("No public key found");
      }
      const rp = { id: publicKey.rp.id, name: publicKey.rp.name };

      const userId = encodeBase64Url(toArrayBuffer(publicKey.user.id));
      const user = {
        id: userId,
        displayName: publicKey.user.displayName,
        name: publicKey.user.name,
      };

      const pubKeyCredParams = publicKey.pubKeyCredParams;
      const challenge = encodeBase64Url(toArrayBuffer(publicKey.challenge));

      const publicCredential = await create({
        rp,
        user,
        pubKeyCredParams,
        challenge,
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          requireResidentKey: true,
          residentKey: "required",
          userVerification: "required",
        },
      });

      if (!publicCredential) {
        throw new Error("No public credential found");
      }

      const serializedPublicCredential: ExperimentalPublicKeyCredentialWithAuthenticatorAttestationResponse =
        {
          id: publicCredential.id,
          rawId: publicCredential.rawId,
          response: {
            attestationObject: publicCredential.response.attestationObject,
            clientDataJSON: publicCredential.response.clientDataJSON,

            transports: publicCredential?.response?.transports as string[],
          },
          type: publicCredential.type,
          authenticatorAttachment:
            publicCredential.authenticatorAttachment || null,
        };

      const res = await clerkUser.__experimentalVerifyPasskey(
        passkey.id,
        serializedPublicCredential
      );
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  };

  const handleSignIn = async () => {
    try {
      const signinResource = await signIn?.prepareFirstFactor({
        strategy: "passkey",
      });
      // const user = await signIn();
      // if (user) setLoggedInUser(user);
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/playstore.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.stepContainer}>
        <Pressable style={{ borderBlockColor: "1" }} onPress={_createPasskey}>
          <Text style={{ color: "cyan" }}>Create passkey</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            auth.signOut();
          }}
        >
          <Text style={{ color: "cyan" }}>Sign-out</Text>
        </Pressable>

        {clerkUser && (
          <ThemedView style={{ flex: 1, flexDirection: "column" }}>
            <Text style={{ color: "cyan" }}>
              You are logged in with the user with ID {clerkUser.id}
            </Text>
            <Text style={{ color: "cyan" }}>
              Email: {clerkUser.primaryEmailAddress?.toString()}
            </Text>
          </ThemedView>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    gap: 10,
    marginBottom: 8,
    backgroundColor: "#1D3D47",
    width: "100%",
    height: "100%",
    display: "flex",
    flex: 1,
  },
  reactLogo: {
    height: 250,
    width: 200,
    bottom: 0,
    left: 80,
    right: 0,
    top: 0,
    position: "absolute",
  },
});
