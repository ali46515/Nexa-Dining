import express from "express";
const router = express.Router();
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
  cancelRSVP,
  updateRSVPStatus,
  getEventAttendees,
  updateEventStatus,
  getUpcomingEvents,
  getEventsByCategory,
} from "../controllers/event.controller.js";

import { auth, authorize } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

// Public routes
router.get("/", getEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/category/:category", getEventsByCategory);
router.get("/:id", getEvent);

router.use(auth);

router.post("/:id/rsvp", rsvpToEvent);
router.delete("/:id/rsvp", cancelRSVP);

// Admin routes
router.use(authorize("admin"));

router.post("/", upload.single("image"), createEvent);

router.put("/:id", upload.single("image"), updateEvent);

router.delete("/:id", deleteEvent);

router.patch("/:id/rsvp/:rsvpId", updateRSVPStatus);

router.get("/:id/attendees", getEventAttendees);

router.patch("/:id/status", updateEventStatus);

export default router;
