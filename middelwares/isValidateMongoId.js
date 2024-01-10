const { isValidObjectId } = require('mongoose');
const { httpError } = require('../helpers');

const isValidateMongoId = (req, res, next) => {
	const { contactId } = req.params;
	if (!isValidObjectId(contactId)) {
		throw httpError(400, `${contactId} is not a valid Mongo ObjectId`);
	}
	next();
};

module.exports = isValidateMongoId;
