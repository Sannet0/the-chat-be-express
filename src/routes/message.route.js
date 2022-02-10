const router = require('express').Router();
const messageController = require('../controllers/message.controller')

router.get('/:chatName', messageController.getAllMessages);

module.exports = router;
