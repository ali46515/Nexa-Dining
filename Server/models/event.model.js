import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  image: {
    url: {
      type: String,
      required: [true, "Image URL is required"],
    },
    altText: String,
    metadata: {
      camera: String,
      location: String,
      photographer: String,
    },
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["food", "ambiance", "behind-the-scenes", "events", "team"],
  },
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Event title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Event description is required"],
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  date: {
    type: Date,
    required: [true, "Event date is required"],
  },
  time: {
    type: String,
    required: [true, "Event time is required"],
  },
  duration: Number, // in minutes
  capacity: {
    type: Number,
    required: [true, "Event capacity is required"],
  },
  price: {
    type: Number,
    required: [true, "Event price is required"],
  },
  image: {
    url: String,
    altText: String,
  },
  category: {
    type: String,
    enum: [
      "tasting",
      "cooking-class",
      "wine-pairing",
      "holiday",
      "special",
      "private",
    ],
    required: true,
  },
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rsvps: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      guestCount: {
        type: Number,
        default: 1,
      },
      specialRequests: String,
      status: {
        type: String,
        enum: ["confirmed", "waitlist", "cancelled"],
        default: "confirmed",
      },
      rsvpDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "cancelled"],
    default: "upcoming",
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ category: 1 });

const GalleryItem = mongoose.model("GalleryItem", galleryItemSchema);
const Event = mongoose.model("Event", eventSchema);

export { GalleryItem, Event };
