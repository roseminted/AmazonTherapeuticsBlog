// require mongoose
const mongoose = require('mongoose');
// connect seedHelpers plantNames & descriptors
const { plantNames, descriptors } = require('./seedHelpers');
// insert BlogPost model
const BlogPost = require('../models/blogpost');

// configure mongoose
mongoose.connect('mongodb://localhost:27017/BlogApp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}) // database error handling
    .then(() => {
        console.log('Connected to DB!')
    })
    .catch(err => {
        console.log(err.message)
    });

// will save a random number under the sample variable to choose a title from the seedhelpers
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await BlogPost.deleteMany({})
    for (let i = 0; i < 25; i++) {
        const blogpost = new BlogPost({
            title: `${sample(plantNames)} ${sample(descriptors)}`,
            image: 'https://source.unsplash.com/collection/390111',
            postText: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.Ullam repudiandae quae recusandae sequi quia rem corporis quisquam, repellat alias fugiat veritatis consequuntur dolore tempore saepe quas accusantium tempora id natus.'
        })
        await blogpost.save();
    }
}

// close database connection
seedDB().then(() => {
    mongoose.connection.close();
});