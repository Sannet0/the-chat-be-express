const db = require('../modules/database.module');

const getAllMessages = async (req, res) => {
  const { chatName } = req.params;

  try {
    const chats = await db.any(`SELECT chats.id FROM chats WHERE name = '${ chatName }'`);

    if(chats.length === 0) {
      throw { message: 'no such chat', statusCode: 404 };
    }

    const chat_id = chats[0].id;

    const result = await db.any(`
    SELECT messages.id, messages.text, messages.user_id, usr.login AS "user_name" FROM messages
    JOIN (SELECT * FROM chats) chat ON chat.id = messages.chat_id
    JOIN (SELECT * FROM users) usr ON usr.id = messages.user_id
    WHERE chat_id = ${ chat_id }
  `);

    res.send(result);
  } catch (err) {
    return res.status(err.statusCode || 400).send(err.message || 'something  wrong');
  }
}

const newMessage = async (chatName, message) => {
  try {
    const { user_id, text } = message;
    const chats = await db.any(`SELECT chats.id FROM chats WHERE name = '${ chatName }'`);

    if(chats.length === 0) {
      throw { message: 'no such chat', statusCode: 404 };
    }

    const chat_id = chats[0].id;

    const newMessage = await db.any(`
      INSERT INTO messages ("text", "user_id", "chat_id") 
      VALUES ('${ text }', ${ user_id }, ${ chat_id })
      RETURNING id`
    );

    return newMessage[0].id;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getAllMessages,
  newMessage
}
