import Redis from "ioredis";
import { config } from "../config";

class InMemoryRedis {
  private store = new Map<string, string>();
  private expiries = new Map<string, number>();

  private prune(key: string) {
    const expiry = this.expiries.get(key);
    if (expiry && expiry <= Date.now()) {
      this.store.delete(key);
      this.expiries.delete(key);
    }
  }

  async get(key: string) {
    this.prune(key);
    return this.store.get(key) ?? null;
  }

  async setex(key: string, ttlSeconds: number, value: string) {
    this.store.set(key, value);
    this.expiries.set(key, Date.now() + ttlSeconds * 1000);
    return "OK";
  }

  async exists(key: string) {
    this.prune(key);
    return this.store.has(key) ? 1 : 0;
  }

  async incr(key: string) {
    const current = Number((await this.get(key)) || "0") + 1;
    this.store.set(key, String(current));
    return current;
  }

  async del(key: string) {
    const existed = this.store.delete(key);
    this.expiries.delete(key);
    return existed ? 1 : 0;
  }

  async ping() {
    return "PONG";
  }
}

export const redisClient = config.mockMode
  ? (new InMemoryRedis() as unknown as Redis)
  : new Redis(config.redisUrl, { maxRetriesPerRequest: 1 });

