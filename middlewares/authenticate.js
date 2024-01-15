const jsonwebtoken = require('jsonwebtoken');
const { envsConfig } = require('../configs/');

const User = require('../models/user');

const { HttpError } = require('../helpers');

const authenticate = async (req, res, next) => {
	const { authorization = '' } = req.headers;
	const [bearer, token] = authorization.split(' ');

	if (bearer !== 'Bearer') {
		next(HttpError(401, 'unauthorized'));
	}
	try {
		const { id } = await jsonwebtoken.verify(token, envsConfig.jwtSecret);
		const user = await User.findById(id);
		if (!user || !user.token || user.token !== token) {
			next(HttpError(401, 'unauthorized'));
		}
		req.user = user;
	} catch {
		next(HttpError(401, 'unauthorized'));
	}
	next();
};

module.exports = authenticate;
