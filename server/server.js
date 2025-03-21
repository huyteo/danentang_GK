const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();

mongoose
  .connect("mongodb://192.168.1.12:27017/productDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use(express.json());
app.use(cors());

// Schema sản phẩm
const ProductSchema = new mongoose.Schema({
  tensp: { type: String, required: true, unique: true, trim: true }, // ten san phẩm
  loaisp: { type: String, required: true, trim: true }, // Loại sản phẩm
  gia: { type: Number, required: true, min: 1 }, // Giá
  hinhanh: { type: String, default: "" }, // Hình ảnh
});

const Product = mongoose.model("Product", ProductSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
app.use("/uploads", express.static("uploads"));

// API lấy danh sách sản phẩm
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm" });
  }
});

app.post("/add-products", upload.single("hinhanh"), async (req, res) => {
  try {
    console.log("📥 Dữ liệu nhận từ frontend:", req.body);
    console.log("📸 Ảnh nhận được:", req.file);

    const { tensp, loaisp, gia } = req.body;
    if (!tensp || !loaisp || !gia || !req.file) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin" });
    }

    const existingProduct = await Product.findOne({ tensp });
    if (existingProduct) {
      return res.status(400).json({ error: "Tên sản phẩm đã tồn tại" });
    }

    const newProduct = new Product({
      tensp,
      loaisp,
      gia,
      hinhanh: req.file.filename, // Lưu tên file ảnh
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("❌ Lỗi server:", error);
    res.status(500).json({ error: "Lỗi khi thêm sản phẩm" });
  }
});

// API xóa sản phẩm (Tìm bằng idsanpham thay vì _id của MongoDB)
app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id); // Sử dụng _id
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }
    res.json({ message: "🗑️ Xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa sản phẩm" });
  }
});
app.put("/products-update/:id", upload.single("hinhanh"), async (req, res) => {
  try {
    const { tensp, loaisp, gia } = req.body;
    const { id } = req.params;

    console.log("🆔 ID từ params:", id);
    console.log("📥 Dữ liệu từ body:", req.body);
    console.log("📸 File upload:", req.file);

    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID sản phẩm không hợp lệ" });
    }

    let updateFields = {};

    if (tensp?.trim()) updateFields.tensp = tensp.trim();
    if (loaisp?.trim()) updateFields.loaisp = loaisp.trim();
    if (gia !== undefined && gia !== "") updateFields.gia = Number(gia);

    if (req.file) {
      updateFields.hinhanh = req.file.filename;
    }

    console.log("📝 Trường cần cập nhật:", updateFields);

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ error: "Không có thông tin nào để cập nhật" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }

    console.log("✅ Cập nhật thành công:", updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    console.error("❌ Lỗi server:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật sản phẩm" });
  }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
