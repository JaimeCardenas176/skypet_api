const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');
const config = require('./config');
const jwt = require('jwt-simple');
const cors = require('cors');
const expressfileupload = require('express-fileupload');


let users = require('./routes/users');
let pets = require('./routes/pets');

mongoose.connect(config.MONGODB_URI);
mongoose.Promise = global.Promise;

var app = express();

app.use(cors());
//app.use(path);
//app.use(mongoose);
app.use(expressfileupload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/users', users);
app.use('/pets',pets);
/**
 * se puede comentar nodeJS con javadoc???
 */
app.listen(33000, function () {
    console.log("Node server running on http://localhost:33000");
});
/**
 *
 * @type {*|Function}
 */
module.exports = app;
