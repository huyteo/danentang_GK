import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";

interface Product {
  _id: string;
  tensp: string;
  loaisp: string;
  gia: number;
  hinhanh: string;
  tenanh: string;
}

const ProductDetail = () => {
  const router = useRouter();
  const { product } = useLocalSearchParams();

  const productData: Product = product ? JSON.parse(product as string) : null;

  if (!productData) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy thông tin sản phẩm</Text>
      </View>
    );
  }

  const handleBack = () => {
    console.log("Nút quay lại được nhấn");
    router.replace("/screens/ProductList"); // Quay lại ngay lập tức ProductList
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header_details}>
          <TouchableOpacity onPress={handleBack}>
            <Feather name="arrow-left" size={24} color="#F8F8FF" />
          </TouchableOpacity>
          <View style={styles.view_header}>
            <Text style={styles.text_details}>Chi tiết sản phẩm</Text>
          </View>
        </View>
        <Image
          source={{
            uri: `http://192.168.1.16:3000/uploads/${productData.hinhanh}`,
          }}
          style={styles.productImage}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{productData.tensp}</Text>
          <Text style={styles.productCategory}>Loại: {productData.loaisp}</Text>
          <Text style={styles.productPrice}>
            Giá:{" "}
            <Text style={styles.priceHighlight}>{productData.gia} VND</Text>
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c7d0f0",
    padding: 20,
  },

  header_details: {
    backgroundColor: "#276cf5",
    marginTop: 50,
    height: 60,
    flexDirection: "row",
    marginBottom: 30,
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 10,
    paddingLeft: 10,
  },

  view_header: {
    marginLeft: 70,
  },

  text_details: {
    fontSize: 24,
    fontWeight: "500",
    color: "#fff",
  },

  backButton: {
    marginLeft: 10,
    padding: 10, // Tăng padding để dễ nhấn hơn
  },
  productImage: {
    width: "100%",
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: "cover",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  productCategory: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  priceHighlight: {
    color: "#7187f5",
    fontWeight: "bold",
  },
});

export default ProductDetail;
