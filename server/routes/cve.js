import express from "express";
import { fetchRecentCves } from "../services/cveService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const vulnerabilities = await fetchRecentCves();
    res.json({ success: true, count: vulnerabilities.length, vulnerabilities });
  } catch (error) {
    console.error("CVE fetch error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch CVE data" });
  }
});

export default router;