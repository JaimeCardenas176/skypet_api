const bcrypt = require('bcrypt-nodejs');
const service = require('../services');
const User = require('../models/user_model');

//POST Registro
module.exports.register = (req, res) => {
    let user = new User({
        email: req.body.email,
        nombre: req.body.nombre,
        password: req.body.password
    });
    user.save((err, result) => {
        if(err)
            return res
                .status(500)
                .jsonp({
                    error: 500,
                    mensaje:`${err.message}`
                });
        return res
            .status(201)
            .jsonp({
                nombre: result.nombre,
                email: result.email,
                password: result.password,
                token: service.createToken(user)
            });
    });
}

//POST Login
module.exports.login = (req, res) => {
    User
        .findOne({email: req.body})
        .select('_id email +password')
        .exec((err, user) => {
            if (err) return res
                .status(401)
                .jsonp({
                    error: 401,
                    mensaje: 'Error en la autenticación'
                });

            if(!user) return res
                .status(401),
                .jsonp({
                    error: 404,
                    mensaje: 'No existe el usuario '
            });

            bcrypt.compare(req.body.password, user.password, (err,result) => {

                if (err) return res
                    .status(401)
                    .jsonp({
                        error: 401,
                        mensaje: 'Error de autenticación'
                    });
                if (result == false){
                    return res
                        .status(401)
                        .jsonp({
                            error:401,
                            mensaje: 'Error de autenticación'
                        });
                }else{
                    //puede ser que haya que revisar esto
                    req.user = user;
                    res.status(200).jsonp({
                        id: user._id,
                        name: user.nombre,
                        email: user.email,
                        password: user.password,
                        mensaje:'Login correcto',
                        token: service.createToken(user)
                    });
                }
            });

        });
}