module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //save url user wants to go to in the sessio
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please login. If you do not have an account, please sign up.');
        return res.redirect('/login')
    }
    next();
}

