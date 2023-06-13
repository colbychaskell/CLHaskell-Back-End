const express = require('express');
const { credentials } = require('./config.js');
const emailService = require('./lib/email.js')(credentials);
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/api/contact',  (req, res) => {
  const { email, name, message, csrf } = req.body;

  console.log(`Received message from ${name} <${email}>`);
  console.log(message);
  console.log(`CSRF token: ${csrf}`)

  emailService.send(
    '"C.L. Haskell & Son Inc." <clhaskell@clhaskellelectric.com>',
    email,
    'C.L. Haskell & Son Inc. Contact Form',
    `Thanks for contacting us, ${name}! We will get back to you shortly.`
  );

  emailService.send(
    email,
    "chaskell35@gmail.com",
    'C.L. Haskell & Son Inc. Contact Form',
    `Message from ${name} <${email}>: ${message}`
  );

  res.json({ success: true });
});

function startServer(port) {
  app.listen(port, () => {
    console.log(
      `Express started in ${app.get("env")} mode on http://localhost:${port}` +
        "; press Ctrl-C to terminate."
    );
  });
}

// Allow this module to be exported or called directly
if (require.main == module) {
  startServer(process.env.PORT || 3033);
} else {
  module.exports = startServer;
}
