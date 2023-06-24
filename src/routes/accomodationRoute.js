
const express = require('express');
const router = express.Router();

const accomodationController = require('../controller/accomodationController');





//accomodation/favourites/add
// user_id, post_id = req.body
router.post('/favourites/add', accomodationController.addFavourite);


//accomodation/favourites/:user_id
//   user_id= req.params.user_id
router.get('/favourites/:user_id', accomodationController.getFavourites)

//accomodation/favourites/delete
//user_id, post_id = req.body
router.post('/favourites/delete', accomodationController.deleteFavourite)




// Get categories with subcategories
//accomodation/categories
router.get('/categories', accomodationController.getCategories);




router.route('/posts').


//Get all posts
//accomodation/posts?limit=10&page=1&age=20&gender=male&min_price=100
//&max_price=1000&location=Tole bi&amenities=wifi,TV,washing machine&duration=6 months&layout=1&user_id=1 - GET
//const {limit = 10, page = 1, age, gender,min_price, max_price, location,
// amenities, duration, layout, user_id
// } = req.query
get (accomodationController.getPosts).


//Create post
//accomodation/posts - POST
// const { title, description, price, location, amenities, duration, layout } = req.body - POST;
post(accomodationController.uploadImages, accomodationController.createPost);








router.route('/posts/:id' ).

//get post by id
//accomodation/posts/:id- GET;
//id of post
//const { id } = req.params 
get(accomodationController.getPostById).



//update post by id
//accomodation/posts/:id - PUT;
//id of post
//const id = req.params.id;
//const { title, description, price, location, amenities, duration, layout } = req.body - PUT;
put(accomodationController.uploadImages, accomodationController.updatePost).



//delete post by id
//accomodation/posts/:id - DELETE;
//id of post
//const { id } = req.params;
delete(accomodationController.deletePost);



//search posts
//accomodation/search?pattern={String} - GET
// const pattern = req.query.pattern;
router.get('/search', accomodationController.searchPosts);


//filter posts
//accomodation/filter?price=1 or 2 - GET
//const price = req.query.price;
router.get('/filter', accomodationController.filterPosts);















module.exports = router;