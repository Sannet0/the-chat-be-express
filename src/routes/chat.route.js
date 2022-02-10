const router = require('express').Router();
const chatController = require('../controllers/chat.controller')

router.get('/', chatController.getAllChats);

module.exports = router;
