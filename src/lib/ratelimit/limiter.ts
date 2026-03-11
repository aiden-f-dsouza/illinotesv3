import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

function makeRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

const redis = makeRedis()

function makeLimiter(requests: number, window: string) {
  if (!redis) return null
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window as any),
    analytics: false,
  })
}

export const chatLimiter = makeLimiter(30, "1 d")     // 30/day per userId
export const loginLimiter = makeLimiter(10, "1 m")    // 10/min per IP
export const signupLimiter = makeLimiter(5, "1 h")    // 5/hour per IP
export const forgotLimiter = makeLimiter(3, "1 h")    // 3/hour per IP

export async function checkLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; reset?: number }> {
  if (!limiter) return { success: true }
  const result = await limiter.limit(identifier)
  return { success: result.success, reset: result.reset }
}
