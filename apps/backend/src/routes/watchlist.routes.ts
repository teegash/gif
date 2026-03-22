import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.middleware";
import { addWatchlistAsset, getWatchlistAssets, removeWatchlistAsset, searchAssets } from "../services/watchlist.service";

const router = Router();

router.use(authenticate);

router.get("/", async (req, res) => {
  const assets = await getWatchlistAssets(req.user!.id);
  res.json({ assets });
});

router.get("/search", async (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q : "";
  const results = await searchAssets(query);
  res.json({ results });
});

router.post("/assets", async (req, res) => {
  const parsed = z
    .object({
      symbol: z.string().min(1),
      assetType: z.enum(["CRYPTO", "FOREX"]),
      displayName: z.string().min(1),
      coinGeckoId: z.string().optional(),
    })
    .safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const created = await addWatchlistAsset(req.user!.id, parsed.data);
  res.status(201).json({ asset: created });
});

router.delete("/assets/:id", async (req, res) => {
  const removed = await removeWatchlistAsset(req.user!.id, req.params.id);
  if (!removed) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }
  res.json({ success: true });
});

export default router;

