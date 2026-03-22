import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.middleware";
import { scoreNewsArticles } from "../services/sentiment.service";
import { getAssetDetail } from "../services/watchlist.service";

const router = Router();

router.use(authenticate);

router.get("/:symbol", async (req, res) => {
  const symbol = decodeURIComponent(req.params.symbol);
  const window = req.query.window === "7d" ? "7d" : "24h";
  const detail = await getAssetDetail(symbol, window);
  if (!detail) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }
  res.json(detail);
});

router.get("/:symbol/news", async (req, res) => {
  const symbol = decodeURIComponent(req.params.symbol);
  const windowHours = req.query.window === "168" ? 168 : 24;
  const articles = await scoreNewsArticles(symbol, windowHours as 24 | 168);
  res.json({ articles });
});

router.get("/:symbol/sentiment", async (req, res) => {
  const symbol = decodeURIComponent(req.params.symbol);
  const windowHours = req.query.window === "168" ? 168 : 24;
  const detail = await getAssetDetail(symbol, windowHours === 24 ? "24h" : "7d");
  if (!detail) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }
  res.json({ sentiment: detail.asset.sentimentSnapshot });
});

router.get("/:symbol/chart", async (req, res) => {
  const parsed = z.object({ window: z.enum(["24h", "7d"]).default("24h") }).safeParse({
    window: req.query.window,
  });

  const detail = await getAssetDetail(decodeURIComponent(req.params.symbol), parsed.success ? parsed.data.window : "24h");
  if (!detail) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }
  res.json({ chart: detail.chart });
});

export default router;
