const http = require('http');
const app = http.createServer();
const io = require('socket.io')(app);

io.on('connection',(socket)=>{
    console.log('a client connected');
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`server listening on port: ${PORT}`);
})