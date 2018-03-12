var mongoose = require('mongoose');
Schema = mongoose.Schema;

var customerSchema = new Schema({
    name: {type: String},
    surname: {type: String},
    code: {type: Number},
    phone: {type: String},
    email:{type: String},

});

module.exports('Customer', customerSchema);