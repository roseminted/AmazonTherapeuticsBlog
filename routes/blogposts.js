const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
// require joi schemas for validations
const { blogpostSchema } = require('../schemas.js');
const ExpressError = require('../utilities/ExpressError');
const BlogPost = require('../models/blogpost');

// joi checking for correct inputs for server-side validations for blogposts
const validateBlogpost = (req, res, next) => {
    const { error } = blogpostSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// index page
router.get('/', catchAsync(async (req, res) => {
    // find all blogposts and save to blogposts variable
    const blogposts = await BlogPost.find({});
    // pass blogposts variable of all blogposts to the index template and render template
    res.render('blogposts/index', { blogposts })
    // console.log(blogposts);
}));

// render create new post form
router.get('/new', (req, res) => {
    res.render('blogposts/new')
});

// create new blogpost logic
router.post('/', validateBlogpost, catchAsync(async (req, res, next) => {
    // if (!req.body.blogpost) throw new ExpressError('Invalid Blogpost Data', 400);
    // get info from form and save it to blogpost variable
    const blogpost = new BlogPost(req.body.blogpost);
    // save the info to the database
    await blogpost.save();
    // redirect to the new blogposts show page
    res.redirect(`/blogposts/${blogpost._id}`)
}));

// render blogpost show page
router.get('/:id', catchAsync(async (req, res) => {
    // find blogpost by id and save to blogpost variable
    const blogpost = await BlogPost.findById(req.params.id)
    // pass blogpost variable of the blogpost matching the ID to the show template and render template
    res.render('blogposts/show', { blogpost })
}));

// edit blogpost form
router.get('/:id/edit', catchAsync(async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id)
    res.render('blogposts/edit', { blogpost });
}));

// edit blogpost logic
router.put('/:id', validateBlogpost, catchAsync(async (req, res) => {
    // get blogpost id object from req.params with de-structuring {}
    const { id } = req.params;
    // spread operator (...) to spread id object and req.body.blogpost object into the blogpost object
    const blogpost = await BlogPost.findByIdAndUpdate(id, { ...req.body.blogpost });
    res.redirect(`/blogposts/${blogpost._id}`)
}));

// delete blogpost
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await BlogPost.findByIdAndDelete(id);
    res.redirect('/blogposts');
}));


module.exports = router;