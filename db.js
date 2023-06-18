const mongoose = require('mongoose');
const {credentials} = require('./config');
const {connectionString} = credentials.mongo;

const Contact = require('./models/contact');

if (!connectionString) {
  console.error('MongoDB connection string missing!');
  process.exit(1);
}

mongoose.connect(
    connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', err => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(1);
});

db.once('open', async () => {
  console.log('MongoDB connection successful.');
});


module.exports = {
  getDateLastSubmitted: async (name, email, phone) => {
    const contact = await Contact.findOne({ 'name' : name, 'email': email, 'phone': phone })

    if(contact == null) {
      return null;
    }

    return contact.lastSubmitted;
  },
  recordSubmission: async (name, email, phone) => {
    const result = await Contact.updateOne({ name: name, email: email, phone: phone }, { $set: { lastSubmitted: new Date() }}, { upsert: true });
  },
};
