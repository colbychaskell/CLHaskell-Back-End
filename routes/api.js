const db = require("../db");
const { credentials } = require("../config.js");
const emailService = require("../lib/email.js")(credentials);

exports.handleError = (err, req, res, next) => {
  console.error(err.stack);
  res.json({ success: false, message: err.message });
};

const sendMail = (name, email, phone, message, topic) => {
  const fromAddress =
    '"C.L. Haskell & Son Inc." <clhaskell@clhaskellelectric.com>';

  // Send confirmation email
  emailService.send(
    fromAddress,
    email,
    "C.L. Haskell & Son Inc. Contact Form",
    `Thanks for contacting us, ${name}! We will get back to you shortly.`
  );

  // Send email to us
  emailService.send(
    fromAddress,
    "clhaskell@clhaskellelectric.com",
    "New Contact Form Submission",
    `${topic} from ${name} (${email}, ${phone}): ${message}`
  );
};

exports.processContactForm = async (req, res, next) => {
  // Convert all text fields to strings
  const { name, email, phone, topic, message } = req.body;

  // Verify all required fields are present
  if (!name || !email || !phone || !topic || !message) {
    console.error("ERROR: Could not parse one or more required fields.");
    console.error(`Received: ${name} (${email}, ${phone}) ${topic}`);
    console.error(`Message: ${message}`);
    res.json({ error: "Error parsing one or more required fields" });
  }

  sendMail(name, email, phone, message, topic);

  try {
    // Update last submitted date for contact
    await db.recordSubmission(name, email, phone);
  } catch (err) {
    next(err);
  }

  res.json({ success: true });
};
