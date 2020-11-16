// require mongoose
const mongoose = require('mongoose');
// save mongoose.Schema to Schema
const Schema = mongoose.Schema;

// blog post model
const BlogPostSchema = new Schema({
    title: String,
    image: String,
    postText: String
});

//Export function to create "BlogPost" model class
module.exports = mongoose.model('BlogPost', BlogPostSchema);