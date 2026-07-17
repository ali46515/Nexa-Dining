import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/menu-items");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `menu-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error("Only image files (jpeg, jpg, png, webp) are allowed!"),
      false,
    );
  }
};

const uploadLocal = multer({
  storage: localStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

let uploadCloud;
try {
  const { menuStorage } = await import("../utils/cloudinary.js");
  uploadCloud = multer({
    storage: menuStorage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
} catch (error) {
  console.log("Cloudinary not configured, using local storage");
}

const upload =
  process.env.USE_CLOUDINARY === "true" && uploadCloud
    ? uploadCloud
    : uploadLocal;

export default upload;
