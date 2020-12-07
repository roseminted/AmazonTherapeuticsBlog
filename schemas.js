const Joi = require('joi');

module.exports.blogpostSchema = Joi.object({
    blogpost: Joi.object({
        title: Joi.string().required(),
        postText: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
})