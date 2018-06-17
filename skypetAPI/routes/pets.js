const express = require('express');
const userController = require('../controllers/user_controller');
const petController = require('../controllers/pet_controller');
const auth = require('../middlewares/auth');
let router = express.Router();


router.post('/add', petController.add_pet);
router.get('/list', petController.list_pet);
router.delete('/delete/:id', petController.delete_pet);
router.put('/edit/:id', petController.edit_pet);
router.put('/pet_details/:id', petController.pet_details);
routes.get('/perdidas_pet', petController.perdidas_pet);
routes.get('/encontradas_pet', petController.encontradas_pet);

module.exports = router;
