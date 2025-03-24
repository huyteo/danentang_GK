import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from "react-native";
import { getProducts, deleteProduct } from "../../scripts/api";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";
import { Stack, useRouter } from "expo-router";

interface Product {
  _id: string;
  tensp: string;
  loaisp: string;
  gia: number;
  hinhanh: string;
  tenanh: string;
}

const ProductList = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      console.log("Dữ liệu từ API:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const confirmDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (selectedProduct) {
      await deleteProduct(selectedProduct._id);
      fetchProducts();
      setDeleteModalVisible(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setUpdateModalVisible(true);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Quản lý sản phẩm</Text>
          <TouchableOpacity
            onPress={() => router.push("/authentication/Signup")}
          >
            <Feather name="log-out" size={24} color="#F8F8FF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{
                  uri: `http://192.168.1.3:3000/uploads/${item.hinhanh}`,
                }}
                style={styles.image}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.productID}>Tên: {item.tensp}</Text>
                <Text style={styles.category}>Loại: {item.loaisp}</Text>
                <Text style={styles.price}>
                  Giá:{" "}
                  <Text style={{ color: "#7187f5", fontWeight: "bold" }}>
                    {item.gia} VND
                  </Text>
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Feather name="edit" size={20} color="#7187f5" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDelete(item)}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <AddProduct
                onClose={() => setModalVisible(false)}
                onProductAdded={fetchProducts}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={updateModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setUpdateModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setUpdateModalVisible(false)}
          >
            <View style={styles.modalContent}>
              {editingProduct && (
                <UpdateProduct
                  product={editingProduct}
                  onClose={() => setUpdateModalVisible(false)}
                  onProductUpdated={fetchProducts}
                />
              )}
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal visible={deleteModalVisible} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Xác nhận xóa</Text>
              <Text style={styles.modalMessage}>
                Bạn có chắc là bạn muốn xóa sản phẩm này không?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
                  <Text style={styles.cancelButton}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete}>
                  <Text style={styles.deleteButton}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c7d0f0",
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "ios" ? 56 : 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#276cf5",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F8F8FF",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  productID: {
    fontSize: 16,
    fontWeight: "bold",
  },
  category: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#276cf5",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "transparent",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    width: 300,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    color: "blue",
    fontSize: 16,
    padding: 10,
  },
  deleteButton: {
    color: "red",
    fontSize: 16,
    padding: 10,
  },
});

export default ProductList;
