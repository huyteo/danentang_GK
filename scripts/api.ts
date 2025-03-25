import axios from "axios";

// Định nghĩa interface Product
interface Product {
  _id: string;
  tensp: string;
  loaisp: string;
  gia: number;
  hinhanh: string;
  tenanh: string;
}

// Định nghĩa interface cho dữ liệu sản phẩm khi thêm hoặc cập nhật
interface ProductData {
  tensp: string;
  loaisp: string;
  gia: string | number;
  hinhanh?: File; // Ảnh là tùy chọn vì có thể không gửi khi cập nhật
}

// Định nghĩa interface cho dữ liệu đăng ký
interface SignupData {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
  agreeToTerms: boolean;
}

// Định nghĩa interface cho dữ liệu đăng nhập
interface LoginData {
  email: string;
  password: string;
}

const API_URL = "http://192.168.1.23:3000"; // Thêm port 3000

// API lấy danh sách sản phẩm
export const getProducts = async () => {
  return await axios.get<Product[]>(`${API_URL}/products`); // Khai báo kiểu trả về
};

// API thêm sản phẩm
export const addProduct = async (product: FormData) => {
  return await axios.post<Product>(`${API_URL}/add-products`, product);
};

// API xóa sản phẩm
export const deleteProduct = async (id: string) => {
  return await axios.delete(`${API_URL}/products/${id}`);
};

// API cập nhật sản phẩm
export const updateProduct = async (id: string, updatedData: FormData) => {
  return await axios.put<Product>(
    `${API_URL}/products-update/${id}`,
    updatedData
  );
};

// API đăng ký người dùng
export const signup = async (userData: SignupData) => {
  return await axios.post(`${API_URL}/signup`, userData);
};

// API đăng nhập người dùng
export const login = async (loginData: LoginData) => {
  return await axios.post(`${API_URL}/login`, loginData);
};
