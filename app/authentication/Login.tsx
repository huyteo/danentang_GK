import React, { useState, useEffect } from "react";
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
import { login } from "../../scripts/api";
import { Stack, useRouter } from "expo-router";
import { CheckBox } from "react-native-elements";
import { AxiosError } from "axios";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Thêm AsyncStorage

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Google Sign-In
  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useAuthRequest({
      clientId:
        "155784027755-foh34qvo3ftp21rjkpfmkd6v7t3i6ndv.apps.googleusercontent.com",
      redirectUri: "productmanagement://",
    });

  // Facebook Sign-In
  const [facebookRequest, facebookResponse, facebookPromptAsync] =
    Facebook.useAuthRequest({
      clientId: "1349849022941497",
      redirectUri: "productmanagement://",
    });

  // Xử lý đăng nhập Google
  useEffect(() => {
    if (googleResponse?.type === "success") {
      const { authentication } = googleResponse;
      if (authentication?.accessToken) {
        // Lấy thông tin người dùng từ Google (cần gọi API của Google)
        // Đây là ví dụ, bạn cần thêm bước lấy thông tin người dùng
        const userInfo = {
          name: "Google User", // Thay bằng thông tin thực từ Google API
          email: "googleuser@example.com", // Thay bằng thông tin thực từ Google API
        };

        // Lưu thông tin người dùng vào AsyncStorage
        AsyncStorage.setItem("user", JSON.stringify(userInfo)).then(() => {
          Alert.alert("✅ Thành công", "Đăng nhập bằng Google thành công!", [
            { text: "OK", onPress: () => router.push("/screens/ProductList") },
          ]);
        });
      }
    } else if (googleResponse?.type === "error") {
      console.log("Google login error:", googleResponse);
      Alert.alert("❌ Lỗi", "Đăng nhập bằng Google thất bại!");
    }
  }, [googleResponse]);

  // Xử lý đăng nhập Facebook
  useEffect(() => {
    if (facebookResponse?.type === "success") {
      const { authentication } = facebookResponse;
      if (authentication?.accessToken) {
        // Lấy thông tin người dùng từ Facebook (cần gọi API của Facebook)
        // Đây là ví dụ, bạn cần thêm bước lấy thông tin người dùng
        const userInfo = {
          name: "Facebook User", // Thay bằng thông tin thực từ Facebook API
          email: "facebookuser@example.com", // Thay bằng thông tin thực từ Facebook API
        };

        // Lưu thông tin người dùng vào AsyncStorage
        AsyncStorage.setItem("user", JSON.stringify(userInfo)).then(() => {
          Alert.alert("✅ Thành công", "Đăng nhập bằng Facebook thành công!", [
            { text: "OK", onPress: () => router.push("/screens/ProductList") },
          ]);
        });
      }
    } else if (facebookResponse?.type === "error") {
      console.log("Facebook login error:", facebookResponse);
      Alert.alert("❌ Lỗi", "Đăng nhập bằng Facebook thất bại!");
    }
  }, [facebookResponse]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("⚠️ Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Kiểm tra định dạng email (phải là Gmail)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      Alert.alert("⚠️ Lỗi", "Vui lòng nhập địa chỉ Gmail hợp lệ!");
      return;
    }

    try {
      const loginData = { email, password };
      const response = await login(loginData);
      console.log("Dữ liệu người dùng từ API login:", response.data);

      // Lưu thông tin người dùng vào AsyncStorage
      const userInfo = response.data.user; // API trả về { message: ..., user: { name, email } }
      await AsyncStorage.setItem("user", JSON.stringify(userInfo));

      // Kiểm tra xem dữ liệu đã lưu thành công chưa
      const storedUser = await AsyncStorage.getItem("user");
      console.log("Dữ liệu người dùng đã lưu vào AsyncStorage:", storedUser);

      Alert.alert("✅ Thành công", "Đăng nhập thành công!", [
        { text: "OK", onPress: () => router.push("/screens/ProductList") },
      ]);
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      console.error("❌ Lỗi khi đăng nhập:", axiosError);
      Alert.alert(
        "❌ Lỗi",
        axiosError.response?.data?.error || "Không thể đăng nhập"
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={{
            uri: "https://img.freepik.com/free-vector/workspace-concept-illustration_114360-1412.jpg",
          }}
          style={styles.image}
        />

        <Text style={styles.title}>Sign up</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Your Gmail"
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

        <View style={styles.checkboxContainer}>
          <CheckBox
            checked={rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
            containerStyle={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>Remember me</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => router.push("/authentication/Signup")}
          >
            <Text style={styles.link}>Create an account</Text>
          </TouchableOpacity>

          <View style={styles.socialContainer}>
            <Text style={styles.socialText}>Or login with</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: "#3b5998" }]}
                onPress={() => facebookRequest && facebookPromptAsync()}
                disabled={!facebookRequest}
              >
                <Text style={styles.socialButtonText}>F</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: "#1DA1F2" }]}
                onPress={() => {}}
              >
                <Text style={styles.socialButtonText}>T</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: "#DB4437" }]}
                onPress={() => googleRequest && googlePromptAsync()}
                disabled={!googleRequest}
              >
                <Text style={styles.socialButtonText}>G</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 200,
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
    backgroundColor: "#87CEEB",
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
  footer: {
    alignItems: "center",
  },
  link: {
    color: "#000",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  socialContainer: {
    alignItems: "center",
  },
  socialText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 120,
  },
  socialButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Login;
