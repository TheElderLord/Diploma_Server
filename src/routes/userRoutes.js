const express = require('express');

const router = express.Router();

const userController = require('../controller/userController');


// Login method
//users/login
//username, password = req.body
router.post('/login', userController.login);


// Logout method
//users/logout
router.post('/logout', userController.logout);


// Registration method
//users/register
//username, password, email = req.body
router.post('/register', userController.register);



// Reset password method
//users/reset-pass/:id
//id = req.params.id
// id - id of user
// old_pass,new_pass = req.body
router.put('/reset-pass/:id', userController.resetPassword);





// Delete user method
//users/user/:id - DELETE
//id - id of user
//id = req.params.id
router.route('user/:id').delete(
  userController.deleteUser
).


// Update user method
//users/user/:id - PUT
//id - id of user
//id = req.params.id
//firstname, lastname, username, email, image = req.body
put(
  userController.uploadImage,
  userController.updateUser
).


//users/user/:id - GET
//id - id of user
//id = req.params.id
get(
  userController.getUser
);




//form method
//users/form/:id
router.route('/form/:id').

//Create form method
//users/form/:id - POST
//id - id of user
//id = req.params.id

// additional, additional,fullname,age,gender,work,study,description,tags,phonenumber,
//whatsapp,telegram,instagram - req.body
post(userController.uploadImages, userController.createForm).

//Get form method
//users/form/:id - GET
//id - id of user
//id = req.params.id
get(userController.getForm).

//Update form method
//users/form/:id - PUT
//id - id of user
//id = req.params.id
//// additional, additional,fullname,age,gender,work,study,description,tags,phonenumber,
//whatsapp,telegram,instagram - req.body
put(userController.uploadImages, userController.updateForm).

//Delete form method
//users/form/:id - DELETE
//id - id of user
//id = req.params.id
delete(userController.deleteForm);





//Get all users method
//users/all
// const {limit = 10, page = 1,} = req.query;
router.get('/all',userController.getAllUsers);


//get accomodation posts of user
//users/accomodation/:id
//id = req.params.id
// const {limit = 10, page = 1,} = req.query;
router.get('/accomodation/:id', userController.getAccomodation);

//get accomodation posts of user
//users/roommate/:id
//id = req.params.id
// const {limit = 10, page = 1,} = req.query;
router.get('/roommate/:id', userController.getRoommate);









module.exports = router;