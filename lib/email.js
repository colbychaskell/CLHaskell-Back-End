const nodemailer = require('nodemailer');

module.exports = credentials => {
  const mailTransport = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: credentials.sendgrid.user,
      pass: credentials.sendgrid.pass,
    },
  });

  const from = '"C.L. Haskell & Son Inc." <clhaskell@clhaskellelectric.com>';
  const errorRecipient = 'chaskell35@gmail.com';

  return {
    send: (to, subj, body) => {
      mailTransport.sendMail({
        from,
        to,
        subject: subj,
        html: body,
        generateTextFromHtml: true,
      }, (err) => {
        if (err) console.error(`Unable to send email: ${err}`);
      });
    }
  };
}