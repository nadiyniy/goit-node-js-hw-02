const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: [true, 'Set password for user'],
			minlength: 6,
		},
		email: {
			type: String,
			match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			required: [true, 'Email is required'],
			unique: true,
		},
		subscription: {
			type: String,
			enum: ['starter', 'pro', 'business'],
			default: 'starter',
		},
		token: {
			type: String,
			default: '',
		},
	},
	{ versionKey: false, timestamps: true }
);

userSchema.post('save', handleMongooseError);

const User = model('user', userSchema);

module.exports = User;
