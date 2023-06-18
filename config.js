const env = process.env.NODE_ENV || 'development';
const credentials = {
  sendgrid: {
    user: process.env.CUSTOMCONNSTR_SENDGRID_USER,
    pass: process.env.CUSTOMCONNSTR_SENDGRID_PASS,
  },
  mongo: {
    connectionString: process.env.CUSTOMCONNSTR_MONGO_CONNECTION_STRING,
  },
};

module.exports = { credentials };