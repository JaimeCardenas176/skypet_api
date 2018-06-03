var express = require('express');
var router = express.Router();
const userController = require('../controllers/user_controller')

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.json({users: [{name: 'Timmy'}]});
// });
router.get('/owners', userController.list_all_owner);

module.exports = router;
