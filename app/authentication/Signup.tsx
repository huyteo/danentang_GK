import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { signup } from "../../scripts/api";
import { Stack, useRouter } from "expo-router";
import { CheckBox } from "react-native-elements";
import { AxiosError } from "axios";

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !repeatPassword || !agreeToTerms) {
      Alert.alert(
        "⚠️ Lỗi",
        "Vui lòng điền đầy đủ thông tin và đồng ý với điều khoản!"
      );
      return;
    }

    if (password !== repeatPassword) {
      Alert.alert("⚠️ Lỗi", "Mật khẩu không khớp!");
      return;
    }

    try {
      const userData = { name, email, password, repeatPassword, agreeToTerms };
      await signup(userData);
      Alert.alert("✅ Thành công", "Đăng ký thành công! Vui lòng đăng nhập.", [
        { text: "OK", onPress: () => router.push("/authentication/Login") }, // Chuyển sang Login
      ]);
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      console.error("❌ Lỗi khi đăng ký:", axiosError);
      Alert.alert(
        "❌ Lỗi",
        axiosError.response?.data?.error || "Không thể đăng ký"
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={{
            uri: "https://colorlib.com/etc/regform/colorlib-regform-7/images/signin-image.jpg",
          }}
          style={styles.image}
        />
        <Text style={styles.title}>Sign up</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Your Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Repeat your password"
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.checkboxContainer}>
          <CheckBox
            checked={agreeToTerms}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
            containerStyle={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>
            I agree all statements in Terms of service
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/authentication/Login")}>
          <Text style={styles.link}>I am already member</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 60, // Trên
    paddingRight: 20, // Phải
    paddingBottom: 20, // Dưới
    paddingLeft: 20, // Trái
    backgroundColor: "#fff",
    alignItems: "center",
  },
  image: {
    width: 320,
    height: 210,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    width: "100%",
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  checkbox: {
    padding: 0,
    margin: 0,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#555",
  },
  button: {
    backgroundColor: "#477dd6",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#000",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
});

export default SignUp;
