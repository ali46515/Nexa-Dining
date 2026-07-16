import express from "express";
const router = express.Router();
import {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
} from "../controllers/auth.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import {
  validateRegistration,
  validateLogin,
} from "../middlewares/validate.middleware.js";

// Public routes
router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.post("/refreshtoken", refreshToken);

router.use(auth);

router.get("/me", getMe);
router.put("/updatedetails", updateDetails);
router.put("/updatepassword", updatePassword);
router.post("/logout", logout);

export default router;
