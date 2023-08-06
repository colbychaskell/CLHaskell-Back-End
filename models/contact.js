const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  lastSubmitted: Date,
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
