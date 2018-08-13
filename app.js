const express = require('express');
const bodyParser = require('body-parser');

// Environment Variables
require('dotenv').config();

// Global app object
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// MongoDB Connection
require('./config/mongodb.js');

// Models
require('./models/product.js');
require('./models/customer.js');
require('./models/order.js');

// Passport
require('./config/passport.js');
require('passport');

// Routes
app.use('/api/v1', require('./routes'));

app.listen(process.env.APP_PORT);