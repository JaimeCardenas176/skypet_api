var mongoose = require('mongoose');
Schema = mongoose.Schema;

const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

const customerSchema = new Schema({
    name: {type: String},
    surname: {type: String},
    phone: {type: String},
    email:{type: String},
    direccion: {type:String}
    macotas: [{type: schema.ObjectId , reference:'Mascota'}]

});

customerSchema.pre('save', function (next) {
    let customer = this;
    if(customer.isModified('email')){
        const md5 = crypto
            .createHash('md5')
            .update(customer.email)
            .digest('hex');
        customer.avatar = `https://gravatar.com/avatar/${md5}?s=200&d=retro`
    }

    if (!customer.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {

        if (err) return next();

        bcrypt.hash(customer.password, salt, null, (err, hash) => {

            if (err) return next();

            customer.password = hash;
            next();

        });

    })
});

module.exports = mongoose.model('Customer', customerSchema);