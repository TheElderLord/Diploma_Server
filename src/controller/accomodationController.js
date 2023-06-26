const db = require('../db/db');
const multer = require('multer');
const path = require('path');
const asynchandler = require('express-async-handler');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../images'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage
});

exports.uploadImage = (req, res, next) => {
    upload.single(process.env.SINGLE_UPLOAD)(req, res, (error) => {
        if (error) {
            // Handle the error
            console.error(error);
        }
        next(); // Call next() to proceed to the next middleware
    });
};

exports.uploadImages = (req, res, next) => {
    upload.array(process.env.MULTI_UPLOAD, 10)(req, res, (error) => {
        if (error) {
            // Handle the error
            console.error(error);
            // You can choose to return an error response or call `next(error)` to pass the error to the next middleware
        }
        next(); // Call next() to proceed to the next middleware
    });
};


exports.addFavourite = asynchandler(async (req, res) => {
    const {
        user_id,
        post_id
    } = req.body;
    const sql = `INSERT INTO accomodation_favourites (user_id, post_id) VALUES ('${user_id}', '${post_id}')`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }
        return res.status(201).send({
            message: 'Post added to favorites'
        });
    });
});

exports.getFavourites = asynchandler(async (req, res) => {
    const {
        user_id
    } = req.params;
    const {
        limit = 10, page = 1
    } = req.query;
    const offset = (page - 1) * limit;
    const count = `SELECT count(*) as count
    FROM accomodation_favourites AS af
    JOIN accomodation_post AS ap ON af.post_id = ap.id
    WHERE af.user_id = ${user_id};`;
    db.query(count, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }
        const count = result[0].count;
        const totalPages = Math.ceil(count / limit);
        const lastPage = totalPages > 0 ? totalPages : 1;


        const sql = `SELECT *
        FROM accomodation_favourites AS af
        JOIN accomodation_post AS ap ON af.post_id = ap.id
        WHERE af.user_id = ${user_id} LIMIT ${limit} OFFSET ${offset}`;
        db.query(sql, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    message: err
                });
            }
            return res.status(200).send({
                data: result,
                lastPage: lastPage,
            });
        });
    });

});

exports.deleteFavourite = asynchandler(async (req, res) => {
    const {
        user_id,
        post_id
    } = req.body;
    const sql = `DELETE FROM accomodation_favourites WHERE user_id = '${user_id}' AND post_id = '${post_id}'`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }
        return res.status(200).send({
            message: 'Post deleted from favorites'
        });
    });
});

exports.getCategories = asynchandler(async (req, res) => {
    const sql = `SELECT c.id AS category_id, c.name AS category_name, s.id AS subcategory_id, s.name AS subcategory_name
                 FROM category c
                 JOIN subcategory s ON c.id = s.category_id`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }

        // Group subcategories by category
        const categories = result.reduce((acc, curr) => {
            const {
                category_id,
                category_name,
                subcategory_id,
                subcategory_name
            } = curr;
            if (!acc[category_id]) {
                acc[category_id] = {
                    id: category_id,
                    name: category_name,
                    subcategories: []
                };
            }
            acc[category_id].subcategories.push({
                id: subcategory_id,
                name: subcategory_name
            });
            return acc;
        }, {});

        // Convert object to array and send response
        const data = Object.values(categories);
        return res.status(200).send(data);
    });
});

