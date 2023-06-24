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
    const sql = `INSERT INTO rommate_favourites (user_id, post_id) VALUES ('${user_id}', '${post_id}')`;
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
    } = req.params.user_id;
    const {
        limit = 10, page = 1
    } = req.query;
    const offset = (page - 1) * limit;
    const count = `SELECT count(p.id) as count FROM roommate_post p 
    JOIN rommate_favourites a ON p.id = a.post_id
    WHERE p.user_id = ${user_id}`;
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
        const sql = `SELECT p.* FROM roommate_post p 
      JOIN rommate_favourites a ON p.id = a.post_id
      WHERE p.user_id = ${user_id} LIMIT ${limit} OFFSET ${offset}`;
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
    const sql = `DELETE FROM rommate_favourites WHERE user_id = '${user_id}' AND post_id = '${post_id}'`;
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



exports.getPosts = asynchandler(async (req, res) => {
    const user_id = req.params.user_id;
    const {
        limit = 10, page = 1, age, gender, min_price, max_price, location
    } = req.query; // Default limit is 10 and page is 1
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
            return res.status(500).send({
                message: err
            });
        }

        const count = result[0].count;
        const totalPages = Math.ceil(count / limit);
        const lastPage = totalPages > 0 ? totalPages : 1;

        // sql = `SELECT * FROM roommate_post`;
        if (user_id)
            sql = `SELECT roommate_post.*, IF(rommate_favourites.post_id IS NULL, 0, 1) AS saved
        FROM roommate_post
        LEFT JOIN rommate_favourites ON 
        roommate_post.id = rommate_favourites.post_id AND 
        rommate_favourites.user_id = ${user_id}`;
        else
            sql = `SELECT * FROM roommate_post`;
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
                return res.status(500).send({
                    message: err
                });
            }

            if (result.length === 0) {
                return res.status(404).send({
                    message: 'Post not found'
                });
            }

            //id, created_date, user_id, firstname, lastname, age, gender, 
            //about, work, lifestyle,
            //target_date, duration, max_price, location, layout, amentetiies, image
            return res.status(200).send({
                data: result.map(post => ({
                    id: post.id,
                    created_date: post.created_date,
                    user_id: post.user_id,
                    firstname: post.firstname,
                    lastname: post.lastname,
                    age: post.age,
                    gender: post.gender,
                    about: post.about,
                    work: post.work,
                    lifestyle: post.lifestyle,
                    target_date: post.target_date,
                    duration: post.duration,
                    max_price: post.max_price,
                    location: post.location,
                    layout: post.layout,
                    amentetiies: post.amentetiies?.split(','),
                    image: post.image?.split(','),
                    saved: post.saved,

                })),
                lastPage,
            });
        });
    });
});

exports.getPostById = asynchandler(async (req, res) => {
    const {
        id
    } = req.params.id;
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


exports.updatePost = asynchandler(async (req, res) => {
    const id = req.params.id;
    const {
        firstname,
        lastname,
        age,
        gender,
        about,
        work,
        lifestyle,
        target_date,
        duration,
        max_price,
        location,
        layout,
        amenteties
    } = req.body;
    let image = null;
    if (Array.isArray(req.files)) {
        image = req.files.map(file => file.originalname);
        image = image.join(',');
    } else
        image = "Not specified";
    if (!location || !price) {
        return res.status(400).send({
            message: 'Fields are required'
        });
    }
    const sql = `Update  roommate_post set (created_date, firstname, lastname,
            age, gender, about, work, 
           lifestyle, target_date, duration, max_price, location, layout, 
           amentetiies,image) VALUES 
            (?, ?,? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) where id = ?`;
    db.query(sql, [new Date(), firstname, lastname, age, gender, about,
        work, lifestyle, target_date, duration, max_price, location,
        layout, amenteties, image, id
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
    const {
        id
    } = req.params;


    const sql = `delete from roomate_post where id = ?`;
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
    const {
        user_id,
        firstname,
        lastname,
        age,
        gender,
        about,
        work,
        lifestyle,
        target_date,
        duration,
        max_price,
        location,
        layout,
        amentetiies
    } = req.body;
    let image = null;
    if (Array.isArray(req.files)) {
        image = req.files.map(file => file.originalname);
        image = image.join(',');
    } else
        image = "Not specified";
    if (!location || !max_price) {
        return res.status(400).send({
            message: 'Fields are required'
        });
    }
    const sql = `INSERT INTO roommate_post (created_date, user_id, firstname, lastname,
           age, gender, about, work, 
          lifestyle, target_date, duration, max_price, location, layout, 
          amentetiies,image) VALUES 
           (?, ?,? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [new Date(), user_id, firstname, lastname, age, gender, about,
        work, lifestyle, target_date, duration, max_price, location,
        layout, amentetiies, image
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

//firstname,lastname,age,gender,about,work,lifestyle,target_date,duration,max_price,
//location,layout,amenteties
exports.searchPosts = asynchandler(async (req, res) => {
    const { pattern} = req.query;
    const sql =  `SELECT * FROM roommate_post WHERE firstname LIKE '%${pattern}%' OR lastname LIKE '%${pattern}%' 
    OR about LIKE '%${pattern}%' OR work LIKE '%${pattern}%' OR lifestyle LIKE '%${pattern}%' 
    OR location LIKE '%${pattern}%' OR layout LIKE '%${pattern}%' OR amentetiies LIKE '%${pattern}%'`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }
        return res.status(200).send(result);
    });
  });

  exports.filterPosts = asynchandler(async (req, res) => {
    const price = req.query.price;
    const sql = null;

    switch(price){
        case 1:
            sql = `SELECT * FROM roommate_post ORDER BY price ASC`;
            break;
        case 2:
            sql = `SELECT * FROM roommate_post ORDER BY price DESC`;
            break;
        default:
            sql = `SELECT * FROM roommate_post`;
    }

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }
        return res.status(200).send(result);
    }
    );
});