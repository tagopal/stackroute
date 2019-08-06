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
 
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});


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
