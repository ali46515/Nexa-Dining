import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinay";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const menuStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "menu-items",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return `menu-${uniqueSuffix}`;
    },
  },
});

export { cloudinary, menuStorage };
