const express = require('express');
const UsersService = require('./UserService');
const app = express();
const server = app.listen(3000, () => {
  console.log('listening on *:3000');
});
const io = require('socket.io').listen(server);
const usersService = new UsersService();

app.use(express.static(`${__dirname}/public`));
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', (socket) => {
  socket.on('join', (name) => {
    usersService.addUser({
      id: socket.id,
      name
    });
    io.emit('update', {
      users: usersService.getAllUsers()
    });
  });
  socket.on('dicconnect', (socket) => {
    usersService.removeUser(socket.id);
    socket.broadcast.emit('update', {
      users: usersService.getAllUsers()
    });
  });
  socket.on('message', (message) => {
    const {name} = usersService.getUsersById(socket.id);
    socket.broadcast.emit('message', {
      text: message.text,
      from: name
    });
  });
});
