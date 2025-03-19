import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
import { useRouter } from "expo-router";
import { addProduct } from "../../scripts/api";

const AddProduct = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: "photo",
      });

      if (result.didCancel) return;

      if (result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri || "");
      }
    } catch (error) {
      console.error("Image Picker Error: ", error);
    }
  };

  const handleSubmit = async () => {
    if (!name || !category || !price) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const newProduct = {
      name,
      category,
      price: Number(price),
      image,
    };

    try {
      await addProduct(newProduct);
      Alert.alert("Thành công", "Thêm sản phẩm thành công!");
      //router.push("/products");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      Alert.alert("Lỗi", "Không thể thêm sản phẩm");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Sản Phẩm</Text>

      <TextInput
        placeholder="Nhập tên sản phẩm"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Nhập giá sản phẩm"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Nhập loại sản phẩm"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <TouchableOpacity onPress={pickImage} style={styles.pickImageButton}>
        <Text style={styles.buttonText}>Chọn Ảnh</Text>
      </TouchableOpacity>

      {image ? <Image source={{ uri: image }} style={styles.image} /> : null}

      <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
        <Text style={styles.buttonText}>Thêm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF2FD",
    padding: 20,
    width: 330,
    height: 400, // Giờ sẽ hoạt động
    borderRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#888",
    marginBottom: 15,
    padding: 5,
    fontSize: 16,
  },
  pickImageButton: {
    backgroundColor: "#f0c0ff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#c0c0ff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default AddProduct;