exports.getPosts = asynchandler(async (req, res) => {

    const {
        limit = 10, page = 1, age, gender,
            min_price, max_price, location,
            amenities, duration, layout, user_id,pattern,price
    } = req.query; // Default limit is 10 and page is 1
    const offset = (page - 1) * limit;

    let sql = `SELECT COUNT(*) as count FROM accomodation_post`;
    if (age || gender || min_price || max_price || location || amenities || duration || layout) {
        sql += ` WHERE `;

    }


    if (age) {

        if (age == 5)
            sql += `age <= 25 `;
        else if (age == 6)
            sql += `age   between 25 and 30 `;
        else if (age == 7)
            sql += `age between 30 and 39 `;
        else if (age == 8)
            sql += `age > 40 `;
    }
    if (gender) {
        if (age) {
            sql += ` AND `;
        }
        if (gender == 1) {
            sql += `gender = not binary`;
        } else if (gender == 2) {
            sql += `gender = male`;
        } else if (gender == 3) {
            sql += `gender = female`;
        }
    }

    if (min_price && max_price) {
        if (age || gender) {
            sql += ` AND `;
        }
        sql += ` price between ${min_price} and ${max_price} `;

    }
     else if (max_price) {
        if (age || gender ) {
            sql += ` AND `;
        }
        sql += ` price <= ${max_price} `;
    } else if (min_price) {
        if (age || gender) {
            sql += ` AND `;
        }
        sql += ` price >= ${min_price} `;
    }


    if (location) {
        if (age || gender || min_price || max_price) {
            sql += ` AND `;
        }
        sql += `location like '%${location}%' `;
    }
    if (amenities) {
        if (age || gender || min_price || max_price || location) {
            sql += ` AND `;
        }
        sql += `amenteties like '%${amenities}%' `;
    }
    if (duration) {
        if (age || gender || min_price || max_price || location || amenities) {
            sql += ` AND `;
        }
        if (duration == 1) {
            sql += `duration = flexible`;
        } else if (duration == 2) {
            sql += `duration = fixed`;
        } else if (duration == 3) {
            sql += `duration = year`;
        }
    }
    if (layout) {
        if (age || gender || min_price || max_price || location || amenities || duration) {
            sql += ` AND `;
        }
        if (layout == 1) {
            sql += `layout = entire place`;
        } else if (layout == 2) {
            sql += `layout = private room`;
        } else if (layout == 3) {
            sql += `layout = shared room`;
        }
    }
    if(pattern){
        if(age || gender || min_price || max_price || location || amenities || duration || layout){
            sql += ` AND `;
        }
        sql += ` street LIKE '%${pattern}%' OR duration  LIKE '%${pattern}%'
        OR amenteties LIKE '%${pattern}%' OR about_roommates LIKE '%${pattern}%' OR about_renters LIKE '%${pattern}%'`;
    }
    if(price){
        switch(price){
            case 1:
                sql+= ` ORDER BY price ASC`;
                break;
            case 2:
                sql += ` ORDER BY price DESC`;
                break;
           
        }
    
    }



    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }
        let sql = null;
        const count = result[0].count;
        const totalPages = Math.ceil(count / limit);
        const lastPage = totalPages > 0 ? totalPages : 1;
        if (user_id) {
            sql = `SELECT accomodation_post.*, IF(accomodation_favourites.post_id IS NULL, 0, 1) AS saved
        FROM accomodation_post
        LEFT JOIN accomodation_favourites ON 
        accomodation_post.id = accomodation_favourites.post_id AND 
        accomodation_favourites.user_id = ${user_id}`;
        } else
            sql = `SELECT * FROM accomodation_post`;

        if (age || gender || min_price || max_price || location || amenities || duration || layout) {
            sql += ` WHERE `;
        }
        if (age) {

            if (age == 5)
                sql += `age between 20 and 24 `;
            else if (age == 6)
                sql += `age   between 25 and 30 `;
            else if (age == 7)
                sql += `age between 30 and 39 `;
            else if (age == 8)
                sql += `age > 40 `;
        }
        if (gender) {
            if (age) {
                sql += ` AND `;
            }
            if (gender == 1) {
                sql += `gender = not binary`;
            } else if (gender == 2) {
                sql += `gender = male`;
            } else if (gender == 3) {
                sql += `gender = female`;
            }
        }
        
        if (min_price && max_price) {
            if (age || gender) {
                sql += ` AND `;
            }
            sql += ` price between ${min_price} and ${max_price} `;
    
        }
         else if (max_price) {
            if (age || gender ) {
                sql += ` AND `;
            }
            sql += ` price <= ${max_price} `;
        } else if (min_price) {
            if (age || gender) {
                sql += ` AND `;
            }
            sql += ` price >= ${min_price} `;
        }

        if (location) {
            if (age || gender || min_price || max_price) {
                sql += ` AND `;
            }
            sql += `location like '%${location}%' `;
        }
        if (amenities) {
            if (age || gender || min_price || max_price || location) {
                sql += ` AND `;
            }
            sql += `amenteties like '%${amenities}%' `;
        }
        if (duration) {
            if (age || gender || min_price || max_price || location || amenities) {
                sql += ` AND `;
            }
            if (duration == 9) {
                sql += `duration = flexible`;
            } else if (duration == 10) {
                sql += `duration = fixed`;
            } else if (duration == 11) {
                sql += `duration = year`;
            }
        }
        if (layout) {
            if (age || gender || min_price || max_price || location || amenities || duration) {
                sql += ` AND `;
            }
            if (layout == 1) {
                sql += `layout = entire place`;
            } else if (layout == 2) {
                sql += `layout = private room`;
            } else if (layout == 3) {
                sql += `layout = shared room`;
            }
        }
        if(pattern){
            if(age || gender || min_price || max_price || location || amenities || duration || layout){
                sql += ` AND `;
            }
            sql += ` street LIKE '%${pattern}%' OR duration  LIKE '%${pattern}%'
            OR amenteties LIKE '%${pattern}%' OR about_roommates LIKE '%${pattern}%' OR about_renters LIKE '%${pattern}%'`;
        }
        if(price){
            switch(price){
                case 1:
                    sql+= ` ORDER BY price ASC`;
                    break;
                case 2:
                    sql += ` ORDER BY price DESC`;
                    break;
            }
        
        }

        sql += ` LIMIT ${limit} OFFSET ${offset}`;

        db.query(sql, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    message: err
                });
            }

            if (result.length === 0) {
                return res.status(404).send({
                    message: 'Post not found'
                });
            }


            return res.status(200).send({
                data: result.map(post => ({
                    id: post.id,
                    location: post.location,
                    address: post.address,
                    amenteties: post.amenteties?.split(','),
                    duration: post.duration,
                    layout: post.layout,
                    created_date: post.created_date,
                    price: post.price,
                    image: post.image?.split(','),
                    saved: post.saved,
                    street: post.street,
                })),
                lastPage,
            });
        });
    });
});

