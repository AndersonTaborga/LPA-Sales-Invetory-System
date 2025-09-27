var express = require('express');
var router = express.Router();
const userController = require('../controllers/authController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', userController.login);
router.post('/register', userController.register);

module.exports = router;
