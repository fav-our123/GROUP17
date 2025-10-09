import express from "express";
import { loginAdmin, registerAdmin, postAnnouncement } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
router.post("/announcement", postAnnouncement);

export default router;