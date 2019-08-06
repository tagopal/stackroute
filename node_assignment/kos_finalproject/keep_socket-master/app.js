const express = require('express');
let app = express();
const api = require('./api/v1');
const server  = require('http').createServer(app);
const io = require('socket.io')(server);
var bodyParser = require('body-parser')
var clients=[];
app.set("socketio", io);
// app.set("Clients", clients);
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json());
app.use('/api/v1',api);


io.on('connection', (socket) => {
    console.log("Connected to client id:"+(socket.id)+" client.address: "+(socket.client.address));
    // socket.emit('data');
    setInterval(function(){ socket.emit('data'); }, 3000);
    socket.on("clientinfo", (data)=>{
       console.log("clientinfo:"+data);
        // clients.saveClient(data, socket);
        console.log("client details:"+(clients.getClient()[0]['username']));
    })
    // socket.emit("sharenotes","Hello Angular! i will share any share notification to you");
    socket.on('disconnect', () => { 
        console.log("Client disconnected");
        // clients.clearClient();
    });
    
});




module.exports = server;