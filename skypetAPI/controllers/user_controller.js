/**
 * Controlador de usuario (tanto administradores como no administradores)
 * En este archivo quedan recogidas todas las peticiones que se realizan
 * a la base de datos para gestionar los usuarios
 */

/**
 * importaciones de paquetes necesarios para la realización de los controladores de usuario
 * bcrypt para encriptar la informacion de los usuarios
 * service el paquete donde se encuentran los servicios de autenticaciòn (en dos pasaos) de los usuarios
 * User el modelo de usuario de mongoose para mongoDB
 * Pet el modelo de mascota de mongoose para mongoDB
 */
const bcrypt = require('bcrypt-nodejs');
const service = require('../services');
const User = require('../models/user_model');
const Pet = require('../models/pet_model');

//POST Registro y adición de usuarios
/**
 * función que realiza la petiición de registro de un usuario
 * @param req es el parametro request con la información necesaria para el alta de un usuario
 * @param res JSON respuesta con todos los datos del usuario registrado en caso de que no haya habido erroes
 */
module.exports.register = (req, res) => {

    let user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        phone: req.body.phone,
        is_admin: req.body.is_admin
    });

    User.save((err, result) => {
        if (err)
            return res
                .status(500)
                .jsonp({
                    error: 500,
                    message: `${err.message}`
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
                is_admin: result.is_admin,
                message: 'successfull register',
                token: service.createToken(user)
            });
    });
};

//POST Login
/**
 * función que realiza la petición de login de un usuario
 * @param req parámetro request con la nformación del usuario que inicia sesión
 * @param res JSON respuesta con todos los datos del usuario que ha inciado sesión
 */
module.exports.login = (req, res) => {
    User
        .findOne({email: req.body.email})
        .select('_id email password')
        .exec((err, user) => {
            if (err) return res
                .status(500)
                .jsonp({
                    error: 500,
                    message: `${err.message}`
                });

            if (!user) return res
                .status(404)
                .jsonp({
                    error: 404,
                    message: 'user does not exist'
                });

            bcrypt.compare(req.body.password, user.password, (err, result) => {

                if (err) return res
                    .status(401)
                    .jsonp({
                        error: 401,
                        message: 'autenticathion failed'
                    });
                if (result === false) {
                    return res
                        .status(401)
                        .jsonp({
                            error: 401,
                            message: 'autenticathion error'
                        });
                } else {
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
                        message: 'successfull login',
                        token: service.createToken(user)
                    });
                }
            });

        });
};
//POST edit user
/**
 * función que realiza la petición para editar un usuario
 * esta está pensada para la aplicación web de gestión pero
 * puediendo ser tambien utilizada para que un usuario edite
 * sus mismos datos en la aplicación final para clientes (android)
 * @param req
 * @param res
 */
module.exports.edit_user = (req, res) => {
    User               //filter user's id
        .updateOne({id:_id}, {
            //fields edited
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password,
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

            if (!user) {
                return res
                    .status(404)
                    .jsonp({
                        error: 404,
                        message: 'user does not exist'
                    });
            } else {
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
};
//DELETE delete user
/**
 * función que permite borrar un usuario de la base de datos alojada en el servidor de mlab
 * @param req es el parámetro request que contiene los datos del usuario a borrar
 * @param res JSON respuesta que muestra un mensaje con el resultado de la operación (usuario eliminado) si no ha babido errores
 */
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

            if (!user) {
                return res
                    .status(404)
                    .jsonp({
                        error: 404,
                        message: 'user does not exist'
                    });
            } else {
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
                        message: 'user deleted'
                    });
            }
        });
};
//GET all admins
/**
 * esta función realiza una llama a la API para que liste todos
 * los usuarios que tiene privilegios, es decir los administradores
 * que utilizan la aplicación web para el navegador
 * @param req
 * @param res
 */
module.exports.list_all_admin = (req, res) => {
    User
        .find({is_admin: true})
        .exec((err, admins) => {

            if (err)
                return res
                    .status(401)
                    .jsonp({
                        error: 401,
                        message: `${err.message}`
                    });

            if (admins && admins.length) {
                return res
                    .status(200)
                    .jsonp(admins);
            } else {
                return res
                    .status(404)
                    .jsonp({
                        error: 404,
                        message: `resource not found`
                    });
            }

        });
};
//GEt users data
/**
 * función que llama al API para que devuelva los datos de un usuario en concreto
 * excdeptuando la información de las mascotas
 * @param req
 * @param res
 */
//this the needed query to print the owner's data in mobile app
module.exports.find_owner = (req, res) => {
    User
        .findOne({is_admin: false, email:req.body.email})
        .exec((err, owner) => {
            if (err)
                return res
                    .status(401)
                    .jsonp({
                        error: 401,
                        message: `${err.message}`
                    });
            if(!owner) {
                return res
                    .status(404)
                    .jsonp({
                        error: 404,
                        message: 'owner do not exist'
                    });
            } else {
                return res
                    .status(200)
                    .jsonp({
                        id:_id,
                        name: owner.name,
                        surname: owner.surname,
                        email: owner.email,
                        address: owner.address,
                        phone: owner.phone,
                    });
            }
        });

};
//GET all owners
/**
 * función que lista todos los usuarios (propietarios de una mascota)
 * con sus correspondientes datos, no conteniendo los datos de dichas
 * mascotas
 * @param req
 * @param res
 */
module.exports.list_all_owner = (req, res) => {
    User
        .find({is_admin: false})
        .exec((err, owners) => {
            if (err)
                return res
                    .status(401)
                    .jsonp({
                        error: 401,
                        message: 'autenticathion failed'
                    });
            if(owners && owners.length){
                return res
                    .status(200)
                    .jsonp(owners);
            } else {
                return res
                    .status(404)
                    .jsonp({
                        error: 404,
                        message: 'resource not found'
                    });
            }
        });

};
//GET pet from owner

module.exports.one_owner_pets = (req, res) => {

    let id_owner=req._id;
    Pet
        .find({owner: id_owner}, {owner: false})
        .exec((err,pets) => {
            if(err)
                return res
                    .status(401)
                    .jsonp({
                        error:401,
                        message: 'autenticathion failed'
                    });
            if (pets && pets.length){
                return res
                    .status(200)
                    .jsonp(pets);
            }else{
                return res
                    .status(404)
                    .jsonp({
                        error:404,
                        message: 'resource not found'
                    });
            }
        });
};
//GET owner & pets
/**
 * peticion que realiza la llamada al API y devuelve
 * los datos de un usuario propietario incluyendo la lista
 * de mascotas del mismo con la información de las mascotas
 * incluida
 * @param req
 * @param res
 */
module.exports.owner_and_pets = (req, res) => {
    let owners = list_all_owner();
    let owner;
    let pets;
    for (let i=0; owners.length; i++){
       owner = owners[i]._id;
       pets=one_owner_pets(owner._id);
    }
    return res
        .status(200)
        .jsonp([{
            owner_id: owner._id,
            owner_name: owner.name,
            owner_surname: owner.surname,
            owner_email: owner.email,
            owner_address: owner.address,
            owner_phone: owner.phone,
            pets: pets
        }]);


};
//GET en teoraía esto tendria que devolver todos los usuarios
//propietarios con su respectiva lista de mascotas
/**
 * pendiente de implemenatación, último CALL
 * @param req
 * @param res
 */
//TODO pendiente de implementación ~ ni puta idea hulioo
module.exports.all_owner_and_pets = (req,res) => {

};