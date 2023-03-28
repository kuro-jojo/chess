const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {origin:"*"}
});

// Serve static files from the "public" directory
app.use(express.static('src/views'));





io.on('connection', (socket) => {
    console.log('A new user connected');

    socket.on('newMove', (newMove) =>{
        console.log(newMove);
        io.emit('newMove', '${newMove}');
    });
});

server.listen(3000, ()=> console.log('listening on http://localhost:3000'));

// const connect = require('connect');
// const serveStatic = require('serve-static');
// const mime = require('mime');
// const app = connect();

// app.use(serveStatic('src/views'));

// // Add the following middleware to set the correct MIME type for JavaScript files
// app.use((req, res, next) => {
//     if (req.url.endsWith('.js')) {
//         res.setHeader('Content-Type', mime.getType('js'));
//     }
//     next();
// });
// app.listen(3000);