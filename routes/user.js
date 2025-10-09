import express from "express";
import { getAnnouncements, getResults } from "../controllers/userController.js";

const router = express.Router();

// 📰 Public: Fetch all announcements
router.get("/announcements", async (req, res, next) => {
  try {
    await getAnnouncements(req, res);
  } catch (err) {
    console.error("Error in /user/announcements:", err);
    next(err);
  }
});

// 📂 Public: Fetch all results
router.get("/results", async (req, res, next) => {
  try {
    await getResults(req, res);
  } catch (err) {
    console.error("Error in /user/results:", err);
    next(err);
  }
});

export default router;