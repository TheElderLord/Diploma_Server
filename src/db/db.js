const mysql = require('mysql');

// Create a MySQL connection
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
   password : 'root',
  // password : 'zxcasd123$',
  database : 'diploma',
  //port:3311
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

module.exports = db;
