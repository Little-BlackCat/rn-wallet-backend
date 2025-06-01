import { getRatelimit } from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        // In a real world application, you might want to use a more dynamic key based on user ID or IP address
        const ratelimit = getRatelimit();
        if (!ratelimit) {
            return res.status(500).json({ message: "Rate limiter not initialized." });
        }
        const { success } = await ratelimit.limit(`${req.ip}`);

        if(!success) {
            return res.status(429).json({ message: "Too many requests, please try again later." });
        }

        next();
    } catch (error) {
        console.error("Rate limiter error:", error);
        next(error);
    }
}

export default rateLimiter;