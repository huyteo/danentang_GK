import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { addProduct } from "../../scripts/api";

interface AddProductProps {
  onClose: () => void;
  onProductAdded: () => void;
}

// interface Product {
//   _id: string;
//   tensp: string;
//   loaisp: string;
//   gia: number;
//   hinhanh: string;
// }

const AddProduct: React.FC<AddProductProps> = ({ onClose, onProductAdded }) => {
  const [idsanpham, setIdsanpham] = useState("");
  const [loaisp, setLoaisp] = useState("");
  const [gia, setGia] = useState("");
  const [hinhanh, setHinhanh] = useState("");
  const [tenhinhanh, setTenHinhanh] = useState("");

  // Hàm chọn ảnh
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const filename = uri.split("/").pop() || "unknown.png";
      setHinhanh(uri);
      setTenHinhanh(filename);
    }
  };

  const handleSubmit = async () => {
    if (!idsanpham || !loaisp || !gia || !hinhanh) {
      Alert.alert("⚠️ Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("idsanpham", idsanpham);
    formData.append("loaisp", loaisp);
    formData.append("gia", gia);
    formData.append("hinhanh", {
      uri: hinhanh,
      name: tenhinhanh,
      type: "image/jpeg",
    } as any);
    try {
      await addProduct(formData);
      Alert.alert("✅ Thành công", "Thêm sản phẩm thành công!");

      // Reset form
      setIdsanpham("");
      setLoaisp("");
      setGia("");
      setHinhanh("");
      setTenHinhanh("");

      onProductAdded();
      onClose();
    } catch (error) {
      console.error("❌ Lỗi khi thêm sản phẩm:", error);
      Alert.alert("❌ Lỗi", "Không thể thêm sản phẩm");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Thêm Sản Phẩm</Text>
        <TextInput
          placeholder="Nhập ID sản phẩm"
          value={idsanpham}
          onChangeText={setIdsanpham}
          style={styles.input}
        />
        <TextInput
          placeholder="Nhập loại sản phẩm"
          value={loaisp}
          onChangeText={setLoaisp}
          style={styles.input}
        />
        <TextInput
          placeholder="Nhập giá sản phẩm"
          value={gia}
          onChangeText={setGia}
          keyboardType="numeric"
          style={styles.input}
        />
        <TouchableOpacity onPress={pickImage} style={styles.pickImageButton}>
          <Text style={styles.buttonText}>Chọn Ảnh</Text>
        </TouchableOpacity>
        {hinhanh ? (
          <Image source={{ uri: hinhanh }} style={styles.image} />
        ) : null}
        <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
          <Text style={styles.buttonText}>Thêm</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF2FD",
    padding: 20,
    width: 330,
    height: 400,
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
