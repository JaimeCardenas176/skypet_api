const bcrypt = require('bcrypt-nodejs');
const service = require('../services');
const User = require('../models/user_model');
const Pet = require('../models/pet_model');

//POST Registro y adición de usuarios
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

    user.save((err, result) => {
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
        .jsonp({
            owner_id: owner._id,
            owner_name: owner.name,
            owner_surname: owner.surname,
            owner_email: owner.email,
            owner_address: owner.address,
            owner_phone: owner.phone,
            pets: pets
        })


};

module.exports.all_owner_and_pets = (req,res) => {

};