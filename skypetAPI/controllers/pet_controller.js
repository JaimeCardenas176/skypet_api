const service = require('../services');
const User = require('../models/user_model');
const Pet = require('models/pet_model');
const User = require('models/user_model');

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
    Pet.save((err, result) => {
       if(err)
           return res
               .status(500),
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
//GET listar mascotas con la referencia al id de su propietario
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
                     .jsonp(pets
                     );
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
                        last_location: pbget.last_location,
                        last_date: pet.last_date,
                        url_photo: pet.url_photo,

                    });
            }

        });
});
//TODO hay que realizar la petición multiparte
// mirar en futur estud.io la libreria se me ha vuelto a olvidar
// algo de Okhttp para crear api rest que consuma un cliente android
//Retrofit!!! es el nombre de la libreria!
//TODO commitear los cambios, no hay nada en el staying AREA