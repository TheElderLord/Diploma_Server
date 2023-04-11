const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./src/users/users');
const postRoutes = require('./src/posts/posts');
const http = require('http');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable JSON request body parsing
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Use user routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

app.use("/images",express.static(path.join("images")));
const port = 8080;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
