const bcrypt = require('bcrypt-nodejs');
const service = require('../services');
const Customer = require('../models/customer_model');

//POST
module.exports.add_customer = (req, res) => {
    let customer = new Customer({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        email: req.body.email,
        direccion: req.body.direccion,
        telefono: req.body.telefono,

    });
    customer.save((err, result) => {
        if(err)
            return res
                .status(500),
                .jsonp({
                    error: 500,
                    mensaje: `${err.message}`
        });
        return res
            .status(201)
            .jsonp({
                nombre: result.nombre
                apellidos: result.apellidos,
                email: result.email,
                direccion: result.direccion,
                telefono: result.
                    telefono,
            });
    });

}