exports.getPostById = asynchandler(async (req, res) => {

    const id= req.params.id;
    const sql = `SELECT * FROM accomodation_post WHERE id = ${id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }
        result.forEach(element => {
            element.image = element.image.split(',');
        });
        return res.status(200).send(result);
    });
});

exports.updatePost = asynchandler(async  (req, res) => {
    const id = req.params.id;
    let {
      location,
      street,
      duration,
      room_nums,
      amenteties,
      coordinates,
      about_roommates,
      about_renters,
      about_home,
      home
    } = req.body;
    let image = null;
    if (Array.isArray(req.files)) {
      image = req.files.map(file => file.originalname);
      image = image.join(',');
    } else
      image = "Not specified";

      if(Array.isArray(coordinates)){
        coordinates = coordinates.join(',');
      }
      if(Array.isArray(amenteties)){
        amenteties = amenteties.join(',');
    }
  
    const sql = `Update accomodation_post set location = ?,street = ?, duration = ?,room_nums = ?,
        amenteties = ?, coordinates = ?, about_roommates = ?,about_renters = ?,about_home = ?,created_date = ?,image = ?,home=? where id = ?`;
    db.query(sql, [
      location, street, duration, room_nums,
      amenteties, coordinates, about_roommates, about_renters,
      about_home, new Date(), image,home, id
    ], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          message: err
        });
      }
      return res.status(201).send("Post updated successfully");
    });
  });

exports.deletePost = asynchandler(async (req, res) => {
    const id = req.params.id;
  
  
    const sql = `delete from accomodation_post where id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          message: err
        });
      }
  
      // const post = { id: result.insertId, title, content, image };
      return res.status(201).send("Post deleted successfully");
    });
  });
  
exports.createPost = asynchandler(async (req, res) => {
    let {
      user_id,
      location,
      street,
      duration,
      room_nums,
      amenteties,
      coordinates,
      about_roommates,
      about_renters,
      about_home,
      home
    } = req.body;
    let image = null;
    if (Array.isArray(req.files)) {
      image = req.files.map(file => file.originalname);
      image = image.join(',');
    } else
      image = "Not specified";
  
      if(Array.isArray(coordinates)){
        coordinates = coordinates.join(',');
      }
      if(Array.isArray(amenteties)){
        amenteties = amenteties.join(',');
    }
  
  
    const sql = `INSERT INTO accomodation_post (user_id,location,street, duration,room_nums,
        amenteties, coordinates, about_roommates,about_renters,about_home,created_date,image,home) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    db.query(sql, [
      user_id, location, street, duration, room_nums,
      amenteties, coordinates, about_roommates, about_renters,
      about_home, new Date(), image, home
    ], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          message: err
        });
      }
  
      // const post = { id: result.insertId, title, content, image };
      return res.status(201).send("Post created successfully");
    });
  });



