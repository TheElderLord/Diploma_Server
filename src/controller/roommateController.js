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
    } = req.params;
    const {
        limit = 10, page = 1
    } = req.query;
    const offset = (page - 1) * limit;
    const count = `SELECT count(*) as count
    FROM rommate_favourites AS af
    JOIN roommate_post AS ap ON af.post_id = ap.id
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
        FROM rommate_favourites AS af
        JOIN roommate_post AS ap ON af.post_id = ap.id
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

    const {
        limit = 10, page = 1, posted_date,gender,
        age,max_sum,duration,lifestyle,location,user_id,pattern,price
    } = req.query; // Default limit is 10 and page is 1
    const offset = (page - 1) * limit;

    let sql = `SELECT COUNT(*) as count FROM roommate_post`;
    if (posted_date || gender || age || max_sum || duration || lifestyle || location) {
        sql += ` WHERE `;
    }
    if (posted_date) {
        sql += `created_date = ${posted_date} `;
    }
    if (gender) {
        if (posted_date) {
            sql += ` AND `;
        }
        //1 - male
        if(gender == 1){
            sql += ` gender = male `;
        }
        //2-female
        else if(gender == 2){
            sql+= ' gender = female ';
        }
        //3-prefer not to say
        else if(gender==3){
            sql+=` gender = prefer not to say `;
        }
       
    }

    if (age) {
       if  (posted_date || gender){
        sql += ` AND `;
       }
       
       //1-20-24
       if (age == 1)
            sql += `age <= 25 `;
            //2-25-30
        else if (age == 2)
            sql += `age   between 25 and 30 `;
            //3-30-39
        else if (age == 3)
            sql += `age between 30 and 39 `;
            //4-40+
        else if (age == 4)
            sql += `age > 40 `;
    }
    
    if (max_sum) {
        if(posted_date || gender || age){
            sql += ` AND `;
        }
        sql+= ` price <= ${max_sum} `;
    }
    if(duration){
        if(posted_date || gender || age || max_sum){
            sql += ` AND `;
        }
        if(duration == 1)
            sql+= ` duration = flexible `;
        else if(duration == 2)
            sql+= ` duration = fixed `;
        else if(duration == 3)
            sql+= ` duration = 12 months `;
    }
    if(lifestyle){
        if(posted_date || gender || age || max_sum || duration){
            sql += ` AND `;
        }
        sql+= ` lifestyle like '%${lifestyle}%' `;
    }

    if(location){
        if(posted_date || gender || age || max_sum || duration || lifestyle){
            sql += ` AND `;
        }
        sql+= ` location like '%${location}%' `;
    }
    if(pattern){
        if(posted_date || gender || age || max_sum || duration || lifestyle || location){
            sql += ` AND `;
        }
        sql+= ` firstname LIKE '%${pattern}%' OR lastname LIKE '%${pattern}%' 
        OR about LIKE '%${pattern}%' OR work LIKE '%${pattern}%' OR lifestyle LIKE '%${pattern}%' 
        OR location LIKE '%${pattern}%' OR layout LIKE '%${pattern}%' OR amentetiies LIKE '%${pattern}%' `;
    }
    if(price){
        switch(price){
            case 1:
                sql += ` ORDER BY price ASC`;
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

        const count = result[0].count;
        const totalPages = Math.ceil(count / limit);
        const lastPage = totalPages > 0 ? totalPages : 1;
        // console.log(user_id);
        // sql = `SELECT * FROM roommate_post`;
        if (user_id){
            sql = `SELECT roommate_post.*, IF(rommate_favourites.post_id IS NULL, 0, 1) AS saved
        FROM roommate_post
        LEFT JOIN rommate_favourites ON 
        roommate_post.id = rommate_favourites.post_id AND 
        rommate_favourites.user_id = ${user_id}`;
        }
        else{
            sql = `SELECT * FROM roommate_post`;
        }
            if (posted_date || gender || age || max_sum || duration || lifestyle || location) {
                sql += ` WHERE `;
            }
            if (posted_date) {
                sql += `created_date = ${posted_date} `;
            }
            if (gender) {
                if (posted_date) {
                    sql += ` AND `;
                }
                //1 - male
                if(gender == 1){
                    sql += ` gender = male `;
                }
                //2-female
                else if(gender == 2){
                    sql+= ' gender = female ';
                }
                //3-prefer not to say
                else if(gender==3){
                    sql+=` gender = prefer not to say `;
                }
               
            }
        
            if (age) {
               if  (posted_date || gender){
                sql += ` AND `;
               }
               //1-20-24
               if (age == 1)
                    sql += `age between 20 and 24 `;
                    //2-25-30
                else if (age == 2)
                    sql += `age   between 25 and 30 `;
                    //3-30-39
                else if (age == 3)
                    sql += `age between 30 and 39 `;
                    //4-40+
                else if (age == 4)
                    sql += `age > 40 `;
            }
            
            if (max_sum) {
                if(posted_date || gender || age){
                    sql += ` AND `;
                }
                sql+= ` price <= ${max_sum} `;
            }
            if(duration){
                if(posted_date || gender || age || max_sum){
                    sql += ` AND `;
                }
                if(duration == 1)
                    sql+= ` duration = flexible `;
                else if(duration == 2)
                    sql+= ` duration = fixed `;
                else if(duration == 3)
                    sql+= ` duration = 12 months `;
            }
            if(lifestyle){
                if(posted_date || gender || age || max_sum || duration){
                    sql += ` AND `;
                }
                sql+= ` lifestyle like '%${lifestyle}%' `;
            }
        
            if(location){
                if(posted_date || gender || age || max_sum || duration || lifestyle){
                    sql += ` AND `;
                }
                sql+= ` location like '%${location}%' `;
            }
            if(pattern){
                if(posted_date || gender || age || max_sum || duration || lifestyle || location){
                    sql += ` AND `;
                }
                sql+= ` firstname LIKE '%${pattern}%' OR lastname LIKE '%${pattern}%' 
                OR about LIKE '%${pattern}%' OR work LIKE '%${pattern}%' OR lifestyle LIKE '%${pattern}%' 
                OR location LIKE '%${pattern}%' OR layout LIKE '%${pattern}%' OR amentetiies LIKE '%${pattern}%' `;
            }
            if(price){
                switch(price){
                    case 1:
                        sql += ` ORDER BY price ASC`;
                        break;
                    case 2:
                        sql += ` ORDER BY price DESC`;
                        break;    
                }
            }


            sql += ` LIMIT ${limit} OFFSET ${offset};`;

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
    const id = req.params.id;
    const sql = `SELECT * FROM roommate_post WHERE id = ${id}`;
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
    if (!location || !max_price) {
        return res.status(400).send({
            message: 'Fields are required'
        });
    }
    const sql = `Update  roommate_post set created_date=?, firstname=?, lastname=?,
            age=?, gender=?, about=?, work=?, 
           lifestyle=?, target_date=?, duration=?, max_price=?, location=?, layout=?, 
           amentetiies=?,image=?  where id = ?`;
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
    const id= req.params.id;


    const sql = `delete from roommate_post where id = ?`;
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


