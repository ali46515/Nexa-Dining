import express from "express";
const router = express.Router();
import {
  getGalleryItems,
  getGalleryItem,
  getGalleryByCategory,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  toggleFeatured,
  bulkDeleteGalleryItems,
  getFeaturedItems,
} from "../controllers/gallery.controller.js";

import { auth, authorize } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

// Public routes
router.get("/", getGalleryItems);
router.get("/featured/list", getFeaturedItems);
router.get("/category/:category", getGalleryByCategory);
router.get("/:id", getGalleryItem);

// Admin routes
router.use(auth);
router.use(authorize("admin"));

router.post("/", upload.single("image"), createGalleryItem);

router.put("/:id", upload.single("image"), updateGalleryItem);

router.delete("/:id", deleteGalleryItem);

router.delete("/bulk-delete/items", bulkDeleteGalleryItems);

router.patch("/:id/featured", toggleFeatured);

export default router;
