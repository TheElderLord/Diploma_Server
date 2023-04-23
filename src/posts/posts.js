const express = require('express');
const db = require('../db/db');
const router = express.Router();
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





router.post('/accomodation/add_to_favourite', (req, res) => {
  const { user_id, post_id } = req.body;
  const sql = `INSERT INTO accomodation_favourites (user_id, post_id) VALUES ('${user_id}', '${post_id}')`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    return res.status(201).send({ message: 'Post added to favorites' });
  });
});

router.get('/accomodation/get_favourites/:id', (req, res) => {
  const { user_id } = req.params;
  const { limit = 10, page = 1}= req.query;
  const offset = (page - 1) * limit;
  const sql = `SELECT p.* FROM accomodation_post p 
  JOIN accomodation_favourites a ON p.id = a.post_id
  WHERE p.user_id = ${user_id} LIMIT ${limit} OFFSET ${offset}` ;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    return res.status(200).send(result);
  });
});

router.post('/accomodation/delete_favourite', (req, res) => {
  const { user_id, post_id } = req.body;
  const sql = `DELETE FROM accomodation_favourites WHERE user_id = '${user_id}' AND post_id = '${post_id}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    return res.status(200).send({ message: 'Post deleted from favorites' });
  });
});




router.post('/roommate/add_to_favourite', (req, res) => {
  const { user_id, post_id } = req.body;
  const sql = `INSERT INTO roommate_favourites (user_id, post_id) VALUES ('${user_id}', '${post_id}')`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    return res.status(201).send({ message: 'Post added to favorites' });
  });
});

router.get('/roommate/get_favourites/:id', (req, res) => {
  const { user_id } = req.params.id;
  const { limit = 10, page = 1}= req.query;
  const offset = (page - 1) * limit;
  const sql = `SELECT p.* FROM roommate_post p 
  JOIN roommate_favourites a ON p.id = a.post_id
  WHERE p.user_id = ${user_id} LIMIT ${limit} OFFSET ${offset}` ;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }
    return res.status(200).send(result);
  });
});

router.post('/roommate/delete_favourite', (req, res) => {
  const { user_id, post_id } = req.body;
  const sql = `DELETE FROM roommate_favourites WHERE user_id = '${user_id}' AND post_id = '${post_id}'`;
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


router.get('/accomodation/list', (req, res) => {
  const {user_id} = req.body;
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

    sql = `SELECT accomodation_post.*, IF(accomodation_favourites.post_id IS NULL, 0, 1) AS saved
    FROM accomodation_post
    LEFT JOIN accomodation_favourites ON 
    accomodation_post.id = accomodation_favourites.post_id AND 
    accomodation_favourites.user_id = ${user_id}`;
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
          location:post.location,
	address:post.address,
	square:post.square,
	bedroom:post.bedroom,
	gender:post.gender,
	age:post.age,
	layout:post.layout,
          created_date: post.created_date,
          price: post.price,
          image: post.image.split(','),
          saved:post.saved,
        })),
        lastPage,
      });
    });
  });
});



router.get('/accomodation/get/:id', (req, res) => {
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

  // id, user_id, location, created_date, coordinates, bedroom, bathroom, \
  //floor, square, layout, about_home, 
  //about_rommates, about_renters, price, image, rental_period, amenteties
  router.post('/accomodation/create', upload.array('myImages', 10), (req, res) => {
    const {user_id,location,address, coordinates,bedroom, bathroom, 
      floor, square,layout,about_home,about_rommates,about_renters,price,
      rental_period,amenteties,age,gender}= req.body;
      let image = null;
    if(Array.isArray(req.files)){
     image= req.files.map(file => file.originalname);
     image = image.join(',');
    }
     else
     image = "Not specified";
    //    if (!location || !price ) {
    //   return res.status(400).send({ message: 'Fields are required' });
    // }
    const sql = `INSERT INTO accomodation_post (user_id,location,address,created_date,
       coordinates,bedroom, bathroom, 
      floor, square,layout,about_home,about_rommates,about_renters,price,image,
      rental_period,amenteties,age,gender) VALUES 
       (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
    db.query(sql, [
      user_id,location,address, new Date(), coordinates,bedroom, bathroom,
      floor, square,layout,about_home,about_rommates,about_renters,price,
      image,rental_period,amenteties,age,gender
    ], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: err });
      }
  
      // const post = { id: result.insertId, title, content, image };
      return res.status(201).send("Post created successfully");
    });
  });

  router.post('/accomodation/update/:id', upload.array('myImages', 10), (req, res) => {
    const id = req.params.id;
    const {location,address, coordinates,bedroom, bathroom, 
      floor, square,layout,about_home,about_rommates,about_renters,price,
      rental_period,amenteties,age,gender}= req.body;
      let image = null;
    if(Array.isArray(req.files)){
      image= req.files.map(file => file.originalname);
      image = image.join(',');
      }
      else
      image = "Not specified";
        if (!location || !price ) {
        return res.status(400).send({ message: 'Fields are required' });
      }
      const sql = `Update accomodation_post set (user_id,location,address,created_date,
        coordinates,bedroom, bathroom, 
       floor, square,layout,about_home,about_rommates,about_renters,price,image,
       rental_period,amenteties,age,gender) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?) where id = ?`;
        db.query(sql, [location,address, new Date(), coordinates,bedroom, bathroom,
          floor, square,layout,about_home,about_rommates,about_renters,price,
          image, rental_period,amenteties,age,gender,id], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: err });
        }
        return res.status(201).send("Post updated successfully");
      });
    });

  router.post('/accomodation/delete/:id',  (req, res) => {
    const {id } = req.params.id;
  

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

 





  router.get('/roommate/list', (req, res) => {
    const {user_id} = req.body;
    const { limit = 10, page = 1, age, gender, price, location } = req.query; // Default limit is 10 and page is 1
    const offset = (page - 1) * limit;
  
    let sql = `SELECT COUNT(*) as count FROM roommate_post`;
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
      sql += ` max_price = ${price} `;
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
  
      // sql = `SELECT * FROM roommate_post`;
      sql = `SELECT roommate_post.*, IF(rommate_favourites.post_id IS NULL, 0, 1) AS saved
      FROM roommate_post
      LEFT JOIN rommate_favourites ON 
      roommate_post.id = rommate_favourites.post_id AND 
      rommate_favourites.user_id = ${user_id}`;
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
        sql += ` max_price = ${price} `;
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
  
  //id, created_date, user_id, firstname, lastname, age, gender, 
  //about, work, lifestyle,
   //target_date, duration, max_price, location, layout, amentetiies, image
        return res.status(200).send({
          data: result.map(post => ({
            id:post.id,
            created_date: post.created_date,
            user_id: post.user_id,
            firstname: post.firstname,
            lastname: post.lastname,
            age: post.age,
            gender: post.gender,
            about:post.about,
            work:post.work,
            lifestyle:post.lifestyle,
            target_date:post.target_date,
            duration:post.duration,
            max_price:post.max_price,
            location:post.location,
            layout:post.layout,
            amentetiies:post.amentetiies,
            image: post.image.split(','),
            saved: post.saved,
          
          })),
          lastPage,
        });
      });
    });
  });



  router.get('/roommate/get/:id', (req, res) => {
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
  
    
  // id, created_date, user_id, firstname, lastname, age, gender, about, work, 
  //lifestyle, target_date, duration, max_price, location, layout', amentetiies
    router.post('/roommate/create', upload.array('myImages', 10), (req, res) => {
      const {  user_id, firstname, lastname, age, gender, about, work, 
        lifestyle, target_date, duration, max_price, location, layout, amentetiies
        }= req.body;
        let image = null;
      if(Array.isArray(req.files)){
       image= req.files.map(file => file.originalname);
       image = image.join(',');
      }
       else
       image = "Not specified";
         if (!location || !max_price ) {
        return res.status(400).send({ message: 'Fields are required' });
      }
      const sql = `INSERT INTO roommate_post (created_date, user_id, firstname, lastname,
         age, gender, about, work, 
        lifestyle, target_date, duration, max_price, location, layout, 
        amentetiies,image) VALUES 
         (?, ?,? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      db.query(sql, [new Date(),user_id, firstname, lastname, age, gender, about, 
        work, lifestyle, target_date, duration, max_price, location, 
        layout, amentetiies,image
      ], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: err });
        }
    
        // const post = { id: result.insertId, title, content, image };
        return res.status(201).send("Post created successfully");
      });
    });
  
    router.post('/roommate/update/:id', upload.array('myImages', 10), (req, res) => {
      const id = req.params.id;
      const { firstname, lastname, age, gender, about, work, 
        lifestyle, target_date, duration, max_price, location, layout, 
        amentetiies}= req.body;
        let image = null;
      if(Array.isArray(req.files)){
        image= req.files.map(file => file.originalname);
        image = image.join(',');
        }
        else
        image = "Not specified";
          if (!location || !price ) {
          return res.status(400).send({ message: 'Fields are required' });
        }
        const sql = `Update  roommate_post set (created_date, firstname, lastname,
          age, gender, about, work, 
         lifestyle, target_date, duration, max_price, location, layout, 
         amentetiies,image) VALUES 
          (?, ?,? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) where id = ?`;
          db.query(sql, [new Date(), firstname, lastname, age, gender, about, 
            work, lifestyle, target_date, duration, max_price, location, 
            layout, amentetiies,image,id], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send({ message: err });
          }
          return res.status(201).send("Post updated successfully");
        });
      });
  
    router.post('/roomate/delete/:id',  (req, res) => {
      const {id } = req.params;
    
  
      const sql = `delete from roomate_post where id = ?`;
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
