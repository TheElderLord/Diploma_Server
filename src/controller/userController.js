const db = require('../db/db');
const asyncHandler = require("express-async-handler");
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

const upload = multer({
    storage
});

// exports.uploadImage = (idname,amount)=>{
//     if(amount >1){
//         return upload.array(idname, amount)
//     }
//     return upload.single(idname)
// }
exports.uploadImage = (req, res, next) => {
    upload.single(process.env.SINGLE_UPLOAD )(req, res, (error) => {
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



exports.login = asyncHandler(async (req, res) => {
    const {
        email,
        password
    } = req.body;
    const sql = `SELECT * FROM users WHERE email = '${email}'`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        } else if (result.length === 0) {
            return res.status(401).send({
                message: 'Invalid credentials'
            });
        } else if (result[0].password !== password) {
            return res.status(401).send({
                message: 'Incorrect password'
            });
        } else {
            const payload = {
                username: email
            };

            // Generate JWT token
            const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
                expiresIn: '1h'
            });


            console.log(result[0].id);
            // Send token as response
            res.status(200).json({
                token: token,
                id: result[0].id
            });
        }
    });
});
exports.logout = asyncHandler(async (req, res) => {
    return res.status(200).send({
        message: 'Logged out successfully'
    });
});
exports.register = asyncHandler(async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body;
    const sel = `SELECT * FROM users WHERE email = '${email}' `;

    const sql = `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}')`;
    db.query(sel, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }
        if (result.length > 0) {
            return res.status(409).send({
                message: 'User already exists'
            });
        } else {
            db.query(sql, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({
                        message: err
                    });
                }
                const payload = {
                    username: email
                };

                // Generate JWT token
                const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
                    expiresIn: '1h'
                });

                // Send token as response
                console.log(result.insertId);
                res.status(200).json({
                    token: token,
                    id: result.insertId
                })
            });
        }
    });
});

exports.resetPassword = asyncHandler(async (req, res) => {
    const {
        user_id
    } = req.params;
    const {
        old_pass,
        new_pass
    } = req.body;

    const sql = `UPDATE users SET password = '${new_pass}' WHERE id = '${user_id}' AND password = '${old_pass}'`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }
        if (result.affectedRows === 0) {
            return res.status(401).send({
                message: 'The old password inserted'
            });
        }
        return res.status(200).send({
            message: 'Password changed successfully'
        });
    });

});

exports.deleteUser = asyncHandler(async (req, res) => {
    const {
        user_id
    } = req.params;
    const sql = `DELETE FROM users WHERE id = '${user_id}'`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }

        return res.status(200).send({
            message: 'User deleted successfully'
        });
    });
});

exports.updateUser = asyncHandler(async (req, res) => {
    const user_id = req.params.id;
    const {
        firstname,
        lastname,
        username,
        email
    } = req.body;
    let image = null;
    if (req.file)
        image = req.file.originalname;
    else
        image = "Not specified";

    const sql = `UPDATE users SET username = '${username}',firstname= '${firstname}',
         email = '${email}',lastname = '${lastname}', 
         image = '${image}' WHERE id = '${user_id}'`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }
        return res.status(200).send({
            message: 'User updated successfully'
        });
    });
});

exports.getUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM users WHERE id = ${id}`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }

        if (result.length === 0) {
            return res.status(404).send({
                message: 'User not found'
            });
        }
        return res.status(200).send(result);

    });
});


exports.createForm = asyncHandler(async (req, res) => {
    const user_id = req.params.id;
    const {
        additional,
        fullname,
        age,
        gender,
        work,
        study,
        description,
        tags,
        phonenumber,
        whatsapp,
        telegram,
        instagram
    } = req.body;
    let image = null;
    if (Array.isArray(req.files)) {
        image = req.files.map(file => file.originalname);
        image = image.join(',');
    } else
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
        phonenumber, whatsapp, telegram, instagram, image
    ], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }

        // const post = { id: result.insertId, title, content, image };
        return res.status(201).send("Form created successfully");
    });
});

exports.updateForm = asyncHandler(async (req, res) => {
    const user_id = req.params.id;
    const {
        additional,
        fullname,
        age,
        gender,
        work,
        study,
        description,
        tags,
        phonenumber,
        whatsapp,
        telegram,
        instagram
    } = req.body;
    let image = null;
    if (Array.isArray(req.files)) {
        image = req.files.map(file => file.originalname);
        image = image.join(',');
    } else
        image = "Not specified";

    const sql = `Update form set ( additional, fullname, 
      age, gender, work, study, description, tags, 
      phonenumber, whatsapp,telegram,instagram,image) VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?) WHERE user_id = ?`;
    db.query(sql, [
        additional, fullname,
        age, gender, work, study, description, tags,
        phonenumber, whatsapp, telegram, instagram, image, user_id
    ], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }
        return res.status(201).send("Form updated successfully");
    });
});

exports.getForm = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM form WHERE user_id = ${id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }
        if (result.length === 0) {
            result.forEach(element => {
                element.image = element.image.split(',');
            });
            return res.status(404).send({
                message: 'Form not found'
            });
        }
        return res.status(200).send(result);
    });
});


exports.deleteForm = asyncHandler(async (req, res) => {
    const user_id = req.params.id;
    const sql = `DELETE FROM form WHERE user_id = '${user_id}'`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: err
            });
        }
        return res.status(200).send({
            message: 'Form deleted successfully'
        });
    });
});

exports.getAllUsers = asyncHandler(async (req, res) => {

    const {
        limit = 10, page = 1,
    } = req.query;
    const offset = (page - 1) * limit;
    const count = `SELECT count(*) as count FROM users`;
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
        const sql = `SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`;

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

exports.getAccomodation = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const {
        limit = 10, page = 1,
    } = req.query;
    const offset = (page - 1) * limit;

    const count = `SELECT count(*) as count FROM accomodation_post WHERE user_id = ${id}`;
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

        const sql = `SELECT * FROM accomodation_post WHERE user_id = ${id} LIMIT ${limit} OFFSET ${offset}`;
        db.query(sql, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    message: err
                });
            }
            result.forEach(element => {
                if (element.image !== null)
                    element.image = element.image.split(',');
            });
            return res.status(200).send({
                data: result,
                lastPage: lastPage,
            });
        });
    });
});

exports.getRoommate = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const {
        limit = 10, page = 1,
    } = req.query;
    const offset = (page - 1) * limit;

    const count = `SELECT count(*) as count FROM roommate_post WHERE user_id = ${id}`;
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

        const sql = `SELECT * FROM roommate_post WHERE user_id = ${id} LIMIT ${limit} OFFSET ${offset}`;
        db.query(sql, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    message: err
                });
            }
            result.forEach(element => {
                if (element.image !== null)
                    element.image = element.image.split(',');
            });
            return res.status(200).send({
                data: result,
                lastPage: lastPage,
            });
        });
    });
});