'use strict';

//DONE: Create a TCP Server use using the net module

const net = require('net');
const server = net.createServer();

let clientPool = [];
let curUser = 1;

//TODO: Create a Client Constructor
//TODO: When sockets connect to the server a new Client instance should be made

server.on('connection', (socket) =>{
  console.log('socket connected.');
  socket.write('Hey there, friend. Welcome to HooliChat.');

//TODO: Clients should have a unique 'nickname'
//TODO: e.g. guest-43

  socket.nickname = `guest-${curUser}`;
  curUser++;
  clientPool = [...clientPool, socket];

  let handleDisconnect = () => {
    console.log(`${socket.nickname} has disconnected`);
    clientPool = clientPool.filter(item => item !== socket);
  }

//TODO: When sockets are connected with the ClientPool they should be given event listeners for data, error, and close events

  socket.on('error', handleDisconnect);
  socket.on('close', handleDisconnect);

  socket.on('data', (buffer) => {
    let data = buffer.toString();
    if (data.startsWith('/nickname')){
      socket.nickname = data.split('/nickname')[1] || socket.nickname;
      socket.nickname = socket.nickname.trim();
      socket.write(`you are now known as ${socket.nickname}`);
      return
    }
  })
})








//TODO: When a socket emits the close event the socket should be removed from the client pool!
//TODO: When a socket emits the error event the error should be logged on the server
//TODO: When a socket emits the data event the data should be logged on the server and the \wack commands below should be implemented
