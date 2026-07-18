import express from "express";
const router = express.Router();
import {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  deleteMenuItemImage,
  getMenuByCategory,
  getSpecialItems,
  toggleAvailability,
  bulkUpdateOrder,
} from "../controllers/menu.controller.js";

import { auth, authorize } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

router.get("/", getMenuItems);
router.get("/specials", getSpecialItems);
router.get("/category/:category", getMenuByCategory);
router.get("/:id", getMenuItem);

// Admin Routes
router.use(auth);
router.use(authorize("admin"));

router.post("/", upload.array("images", 5), createMenuItem);

router.put("/:id", upload.array("images", 5), updateMenuItem);

router.delete("/:id", deleteMenuItem);

router.delete("/:id/images/:imageId", deleteMenuItemImage);

router.patch("/:id/availability", toggleAvailability);

router.put("/bulk-order/update", bulkUpdateOrder);

export default router;
