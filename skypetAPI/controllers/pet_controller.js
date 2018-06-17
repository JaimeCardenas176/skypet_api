const service = require('../services');
const User = require('../models/user_model');
const Pet = require('../models/pet_model');
const imgur = require('imgur');


//POST registro/adición de mascotas
module.exports.add_pet = (req, res) => {
    let pet = new Pet({
        name: req.body.name,
        gender: req.body.gender,
        owner: req.body.owner._id,
        state: req.body.state,
        last_location: req.body.last_location,
        last_date: req.body.last_date,
        url_photo: req.body.url_photo
    });
    pet.save((err, result) => {
       if(err)
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
                    gender: result.gender,
                    owner: result.owner._id,
                    state: result.state,
                    last_location: result.last_location,
                    last_date: result.last_date,
                    url_photo: result.url_photo,
        });
    });

};
//GET listar mascotas
module.exports.list_pet = ((req, res) => {
    Pet
        .find()
        .exec( (err, pets) => {
             if (err)
                 return res
                     .status(401)
                     .jsonp({
                         error:401,
                         message: 'no tienes autorizacion para accerder al recurso'
                     });
             if(pets && pets.length) {
                 return res
                     .status(200)
                     .jsonp(pets);
             }
    });
});
//DELETE borrando una mascota
module.exports.delete_pet = ((req, res) =>{
    Pet
        .remove({_id: req._id}, true)
        .exec((err, pet) => {
            if(err) return res
                .status(401)
                .jsonp({
                    error: 401,
                    message:'autenticathion failed'
                });
            if(!pet) {
                return res
                    .status(404)
                    .jsonp({
                        error: 404,
                        message: 'pet does not exist'
                    });
            }else{
                return res
                    .status(200)
                    .jsonp({
                       id: pet._id,
                       name: pet.name,
                       gender: pet.gender,
                        owner: pet.owner._id,
                        state: pet.state,
                        last_location: pet.last_location,
                        last_date: pet.last_date,
                        url_photo: pet.url_photo,

                    });
            }

        });
});

module.exports.edit_pet = ((req, res)=>{
    Pet
        .findOne({_id: req._id}, true)
        .exec((err, pet) => {
            if(err) return res
                .status(401)
                .jsonp({
                    error: 401,
                    message:'autenticathion failed'
                });
            if(!pet) {
                return res
                    .status(404)
                    .jsonp({
                        error: 404,
                        message: 'pet does not exist'
                    });
            }else{
                if(req.body.name) {
                    pet.name = req.body.name;
                }else if(req.body.state){
                    pet.state = req.body.state;
                }
                return res
                    .status(200)
                    .jsonp({
                        id: pet._id,
                        name: pet.name,
                        gender: pet.gender,
                        owner: pet.owner._id,
                        state: pet.state,
                        last_location: pet.last_location,
                        last_date: pet.last_date,
                        url_photo: pet.url_photo,

                    });
            }

        });
});

module.exports.pet_details = ((req, res) =>{
    Pet
        .findOne({_id: req._id}, true)
        .exec((err, pet) => {
            if(err) return res
                .status(401)
                .jsonp({
                    error: 401,
                    message:'autenticathion failed'
                });
            if(!pet) {
                return res
                    .status(404)
                    .jsonp({
                        error: 404,
                        message: 'pet does not exist'
                    });
            }else{
                return res
                    .status(200)
                    .jsonp({
                        id: pet._id,
                        name: pet.name,
                        gender: pet.gender,
                        owner: pet.owner._id,
                        state: pet.state,
                        last_location: pet.last_location,
                        last_date: pet.last_date,
                        url_photo: pet.url_photo,

                    });
            }

        });
});
//listar mascotas perdidas
module.exports.perdidas_pet = ((req, res) => {
    Pet
        .find({state: 1})
        .exec( (err, pets) => {
            if (err)
                return res
                    .status(401)
                    .jsonp({
                        error:401,
                        message: 'no tienes autorizacion para accerder al recurso'
                    });
            if(pets && pets.length) {
                return res
                    .status(200)
                    .jsonp(pets);
            }
        });
});
//mascotas encontradas por otro usuario
module.exports.encontradas_pet = ((req, res) => {
    Pet
        .find({state: 2})
        .exec( (err, pets) => {
            if (err)
                return res
                    .status(401)
                    .jsonp({
                        error:401,
                        message: 'no tienes autorizacion para accerder al recurso'
                    });
            if(pets && pets.length) {
                return res
                    .status(200)
                    .jsonp(pets);
            }
        });
});
/*module.exports.uploadImg = (req, res) => {
    if(req.files){
        let fichero = req.files.photo;
        let imgBase64 = fichero.data.toString('base64');

        imgur.setClientId("mi_client_id");

        imgur.uploadBase64(imgBase64)
            .then(function (json) {
                registro(req, res, json.data.link);
            })
            .catch(function (err) {
                registro(req, res, null);
            })
    }
};*/
