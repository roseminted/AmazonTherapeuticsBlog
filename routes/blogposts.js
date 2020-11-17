const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, validateBlogpost, isAuthor } = require('../middleware')
const BlogPost = require('../models/blogpost');

// index page
router.get('/', catchAsync(async (req, res) => {
    // find all blogposts and save to blogposts variable
    const blogposts = await BlogPost.find({});
    // pass blogposts variable of all blogposts to the index template and render template
    res.render('blogposts/index', { blogposts })
    // console.log(blogposts);
}));

// render create new post form
router.get('/new', isLoggedIn, (req, res) => {
    res.render('blogposts/new')
});

// create new blogpost logic
router.post('/', validateBlogpost, isLoggedIn, catchAsync(async (req, res, next) => {
    // if (!req.body.blogpost) throw new ExpressError('Invalid Blogpost Data', 400);
    // get info from form and save it to blogpost variable
    const blogpost = new BlogPost(req.body.blogpost);
    // save author to new blogpost
    blogpost.author = req.user._id;
    // save the info to the database
    await blogpost.save();
    // flash success message
    req.flash('success', 'Sucessfully created a new blogpost!');
    // redirect to the new blogposts show page
    res.redirect(`/blogposts/${blogpost._id}`)
}));

// render blogpost show page
router.get('/:id', catchAsync(async (req, res) => {
    // find blogpost by id and save to blogpost variable
    const blogpost = await BlogPost.findById(req.params.id).populate('author');
    // if error in finding blogpost, handle error and display message
    if (!blogpost) {
        req.flash('error', 'Cannot find that blogpost');
        return res.redirect('/blogposts')
    }
    // pass blogpost variable of the blogpost matching the ID to the show template and render template
    res.render('blogposts/show', { blogpost })
}));

// edit blogpost form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id);
    // if error in finding blogpost, handle error and display message
    if (!blogpost) {
        req.flash('error', 'Cannot find that blogpost');
        return res.redirect('/blogposts')
    }
    res.render('blogposts/edit', { blogpost });
}));

// edit blogpost logic
router.put('/:id', isLoggedIn, isAuthor, validateBlogpost, catchAsync(async (req, res) => {
    // get blogpost id object from req.params with de-structuring {}
    const { id } = req.params;
    // spread operator (...) to spread id object and req.body.blogpost object into the blogpost object
    const blogpost = await BlogPost.findByIdAndUpdate(id, { ...req.body.blogpost });
    // flash success message
    req.flash('success', 'Sucessfully updated your blogpost!');
    res.redirect(`/blogposts/${blogpost._id}`)
}));

// delete blogpost
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await BlogPost.findByIdAndDelete(id);
    // flash success message
    req.flash('success', 'Sucessfully deleted your blogpost!');
    res.redirect('/blogposts');
}));


module.exports = router;