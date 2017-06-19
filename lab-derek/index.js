'use strict';

//DONE: Create a TCP Server use using the net module

const net = require('net');
const server = net.createServer();

let clientPool = [];
let curUser = 1;

//TODO: Create a Client Constructor
//TODO: When sockets connect to the server a new Client instance should be made

server.on('connection', (socket) =>{
  console.log('socket connected.\n');
  socket.write('Hey there, friend. Welcome to HooliChat.\n');

//TODO: Clients should have a unique 'nickname'
//TODO: e.g. guest-43

  socket.nickname = `guest-${curUser}`;
  curUser++;
  clientPool = [...clientPool, socket];
  socket.write(`You\'re connected as ${socket.nickname}\n`);


//TODO: When a socket emits the close event the socket should be removed from the client pool!
//TODO: When a socket emits the error event the error should be logged on the server

  let handleDisconnect = () => {
    console.log(`${socket.nickname} has disconnected\n`);
    clientPool = clientPool.filter(item => item !== socket);
  }

//TODO: When sockets are connected with the ClientPool they should be given event listeners for data, error, and close events

  socket.on('error', handleDisconnect);
  socket.on('close', handleDisconnect);

//TODO: When a socket emits the data event the data should be logged on the server and the \wack commands below should be implemented

  socket.on('data', (buffer) => {
    let data = buffer.toString();
    let content = buffer.toString();

//TODO: when a user speaks their nickname should be printed, i.e. teapot: Sup Hacker?

    let print = (users, content) => {
      users.forEach((user) => {
          user.write(`${socket.nickname}: ${content.toString()}`)
      })
    };

//TODO: /nick should allow a user change their nickname

    if (data.startsWith('/nick')){
      socket.nickname = data.split('/nick')[1] || socket.nickname;
      socket.nickname = socket.nickname.trim();
      socket.write(`you are now known as ${socket.nickname}\n`);
      return;
    }


//TODO: /dm should allow a user to send a message directly to another user by nick name

    if (data.startsWith('/dm')){
      let wholeMsg = data.split('/dm ')[1] || "";
      let dmRecipient = wholeMsg.split(/\s+/)[0];
      let content = wholeMsg.replace(dmRecipient, '');
      function findRecipient(clientPool) {
        return clientPool.nickname === dmRecipient;
      }
      print([clientPool.find(findRecipient)], (`**DM** => ${content}`))
      return;
      }

//TODO: /troll should take in a number and a message and send the message to everyone that number of times

    if (data.startsWith('/troll')){
      let wholeMsg = data.split('/troll ')[1] || "";
      let trollNum = wholeMsg.split(/\s+/)[0];
      let content = wholeMsg.replace(trollNum, '');

      for(let i = 0; i < trollNum; i++){
      print(clientPool, content);
      return;
      }
    }

//TODO: /quit should close the connection with the user

    if (data.startsWith('/quit')){
      socket.end();
      return;
    }

    else{
      print(clientPool, content);
    }
  })
})

server.listen(3000, () => {
  console.log('server up on port 3000');
});
