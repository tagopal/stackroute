const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
let swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');
    
// to avoid complex parsing appended .config
const config = require('./config/').config;

// import db modoule
const db = require('./db');

const authJwt = require('./api/v1/utils/authJwt').jwtVerify;

//import router from versioning folder
const apiV1 = require('./api/v1/router');

//Instantiate express
const app = express();

app.use(cors());
//setting up the data format parsing
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/users/check', (req, res) => {
    console.log("request in the no path");
    res.send("no path in login");
});

app.post('/api/v1/isAuthenticated', (req, res) => {
    authJwt(req.get('Authorization')).then(result => {
        res.status(201).json({
            isAuthenticated: true
        });
    }).catch(err => {
        res.status(403).json({
            message: "Invalid access token",
            isAuthenticated: false
        });
    });
});

//setting router middleware
app.use('/api/v1', apiV1);

db.createMongoConnection().then(res => {
    //console.log("mongo connection  :",res);
    app.listen((config.port), () => {
        console.log("Userservice listening on :", config.port);
    });
}).catch(err => {
    console.log("Mongo error :", err);
});