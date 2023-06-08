const express = require('express');

const router = express.Router();

const roomateController = require('../controller/roommateController');

router.post('/favourites/add', roomateController.addFavourite);

router.get('/favourites/:user_id', roomateController.getFavourites)

router.post('/favourites/delete', roomateController.deleteFavourite);


router.route('/posts').get(roomateController.getPosts).
post(roomateController.uploadImages, roomateController.createPost);




// id, created_date, user_id, firstname, lastname, age, gender, about, work, 
//lifestyle, target_date, duration, max_price, location, layout', amentetiies


router.route('/posts/:id').get(roomateController.getPostById)
.put(roomateController.uploadImages, roomateController.updatePost) 
.delete(roomateController.deletePost);



module.exports = router;