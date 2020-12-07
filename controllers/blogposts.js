const BlogPost = require('../models/blogpost');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const blogposts = await BlogPost.find({});
    res.render('home', { blogposts })
};

module.exports.renderNewForm = (req, res) => {
    res.render('blogposts/new')
}

module.exports.createBlogpost = async (req, res, next) => {
    const blogpost = new BlogPost(req.body.blogpost);
    blogpost.author = req.user._id;
    blogpost.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await blogpost.save();
    req.flash('success', 'Sucessfully created a new blogpost!');
    res.redirect(`/${blogpost._id}`)
}

module.exports.showBlogpost = async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id).populate('author');
    if (!blogpost) {
        req.flash('error', 'Cannot find that blogpost');
        return res.redirect('/home')
    }
    res.render('blogposts/show', { blogpost })
}

module.exports.renderEditForm = async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id);
    if (!blogpost) {
        req.flash('error', 'Cannot find that blogpost');
        return res.redirect('/')
    }
    res.render('blogposts/edit', { blogpost });
}

module.exports.editBlogpost = async (req, res) => {
    const { id } = req.params;
    const blogpost = await BlogPost.findByIdAndUpdate(id, { ...req.body.blogpost });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    blogpost.images.push(...imgs);
    await blogpost.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await blogpost.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Sucessfully updated your blogpost!');
    res.redirect(`/${blogpost._id}`)
}

module.exports.deleteBlogpost = async (req, res) => {
    const { id } = req.params;
    await BlogPost.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted your blogpost!');
    res.redirect('/');
}