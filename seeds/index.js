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
            author: '5fb34898a99b101aebb009d0',
            postText: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.Ullam repudiandae quae recusandae sequi quia rem corporis quisquam, repellat alias fugiat veritatis consequuntur dolore tempore saepe quas accusantium tempora id natus.',
            images: [
                {
                    url: 'https://res.cloudinary.com/dbwrcpfja/image/upload/v1605721952/AmazonTheraputicsBlog/akjgipg3bbibuwanzeiv.jpg',
                    filename: 'AmazonTheraputicsBlog/akjgipg3bbibuwanzeiv'
                },
                {
                    url: 'https://res.cloudinary.com/dbwrcpfja/image/upload/v1605721953/AmazonTheraputicsBlog/r2ck0irup63x0ii8jrif.jpg',
                    filename: 'AmazonTheraputicsBlog/r2ck0irup63x0ii8jrif'
                },
                {
                    url: 'https://res.cloudinary.com/dbwrcpfja/image/upload/v1605721953/AmazonTheraputicsBlog/iuyufxjm9kekupabszqd',
                    filename: 'AmazonTheraputicsBlog/iuyufxjm9kekupabszqd'
                }
            ]
        })
        await blogpost.save();
    }
}

// close database connection
seedDB().then(() => {
    mongoose.connection.close();
});