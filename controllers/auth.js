const { ctrlWrapper } = require('../decorators');
const User = require('../models/user');
const { HttpError } = require('../helpers');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const envsConfig = require('../configs/envsConfig');

const register = async (req, res) => {
	const { email, password } = req.body;
	const isExist = await User.findOne({ email });
	if (isExist) {
		throw HttpError(409, `Email in use`);
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	const { email: userEmail, name } = await User.create({ ...req.body, password: hashedPassword });
	res.status(201).json({ userEmail, name });
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const isExist = await User.findOne({ email });

	if (!isExist) {
		throw HttpError(401, `Email or password wrong`);
	}
	const isPasswordSame = await bcrypt.compare(password, isExist.password);

	if (!isPasswordSame) {
		throw HttpError(401, `Email or password wrong`);
	}

	const token = await jsonwebtoken.sign({ id: isExist._id }, envsConfig.jwtSecret, { expiresIn: '23h' });
	await User.findByIdAndUpdate(isExist._id, { token });

	res.json({
		user: {
			email: isExist.email,
			name: isExist.name,
		},
		token,
	});
};

const current = async (req, res) => {
	const { email, name } = req.user;

	res.json({ email, name });
};

const logout = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: null });
	res.json({ message: 'Logout successful' });
};

module.exports = {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	current: ctrlWrapper(current),
	logout: ctrlWrapper(logout),
};
