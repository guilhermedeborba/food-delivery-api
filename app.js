const express = require('express');
const bodyParser = require('body-parser');

// Global app object
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// Environment Variables
require('dotenv').config();

// MongoDB Connection
require('./config/mongodb.js');

// Models
require('./models/Order.js');
require('./models/Customer.js');
require('./models/Product.js');

// Routes
app.use('/api', require('./routes'));


// const productsRouter = require('./src/routes/products.js');
// app.use('/api/products/', productsRouter);

app.listen(process.env.APP_PORT);