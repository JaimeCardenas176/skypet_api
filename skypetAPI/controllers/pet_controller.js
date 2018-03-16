const service = require('../services');
const User = require('../models/user_model');
const Pet = require('models/pet_model');

module.exports.add_pet = (req, res) => {
    let pet = new Pet({
        name: req.body.name,
        gender: req.body.gender
    });
    Pet
        .save()
        .exec()
};