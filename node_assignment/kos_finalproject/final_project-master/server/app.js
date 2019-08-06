let express = require('express');
let app = express();
let bodyparser = require('body-parser')
const api = require('./api/v1')
const db = require('./db')
const auth = require('./api/auth/auth')
const cors = require('cors');
const server  = require('http').createServer(app);
const io = require('socket.io')(server);
var swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json');

require('./sockets')(io);
//middlewares
app.options('*', cors());
app.set("socketio", io);
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

//sockets

// io.on('connection', (socket) => {
//     console.log("Connected to client id:"+(socket.id)+" client.address: "+(socket.client.address));
//     // socket.emit('data');
//     setInterval(function(){ socket.emit('data'); }, 3000);
//     socket.on("clientinfo", (data)=>{
//        console.log("clientinfo:"+data);
//         // clients.saveClient(data, socket);
//         console.log("client details:"+(clients.getClient()[0]['username']));
//     })
//     // socket.emit("sharenotes","Hello Angular! i will share any share notification to you");
//     socket.on('disconnect', () => { 
//         console.log("Client disconnected");
//         // clients.clearClient();
//     });
//     socket.on('updateFav',(data)=>{
//         console.log(data);
//     })
// });

//database
db.createMongoConnection()
const dbConnection = db.getMongoConnection()
dbConnection.on('error',db.onError)
dbConnection.once('open',db.onSuccess)

//auth init
auth.initializeAuth()

//api config
app.use('/api/v1',api);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((req,res)=>{
    res.sendStatus(404);
})

module.exports = server;
