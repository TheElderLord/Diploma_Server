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


//delete post - DELETE
//roommate/posts/:id


router.route('/posts/:id').


//get post by id - GET
//roommate/posts/:id
// id = req.params.id
get(roomateController.getPostById)


//update post - PUT
//roommate/posts/:id
// id = req.params.id
//   firstname,lastname,age,gender,about,work,lifestyle,target_date,duration,max_price,
//location,layout,amenteties = req.body
.put(roomateController.uploadImages, roomateController.updatePost) 



//delete post - DELETE
//roommate/posts/:id
// id = req.params.id
.delete(roomateController.deletePost);


//search posts - GET
//roommate/search?pattern={String}
//pattern = req.query.pattern
router.get('search', roomateController.searchPosts);



//filter posts - GET
//roommate/filter?price=1 or 2 - GET
//price = req.query.price
router.get('/filter', roomateController.filterPosts);




module.exports = router;