const BlogPost = require('./models/blogpost');
const ExpressError = require('./utilities/ExpressError');
const { blogpostSchema } = require('./schemas.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please login. If you do not have an account, please sign up.');
        return res.redirect('/login')
    }
    next();
}

module.exports.validateBlogpost = (req, res, next) => {
    const { error } = blogpostSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const blogpost = await BlogPost.findById(id);
    if (!blogpost.author.equals(req.user._id)) {
        req.flash('error', 'You do not have persmission to do that');
        return res.redirect(`/blogposts/${id}`);
    }
    next();
}
