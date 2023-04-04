const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: { origin: "*" }
});

// Serve static files from the "public" directory
app.use(express.static('src/public'));


// app.get('/socket.io', (req, res) => {
//     req.headers['access-control-allow-origin'] = 'htttp://192.168.196.124:3000'
// });


io.on('connection', (socket) => {
    console.log('A new user connected');
    // send the user id and its opponent id to the client

    socket.on('gameStarted', gameStart => {
        console.log('Broadcoast Initialising game');
        io.emit('gameStarted', gameStart);
    });
    socket.on('gameAccepted', gameAccepted => {
        console.log('Broadcoast Accepting game');
        io.emit('gameAccepted', gameAccepted);
    });
    socket.on('movePiece', squrs => {
        console.log('Broadcoast Moving piece');
        io.emit('movePiece', squrs);
    });
});

server.listen(3000, () => console.log('listening on http://localhost:3000'));
