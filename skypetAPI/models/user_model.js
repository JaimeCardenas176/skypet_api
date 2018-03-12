var mongoose = require('mongoose');
Schema = mongoose.Schema;

var userShecma = new Schema({

    name: {type: String},
    surname: {type: String},
    email: {type: String},

});

module.exports = mongoose.model('CompanyUser', userShecma);