import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import adminRoutes from "./routes/admin.js";
import announcementRoutes from "./routes/announcements.js";
import resultRoutes from "./routes/uploads.js";
import userRoutes from "./routes/user.js";

dotenv.config();
const app = express();

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // Serve uploaded PDFs

// === Test Route ===
app.get("/", (req, res) => {
  res.send("✅ FUTO Dept Server Running!");
});

// === Mount Routes ===
app.use("/admin", adminRoutes);                  // /admin/login, /admin/register
app.use("/api/announcements", announcementRoutes); // /api/announcements (GET, POST)
app.use("/api/results", resultRoutes);             // /api/results/pdf, /api/results/pdfs
app.use("/user", userRoutes);                      // /user/announcements, /user/results

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));