const mongoose = require('mongoose');
const port = 3000;

mongoose.Promise = global.Promise;

module.exports = mongoose;