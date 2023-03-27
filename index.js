const express = require('express');
const app = express();

// Serve static files from the "public" directory
app.use(express.static('src/views'));


const server = app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

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