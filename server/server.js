const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

mongoose
  .connect("mongodb://192.168.1.3:27017/productDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use(express.json());
app.use(cors());

// Schema sản phẩm (đã sửa theo đề bài)
const ProductSchema = new mongoose.Schema({
  idsanpham: { type: String, required: true, unique: true, trim: true }, // ID tự tạo
  loaisp: { type: String, required: true, trim: true }, // Loại sản phẩm
  gia: { type: Number, required: true, min: 1 }, // Giá
  hinhanh: { type: String, required: true, trim: true }, // Hình ảnh
});

const Product = mongoose.model("Product", ProductSchema);

// API lấy danh sách sản phẩm
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm" });
  }
});

// API thêm sản phẩm (Đảm bảo idsanpham là duy nhất)
app.post("/add-products", async (req, res) => {
  try {
    const { idsanpham, loaisp, gia, hinhanh } = req.body;
    if (!idsanpham || !loaisp || !gia || !hinhanh) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin" });
    }
    const existingProduct = await Product.findOne({ idsanpham });
    if (existingProduct) {
      return res.status(400).json({ error: "ID sản phẩm đã tồn tại" });
    }
    const newProduct = new Product({ idsanpham, loaisp, gia, hinhanh });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi khi thêm sản phẩm" });
  }
});

// API xóa sản phẩm (Tìm bằng idsanpham thay vì _id của MongoDB)
app.delete("/products/:idsanpham", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      idsanpham: req.params.idsanpham,
    });
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }
    res.json({ message: "🗑️ Xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa sản phẩm" });
  }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
