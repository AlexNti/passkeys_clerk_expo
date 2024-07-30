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

import { useUser } from "@clerk/clerk-expo";

export default function HomeScreen() {
  const { user, isLoaded } = useUser();
  const [loggedInUser, setLoggedInUser] = React.useState<User>(null);

  if (!isLoaded || !user) {
    return null;
  }

  const _createPasskey = async () => {
    try {
      const _user = await createPasskey(
        user.primaryEmailAddress?.emailAddress || "",
        user.id
      );
      if (_user) setLoggedInUser(_user);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSignIn = async () => {
    try {
      const user = await signIn();
      if (user) setLoggedInUser(user);
    } catch (e) {
      console.log(e);
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

        <Pressable onPress={handleSignIn}>
          <Text style={{ color: "cyan" }}>Sign-in</Text>
        </Pressable>

        {loggedInUser && (
          <ThemedView style={{ flex: 1, flexDirection: "column" }}>
            <Text style={{ color: "cyan" }}>
              You are logged in with the user with ID {loggedInUser.userId}
            </Text>
            <Text style={{ color: "cyan" }}>
              Username: {loggedInUser.username}
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
