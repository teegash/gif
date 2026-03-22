import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { config } from "../config";
import { demoWatchlistId, makeId, mockUsers, mockWatchlists } from "../data/mock-data";
import { prisma } from "../lib/prisma";
import { redisClient } from "../lib/redis";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const SESSION_TTL = 86400;

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  displayName: z.string().min(2).max(50).optional(),
});

function sanitizeUser(user: { id: string; email: string; displayName?: string | null }) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName || null,
  };
}

async function comparePassword(input: string, passwordHash: string) {
  if (passwordHash.startsWith("mock:")) {
    return passwordHash === `mock:${input}`;
  }
  return bcrypt.compare(input, passwordHash);
}

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { email, password, displayName } = parsed.data;
  const existing =
    config.mockMode || !prisma
      ? mockUsers.find((user) => user.email === email)
      : await prisma.user.findUnique({ where: { email } });

  if (existing) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = config.mockMode
    ? `mock:${password}`
    : await bcrypt.hash(password, config.bcryptRounds);

  const user =
    config.mockMode || !prisma
      ? (() => {
          const created = {
            id: makeId("user"),
            email,
            displayName: displayName || "New Trader",
            passwordHash,
            baseCurrency: "USD",
            timezone: "UTC",
          };
          mockUsers.push(created);
          mockWatchlists.push({
            id: makeId("watchlist"),
            userId: created.id,
            name: "My Watchlist",
            createdAt: new Date().toISOString(),
          });
          return created;
        })()
      : await prisma.user.create({
          data: { email, displayName, passwordHash },
        });

  const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: config.jwtExpiry,
  });
  await redisClient.setex(`session:${user.id}`, SESSION_TTL, token);

  res.status(201).json({ user: sanitizeUser(user), token });
});

router.post("/login", async (req, res) => {
  const parsed = z
    .object({
      email: z.string().email(),
      password: z.string().min(1),
    })
    .safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { email, password } = parsed.data;
  const user =
    config.mockMode || !prisma
      ? mockUsers.find((entry) => entry.email === email)
      : await prisma.user.findUnique({ where: { email } });

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: config.jwtExpiry,
  });
  await redisClient.setex(`session:${user.id}`, SESSION_TTL, token);

  res.json({
    user: sanitizeUser(user),
    token,
    demo: config.mockMode && user.id === "demo-user",
    defaultWatchlistId: config.mockMode && user.id === "demo-user" ? demoWatchlistId : undefined,
  });
});

router.post("/logout", authenticate, async (req, res) => {
  if (req.user) {
    await redisClient.del(`session:${req.user.id}`);
  }
  res.json({ message: "Logged out" });
});

router.get("/me", authenticate, async (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user =
    config.mockMode || !prisma
      ? mockUsers.find((entry) => entry.id === req.user?.id)
      : await prisma.user.findUnique({ where: { id: req.user.id } });

  res.json({ user: user ? sanitizeUser(user) : null });
});

export default router;
