const express = require('express');
const userController = require('../controllers/user_controller');
const petController = require('../controllers/pet_controller');
const auth = require('../middlewares/auth');
let router = express.Router();


router.post('/add', petController.add_pet);
router.get('/list', petController.list_pet);
router.delete('/delete', petController.delete_pet);
router.put('/edit', petController.edit_pet);
router.put('/pet_details', petController.pet_details);