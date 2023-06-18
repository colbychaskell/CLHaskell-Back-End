const express = require('express');
const {credentials} = require('./config.js');
const cors = require('cors')
const emailService = require('./lib/email.js')(credentials);
const bodyParser = require('body-parser');
require('./db')
const api = require('./routes/api.js');

const app = express();

app.use(bodyParser.json());
app.use(cors())

app.post('/api/contact', api.processContactForm);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error!');
});

function startServer(port) {
  app.listen(port, () => {
    console.log(
        `Express started in ${app.get('env')} mode on http://localhost:${
            port}` +
        '; press Ctrl-C to terminate.');
  });
}

// Allow this module to be exported or called directly
if (require.main == module) {
  startServer(process.env.PORT || 443);
} else {
  module.exports = startServer;
}
