import { Router } from "express";
import { JournalAnalytics, TradeEntry } from "@sentiment-watchlist/shared-types";
import { z } from "zod";
import { config } from "../config";
import { makeId, mockTrades } from "../data/mock-data";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/auth.middleware";
import { computeSentimentForSymbol } from "../services/sentiment.service";

const router = Router();

const createTradeSchema = z.object({
  symbol: z.string().min(1),
  assetType: z.enum(["CRYPTO", "FOREX"]),
  direction: z.enum(["LONG", "SHORT"]),
  entryPrice: z.number().positive(),
  quantity: z.number().positive(),
  currency: z.string().default("USD"),
  entryAt: z.string().datetime(),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
  stopLoss: z.number().optional(),
  takeProfit: z.number().optional(),
});

function buildAnalytics(trades: TradeEntry[]): JournalAnalytics {
  const closedTrades = trades.filter((trade) => trade.status === "CLOSED");
  const pnlBySentimentBucket: Record<"positive" | "negative" | "neutral", number[]> = {
    positive: [],
    negative: [],
    neutral: [],
  };

  let wins = 0;
  let aligned = 0;

  for (const trade of closedTrades) {
    if ((trade.pnl ?? 0) > 0) wins += 1;

    const sentiment = trade.sentimentAtEntry ?? 0;
    const isAligned =
      (trade.direction === "LONG" && sentiment > 0.05) ||
      (trade.direction === "SHORT" && sentiment < -0.05);
    if (isAligned) aligned += 1;

    const bucket = trade.sentimentLabelEntry || "neutral";
    pnlBySentimentBucket[bucket].push(trade.pnlPercent ?? 0);
  }

  const allSentiments = trades
    .map((trade) => trade.sentimentAtEntry)
    .filter((value): value is number => typeof value === "number");

  const avgPnlBySentimentBucket = Object.fromEntries(
    Object.entries(pnlBySentimentBucket).map(([key, values]) => [
      key,
      values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0,
    ])
  ) as Record<"positive" | "negative" | "neutral", number>;

  return {
    totalTrades: trades.length,
    winRate: closedTrades.length ? (wins / closedTrades.length) * 100 : 0,
    avgPnl: closedTrades.length
      ? closedTrades.reduce((sum, trade) => sum + (trade.pnlPercent ?? 0), 0) / closedTrades.length
      : 0,
    sentimentAlignmentRate: closedTrades.length ? (aligned / closedTrades.length) * 100 : 0,
    bestSentimentScore: allSentiments.length ? Math.max(...allSentiments) : 0,
    worstSentimentScore: allSentiments.length ? Math.min(...allSentiments) : 0,
    pnlBySentimentBucket,
    avgPnlBySentimentBucket,
  };
}

router.use(authenticate);

router.get("/trades", async (req, res) => {
  const trades =
    config.mockMode || !prisma
      ? mockTrades.filter((trade) => trade.userId === req.user!.id)
      : await prisma.tradeEntry.findMany({
          where: { userId: req.user!.id },
          orderBy: { entryAt: "desc" },
        });

  res.json({ trades });
});

