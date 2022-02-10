const chats = {};

const newUserInChat = (room, user_name) => {
  if(!chats[room]) {
    chats[room] = [user_name];
  } else {
    chats[room].push(user_name);
  }
  return chats[room];
}

const removeUser = (room, user_name) => {
  chats[room] = chats[room].filter(username => username !== user_name);
  return chats[room];
}

module.exports = {
  newUserInChat,
  removeUser
}
