const { HttpError } = require('../helpers');

const validateBody = (schema) => {
	const func = (req, res, next) => {
		try {
			const { error } = schema.validate(req.body);
			if (error) {
				throw HttpError(400, error.message);
			}
			next();
		} catch (err) {
			next(err);
		}
	};
	return func;
};

module.exports = validateBody;
