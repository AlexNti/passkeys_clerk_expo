import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { get } from "@/modules/clerk-expo-passkeys";
import {
  AttemptFirstFactorParams,
  PublicKeyCredentialWithAuthenticatorAssertionResponse,
} from "@clerk/types";
import { base64urlToArrayBuffer } from "@/passkeys/utils/encode";

export default function Signin() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInWithPasskey = async () => {
    if (!isLoaded) {
      return;
    }
    try {
      const preparedFirstFactor = await signIn.prepareFirstFactor({
        strategy: "passkey",
      });
      if (!preparedFirstFactor) {
        throw new Error("No preparedFirstFactor");
      }
      const { nonce } = preparedFirstFactor?.firstFactorVerification;
      if (!nonce) {
        throw new Error("No nonce");
      }
      const { challenge, rpId, userVerification } = JSON.parse(nonce);

      const publicKeyCredential = await get({
        rpId,
        challenge,
        userVerification,
      });

      if (!publicKeyCredential) {
        throw new Error("No publicKeyCredential");
      }

      const serializedPublicKey: PublicKeyCredentialWithAuthenticatorAssertionResponse =
        {
          type: publicKeyCredential.type,
          id: publicKeyCredential.id,
          rawId: base64urlToArrayBuffer(publicKeyCredential.rawId),
          authenticatorAttachment:
            publicKeyCredential?.authenticatorAttachment || null,
          response: {
            clientDataJSON: base64urlToArrayBuffer(
              publicKeyCredential.response.clientDataJSON
            ),
            authenticatorData: base64urlToArrayBuffer(
              publicKeyCredential.response.authenticatorData
            ),
            signature: base64urlToArrayBuffer(
              publicKeyCredential.response.signature
            ),
            userHandle: publicKeyCredential?.response.userHandle
              ? base64urlToArrayBuffer(publicKeyCredential?.response.userHandle)
              : null,
          },
        };

      const signinResponse = await signIn.attemptFirstFactor({
        publicKeyCredential: serializedPublicKey,
        strategy: "passkey",
      });

      await setActive({ session: signinResponse.createdSessionId });
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  };

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      console.log(err);
    }
  };
  return (
    <View style={{ marginTop: 20, marginLeft: 10 }}>
      <View>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email..."
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
      </View>

      <View>
        <TextInput
          value={password}
          placeholder="Password..."
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <TouchableOpacity onPress={onSignInPress}>
        <Text>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSignInWithPasskey}>
        <Text>Sign with passkey</Text>
      </TouchableOpacity>
    </View>
  );
}
