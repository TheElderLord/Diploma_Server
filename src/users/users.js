const express = require('express');
const db = require('../db/db');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Login method
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = '${email}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    else if (result.length === 0) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }
    else if (result[0].password !== password) {
      return res.status(401).send({ message: 'Incorrect password' });
    }
    else{
	const payload = {
   	 username: email
  	};

  // Generate JWT token
  const token = jwt.sign(payload, 'diplom', { expiresIn: '1h' });

  // Send token as response
  res.status(200).json({ token: token });
}
  });
});

// Logout method
router.post('/logout', (req, res) => {3
  return res.status(200).send({ message: 'Logged out successfully' });
});

// Registration method
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const sel = `SELECT * FROM users WHERE email = '${email}' `;
  
  const sql = `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}')`;
  db.query(sel, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    if(result.length > 0) {
        return res.status(409).send({ message: 'User already exists' });
    }
    else {
        db.query(sql, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ message: err });
            }
		const payload = {
  	 	 username: email
  		};

  // Generate JWT token
  	const token = jwt.sign(payload, 'diplom', { expiresIn: '1h' });

  	// Send token as response
 	 res.status(200).json({ token: token });
            return res.status(201).send({ message: 'User created successfully' });
        });
    }
  });
});

router.post('/reset-pass', (req, res) => {
  const { user_id, old_pass, new_pass } = req.body;
  
  const sql = `UPDATE users SET password = '${new_pass}' WHERE id = '${user_id}' AND password = '${old_pass}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    if (result.affectedRows === 0) {
      return res.status(401).send({ message: 'The old password inserted' });
    }
    return res.status(200).send({ message: 'Password changed successfully' });
  });
  
});

router.post('/delete_user', (req, res) => {
  const { user_id } = req.body;
  const sql = `DELETE FROM users WHERE id = '${user_id}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    
    return res.status(200).send({ message: 'User deleted successfully' });
  });
});

router.post('/update_user', (req, res) => {
  const { user_id, fullname, email, password } = req.body;
  const sql = `UPDATE users SET fullname = '${fullname}', email = '${email}', password = '${password}' WHERE id = '${user_id}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    return res.status(200).send({ message: 'User updated successfully' });
  });
});



router.get('/get/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM users WHERE id = ${id}`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }

    if (result.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.status(200).send(result);

  });
});







module.exports = router;
