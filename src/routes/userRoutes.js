const express = require('express');

const router = express.Router();

const userController = require('../controller/userController');


// Login method
//users/login
router.post('/login', userController.login);


// Logout method
//users/logout
router.post('/logout', userController.logout);

// Registration method
//users/register
router.post('/register', userController.register);

// Reset password method
//users/reset-pass/:id
router.put('/reset-pass/:id', userController.resetPassword);


// Get all users method
//users/user/:id
router.route('user/:id').delete(
  userController.deleteUser
).put(
  userController.uploadImage,
  userController.updateUser
).get(
  userController.getUser
);
//id, firstname, lastname, username, email, password, image



//form method
//users/form/:id
router.route('/form/:id').
post(userController.uploadImages, userController.createForm).
get(userController.getForm).
put(userController.uploadImages, userController.updateForm).
delete(userController.deleteForm);






router.get('/all',userController.getAllUsers);

router.get('/accomodation/:id', userController.getAccomodation);


router.get('/roommate/:id', userController.getRoommate);









module.exports = router;