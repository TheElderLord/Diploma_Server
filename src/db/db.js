const mysql = require('mysql');
const config = require('../config/config');

const environment = process.env.NODE_ENV;

console.log('environment', environment);
const password = config[environment].password;

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : password,
  database : 'diploma',
  // port:3311
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

module.exports = db;
