const { ctrlWrapper } = require('../decorators')
const User = require('../models/user')
const { HttpError } = require('../helpers')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const envsConfig = require('../configs/envsConfig')
const gravatar = require('gravatar')
const path = require('path')
const jimp = require('jimp')
// const uuid = require('uuid')
const sendEmail = require('../services/emailServices')
// const envsConfigs = require('../configs/envsConfig')

const register = async (req, res) => {
	const { email, password } = req.body
	const isExist = await User.findOne({ email })
	if (isExist) {
		throw HttpError(409, `Email in use`)
	}
	const avatarUrl = gravatar.url(email)
	const hashedPassword = await bcrypt.hash(password, 10)
	const verificationToken = 'qweasdqweasd'
	console.log(verificationToken, 1)

	const emailSettings = {
		to: email,
		subject: 'Verification',
		html: `<a href="${envsConfig.baseURL}/api/auth/verify/${verificationToken}" target="_blank">Click to verify</a>`,
	}

	await sendEmail(emailSettings)

	const { email: userEmail, name } = await User.create({
		...req.body,
		password: hashedPassword,
		avatarUrl,
		verificationToken,
	})
	res.status(201).json({ userEmail, name })
}

const login = async (req, res) => {
	const { email, password } = req.body
	const isExist = await User.findOne({ email })

	if (!isExist) {
		throw HttpError(401, `Email or password wrong`)
	}
	if (!isExist.isVerified) {
		throw HttpError(401, 'Email not verify')
	}
	const isPasswordSame = await bcrypt.compare(password, isExist.password)

	if (!isPasswordSame) {
		throw HttpError(401, `Email or password wrong`)
	}

	const token = await jsonwebtoken.sign({ id: isExist._id }, envsConfig.jwtSecret, { expiresIn: '23h' })
	await User.findByIdAndUpdate(isExist._id, { token })

	res.json({
		user: {
			email: isExist.email,
			name: isExist.name,
		},
		token,
	})
}

const current = async (req, res) => {
	const { email, name } = req.user

	res.json({ email, name })
}

const logout = async (req, res) => {
	const { _id } = req.user
	await User.findByIdAndUpdate(_id, { token: null })
	res.json({ message: 'Logout successful' })
}

const updateAvatar = async (req, res) => {
	const { _id } = req.user
	const oldPath = req.file.path
	const newPath = path.resolve('public/avatars', req.file.originalname)

	await jimp
		.read(oldPath)
		.then(image => {
			return image.resize(250, 250).write(newPath)
		})
		.catch(err => {
			HttpError(500, `Error avatar: ${err.message}`)
		})

	const avatarUrl = req.file.originalname
	await User.findByIdAndUpdate(_id, { avatarUrl }, { new: true })

	res.json({
		avatarUrl,
	})
}

const verify = async (req, res) => {
	const { verificationToken } = req.params
	const user = await User.findOne({ verificationToken })

	if (!user) {
		throw HttpError(401, 'Unauthorized')
	}

	await User.findByIdAndUpdate(user._id, {
		verificationToken: '',
		isVerified: true,
	})
	res.json({ message: 'Verification successful' })
}

const resend = async (req, res) => {
	const { email } = req.body
	const user = await User.findOne({ email })

	if (!user) {
		throw HttpError(401, 'User is not found')
	}

	if (user.isVerified) {
		throw HttpError(400, 'User has already verified')
	}

	const emailSettings = {
		to: email,
		subject: 'Verification',
		html: `<a href="${envsConfig.baseURL}/api/auth/verify/${user.verificationToken}" target="_blank">Click to verify</a>`,
	}

	await sendEmail(emailSettings)

	res.json({ message: 'Message sent' })
}

module.exports = {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	current: ctrlWrapper(current),
	logout: ctrlWrapper(logout),
	updateAvatar: ctrlWrapper(updateAvatar),
	verify: ctrlWrapper(verify),
	resend: ctrlWrapper(resend),
}
