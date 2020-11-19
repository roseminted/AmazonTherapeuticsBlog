const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, validateBlogpost, isAuthor } = require('../middleware')
const blogposts = require('../controllers/blogposts');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(blogposts.index))
    .post(isLoggedIn, upload.array('image'), validateBlogpost, catchAsync(blogposts.createBlogpost));

router.get('/new', isLoggedIn, blogposts.renderNewForm);

router.route('/:id')
    .get(catchAsync(blogposts.showBlogpost))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateBlogpost, catchAsync(blogposts.editBlogpost))
    .delete(isLoggedIn, isAuthor, catchAsync(blogposts.deleteBlogpost));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(blogposts.renderEditForm));


module.exports = router;