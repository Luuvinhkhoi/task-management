const multer = require('multer');

// Cấu hình Multer
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Đặt tên file theo tên gốc
  }
});

const upload = multer({ storage });

module.exports = upload;