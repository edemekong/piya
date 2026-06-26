import cors = require("cors");

export const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
export const RATE_LIMIT_MAX = 200;

export const WHITELIST_URLS: Array<string> = [
  "http://localhost:3001",
  "https://getpiyaapp.firebaseapp.com",
  "https://getpiyaapp.web.app",
  "https://dashboard.piya.store",
  "https://piya.store",
];

const getAllowedOrigins = () => {
  return new Set([...WHITELIST_URLS]);
};

export const CORSSettings = cors({
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();

    if ((origin && allowedOrigins.has(origin)) || !origin) {
      return callback(null, true);
    } else {
      console.error("Origin: ", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
});
