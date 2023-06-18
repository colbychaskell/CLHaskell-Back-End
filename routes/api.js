const db = require('../db')
const {credentials} = require('../config.js');
const emailService = require('../lib/email.js')(credentials);

const sendMail = (name, email, message, topic) => {
  // Send confirmation email
  emailService.send(
      '"C.L. Haskell & Son Inc." <clhaskell@clhaskellelectric.com>', email,
      'C.L. Haskell & Son Inc. Contact Form',
      `Thanks for contacting us, ${name}! We will get back to you shortly.`);

  // Send email to us
  emailService.send(
      email, 'clhaskell@clhaskellelectric.com', 'C.L. Haskell & Son Inc. Contact Form',
      `${topic} from ${name} <${email}>: ${message}`);
};

exports.processContactForm = async (req, res, next) => {
  const {name, email, phone, topic, message, csrf} = req.body;

  console.log(`Received message from ${name} <${email}>: ${topic}`);
  console.log(message);
  console.log(`CSRF token: ${csrf}`)

  console.log('Checking for last submission date...');

  const lastSubmitted = await db.getDateLastSubmitted(name, email, phone)

  // Contact found, check last submitted date
  if (lastSubmitted) {
    console.log(`Last submitted: ${lastSubmitted}`);
    const now = new Date();
    const diff = now - lastSubmitted;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 1) {
      console.log('Last submission was less than 1 day ago.');
      res.status(500).send({
        success: false,
        message: 'You have already submitted a message today.'
      });
      return;
    }

    console.log('Last submission was more than 1 day ago.');
  }

  sendMail(name, email, message, topic);

  console.log('Recording submission...');

  try {
    // Update last submitted date for contact
    await db.recordSubmission(name, email, phone)
  } catch (err) {
    next(err);
  }

  res.json({success: true});
}
