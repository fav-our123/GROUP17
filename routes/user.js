import express from "express";
import { getAnnouncements, getResults } from "../controllers/usercontroller.js";

const router = express.Router();

// 📰 Public: Fetch all announcements
router.get("/announcements", getAnnouncements);

// 📂 Public: Fetch all results
router.get("/results", getResults);

export default router;