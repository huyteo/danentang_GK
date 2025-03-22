import axios from "axios";

const API_URL = "http://192.168.1.4:3000"; // Thêm port 3000

export const getProducts = async () => {
  return await axios.get(`${API_URL}/products`);
};

export const addProduct = async (product) => {
  return await axios.post(`${API_URL}/add-products`, product);
};

export const deleteProduct = async (id) => {
  return await axios.delete(`${API_URL}/products/${id}`);
};

// API cập nhật sản phẩm
export const updateProduct = async (id, updatedData) => {
  return await axios.put(`${API_URL}/products-update/${id}`, updatedData);
};

export const signup = async (userData) => {
  return await axios.post(`${API_URL}/signup`, userData);
};

export const login = async (loginData) => {
  return await axios.post(`${API_URL}/login`, loginData);
};
