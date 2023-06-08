const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const accomodationRoutes = require('./src/routes/accomodationRoute');
const roommateRoutes = require('./src/routes/roommateRoutes');
const dotenv = require("dotenv").config();

const cors = require('cors');
const path = require('path');

const app = express();

// Enable JSON request body parsing
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Use user routes
app.use('/users', userRoutes);
app.use('/accomodation', accomodationRoutes);
app.use('/roommate', roommateRoutes);

app.use("/images",express.static(path.join("images")));
const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
