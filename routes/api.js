const db = require('../db')
const {credentials} = require('../config.js');
const emailService = require('../lib/email.js')(credentials);

exports.handleError = (err, req, res, next) => {
  console.error(err.stack);
  res.json({success: false, message: err.message});
};

const sendMail = (name, email, phone, message, topic) => {
  const fromAddress = '"C.L. Haskell & Son Inc." <clhaskell@clhaskellelectric.com>'

  // Send confirmation email
  emailService.send(
      fromAddress, email,
      'C.L. Haskell & Son Inc. Contact Form',
      `Thanks for contacting us, ${name}! We will get back to you shortly.`);

  // Send email to us
  emailService.send(
      fromAddress, 'clhaskell@clhaskellelectric.com', 'New Contact Form Submission',
      `${topic} from ${name} <${email}, ${phone}>: ${message}`);
};

exports.processContactForm = async (req, res, next) => {
  const {name, email, phone, topic, message, csrf} = req.body;

  console.log(`Received message from ${name} <${email}>: ${topic}`);
  console.log(message);
  console.log(`CSRF token: ${csrf}`)

  sendMail(name, email, phone, message, topic);

  console.log('Recording submission...');

  if(!name || !email || !phone || !topic || !message || !csrf) {
    res.json({error: 'Missing required fields'});
  }

  try {
    // Update last submitted date for contact
    await db.recordSubmission(name, email, phone)
  } catch (err) {
    next(err);
  }

  res.json({success: true});
}
