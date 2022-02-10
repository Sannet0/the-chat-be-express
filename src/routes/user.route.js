const router = require('express').Router();
const userController = require('../controllers/user.controller')
const jwtVerify = require('../middelwares/jwt.middelwares');

router.get('/', jwtVerify, userController.userInfo)
router.post('/login', userController.login);
router.post('/registration', userController.registration);

module.exports = router;
