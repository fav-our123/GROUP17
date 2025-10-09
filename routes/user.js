import express from "express";
import { getAnnouncements, getResults } from "../controllers/userController.js";

const router = express.Router();

router.get("/announcements", getAnnouncements);
router.get("/results", getResults);

export default router;
