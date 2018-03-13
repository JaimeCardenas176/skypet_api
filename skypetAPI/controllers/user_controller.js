const bcrypt = require('bcrypt-nodejs');
const service = require('../services');
const User = require('../models/user_model');

//POST Registro y adición de usuarios
module.exports.register = (req, res) => {

    let user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        phone: req.body.phone,
        is_admin:req.body.is_admin
    });

    user.save((err, result) => {
        if(err)
            return res
                .status(500)
                .jsonp({
                    error: 500,
                    message:`${err.message}`
                });
        return res
            .status(201)
            .jsonp({
                id: result._id,
                name: result.name,
                surname: result.surname,
                email: result.email,
                password: result.password,
                address: result.address,
                phone: result.phone,
                is_admin:result.is_admin,
                message: 'successfull register',
                token: service.createToken(user)
            });
    });
}

//POST Login
module.exports.login = (req, res) => {
    User
        .findOne({email: req.body.email})
        .select('_id email +password')
        .exec((err, user) => {
            if (err) return res
                .status(500)
                .jsonp({
                    error: 500,
                    message:`${err.message}`
                });

            if(!user) return res
                .status(404)
                .jsonp({
                    error: 404,
                    message: 'user does not exist'
            });

            bcrypt.compare(req.body.password, user.password, (err,result) => {

                if (err) return res
                    .status(401)
                    .jsonp({
                        error: 401,
                        message: 'autenticathion failed'
                    });
                if (result == false){
                    return res
                        .status(401)
                        .jsonp({
                            error:401,
                            message: 'autenticathion error'
                        });
                }else{
                    //puede ser que haya que revisar esto
                    req.user = user;
                    res.status(200).jsonp({
                        id: user._id,
                        name: user.name,
                        surname: user.surname,
                        email: user.email,
                        password: user.password,
                        address: user.address,
                        phone: user.phone,
                        is_admin: user.is_admin,
                        message:'successfull login',
                        token: service.createToken(user)
                    });
                }
            });

        });
}

module.exports.edit_user = (req, res)  => {
    User
        .update(/*{email: req.body.email},*/{
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,password: req.body.password,
            address: req.body.address,
            phone: req.body.phone

        }).exec(
        (err, user) => {
            if (err) return res
                .status(401)
                .jsonp({
                    error: 401,
                    message: 'autenticathion failed'
                });

            if(!user) {
                return res
                    .status(404)
                    .jsonp({
                        error: 404,
                        message: 'user does not exist'
                    });
            }else{
                return res
                    .status(200)
                    .jsonp({
                        id: user._id,
                        name: user.name,
                        surname: user.name,
                        email: user.email,
                        password: user.password,
                        address: user.address,
                        phone: user.phone,
                        is_admin: user.is_admin,
                        message: 'correctly edited'
                    });
            }
        });
}

module.exports.delete_user = (req, res) => {
    User
        .remove({email: req.body.email}, true)
        .exec((err, user) => {
            if (err) return res
                .status(401)
                .jsonp({
                    error: 401,
                    message: 'autenticathion failed'
                });

            if(!user) {
                return res
                    .status(404)
                    .jsonp({
                        error: 404,
                        message: 'user does not exist'
                    });
            }else{
                return res
                    .status(200)
                    .jsonp({
                        id: user._id,
                        name: user.name,
                        surname: user.name,
                        email: user.email,
                        password: user.password,
                        address: user.address,
                        phone: user.phone,
                        is_admin: user.is_admin,
                        message: 'correctly edited'
                    });
            }
        });
}

module.exports.list_pet_user