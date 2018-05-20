var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose  = require('mongoose');
var auth = require('./middlewares/auth');
var config = require('./config');
var jwt = require('jwt-simple');
var router = express.Router();
var users = require('./routes/users');

var app = express();

mongoose.connect(config.MONGODB_URI,
    { useMongoClient: true });
mongoose.Promise = global.Promise;

app.use(path);
app.use(mongoose);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride);
app.use(auth);

app.use(router);
app.use('/api/v1/users', users);
/**
 * se puede comentar nodeJS con javadoc???
 */
app.listen(3000, function () {
    console.log("Node server running on http://localhost:3000");
});
/**
 *
 * @type {*|Function}
 */
module.exports = app;
