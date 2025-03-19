const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Kết nối MongoDB với try/catch để bắt lỗi
mongoose
  .connect("mongodb://192.168.1.3:27017/productDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use(express.json());
app.use(cors());

// Schema sản phẩm với validation
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 1 },
  image: { type: String, required: true, trim: true },
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

// API thêm sản phẩm
app.post("/add-products", async (req, res) => {
  try {
    console.log("Request body:", req.body); // Kiểm tra dữ liệu nhận được
    const { name, category, price, image } = req.body;
    if (!name || !category || !price || !image) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin" });
    }
    const newProduct = new Product({ name, category, price, image });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi khi thêm sản phẩm" });
  }
});

// API xóa sản phẩm
app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }
    res.json({ message: "🗑️ Xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa sản phẩm" });
  }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
