'use strict';

require('dotenv').config('../.env');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const errorHandler = require('../lib/middleware/500');
const notFoundHandler = require('../lib/middleware/404');

const apiRouter = require('./routes/routes');
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));


app.use('/docs', express.static('docs'));
app.use(apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
/** 
 * @module server
*/
module.exports = {
  server: app,
  start: port => {
    let PORT = port || process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  },
};
