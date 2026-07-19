import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/user.model.js";
import { Event } from "../models/event.model.js";
import sendEmail from "../services/email.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getEvents = async (req, res, next) => {
  try {
    const reqQuery = { ...req.query };
    const removeFields = [
      "select",
      "sort",
      "page",
      "limit",
      "category",
      "status",
    ];
    removeFields.forEach((param) => delete reqQuery[param]);

    let filter = { isPublic: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    } else {
      filter.status = { $in: ["upcoming", "ongoing"] };
    }

    let query = Event.find(filter)
      .populate("chef", "firstName lastName email")
      .populate("rsvps.user", "firstName lastName email");

    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("date");
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Event.countDocuments(filter);

    query = query.skip(startIndex).limit(limit);

    const events = await query;

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
      count: events.length,
      pagination,
      total,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("chef", "firstName lastName email avatar")
      .populate("rsvps.user", "firstName lastName email");

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = {
        url:
          process.env.USE_CLOUDINARY === "true"
            ? req.file.path
            : `/uploads/events/${req.file.filename}`,
        altText: req.body.imageAltText || req.body.title,
      };
    }

    if (req.body.date) {
      req.body.date = new Date(req.body.date);
    }

    const event = await Event.create(req.body);

    if (event.chef) {
      try {
        const chef = await User.findById(event.chef);
        if (chef) {
          await sendEmail({
            email: chef.email,
            subject: "New Event Assignment",
            message: `
              <h1>New Event Assigned</h1>
              <p>You have been assigned to the following event:</p>
              <h2>${event.title}</h2>
              <p>Date: ${event.date.toDateString()}</p>
              <p>Time: ${event.time}</p>
              <p>Category: ${event.category}</p>
            `,
          });
        }
      } catch (emailError) {
        console.log("Email notification failed:", emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
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

const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    if (req.file) {
      if (event.image && event.image.url) {
        if (process.env.USE_CLOUDINARY !== "true") {
          const oldImagePath = path.join(__dirname, "..", event.image.url);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } else {
          const { cloudinary } = await import("../utils/cloudinary.js");
          const publicId = event.image.url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`events/${publicId}`);
        }
      }

      req.body.image = {
        url:
          process.env.USE_CLOUDINARY === "true"
            ? req.file.path
            : `/uploads/events/${req.file.filename}`,
        altText: req.body.imageAltText || req.body.title || event.title,
      };
    }

    if (req.body.date) {
      req.body.date = new Date(req.body.date);
    }

    if (req.body.capacity) {
      const confirmedRSVPs = event.rsvps.filter(
        (r) => r.status === "confirmed",
      );
      const totalGuests = confirmedRSVPs.reduce(
        (sum, r) => sum + r.guestCount,
        0,
      );

      if (req.body.capacity < totalGuests) {
        res.status(400);
        throw new Error(
          `Capacity cannot be less than current confirmed guests (${totalGuests})`,
        );
      }
    }

    req.body.updatedAt = Date.now();

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("chef", "firstName lastName email")
      .populate("rsvps.user", "firstName lastName email");

    if (event.rsvps && event.rsvps.length > 0) {
      const confirmedUsers = event.rsvps
        .filter((r) => r.status === "confirmed")
        .map((r) => r.user.email);

      if (confirmedUsers.length > 0) {
        try {
          await sendEmail({
            email: confirmedUsers,
            subject: "Event Updated",
            message: `
              <h1>Event Update: ${event.title}</h1>
              <p>The event details have been updated. Please check the new information:</p>
              <p>Date: ${event.date.toDateString()}</p>
              <p>Time: ${event.time}</p>
              <p>Price: $${event.price}</p>
            `,
          });
        } catch (emailError) {
          console.log("Email notification failed:", emailError);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    if (event.image && event.image.url) {
      if (process.env.USE_CLOUDINARY !== "true") {
        const imagePath = path.join(__dirname, "..", event.image.url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } else {
        const { cloudinary } = await import("../utils/cloudinary.js");
        const publicId = event.image.url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`events/${publicId}`);
      }
    }

    if (event.rsvps && event.rsvps.length > 0) {
      const userEmails = event.rsvps
        .filter((r) => r.status === "confirmed")
        .map((r) => r.user.email);

      if (userEmails.length > 0) {
        try {
          await sendEmail({
            email: userEmails,
            subject: "Event Cancelled",
            message: `
              <h1>Event Cancellation</h1>
              <p>We regret to inform you that the following event has been cancelled:</p>
              <h2>${event.title}</h2>
              <p>We apologize for any inconvenience caused.</p>
              <p>Please contact us for any questions.</p>
            `,
          });
        } catch (emailError) {
          console.log("Email notification failed:", emailError);
        }
      }
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

const rsvpToEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    if (event.status !== "upcoming") {
      res.status(400);
      throw new Error("Can only RSVP to upcoming events");
    }

    const confirmedRSVPs = event.rsvps.filter((r) => r.status === "confirmed");
    const totalGuests = confirmedRSVPs.reduce(
      (sum, r) => sum + r.guestCount,
      0,
    );
    const requestedGuests = req.body.guestCount || 1;

    const existingRSVP = event.rsvps.find(
      (r) => r.user.toString() === req.user.id,
    );

    if (existingRSVP) {
      res.status(400);
      throw new Error("You have already RSVP'd to this event");
    }

    if (totalGuests + requestedGuests > event.capacity) {
      event.rsvps.push({
        user: req.user.id,
        guestCount: requestedGuests,
        specialRequests: req.body.specialRequests || "",
        status: "waitlist",
      });
    } else {
      event.rsvps.push({
        user: req.user.id,
        guestCount: requestedGuests,
        specialRequests: req.body.specialRequests || "",
        status: "confirmed",
      });
    }

    await event.save();

    try {
      const user = await User.findById(req.user.id);
      const rsvp = event.rsvps[event.rsvps.length - 1];

      await sendEmail({
        email: user.email,
        subject: `RSVP ${rsvp.status === "confirmed" ? "Confirmation" : "Waitlist"} - ${event.title}`,
        message: `
          <h1>Event RSVP ${rsvp.status === "confirmed" ? "Confirmed" : "Waitlisted"}</h1>
          <h2>${event.title}</h2>
          <p>Date: ${event.date.toDateString()}</p>
          <p>Time: ${event.time}</p>
          <p>Guests: ${requestedGuests}</p>
          <p>Status: ${rsvp.status}</p>
          ${rsvp.status === "waitlist" ? "<p>You will be notified if a spot becomes available.</p>" : ""}
        `,
      });
    } catch (emailError) {
      console.log("Email notification failed:", emailError);
    }

    res.status(200).json({
      success: true,
      message: `Successfully RSVP'd to event. Status: ${event.rsvps[event.rsvps.length - 1].status}`,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

const cancelRSVP = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    const rsvpIndex = event.rsvps.findIndex(
      (r) => r.user.toString() === req.user.id,
    );

    if (rsvpIndex === -1) {
      res.status(400);
      throw new Error("You have not RSVP'd to this event");
    }

    const wasConfirmed = event.rsvps[rsvpIndex].status === "confirmed";

    event.rsvps.splice(rsvpIndex, 1);

    if (wasConfirmed) {
      const waitlistedRSVP = event.rsvps.find((r) => r.status === "waitlist");
      if (waitlistedRSVP) {
        waitlistedRSVP.status = "confirmed";

        try {
          const user = await User.findById(waitlistedRSVP.user);
          if (user) {
            await sendEmail({
              email: user.email,
              subject: "Spot Available - Event RSVP Confirmed",
              message: `
                <h1>Good News!</h1>
                <p>A spot has become available for:</p>
                <h2>${event.title}</h2>
                <p>Date: ${event.date.toDateString()}</p>
                <p>Time: ${event.time}</p>
                <p>Your RSVP is now confirmed!</p>
              `,
            });
          }
        } catch (emailError) {
          console.log("Email notification failed:", emailError);
        }
      }
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: "RSVP cancelled successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

const updateRSVPStatus = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    const rsvp = event.rsvps.id(req.params.rsvpId);

    if (!rsvp) {
      res.status(404);
      throw new Error("RSVP not found");
    }

    rsvp.status = req.body.status;

    if (req.body.status === "cancelled" && rsvp.status === "confirmed") {
      const waitlistedRSVP = event.rsvps.find((r) => r.status === "waitlist");
      if (waitlistedRSVP) {
        waitlistedRSVP.status = "confirmed";
      }
    }

    await event.save();

    try {
      const user = await User.findById(rsvp.user);
      if (user) {
        await sendEmail({
          email: user.email,
          subject: `RSVP Status Updated - ${event.title}`,
          message: `
            <h1>RSVP Status Update</h1>
            <p>Your RSVP status for ${event.title} has been updated to: ${rsvp.status}</p>
          `,
        });
      }
    } catch (emailError) {
      console.log("Email notification failed:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "RSVP status updated successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

const getEventAttendees = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("rsvps.user", "firstName lastName email phone")
      .select("rsvps title date");

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    const attendees = event.rsvps.map((rsvp) => ({
      user: rsvp.user,
      guestCount: rsvp.guestCount,
      specialRequests: rsvp.specialRequests,
      status: rsvp.status,
      rsvpDate: rsvp.rsvpDate,
    }));

    const stats = {
      totalRSVPs: event.rsvps.length,
      confirmed: event.rsvps.filter((r) => r.status === "confirmed").length,
      waitlisted: event.rsvps.filter((r) => r.status === "waitlist").length,
      cancelled: event.rsvps.filter((r) => r.status === "cancelled").length,
      totalGuests: event.rsvps
        .filter((r) => r.status === "confirmed")
        .reduce((sum, r) => sum + r.guestCount, 0),
    };

    res.status(200).json({
      success: true,
      stats,
      data: attendees,
    });
  } catch (error) {
    next(error);
  }
};

const updateEventStatus = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    event.status = req.body.status;
    event.updatedAt = Date.now();
    await event.save();

    res.status(200).json({
      success: true,
      message: `Event status updated to ${event.status}`,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

const getUpcomingEvents = async (req, res, next) => {
  try {
    const events = await Event.find({
      status: "upcoming",
      isPublic: true,
      date: { $gte: new Date() },
    })
      .sort("date")
      .limit(6)
      .populate("chef", "firstName lastName");

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

const getEventsByCategory = async (req, res, next) => {
  try {
    const events = await Event.find({
      category: req.params.category,
      isPublic: true,
      status: { $in: ["upcoming", "ongoing"] },
    })
      .sort("date")
      .populate("chef", "firstName lastName");

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export {
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
};
