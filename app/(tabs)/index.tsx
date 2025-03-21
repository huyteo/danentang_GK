import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";

export default function App() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Product Management</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/screens/ProductList")} // Đường dẫn đến ProductList
        >
          <Text style={styles.text}>Go to Product List</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.loginButton]} // Thêm nút Login
          onPress={() => router.push("/authentication/Login")} // Đường dẫn đến Login
        >
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          onPress={() => router.push("/authentication/Signup")} // Đường dẫn đến Signup
        >
          <Text style={styles.text}>Sign Up</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: "#ff9500", // Màu khác để phân biệt nút Login
  },
  signUpButton: {
    backgroundColor: "#28a745",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
