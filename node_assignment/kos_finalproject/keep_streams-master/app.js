let express = require('express');
let app = express();
let bodyparser = require('body-parser')
const api = require('./api/v1')
const db = require('./db')
const auth = require('./api/auth/auth')
//middlewares
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

//database
db.createMongoConnection()
const dbConnection = db.getMongoConnection()
dbConnection.on('error',db.onError)
dbConnection.once('open',db.onSuccess)

//auth init
auth.initializeAuth()

//api config
app.use('/api/v1',api);
app.use((req,res)=>{
    res.sendStatus(404);
})

module.exports = app;
