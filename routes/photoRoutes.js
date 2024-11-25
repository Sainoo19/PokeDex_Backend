const express = require('express');
const multer = require('multer');
const path = require('path');
var router = express.Router();
// Cấu hình multer để lưu tệp vào thư mục public/upload
const upload = multer({
  dest: 'public/upload/', // Thư mục lưu trữ ảnh
  limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước ảnh 10MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return cb(new Error('Only PNG, JPG and JPEG files are allowed.'));
    }
    cb(null, true);
  }
});

// Endpoint upload ảnh
router.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // URL của ảnh vừa tải lên
  const imageUrl = `/upload/${req.file.filename}`;
  
  // Trả về URL của ảnh đã lưu
  res.json({ imageUrl });
});

// Cấu hình server để phục vụ các tệp tĩnh từ thư mục public
router.use(express.static('public'));

// Khởi động server
// const port = process.env.PORT || 8080;
// router.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
