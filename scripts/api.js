import axios from "axios";

const API_URL = "http://192.168.1.3/products";

export const getProducts = async () => {
  return await axios.get(API_URL);
};

export const addProduct = async (product) => {
  return await axios.post(API_URL, product);
};

export const deleteProduct = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
