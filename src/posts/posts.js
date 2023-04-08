const express = require('express');
const db = require('../db/db');
const router = express.Router();
const fs = require('fs');
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




router.post('/add_to_favorite', (req, res) => {
  const { user_id, post_id } = req.body;
  const sql = `INSERT INTO favourites (user_id, post_id) VALUES ('${user_id}', '${post_id}')`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    return res.status(201).send({ message: 'Post added to favorites' });
  });
});

router.get('/get_favorites', (req, res) => {
  const { user_id } = req.body;
  const sql = `SELECT p.* FROM accomodation_post p 
  JOIN favourites a ON p.id = a.post_id
  WHERE p.user_id = ${user_id}` ;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    return res.status(200).send(result);
  });
});

router.post('/delete_favourite', (req, res) => {
  const { user_id, post_id } = req.body;
  const sql = `DELETE FROM favourites WHERE user_id = '${user_id}' AND post_id = '${post_id}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    return res.status(200).send({ message: 'Post deleted from favorites' });
  });
});






// Get categories with subcategories
router.get('/categories', (req, res) => {
  const sql = `SELECT c.id AS category_id, c.name AS category_name, s.id AS subcategory_id, s.name AS subcategory_name
               FROM category c
               JOIN subcategory s ON c.id = s.category_id`;

     db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }

    // Group subcategories by category
    const categories = result.reduce((acc, curr) => {
      const { category_id, category_name, subcategory_id, subcategory_name } = curr;
      if (!acc[category_id]) {
        acc[category_id] = { id: category_id, name: category_name, subcategories: [] };
      }
      acc[category_id].subcategories.push({ id: subcategory_id, name: subcategory_name });
      return acc;
    }, {});

    // Convert object to array and send response
    const data = Object.values(categories);
    return res.status(200).send(data);
  });
});





router.get('/list', (req, res) => {
  const { limit = 10, page = 1, age, gender, price, location } = req.query; // Default limit is 10 and page is 1
  const offset = (page - 1) * limit;

  let sql = `SELECT COUNT(*) as count FROM accomodation_post`;
  if (age || gender || price || location) {
    sql += ` WHERE `;
  }
  if (age) {
    if (age == `Early 20s`)
      sql += `age between 20 and 24 `;
    else if (age == `Late 20s`)
      sql += `age   between 25 and 30 `;
    else if (age == `30s`)
      sql += `age between 30 and 39 `;
    else if (age == `40s`)
      sql += `age > 40 `;
  }
  if (gender) {
    if (age) {
      sql += ` AND `;
    }
    sql += `gender = ${gender} `;
  }
  if (price) {
    if (age || gender) {
      sql += ` AND `;
    }
    sql += ` price = ${price} `;
  }
  if (location) {
    if (age || gender || price) {
      sql += ` AND `;
    }
    sql += `location = ${location} `;
  }

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }

    const count = result[0].count;
    const totalPages = Math.ceil(count / limit);
    const lastPage = totalPages > 0 ? totalPages : 1;

    sql = `SELECT title,description,created_date,price,location,image FROM accomodation_post`;
    if (age || gender || price || location) {
      sql += ` WHERE `;
    }
    if (age) {
      if (age == `Early 20s`)
        sql += `age between 20 and 24 `;
      else if (age == `Late 20s`)
        sql += `age   between 25 and 30 `;
      else if (age == `30s`)
        sql += `age between 30 and 39 `;
      else if (age == `40s`)
        sql += `age > 40 `;
    }
    if (gender) {
      if (age) {
        sql += ` AND `;
      }
      sql += `gender = ${gender} `;
    }
    if (price) {
      if (age || gender) {
        sql += ` AND `;
      }
      sql += ` price = ${price} `;
    }
    if (location) {
      if (age || gender || price) {
        sql += ` AND `;
      }
      sql += `location = ${location} `;
    }
    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    db.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: err });
      }

      if (result.length === 0) {
        return res.status(404).send({ message: 'Post not found' });
      }


      return res.status(200).send({
        data: result.map(post => ({
	       id:post.id,
          title: post.title,
          description: post.description,
          created_date: post.created_date,
          price: post.price,
          location: post.location,
          image: post.image.split(','),
        })),
        lastPage,
      });
    });
  });
});

router.get('/get/:id', (req, res) => {
  console.log(req.params.id);
  const { id } = req.params;
  const sql = `SELECT * FROM accomodation_post WHERE id = ${id}`;
  db.query( sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
     result.forEach(element => {
      element.image=element.image.split(',');
     });
    return res.status(200).send(result);
  });
});





   
  
  
  router.post('/create', upload.array('myImages', 10), (req, res) => {
    const {author,title, desc,price, location, 
      user_id, subcategory_id,bedroom_nums,rental_period,
      in_property,comments,age,gender } = req.body;
      let image = null;
    if(Array.isArray(req.files)){
     image= req.files.map(file => file.originalname);
     image = image.join(',');
    }
     else
     image = "Not specified";
    //id, author, title, created_date, description, price, location, 
    //user_id, image, 
    //subcategory_id, bedroom_nums, rental_period, in_property, 
    //comments, age, gender
    if (!title || !desc ) {
      return res.status(400).send({ message: 'Title, description are required' });
    }
    const sql = `INSERT INTO accomodation_post (author,title,created_date,
       description,price,location,user_id,subcategory_id, image,
       bedroom_nums,rental_period,in_property,comments,age,gender) VALUES 
       (?, ?, ?,?,?,?, ?, ?,?,?,?, ?, ?,?,?)`;
    db.query(sql, [author,title,new Date(), desc,price,location,user_id,
      subcategory_id, image,bedroom_nums,rental_period,in_property,comments,age,gender], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: err });
      }
  
      // const post = { id: result.insertId, title, content, image };
      return res.status(201).send("Post created successfully");
    });
  });

  router.post('/delete',  (req, res) => {
    const {id } = req.body;
  

    const sql = `delete from accomodation_post where id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: err });
      }
  
      // const post = { id: result.insertId, title, content, image };
      return res.status(201).send("Post deleted successfully");
    });
  });
  
  
module.exports = router;
