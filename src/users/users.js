const express = require('express');
const db = require('../db/db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../images'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

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


  console.log(result[0].id);
  // Send token as response
  res.status(200).json({ token: token,
                         id:result[0].id});
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
    console.log(result.insertId);
 	 res.status(200).json({ token: token ,id:result.insertId}) 
      });
    }
  });
});

router.post('/reset-pass/:id', (req, res) => {
  const { user_id } = req.params;
  const {  old_pass, new_pass } = req.body;
  
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

router.post('/delete_user/:id', (req, res) => {
  const { user_id } = req.params;
  const sql = `DELETE FROM users WHERE id = '${user_id}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    
    return res.status(200).send({ message: 'User deleted successfully' });
  });
});
//id, firstname, lastname, username, email, password, image
router.post('/update_user/:id',upload.single('image'), (req, res) => {
  const user_id = req.params.id;
  const { firstname,lastname, username, email} = req.body;
  let image = null;
  if(req.file)
    image = req.file.originalname;
    else
    image = "Not specified";
  
  const sql = `UPDATE users SET username = '${username}',firstname= '${firstname}',
   email = '${email}',lastname = '${lastname}', 
   image = '${image}' WHERE id = '${user_id}'`;
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

router.post('/create_form/:id', upload.array('myImages', 10), (req, res) => {
  const { user_id } = req.params.id;
  const { additional, fullname, 
    age, gender, work, study, description, tags, 
    phonenumber, whatsapp,telegram,instagram}= req.body;
    let image = null;
  if(Array.isArray(req.files)){
   image= req.files.map(file => file.originalname);
   image = image.join(',');
  }
   else
   image = "Not specified";
  //    if (!fullname || !gender ) {
  //   return res.status(400).send({ message: 'Fields are required' });
  // }
  const sql = `INSERT INTO form (user_id, additional, fullname, 
    age, gender, work, study, description, tags, 
    phonenumber, whatsapp,telegram,instagram,image) VALUES 
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;
  db.query(sql, [
    user_id, additional, fullname, age,
    gender, work, study, description, tags,
    phonenumber, whatsapp,telegram,instagram, image
  ], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }

    // const post = { id: result.insertId, title, content, image };
    return res.status(201).send("Form created successfully");
  });
});

router.post('/update_form/:id', upload.array('myImages', 10), (req, res) => {
  const {user_id} = req.params;
  const { additional, fullname, 
    age, gender, work, study, description, tags, 
    phonenumber, whatsapp,telegram,instagram}= req.body;
    let image = null;
  if(Array.isArray(req.files)){
   image= req.files.map(file => file.originalname);
   image = image.join(',');
  }
   else
   image = "Not specified";
  
  const sql = `
  Update form set ( additional, fullname, 
    age, gender, work, study, description, tags, 
    phonenumber, whatsapp,telegram,instagram,image) VALUES 
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?) WHERE user_id = ?`;
    db.query(sql, [
       additional, fullname, 
    age, gender, work, study, description, tags, 
    phonenumber, whatsapp,telegram,instagram, image,user_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    return res.status(201).send("Form updated successfully");
  });
});

router.get('/get_form/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM form WHERE user_id = ${id}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    if (result.length === 0) {
      result.forEach(element => {
        element.image = element.image.split(',');
      });
      return res.status(404).send({ message: 'Form not found' });
    }
    return res.status(200).send(result);
  });
});

router.post('/delete-form/:id', (req, res) => {
  const { user_id } = req.params;
  const sql = `DELETE FROM form WHERE user_id = '${user_id}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    return res.status(200).send({ message: 'Form deleted successfully' });
  });
});


router.get('/all', (req, res) => {
  const sql = `SELECT * FROM users`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    return res.status(200).send(result);
  });
});

router.get('/accomodation/:id', (req, res) => {
  const { id } = req.params;
  const { limit = 10, page = 1,  } = req.query;
  const offset = (page - 1) * limit;

  const count = `SELECT count(*) as count FROM accomodation_post WHERE user_id = ${id}`;
  db.query(count, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
  const count = result[0].count;
  const totalPages = Math.ceil(count / limit);
  const lastPage = totalPages > 0 ? totalPages : 1;

  const sql = `SELECT * FROM accomodation_post WHERE user_id = ${id} LIMIT ${limit} OFFSET ${offset}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    result.forEach(element => {
      element.image=element.image.split(',');
      });
    return res.status(200).send({
      data:result,
      lastPage: lastPage,
    });
  });
});
});


router.get('/roommate/:id', (req, res) => {
  const { id } = req.params;
  const { limit = 10, page = 1,  } = req.query;
  const offset = (page - 1) * limit;

  const count = `SELECT count(*) as count FROM roommate_post WHERE user_id = ${id}`;
  db.query(count, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
  const count = result[0].count;
  const totalPages = Math.ceil(count / limit);
  const lastPage = totalPages > 0 ? totalPages : 1;

  const sql = `SELECT * FROM roommate_post WHERE user_id = ${id} LIMIT ${limit} OFFSET ${offset}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    result.forEach(element => {
      element.image=element.image.split(',');
      });
    return res.status(200).send({
      data:result,
      lastPage: lastPage,
    });
  });
});
});











module.exports = router;
