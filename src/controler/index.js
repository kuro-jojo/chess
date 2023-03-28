const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: {origin:"*"}
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('newMove', (newMove) =>{
        console.log(newMove);
        io.emit('newMove', '${newMove}');
    });
});

http.listen(8080, ()=> console.log('listening on http://localhost:8080'));