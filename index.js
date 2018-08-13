const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config.js');

var app = express();

var router = require('./services/router');

if (process.env.NODE_ENV == 'production') {
  mongoose.connect(process.env.MONGO_URL);
} else {
  mongoose.connect(config.mongo_url);
}

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/v1', router);
app.locals.pretty = true;


var PORT = process.env.PORT || 3000;

console.log('Listening on', PORT);
app.listen(PORT);

module.exports = app;
