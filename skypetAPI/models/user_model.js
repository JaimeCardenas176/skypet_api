var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

const userShecma = new Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String, unique: true},
    phone: {type: String, unique: true},
    is_admin: {type: Boolean, required: true}

});

userShecma.pre('save', function (next) {
    let user = this;
    if(user.isModified('email')){
        const md5 = crypto
            .createHash('md5')
            .update(user.email)
            .digest('hex');
        user.avatar = `https://gravatar.com/avatar/${md5}?s=200&d=retro`
    }

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {

        if (err) return next();

        bcrypt.hash(user.password, salt, null, (err, hash) => {

            if (err) return next();

            user.password = hash;
            next();

        });

    })
});

module.exports = mongoose.model('User', userShecma);