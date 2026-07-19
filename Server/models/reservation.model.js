import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Reservation must be associated with a user"],
  },
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number"],
  },
  date: {
    type: Date,
    required: [true, "Reservation date is required"],
    validate: {
      validator: function (value) {
        return value >= new Date();
      },
      message: "Reservation date must be in the future",
    },
  },
  time: {
    type: String,
    required: [true, "Reservation time is required"],
    enum: {
      values: [
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
      ],
      message: "{VALUE} is not a valid time slot",
    },
  },
  guestCount: {
    type: Number,
    required: [true, "Number of guests is required"],
    min: [1, "Minimum 1 guest required"],
    max: [20, "Maximum 20 guests allowed"],
  },
  occasion: {
    type: String,
    enum: ["none", "birthday", "anniversary", "business", "other"],
    default: "none",
  },
  specialRequests: {
    type: String,
    maxlength: [500, "Special requests cannot exceed 500 characters"],
  },
  dietaryRestrictions: {
    type: String,
    maxlength: [500, "Dietary restrictions cannot exceed 500 characters"],
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed", "no-show"],
    default: "pending",
  },
  tableAssignment: {
    tableNumber: Number,
    section: String,
  },
  cancellationReason: String,
  reminderSent: {
    type: Boolean,
    default: false,
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

reservationSchema.index({ date: 1, time: 1 });
reservationSchema.index({ email: 1 });
reservationSchema.index({ status: 1 });

export default mongoose.model("Reservation", reservationSchema);
