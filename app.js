if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
// help with path manipulation, comes with node.js
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session')
const flash = require('connect-flash');
// require my ExpressError handler
const ExpressError = require('./utilities/ExpressError');
// require methodoverride for PUT & DELETE requests
const methodOverride = require('method-override');
// require passport and passport-local strategy
const passport = require('passport');
const LocalStrategy = require('passport-local');
// insert User model
const User = require('./models/user');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
// require blogposts & user routes
const blogpostsRoutes = require('./routes/blogposts');
const usersRoutes = require('./routes/users');
const MongoDBStore = require('connect-mongo')(session);
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/BlogApp';
//APP CONFIG
// configure mongoose
mongoose.connect(dbUrl, {
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
app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisissecret';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("Session Store Error", e)
})

// configure session
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // this says that this cookie will only work over https
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));

// contentSecutiryPolicy from helmet
const scriptSrcUrls = [
    "https://kit.fontawesome.com/",
    "https://code.jquery.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://use.fontawesome.com/"
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://kit-free.fontawesome.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const fontSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://use.fontawesome.com/"
];
app.use(
    // configure helmet
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dbwrcpfja/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// configure passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// global middleware for every template
app.use((req, res, next) => {
    // print query string
    // console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/contact', (req, res) => {
    res.render('contact');
});


// blogposts route handler
app.use('/', usersRoutes);
app.use('/', blogpostsRoutes);


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