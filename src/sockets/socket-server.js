const socketIo = require('socket.io');
const chatController = require('../controllers/chat.controller');
const messageController = require('../controllers/message.controller');
const chatService = require('../services/chat.service');

const socketServer = (http) => {
  const io = socketIo(http, {
    cors: {}
  });

  io.on('connection', (socket) => {
    const { room, user_name, user_id } = socket.handshake.query;
    console.log(`[socket.io] a user - ${ user_name }, connected to room - ${ room }`);

    const userInChat = chatService.newUserInChat(room, user_name);
    io.emit(`newUserInChat.${ room }`, userInChat);

    socket.on('msgToServer', async (text) => {
      const id = await messageController.newMessage(room, { user_id, text })
      io.emit('msgToClient', { user_id, user_name, text, id });
    });
    socket.on('createNewChat', async (chatName) => {
      await chatController.createNewChat(chatName);
      io.emit('newChatCreated', chatName);
    })
    socket.on('disconnect', () => {
      const userInChat = chatService.removeUser(room, user_name);
      io.emit(`newUserInChat.${ room }`, userInChat);
      console.log(`[socket.io] a user - ${ user_name }, disconnected from room - ${ room }`);
    })
  });
}

module.exports = socketServer;
