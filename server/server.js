const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const app = express();

// Kết nối MongoDB
mongoose
  .connect("mongodb://localhost:27017/productDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors());

// Schema sản phẩm
const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  image: String,
});

const Product = mongoose.model("Product", ProductSchema);

// API lấy danh sách sản phẩm
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// API thêm sản phẩm
app.post("/products", async (req, res) => {
  const { name, category, price, image } = req.body;
  const newProduct = new Product({ name, category, price, image });
  await newProduct.save();
  res.json(newProduct);
});

// API xóa sản phẩm
app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
