const express = require('express');

const router = express.Router();

const roomateController = require('../controller/roommateController');

//add favourites - POST
//roommate/favourites/add
// user_id, post_id = req.body
router.post('/favourites/add', roomateController.addFavourite);


//get favourites - GET
//roommate/favourites/:user_id
//   user_id= req.params.user_id
router.get('/favourites/:user_id', roomateController.getFavourites)

//delete favourites - POST
//roommate/favourites/delete
//user_id, post_id = req.body
router.post('/favourites/delete', roomateController.deleteFavourite);


//get posts - GET
//roommate/posts

//create post - POST
//roommate/posts
router.route('/posts').get(roomateController.getPosts).
post(roomateController.uploadImages, roomateController.createPost);




// id, created_date, user_id, firstname, lastname, age, gender, about, work, 
//lifestyle, target_date, duration, max_price, location, layout', amentetiies
//update post - PUT
//roommate/posts/:id

//delete post - DELETE
//roommate/posts/:id

//get post by id - GET
//roommate/posts/:id
router.route('/posts/:id').get(roomateController.getPostById)
.put(roomateController.uploadImages, roomateController.updatePost) 
.delete(roomateController.deletePost);



module.exports = router;