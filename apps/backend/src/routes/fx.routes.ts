import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.middleware";
import { convertFxAmount, getFxLatestRates, getFxTimeSeries } from "../adapters/frankfurter.adapter";

const router = Router();

router.use(authenticate);

router.get("/latest", async (req, res) => {
  const parsed = z
    .object({
      base: z.string().min(3).max(3),
      symbols: z.string().optional(),
    })
    .safeParse({
      base: req.query.base,
      symbols: req.query.symbols,
    });

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const targets = (parsed.data.symbols || "USD,EUR,GBP,JPY")
    .split(",")
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);
  const rates = await getFxLatestRates(parsed.data.base.toUpperCase(), targets);

  if (!rates) {
    res.status(502).json({ error: "Unable to fetch FX rates" });
    return;
  }

  res.json(rates);
});

router.get("/convert", async (req, res) => {
  const parsed = z
    .object({
      amount: z.coerce.number().positive().default(1),
      from: z.string().min(3).max(3),
      to: z.string().min(3).max(3),
    })
    .safeParse({
      amount: req.query.amount,
      from: req.query.from,
      to: req.query.to,
    });

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const conversion = await convertFxAmount(
    parsed.data.amount,
    parsed.data.from.toUpperCase(),
    parsed.data.to.toUpperCase()
  );

  if (!conversion) {
    res.status(502).json({ error: "Unable to convert FX amount" });
    return;
  }

  res.json(conversion);
});

router.get("/timeseries", async (req, res) => {
  const parsed = z
    .object({
      from: z.string().min(3).max(3),
      to: z.string().min(3).max(3),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    })
    .safeParse({
      from: req.query.from,
      to: req.query.to,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    });

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const series = await getFxTimeSeries(
    parsed.data.from.toUpperCase(),
    parsed.data.to.toUpperCase(),
    parsed.data.startDate,
    parsed.data.endDate
  );

  if (!series) {
    res.status(502).json({ error: "Unable to fetch FX time series" });
    return;
  }

  res.json(series);
});

export default router;
