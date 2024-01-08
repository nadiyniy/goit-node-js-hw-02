const Joi = require('joi');

const createContactsSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().required(),
	phone: Joi.string().required(),
});

const updateFavoriteSchema = Joi.object({
	favorite: Joi.boolean().required(),
});

module.exports = {
	createContactsSchema,
	updateFavoriteSchema,
};
