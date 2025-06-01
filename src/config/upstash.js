import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit';
import 'dotenv/config';

// Initialize Upstash Redis and Ratelimit
let ratelimit;
export const getRatelimit = () => {
    if(!ratelimit) {
        ratelimit = new Ratelimit({
            redis: Redis.fromEnv(),
            limiter: Ratelimit.slidingWindow(100, '60 s'), // 10 requests per 10 seconds
        });
    }
    return ratelimit;
}