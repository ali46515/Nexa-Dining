import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GalleryItem } from "../models/event.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getGalleryItems = async (req, res, next) => {
  try {
    const reqQuery = { ...req.query };
    const removeFields = [
      "select",
      "sort",
      "page",
      "limit",
      "category",
      "featured",
    ];
    removeFields.forEach((param) => delete reqQuery[param]);
    
    let filter = {};
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.featured === "true") {
      filter.isFeatured = true;
    }

    let query = GalleryItem.find(filter);
    
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
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await GalleryItem.countDocuments(filter);

    query = query.skip(startIndex).limit(limit);

    const galleryItems = await query;

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
      count: galleryItems.length,
      pagination,
      total,
      data: galleryItems,
    });
  } catch (error) {
    next(error);
  }
};

const getGalleryItem = async (req, res, next) => {
  try {
    const galleryItem = await GalleryItem.findById(req.params.id);

    if (!galleryItem) {
      res.status(404);
      throw new Error("Gallery item not found");
    }

    res.status(200).json({
      success: true,
      data: galleryItem,
    });
  } catch (error) {
    next(error);
  }
};

const getGalleryByCategory = async (req, res, next) => {
  try {
    const galleryItems = await GalleryItem.find({
      category: req.params.category,
    }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: galleryItems.length,
      data: galleryItems,
    });
  } catch (error) {
    next(error);
  }
};

const createGalleryItem = async (req, res, next) => {
  try {    
    if (req.file) {
      req.body.image = {
        url:
          process.env.USE_CLOUDINARY === "true"
            ? req.file.path
            : `/uploads/gallery/${req.file.filename}`,
        altText: req.body.altText || req.body.title,
        metadata: {
          camera: req.body.camera || "",
          location: req.body.location || "",
          photographer: req.body.photographer || "",
        },
      };
    } else {
      res.status(400);
      throw new Error("Please upload an image");
    }

    if (req.body.tags) {
      if (typeof req.body.tags === "string") {
        req.body.tags = req.body.tags.split(",").map((tag) => tag.trim());
      }
    }

    req.body.isFeatured =
      req.body.isFeatured === "true" || req.body.isFeatured === true;

    const galleryItem = await GalleryItem.create(req.body);

    res.status(201).json({
      success: true,
      message: "Gallery item created successfully",
      data: galleryItem,
    });
  } catch (error) {
    if (req.file && process.env.USE_CLOUDINARY !== "true") {
      const filePath = path.join(__dirname, "..", req.file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

const updateGalleryItem = async (req, res, next) => {
  try {
    let galleryItem = await GalleryItem.findById(req.params.id);

    if (!galleryItem) {
      res.status(404);
      throw new Error("Gallery item not found");
    }

    if (req.file) {
      if (galleryItem.image && galleryItem.image.url) {
        if (process.env.USE_CLOUDINARY !== "true") {
          const oldImagePath = path.join(
            __dirname,
            "..",
            galleryItem.image.url,
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } else {
          const { cloudinary } = await import("../utils/cloudinary.js");
          const publicId = galleryItem.image.url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`gallery/${publicId}`);
        }
      }

      req.body.image = {
        url:
          process.env.USE_CLOUDINARY === "true"
            ? req.file.path
            : `/uploads/gallery/${req.file.filename}`,
        altText: req.body.altText || req.body.title || galleryItem.title,
        metadata: {
          camera: req.body.camera || galleryItem.image.metadata.camera,
          location: req.body.location || galleryItem.image.metadata.location,
          photographer:
            req.body.photographer || galleryItem.image.metadata.photographer,
        },
      };
    }

    if (req.body.tags) {
      if (typeof req.body.tags === "string") {
        req.body.tags = req.body.tags.split(",").map((tag) => tag.trim());
      }
    }

    if (req.body.isFeatured !== undefined) {
      req.body.isFeatured =
        req.body.isFeatured === "true" || req.body.isFeatured === true;
    }

    req.body.updatedAt = Date.now();

    galleryItem = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      data: galleryItem,
    });
  } catch (error) {
    next(error);
  }
};

const deleteGalleryItem = async (req, res, next) => {
  try {
    const galleryItem = await GalleryItem.findById(req.params.id);

    if (!galleryItem) {
      res.status(404);
      throw new Error("Gallery item not found");
    }

    if (galleryItem.image && galleryItem.image.url) {
      if (process.env.USE_CLOUDINARY !== "true") {
        const imagePath = path.join(__dirname, "..", galleryItem.image.url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } else {
        const { cloudinary } = await import("../utils/cloudinary.js");
        const publicId = galleryItem.image.url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`gallery/${publicId}`);
      }
    }

    await galleryItem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

const toggleFeatured = async (req, res, next) => {
  try {
    const galleryItem = await GalleryItem.findById(req.params.id);

    if (!galleryItem) {
      res.status(404);
      throw new Error("Gallery item not found");
    }

    galleryItem.isFeatured = !galleryItem.isFeatured;
    galleryItem.updatedAt = Date.now();
    await galleryItem.save();

    res.status(200).json({
      success: true,
      message: `Gallery item is now ${galleryItem.isFeatured ? "featured" : "not featured"}`,
      data: galleryItem,
    });
  } catch (error) {
    next(error);
  }
};

const bulkDeleteGalleryItems = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400);
      throw new Error("Please provide an array of gallery item IDs");
    }

    const items = await GalleryItem.find({ _id: { $in: ids } });

    for (const item of items) {
      if (item.image && item.image.url) {
        if (process.env.USE_CLOUDINARY !== "true") {
          const imagePath = path.join(__dirname, "..", item.image.url);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        } else {
          const { cloudinary } = await import("../utils/cloudinary.js");
          const publicId = item.image.url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`gallery/${publicId}`);
        }
      }
    }

    await GalleryItem.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${ids.length} gallery items deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

const getFeaturedItems = async (req, res, next) => {
  try {
    const galleryItems = await GalleryItem.find({ isFeatured: true })
      .sort("-createdAt")
      .limit(10);

    res.status(200).json({
      success: true,
      count: galleryItems.length,
      data: galleryItems,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getGalleryItems,
  getGalleryItem,
  getGalleryByCategory,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  toggleFeatured,
  bulkDeleteGalleryItems,
  getFeaturedItems,
};