router.post("/trade", async (req, res) => {
  const parsed = createTradeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const currentSentiment = await computeSentimentForSymbol(parsed.data.symbol, 24);
  const baseTrade: TradeEntry = {
    id: makeId("trade"),
    userId: req.user!.id,
    symbol: parsed.data.symbol,
    assetType: parsed.data.assetType,
    direction: parsed.data.direction,
    entryPrice: parsed.data.entryPrice,
    exitPrice: null,
    quantity: parsed.data.quantity,
    currency: parsed.data.currency,
    entryAt: parsed.data.entryAt,
    exitAt: null,
    status: "OPEN",
    notes: parsed.data.notes || null,
    tags: parsed.data.tags,
    pnl: null,
    pnlPercent: null,
    riskRewardRatio: null,
    stopLoss: parsed.data.stopLoss ?? null,
    takeProfit: parsed.data.takeProfit ?? null,
    sentimentAtEntry: currentSentiment?.avgScore ?? null,
    sentimentLabelEntry: currentSentiment?.dominantLabel ?? null,
    articleCountEntry: currentSentiment?.articleCount ?? null,
    sentimentAtExit: null,
    sentimentLabelExit: null,
    divergenceFlagEntry: false,
    divergenceNoteEntry: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (config.mockMode || !prisma) {
    mockTrades.unshift(baseTrade);
    res.status(201).json(baseTrade);
    return;
  }

  const trade = await prisma.tradeEntry.create({
    data: {
      userId: baseTrade.userId,
      symbol: baseTrade.symbol,
      assetType: baseTrade.assetType,
      direction: baseTrade.direction,
      entryPrice: baseTrade.entryPrice,
      quantity: baseTrade.quantity,
      currency: baseTrade.currency,
      entryAt: new Date(baseTrade.entryAt),
      notes: baseTrade.notes || undefined,
      tags: baseTrade.tags,
      stopLoss: baseTrade.stopLoss || undefined,
      takeProfit: baseTrade.takeProfit || undefined,
      status: "OPEN",
      sentimentAtEntry: baseTrade.sentimentAtEntry,
      sentimentLabelEntry: baseTrade.sentimentLabelEntry,
      articleCountEntry: baseTrade.articleCountEntry,
    },
  });

  res.status(201).json(trade);
});

router.patch("/trade/:id/close", async (req, res) => {
  const parsed = z
    .object({
      exitPrice: z.number().positive(),
      exitAt: z.string().datetime(),
    })
    .safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const trade =
    config.mockMode || !prisma
      ? mockTrades.find((entry) => entry.id === req.params.id && entry.userId === req.user!.id)
      : await prisma.tradeEntry.findFirst({
          where: { id: req.params.id, userId: req.user!.id },
        });

  if (!trade) {
    res.status(404).json({ error: "Trade not found" });
    return;
  }

  if (trade.status === "CLOSED") {
    res.status(400).json({ error: "Trade already closed" });
    return;
  }

  const { exitPrice, exitAt } = parsed.data;
  const pnlRaw =
    trade.direction === "LONG"
      ? (exitPrice - trade.entryPrice) * trade.quantity
      : (trade.entryPrice - exitPrice) * trade.quantity;
  const pnlPercent =
    (((exitPrice - trade.entryPrice) / trade.entryPrice) * 100) *
    (trade.direction === "SHORT" ? -1 : 1);
  const exitSentiment = await computeSentimentForSymbol(trade.symbol, 24);

  if (config.mockMode || !prisma) {
    trade.exitPrice = exitPrice;
    trade.exitAt = exitAt;
    trade.status = "CLOSED";
    trade.pnl = pnlRaw;
    trade.pnlPercent = pnlPercent;
    trade.sentimentAtExit = exitSentiment?.avgScore ?? null;
    trade.sentimentLabelExit = exitSentiment?.dominantLabel ?? null;
    trade.updatedAt = new Date().toISOString();
    res.json(trade);
    return;
  }

  const updated = await prisma.tradeEntry.update({
    where: { id: req.params.id },
    data: {
      exitPrice,
      exitAt: new Date(exitAt),
      status: "CLOSED",
      pnl: pnlRaw,
      pnlPercent,
      sentimentAtExit: exitSentiment?.avgScore ?? null,
      sentimentLabelExit: exitSentiment?.dominantLabel ?? null,
    },
  });

  res.json(updated);
});

router.get("/analytics", async (req, res) => {
  const trades =
    config.mockMode || !prisma
      ? mockTrades.filter((trade) => trade.userId === req.user!.id)
      : await prisma.tradeEntry.findMany({
          where: { userId: req.user!.id },
          orderBy: { entryAt: "asc" },
        });

  res.json(buildAnalytics(trades as TradeEntry[]));
});

export default router;

