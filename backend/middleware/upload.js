// middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, name);
  },
});

function fileFilter(req, file, cb) {
  // Relaxed filter for debugging
  const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.warn("Blocked file type:", file.mimetype);
    // Instead of erroring immediately, let's try to be lenient or return a clear error
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: JPG, PNG, PDF, DOC`));
  }
}

const upload = multer({ storage, fileFilter });

module.exports = upload;
