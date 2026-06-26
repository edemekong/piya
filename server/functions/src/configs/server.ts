import cors = require("cors");

export const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
export const RATE_LIMIT_MAX = 200;

export const WHITELIST_URLS: Array<string> = [
  "dps.iso.apple.com",
  "http://localhost:3001",
];

export const CORSSettings = cors({
  origin: function (origin, callback) {
    if ((origin && WHITELIST_URLS.indexOf(origin) !== -1) || !origin) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
});
