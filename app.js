const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();

const env = process.env.NODE_ENV || 'dev';
const config = require('./config.json')[env];
const app = express();

mongoose
  .connect(config.mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log('Database Connected')
  })
  .catch((error) => {
    console.log('thenBlockError', error)
  });

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json());
app.use(cors());

app.use('/api/user', require('./src/routes/userRoute'));
app.use('/api/key', require('./src/routes/keysRoute'));

app.use((err, req, res, next) => {
  res.json({ error: err.message });
  next();
});

app.listen(config.serverPort, () =>
  console.log('Server running on ' + config.serverPort)
);