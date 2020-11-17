const express = require('express');
const router = express.Router();
const passport = require('passport');
// require error catchAsync error handler
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');


router.get('/register', (req, res) => {
    res.render('users/register')
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to our team!');
            res.redirect('/blogposts');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back');
    const redirectUrl = req.session.returnTo || '/blogposts';
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged out');
    delete req.session.returnTo;
    res.redirect('/blogposts');
})

module.exports = router;