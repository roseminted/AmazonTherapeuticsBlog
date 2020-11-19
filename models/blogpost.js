// require mongoose
const mongoose = require('mongoose');
// save mongoose.Schema to Schema
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

// blog post model
const BlogPostSchema = new Schema({
    title: String,
    images: [ImageSchema],
    postText: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

//Export function to create "BlogPost" model class
module.exports = mongoose.model('BlogPost', BlogPostSchema);