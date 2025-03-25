import React, { useState, useEffect } from "react";
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
import axios from "axios";

interface UpdateProductProps {
  product: {
    _id: string;
    tensp: string;
    loaisp: string;
    gia: number;
    hinhanh: string;
  };
  onClose: () => void;
  onProductUpdated: () => void;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({
  product,
  onClose,
  onProductUpdated,
}) => {
  const [tensp, setTensp] = useState(product.tensp);
  const [loaisp, setLoaisp] = useState(product.loaisp);
  const [gia, setGia] = useState(product.gia.toString());
  const [hinhanh, setHinhanh] = useState(product.hinhanh);
  const [tenhinhanh, setTenHinhanh] = useState("");
  const [isLocalImage, setIsLocalImage] = useState(false);

  // Hàm chọn ảnh
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("⚠️ Lỗi", "Bạn cần cấp quyền truy cập thư viện ảnh!");
      return;
    }

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
      setIsLocalImage(true);
    }
  };

  // Hàm gọi API để cập nhật sản phẩm
  const handleUpdate = async () => {
    if (!tensp || !loaisp || !gia) {
      Alert.alert("⚠️ Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("idsanpham", tensp);
    formData.append("loaisp", loaisp);
    formData.append("gia", gia);
    if (tenhinhanh) {
      formData.append("hinhanh", {
        uri: hinhanh,
        name: tenhinhanh,
        type: "image/jpeg",
      } as any);
    }

    try {
      const response = await axios.put(
        `http://192.168.1.23:3000/products-update/${product._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Alert.alert("✅ Thành công", "Cập nhật sản phẩm thành công!");
      onProductUpdated();
      onClose();
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật sản phẩm:", error);
      Alert.alert("❌ Lỗi", "Không thể cập nhật sản phẩm");
    }
  };

  // Xác định URI của ảnh để hiển thị
  const getImageUri = () => {
    if (!hinhanh) return undefined; // Trả về undefined thay vì null
    if (isLocalImage) return hinhanh;
    if (hinhanh.includes("http")) return hinhanh;
    return `http://192.168.1.23:3000/uploads/${hinhanh}`;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Cập Nhật Sản Phẩm</Text>
        <TextInput
          placeholder="Nhập ID sản phẩm"
          value={tensp}
          onChangeText={setTensp}
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
        {getImageUri() && (
          <Image
            source={{ uri: getImageUri() }}
            style={styles.image}
            onError={(error) => console.log("Lỗi tải ảnh:", error.nativeEvent)}
          />
        )}
        <TouchableOpacity onPress={handleUpdate} style={styles.addButton}>
          <Text style={styles.buttonText}>Cập Nhật</Text>
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

export default UpdateProduct;
