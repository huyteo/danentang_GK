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
  TextInput,
} from "react-native";
import { getProducts, deleteProduct } from "../../scripts/api";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Product {
  _id: string;
  tensp: string;
  loaisp: string;
  gia: number;
  hinhanh: string;
  tenanh: string;
}

interface User {
  name: string;
  email: string;
}

const ProductList = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initialize = async () => {
      await loadUserData();
      fetchProducts();
    };
    initialize();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      console.log(
        "Dữ liệu người dùng từ AsyncStorage trong ProductList:",
        userData
      );
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } else {
        console.log(
          "Không tìm thấy thông tin người dùng, chuyển hướng về Login"
        );
        router.replace("/authentication/Login");
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
      router.replace("/authentication/Login");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      console.log("Dữ liệu từ API:", response.data);
      setProducts(response.data);
      setFilteredProducts(response.data);

      const uniqueCategories = [
        "Tất cả",
        ...new Set(response.data.map((product: Product) => product.loaisp)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const filterProducts = (category: string, query: string) => {
    let filtered = products;

    if (category !== "Tất cả") {
      filtered = filtered.filter((product) => product.loaisp === category);
    }

    if (query.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.tensp.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    filterProducts(category, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterProducts(selectedCategory, query);
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
      setUserModalVisible(false);
      router.replace("/authentication/Login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const handleOpenUserModal = async () => {
    await loadUserData();
    setUserModalVisible(true);
  };

  const handleProductPress = (product: Product) => {
    console.log("Điều hướng đến ProductDetail, stack hiện tại:", router);
    router.push({
      pathname: "/screens/ProductDetail",
      params: { product: JSON.stringify(product) },
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Quản lý sản phẩm</Text>
          <TouchableOpacity onPress={handleOpenUserModal}>
            <View style={styles.userIconWrapper}>
              <Feather name="user" size={24} color="#F8F8FF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Phần category */}
        <View>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.category_area}>
                <TouchableOpacity
                  style={[
                    styles.categoryTab,
                    selectedCategory === item && styles.selectedCategoryTab,
                  ]}
                  onPress={() => handleCategorySelect(item)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === item && styles.selectedCategoryText,
                    ]}
                  >
                    {item.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            style={styles.categoryList}
          />
        </View>

        {/* Ô tìm kiếm */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <Feather
            name="search"
            size={20}
            color="#555"
            style={styles.searchIcon}
          />
        </View>

        {/* Danh sách sản phẩm */}
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleProductPress(item)}
            >
              <Image
                source={{
                  uri: `http://192.168.1.16:3000/uploads/${item.hinhanh}`,
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
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation(); // Ngăn sự kiện onPress của card
                    handleEdit(item);
                  }}
                >
                  <Feather name="edit" size={20} color="#7187f5" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation(); // Ngăn sự kiện onPress của card
                    confirmDelete(item);
                  }}
                >
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Nút thêm sản phẩm */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>

        {/* Modal thêm sản phẩm */}
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

        {/* Modal cập nhật sản phẩm */}
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

        {/* Modal xác nhận xóa */}
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

        {/* Modal hiển thị thông tin tài khoản */}
        <Modal
          visible={userModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setUserModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setUserModalVisible(false)}
          >
            <View
              style={styles.modalContainer}
              onStartShouldSetResponder={() => true}
            >
              <Text style={styles.modalTitle}>Tài khoản</Text>
              {user ? (
                <>
                  <Text style={styles.modalMessage}>Email: {user.email}</Text>
                  <Text style={styles.modalMessage}>Tên: {user.name}</Text>
                </>
              ) : (
                <Text style={styles.modalMessage}>
                  Chưa có thông tin người dùng
                </Text>
              )}
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
  userIconWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 6,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F8F8FF",
  },
  categoryList: {
    marginBottom: 5,
    height: 80,
  },
  categoryTab: {
    backgroundColor: "#fff",
    borderRadius: 25,
    marginRight: 7,
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCategoryTab: {
    backgroundColor: "#F5A623",
  },
  category_area: {
    height: 80,
    justifyContent: "center",
  },
  categoryText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 5,
    paddingHorizontal: 10,
    width: "100%",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  searchIcon: {
    marginLeft: 10,
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
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // Khoảng cách giữa các nút
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
    marginBottom: 10,
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
  logoutButton: {
    backgroundColor: "#276cf5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductList;
