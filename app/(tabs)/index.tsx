import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { Stack } from "expo-router";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    // Trì hoãn điều hướng để đảm bảo Root Layout đã được render
    setTimeout(() => {
      router.replace("/authentication/Login");
    }, 0);
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Không cần hiển thị nội dung vì sẽ tự động chuyển đến trang đăng nhập */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
