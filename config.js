const env = process.env.NODE_ENV || "development";

// Load environment variables from .env file if in development mode
if (env === "development") {
  require("dotenv").config();
}

// Load credentials from environment variables
const credentials = {
  sendgrid: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASS,
  },
  mongo: {
    connectionString: process.env.MONGO_CONNSTR,
  },
};

module.exports = { credentials };
