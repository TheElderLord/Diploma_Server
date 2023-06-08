
const express = require('express');
const router = express.Router();

const accomodationController = require('../controller/accomodationController');





//accomodation/favourites/add
router.post('/favourites/add', accomodationController.addFavourite);


//accomodation/favourites/:user_id
router.get('/favourites/:user_id', accomodationController.getFavourites)

//accomodation/favourites/delete
router.post('/favourites/delete', accomodationController.deleteFavourite)




// Get categories with subcategories
//accomodation/categories
router.get('/categories', accomodationController.getCategories);

//accomodation/posts
router.route('/posts').get (accomodationController.getPosts).
post(accomodationController.uploadImages, accomodationController.createPost);


//accomodation/posts/:id
router.route('/posts/:id' ).get(accomodationController.getPostById).
put(accomodationController.uploadImages, accomodationController.updatePost).
delete(accomodationController.deletePost);

router.get('/search', accomodationController.searchPosts);
router.get('/filter', accomodationController.filterPosts);















module.exports = router;