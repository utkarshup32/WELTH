import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "WELTH", // Unique app ID
  name: "WELTH",
  retryFunction: async (attempt) => ({
    delay: Math.pow(2, attempt) * 1000, // Exponential backoff
    maxAttempts: 2,
  }),
});
