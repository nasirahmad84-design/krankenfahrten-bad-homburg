type RateLimitResult = Readonly<{ allowed: boolean; retryAfterSeconds?: number }>;

export interface RateLimitStore {
  check(key: string, now?: number): RateLimitResult;
}

export class InMemoryRateLimitStore implements RateLimitStore {
  private readonly attempts = new Map<string, number[]>();

  constructor(private readonly limit = 10, private readonly windowMs = 10 * 60_000) {}

  check(key: string, now = Date.now()): RateLimitResult {
    const cutoff = now - this.windowMs;
    const recent = (this.attempts.get(key) ?? []).filter((timestamp) => timestamp > cutoff);
    if (recent.length >= this.limit) {
      this.attempts.set(key, recent);
      return { allowed: false, retryAfterSeconds: Math.ceil((recent[0] + this.windowMs - now) / 1000) };
    }
    recent.push(now);
    this.attempts.set(key, recent);
    return { allowed: true };
  }
}

export const rideRequestRateLimit = new InMemoryRateLimitStore();
