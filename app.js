// require express
const express = require('express');
// help with path manipulation, comes with node.js
const path = require('path');
// save express to app variable
const app = express();
// require mongoose
const mongoose = require('mongoose');
// require ejs-mate
const ejsMate = require('ejs-mate');
// require express session
const session = require('express-session')
// require joi schemas for validations
const { blogpostSchema } = require('./schemas.js');
// require my ExpressError handler
const ExpressError = require('./utilities/ExpressError');
// require error utilities
const catchAsync = require('./utilities/catchAsync');
// require methodoverride for PUT & DELETE requests
const methodOverride = require('method-override');
// insert BlogPost model
const BlogPost = require('./models/blogpost');
// require blogposts routes
const blogposts = require('./routes/blogposts');

//APP CONFIG
// configure mongoose
mongoose.connect('mongodb://localhost:27017/BlogApp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    // Make Mongoose use `findOneAndUpdate()`. Note that this option is `true` by default, you need to set it to false.
    useFindAndModify: false
}) // database error handling
    .then(() => {
        console.log('Connected to DB!')
    })
    .catch(err => {
        console.log(err.message)
    });

// use ejsMate (which is used to run, parse, and make sense of ejs)
app.engine('ejs', ejsMate);
// set to view ejs files without .ejs tag
app.set('view engine', 'ejs');
// to view views directory note: 2 underscores
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))
// use express' built in bodyparser
app.use(express.urlencoded({ extended: true }));
// use methodOverride for PUT and DELETE requests
app.use(methodOverride('_method'));

// configure session
const sessionConfig = {
    secret: 'thisissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessionConfig))

app.use('/blogposts', blogposts)

// change to landing page??
// app.get('/', (req, res) => {
//     res.render('landing');
// });

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

// Express error handler
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Note Found', 404))
});

// generic error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Service on port 3000');
});