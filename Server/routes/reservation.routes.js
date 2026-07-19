import express from "express";
const router = express.Router();
import {
  checkAvailability,
  getAvailableTimeSlots,
  createReservation,
  getReservations,
  getReservation,
  getMyReservations,
  updateReservation,
  cancelReservation,
  confirmReservation,
  assignTable,
  completeReservation,
  markNoShow,
  getReservationStats,
  sendReminders,
} from "../controllers/reservation.controller.js";

import { auth, authorize } from "../middlewares/auth.middleware.js";

// Public routes
router.get("/availability", checkAvailability);
router.get("/timeslots", getAvailableTimeSlots);

router.use(auth);

// User routes
router.post("/", createReservation);
router.get("/my-reservations", getMyReservations);
router.get("/:id", getReservation);
router.put("/:id", updateReservation);
router.patch("/:id/cancel", cancelReservation);

// Admin routes
router.use(authorize("admin"));

router.get("/", getReservations);
router.get("/stats/overview", getReservationStats);
router.post("/send-reminders", sendReminders);
router.patch("/:id/confirm", confirmReservation);
router.patch("/:id/assign-table", assignTable);
router.patch("/:id/complete", completeReservation);
router.patch("/:id/no-show", markNoShow);

export default router;
