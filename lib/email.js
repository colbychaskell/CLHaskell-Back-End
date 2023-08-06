const nodemailer = require("nodemailer");

module.exports = (credentials) => {
  const mailTransport = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: credentials.sendgrid.user,
      pass: credentials.sendgrid.pass,
    },
  });

  const from = '"C.L. Haskell & Son Inc." <clhaskell@clhaskellelectric.com>';
  const errorRecipient = "clhaskell@clhaskellelectric.com";

  // Default to dev environment
  const env = process.env.NODE_ENV || "development";

  // If we're in dev mode, don't actually send emails
  if (env === "development") {
    return {
      send: (from, to, subj, body) => {
        console.log(`Sending email to ${to}`);
      },
    };
  }

  return {
    send: (from, to, subj, body) => {
      mailTransport.sendMail(
        {
          from: from,
          to: to,
          subject: subj,
          html: body,
          generateTextFromHtml: true,
        },
        (err) => {
          if (err) console.error(`Unable to send email: ${err}`);
        }
      );
    },
  };
};
