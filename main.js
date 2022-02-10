const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
require('dotenv').config()
const jwtVerify = require('./src/middelwares/jwt.middelwares');
const socketServer = require('./src/sockets/socket-server');
socketServer(http);

const userRoutes = require('./src/routes/user.route');
const chatRoutes = require('./src/routes/chat.route');
const messageRoutes = require('./src/routes/message.route');

app.use(cors());
app.use(express.json());

app.use('/user', userRoutes);
app.use('/chat', jwtVerify, chatRoutes);
app.use('/message', jwtVerify, messageRoutes);

http.listen(process.env.SERVER_PORT, () => {
  console.log(`[server] listening on port :${ process.env.SERVER_PORT }`);
});
