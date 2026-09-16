import express from "express";
import { fetchAllNews } from "../services/newsService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const news = await fetchAllNews();
    res.json({ success: true, count: news.length, articles: news });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch news" });
  }
});

export default router;