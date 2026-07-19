import Reservation from "../models/reservation.model.js";
import User from "../models/user.model.js";
import sendEmail from "../services/email.service.js";

const checkAvailability = async (req, res, next) => {
  try {
    const { date, time, guestCount } = req.query;

    if (!date || !time || !guestCount) {
      res.status(400);
      throw new Error("Please provide date, time, and guestCount");
    }

    const reservationDate = new Date(date);

    if (reservationDate < new Date().setHours(0, 0, 0, 0)) {
      res.status(400);
      throw new Error("Reservation date must be in the future");
    }

    const validTimeSlots = [
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
    ];

    if (!validTimeSlots.includes(time)) {
      res.status(400);
      throw new Error("Invalid time slot");
    }

    const existingReservations = await Reservation.find({
      date: {
        $gte: new Date(reservationDate.setHours(0, 0, 0, 0)),
        $lt: new Date(reservationDate.setHours(23, 59, 59, 999)),
      },
      time: time,
      status: { $in: ["pending", "confirmed"] },
    });

    const totalReservedGuests = existingReservations.reduce(
      (sum, reservation) => sum + reservation.guestCount,
      0,
    );

    const MAX_CAPACITY = process.env.MAX_RESTAURANT_CAPACITY || 80;
    const remainingCapacity = MAX_CAPACITY - totalReservedGuests;

    const tableConfigs = {
      small: { min: 1, max: 2, capacity: 2 },
      medium: { min: 3, max: 4, capacity: 4 },
      large: { min: 5, max: 8, capacity: 8 },
      party: { min: 9, max: 20, capacity: 20 },
    };

    let suitableTable = null;
    if (guestCount <= 2) suitableTable = "small";
    else if (guestCount <= 4) suitableTable = "medium";
    else if (guestCount <= 8) suitableTable = "large";
    else if (guestCount <= 20) suitableTable = "party";

    const isAvailable =
      remainingCapacity >= guestCount && suitableTable !== null;

    res.status(200).json({
      success: true,
      data: {
        isAvailable,
        remainingCapacity,
        totalReservedGuests,
        maxCapacity: MAX_CAPACITY,
        suggestedTable: suitableTable,
        message: isAvailable
          ? "Table available for the requested time slot"
          : "No tables available for this time slot",
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAvailableTimeSlots = async (req, res, next) => {
  try {
    const { date, guestCount } = req.query;

    if (!date || !guestCount) {
      res.status(400);
      throw new Error("Please provide date and guestCount");
    }

    const reservationDate = new Date(date);

    if (reservationDate < new Date().setHours(0, 0, 0, 0)) {
      res.status(400);
      throw new Error("Reservation date must be in the future");
    }

    const allTimeSlots = [
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
    ];

    const MAX_CAPACITY = process.env.MAX_RESTAURANT_CAPACITY || 80;

    const existingReservations = await Reservation.find({
      date: {
        $gte: new Date(reservationDate.setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(reservationDate).setHours(23, 59, 59, 999)),
      },
      status: { $in: ["pending", "confirmed"] },
    });

    const availableSlots = await Promise.all(
      allTimeSlots.map(async (time) => {
        const reservationsAtTime = existingReservations.filter(
          (r) => r.time === time,
        );
        const reservedGuests = reservationsAtTime.reduce(
          (sum, reservation) => sum + reservation.guestCount,
          0,
        );

        const isAvailable =
          reservedGuests + parseInt(guestCount) <= MAX_CAPACITY;

        return {
          time,
          isAvailable,
          reservedGuests,
          remainingCapacity: MAX_CAPACITY - reservedGuests,
        };
      }),
    );

    res.status(200).json({
      success: true,
      data: {
        date: reservationDate,
        requestedGuests: parseInt(guestCount),
        maxCapacity: MAX_CAPACITY,
        timeSlots: availableSlots,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createReservation = async (req, res, next) => {
  try {
    const {
      date,
      time,
      guestCount,
      occasion,
      specialRequests,
      dietaryRestrictions,
    } = req.body;

    const reservationDate = new Date(date);
    if (reservationDate < new Date().setHours(0, 0, 0, 0)) {
      res.status(400);
      throw new Error("Reservation date must be in the future");
    }

    const maxFutureDate = new Date();
    maxFutureDate.setMonth(maxFutureDate.getMonth() + 3);
    if (reservationDate > maxFutureDate) {
      res.status(400);
      throw new Error(
        "Reservations can only be made up to 3 months in advance",
      );
    }

    const validTimeSlots = [
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
    ];

    if (!validTimeSlots.includes(time)) {
      res.status(400);
      throw new Error("Invalid time slot");
    }

    const MAX_CAPACITY = process.env.MAX_RESTAURANT_CAPACITY || 80;
    const existingReservations = await Reservation.find({
      date: {
        $gte: new Date(reservationDate.setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
      },
      time: time,
      status: { $in: ["pending", "confirmed"] },
    });

    const totalReservedGuests = existingReservations.reduce(
      (sum, reservation) => sum + reservation.guestCount,
      0,
    );

    if (totalReservedGuests + guestCount > MAX_CAPACITY) {
      res.status(400);
      throw new Error(
        "Sorry, no tables available for this time slot. Please choose another time.",
      );
    }

    const existingUserReservation = await Reservation.findOne({
      user: req.user.id,
      date: {
        $gte: new Date(reservationDate.setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
      },
      time: time,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingUserReservation) {
      res.status(400);
      throw new Error("You already have a reservation for this time slot");
    }

    const user = await User.findById(req.user.id);

    const reservation = await Reservation.create({
      user: req.user.id,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: req.body.phone || user.phone,
      date: new Date(date),
      time,
      guestCount,
      occasion: occasion || "none",
      specialRequests: specialRequests || "",
      dietaryRestrictions: dietaryRestrictions || "",
      status: "pending",
    });
    if (totalReservedGuests + guestCount <= MAX_CAPACITY * 0.8) {
      reservation.status = "confirmed";
      await reservation.save();
    }

    try {
      const emailSubject =
        reservation.status === "confirmed"
          ? "Reservation Confirmed"
          : "Reservation Received - Pending Confirmation";

      const emailMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">${reservation.status === "confirmed" ? "Reservation Confirmed!" : "Reservation Received"}</h1>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #666;">Reservation Details</h2>
            <p><strong>Name:</strong> ${reservation.fullName}</p>
            <p><strong>Date:</strong> ${new Date(
              reservation.date,
            ).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
            <p><strong>Time:</strong> ${reservation.time}</p>
            <p><strong>Guests:</strong> ${reservation.guestCount}</p>
            ${reservation.occasion !== "none" ? `<p><strong>Occasion:</strong> ${reservation.occasion}</p>` : ""}
            ${reservation.specialRequests ? `<p><strong>Special Requests:</strong> ${reservation.specialRequests}</p>` : ""}
            ${reservation.dietaryRestrictions ? `<p><strong>Dietary Restrictions:</strong> ${reservation.dietaryRestrictions}</p>` : ""}
          </div>
          
          ${
            reservation.status === "pending"
              ? '<p style="color: #856404; background-color: #fff3cd; padding: 10px; border-radius: 5px;">Your reservation is pending confirmation. We will notify you once it\'s confirmed.</p>'
              : '<p style="color: #155724; background-color: #d4edda; padding: 10px; border-radius: 5px;">Your reservation has been confirmed. We look forward to serving you!</p>'
          }
          
          <div style="margin-top: 30px; padding: 20px; border-top: 1px solid #eee;">
            <p><strong>Cancellation Policy:</strong> Please cancel at least 2 hours before your reservation time.</p>
            <p>If you need to modify or cancel your reservation, please contact us or use our online system.</p>
          </div>
        </div>
      `;

      await sendEmail({
        email: reservation.email,
        subject: emailSubject,
        message: emailMessage,
      });
    } catch (emailError) {
      console.log("Email notification failed:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message:
        reservation.status === "confirmed"
          ? "Reservation confirmed successfully!"
          : "Reservation created! Pending confirmation.",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

const getReservations = async (req, res, next) => {
  try {
    const reqQuery = { ...req.query };
    const removeFields = [
      "select",
      "sort",
      "page",
      "limit",
      "status",
      "date",
      "search",
    ];
    removeFields.forEach((param) => delete reqQuery[param]);

    let filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.date) {
      const date = new Date(req.query.date);
      filter.date = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(req.query.date).setHours(23, 59, 59, 999)),
      };
    }

    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate),
        $lt: new Date(req.query.endDate),
      };
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    let query = Reservation.find(filter).populate(
      "user",
      "firstName lastName email phone",
    );

    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort({ date: 1, time: 1 });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Reservation.countDocuments(filter);

    query = query.skip(startIndex).limit(limit);

    const reservations = await query;

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
      count: reservations.length,
      pagination,
      total,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

const getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate(
      "user",
      "firstName lastName email phone",
    );

    if (!reservation) {
      res.status(404);
      throw new Error("Reservation not found");
    }

    if (
      reservation.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      throw new Error("Not authorized to view this reservation");
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

const getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).sort({
      date: -1,
      time: -1,
    });

    const now = new Date();
    const upcoming = reservations.filter(
      (r) =>
        new Date(r.date) >= new Date(now.setHours(0, 0, 0, 0)) &&
        ["pending", "confirmed"].includes(r.status),
    );
    const past = reservations.filter(
      (r) =>
        new Date(r.date) < new Date(now.setHours(0, 0, 0, 0)) ||
        ["cancelled", "completed", "no-show"].includes(r.status),
    );

    res.status(200).json({
      success: true,
      data: {
        upcoming,
        past,
        all: reservations,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateReservation = async (req, res, next) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      res.status(404);
      throw new Error("Reservation not found");
    }

    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin" &&
      req.user.role !== "staff"
    ) {
      res.status(403);
      throw new Error("Not authorized to update this reservation");
    }

    if (
      req.user.role === "user" &&
      !["pending", "confirmed"].includes(reservation.status)
    ) {
      res.status(400);
      throw new Error("Can only update pending or confirmed reservations");
    }

    if (req.body.date) {
      const newDate = new Date(req.body.date);
      if (newDate < new Date().setHours(0, 0, 0, 0)) {
        res.status(400);
        throw new Error("Reservation date must be in the future");
      }
      req.body.date = newDate;
    }

    if (req.body.date || req.body.time || req.body.guestCount) {
      const checkDate = req.body.date || reservation.date;
      const checkTime = req.body.time || reservation.time;
      const checkGuests = req.body.guestCount || reservation.guestCount;

      const MAX_CAPACITY = process.env.MAX_RESTAURANT_CAPACITY || 80;
      const existingReservations = await Reservation.find({
        _id: { $ne: reservation._id },
        date: {
          $gte: new Date(new Date(checkDate).setHours(0, 0, 0, 0)),
          $lt: new Date(new Date(checkDate).setHours(23, 59, 59, 999)),
        },
        time: checkTime,
        status: { $in: ["pending", "confirmed"] },
      });

      const totalReservedGuests = existingReservations.reduce(
        (sum, res) => sum + res.guestCount,
        0,
      );

      if (totalReservedGuests + checkGuests > MAX_CAPACITY) {
        res.status(400);
        throw new Error(
          "Sorry, no tables available for the requested time slot",
        );
      }
    }

    req.body.updatedAt = Date.now();

    reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("user", "firstName lastName email phone");

    try {
      await sendEmail({
        email: reservation.email,
        subject: "Reservation Updated",
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Reservation Updated</h1>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
              <p><strong>New Date:</strong> ${new Date(reservation.date).toLocaleDateString()}</p>
              <p><strong>New Time:</strong> ${reservation.time}</p>
              <p><strong>Guests:</strong> ${reservation.guestCount}</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.log("Email notification failed:", emailError.message);
    }

    res.status(200).json({
      success: true,
      message: "Reservation updated successfully",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      res.status(404);
      throw new Error("Reservation not found");
    }

    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin" &&
      req.user.role !== "staff"
    ) {
      res.status(403);
      throw new Error("Not authorized to cancel this reservation");
    }

    if (!["pending", "confirmed"].includes(reservation.status)) {
      res.status(400);
      throw new Error("This reservation cannot be cancelled");
    }

    const reservationDateTime = new Date(reservation.date);
    const [hours, minutes] = reservation.time.split(":");
    reservationDateTime.setHours(parseInt(hours), parseInt(minutes), 0);

    const hoursUntilReservation =
      (reservationDateTime - new Date()) / (1000 * 60 * 60);

    if (hoursUntilReservation < 2 && req.user.role === "user") {
      res.status(400);
      throw new Error(
        "Cancellations must be made at least 2 hours before the reservation time",
      );
    }

    reservation.status = "cancelled";
    reservation.cancellationReason = req.body.reason || "Cancelled by user";
    reservation.updatedAt = Date.now();
    await reservation.save();

    try {
      await sendEmail({
        email: reservation.email,
        subject: "Reservation Cancelled",
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Reservation Cancelled</h1>
            <p>Your reservation for ${new Date(reservation.date).toLocaleDateString()} at ${reservation.time} has been cancelled.</p>
            ${reservation.cancellationReason ? `<p><strong>Reason:</strong> ${reservation.cancellationReason}</p>` : ""}
            <p>If you'd like to make a new reservation, please visit our website.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.log("Email notification failed:", emailError.message);
    }

    res.status(200).json({
      success: true,
      message: "Reservation cancelled successfully",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

const confirmReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      res.status(404);
      throw new Error("Reservation not found");
    }

    if (reservation.status !== "pending") {
      res.status(400);
      throw new Error("Only pending reservations can be confirmed");
    }

    reservation.status = "confirmed";
    reservation.updatedAt = Date.now();

    if (!reservation.tableAssignment) {
      const tableAssignment = await assignTable(reservation);
      if (tableAssignment) {
        reservation.tableAssignment = tableAssignment;
      }
    }

    await reservation.save();

    try {
      await sendEmail({
        email: reservation.email,
        subject: "Reservation Confirmed!",
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #28a745;">Reservation Confirmed!</h1>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
              <p><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${reservation.time}</p>
              <p><strong>Guests:</strong> ${reservation.guestCount}</p>
              ${
                reservation.tableAssignment
                  ? `
                <p><strong>Table:</strong> ${reservation.tableAssignment.tableNumber}</p>
                <p><strong>Section:</strong> ${reservation.tableAssignment.section}</p>
              `
                  : ""
              }
            </div>
            <p>We look forward to serving you!</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.log("Email notification failed:", emailError.message);
    }

    res.status(200).json({
      success: true,
      message: "Reservation confirmed successfully",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

const assignTable = async (req, res, next) => {
  try {
    let reservation;
    let tableData;

    if (req && req.params) {
      reservation = await Reservation.findById(req.params.id);
      if (!reservation) {
        res.status(404);
        throw new Error("Reservation not found");
      }
      tableData = {
        tableNumber: req.body.tableNumber,
        section: req.body.section,
      };
    } else {
      reservation = req;
      tableData = await autoAssignTable(reservation);
    }

    if (tableData) {
      reservation.tableAssignment = tableData;
      reservation.updatedAt = Date.now();
      await reservation.save();
    }

    if (req && req.params) {
      res.status(200).json({
        success: true,
        message: "Table assigned successfully",
        data: reservation,
      });
    } else {
      return tableData;
    }
  } catch (error) {
    if (req && req.params) {
      next(error);
    } else {
      return null;
    }
  }
};

const autoAssignTable = async (reservation) => {
  try {
    const existingReservations = await Reservation.find({
      date: {
        $gte: new Date(reservation.date.setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(reservation.date).setHours(23, 59, 59, 999)),
      },
      time: reservation.time,
      status: { $in: ["pending", "confirmed"] },
      _id: { $ne: reservation._id },
    });

    const tables = [
      { number: 1, section: "Main", capacity: 2 },
      { number: 2, section: "Main", capacity: 2 },
      { number: 3, section: "Main", capacity: 4 },
      { number: 4, section: "Main", capacity: 4 },
      { number: 5, section: "Window", capacity: 2 },
      { number: 6, section: "Window", capacity: 4 },
      { number: 7, section: "Window", capacity: 6 },
      { number: 8, section: "Patio", capacity: 4 },
      { number: 9, section: "Patio", capacity: 6 },
      { number: 10, section: "Private", capacity: 8 },
      { number: 11, section: "Private", capacity: 10 },
      { number: 12, section: "Private", capacity: 20 },
    ];

    const assignedTables = existingReservations
      .filter((r) => r.tableAssignment)
      .map((r) => r.tableAssignment.tableNumber);

    const availableTable = tables.find(
      (table) =>
        !assignedTables.includes(table.number) &&
        table.capacity >= reservation.guestCount,
    );

    if (availableTable) {
      return {
        tableNumber: availableTable.number,
        section: availableTable.section,
      };
    }

    return null;
  } catch (error) {
    console.log("Auto table assignment failed:", error);
    return null;
  }
};

const completeReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      res.status(404);
      throw new Error("Reservation not found");
    }

    if (reservation.status !== "confirmed") {
      res.status(400);
      throw new Error("Only confirmed reservations can be marked as completed");
    }

    reservation.status = "completed";
    reservation.updatedAt = Date.now();
    await reservation.save();

    res.status(200).json({
      success: true,
      message: "Reservation marked as completed",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

const markNoShow = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      res.status(404);
      throw new Error("Reservation not found");
    }

    if (reservation.status !== "confirmed") {
      res.status(400);
      throw new Error("Only confirmed reservations can be marked as no-show");
    }

    reservation.status = "no-show";
    reservation.updatedAt = Date.now();
    await reservation.save();

    res.status(200).json({
      success: true,
      message: "Reservation marked as no-show",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

const getReservationStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayReservations = await Reservation.find({
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    const todayStats = {
      total: todayReservations.length,
      confirmed: todayReservations.filter((r) => r.status === "confirmed")
        .length,
      pending: todayReservations.filter((r) => r.status === "pending").length,
      completed: todayReservations.filter((r) => r.status === "completed")
        .length,
      cancelled: todayReservations.filter((r) => r.status === "cancelled")
        .length,
      noShow: todayReservations.filter((r) => r.status === "no-show").length,
      totalGuests: todayReservations
        .filter((r) => ["confirmed", "completed"].includes(r.status))
        .reduce((sum, r) => sum + r.guestCount, 0),
    };

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const weeklyReservations = await Reservation.find({
      date: {
        $gte: weekStart,
        $lt: tomorrow,
      },
    });

    const weeklyStats = {
      total: weeklyReservations.length,
      confirmed: weeklyReservations.filter((r) => r.status === "confirmed")
        .length,
      completed: weeklyReservations.filter((r) => r.status === "completed")
        .length,
      cancelled: weeklyReservations.filter((r) => r.status === "cancelled")
        .length,
      totalGuests: weeklyReservations
        .filter((r) => ["confirmed", "completed"].includes(r.status))
        .reduce((sum, r) => sum + r.guestCount, 0),
    };

    const timeSlotStats = {};
    weeklyReservations.forEach((r) => {
      if (!timeSlotStats[r.time]) {
        timeSlotStats[r.time] = 0;
      }
      timeSlotStats[r.time]++;
    });

    const popularTimes = Object.entries(timeSlotStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([time, count]) => ({ time, count }));

    res.status(200).json({
      success: true,
      data: {
        today: todayStats,
        weekly: weeklyStats,
        popularTimes,
      },
    });
  } catch (error) {
    next(error);
  }
};

const sendReminders = async (req, res, next) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const reservations = await Reservation.find({
      date: {
        $gte: tomorrow,
        $lt: dayAfterTomorrow,
      },
      status: "confirmed",
      reminderSent: false,
    });

    let remindersSent = 0;

    for (const reservation of reservations) {
      try {
        await sendEmail({
          email: reservation.email,
          subject: "Reminder: Your Reservation Tomorrow",
          message: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1>Reservation Reminder</h1>
              <p>This is a reminder of your reservation tomorrow:</p>
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                <p><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${reservation.time}</p>
                <p><strong>Guests:</strong> ${reservation.guestCount}</p>
                ${
                  reservation.tableAssignment
                    ? `
                  <p><strong>Table:</strong> ${reservation.tableAssignment.tableNumber}</p>
                  <p><strong>Section:</strong> ${reservation.tableAssignment.section}</p>
                `
                    : ""
                }
              </div>
              <p>We look forward to serving you!</p>
              <p style="color: #666; font-size: 0.9em;">To cancel or modify your reservation, please contact us.</p>
            </div>
          `,
        });

        reservation.reminderSent = true;
        await reservation.save();
        remindersSent++;
      } catch (error) {
        console.log(
          `Failed to send reminder for reservation ${reservation._id}:`,
          error,
        );
      }
    }

    res.status(200).json({
      success: true,
      message: `Reminders sent successfully`,
      data: {
        totalReservations: reservations.length,
        remindersSent,
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
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
};
