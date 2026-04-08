import Joi from "joi";

export const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    country: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object({
      filename: Joi.string().allow("", null),
      url: Joi.string().allow("", null)
    }) 
  }).required()
});

export const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0).max(5),
    comment: Joi.string().required(),
  }).required()
})