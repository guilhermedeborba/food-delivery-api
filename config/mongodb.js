const mongoose = require('mongoose');
const dbPath = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;

mongoose.connect(dbPath);

module.exports = mongoose.connection;