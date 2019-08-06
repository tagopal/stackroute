const socket = require('socket.io-client')('http://localhost:3000');

socket.on('connect',()=>{
    console.log("connected to the socket server")
})

socket.on('data',()=>{
    console.log("data")
})

// socket.emit('sendScore');