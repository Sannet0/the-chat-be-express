const db = require('../modules/database.module');

const getAllChats = async (req, res) => {
  try {
    const chats = await db.any(`SELECT chats.name FROM chats`);

    const chatsNames = [];
    chats.forEach((chat) => {
      chatsNames.push(chat.name);
    });

    return res.send(chatsNames);
  } catch (err) {
    return res.status(err.statusCode || 400).send(err.message || 'something  wrong');
  }
}

const createNewChat = async (chatName) => {
  await db.any(`INSERT INTO chats ("name") VALUES ('${ chatName }')`)
}

module.exports = {
  getAllChats,
  createNewChat
}
