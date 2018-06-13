var express = require('express');
var router = express.Router();
const userController = require('../controllers/user_controller');
const auth = require('../middlewares/auth');

/* GET users listing. */

router.get('/owners', userController.list_all_owner);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/edit/:id',auth.isAuth, userController.edit_user);


module.exports = router;
