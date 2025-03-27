import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { Stack } from "expo-router";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/authentication/Login");
    }, 0);
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
    </>
  );
}
