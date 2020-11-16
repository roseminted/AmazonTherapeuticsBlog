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
const { captureRejectionSymbol } = require('events');
const { networkInterfaces } = require('os');


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

// use express' built in bodyparser
app.use(express.urlencoded({ extended: true }));
// use methodOverride for PUT and DELETE requests
app.use(methodOverride('_method'));

const validateBlogpost = (req, res, next) => {
    const { error } = blogpostSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// change to landing page??
// app.get('/', (req, res) => {
//     res.render('landing');
// });

// index page
app.get('/blogposts', catchAsync(async (req, res) => {
    // find all blogposts and save to blogposts variable
    const blogposts = await BlogPost.find({});
    // pass blogposts variable of all blogposts to the index template and render template
    res.render('blogposts/index', { blogposts })
    // console.log(blogposts);
}));

app.get('/blogposts/aboutus', (req, res) => {
    res.render('aboutus');
});

app.get('/blogposts/contactus', (req, res) => {
    res.render('contactus');
});

// render create new post form
app.get('/blogposts/new', (req, res) => {
    res.render('blogposts/new')
});

app.post('/blogposts', validateBlogpost, catchAsync(async (req, res, next) => {
    // if (!req.body.blogpost) throw new ExpressError('Invalid Blogpost Data', 400);
    // get info from form and save it to blogpost variable
    const blogpost = new BlogPost(req.body.blogpost);
    // save the info to the database
    await blogpost.save();
    // redirect to the new blogposts show page
    res.redirect(`/blogposts/${blogpost._id}`)
}));

// render blogpost show page
app.get('/blogposts/:id', catchAsync(async (req, res) => {
    // find blogpost by id and save to blogpost variable
    const blogpost = await BlogPost.findById(req.params.id)
    // pass blogpost variable of the blogpost matching the ID to the show template and render template
    res.render('blogposts/show', { blogpost })
}));

app.get('/blogposts/:id/edit', catchAsync(async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id)
    res.render('blogposts/edit', { blogpost });
}));

app.put('/blogposts/:id', validateBlogpost, catchAsync(async (req, res) => {
    // get blogpost id object from req.params with de-structuring {}
    const { id } = req.params;
    // spread operator (...) to spread id object and req.body.blogpost object into the blogpost object
    const blogpost = await BlogPost.findByIdAndUpdate(id, { ...req.body.blogpost });
    res.redirect(`/blogposts/${blogpost._id}`)
}));

app.delete('/blogposts/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await BlogPost.findByIdAndDelete(id);
    res.redirect('/blogposts');
}));

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