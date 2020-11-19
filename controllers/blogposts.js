const BlogPost = require('../models/blogpost');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    // find all blogposts and save to blogposts variable
    const blogposts = await BlogPost.find({});
    // pass blogposts variable of all blogposts to the index template and render template
    res.render('blogposts/index', { blogposts })
    // console.log(blogposts);
};

module.exports.renderNewForm = (req, res) => {
    res.render('blogposts/new')
}

module.exports.createBlogpost = async (req, res, next) => {
    // if (!req.body.blogpost) throw new ExpressError('Invalid Blogpost Data', 400);
    // get info from form and save it to blogpost variable
    const blogpost = new BlogPost(req.body.blogpost);
    // save author to new blogpost
    blogpost.author = req.user._id;
    // map over files array, pull out path and filename into an object and save to new array
    blogpost.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // save the info to the database
    await blogpost.save();
    // check if images were saved properly on the blogpost
    console.log(blogpost);
    // flash success message
    req.flash('success', 'Sucessfully created a new blogpost!');
    // redirect to the new blogposts show page
    res.redirect(`/blogposts/${blogpost._id}`)
}

module.exports.showBlogpost = async (req, res) => {
    // find blogpost by id and save to blogpost variable
    const blogpost = await BlogPost.findById(req.params.id).populate('author');
    // if error in finding blogpost, handle error and display message
    if (!blogpost) {
        req.flash('error', 'Cannot find that blogpost');
        return res.redirect('/blogposts')
    }
    // pass blogpost variable of the blogpost matching the ID to the show template and render template
    res.render('blogposts/show', { blogpost })
}

module.exports.renderEditForm = async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id);
    // if error in finding blogpost, handle error and display message
    if (!blogpost) {
        req.flash('error', 'Cannot find that blogpost');
        return res.redirect('/blogposts')
    }
    res.render('blogposts/edit', { blogpost });
}

module.exports.editBlogpost = async (req, res) => {
    // get blogpost id object from req.params with de-structuring {}
    const { id } = req.params;
    // check the data from the form
    // console.log(req.body);
    // spread operator (...) to spread id object and req.body.blogpost object into the blogpost object
    const blogpost = await BlogPost.findByIdAndUpdate(id, { ...req.body.blogpost });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    blogpost.images.push(...imgs);
    await blogpost.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await blogpost.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(blogpost);
    }
    // flash success message
    req.flash('success', 'Sucessfully updated your blogpost!');
    res.redirect(`/blogposts/${blogpost._id}`)
}

module.exports.deleteBlogpost = async (req, res) => {
    const { id } = req.params;
    await BlogPost.findByIdAndDelete(id);
    // flash success message
    req.flash('success', 'Sucessfully deleted your blogpost!');
    res.redirect('/blogposts');
}