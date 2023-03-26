const express = require('express');
const app = express();

// Serve static files from the "public" directory
app.use(express.static('public'));

  
const server = app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
