const express = require('express');
const bodyParser = require('body-parser');
const authJwt = require('./api/v1/utils/authJwt');
const updateAll = require('./api/v1/dao/updateAll');
const deleteNotes = require('./api/v1/dao/deleteNotes');
const shareNotes = require('./api/v1/dao/shareNotes');
const getshareNotes = require('./api/v1/dao/getShareNotes');
const cors = require('cors');
let swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

// to avoid complex parsing appended .config
const config = require('./config/').config;

// import db modoule
const db = require('./db');

//import router from versioning folder
const apiV1 = require('./api/v1/router');

//Instantiate express
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(cors());
//setting up the data format parsing
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


io.on('connection', function (socket) {
    //console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    //share to individual user and bulk users
    socket.on('sharetoUser', (data) => {
        shareNotes(data).then(res => {
            socket.emit('sharesSucces', "success in Sharing");
        }).catch(err => {
            socket.emit('sharesFail', "fails in Sharing");
        });
    });

    socket.on('dbupdateAll', (data) => {
        updateAll(data).then(res => {
            socket.emit('dbUpdateSuccess', "success in update");
        }).catch(err => {
            socket.emit('dbUpdateFail', "fail in update");
        });
    });

    socket.on('getShare', (data) => {
        getshareNotes(data).then(res => {
            socket.emit('getShare', res);
        }).catch(err => {
            socket.emit('getShare', false);
        });
    })

    socket.on('deleteNotes', (data) => {
        deleteNotes(data).then(res => {
            socket.emit('dbDeleteSuccess', "success in delete");
        }).catch(err => {
            socket.emit('dbDeleteFail', "fail in delete");
        });
    });

});

const jwtCheck = (req, res, next) => {
    if (!req.get('Authorization')) {
        res.status(403).json({
            isAuthenticated: false,
            message: "No token was specified"
        });
    }
    authJwt(req.get('Authorization')).then(result => {
        next();
    }).catch(err => {
        res.status(403).json({
            message: "Invalid access token",
            isAuthenticated: false
        });
    });
};

//setting router middleware
app.use('/api/v1', jwtCheck, apiV1);

db.createMongoConnection().then(res => {
    http.listen((config.port), () => {
        console.log("NotesService listening on :", config.port);
    });
}).catch(err => {
    console.log("Mongo error :", err);
});

module.exports = io;