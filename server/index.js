require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const keys = require('./config/keys');
const routes = require('./routes');
const socket = require('./socket');
const setupDB = require('./utils/db');

const { port, host } = keys; // Use the 'host' from your keys configuration

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true
  })
);

app.use(express.static(path.resolve(__dirname, '../dist')));

setupDB();
require('./config/passport')(app);
app.use(routes);

console.log('process.env.NODE_ENV ', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
  });
}

const server = app.listen(port, host, () => { // Listen on both localhost and server IP
  console.log(
    `${chalk.green('✓')} ${chalk.blue(
      `Listening on ${host}:${port}. Visit http://${host}:${port}/ in your browser.`
    )}`
  );
});

socket(server);
