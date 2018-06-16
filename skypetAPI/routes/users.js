const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const auth = require('../middlewares/auth');

/* GET users listing. */

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/details/:id', auth.isAuth, userController.details);
router.put('/edit/:id',auth.isAuth, userController.edit_user);
router.delete('/delete/:id', auth.isAuth, userController.delete_user);

router.get('/admins', auth.isAuth, userController.list_all_admin);
router.get('/owner/:id', auth.isAuth, userController.find_owner);
router.get('/owners', auth.isAuth, userController.list_all_owner);
router.get('/owner/pets/:id', auth.isAuth, userController.one_owner_pets);




module.exports = router;
