const env = process.env.NODE_ENV || 'development';

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