import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import MenuItem from "../models/menu.model.js";

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getMenuItems = async (req, res, next) => {
  try {
    const reqQuery = { ...req.query };

    const removeFields = ["select", "sort", "page", "limit", "search"];
    removeFields.forEach((param) => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`,
    );

    let query = MenuItem.find(JSON.parse(queryStr));

    if (req.query.search) {
      query = MenuItem.find({
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } },
          { category: { $regex: req.query.search, $options: "i" } },
        ],
      });
    }

    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await MenuItem.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const menuItems = await query;

    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: menuItems.length,
      pagination,
      total,
      data: menuItems,
    });
  } catch (error) {
    next(error);
  }
};

const getMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      res.status(404);
      throw new Error("Menu item not found");
    }

    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map((file, index) => ({
        url:
          process.env.USE_CLOUDINARY === "true"
            ? file.path
            : `/uploads/menu-items/${file.filename}`,
        altText: req.body.imageAltTexts
          ? req.body.imageAltTexts[index]
          : req.body.name,
        isMain: index === 0,
      }));
    }

    if (req.body.dietaryTags) {
      if (typeof req.body.dietaryTags === "string") {
        req.body.dietaryTags = req.body.dietaryTags
          .split(",")
          .map((tag) => tag.trim().toUpperCase());
      }
    }

    if (req.body.ingredients) {
      if (typeof req.body.ingredients === "string") {
        try {
          req.body.ingredients = JSON.parse(req.body.ingredients);
        } catch {
          req.body.ingredients = req.body.ingredients
            .split(",")
            .map((name) => ({
              name: name.trim(),
              isAllergen: false,
            }));
        }
      }
    }

    if (req.body.nutritionalInfo) {
      if (typeof req.body.nutritionalInfo === "string") {
        try {
          req.body.nutritionalInfo = JSON.parse(req.body.nutritionalInfo);
        } catch {
          req.body.nutritionalInfo = {};
        }
      }
    }

    const menuItem = await MenuItem.create(req.body);

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: menuItem,
    });
  } catch (error) {
    if (req.files && process.env.USE_CLOUDINARY !== "true") {
      req.files.forEach((file) => {
        const filePath = path.join(__dirname, "..", file.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    let menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      res.status(404);
      throw new Error("Menu item not found");
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url:
          process.env.USE_CLOUDINARY === "true"
            ? file.path
            : `/uploads/menu-items/${file.filename}`,
        altText: req.body.imageAltTexts
          ? req.body.imageAltTexts[index]
          : req.body.name,
        isMain: index === 0 && !menuItem.images.some((img) => img.isMain),
      }));

      if (req.body.keepExistingImages === "true") {
        req.body.images = [...menuItem.images, ...newImages];
      } else {
        if (process.env.USE_CLOUDINARY !== "true") {
          menuItem.images.forEach((image) => {
            const imagePath = path.join(__dirname, "..", image.url);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          });
        }
        req.body.images = newImages;
      }
    }

    if (req.body.dietaryTags) {
      if (typeof req.body.dietaryTags === "string") {
        req.body.dietaryTags = req.body.dietaryTags
          .split(",")
          .map((tag) => tag.trim().toUpperCase());
      }
    }

    if (req.body.ingredients) {
      if (typeof req.body.ingredients === "string") {
        try {
          req.body.ingredients = JSON.parse(req.body.ingredients);
        } catch {
          req.body.ingredients = req.body.ingredients
            .split(",")
            .map((name) => ({
              name: name.trim(),
              isAllergen: false,
            }));
        }
      }
    }

    if (req.body.nutritionalInfo) {
      if (typeof req.body.nutritionalInfo === "string") {
        try {
          req.body.nutritionalInfo = JSON.parse(req.body.nutritionalInfo);
        } catch {
          req.body.nutritionalInfo = {};
        }
      }
    }

    req.body.updatedAt = Date.now();

    menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      res.status(404);
      throw new Error("Menu item not found");
    }

    if (process.env.USE_CLOUDINARY !== "true" && menuItem.images) {
      menuItem.images.forEach((image) => {
        const imagePath = path.join(__dirname, "..", image.url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    if (process.env.USE_CLOUDINARY === "true" && menuItem.images) {
      const { cloudinary } = await import("../utils/cloudinary.js");
      for (const image of menuItem.images) {
        const publicId = image.url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`menu-items/${publicId}`);
      }
    }

    await menuItem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

const deleteMenuItemImage = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      res.status(404);
      throw new Error("Menu item not found");
    }

    const image = menuItem.images.id(req.params.imageId);

    if (!image) {
      res.status(404);
      throw new Error("Image not found");
    }

    if (process.env.USE_CLOUDINARY !== "true") {
      const imagePath = path.join(__dirname, "..", image.url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } else {
      const { cloudinary } = await import("../utils/cloudinary.js");
      const publicId = image.url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`menu-items/${publicId}`);
    }
    
    image.deleteOne();
    await menuItem.save();

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

const getMenuByCategory = async (req, res, next) => {
  try {
    const menuItems = await MenuItem.find({
      category: req.params.category,
      isAvailable: true,
    }).sort("order");

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    next(error);
  }
};

const getSpecialItems = async (req, res, next) => {
  try {
    const menuItems = await MenuItem.find({
      isSpecial: true,
      isAvailable: true,
    }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    next(error);
  }
};

const toggleAvailability = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      res.status(404);
      throw new Error("Menu item not found");
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    menuItem.updatedAt = Date.now();
    await menuItem.save();

    res.status(200).json({
      success: true,
      message: `Menu item is now ${menuItem.isAvailable ? "available" : "unavailable"}`,
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

const bulkUpdateOrder = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      res.status(400);
      throw new Error("Please provide an array of items with id and order");
    }

    const updatePromises = items.map((item) =>
      MenuItem.findByIdAndUpdate(
        item.id,
        { order: item.order, updatedAt: Date.now() },
        { new: true, runValidators: true },
      ),
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Menu items order updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
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
};
